"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Класс для організаціЇ Game Loop
//Для організаціЇ гри використовується requestAnimationFrame
var Game = function () {
    function Game(gameField, headerField) {
        _classCallCheck(this, Game);

        this.gameField = gameField;
        this.headerField = headerField;
        this._life = 0;
        this._score = 0;
        this._stop = false;

        this.round = new Round();
        this.header = new Header({});
        this._gameSceneArr = [];

        this._initEvent();
        this.setScene({
            scene: StartScene,
            round: this.round,
            isClear: true
        });
        this.start();
    }

    _createClass(Game, [{
        key: "_initEvent",
        value: function _initEvent() {
            var _this = this;

            //зберігає натиснуті кнопки та їх стан
            this.keys = {};

            $(document).on("keydown", function (e) {
                _this.keys[e.which] = true;
            });

            $(document).on("keyup", function (e) {
                _this.keys[e.which] = false;
            });

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


            $(document).on("dragstart", function (event) {
                event.preventDefault();
            });

            $(document).on("mousedown", function (event) {
                event.preventDefault();
            });

            /*document.addEventListener( "dragstart", ( event ) => {
                event.preventDefault();
            } );
              document.addEventListener( "mousedown", ( event ) => {
                event.preventDefault();
            } );*/

            $(document).on("contextmenu", function (event) {
                if ($(".wrapper *").is($(event.target))) {
                    event.preventDefault();
                }
            });

            /* document.addEventListener( "contextmenu", ( event ) => {
                 let wrapper = document.querySelector( ".wrapper" );
                 if ( !wrapper.contains( event.target ) ) {
                     return;
                 }
                 event.preventDefault();
             } );*/
        }
    }, {
        key: "setScene",
        value: function setScene(options) {
            if (options.isClear) {
                this.gameField.empty();
                this.headerField.empty();
            }

            var scene = new options.scene(this, options.gameStatus);

            //очищення масиву сцен, якщо запускається
            //GameScene або StartScene
            if (scene instanceof GameScene) {
                this._gameSceneArr = [];
            }

            if (this._activeScene) {
                this._gameSceneArr.push(this._activeScene);
            }
            this._activeScene = scene;
        }

        //повертає попередню сцену, яку збережено до масиву

    }, {
        key: "returnScene",
        value: function returnScene(isOnBoard) {
            var lastScene = this._gameSceneArr.pop();
            //Після втрати шара, якщо присутні життя шар повертається на дошку і повертається стара сцена
            if (isOnBoard) {
                lastScene.ballOnBoard = true;
            }
            this._activeScene = lastScene;
        }

        //основні методи для зміни кадрів у сцені

    }, {
        key: "update",
        value: function update(dt) {
            this._activeScene.update(dt);
        }
    }, {
        key: "render",
        value: function render(dt) {
            this._activeScene.render(dt);
            this._renderHeader(dt);
        }
    }, {
        key: "_renderHeader",
        value: function _renderHeader() {

            if (!this.headerField.find("*").is($(this.header.getElem()))) {
                this.headerField.append($(this.header.getElem()));
            }

            /*if ( !this.headerField.contains( this.header.getElem() ) ) {
                this.headerField.appendChild( this.header.getElem() );
            }*/
        }

        //Використовується this._stop для зупинки анімаціЇ, бо при виклику cancelAnimationFrame()
        //ззовні Game зупиняє вже початий requestAnimationFrame, а наступний викликається
        //this._stop допомагає не створювати новий requestAnimationFrame

    }, {
        key: "stop",
        value: function stop() {
            this._stop = true;
        }
    }, {
        key: "start",
        value: function start() {
            var _this2 = this;

            this._stop = false;
            var last = performance.now(),
                fps = 60,
                slomo = 0.5,
                // коефіціент сповільнення рендерінгу
            step = 1 / fps,
                slowStep = slomo * step,
                dt = 0,
                now = void 0;

            var frame = function frame() {
                now = performance.now();
                dt = dt + Math.min(1, (now - last) / 1000);

                while (dt > slowStep) {
                    dt = dt - slowStep;
                    _this2.update(step);
                }

                last = now;
                _this2.render(dt / slomo * fps);

                if (!_this2._stop) {
                    requestAnimationFrame(frame);
                }
            };

            requestAnimationFrame(frame);
        }

        //перевірка натиску кнопки, true лише після зміни статусу
        // this._lastKeyState

    }, {
        key: "checkKeyPress",
        value: function checkKeyPress(keyCode) {
            var isKeyPressed = !!this.keys[keyCode];
            this._lastKeyState = this._lastKeyState || {};

            if (typeof this._lastKeyState[keyCode] === 'undefined') {
                this._lastKeyState[keyCode] = isKeyPressed;
                return false;
            }

            if (this._lastKeyState[keyCode] !== isKeyPressed) {
                this._lastKeyState[keyCode] = isKeyPressed;
                return isKeyPressed;
            } else {
                return false;
            }
        }
    }, {
        key: "life",
        get: function get() {
            return this._life;
        },
        set: function set(value) {
            this._life = value;
            this.header.setLife(value);
        }
    }, {
        key: "score",
        get: function get() {
            return this._score;
        },
        set: function set(value) {
            this._score = value;
            this.header.setScore(value);
        }
    }]);

    return Game;
}();

//Запуск гри


var gameLounch = new Game($("#game-field"), $("#header-field"));