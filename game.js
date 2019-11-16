//animation colison row-clearing
//animation
//</create well using 2-d array
//</create tetromino 
//->draw and clear
//global
document.onkeydown = HandleKey;
let elem=document.getElementById('canvas');
let ctx=elem.getContext('2d');
let scale=16;
function drawBox(x,y,color){
    let size=15;
    ctx.fillStyle=color;
    ctx.fillRect(x*scale,y*scale,size,size);
}

let width = 10;
let height = 20;
const square_size = 8;
let count=0;
let speed=1;
let gameOver=false;
let A = [0,0,1,
    0,0,1,
    0,1,1];
let B = [1,0,0,
    1,0,0,
    1,1,0];
let C = [0,0,0,
    0,1,0,
    1,1,1];
let D = [0,0,0,
    0,1,1,
    1,1,0];
let E = [0,0,0,
    1,1,0,
    0,1,1];
let F = [1,1,0,
    1,1,0,
    0,0,0];
let G = [0,0,0,
    1,1,1,
    0,0,0];
//all tetrominos
let tetrominos = [ A, B, C, D, E, F, G ];
let color=['grey','blue','black']
//well 0->empty 1->wall 2->bottom 3->tetrimino  
let well = new Array(width);
for(let x=0;x<width;x++)
    well[x]=new Array(height).fill(0);
for(let x=0;x<width;x++)
    well[x][height-1]=2;
for(let y=0;y<height;y++)
    well[0][y]=1,well[width-1][y]=1;

class Well{
    constructor(){
        this.width=8;
        this.height=12;
        this.arr=new Array(this.width);
        
        for (let x=0;x<width;x++)
            this.arr[x]=new Array(this.height).fill(0);
        for (let x=0;x<this.width;x++)
            this.arr[x][this.height-1]=2;
        for (let y=0;y<height;y++)
            this.arr[0][y]=1,this.arr[this.width-1][y]=1;        
    }
}
    

class Vec{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
}
//refactor make fall and speed internal insead of global
class Tet{
    constructor(){
        this.pos= new Vec(width/2,0);
        this.tetromino=this.make_random();
    }
    move(xOffset,yOffset){
        let vec=new Vec(xOffset,yOffset);
        if (!this.willTouch(vec))
            this.pos=new Vec(this.pos.x+xOffset,this.pos.y+yOffset);
    }
    //refactor 
    willTouch(vec){
        let {tetromino,pos} =this
        for (let x=0;x<3;x++)
            for(let y=0;y<3;y++)
                if (tetromino[y*3+x]===1){
                    if(well[x+pos.x+vec.x][y+pos.y+vec.y]!==0)
                    return true;
                }
        return false;
    }
    updatePos(x,y){
        this.pos=new Vec(x,y);
    }
    goDown(){
        this.move(0,1);
    }
    deacc(){
        speed=1;
    }
    acc(){
        speed=(speed+1)%3;
    }
    goLeft(){
        this.move(-1,0);
    }
    goRight(){
        this.move(1,0);
    }
    rotate_right(){
        let temp=[...this.tetromino];
        let map = [6, 3, 0, 7, 4, 1, 8, 5, 2];
        this.tetromino.fill(0);
        for(let i=0;i<map.length;i++)
        this.tetromino[i]=temp[map[i]];
        if (this.willTouch(new Vec(0,0))){
            if (this.pos.x>width/2)
                this.goLeft();
            else 
                this.goRight();
        }
    }
    make_random(){
        return tetrominos[Math.floor(Math.random()*tetrominos.length)];
    }
}

// fall() 
// clear() -> clears the tetrimino 

let currentTet=new Tet();

let gameLoop=setInterval(test,100);

for (let i=0;i<18;i++)
    fall(currentTet);
drawWell();
drawTet(currentTet);
function test(){
    if (gameOver)
        clearInterval(gameLoop);
    //input 
    //do neccassry action for the input  
    //if input is right arrow move currtet right
    //if down is pressed increase speed if not set speed to 1 
    //fall(currentTet)
    if (isFull()){
        gameOver=true;
        clearInterval(gameLoop);
    }
    drawWell();
    drawTet(currentTet);
    rowClearing();
    count++;
    if (count==10){
        count=0;
        fall(currentTet);
    }
    //check for row clearing 
    
    //check if game over if true remove interval
    //draw
        
}

function rowClearing(){
    for (let y=0;y<height-1;y++){
        let rowClear=true;
        for (let x=1;x<width-1;x++){
            if(well[x][y]!==2)
                rowClear=false;
        }                
        if (rowClear){
            for (let i=y;i>0;i--){
                for (let x=1;x<width;x++){
                    well[x][i]=well[x][i-1];
                }
            }
        }
    }
    
}
function isFull(){
    for (let x=0;x<width;x++){
        if(well[x][0]===2)
            return true;
    }
    return false;
}

function fall(tet){
    for (let i=0;i<speed;i++)
        tet.goDown();
    if (willTouchBottom(tet)){
        currentTet=new Tet()
        converTetToWell(tet);
    }
}

//only used  for  going down
function willTouchBottom(tet){
    for (let x=0;x<3;x++)
        for(let y=0;y<3;y++)
            if (tet.tetromino[y*3+x]===1){
                if(well[x+tet.pos.x][y+tet.pos.y+1]===2)
                    return true;
            }
    return false;
}

function converTetToWell(tet){
    let xOffset=tet.pos.x;
    let yOffset=tet.pos.y;
    for(let x=0;x<3;x++)
        for(let y=0;y<3;y++){
            if(tet.tetromino[y*3+x]===1){
                well[x+xOffset][y+yOffset]=2;
            }
        }
}

//input 
function HandleKey(e) {
    e.preventDefault();
    if (gameOver)
        return;
    e = e || window.event;
    if (e.keyCode == '38') {
        currentTet.rotate_right()
    }
    else if (e.keyCode == '40') {
        // down arrow
        fall(currentTet);
    }
    else if (e.keyCode == '37') {
       // left arrow
       currentTet.goLeft()
    }
    else if (e.keyCode == '39') {
       // right arrow
       currentTet.goRight();
    }

}

//drawing 
function drawTet(tet){
    let xOffset=tet.pos.x;
    let yOffset=tet.pos.y;
    for(let x=0;x<3;x++)
        for(let y=0;y<3;y++){
            if(tet.tetromino[y*3+x]===1){
                drawBox(x+xOffset,y+yOffset,'red');
            }
        }
}
function drawWell(){    
    for (let y=0;y<height;y++){
        for (let x=0;x<width;x++){
            //if (well[x][y]===0)
            drawBox(x,y,color[well[x][y]])
        } 
    }
}

//add keyboards  bindings 
//add row clearing algorithm 