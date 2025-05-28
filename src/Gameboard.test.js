import { Gameboard } from './Gameboard.js';

describe('Gameboard', () => {
  let board;
  beforeEach(() => {
    board = new Gameboard();
  });

  it('starts with an empty 10 by 10 grid', () => {
    expect(board.size).toBe(10);
    expect(board.missedShots).toHaveLength(0);
    expect(board.allShipsSunk()).toBe(true);
  });

  it('places a length 3 ship horizontally', () => {
    const ok = board.placeShip({ x: 0, y: 0 }, 3, 'horizontal');
    expect(ok).toBe(true);
    expect(board.allShipsSunk()).toBe(false);
  });

  it('rejects overlaps and off‑board placements', () => {
    expect(() =>
        board.placeShip({ x: 8, y: 0 }, 3, 'horizontal')
    ).toThrow('invalid placement of ship');

    board.placeShip({ x: 0, y: 0 }, 3, 'horizontal');

    expect(() =>
        board.placeShip({ x: 2, y: 0 }, 4, 'vertical')
    ).toThrow('ship placement overlaps another ship');
  });

  it('records a miss and returns hit=false', () => {
    const result = board.receiveAttack({ x: 4, y: 4 });
    expect(result).toEqual({ hit: false, shipSunk: false });
    expect(board.missedShots).toContainEqual({ x: 4, y: 4 });
  });

  it('registers a hit, calls ship.hit, and reports shipSunk', () => {
    board.placeShip({ x: 0, y: 0 }, 2, 'vertical');
    board.receiveAttack({ x: 0, y: 0 });
    const res = board.receiveAttack({ x: 0, y: 1 });
    expect(res).toEqual({ hit: true, shipSunk: true });
    expect(board.allShipsSunk()).toBe(true);
  });

  it('throws or ignores when attacking same square twice', () => {
    board.receiveAttack({ x: 4, y: 4 });
    expect(() => board.receiveAttack({ x: 4, y: 4 })).toThrow();
  });
});