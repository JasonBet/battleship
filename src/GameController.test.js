import { GameController } from './GameController.js';

const FLEET_SQUARES = 5 + 4 + 3 + 3 + 2;

const shipSquares = (board) => {
  const squares = [];
  board.grid.forEach((row, y) =>
    row.forEach((sq, x) => { if (sq !== null) squares.push({ x, y }); })
  );
  return squares;
};

describe('GameController', () => {
  let game;

  beforeEach(() => {
    jest.useFakeTimers();
    game = new GameController();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts in placement with the computer fleet already placed', () => {
    expect(game.phase).toBe('placement');
    expect(shipSquares(game.computerBoard)).toHaveLength(FLEET_SQUARES);
    expect(shipSquares(game.humanBoard)).toHaveLength(0);
    expect(game.gameOver).toBe(false);
  });

  it('places a human ship and announces the change', () => {
    const onUpdate = jest.fn();
    game.addEventListener('update', onUpdate);

    expect(game.placeShip({ x: 0, y: 0 }, 3, 'horizontal')).toBe(true);
    expect(shipSquares(game.humanBoard)).toHaveLength(3);
    expect(onUpdate).toHaveBeenCalledTimes(1);
  });

  it('refuses to place ships once the battle has started', () => {
    game.phase = 'battle';
    expect(game.placeShip({ x: 0, y: 0 }, 3, 'horizontal')).toBe(false);
    expect(shipSquares(game.humanBoard)).toHaveLength(0);
  });

  it('randomises a full human fleet', () => {
    game.randomiseHumanFleet();
    expect(shipSquares(game.humanBoard)).toHaveLength(FLEET_SQUARES);
  });

  it('ignores attacks during placement', () => {
    game.humanAttack({ x: 0, y: 0 });
    expect(game.computerBoard.isAttacked(0, 0)).toBe(false);
  });

  it('answers a human attack with a computer attack after a delay', () => {
    game.randomiseHumanFleet();
    game.phase = 'battle';
    const results = [];
    game.addEventListener('update', (e) => results.push(e.detail));

    game.humanAttack({ x: 0, y: 0 });
    expect(game.computerBoard.isAttacked(0, 0)).toBe(true);
    expect(game.current).toBe(game.computer);

    // The human cannot fire again while the computer is "thinking".
    game.humanAttack({ x: 1, y: 0 });
    expect(game.computerBoard.isAttacked(1, 0)).toBe(false);

    jest.advanceTimersByTime(400);
    expect(game.computer.moveCount).toBe(1);
    expect(game.current).toBe(game.human);
    expect(results).toHaveLength(2);
    expect(results[0]).toHaveProperty('hit');
  });

  it('ends the game when the whole computer fleet is sunk', () => {
    game.randomiseHumanFleet();
    game.phase = 'battle';
    const onGameOver = jest.fn();
    game.addEventListener('gameover', onGameOver);

    for (const coord of shipSquares(game.computerBoard)) {
      game.humanAttack(coord);
      jest.advanceTimersByTime(400);
    }

    expect(game.computerBoard.allShipsSunk()).toBe(true);
    expect(game.gameOver).toBe(true);
    expect(onGameOver).toHaveBeenCalled();

    // No more turns are accepted after the game ends.
    const movesBefore = game.human.moveCount;
    game.humanAttack({ x: 9, y: 9 });
    expect(game.human.moveCount).toBe(movesBefore);
  });

  it('resets to a fresh placement phase', () => {
    game.randomiseHumanFleet();
    game.phase = 'battle';
    game.humanAttack({ x: 0, y: 0 });
    jest.advanceTimersByTime(400);

    const onUpdate = jest.fn();
    game.addEventListener('update', onUpdate);
    game.reset();

    expect(game.phase).toBe('placement');
    expect(game.current).toBe(game.human);
    expect(shipSquares(game.humanBoard)).toHaveLength(0);
    expect(shipSquares(game.computerBoard)).toHaveLength(FLEET_SQUARES);
    expect(game.computerBoard.isAttacked(0, 0)).toBe(false);
    expect(onUpdate).toHaveBeenCalledTimes(1);
  });
});
