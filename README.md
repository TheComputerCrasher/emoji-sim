# Emoji Simulator (Advanced)!

Originally made by [Nicky Case](https://ncase.me/), and modified by TheComputerCrasher. 

**My additions:**
* More built-in simulations, including famous  [Langton's Ant](https://wikipedia.org/wiki/Langton%27s_ant) and (a very basic version of) [Sandboxels](https://sandboxels.r74n.com/)!
* More cell features, like being able to move to a specific direction instead of randomly!
* Fixes for some of the issues in [the original project](https://ncase.me/sim/)!
* Unused features reimplemented!
* Complete backwards compatibility with projects made in the original!
* More complicated and harder to understand!
* Wait, what was that last one?

Dedicated to the public domain with [Creative Commons Zero](https://creativecommons.org/publicdomain/zero/1.0/)! I'm giving away all my art/code/words, so that you teachers, scientists, hobbyists, activists, and emoji-lovers can use them however you like! This is for you. (The [original project](https://github.com/ncase/sim/) is public domain as well!)

This means you're completely free to do whatever you want with this project, even make money off of it if you find a way to do that. All I ask is that you be responsible and give credit where it's due.

## How To Run This On Your Own Computertron
Basically just download this Github repository, and host it on some local server. I use Python3's [http.server](https://docs.python.org/3/library/http.server.html) (just run `python3 -m http.server` in your terminal) on desktop and [Simple HTTP Server](https://play.google.com/store/apps/details?id=com.phlox.simpleserver) on mobile, but you can also use [MAMP](https://www.mamp.info/en/), NPM's [http-server](https://www.npmjs.com/package/http-server), or another one of your choice. (Emoji Simulator is really just a bunch of static files, but it needs to be on a server because of some weird browser security issues with XMLHttpRequests.)

### Saving your own sims locally:
1. Get it running on your own computertron (see above). For the sake of this example, let's assume it's running on `http://localhost:8080/` (which it will by default for most local server applications).
2. Go to `http://localhost:8080/` in your browser, and make your own sim!
3. Click "export model". Your simulation's data should be downloaded as a .json file.
4. Save it locally to `[your local folder]/models`, as `your_sim_name.json`. (Make sure the name only has letters, numbers, underscores, and/or dashes.)
5. Finally, to see your own sim in action, go to `http://localhost:8080/?s=your_sim_name`, and voilà! You can keep editing and exporting from there, just copy-paste the new data to `your_sim_name.json`.

## Other People's Stuff This Uses

They're all open source! Unlike this project though, they're not public domain, so be sure to follow their licenses' rules. They can be found in [/scripts/libraries](https://github.com/TheComputerCrasher/emoji-sim-advanced/tree/gh-pages/scripts/libraries), and at the following links:

**Code Stuff:**
* [MinPubSub](https://github.com/daniellmb/MinPubSub) - A tiny publish/subscribe library.
* [Perfect Scrollbar](https://github.com/noraesae/perfect-scrollbar-bower) - Custom scrollbars, mostly because of a MacOS issue.
* [requestAnimationFrame shim](https://gist.github.com/paulirish/1579671) - A requestAnimationFrame polyfill.
* [reqwest](https://github.com/ded/reqwest) - A tiny XMLHttpRequest library.
* [Platform.js](https://github.com/bestiejs/platform.js) - To test browser/OS, because there is apparently no good emoji feature detection.
* [alife](https://github.com/Lehnart/alife) - Helped me understand some poorly-documented cellular automata.

**Font Stuff:**
* [Sniglet](https://www.https://github.com/Lehnart/alifetheleagueofmoveabletype.com/sniglet) - For the title splash.
* [OpenSansEmoji](https://github.com/MorbZ/OpenSansEmoji) - Fallback font if your browser doesn't support emoji.
* (Note: I'm pretty sure these are not present in the full version of Emoji Simulator, but code still exists to use them so I'll keep them credited.)

## Ambitious To-Do List
* GET THE STUPID LOAD MODEL BUTTON WORKING
* Let the user optionally save the world state by exporting Grid.array along with the usual Model.data in Editor.js and Save.js
  * Try to optimize this by making the most common cell the default and only saving non-default cells
* Add boolean operators (probably just OR for now) - [ncase/sim/issues/2](https://github.com/ncase/sim/issues/2) - "if exactly x neighbors are this OR that", "move left OR right", "move to this OR that", etc.
  * I guess I would have to add an "or..." button to these actions, which is kinda outside my capabilities at the moment.
* Maybe show a graph of cell type count over time, or at least the number of each cell type
* Maybe let cells have a single variable each, and/or let each type of cell have a single variable each. Some kind of variable besides the cell state so you don't have to remake tons of lines to clone a complicated cell's functionality.
