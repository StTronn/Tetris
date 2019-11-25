//animation colison row-clearing
//animation
//</create well using 2-d array
//</create tetromino 
//->draw and clear
//global
document.onkeydown = HandleKey;
let elem = document.getElementById('canvas');
let scoreDisplay = document.getElementById("score");
let up_arrow = document.getElementById("up_arrow");
let down_arrow = document.getElementById("down_arrow");
let right_arrow = document.getElementById("right_arrow");
let left_arrow = document.getElementById("left_arrow");

let ctx = elem.getContext('2d');
let padding = 20;
let width = 12;
let height = 24;
const square_size = 8;

let count = 0;
let gameTime = 0;
let speed = 1;
let wait = 8;
let gameOver = false;

let score = 0;
let A = [0, 0, 1,
    0, 0, 1,
    0, 1, 1];
let B = [1, 0, 0,
    1, 0, 0,
    1, 1, 0];
let C = [0, 0, 0,
    0, 1, 0,
    1, 1, 1];
let D = [0, 0, 0,
    0, 1, 1,
    1, 1, 0];
let E = [0, 0, 0,
    1, 1, 0,
    0, 1, 1];
let F = [1, 1, 0,
    1, 1, 0,
    0, 0, 0];
let G = [0, 0, 0,
    1, 1, 1,
    0, 0, 0];
//all tetrominos
let tetrominos = [A, B, C, D, E, F, G];
let color = ['black', '#575859', '#575859', 'blue ', 'orange', 'purple', 'green', 'red', 'yellow', '#15F4EE']
//well 0->empty 1->wall 2->bottom 3->tetrimino  

let well = new Array(width);
function initWell() {
    for (let x = 0; x < width; x++)
        well[x] = new Array(height).fill(0);
    for (let x = 0; x < width; x++)
        well[x][height - 1] = 2;
    for (let y = 0; y < height; y++)
        well[0][y] = 1, well[width - 1][y] = 1;
}


class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Tet {
    constructor(tet) {
        if (!tet) {
            this.pos = new Vec(width / 2, 0);
            this.tetromino = this.make_random();
        }
        if (tet) {
            this.pos = new Vec(width / 2, 0);
            this.tetromino = [...tet.tetromino];
        }
        this.color = color[this.getColorIndex()];
    }
    move(xOffset, yOffset) {
        let vec = new Vec(xOffset, yOffset);
        if (!this.willTouch(vec))
            this.pos = new Vec(this.pos.x + xOffset, this.pos.y + yOffset);
    }
    //refactor 
    willTouch(vec) {
        let { tetromino, pos } = this
        for (let x = 0; x < 3; x++)
            for (let y = 0; y < 3; y++)
                if (tetromino[y * 3 + x] === 1) {
                    if (well[x + pos.x + vec.x][y + pos.y + vec.y] !== 0)
                        return true;
                }
        return false;
    }
    updatePos(x, y) {
        this.pos = new Vec(x, y);
    }
    goDown() {
        this.move(0, 1);
    }
    deacc() {
        speed = 1;
    }
    acc() {
        speed = (speed + 1) % 3;
    }
    goLeft() {
        this.move(-1, 0);
    }
    goRight() {
        this.move(1, 0);
    }
    rotate_right() {
        let temp = [...this.tetromino];
        let map = [6, 3, 0, 7, 4, 1, 8, 5, 2];
        this.tetromino.fill(0);
        for (let i = 0; i < map.length; i++)
            this.tetromino[i] = temp[map[i]];
        //checking rotaion will collide with wall
        if (this.willTouch(new Vec(0, 0))) {
            if (this.pos.x > width / 2)
                this.goLeft();
            else
                this.goRight();
        }
    }
    getColorIndex() {
        for (let i = 0; i < tetrominos.length; i++) {
            if (arrayEquals(tetrominos[i], this.tetromino))
                return i + 3;
        }
    }
    make_random() {
        return tetrominos[Math.floor(Math.random() * tetrominos.length)];
    }
    draw(xOffset = 0, yOffset = 0) {
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++)
                if (this.tetromino[y * 3 + x] === 1)
                    drawBox(x + this.pos.x + xOffset, y + this.pos.y + yOffset, this.color)
        }
    }
}

// clear() -> clears the tetrimino 
function reset() {
    if (clock) {
        clearInterval(clock);
    }
    initWell();
    currentTet = new Tet();
    nextTet = new Tet();
    while (arrayEquals(nextTet.tetromino, currentTet.tetromino))
        nextTet = new Tet();
    clock = setInterval(gameLoop, 100)
}
initWell();
let currentTet = new Tet();
let nextTet = new Tet();
while (arrayEquals(nextTet.tetromino, currentTet.tetromino))
    nextTet = new Tet();
let clock = setInterval(gameLoop, 100);

function gameLoop() {
    if (gameOver) {
        clearInterval(clock);
    }
    if (isFull()) {
        gameOver = true;
        clearInterval(clock);
    }
        scoreDisplay.innerHTML = score;
    clearArea(0, 0, 1280, 720);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, elem.width, elem.height);
    drawWell();
    currentTet.draw();
    nextTet.draw(width - 1, 2);
    checkForLock(currentTet);
    rowClearing();
    count++;
    if (count == wait) {
        count = 0;
        currentTet.goDown();
        gameTime += 1;
    }
    if (gameTime > 60) {
        //increase speed upto 3 every 60 sec
        gameTime = 0;
        wait = wait - 2 < 4 ? 4 : wait - 2;
    }
    //check for row clearing 

    //check if game over if true remove interval
    //draw

}

function rowClearing() {
    for (let y = 0; y < height - 1; y++) {
        let rowClear = true;
        for (let x = 1; x < width - 1; x++) {
            if (well[x][y] < 2)
                rowClear = false;
        }
        if (rowClear) {
            score += 1000;
            for (let i = y; i > 0; i--) {
                for (let x = 1; x < width; x++) {
                    well[x][i] = well[x][i - 1];
                }
            }
        }
    }
}

function isFull() {
    for (let x = 0; x < width; x++) {
        if (well[x][0] >= 2)
            return true;
    }
    return false;
}

function checkForLock(tet) {
    if (willTouchBottom(tet)) {
        converTetToWell(tet);
        currentTet = new Tet(nextTet);
        nextTet = new Tet();

    }
}
//only used  for  going down
function willTouchBottom(tet) {
    for (let x = 0; x < 3; x++)
        for (let y = 0; y < 3; y++)
            if (tet.tetromino[y * 3 + x] === 1) {
                if (well[x + tet.pos.x][y + tet.pos.y + 1] >= 2)
                    return true;
            }
    return false;
}
function converTetToWell(tet) {
    let xOffset = tet.pos.x;
    let yOffset = tet.pos.y;
    for (let x = 0; x < 3; x++)
        for (let y = 0; y < 3; y++) {
            if (tet.tetromino[y * 3 + x] === 1) {
                well[x + xOffset][y + yOffset] = color.findIndex(elem => elem === tet.color);
            }
        }
}
//input 
function HandleKey(e) {
    if (gameOver)
        return;
    e = e || window.event;
    if (e.keyCode == '38') {
        e.preventDefault();
        currentTet.rotate_right()
    }
    else if (e.keyCode == '40') {
        // down arrow
        e.preventDefault();
        currentTet.goDown();
    }
    else if (e.keyCode == '37') {
        // left arrow
        e.preventDefault();
        currentTet.goLeft()
    }
    else if (e.keyCode == '39') {
        // right arrow
        e.preventDefault();
        currentTet.goRight();
    }
}
up_arrow.onclick=()=>{currentTet.rotate_right()}
down_arrow.onclick=()=>{currentTet.goDown()}
right_arrow.onclick=()=>{currentTet.goRight()}
left_arrow.onclick=()=>{currentTet.goLeft()}




//drawing 
function drawWell() {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (well[x][y] <= 2)
                drawBox(x, y, color[well[x][y]], size = 16, scale = 16)
            else
                drawBox(x, y, color[well[x][y]])
        }
    }
}

function clearArea(x1, y1, width, height) {
    ctx.clearRect(x1, y1, width, height);
}
function drawBox(x, y, color, size = 15, scale = 16) {
    ctx.fillStyle = color;
    ctx.fillRect(x * scale, y * scale, size, size);
}

//add keyboards  bindings 
//add row clearing algorithm 

//helper funtion 
function arrayEquals(a, b) {
    for (let i = 0; i < a.length; i++)
        if (a[i] !== b[i])
            return false;
    return true;
}