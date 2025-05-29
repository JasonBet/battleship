import { Ship } from './Ship.js';

export class Gameboard {
  #grid;
  #misses = [];
  #ships  = [];invalid
  #fired  = new Set();

  constructor(size = 10) {
    this.size = size;
    this.#grid = Array.from({ length: size }, () => Array(size).fill(null));
  }

  placeShip(start, length, dir = 'horizontal') {
    if (length <= 0) throw new Error('ship length must be positive');
    if (!['horizontal', 'vertical'].includes(dir))
      throw new Error('direction must be "horizontal" or "vertical"');

    const squares = [];
    for (let i = 0; i < length; i += 1) {
      const x = start.x + (dir === 'horizontal' ? i : 0);
      const y = start.y + (dir === 'vertical'   ? i : 0);
      if (x < 0 || x >= this.size || y < 0 || y >= this.size)
        throw new Error('invalid placement of ship');
      squares.push({ x, y });
    }
    for (const { x, y } of squares) {
      if (this.#grid[y][x] !== null) throw new Error('ship placement overlaps another ship');
    }

    const ship = new Ship(length);
    this.#ships.push(ship);
    squares.forEach(({ x, y }) => (this.#grid[y][x] = ship));
    return true;
  }

  receiveAttack({ x, y }) {
    if (x < 0 || x >= this.size || y < 0 || y >= this.size)
      throw new Error('out of bounds');
    const key = `${x},${y}`;
    if (this.#fired.has(key)) throw new Error('duplicate shot');
    this.#fired.add(key);

    const sq = this.#grid[y][x];
    if (sq === null) {
      this.#misses.push({ x, y });
      return { hit: false, shipSunk: false };
    }
    sq.hit();
    return { hit: true, shipSunk: sq.isSunk() };
  }

  get grid()        { return this.#grid; }
  get missedShots() { return [...this.#misses]; }
  allShipsSunk()    { return this.#ships.every(s => s.isSunk()); }

  isAttacked(x, y)  { return this.#fired.has(`${x},${y}`); }
}
