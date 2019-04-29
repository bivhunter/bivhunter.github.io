"use strict";

class Board {
    constructor(options) {
        this._gameField = options.gameField;

        this.moveMult = 0;

        this._K = 20;
        this._init();
    }

    _init() {


        let board = document.createElement("div");
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

    init() {
        this.width = this._elem.clientWidth;
        this.height = this._elem.clientHeight;
        this.borderWidth = (this._elem.offsetWidth - this.width) / 2;

        this.topPosition = this._gameField.clientHeight - this._elem.offsetHeight / 2 - 2;
        this.position = this._gameField.clientWidth / 2;

        this.renderPosition = this.position;
        console.log("board position", this.position, this.renderPosition);
        this.setPosition(this.position);
        this._boardPointInit();
        //this._testPoint();
        console.log("board size", this.width, this.height);
    }

    _testPoint() {
        this.pointerArr.forEach(point => {
            let elem = document.createElement("div");
            elem.classList.add("point");
            elem.style.left = point.x   + "px";
            elem.style.top = point.y  + 1 + "px";
            document.getElementById("game-field").appendChild(elem);
        })
    }

    renderPoint() {
        let pointArr = this.getPointArr();
        //console.log(pointArr);
        let field = document.getElementById("game-field");
        let pointList = field.querySelectorAll(".point");
        for (let i = 0; i < pointList.length; i++) {
            pointList[i].style.left = pointArr[i].x  + "px";
        }
    }

    getPointArr() {
        let delta = this.position - this._x_0;
        let resArr = [];
        this.pointerArr.forEach(point => {
            resArr.push({
              x: point.x + delta,
              y: point.y
            });
        });
        return resArr;
    }


    _boardPointInit() {
        let pointArr = [];
        let b = this.height / 2 + 3;
        let a = this.width / 2 + 3;
        let y_0 = this.topPosition;
        let x_0 = this.position;
        console.log(x_0, y_0);
        for (let i = -a; i <= a; i++ ) {
            let y = y_0 - (b / a) * Math.sqrt(a * a - i * i);
            pointArr.push({
                x: x_0 + i,
                y: y
            });
        }
        this.pointerArr = pointArr;
        this._x_0 = x_0;
        //console.log(pointArr);
    }

    render(dt) {
        this.setPosition(this.renderPosition);
        //this.renderPoint();
    }

    getElem() {
        return this._elem;
    }

    right() {
        return this.position + this.width / 2 + this.borderWidth;
    }

    bottom() {
        return this.topPosition + this.height / 2 + this.borderWidth;
    }

    top() {
        return this.topPosition - this.height / 2 - this.borderWidth ;
    }

    left() {
        return this.position - this.width / 2 - this.borderWidth;
    }

    setPosition(num) {
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



}

/*let board = new Board({
    width: 100
});
document.body.appendChild(board.getElem());*/