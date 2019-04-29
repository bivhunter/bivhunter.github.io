"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ball = function () {
    function Ball(options) {
        _classCallCheck(this, Ball);

        //розмір шару
        this._game = options.game;

        this.position = {};
        this.renderPosition = {};
        this.speedCoef = options.speed || 100;

        this.direction = options.direction || {
            x: 0.01,
            y: -1
        };
        this.radius = 15;
    }

    _createClass(Ball, [{
        key: "_init",
        value: function _init() {
            this._ball = document.createElement("div");
            this._ball.classList.add("ball");
            this.direction = vectorNorm(this.direction);
        }

        //відмальовка шара

    }, {
        key: "render",
        value: function render(dt) {
            // console.log("render", this.renderPosition);
            this._setPosition(this.renderPosition);
        }
    }, {
        key: "getNormal",
        value: function getNormal(direction) {
            return vectorSum(this.position, vectorScalar(this.radius, direction));
        }
    }, {
        key: "calcCentr",
        value: function calcCentr(coord) {
            var k = this.direction.y / this.direction.x;
            var d = this.position.y - k * this.position.x;
            var a = 1 + k * k;
            var b = -2 * coord.x + 2 * k * d - 2 * k * coord.y;
            var c = coord.x * coord.x + d * d - 2 * d * coord.y + coord.y * coord.y - this.radius * this.radius;
            var resX = calcQuad(a, b, c);
            if (!resX) {
                var error = new ErrorEvent("Not found coord centr of ball");
                console.log(error);
            }
            if (resX.x_1 * this.direction.x < resX.x_2 * this.direction.x) {
                return {
                    x: resX.x_1,
                    y: k * resX.x_1 + d
                };
            } else {
                return {
                    x: resX.x_2,
                    y: k * resX.x_2 + d
                };
            }
        }
    }, {
        key: "sendToBoard",
        value: function sendToBoard(board) {
            var x = board.renderPosition;
            var y = board.topPosition - board.height / 2 - board.borderWidth - this.radius;
            console.log(x, y);

            //можливо перешкоджає залипанню шара
            if (isNaN(x) || isNaN(y)) {
                alert("x == NaN || y == NaN");
                x = 450;
                y = 557;
            }
            //console.log("send to board", x, y);
            this.direction = vectorNorm({
                x: 1,
                y: -2
            });
            this.renderPosition.x = x;
            this.renderPosition.y = y;
            this.position.x = x;
            this.position.y = y;
            // this._setPosition(x, y);
        }
    }, {
        key: "_setPosition",
        value: function _setPosition(coord) {
            //console.log(coord);
            this._ball.style.left = coord.x - this.radius + "px";
            this._ball.style.top = coord.y - this.radius + "px";
        }
    }, {
        key: "getElem",
        value: function getElem() {
            this._init();
            return this._ball;
        }
    }]);

    return Ball;
}();