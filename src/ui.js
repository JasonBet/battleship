import { GameController } from './GameController.js';

const controller = new GameController();
const enemyGrid  = document.querySelector('#enemy-grid');
const ownGrid    = document.querySelector('#own-grid');
const statusBar  = document.querySelector('#status');

renderAll();

enemyGrid.addEventListener('click', (e) => {
  const cell = e.target.closest('[data-x]');
  if (!cell || controller.gameOver) return;

  const x = +cell.dataset.x;
  const y = +cell.dataset.y;

  try {
    controller.humanAttack({ x, y });
    renderAll();
  } catch (err) {
    statusBar.textContent = err.message;
  }
});

controller.addEventListener('update', renderAll);
controller.addEventListener('gameover', () => {
  statusBar.textContent =
    controller.humanBoard.allShipsSunk()
      ? '💥  You lost!  💥'
      : '🎉  You won!  🎉';
});

function renderAll() {
  paintBoard(ownGrid,    controller.humanBoard,    true);
  paintBoard(enemyGrid,  controller.computerBoard, false);
}

function paintBoard(container, board, revealShips=false) {
  [...container.children].forEach((rowEl, y) => {
    [...rowEl.children].forEach((cellEl, x) => {
      cellEl.className = '';
      const square = board.grid[y][x];
      if (square === null) {
        if (board.missedShots.some(p => p.x===x && p.y===y))
          cellEl.classList.add('miss');
      } else {
        if (square.isSunk()) cellEl.classList.add('sunk');
        else if (square.hits > 0) cellEl.classList.add('hit');
        else if (revealShips) cellEl.classList.add('ship');
      }
    });
  });
}