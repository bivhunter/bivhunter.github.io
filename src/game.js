//Класс для організаціЇ Game Loop
//Для організаціЇ гри використовується requestAnimationFrame
class Game {
    constructor( gameField, headerField ) {
        this.gameField = gameField;
        this.headerField = headerField;
        this._life = 0;
        this._score = 0;
        this._stop = false;

        this.round = new Round();
        this.header = new Header( {} );
        this._gameSceneArr = [];

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
        //зберігає натиснуті кнопки та їх стан
        this.keys = {};
        document.addEventListener( "keydown", ( e ) => {
            this.keys[ e.which ] = true;
        } );

        document.addEventListener( "keyup", ( e ) => {
            this.keys[ e.which ] = false;
        } );

        //відманяють події за замовчуванням:
        //виділення тексту, виклик контекстного меню
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

        //очищення масиву сцен, якщо запускається
        //GameScene або StartScene
        if ( scene instanceof GameScene ) {
            this._gameSceneArr = [];
        }

        if ( this._activeScene ) {
            this._gameSceneArr.push( this._activeScene );
        }
        this._activeScene = scene;
    }

    //повертає попередню сцену, яку збережено до масиву
    returnScene( isOnBoard ) {
        let lastScene = this._gameSceneArr.pop();
        //Після втрати шара, якщо присутні життя шар повертається на дошку і повертається стара сцена
        if ( isOnBoard ) {
            lastScene.ballOnBoard = true;
        }
        this._activeScene = lastScene;
    }

    //основні методи для зміни кадрів у сцені
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

    //Використовується this._stop для зупинки анімаціЇ, бо при виклику cancelAnimationFrame()
    //ззовні Game зупиняє вже початий requestAnimationFrame, а наступний викликається
    //this._stop допомагає не створювати новий requestAnimationFrame
    stop() {
        this._stop = true;
    }

    start() {
        this._stop = false;
        let last = performance.now(),
            fps = 60,
            slomo = 0.5, // коефіціент сповільнення рендерінгу
            step = 1 / fps,
            slowStep = slomo * step,
            dt = 0,
            now;

        let frame = () => {
            now = performance.now();
            dt = dt + Math.min( 1, ( now - last ) / 1000 );

            while ( dt > slowStep ) {
                dt = dt - slowStep;
                this.update( step );

            }

            last = now;
            this.render( dt / slomo * fps );

            if ( !this._stop ) {
                requestAnimationFrame( frame );
            }
        };

        requestAnimationFrame( frame );
    }

    //перевірка натиску кнопки, true лише після зміни статусу
    // this._lastKeyState
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
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static FromObj(obj) {
        return new Vector(obj.x, obj.y);
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


    setValue() {
        if (arguments.length === 2) {
            this.x = arguments[0];
            this.y = arguments[1];
        } else {
            this.x = arguments[0].x;
            this.y = arguments[0].y;
        }
    }

    norm() {
        let x = this.x,
            y = this.y,
            d = Math.sqrt( x * x + y * y );
        return new Vector (x / d, y / d);
    }

    sum ( vec ) {
        return new Vector(this.x + vec.x, this.y + vec.y);
    }

    scalar ( num ) {
        return new Vector(this.x * num, this.y * num);
    }

    diff ( vec ) {
        return new Vector( this.x - vec.x, this.y - vec.y );
    }

    module () {
        return Math.sqrt( this.x * this.x + this.y * this.y );
    }

    turnAngle ( angle ) {
        this.setValue(this.x * Math.cos( angle ) - this.y * Math.sin( angle ),
            this.x * Math.sin( angle ) + this.y * Math.cos( angle ));
        return this;
    }
}

//Пошук коренів квадратного рівняння
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

