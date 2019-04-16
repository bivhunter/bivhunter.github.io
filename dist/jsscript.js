"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Board = function () {
    function Board(options) {
        _classCallCheck(this, Board);

        this._width = options.width || 80;
        this._position = options.position || 460;
        this._K = 20;
    }

    _createClass(Board, [{
        key: "_initEvent",
        value: function _initEvent() {
            this._documentOnKeyDown = this._documentOnKeyDown.bind(this);
            this._documentOnKeyUp = this._documentOnKeyUp.bind(this);
            this._startMove();
            document.addEventListener("keydown", this._documentOnKeyDown);
            document.addEventListener("keyup", this._documentOnKeyUp);
        }
    }, {
        key: "_documentOnKeyDown",
        value: function _documentOnKeyDown(e) {

            if (e.keyCode === 37) {
                console.log("down");
                if (this._count > -20) {
                    this._count--;
                } else {
                    this._count -= 2;
                }
            }

            if (e.keyCode === 39) {
                console.log("down");
                if (this._count < 20) {
                    this._count++;
                } else {
                    this._count += 2;
                }
            }
            // console.log(e.keyCode);
        }
    }, {
        key: "_documentOnKeyUp",
        value: function _documentOnKeyUp(e) {
            console.log("up");
            if (e.keyCode === 37 || e.keyCode === 39) {
                this._count = 0;
            }
        }
    }, {
        key: "_calcPosition",
        value: function _calcPosition() {
            this._position += this._count * this._K;
            //return this._position;
        }
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

    }, {
        key: "getElem",
        value: function getElem() {
            this._render();
            return this._elem;
        }
    }, {
        key: "_render",
        value: function _render() {
            var boardWrapper = document.createElement("div");
            var board = document.createElement("div");

            boardWrapper.id = "boardWrapper";
            boardWrapper.style.position = "absolute";
            boardWrapper.appendChild(board);

            board.classList.add("board");
            board.style.width = this._width + "px";
            board.style.position = "absolute";

            this._elem = boardWrapper;
            this._board = board;
            this._initEvent();
            //this._moveTo(this._position);
        }
    }]);

    return Board;
}();

var board = new Board({
    width: 100
});
document.body.appendChild(board.getElem());