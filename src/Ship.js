export class Ship {
    constructor() {
        this.length = 0;
        this.hits = 0;
        this.sunk = false;
    }

    hit() {
        this.hits++;
    }

    isSunk() {
        return this.hits >= this.length;
    }
}