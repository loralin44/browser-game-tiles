const GAME = document.querySelector('.game');
const PLATFORM = document.querySelector('#platform');

const GAME_SIZE_W = 360;
const GAME_SIZE_H = 640;
const PLATFORM_SIZE = 128;
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
    if(platform_X > GAME_SIZE_W-PLATFORM_SIZE){
        platform_X = GAME_SIZE_W-PLATFORM_SIZE;
    }
    PLATFORM.style.left = platform_X +'px';
    move_ball();


}
// повторение каждые 16 миллисекунд
setInterval(loop_event, 16);




/* Блок движения шара */


//начаольное положение шарика
const BALL = document.querySelector('#ball');

let ballX = 116;
let ballY = 500;
const BALL_SIZE = 32;
let ballSpeed_X = 4;
let ballSpeed_Y = -4;

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
        ballX = GAME_SIZE_W - BALL_SIZE ;
  
    }
    if (ballX < 0){
        ballX = 0;
    }
    if (ballY < 0){
        ballY = 0;
    }
    if (ballY >GAME_SIZE_H ){
        ballY = GAME_SIZE_H - BALL_SIZE;  

    }
    

    BALL.style.top = ballY + 'px';
    BALL.style.left = ballX + 'px';
    

} 

