const app = new PIXI.Application();

await app.init({
    width : 362,
    height: 640,

    canvas: document.querySelector('#game-canvas'),
    background: 0xfdf2e3,
    antialias: false,
})






const GAME_SIZE_W = 328;
const GAME_SIZE_H = 640;


const PLATFORM_SIZE_W = 80;
const PLATFORM_SIZE_H = 30;
const BALL_SIZE = 32;
const TILES_SIZE_W = 48;
const TILES_SIZE_H = 24;


const TILE_NUMBS = 6;
const TILES_ROWS = 8;
const TILE_OFFSET_X = 36;
const TILE_OFFSET_Y = 40;



const PLATFORM_TOP_Y = GAME_SIZE_H - 20 -PLATFORM_SIZE_H; 

const BALL_SPEED = 3;
const PLATFORM_SPEED = 6;
let platform_X = (360-PLATFORM_SIZE_W)/2;
let ballX = 360/2 - BALL_SIZE/2;
let ballY = 500;

const assets =await PIXI.Assets.load([
    'assets/ball_2.png',
    'assets/platform_5.png',
    'assets/tile_21.png',
    'assets/tile_22.png',
    'assets/tile_23.png',
    'assets/game_background.png',
    'assets/border_game.png',
    'assets/panel_lost.png',
    'assets/panel_start.png',

]);

const field = new PIXI.Container();
field.scale.set(1.0);
field.x =0;
field.y =0;
app.stage.addChild(field);

const bg = new PIXI.Sprite(assets['assets/game_background.png']);
bg.width = 328;
bg.height = 608;
bg.x =(362-328)/2;
bg.y =(640-608)/2;
field.addChild(bg);

const tilesLayer = new PIXI.Container();
field.addChild(tilesLayer);

const TILE_TEXTURE = [
    assets['assets/tile_21.png'],
    assets['assets/tile_22.png'],
    assets['assets/tile_23.png'],
];



const platform =  new PIXI.Sprite( assets['assets/platform_5.png']);
platform.width = PLATFORM_SIZE_W;
platform.height = PLATFORM_SIZE_H;
platform.x = platform_X;
platform.y = PLATFORM_TOP_Y;
field.addChild(platform);

const ball = new PIXI.Sprite(assets['assets/ball_2.png']);
ball.width = BALL_SIZE;
ball.height = BALL_SIZE;
ball.x = ballX;
ball.y =ballY;
field.addChild(ball);

const panelStart = new PIXI.Sprite(assets['assets/panel_start.png']);
panelStart.x = (362 - 160 )/2;
panelStart.y = (640 - 60)/2;
panelStart.visible = true;
field.addChild(panelStart);

const panelLost = new PIXI.Sprite(assets['assets/panel_lost.png']);
panelLost.x =  (362 - 160 )/2;
panelLost.y = (640 - 60)/2;
panelLost.visible = false;
field.addChild(panelLost);


const border = new PIXI.Sprite(assets['assets/border_game.png']);
border.width = 362;
border.height = 640;
border.x =0;
border.y =0;
app.stage.addChild(border);




let tiles =[];


for (let i = 0; i < TILE_NUMBS; i++){
    for ( let j = 0; j < TILES_ROWS; j++){
        const texIndex = ( i + j ) % TILE_TEXTURE.length;
        const texture =TILE_TEXTURE[texIndex];

        const sprite = new PIXI.Sprite(texture);
        sprite.width = TILES_SIZE_W;
        sprite.height = TILES_SIZE_H;

        const x = TILE_OFFSET_X + i * TILES_SIZE_W;
        const y = TILE_OFFSET_Y + j * TILES_SIZE_H;

        sprite.x = x;
        sprite.y = y;

        tilesLayer.addChild(sprite);
        tiles.push({x,y,alive: true, sprite});


    }

}

const buttons = {
    ArrowLeft: false,
    ArrowRight: false,
    KeyA: false,
    KeyD:false,
};

let ballSpeed_X = 4;
let ballSpeed_Y = -4 ;

let startButton = false;  

document.addEventListener('keydown', function(event){ 
    if (event.code == 'Space'){
        startButton = true; 
        panelStart.visible = false;  
        panelLost.visible = false;

       
        ballX = 360 / 2 - BALL_SIZE / 2;
        ballY = 500;
        ballSpeed_X= 4;
        ballSpeed_Y = -4;
        
    }
});

// когда кнопка нажата
document.addEventListener('keydown', function(event) {
    if(event.code in buttons){
        buttons[event.code] = true;
        event.preventDefault();   
    }
});

// когда кнопку отпустили 
document.addEventListener('keyup', function(event){
    if(event.code in buttons){
        buttons[event.code] = false;
        event.preventDefault();
    }
});


function move_ball(){
    if (startButton){
        ballX += ballSpeed_X;
        ballY += ballSpeed_Y;
    }
    if(ballX + BALL_SIZE > GAME_SIZE_W){
        ballX = GAME_SIZE_W - BALL_SIZE;
        ballSpeed_X = - ballSpeed_X ; 
  
    }
    if (ballX < 0){
        ballX = 0;
        ballSpeed_X = -ballSpeed_X;  
    }
    if (ballY < 0){
        ballY = 0;
        ballSpeed_Y = -ballSpeed_Y;
    }
    if (ballY + BALL_SIZE >GAME_SIZE_H ){
        ballY = GAME_SIZE_H - BALL_SIZE;  
        panelLost.visible = true;
        startButton = false; 


    }
    if ( ballSpeed_Y > 0
        &&(ballY + BALL_SIZE  >= PLATFORM_TOP_Y)
        &&((ballX + BALL_SIZE > platform_X)
        && (ballX< platform_X+PLATFORM_SIZE_W))){
        ballY = PLATFORM_TOP_Y - BALL_SIZE;
        ballSpeed_Y = - ballSpeed_Y;
    }

    for(let i = 0; i < tiles.length; i++){
        const tile = tiles[i];
        if(!tile.alive) continue;
        if( ballY < tile.y + TILES_SIZE_H
            && ballX + BALL_SIZE > tile.x
            && ballX > tile.x + TILES_SIZE_W
        ){
            tile.alive = false;
            tile.sprite.visible = false;
            ballSpeed_Y = -ballSpeed_Y;
            break;
        }
   
    }

    ball.x = ballX;
    ball.y = ballY;
    
} 



function loop_event(){
    if ( buttons.ArrowLeft || buttons.KeyA){
        platform_X -= PLATFORM_SPEED;
    }

    if (buttons.ArrowRight ||buttons.KeyD){
        platform_X += PLATFORM_SPEED;
    }
    if(platform_X<0){
        platform_X = 0;
    }
    if(platform_X > GAME_SIZE_W-PLATFORM_SIZE_W){
        platform_X = GAME_SIZE_W-PLATFORM_SIZE_W;
    }
    platform.x = platform_X;
    move_ball();


 }

app.ticker.add(loop_event);




// /* Блок движения шара */


// //начаольное положение шарика









// // Плиточки 





// let tiles = [];
// let x = 0;
// let y = 0;
 
// const offset_x =20;




