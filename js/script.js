const GAME = document.querySelector('.game');
const PLATFORM = document.querySelector('#platform');

const GAME_SIZE_W = 360;
const GAME_SIZE_H = 640;
const PLATFORM_SIZE_W = 115;
const PLATFORM_SIZE_H =14;

const PLATFORM_TOP_Y = GAME_SIZE_H - 20 -PLATFORM_SIZE_H; 
const SPEED = 8;

let platform_X = 116;


 var buttons = {
    ArrowLeft: false,
    ArrowRight: false,
    KeyA: false,
    KeyD:false,
 };

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

function loop_event(){
    if ( buttons.ArrowLeft || buttons.KeyA){
        platform_X -= SPEED;
    }

    if (buttons.ArrowRight ||buttons.KeyD){
        platform_X += SPEED;
    }
    if(platform_X<0){
        platform_X = 0;
    }
    if(platform_X > GAME_SIZE_W-PLATFORM_SIZE_W){
        platform_X = GAME_SIZE_W-PLATFORM_SIZE_W;
    }
    PLATFORM.style.left = platform_X +'px';
    move_ball();


}
// повторение каждые 16 миллисекунд
setInterval(loop_event, 16);




/* Блок движения шара */


//начаольное положение шарика
const BALL = document.querySelector('#ball');
const MESSAGE = document.querySelector('#message');

let ballX = 116;
let ballY = 500;
const BALL_SIZE = 32;
let ballSpeed_X = 4;
let ballSpeed_Y = -4 ;

let startButton = false;  

document.addEventListener('keydown', function(event){ 
    if (event.code == 'Space'){
        startButton = true;  
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
        MESSAGE.classList.remove('hidden');
        startButton = false; 


    }
    if ( ballSpeed_Y > 0
        &&(ballY + BALL_SIZE  >= PLATFORM_TOP_Y)
        &&((ballX + BALL_SIZE > platform_X)
        && (ballX< platform_X+PLATFORM_SIZE_W))){
        ballY = PLATFORM_TOP_Y - BALL_SIZE;
        ballSpeed_Y = - ballSpeed_Y;
    }
    

    BALL.style.top = ballY + 'px';
    BALL.style.left   = ballX + 'px';
    

} 


// Плиточки 


const TILES_CONTAINER = document.querySelector('#tiles');

const TILES_SIZE_W = 64;
const TILES_SIZE_H = 18;

const TILE_NUMBS = Math.floor(GAME_SIZE_W/TILES_SIZE_W);
const TILES_ROWS = 6;

const TILE_OFFSET_TOP = 40;


let tiles = [];
let tile_x = 0;
let tile_y = 0;



for (let i = 0; i < TILE_NUMBS; i++){
    for ( let j = 0; j < TILES_ROWS; j++){
        const el = document.createElement('div');
        el.className = 'tile';
        
        tile_x = i * TILES_SIZE_W;
        tile_y = j * TILES_SIZE_H;
        tiles.push({tile_x,tile_y, alive: true, el});
        el.style.left = tile_x + 'px';
        el.style.top = tile_y  + 'px';

        TILES_CONTAINER.appendChild(el);


    }

}


