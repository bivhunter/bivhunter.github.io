class Game {
    constructor( gameField, headerField ) {
        this.gameField = gameField;
        this.headerField = headerField;
        this._life = 1;
        this._score = 0;

        this._stop = false;
        //this._isStart = false;
        this.round = new Round();
        this.header = new Header( {} );
        this._gameSceneArr = [];
        //this._start();

        this._initEvent();
        this.setScene( {
            scene: StartScene,
            round: this.round,
            isClear: true
        } );
        this.start();
    }

    get life() {
        return this._life;
    }

    set life(value) {
        this._life = value;
        this.header.setLife( value );
    }

    get score() {
        return this._score;
    }

    set score( value ) {
        this._score = value;
        this.header.setScore( value );
    }
    _initEvent() {
        this.keys = {};
        document.addEventListener( "keydown", ( e ) => {
            this.keys[ e.which ] = true;
        } );

        document.addEventListener( "keyup", ( e ) => {
            this.keys[ e.which ] = false;
        } );

        document.addEventListener( "dragstart", ( event ) => {
            event.preventDefault();
        } );

        document.addEventListener( "mousedown", ( event ) => {
            event.preventDefault();
        } );

        document.addEventListener( "contextmenu", ( event ) => {
            let wrapper = document.querySelector( ".wrapper" );
            if ( !wrapper.contains( event.target ) ) {
                return;
            }
            event.preventDefault();
        } );
    }



    setScene( options ) {
        if ( options.isClear ) {
            this.gameField.innerHTML = "";
            this.headerField.innerHTML = "";
        }

        let scene = new options.scene( this, options.gameStatus );
        if ( scene instanceof GameScene ) {
            this._gameSceneArr = [];
        }

        if ( this._activeScene ) {
            this._gameSceneArr.push( this._activeScene );
        }
        this._activeScene = scene;
    }

    returnScene( isOnBoard ) {
        let lastScene = this._gameSceneArr.pop();
        //Після втрати шара, якщо присутні життя шар повертається на дошку і повертається стара сцена
        if ( isOnBoard ) {
            lastScene.ballOnBoard = true;
        }
        this._activeScene = lastScene;
    }

    update( dt ) {
        this._activeScene.update( dt );
    }

    render( dt ) {
        this._activeScene.render( dt );
        this._renderHeader( dt );
    }

    _renderHeader() {
        if ( !this.headerField.contains( this.header.getElem() ) ) {
            this.headerField.appendChild( this.header.getElem() );
        }
    }

    stop() {
        this._stop = true;
    }


    //Використовується this._stop для зупинки анімаціЇ, бо при виклику cancelAnimationFrame()
    //ззовні Game зупиняє вже початий requestAnimationFrame, а наступний викликається
    //this._stop допомагає не створювати новий requestAnimationFrame
    start() {

        this._stop = false;
        let last = performance.now(),
            fps = 60,
            slomo = 0.5, // коефіціент прискорення
            step = 1 / fps,
            slowStep = slomo * step,
            dt = 0,
            now;

        let frame = () => {
            now = performance.now();
            dt = dt + Math.min( 1, ( now - last ) / 1000 );
            while ( dt > slowStep ) {
                dt = dt - slowStep;
                console.log("update dt", dt);
                this.update( step );

            }
            last = now;

            console.log("render dt", dt, dt / slomo * fps);
            this.render( dt / slomo * fps );

            if ( !this._stop ) {
                requestAnimationFrame( frame );
            }
        };

        requestAnimationFrame( frame );
    }

    checkKeyPress( keyCode ) {
        let isKeyPressed = !!this.keys[ keyCode ];
        this._lastKeyState = this._lastKeyState || {};

        if ( typeof this._lastKeyState[ keyCode ] === 'undefined' ) {
            this._lastKeyState[ keyCode ] = isKeyPressed;
            return false;
        }

        if ( this._lastKeyState[ keyCode ] !== isKeyPressed ) {
            this._lastKeyState[ keyCode ] = isKeyPressed;
            return isKeyPressed;
        } else {
            return false;
        }
    }
}

class Vector {
    constructor() {}

    static norm(vec) {
        let x = vec.x,
            y = vec.y,
            d = Math.sqrt( x * x + y * y );

        return {
            x: x / d,
            y: y / d
        };
    }

    static sum ( vec1, vec2 ) {
        return {
            x: vec1.x + vec2.x,
            y: vec1.y + vec2.y
        };
    }

    static scalar ( num, vec ) {
        return {
            x: vec.x * num,
            y: vec.y * num
        };
    }

    static diff (vec1, vec2 ) {
        return {
            x: vec1.x - vec2.x,
            y: vec1.y - vec2.y
        };
    }

    static turn ( vec1, vec2 ) {
        return {
            x: vec1.x * vec2.x,
            y: vec1.y * vec2.y
        };
    }

    static scalarMult ( vec1, vec2 ) {
        return vec1.x * vec2.x + vec1.y * vec2.y;
    }

    static module ( vec ) {
        return Math.sqrt( vec.x * vec.x + vec.y * vec.y );
    }

    static turnAngle ( vec, angle ) {
        return {
            x: vec.x * Math.cos( angle ) - vec.y * Math.sin( angle ),
            y: vec.x * Math.sin( angle ) + vec.y * Math.cos( angle )
        };
    }
}

function calcQuad( a, b, c ) {
    let d = b * b - 4 * a * c;
    if ( d < 0 ) {
        return null;
    }

    let x_1 = ( -b + Math.sqrt( d ) ) / ( 2 * a );
    let x_2 = ( -b - Math.sqrt( d ) ) / ( 2 * a );
    return {
        x_1: x_1,
        x_2: x_2
    };
}

//Запуск гри
let gameLounch = new Game( document.getElementById( "game-field" ), document.getElementById( "header-field" ) );

/*document.getElementById("start").addEventListener("click", () => {
  gameLounch.start();
  setTimeout(() => {
    gameLounch.stop();
  }, 10000);
});

document.getElementById("stop").addEventListener("click", () => {
  gameLounch.stop();
});*/
/*let last = performance.now(),
  fps = 60,
  slomo = 1, // slow motion multiplier
  step = 1 / fps,
  slowStep = slomo * step,
  dt = 0,
  now;

let frame = () => {
  now = performance.now();
  dt = dt + Math.min(1, (now - last) / 1000);
  while (dt > slowStep) {
    dt = dt - slowStep;
    update(step);
  }
  last = now;

  render(dt / slomo * fps);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);*/