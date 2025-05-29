// GameController.js
import { Player } from './Player.js';

export class GameController extends EventTarget {
  constructor(size = 10) {
    super();
    this.human    = new Player('human',    size);
    this.computer = new Player('computer', size);

    this.#autoPlaceShips(this.computer);

    this.phase    = 'placement';
    this.current  = this.human;
    this.opponent = this.computer;
  }

  placeShip(start, length, dir) {
    if (this.phase !== 'placement') return false;
    this.human.gameboard.placeShip(start, length, dir);
    this.dispatchEvent(new Event('update'));
    return true;
  }

  randomiseHumanFleet() {
    this.human.gameboard = new this.human.gameboard.constructor();
    this.#autoPlaceShips(this.human);
    this.dispatchEvent(new Event('update'));
  }

  humanAttack(coord) {
    if (this.phase !== 'battle' || this.current !== this.human) return;
    this.#playTurn(coord);

    if (!this.#gameOver()) this.#computerTurn();
  }

  get humanBoard()    { return this.human.gameboard; }
  get computerBoard() { return this.computer.gameboard; }
  get gameOver()      { return this.phase === 'finished'; }

  #playTurn(coord) {
    const result =
      this.current.attack(this.opponent, coord);

    this.dispatchEvent(new CustomEvent('update', { detail: result }));
    if (!this.#gameOver()) this.#switchTurn();
    return result;
  }

  #computerTurn() {
    setTimeout(() => {
      this.#playTurn();
    }, 400);
  }

  #switchTurn() {
    [this.current, this.opponent] =
      this.current === this.human
        ? [this.computer, this.human]
        : [this.human,    this.computer];
  }

  #gameOver() {
    if (this.humanBoard.allShipsSunk() ||
        this.computerBoard.allShipsSunk()) {
      this.phase = 'finished';
      this.dispatchEvent(new Event('gameover'));
      return true;
    }
    return false;
  }

  #autoPlaceShips(player) {
    const lengths = [5, 4, 3, 3, 2];
    lengths.forEach(len => {
      let placed = false;
      while (!placed) {
        const dir = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const x   = Math.floor(Math.random() * player.gameboard.size);
        const y   = Math.floor(Math.random() * player.gameboard.size);
        try {
          player.gameboard.placeShip({ x, y }, len, dir);
          placed = true;
        } catch { /* overlap or out‑of‑bounds – retry */ }
      }
    });
  }
}
