"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ball = function () {
    function Ball(options) {
        _classCallCheck(this, Ball);

        this._game = options.game;
        this.speedCoef = options.speed || 100;
        this._startDirection = new Vector.FromObj(options.direction || {
            x: 0.1,
            y: -1
        });

        this._radius = 15;
        this._init();
    }

    _createClass(Ball, [{
        key: "_init",
        value: function _init() {
            this._ball = document.createElement("div");
            this._ball.classList.add("ball");
            this.direction = this._startDirection.norm();
        }
    }, {
        key: "render",
        value: function render() {
            // console.log("render", this.renderPosition);
            this._setPosition(this.renderPosition);
        }
    }, {
        key: "getNormal",
        value: function getNormal(direction) {
            return this.position.sum(direction.scalar(this._radius));
        }

        //Пошук координат центру кола, яке проходить через coord і має напрямок this.direction

    }, {
        key: "calcCentr",
        value: function calcCentr(coord) {
            var k = this.direction.y / this.direction.x;
            var d = this.position.y - k * this.position.x;
            var a = 1 + k * k;
            var b = -2 * coord.x + 2 * k * d - 2 * k * coord.y;
            var c = coord.x * coord.x + d * d - 2 * d * coord.y + coord.y * coord.y - this._radius * this._radius;
            var resX = calcQuad(a, b, c);
            if (!resX) {
                var error = new ErrorEvent("Not found coord centr of ball");
                console.log(error);
            }
            if (resX.x_1 * this.direction.x < resX.x_2 * this.direction.x) {
                return new Vector(resX.x_1, k * resX.x_1 + d);
            } else {
                return new Vector(resX.x_2, k * resX.x_2 + d);
            }
        }
    }, {
        key: "sendToBoard",
        value: function sendToBoard(board) {
            this.direction = this._startDirection.norm();
            this.renderPosition = board.vecForBallStart(this);
            this.position = board.vecForBallStart(this);
        }
    }, {
        key: "_setPosition",
        value: function _setPosition(coord) {
            //console.log(coord);
            this._ball.style.left = coord.x - this._radius + "px";
            this._ball.style.top = coord.y - this._radius + "px";
        }
    }, {
        key: "getElem",
        value: function getElem() {
            return this._ball;
        }
    }, {
        key: "radius",
        get: function get() {
            return this._radius;
        }
    }]);

    return Ball;
}();