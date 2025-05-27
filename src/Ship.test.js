import { Ship } from "./Ship.js";

describe('Ship', () => {
    let ship;

    beforeEach(() => {
        ship = new Ship();
    });

    it('should initialize with default values', () => {
        expect(ship.length).toBe(0);
        expect(ship.hits).toBe(0);
        expect(ship.isSunk).toBeFalsy();
    });
});