import { Gameboard } from './Gameboard.js';

export class Player {
  #moves = new Set();
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
      coord = this.#randomCoord(opponent.gameboard.size);

    const key = `${coord.x},${coord.y}`;
    if (this.#moves.has(key)) throw new Error('repeat');
    this.#moves.add(key);

    return opponent.gameboard.receiveAttack(coord);
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
}
