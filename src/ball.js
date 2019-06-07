
class Ball {
    constructor(options) {
        this._game = options.game;
        this.speedCoef = options.speed || 100;
        this._startDirection = new Vector.FromObj(
            options.direction || {
            x: 0.1,
            y: -1
        });

        this._radius = 15;
        this._init();
    }

    get radius() {
        return this._radius;
    }

    _init() {
        this._ball = document.createElement("div");
        this._ball.classList.add("ball");
        this.direction = this._startDirection.norm();
    }

    render() {
        // console.log("render", this.renderPosition);
        this._setPosition(this.renderPosition);
    }

    getNormal(direction) {
        return this.position.sum(direction.scalar(this._radius));
    }

    //Пошук координат центру кола, яке проходить через coord і має напрямок this.direction
    calcCentr(coord) {
        let k = this.direction.y / this.direction.x;
        let d = this.position.y - k * this.position.x;
        let a = 1 + k * k;
        let b = -2 * coord.x + 2 * k * d - 2 * k * coord.y;
        let c = coord.x * coord.x + d * d - 2 * d * coord.y + coord.y * coord.y - this._radius * this._radius;
        let resX = calcQuad(a, b, c);
        if (!resX) {
            let error = new ErrorEvent("Not found coord centr of ball");
            console.log(error);
        }
        if (resX.x_1 * this.direction.x < resX.x_2 * this.direction.x) {
            return new Vector(resX.x_1, k * resX.x_1 + d);
        } else {
            return new Vector(resX.x_2, k * resX.x_2 + d);
        }
    }

    sendToBoard(board) {
        this.direction = this._startDirection.norm();
        this.renderPosition = board.vecForBallStart(this);
        this.position = board.vecForBallStart(this);
    }

    _setPosition(coord) {
        //console.log(coord);
        this._ball.style.left = coord.x - this._radius + "px";
        this._ball.style.top = coord.y - this._radius + "px";
    }

    getElem() {
        return this._ball;
    }
}