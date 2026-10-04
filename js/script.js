const app = new PIXI.Application();

await app.init({
    width : 360,
    height: 640,
    canvas: document.querySelector('#game-canvas'),
    background: 0xfdf2e3,
    antialias: false,
})






// const GAME_SIZE_W = 360;
// const GAME_SIZE_H = 640;


// const PLATFORM_SIZE_W = 42;
// const PLATFORM_SIZE_H = 14;
// const BALL_SIZE = 16;
// const TILES_SIZE_W = 32;
// const TILES_SIZE_H = 16;


// const TILE_NUMBS = 9;
// const TILES_ROWS = 4;
// const TILE_OFFSET_X = 36;
// const TILE_OFFSET_Y = 80;



// const PLATFORM_TOP_Y = GAME_SIZE_H - 20 -PLATFORM_SIZE_H; 

// const BALL_SPEED = 3;
// const PLATFORM_SPEED = 6;
// let platform_X = 116;


// const assets =await PIXI.Assets.load([
//     'assets/ball.png',
//     'assets/platform.png',
//     'assets/tile_1.png',
//     'assets/tile_2.png',
//     'assets/tile_3.png',
//     'assets/game_background.png',
//     'assets/border_game.png',
//     'assets/panel_lost.png',
//     'assets/panel_start.png',

// ]);

// const platform =  new PIXI.Sprite( assets['assets/platform.png']);
// platform.width = PLATFORM_SIZE_W;
// platform.height = PLATFORM_SIZE_H;
// platform.x = platform_X;
// platform.y = PLATFORM_TOP_Y;
// app.stage.addChild(platform);

// const ball = new PIXI.Sprite(assets['assets/ball.png']);
// ball.width = BALL_SIZE;
// ball.height = BALL_SIZE;
// ball.x = ballX;
// ball.y =ballY;
// app.stage.addChild(ball);

// const panelStart = new PIXI.Sprite(assets['assets/panel_start.png']);
// panelStart.x = GAME_SIZE_W/2;
// panelStart.y = GAME_SIZE_H/2;
// panelStart.visible = true;
// app.stage.addChild(panelStart);

// const panelLost = new PIXI.Sprite(assets['assets/panel_lost.png']);
// panelLost.x = GAME_SIZE_W/2;
// panelLost.y = GAME_SIZE_H/2;
// panelLost.visible = true;
// app.stage.appendChild(panelLost);






// var buttons = {
//     ArrowLeft: false,
//     ArrowRight: false,
//     KeyA: false,
//     KeyD:false,
// };

// // когда кнопка нажата
// document.addEventListener('keydown', function(event) {
//     if(event.code in buttons){
//         buttons[event.code] = true;
//         event.preventDefault();   
//     }
// });

// // когда кнопку отпустили 
// document.addEventListener('keyup', function(event){
//     if(event.code in buttons){
//         buttons[event.code] = false;
//         event.preventDefault();
//     }
// });

// function loop_event(){
//     if ( buttons.ArrowLeft || buttons.KeyA){
//         platform_X -= SPEED;
//     }

//     if (buttons.ArrowRight ||buttons.KeyD){
//         platform_X += SPEED;
//     }
//     if(platform_X<0){
//         platform_X = 0;
//     }
//     if(platform_X > GAME_SIZE_W-PLATFORM_SIZE_W){
//         platform_X = GAME_SIZE_W-PLATFORM_SIZE_W;
//     }
//     PLATFORM.style.left = platform_X +'px';
//     move_ball();


// }
// // повторение каждые 16 миллисекунд
// setInterval(loop_event, 16);




// /* Блок движения шара */


// //начаольное положение шарика


// let ballX = 116;
// let ballY = 500;

// let ballSpeed_X = 4;
// let ballSpeed_Y = -4 ;

// let startButton = false;  

// document.addEventListener('keydown', function(event){ 
//     if (event.code == 'Space'){
//         startButton = true;  
//     }
// });

// function move_ball(){
//     if (startButton){
//         ballX += ballSpeed_X;
//         ballY += ballSpeed_Y;
//     }
//     if(ballX + BALL_SIZE > GAME_SIZE_W){
//         ballX = GAME_SIZE_W - BALL_SIZE;
//         ballSpeed_X = - ballSpeed_X ; 
  
//     }
//     if (ballX < 0){
//         ballX = 0;
//         ballSpeed_X = -ballSpeed_X;  
//     }
//     if (ballY < 0){
//         ballY = 0;
//         ballSpeed_Y = -ballSpeed_Y;
//     }
//     if (ballY + BALL_SIZE >GAME_SIZE_H ){
//         ballY = GAME_SIZE_H - BALL_SIZE;  
//         MESSAGE.classList.remove('hidden');
//         startButton = false; 


//     }
//     if ( ballSpeed_Y > 0
//         &&(ballY + BALL_SIZE  >= PLATFORM_TOP_Y)
//         &&((ballX + BALL_SIZE > platform_X)
//         && (ballX< platform_X+PLATFORM_SIZE_W))){
//         ballY = PLATFORM_TOP_Y - BALL_SIZE;
//         ballSpeed_Y = - ballSpeed_Y;
//     }

//     for(let i = 0; i < tiles.length; i++){
//         const tile =tiles[i];
//         if(!tile.alive) continue;
//         if( ballY < tile.y + TILES_SIZE_H
//             && ballX + BALL_SIZE > tile.x
//             && ballX > tile.x + TILES_SIZE_W
//         ){
//             tile.alive = false;
//             tile.el.remove();
//             ballSpeed_Y = -ballSpeed_Y;
//             break;


//         }

        
//     }
    

    

//     BALL.style.top = ballY + 'px';
//     BALL.style.left   = ballX + 'px';
    

// } 


// // Плиточки 





// let tiles = [];
// let x = 0;
// let y = 0;
 
// const offset_x =20;

// for (let i = 0; i < TILE_NUMBS; i++){
//     for ( let j = 0; j < TILES_ROWS; j++){
//         const el = document.createElement('div');
//         el.className = 'tile';
        
//         x = i * TILES_SIZE_W;
//         y = j * TILES_SIZE_H;
//         tiles.push({x,y, alive: true, el});
//         el.style.left = offset_x + x + 'px';
//         el.style.top = y  + 'px';

//         TILES_CONTAINER.appendChild(el);


//     }

// }


