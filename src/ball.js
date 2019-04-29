"use strict";

class Ball {
    constructor(options) {
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

    _init() {
        this._ball = document.createElement("div");
        this._ball.classList.add("ball");
        this.direction = vectorNorm(this.direction);
    }

    //відмальовка шара
    render(dt) {
        // console.log("render", this.renderPosition);
        this._setPosition(this.renderPosition);
    }

    getNormal(direction) {
        return vectorSum(this.position, vectorScalar(this.radius, direction));
    }

    calcCentr(coord) {
        let k = this.direction.y / this.direction.x;
        let d = this.position.y - k * this.position.x;
        let a = 1 + k * k;
        let b = -2 * coord.x + 2 * k * d - 2 * k * coord.y;
        let c = coord.x * coord.x + d * d - 2 * d * coord.y + coord.y * coord.y - this.radius * this.radius;
        let resX = calcQuad(a, b, c);
        if (!resX) {
            let error = new ErrorEvent("Not found coord centr of ball");
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

    sendToBoard(board) {
        let x = board.renderPosition;
        let y = (board.topPosition - board.height / 2 - board.borderWidth - this.radius);
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

    _setPosition(coord) {
        //console.log(coord);
        this._ball.style.left = coord.x - this.radius + "px";
        this._ball.style.top = coord.y - this.radius + "px";
    }

    getElem() {
        this._init();
        return this._ball;
    }


}