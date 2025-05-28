import { Ship } from "./Ship.js";

export class Gameboard {
    constructor(size = 10) {
        this.size = size;
        this.grid = Array.from({length: size}, () => 
            Array(size).fill(null)
        );
        this.ships = [];
        this.misses = [];
    }

    placeShip(start, length, dir = 'horizontal') {
        if(length <= 0) throw new Error('ship length must be positive');
        if(!['horizontal', 'vertical'].includes(dir)){
            throw new Error('direction must be "horizontal" or "vertical"');
        }

        const squares = [];
        for(let i = 0; i < length; i += 1) {
            const x = start.x + (dir === 'horizontal' ? i : 0);
            const y = start.y + (dir === 'vertical' ? i : 0);

            if(x < 0 || x >= this.size || y < 0 || y >= this.size) {
                throw new Error('invalid placement of ship');
            }
            squares.push({x, y});
        }

        for (const {x, y} of squares) {
            if(this.grid[y][x] !== null) {
                throw new Error('ship placement overlaps another ship');
            }
        }

        const ship = new Ship(length);
        this.ships.push(ship);

        for(const {x, y} of squares) {
            this.grid[y][x] = ship;
        }

        return true;
    }

    receiveAttack({x, y}) {

    }

    missedShots() {
        return [...this.misses];
    }

    allShipsSunk() {
        return this.ships.every(ship => ship.isSunk());
    }
}