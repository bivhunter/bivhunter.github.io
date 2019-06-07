"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

            this.keys = {};
            document.addEventListener("keydown", function (e) {
                _this.keys[e.which] = true;
            });

            document.addEventListener("keyup", function (e) {
                _this.keys[e.which] = false;
            });

            document.addEventListener("dragstart", function (event) {
                event.preventDefault();
            });

            document.addEventListener("mousedown", function (event) {
                event.preventDefault();
            });

            document.addEventListener("contextmenu", function (event) {
                var wrapper = document.querySelector(".wrapper");
                if (!wrapper.contains(event.target)) {
                    return;
                }
                event.preventDefault();
            });
        }
    }, {
        key: "setScene",
        value: function setScene(options) {
            if (options.isClear) {
                this.gameField.innerHTML = "";
                this.headerField.innerHTML = "";
            }

            var scene = new options.scene(this, options.gameStatus);
            if (scene instanceof GameScene) {
                this._gameSceneArr = [];
            }

            if (this._activeScene) {
                this._gameSceneArr.push(this._activeScene);
            }
            this._activeScene = scene;
        }
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
            if (!this.headerField.contains(this.header.getElem())) {
                this.headerField.appendChild(this.header.getElem());
            }
        }
    }, {
        key: "stop",
        value: function stop() {
            this._stop = true;
        }

        //Використовується this._stop для зупинки анімаціЇ, бо при виклику cancelAnimationFrame()
        //ззовні Game зупиняє вже початий requestAnimationFrame, а наступний викликається
        //this._stop допомагає не створювати новий requestAnimationFrame

    }, {
        key: "start",
        value: function start() {
            var _this2 = this;

            this._stop = false;
            var last = performance.now(),
                fps = 60,
                slomo = 0.5,
                // коефіціент прискорення
            step = 1 / fps,
                slowStep = slomo * step,
                dt = 0,
                now = void 0;

            var frame = function frame() {
                now = performance.now();
                dt = dt + Math.min(1, (now - last) / 1000);
                while (dt > slowStep) {
                    dt = dt - slowStep;
                    console.log("update dt", dt);
                    _this2.update(step);
                }
                last = now;

                console.log("render dt", dt, dt / slomo * fps);
                _this2.render(dt / slomo * fps);

                if (!_this2._stop) {
                    requestAnimationFrame(frame);
                }
            };

            requestAnimationFrame(frame);
        }
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

var Vector = function () {
    function Vector(x, y) {
        _classCallCheck(this, Vector);

        this.x = x;
        this.y = y;
    }

    _createClass(Vector, [{
        key: "setValue",
        value: function setValue() {
            if (arguments.length === 2) {
                this.x = arguments[0];
                this.y = arguments[1];
            } else {
                this.x = arguments[0].x;
                this.y = arguments[0].y;
            }
        }
    }, {
        key: "norm",
        value: function norm() {
            var x = this.x,
                y = this.y,
                d = Math.sqrt(x * x + y * y);
            return new Vector(x / d, y / d);
        }
    }, {
        key: "sum",
        value: function sum(vec) {

            return new Vector(this.x + vec.x, this.y + vec.y);
        }
    }, {
        key: "scalar",
        value: function scalar(num) {

            return new Vector(this.x * num, this.y * num);
        }
    }, {
        key: "diff",
        value: function diff(vec) {

            return new Vector(this.x - vec.x, this.y - vec.y);
        }
    }, {
        key: "module",
        value: function module() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
    }, {
        key: "turnAngle",
        value: function turnAngle(angle) {
            this.setValue(this.x * Math.cos(angle) - this.y * Math.sin(angle), this.x * Math.sin(angle) + this.y * Math.cos(angle));
            return this;
        }
    }], [{
        key: "vectorFromObj",
        value: function vectorFromObj(obj) {
            return new Vector(obj.x, obj.y);
        }
    }, {
        key: "turn",
        value: function turn(vec1, vec2) {
            return {
                x: vec1.x * vec2.x,
                y: vec1.y * vec2.y
            };
        }
    }, {
        key: "scalarMult",
        value: function scalarMult(vec1, vec2) {
            return vec1.x * vec2.x + vec1.y * vec2.y;
        }
    }]);

    return Vector;
}();

function calcQuad(a, b, c) {
    var d = b * b - 4 * a * c;
    if (d < 0) {
        return null;
    }

    var x_1 = (-b + Math.sqrt(d)) / (2 * a);
    var x_2 = (-b - Math.sqrt(d)) / (2 * a);
    return {
        x_1: x_1,
        x_2: x_2
    };
}

//Запуск гри
var gameLounch = new Game(document.getElementById("game-field"), document.getElementById("header-field"));