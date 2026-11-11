# Twinleaf Town

A browser rebuild of Twinleaf Town from Pokémon Diamond and Pearl, where Fable 5.1 runs the town and orchestrates Codex sessions.

![A walk through the town: Buneary shows the session list, then a resident refuses a correction](docs/demo.gif)

[Watch the demo as MP4](docs/demo.mp4)

## Play

1. Clone this repository.
2. Open `game/index.html` in Chrome.

There is no build step and no dependency.

To serve it over HTTP instead, run `python3 serve.py` and open the address it prints. Do not use `python3 -m http.server`: the page asks for more than 100 scripts at once, that server drops some, and startup stops with "Startup blocked".

## Controls

| Key | Action |
| --- | --- |
| Arrows or WASD | Move |
| E, Z or Enter | Talk, continue, choose |
| X | Open or close the session list |
| B | Go back |
| Esc | Close a dialogue |

Hold E to make text print faster.

## What you can do

- **Check your sessions.** Buneary is Fable 5.1, the orchestrator. Talk to it and choose "Check my sessions", or press X. The lower screen lists the Codex sessions it runs, each with a one-line update.
- **Meet the sessions.** Pikachu, Psyduck and Pachirisu walk between the houses. Each one is a Codex session and tells you what it is doing.
- **Correct a resident.** Eight people live in the town and its houses. Each one tells you its current task. Your correction types itself on the lower screen. The resident does not take it well.

Every line is hardcoded. The game calls no model and sends nothing out of the browser.

## Change the lines

| What | Where |
| --- | --- |
| Helper names, roles and greetings | `houses` in `game/world.js` |
| The session list | `sessions` in `game/world.js` |
| What you type to each resident | `playerLines` in `game/world.js` |
| Resident lines | `messages[].tokens` in `game/dialogue-data.js` |

Resident lines use the game font and the original text box. A line holds 216 pixels, which is about 36 characters. A page holds two lines. The first page is the task and the second page is the answer. Use `’` for an apostrophe, because the font has no straight quote.

## How it works

The game is plain JavaScript on one canvas. The canvas is 512 by 768 pixels and shows two stacked screens.

- `game/game.js` runs the loop, input, dialogue and the session list.
- `game/source-cpu-renderer.js` draws the town in software from the map data in `game/source-data.js`.
- `game/world.js` holds the helpers, the session list and the typed lines.
- `game/original-dialogue.js` prints resident text one glyph at a time.

Art, fonts and sound data are embedded in the script files, so the folder works offline. The recording of the town theme is not included, so the music track is silent.

## Status

This is an unfinished fan project. The page itself says "fidelity incomplete". It covers the town and the inside of its houses. It is checked in Chromium only, and this repository has no automated tests.

## Credits

Pokémon, Twinleaf Town, and the game's art, maps, music and text belong to Nintendo, Game Freak and Creatures. This project is not affiliated with them or endorsed by them. It includes no ROM. No license is granted for the game's material.
