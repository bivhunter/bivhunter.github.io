class FinalScene {
    constructor(game, round) {
        this._game = game;
        this._round = round;
        this._time = 0;
        this._init();
    }

    _init() {
        let text;
        this._game.gameField.innerHTML = "";
        if (this._round === null) {
            text = `You Won!!! Your Score: ${this._game.score}`;
            console.log(text);
        } else if (this._round === undefined) {
            text = "Game By Hunter";
        } else {
            text = "GameOver";
        }

        this._text = text;
        this._info = new Info("");


    }

    update(dt) {
        let info = this._info;
        let text = this._text;

        if (this._time < 10) {
            info.enableAnimation();
            info.animate(dt, 10, text);
            this._time += dt;
        } else {
            info.disableAnimation();
            this._game.stop();
        }

    }

    render() {
        if (!this._game.gameField.contains(this._info.getElem())) {
            this._game.gameField.appendChild(this._info.getElem())
        };
    }
}