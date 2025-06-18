import { Gameboard } from './Gameboard.js';

export class Player {
  #moves = new Set();
  #target = null;
  constructor(type = 'human', size = 10) {
    if (!['human', 'computer'].includes(type))
      throw new Error('type must be human|computer');
    this.type = type;
    this.gameboard = new Gameboard(size);
  }

  get moveCount() { return this.#moves.size; }

  attack(opponent, coord = null) {
    if (this.type === 'human' && !coord)
      throw new Error('human needs coord');
    if (this.type === 'computer' && !coord)
      coord = this.#target ?? this.#randomCoord(opponent.gameboard.size);

    const key = `${coord.x},${coord.y}`;
    if (this.#moves.has(key)) throw new Error('repeat');
    this.#moves.add(key);

    const result = opponent.gameboard.receiveAttack(coord);
    if (this.type === 'computer') {
      if (result.hit && !result.shipSunk) {
        this.#target = this.#pickAdjacent(coord, opponent.gameboard.size);
      } else {
       this.#target = null;
      }
    }
    return result;
  }

  #randomCoord(size) {
    let x, y, key;
    do {
      x = Math.floor(Math.random() * size);
      y = Math.floor(Math.random() * size);
      key = `${x},${y}`;
    } while (this.#moves.has(key));
    return { x, y };
  }

  #pickAdjacent({ x, y }, size) {
    const dirs = [
      { x: x,     y: y - 1 }, // up
      { x: x + 1, y: y     }, // right
      { x: x,     y: y + 1 }, // down
      { x: x - 1, y: y     }  // left
    ];
    return dirs.find(
      ({ x, y }) =>
        x >= 0 && x < size &&
        y >= 0 && y < size &&
        !this.#moves.has(`${x},${y}`)
    ) ?? null;
  }
}
