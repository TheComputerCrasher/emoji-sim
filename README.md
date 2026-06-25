# Emoji Simulator (Advanced)!

Originally made by [Nicky Case](https://ncase.me/), and modified by TheComputerCrasher. 

**My additions:**
* More built-in simulations, including [Langton's Ant](https://wikipedia.org/wiki/Langton%27s_ant) and (a very basic version of) [Sandboxels](https://sandboxels.r74n.com/)!
* More actions and detections, like moving to a specific direction!
* Backwards compatibility with simulations from the original!
* More complicated and harder to understand!
* Wait, what was that last one?

Dedicated to the public domain with [Creative Commons Zero](https://creativecommons.org/publicdomain/zero/1.0/)! I'm giving away all my art/code/words, so that you teachers, scientists, hobbyists, activists, and emoji-lovers can use them however you like! This is for you. (The [original project](https://github.com/ncase/sim/) is public domain as well!)

## How To Run This On Your Own Computertron

Basically just download this Github repository, and host it on some local server. I use Python3's [http.server](https://docs.python.org/3/library/http.server.html) (just run `python3 -m http.server` in your terminal) on desktop and [Simple HTTP Server](https://play.google.com/store/apps/details?id=com.phlox.simpleserver) on mobile, but you can also use [MAMP](https://www.mamp.info/en/), NPM's [http-server](https://www.npmjs.com/package/http-server), or another one of your choice. (This is really just a bunch of static files, but it needs to be on a server because of some weird browser security issues with XMLHttpRequests.)

### Saving your own sims locally:

1. Get it running on your own computertron (see above). For the sake of this example, let's assume it's running on `http://localhost:8080/` (which it will by default for most servers).
2. Go to `http://localhost:8080/`, and make your own sim!
3. Click "export model". Your simulation's data should pop up in a new tab.
4. Save it locally to `[your local folder]/models`, as `your_sim_name.json`. (NOTE: the ".json" extension is important, but the actual name is not. Just make sure it only has letters, numbers, underscores, and/or dashes.)
5. Finally, to see your own sim in action, go to `http://localhost:8080/?s=your_sim_name`! Voilà! And you can keep editing and exporting from there, just copy-paste the new data to `your_sim_name.json`.

## Other People's Stuff This Uses

They're all open source! Unlike this project though, they're not public domain, so be sure to follow their licenses' rules. They can be found in [/scripts/libraries](https://github.com/TheComputerCrasher/emoji-sim-advanced/tree/gh-pages/scripts/libraries), and at the following links:

**Code Stuff:**

* [MinPubSub](https://github.com/daniellmb/MinPubSub) - A tiny publish/subscribe library.
* [Perfect Scrollbar](https://github.com/noraesae/perfect-scrollbar-bower) - Custom scrollbars, mostly because of a MacOS issue.
* [requestAnimationFrame shim](https://gist.github.com/paulirish/1579671) - A requestAnimationFrame polyfill.
* [reqwest](https://github.com/ded/reqwest) - A tiny XMLHttpRequest library.
* [Platform.js](https://github.com/bestiejs/platform.js) - To test browser/OS, because there is apparently no good emoji feature detection.

**Font Stuff:**

* [Sniglet](https://www.theleagueofmoveabletype.com/sniglet) - For the title splash.
* [OpenSansEmoji](https://github.com/MorbZ/OpenSansEmoji) - Fallback font if your browser doesn't support emoji.
