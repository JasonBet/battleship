# Battleship

[![Tests](https://github.com/JasonBet/battleship/actions/workflows/test.yml/badge.svg)](https://github.com/JasonBet/battleship/actions/workflows/test.yml)

A browser Battleship game against a computer opponent, written in plain JavaScript.

**[Play the live demo](https://jasonbet.github.io/battleship/)**

## Features

- Place your fleet by hand (with rotation) or randomize it
- Placement is checked against board edges and overlapping ships
- Computer opponent that hunts for ships, then targets around its hits
- Hit, miss, and sunk feedback on both boards, with a new-game reset

## How it is built

The game rules know nothing about the page.

| Module | Responsibility |
|---|---|
| `Ship.js` | Tracks hits and whether the ship is sunk |
| `Gameboard.js` | Places ships, validates placement, receives attacks |
| `Player.js` | Human and computer players; the computer AI lives here |
| `GameController.js` | Turn order and game phases; extends `EventTarget` and emits `update` and `gameover` events |
| `index.js` | Builds the DOM and redraws when the controller emits an event |

Because the controller only emits events, the rules run and test in Node without a browser.

## Computer AI

The computer plays in two modes:

- **Hunt:** with no known hits, it fires at a random untried square on a checkerboard pattern. Every ship is at least two squares long, so no ship can hide between those squares.
- **Target:** after a hit, it fires at squares next to its hits. Once two hits line up, it follows that line first. It stays in this mode until the ship sinks, even after a miss.

Measured over 20,000 simulated games per strategy with `npm run benchmark`, counting shots needed to sink the standard fleet (5, 4, 3, 3, 2) on a 10×10 board:

| Strategy | Average shots | Median |
|---|---|---|
| Random targeting | 95.4 | 97 |
| Earlier AI (one adjacent shot after a hit) | 89.4 | 92 |
| Current AI (hunt and target) | 53.2 | 54 |

## Tests

31 Jest tests cover the ship, board, player, AI, and controller modules, at 98% statement coverage of the game logic. The DOM layer in `index.js` is not unit tested.

```bash
npm test               # run the tests
npm run test:coverage  # with a coverage report
```

Tests run on every push with GitHub Actions.

## Run it locally

```bash
npm install
npm start          # dev server
npm run build      # production build into dist/
npm run benchmark  # AI benchmark
```

## Tech

JavaScript (ES2022 classes and private fields), Jest, Webpack, Babel, ESLint, Prettier. Deployed on GitHub Pages.
