var svg;
var deck = [];

const nCols = 40,
    nRows = 30,
    cellSize = 20;

var direction = 2;
const DIRECTIONS = {
    37: 0, //left
    38: 1, //top
    39: 2, //right
    40: 3 //bot
}

const COLORS = {
    background: 'black',
    snake: 'yellow',
    apple: 'green'
};

var apple = generateApple();


window.onload = () => {
    svg = document.querySelector('svg');
    init();
    
    document.addEventListener('keydown', evt => {
        let keyCode = evt.keyCode.toString();
        
        if(Object.keys(DIRECTIONS).includes(keyCode)) {
            if(Math.abs(direction - DIRECTIONS[keyCode]) !== 2)
               direction = DIRECTIONS[keyCode];
        }
            
                
        
    });
    
    setInterval(update, 100);
}

var snake;

var init = () => {    
    var width = nCols * cellSize,
        height = nRows * cellSize;
    
    svg.style.width = width;
    svg.style.height = height;
    svg.style.backgroundColor = 'red';
    svg.style.border = '2px solid ' + COLORS.background;
    
    
    for(var y = 0; y < nRows; y++) {
        var row = [];
        for(var x = 0; x < nCols; x++) {
            var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('y', cellSize * y);
            rect.setAttribute('x', cellSize * x);
            rect.setAttribute('width', cellSize);
            rect.setAttribute('height', cellSize);
            rect.setAttribute('fill', COLORS.background);
            rect.setAttribute('stroke', COLORS.background);
            rect.setAttribute('stroke-width', 2);
            svg.appendChild(rect);
            row.push(rect);
        }
        deck.push(row);
    }
    
    snake = [];
    snake.push({
        y: nRows / 2,
        x: nCols / 2,
        rect: deck[nRows / 2][nCols / 2]
    });
}


var update = () => {
    var head = snake[snake.length - 1],
        pos = getPos({
            y: head.y,
            x: head.x
        });
    
    var next = deck[pos.y][pos.x].getAttribute('fill');
    
    if(next === COLORS.apple)
        //snake.push();
        apple = generateApple();
    else if(next === COLORS.snake)
        init();
    else
        snake.splice(0, 1);
    
    snake.push({
        y: pos.y,
        x: pos.x,
        rect: deck[pos.y][pos.x]
    });
    
    [...document.querySelectorAll('rect')]
        .forEach(e => e.setAttribute('fill', COLORS.background));
    snake.forEach(e => e.rect.setAttribute('fill', COLORS.snake));
    deck[apple.y][apple.x].setAttribute('fill', COLORS.apple);
}

var getPos = pos => {
    
    if(direction === 0) //left
        pos.x = pos.x - 1 < 0 ? nCols - 1 : pos.x - 1;
    else if(direction === 2) //right
        pos.x = pos.x + 1 > nCols - 1 ? 0 : pos.x + 1;
    else if(direction === 1) //top
        pos.y = pos.y - 1 < 0 ? nRows - 1 : pos.y - 1;
    else if(direction === 3) //botom
        pos.y = pos.y + 1 > nRows - 1 ? 0 : pos.y + 1;
    
    return pos;
}

function generateApple() {
    
    return {
        y: Math.floor(Math.random() * Math.floor(nRows)),
        x: Math.floor(Math.random() * Math.floor(nCols))
    }
}