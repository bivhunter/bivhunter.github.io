"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Board = function () {
    function Board(options) {
        _classCallCheck(this, Board);

        this._gameField = options.gameField;

        this.moveMult = 0;

        this._K = 20;
        this._init();
    }

    _createClass(Board, [{
        key: "_init",
        value: function _init() {

            var board = document.createElement("div");
            board.classList.add("board");

            /*let boardRadius = document.createElement("div");
            let boardRadius_2 = document.createElement("div");
              boardRadius.classList.add("board-radius");
            boardRadius_2.classList.add("board-radius-2");
              board.appendChild(boardRadius);*/
            //board.appendChild(boardRadius_2);
            this._elem = board;
            //this._moveTo(this._position);
        }
    }, {
        key: "init",
        value: function init() {
            this.width = this._elem.clientWidth;
            this.height = this._elem.clientHeight;
            this.borderWidth = (this._elem.offsetWidth - this.width) / 2;

            this.topPosition = this._gameField.clientHeight - this._elem.offsetHeight / 2 - 2;
            this.position = this._gameField.clientWidth / 2;

            this.renderPosition = this.position;
            console.log("board position", this.position, this.renderPosition);
            this.setPosition(this.position);
            this._boardPointInit();
            this._testPoint();
            console.log("board size", this.width, this.height);
        }
    }, {
        key: "_testPoint",
        value: function _testPoint() {
            this.pointerArr.forEach(function (point) {
                var elem = document.createElement("div");
                elem.classList.add("point");
                elem.style.left = point.x + "px";
                elem.style.top = point.y + 1 + "px";
                document.getElementById("game-field").appendChild(elem);
            });
        }
    }, {
        key: "renderPoint",
        value: function renderPoint() {
            var pointArr = this.getPointArr();
            //console.log(pointArr);
            var field = document.getElementById("game-field");
            var pointList = field.querySelectorAll(".point");
            for (var i = 0; i < pointList.length; i++) {
                pointList[i].style.left = pointArr[i].x + "px";
            }
        }
    }, {
        key: "getPointArr",
        value: function getPointArr() {
            var delta = this.position - this._x_0;
            var resArr = [];
            this.pointerArr.forEach(function (point) {
                resArr.push({
                    x: point.x + delta,
                    y: point.y
                });
            });
            return resArr;
        }
    }, {
        key: "_boardPointInit",
        value: function _boardPointInit() {
            var pointArr = [];
            var b = this.height / 2 + 3;
            var a = this.width / 2 + 3;
            var y_0 = this.topPosition;
            var x_0 = this.position;
            var bottom = this._gameField.clientHeight;
            console.log(x_0, y_0);

            for (var i = bottom; i > y_0; i--) {
                pointArr.push({
                    x: x_0 - a,
                    y: i
                });
            }

            for (var _i = -a; _i <= a; _i++) {
                var y = y_0 - b / a * Math.sqrt(a * a - _i * _i);
                pointArr.push({
                    x: x_0 + _i,
                    y: y
                });
            }

            for (var _i2 = y_0 + 1; _i2 < bottom; _i2++) {
                pointArr.push({
                    x: x_0 + a,
                    y: _i2
                });
            }

            this.pointerArr = pointArr;
            this._x_0 = x_0;
            console.log(pointArr);
        }
    }, {
        key: "render",
        value: function render(dt) {
            this.setPosition(this.renderPosition);
            //this.renderPoint();
        }
    }, {
        key: "getElem",
        value: function getElem() {
            return this._elem;
        }
    }, {
        key: "right",
        value: function right() {
            return this.position + this.width / 2 + this.borderWidth;
        }
    }, {
        key: "bottom",
        value: function bottom() {
            return this.topPosition + this.height / 2 + this.borderWidth;
        }
    }, {
        key: "top",
        value: function top() {
            return this.topPosition - this.height / 2 - this.borderWidth;
        }
    }, {
        key: "left",
        value: function left() {
            return this.position - this.width / 2 - this.borderWidth;
        }
    }, {
        key: "setPosition",
        value: function setPosition(num) {
            this._elem.style.left = num - this.width / 2 - this.borderWidth + "px";
            this._elem.style.top = this.topPosition - this.height / 2 - this.borderWidth + "px";
        }
        /*   _initEvent() {
            this._documentOnKeyDown = this._documentOnKeyDown.bind(this);
            this._documentOnKeyUp = this._documentOnKeyUp.bind(this);
            this._startMove();
            document.addEventListener("keydown", this._documentOnKeyDown);
            document.addEventListener("keyup", this._documentOnKeyUp);
        }
          _documentOnKeyDown(e) {
              if(e.keyCode === 37) {
                console.log("down");
                if (this._count > -20) {
                    this._count --;
                } else {
                    this._count -= 2;
                }
            }
              if(e.keyCode === 39) {
                console.log("down");
                if (this._count < 20) {
                    this._count++;
                } else {
                    this._count += 2;
                }
            }
           // console.log(e.keyCode);
        }
          _documentOnKeyUp(e) {
            console.log("up");
            if(e.keyCode === 37 || e.keyCode === 39) {
                this._count = 0;
            }
        }
        */

    }, {
        key: "_startMove",
        value: function _startMove() {
            var _this = this;

            this._count = 0;
            this._timer = setInterval(function () {
                _this._calcPosition();
                _this._moveTo(_this._position);
            }, 20);
        }
    }, {
        key: "_moveTo",
        value: function _moveTo(pos) {
            this._board.style.left = pos + "px";
        }

        /*_move(shift) {
            let style = getComputedStyle(this._board);
            this._setPosition(parseInt(style.left) + shift);
        }*/

    }]);

    return Board;
}();

/*let board = new Board({
    width: 100
});
document.body.appendChild(board.getElem());*/