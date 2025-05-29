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

    get moveCount() {
        return this.moves.size;
    }

    attack(opponent, coord = null) {
        if(!(opponent instanceof Player)) {
            throw new Error('opponent must be a Player');
        }

        if(this.type === 'human') {
            if(!coord) throw new Error('human player needs a coordinate to attack');
        }
        else {
            if(!coord) coord = this.#randomCoord(opponent.gameboard.size);
        }
        const key = `${coord.x},${coord.y}`;

        if(this.moves.has(key)) {
            throw new Error('square already attacked by this player');
        }
        this.moves.add(key);

        return opponent.gameboard.receiveAttack(coord);
    }

    #randomCoord(boardSize) {
        if(this.moves.size === boardSize * boardSize) {
            throw new Error('no remaining legal moves');
        }

        let x, y, key;
        do {
            x = Math.floor(Math.random() * boardSize);
            y = Math.floor(Math.random() * boardSize);
            key = `${x},${y}`;
        } while(this.moves.has(key));

        return { x, y };
    }
}