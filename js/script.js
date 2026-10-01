const GAME = document.querySelector('.game');
const PLATFORM = document.querySelector('#platform');

const GAME_SIZE = 360;
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
    if(platform_X > GAME_SIZE-PLATFORM_SIZE){
        platform_X = GAME_SIZE-PLATFORM_SIZE;
    }
    PLATFORM.computedStyleMap.left = platform_X +'px';


};
// повторение каждые 16 миллисекунд
setInterval(loop_event, 16);