import { Player } from './Player.js';

describe('Player', () => {
  it('initialises with its own 10×10 gameboard', () => {
    const p = new Player();
    expect(p.type).toBe('human');
    expect(p.gameboard.size).toBe(10);
    expect(p.gameboard.allShipsSunk()).toBe(true);
  });

  it('lets a human attack a specific coordinate', () => {
    const alice = new Player('human');
    const bob   = new Player('human');

    bob.gameboard.placeShip({ x: 0, y: 0 }, 1);

    const result = alice.attack(bob, { x: 0, y: 0 });
    expect(result).toEqual({ hit: true, shipSunk: true });
    expect(bob.gameboard.allShipsSunk()).toBe(true);
  });

  it('throws if the same player fires at the same square twice', () => {
    const alice = new Player('human');
    const bob   = new Player('human');

    alice.attack(bob, { x: 4, y: 4 });
    expect(() => alice.attack(bob, { x: 4, y: 4 })).toThrow();
  });

  it('computer generates random legal moves without repeats', () => {
    const cpu = new Player('computer');
    const bob = new Player('human');

    const seen = new Set();
    for (let i = 0; i < 5; i += 1) {
      const res = cpu.attack(bob);
      expect(res).toHaveProperty('hit');

      expect(cpu.moves).toHaveSize(i + 1);
    }
  });
});
