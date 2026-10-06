import { Gameboard } from './Gameboard.js';

const DIRS = [
  { dx: 0,  dy: -1 }, // up
  { dx: 1,  dy: 0  }, // right
  { dx: 0,  dy: 1  }, // down
  { dx: -1, dy: 0  }  // left
];

export class Player {
  #moves = new Set();
  #hits = []; // hits on ships that are not sunk yet
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
    if (this.type === 'computer' && !coord) {
      const size = opponent.gameboard.size;
      coord = this.#targetCoord(size) ?? this.#huntCoord(size);
    }

    const key = `${coord.x},${coord.y}`;
    if (this.#moves.has(key)) throw new Error('repeat');
    this.#moves.add(key);

    const result = opponent.gameboard.receiveAttack(coord);
    if (this.type === 'computer' && result.hit) {
      this.#hits.push(coord);
      if (result.shipSunk) this.#forgetSunkShip(coord);
    }
    return result;
  }

  // Hunt mode: no known hits, so search at random. Every ship of length 2+
  // covers at least one square of a checkerboard, so only those are searched
  // until none are left.
  #huntCoord(size) {
    const open = [];
    for (let x = 0; x < size; x += 1) {
      for (let y = 0; y < size; y += 1) {
        if (!this.#moves.has(`${x},${y}`)) open.push({ x, y });
      }
    }
    const checkerboard = open.filter(({ x, y }) => (x + y) % 2 === 0);
    const pool = checkerboard.length ? checkerboard : open;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Target mode: fire next to a known hit. Squares that extend a line of two
  // or more hits are tried first, since they follow the ship's orientation.
  #targetCoord(size) {
    const inLine = [];
    const around = [];
    for (const hit of this.#hits) {
      for (const { dx, dy } of DIRS) {
        const next = { x: hit.x + dx, y: hit.y + dy };
        if (!this.#isOpen(next, size)) continue;
        const behind = { x: hit.x - dx, y: hit.y - dy };
        (this.#isHit(behind) ? inLine : around).push(next);
      }
    }
    return inLine[0] ?? around[0] ?? null;
  }

  // The board only reports that a ship sank, not which squares it covered, so
  // drop the hits connected in a straight line to the final shot.
  #forgetSunkShip(last) {
    const sunk = [last];
    for (const { dx, dy } of DIRS) {
      let next = { x: last.x + dx, y: last.y + dy };
      while (this.#isHit(next)) {
        sunk.push(next);
        next = { x: next.x + dx, y: next.y + dy };
      }
    }
    this.#hits = this.#hits.filter(
      (hit) => !sunk.some((s) => s.x === hit.x && s.y === hit.y)
    );
  }

  #isHit({ x, y }) {
    return this.#hits.some((hit) => hit.x === x && hit.y === y);
  }

  #isOpen({ x, y }, size) {
    return x >= 0 && x < size &&
           y >= 0 && y < size &&
           !this.#moves.has(`${x},${y}`);
  }
}
