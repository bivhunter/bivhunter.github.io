"use strict";

class Board {
    constructor(options) {
        this._width = options.width || 80;
        this._position = options.position || 460;
        this._K = 20;
    }

    _initEvent() {
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

    _calcPosition() {
        this._position += (this._count) * this._K;
        //return this._position;
    }

    _startMove() {
        this._count = 0;
        this._timer = setInterval(() => {
            this._calcPosition();
            this._moveTo(this._position);
        }, 20);
    }

    _moveTo(pos) {
        this._board.style.left = pos + "px";
    }

    /*_move(shift) {
        let style = getComputedStyle(this._board);
        this._setPosition(parseInt(style.left) + shift);
    }*/

    getElem() {
        this._render();
        return this._elem;
    }
    _render() {
        let boardWrapper = document.createElement("div");
        let board = document.createElement("div");

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


}

let board = new Board({
    width: 100
});
document.body.appendChild(board.getElem());