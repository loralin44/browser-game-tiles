class BreakoutGame{
    constructor({canvasEl, scoreEl, pauseBnt, restartBnt,livesEls}){
        this.canvasEl = canvasEl;
        this.scoreEl = scoreEl;
        this.pauseBnt = pauseBnt;
        this.restartBnt = restartBnt;
        this.livesEls = livesEls;


        this.GAME_SIZE_W = 328;
        this.GAME_SIZE_H = 608;

        this.PLATFORM_SIZE_W = 80;
        this.PLATFORM_SIZE_H = 30;
        this.BALL_SIZE = 24;
        this.TILES_SIZE_W = 48;
        this.TILES_SIZE_H = 24;
        
        this.TILE_NUMBS   = 6;
        this.TILES_ROWS   = 8;
        this.TILE_OFFSET_X = 36;
        this.TILE_OFFSET_Y = 40;

        this.PLATFORM_TOP_Y = this.GAME_SIZE_H - 20 - this.PLATFORM_SIZE_H;
        this.PLATFORM_SPEED = 6;
        this.BALL_SPEED_MAX = 8;

        this.platform_X = (this.GAME_SIZE_W - this.PLATFORM_SIZE_W) / 2;
        this.ballX = this.GAME_SIZE_W / 2 - this.BALL_SIZE / 2;
        this.ballY = this.GAME_SIZE_H - this.PLATFORM_SIZE_H - 60;
        
        this.isPaused = false;
        this.startButton = false;
        this.score  = 0;
        this.lives = 3;
       

        this.ballSpeed = 3;
        this.ballAngle = -Math.PI / 4;
        this.buttons = { ArrowLeft: false, ArrowRight: false, KeyA: false, KeyD: false };

        this.tiles = [];
        this.app   = null;
        this.assets = null;
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._loop = this._loop.bind(this);
        this._onPauseClick = this._onPauseClick.bind(this);
        this._onRestartClick = this._onRestartClick.bind(this);

        this._destroyed = false;
    }
    async init() {
        this.app = new PIXI.Application();

        await this.app.init({
            width: 362,
            height: 640,
            canvas: this.canvasEl,
            background: 0xfdf2e3,
            antialias: false,
        });

        this.assets = await PIXI.Assets.load([
            'assets/ball_3.png',
            'assets/platform_5.png',
            'assets/tile_21.png',
            'assets/tile_22.png',
            'assets/tile_23.png',
            'assets/game_background.png',
            'assets/border_game.png',
            'assets/panel_lost.png',
            'assets/panel_start.png',
            'assets/panel_win.png',
        ]);

        this._buildScene();

        document.addEventListener('keydown', this._onKeyDown);
        document.addEventListener('keyup',   this._onKeyUp);
        this.pauseBnt?.addEventListener('click',   this._onPauseClick);
        this.restartBnt?.addEventListener('click', this._onRestartClick);

        this.app.ticker.add(this._loop);

    }
    _buildScene() {
        const assets = this.assets;

        this.field = new PIXI.Container();
        this.field.scale.set(1.0);
        this.field.x = 0;
        this.field.y = 0;
        this.app.stage.addChild(this.field);

        const bg = new PIXI.Sprite(assets['assets/game_background.png']);
        bg.width  = 328;
        bg.height = 608;
        bg.x = 17;
        bg.y = 16;
        this.field.addChild(bg);

        this.tilesLayer = new PIXI.Container();
        this.tilesLayer.y = 16;
        this.field.addChild(this.tilesLayer);

        this.TILE_TEXTURE = [
            assets['assets/tile_21.png'],
            assets['assets/tile_22.png'],
            assets['assets/tile_23.png'],
        ];

        this.platform = new PIXI.Sprite(assets['assets/platform_5.png']);
        this.platform.width  = this.PLATFORM_SIZE_W;
        this.platform.height = this.PLATFORM_SIZE_H;
        this.platform.x = 17 + this.platform_X;
        this.platform.y = 16 + this.PLATFORM_TOP_Y;
        this.field.addChild(this.platform);

        this.ball = new PIXI.Sprite(assets['assets/ball_3.png']);
        this.ball.width  = this.BALL_SIZE;
        this.ball.height = this.BALL_SIZE;
        this.ball.x = 17 + this.ballX;
        this.ball.y = 16 + this.ballY;
        this.field.addChild(this.ball);

        this.panelStart = new PIXI.Sprite(assets['assets/panel_start.png']);
        this.panelStart.x = (this.GAME_SIZE_W - this.panelStart.width) / 2 + 17;
        this.panelStart.y = (this.GAME_SIZE_H - this.panelStart.height) / 2;
        this.panelStart.visible = true;
        this.field.addChild(this.panelStart);

        this.panelLost = new PIXI.Sprite(assets['assets/panel_lost.png']);
        this.panelLost.x = (this.GAME_SIZE_W - this.panelStart.width) / 2 + 17;
        this.panelLost.y = (this.GAME_SIZE_H - this.panelStart.height) / 2;
        this.panelLost.visible = false;
        this.field.addChild(this.panelLost);

        this.panelWin = new PIXI.Sprite(assets['assets/panel_win.png']);
        this.panelWin.x = (this.GAME_SIZE_W - this.panelStart.width) / 2 + 17;
        this.panelWin.y = (this.GAME_SIZE_H - this.panelStart.height) / 2;
        this.panelWin.visible = false;
        this.field.addChild(this.panelWin);

        const border = new PIXI.Sprite(assets['assets/border_game.png']);
        border.width  = 362;
        border.height = 640;
        border.x = 0;
        border.y = 0;
        this.app.stage.addChild(border);

        this._createTiles();
        this._updateScore();
        this._updateLives();
     
    }
    _createTiles() {
        this.tiles = [];
        for (let i = 0; i < this.TILE_NUMBS; i++) {
            for (let j = 0; j < this.TILES_ROWS; j++) {
                const texIndex = (i + j) % this.TILE_TEXTURE.length;
                const texture  = this.TILE_TEXTURE[texIndex];

                const sprite = new PIXI.Sprite(texture);
                sprite.width  = this.TILES_SIZE_W;
                sprite.height = this.TILES_SIZE_H;

                const x = this.TILE_OFFSET_X + i * this.TILES_SIZE_W;
                const y = this.TILE_OFFSET_Y + j * this.TILES_SIZE_H;

                sprite.x = x;
                sprite.y = y;

                this.tilesLayer.addChild(sprite);
                this.tiles.push({ x, y, alive: true, sprite });
            }
        }
    }
    _updateScore() {
        if (this.scoreEl) {
            this.scoreEl.textContent = String(this.score).padStart(6, '0');
        }
    }
    _updateLives(){
        const lifeEls = this.livesEls.querySelectorAll('.life');
        lifeEls.forEach((el, index) => {
            el.style.visibility = index < this.lives ? 'visible':'hidden';
            
        });
    }

    _checkWin() {
        const anyAlive = this.tiles.some(tile => tile.alive);
        if (!anyAlive) {
            this.panelWin.visible = true;
            this.startButton = false;
        }
    }

    _onKeyDown(event) {
        if (event.code === 'Space') {
            this.startButton = true;
            this.panelStart.visible = false;
            this.panelLost.visible  = false;
            this.panelWin.visible   = false;
            return;
        }
        if (event.code in this.buttons) {
            this.buttons[event.code] = true;
            event.preventDefault();
        }
    }

    _onKeyUp(event) {
        if (event.code in this.buttons) {
            this.buttons[event.code] = false;
            event.preventDefault();
        }
    }

    _onPauseClick() {
        this.isPaused = !this.isPaused;
    }

    _onRestartClick() {
        this.startButton = false;
        this.isPaused    = false;

        this.ballSpeed = 1;
        this.ballAngle = -Math.PI / 4;
        this.ballX     = this.GAME_SIZE_W / 2 - this.BALL_SIZE / 2;
        this.ballY = this.GAME_SIZE_H - this.PLATFORM_SIZE_H - 60;

        for (let i = 0; i < this.tiles.length; i++) {
            const tile = this.tiles[i];
            tile.alive = true;
            tile.sprite.visible = true;
        }

        this.panelLost.visible  = false;
        this.panelStart.visible = true;
        this.panelWin.visible   = false;

        this.platform_X = (this.GAME_SIZE_W - this.PLATFORM_SIZE_W) / 2;
        this.score = 0;
        this._updateScore();
        this.lives =3;
        this._updateLives();

        
        this.platform.x = 17 + this.platform_X;
        this.ball.x     = 17 + this.ballX;
        this.ball.y     = 16 + this.ballY;
    }
     _moveBall() {
        const BALL_SIZE = this.BALL_SIZE;
        const GAME_SIZE_W = this.GAME_SIZE_W;
        const GAME_SIZE_H = this.GAME_SIZE_H;

        if (this.startButton) {
            this.ballX += Math.cos(this.ballAngle) * this.ballSpeed;
            this.ballY += Math.sin(this.ballAngle) * this.ballSpeed;
        }

        if (this.ballX + BALL_SIZE > GAME_SIZE_W) {
            this.ballX = GAME_SIZE_W - BALL_SIZE;
            this.ballAngle = Math.PI - this.ballAngle;
        }
        if (this.ballX < 0) {
            this.ballX = 0;
            this.ballAngle = Math.PI - this.ballAngle;
        }
        if (this.ballY < 0) {
            this.ballY = 0;
            this.ballAngle = -this.ballAngle;
        }
        if (this.ballY + BALL_SIZE > GAME_SIZE_H) {
            this.lives-=1;
            this._updateLives();
            if(this.lives > 0 ){
               this.ballSpeed = 1;
                this.ballAngle = -Math.PI / 4;
                this.ballX     = this.GAME_SIZE_W / 2 - this.BALL_SIZE / 2;
                this.ballY = this.GAME_SIZE_H - this.PLATFORM_SIZE_H - 60;
                this.startButton = false;

            }else if (this.lives === 0){
                this.ballY = GAME_SIZE_H - BALL_SIZE;
                this.panelLost.visible = true;
                this.startButton = false;
                
            }
            
        }

        // столкновение с платформой
        if (
            Math.sin(this.ballAngle) > 0 &&
            this.ballY + BALL_SIZE >= this.PLATFORM_TOP_Y &&
            this.ballY + BALL_SIZE <= this.PLATFORM_TOP_Y + this.PLATFORM_SIZE_H &&
            this.ballX + BALL_SIZE > this.platform_X &&
            this.ballX < this.platform_X + this.PLATFORM_SIZE_W
        ) {
            const ballCenterX     = this.ballX + BALL_SIZE / 2;
            const platformCenterX = this.platform_X + this.PLATFORM_SIZE_W / 2;
            const hitPosition = (ballCenterX - platformCenterX) / (this.PLATFORM_SIZE_W / 2);

            this.ballAngle = hitPosition * (Math.PI / 3) - Math.PI / 2;
            this.ballY = this.PLATFORM_TOP_Y - BALL_SIZE;
        }

        // столкновение с плиточками
        let collisionHandler = false;

        for (let i = 0; i < this.tiles.length; i++) {
            const tile = this.tiles[i];
            if (!tile.alive) continue;

            if (
                this.ballY < tile.y + this.TILES_SIZE_H &&
                this.ballY + BALL_SIZE > tile.y &&
                this.ballX + BALL_SIZE > tile.x &&
                this.ballX < tile.x + this.TILES_SIZE_W
            ) {
                const fromLeft   = this.ballX + BALL_SIZE - tile.x;
                const fromRight  = tile.x + this.TILES_SIZE_W - this.ballX;
                const fromTop    = this.ballY + BALL_SIZE - tile.y;
                const fromBottom = tile.y + this.TILES_SIZE_H - this.ballY;

                const velX = Math.cos(this.ballAngle);
                const velY = Math.sin(this.ballAngle);

                const hitFromLeft   = fromLeft   < fromRight  && velX > 0;
                const hitFromRight  = fromRight  < fromLeft   && velX < 0;
                const hitFromTop    = fromTop    < fromBottom && velY > 0;
                const hitFromBottom = fromBottom < fromTop    && velY < 0;

                const hit = hitFromLeft || hitFromRight || hitFromBottom || hitFromTop;
                if (!hit) continue;

                tile.alive = false;
                tile.sprite.visible = false;
                this.score += 10;
                this._updateScore();
                this._checkWin();

                if (!collisionHandler) {
                    if (hitFromLeft || hitFromRight) {
                        this.ballAngle = Math.PI - this.ballAngle;
                    }
                    if (hitFromTop || hitFromBottom) {
                        this.ballAngle = -this.ballAngle;
                    }
                    collisionHandler = true;

                    if (this.ballSpeed < this.BALL_SPEED_MAX) {
                        this.ballSpeed *= 1.05;
                    }
                }
                break;
            }
        }
        this.ball.x = 17 + this.ballX;
        this.ball.y = 16 + this.ballY;
    }

    _loop() {
        if (this._destroyed) return;
        if (this.isPaused) return;

        if (this.buttons.ArrowLeft || this.buttons.KeyA) {
            this.platform_X -= this.PLATFORM_SPEED;
        }
        if (this.buttons.ArrowRight || this.buttons.KeyD) {
            this.platform_X += this.PLATFORM_SPEED;
        }

        if (this.platform_X < 0) {
            this.platform_X = 0;
        }
        if (this.platform_X > this.GAME_SIZE_W - this.PLATFORM_SIZE_W) {
            this.platform_X = this.GAME_SIZE_W - this.PLATFORM_SIZE_W;
        }
        this.platform.x = 17 + this.platform_X;

        this._moveBall();
    }

    destroy() {
        this._destroyed = true;

        document.removeEventListener('keydown', this._onKeyDown);
        document.removeEventListener('keyup',   this._onKeyUp);
        this.pauseBnt?.removeEventListener('click',   this._onPauseClick);
        this.restartBnt?.removeEventListener('click', this._onRestartClick);

        if (this.app) {
            this.app.ticker.remove(this._loop);
            this.app.destroy(true, { children: true });
            this.app = null;
        }

        this.tiles = [];
        this.assets = null;
    }
}



const game = new BreakoutGame({
    canvasEl: document.querySelector('#game-canvas'),
    scoreEl: document.querySelector('#score'),
    pauseBnt: document.querySelector('.bnt-pause'),
    restartBnt: document.querySelector('.bnt-restart'),
    livesEls: document.querySelector('#lives')
});


await game.init();


    










