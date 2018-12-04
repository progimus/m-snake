module.exports = Game = class Game {
    constructor(id) {
        this.id = id;
        this.players = {};
        this.nRows = 15;
        this.nCols = 15;
        this.nPlayers = 0;
        this.deck = this.createDeck();
        
        this.generateApple();
    }

    createDeck() {
        let deck = [];

        for (let y = 0; y < this.nRows; y++) {
            let row = [];

            for (let x = 0; x < this.nCols; x++) row.push(0);

            deck.push(row);
        }

        return deck;
    }

    addPlayer(socketId, name) {
        const id = ++this.nPlayers;
        const [y, x] = [10, 10];

        this.players[socketId] = {
            id,
            name: name,
            queue: [],
            direction: 0,
            pos: {x: 10, y: 10},
            snake: [
                {x: 10, y: 10}, // Head
                {x: 10, y: 11}, // Body
                {x: 10, y: 12}, // Tail
            ]
        };

        this.deck[y][x] = id;
    }

    update() {
        console.log(this.players);

        let res = {
            players: [],
            empty: [], // Delete
            apple: this.apple
        }

        for (let player of Object.values(this.players)) {
            const snake = player.snake;
            const head = snake[snake.length - 1];

            if (player.queue.length !== 0) {
                player.direction = player.queue.shift();
            }

            const moves = {}

            const pos = this.getPos(
                {
                    y: head.y,
                    x: head.x
                },
                player.direction
            );
            
            const next = this.deck[pos.y][pos.x];

            moves.appleEated = null;
            
            if (next === -1) {                
                moves.appleEated = {
                    x: snake[1].x,
                    y: snake[1].y,
                }
                this.generateApple();
            } else if (next > 0) {
                //init();
                //console.log('game over');
            } else {
                moves.empty = snake[0];
                this.deck[snake[0].y][snake[0].x] = 0;
                snake.splice(0, 1);
            }

            /*moves.tail = {
                x: snake[0].x,
                y: snake[0].y,
                direction: this.getDirection(snake[1], snake[0])
            };*/
            /*moves.new = {
                x: this.apple.x,
                y: this.apple.y,
                direction: this.getDirection(snake[1], snake[0])
            };*/
            
            moves.head = pos;
            /*moves.body = {
                x: snake[snake.length - 1].x,
                y: snake[snake.length - 1].y,
                direction: this.getDirection(snake[snake.length - 1], pos)
            };*/
            


            pos.direction = player.direction;

            res.players.push(moves);
            
            this.deck[pos.y][pos.x] = player.id;
            snake.push({
                y: pos.y,
                x: pos.x
            });
        }

        return res;
    }

    updateQueue(socketId, direction) {
        this.players[socketId].queue.push(direction);
    }

    getPos(pos, direction) {
        if (direction === 0) {
            // top
            pos.y = pos.y - 1 < 0 ? this.nRows - 1 : pos.y - 1;
        } else if(direction === 1) {
            // left
            pos.x = pos.x - 1 < 0 ? this.nCols - 1 : pos.x - 1;
        } else if (direction === 2) {
            // bottom
            pos.y = pos.y + 1 > this.nRows - 1 ? 0 : pos.y + 1;
        } else if (direction === 3) {
            // right
            pos.x = pos.x + 1 > this.nCols - 1 ? 0 : pos.x + 1;
        }
        
        return pos;
    }

    getDirection(previous, next) {
        let direction;

        if (previous.y < next.y) {
            // top
            direction = 0;
        } else if (previous.x < next.x) {
            // left
            direction = 1;
        } else if (previous.y > next.y) {
            // bottom
            direction = 2;
        } else if (previous.x > next.x) {
            // right
            direction = 3;
        }

        return direction;
    }

    generateApple() {
        this.apple = {
            y: Math.floor(Math.random() * Math.floor(this.nRows)),
            x: Math.floor(Math.random() * Math.floor(this.nCols))
        }

        this.deck[this.apple.y][this.apple.x] = -1;
    }
};