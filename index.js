const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

const Game = require('./Game.js');


app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'))
});

app.get('/iso', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/isometric.html'))
}),

io.on('connection', socket => {
    socket.on('create', () => handleCreate(socket));
    socket.on('start', () => handleStart(socket));
    socket.on('update', (direction) => handleUpdate(socket, direction));
});

const waiting = [];
const playing = [];

const handleCreate = socket => {
    socket.join('1');
    const game = new Game(1);
    console.log(game);
    socket.game = game;
    game.addPlayer(socket.id, 'pepe');

    playing.push(game);
}

const handleStart = () => {
    setInterval(() => {
        for (game of playing) {
            io.to('1').emit('update', game.update());
        }
    }, 700);
}

const handleUpdate = (socket, direction) => {
    if (socket.game)
        socket.game.updateQueue(socket.id, direction);
}

http.listen(3000, () => 'Server listening on http://localhost:3000');