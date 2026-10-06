// Benchmarks the computer AI against purely random targeting.
// Each game places the standard fleet at random and counts shots until it is sunk.
// Run with: npm run benchmark
import { Player } from '../src/Player.js';
const LENS = [5, 4, 3, 3, 2];
function place(p) {
  for (const len of LENS) {
    for (;;) {
      const dir = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const x = Math.floor(Math.random() * 10), y = Math.floor(Math.random() * 10);
      try { p.gameboard.placeShip({ x, y }, len, dir); break; } catch {}
    }
  }
}
function shuffledCells() {
  const c = [];
  for (let x = 0; x < 10; x++) for (let y = 0; y < 10; y++) c.push({ x, y });
  for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
  return c;
}
function run(mode) {
  const def = new Player('human'); place(def);
  let shots = 0;
  if (mode === 'ai') {
    const cpu = new Player('computer');
    while (!def.gameboard.allShipsSunk()) { cpu.attack(def); shots++; }
  } else {
    const atk = new Player('human');
    for (const c of shuffledCells()) { atk.attack(def, c); shots++; if (def.gameboard.allShipsSunk()) break; }
  }
  return shots;
}
const N = 20000;
for (const mode of ['random', 'ai']) {
  const r = Array.from({ length: N }, () => run(mode)).sort((a, b) => a - b);
  const mean = r.reduce((a, b) => a + b, 0) / N;
  console.log(mode, 'mean', mean.toFixed(2), 'median', r[N / 2], 'p10', r[N / 10], 'p90', r[9 * N / 10]);
}
