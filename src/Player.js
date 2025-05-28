import { Gameboard } from "./Gameboard.js";

export class Player {
    constructor(type = 'human', boardSize = 10) {
        if(!['human', 'computer'].includes(type)) {
            throw new Error('type must be human or computer');
        }
        this.moves = new Set();
        this.type = type;
        this.gameboard = new Gameboard(boardSize);
    }

    attack(opponent, coord = null) {

    }

    #randomCoord(size) {
        
    }
}