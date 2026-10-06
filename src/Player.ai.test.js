import { Player } from './Player.js';

// Records every coordinate fired at the defender's board.
function trackShots(defender) {
  const shots = [];
  const original = defender.gameboard.receiveAttack.bind(defender.gameboard);
  defender.gameboard.receiveAttack = (coord) => {
    shots.push(coord);
    return original(coord);
  };
  return shots;
}

const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

describe('Computer AI', () => {
  let cpu;
  let human;
  let shots;

  beforeEach(() => {
    cpu = new Player('computer');
    human = new Player('human');
    shots = trackShots(human);
  });

  it('rejects an unknown player type', () => {
    expect(() => new Player('robot')).toThrow('type must be human|computer');
  });

  it('requires a coordinate from a human player', () => {
    expect(() => human.attack(cpu)).toThrow('human needs coord');
  });

  it('hunts on checkerboard squares while it has no hits', () => {
    for (let i = 0; i < 50; i += 1) cpu.attack(human);
    expect(shots.every(({ x, y }) => (x + y) % 2 === 0)).toBe(true);
  });

  it('covers the rest of the board once the checkerboard is used up', () => {
    for (let i = 0; i < 100; i += 1) cpu.attack(human);
    expect(cpu.moveCount).toBe(100);
    expect(new Set(shots.map(({ x, y }) => `${x},${y}`)).size).toBe(100);
  });

  it('fires next to a hit on its following turn', () => {
    human.gameboard.placeShip({ x: 2, y: 5 }, 4, 'horizontal');
    cpu.attack(human, { x: 3, y: 5 });
    cpu.attack(human);
    expect(distance(shots[1], { x: 3, y: 5 })).toBe(1);
  });

  it('keeps targeting a damaged ship after a miss', () => {
    human.gameboard.placeShip({ x: 2, y: 5 }, 4, 'horizontal');
    cpu.attack(human, { x: 3, y: 5 });
    cpu.attack(human); // tries above the hit first and misses
    cpu.attack(human);
    expect(distance(shots[2], { x: 3, y: 5 })).toBe(1);
  });

  it('follows the line of two hits and sinks the ship', () => {
    human.gameboard.placeShip({ x: 2, y: 5 }, 4, 'horizontal');
    cpu.attack(human, { x: 3, y: 5 });
    while (!human.gameboard.allShipsSunk()) cpu.attack(human);
    // 1 opening hit + at most 3 wasted neighbours + 3 remaining ship squares + 1 overshoot
    expect(cpu.moveCount).toBeLessThanOrEqual(8);
  });

  it('sinks a ship that touches the edge of the board', () => {
    human.gameboard.placeShip({ x: 0, y: 0 }, 3, 'vertical');
    cpu.attack(human, { x: 0, y: 0 });
    while (!human.gameboard.allShipsSunk()) cpu.attack(human);
    expect(cpu.moveCount).toBeLessThanOrEqual(5);
  });

  it('goes back to hunting after a ship sinks', () => {
    human.gameboard.placeShip({ x: 4, y: 4 }, 1);
    cpu.attack(human, { x: 4, y: 4 });
    for (let i = 0; i < 49; i += 1) cpu.attack(human);
    expect(shots.slice(1).every(({ x, y }) => (x + y) % 2 === 0)).toBe(true);
  });

  it('finds a second ship lying next to a sunk one', () => {
    human.gameboard.placeShip({ x: 2, y: 2 }, 2, 'horizontal');
    human.gameboard.placeShip({ x: 2, y: 3 }, 3, 'horizontal');
    while (!human.gameboard.allShipsSunk()) cpu.attack(human);
    expect(cpu.moveCount).toBeLessThanOrEqual(100);
  });
});
