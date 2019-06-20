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

        $(document).on("keydown", ( e ) => {
            this.keys[ e.which ] = true;
        } );


        $(document).on("keyup", ( e ) => {
            this.keys[ e.which ] = false;
        } );

        /*
        document.addEventListener( "keydown", ( e ) => {
            this.keys[ e.which ] = true;
        } );

        document.addEventListener( "keyup", ( e ) => {
            this.keys[ e.which ] = false;
        } );
*/

        //відманяють події за замовчуванням:
        //виділення тексту, виклик контекстного меню


        $(document).on("dragstart", ( event ) => {
            event.preventDefault();
        } );

        $(document).on("mousedown", ( event ) => {
            event.preventDefault();
        } );

        /*document.addEventListener( "dragstart", ( event ) => {
            event.preventDefault();
        } );

        document.addEventListener( "mousedown", ( event ) => {
            event.preventDefault();
        } );*/

        $(document).on("contextmenu", ( event ) => {
             if ($(".wrapper *").is($(event.target)) ) {
                 event.preventDefault();
             }
        } );

       /* document.addEventListener( "contextmenu", ( event ) => {
            let wrapper = document.querySelector( ".wrapper" );
            if ( !wrapper.contains( event.target ) ) {
                return;
            }
            event.preventDefault();
        } );*/
    }

    setScene( options ) {
        if ( options.isClear ) {
            this.gameField.empty();
            this.headerField.empty();
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

        if (!this.headerField.find("*").is( $( this.header.getElem() ) ) ) {
            this.headerField.append( $(this.header.getElem()) );
        }

        /*if ( !this.headerField.contains( this.header.getElem() ) ) {
            this.headerField.appendChild( this.header.getElem() );
        }*/
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



//Запуск гри
let gameLounch = new Game( $("#game-field" ), $( "#header-field" ) );

