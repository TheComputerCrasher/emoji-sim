# A Python script to convert von Neumann neighborhood cellular automata
# into a format readable by Emoji Simulator Advanced:
# https://thecomputercrasher.github.io/emoji-sim-advanced/
# ...Unfortunately people seemingly only care about 
# Conway's Game of Life and nothing else, so there aren't really many
# interesting patterns to try.


import json
import re
import sys


"""Manual setup starts here"""

# Paste your cellular automata rules here: 6-digit numbers separated by spaces or new lines
# following the CNESWC' format (start, north, east, south, west, final).
# The rules don't have to be in order, they're automatically sorted.
# The default ruleset is Chou-Reggia Loop 2, taken from LifeWiki:
# https://conwaylife.com/w/index.php?title=Rule:Chou-Reggia-2&action=raw
data = '''
000000
000440
000547
000100
000110
000330
004040
004445
004100
001040
001010
001740
003000
003010
003030
007040
007030
007104
007110
040000
040070
047100
050007
017000
070000
070077
071010
400101
400313
401033
407103
411033
431033
500033
503330
100045
100011
100414
101044
101301
103011
107131
140414
141044
111044
133011
177711
304011
305011
305141
307141
344011
345011
354010
314001
377711
700000
700337
707100
707141
707110
717000
730007
770070
770711
'''

# Change and add whatever emojis you want, but make sure you use enough
# for the specific cellular automaton you're adding the rules for.
emojis = [
    "⬛",
    "🟦",
    "🟥",
    "🟩",
    "🟨",
    "🟪",
    "⬜",
    "🟧"
]

# True if rotationally symmetrical, False if not.
rotate = True 

"""Manual setup ends here"""


if rotate == True:
    rotation_list = [
        ("1", "4", "2", "3"),
        ("3", "1", "4", "2"),
        ("2", "3", "1", "4"),
        ("4", "2", "3", "1"),
    ]

else:
    rotation_list = [("1","4","2","3")]


def is_directional_rule(rule):
    # Return True when all 4 neighbors are different.
    # Uses a chained comparison that expands to:
    # rule[1] != rule[2] and rule[2] != rule[3] and rule[3] != rule[4] and rule[1] != rule[4].
    return rule[1] != rule[2] != rule[3] != rule[4]


def is_three_same_rule(rule):
    # Return True when exactly 3 of 4 neighbors are the same.
    return (
        rule[1] == rule[2] == rule[3] != rule[4]
        or rule[2] == rule[3] == rule[4] != rule[1]
        or rule[1] == rule[3] == rule[4] != rule[2]
        or rule[1] == rule[2] == rule[4] != rule[3]
    )
    
def is_four_same_rule(rule):
    # Return True when all 4 neighbors are the same.
    return (
        rule[1] == rule[2] == rule[3] == rule[4]
    )


def make_rule_action(rule, area_order):
    # Convert a 6-digit cellular automata rule into an Emoji Sim action.
    # area_order is listed from innermost to outermost to match the visible
    # order in generated JSON: 1-4-2-3, then its rotations.
    return {
        "sign": "=",
        "num": 1,
        "stateID": int(rule[1]),
        "actions": [
            {
                "sign": "=",
                "num": 1,
                "stateID": int(rule[2]),
                "actions": [
                    {
                        "sign": "=",
                        "num": 1,
                        "stateID": int(rule[3]),
                        "actions": [
                            {
                                "sign": "=",
                                "num": 1,
                                "stateID": int(rule[4]),
                                "actions": [
                                    {
                                        "stateID": int(rule[5]),
                                        "type": "go_to_state",
                                    }
                                ],
                                "area": area_order[0], # up
                                "type": "if_neighbor",
                            }
                        ],
                        "area": area_order[1], # right
                        "type": "if_neighbor",
                    }
                ],
                "area": area_order[2], # down
                "type": "if_neighbor",
            }
        ],
        "area": area_order[3], # left
        "type": "if_neighbor",
    }


def make_three_same_action(rule):
    # Optimize the Emoji Sim ruleset by doing a single directionless comparison
    # instead of 4 directional comparisons when 3/4 neighbors are the same.
    middle_states = rule[1:5]
    repeated_state = max(set(middle_states), key=middle_states.count)
    remaining_state = next(state for state in middle_states if state != repeated_state)

    return {
        "sign": "=",
        "num": 3,
        "stateID": int(repeated_state),
        "actions": [
            {
                "sign": "=",
                "num": 1,
                "stateID": int(remaining_state),
                "actions": [
                    {
                        "stateID": int(rule[5]),
                        "type": "go_to_state",
                    }
                ],
                "area": 0,
                "type": "if_neighbor",
            }
        ],
        "area": 0,
        "type": "if_neighbor",
    }

def make_four_same_action(rule):
    # If all 4 neighbors are the same in the original rule,
    # just do a simple "if all 4 neighbors are x" check.
    middle_states = rule[1]
    
    return {
        "sign": "=",
        "num": 4,
        "stateID": int(middle_states),
        "actions": [
            {
                "stateID": int(rule[5]),
                "type": "go_to_state",
            }
        ],
        "area": 0,
        "type": "if_neighbor",
    }



def make_actions_for_rule(rule):
    # For each rule, decide how to make it in Emoji Sim.
    if is_three_same_rule(rule):
        return [make_three_same_action(rule)]
    elif is_four_same_rule(rule):
        return [make_four_same_action(rule)]
    else:
        return [make_rule_action(rule, rotation) for rotation in rotation_list]


def build_model(rules):
    # Build the Emoji Sim model.
    states = []

    for state_id in range(8):
        state_rules = [rule for rule in rules if int(rule[0]) == state_id]
        actions = [
            action
            for rule in state_rules
            for action in make_actions_for_rule(rule)
        ]
        states.append(
            {
                "id": state_id,
                "icon": ""+emojis[state_id]+"",
                "name": "state "+str(state_id),
                "actions": actions,
                "description": "",
            }
        )

    return {
        "meta": {
            "description": "",
            "draw": 0,
            "fps": 30,
            "play": True,
        },
        "states": states,
        "world": {
            "update": "simultaneous",
            "neighborhood": "neumann",
            "proportions": [
                {"stateID": 0, "parts": 100},
                {"stateID": 1, "parts": 0},
                {"stateID": 2, "parts": 0},
                {"stateID": 3, "parts": 0},
                {"stateID": 4, "parts": 0},
                {"stateID": 5, "parts": 0},
                {"stateID": 6, "parts": 0},
                {"stateID": 7, "parts": 0},
            ],
            "size": {
                "width": 40,
                "height": 33,
            },
        },
    }


def main():
    # Extract all 6-digit numbers, discard pointless rules, and sort the rest.
    # If there are any valid rules left, run the build_model function on them.
    numbers = sorted(n for n in re.findall(r"\b\d{6}\b", data) if n[0] != n[-1])
    if numbers == []:
        print("ERROR: No valid rules found!\nBe sure to use cellular automata rules that use the von Neumann neighborhood (4 neighbors)\nand the CNESWC' format (start, north, east, south, west, final).")
    else:
        json.dump(build_model(numbers), sys.stdout, ensure_ascii=False, indent=4)
        print()


if __name__ == "__main__":
    main()
