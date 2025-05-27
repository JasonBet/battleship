import { Ship } from "./Ship.js";

describe('Ship', () => {
    let ship;

    beforeEach(() => {
        ship = new Ship();
    });

    it('should initialize with default values', () => {
        expect(ship.length).toBe(0);
        expect(ship.hits).toBe(0);
        expect(ship.sunk).toBeFalsy();
    });

    it('should get hit', () => {
        ship.hit();
        expect(ship.hits).toBe(1);
    });

    it('should sink', () => {
        ship.length = 3;
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBeTruthy;
    });
});