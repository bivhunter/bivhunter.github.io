"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Board = function () {
    function Board(options) {
        _classCallCheck(this, Board);

        this._gameField = options.gameField;
        this.moveMult = 0;
        this._init();
    }

    _createClass(Board, [{
        key: "_init",
        value: function _init() {

            var board = document.createElement("div");
            board.classList.add("board");

            this._elem = board;
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
            //console.log("board position", this.position, this.renderPosition);
            this.setPosition(this.position);
            this._boardPointInit();
            //this._testPoint();
            // console.log("board size", this.width, this.height);
        }
    }, {
        key: "_boardPointInit",
        value: function _boardPointInit() {
            //Для знаходження точок границі використовується рівняння еліпса
            //a, b - мала і велика осі
            //x_0, y_0 - центр еліпса
            //крок дискретизації 1px
            var pointArr = [];
            var b = this.height / 2 + 3;
            var a = this.width / 2 + 3;
            var y_0 = this.topPosition;
            var x_0 = this.position;
            var bottom = this._gameField.clientHeight;
            console.log(x_0, y_0);

            //точки лівої границі
            for (var i = bottom; i > y_0; i--) {
                pointArr.push(new Vector(x_0 - a, i));
            }

            //точки верхньої границі
            for (var _i = -a; _i <= a; _i++) {
                var y = y_0 - b / a * Math.sqrt(a * a - _i * _i);
                pointArr.push(new Vector(x_0 + _i, y));
            }

            //точки правої границі
            for (var _i2 = y_0 + 1; _i2 < bottom; _i2++) {
                pointArr.push(new Vector(x_0 + a, _i2));
            }

            this.pointerArr = pointArr;
            this._x_0 = x_0;
            //console.log(pointArr);
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
                resArr.push(new Vector(point.x + delta, point.y));
            });
            return resArr;
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
    }]);

    return Board;
}();