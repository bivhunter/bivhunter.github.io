class FinalScene {
    constructor(game, gameStatus) {
        this._game = game;
        this._round = game.round;
        this._gameStatus = gameStatus;

        this._time = 0;
        this._init();
    }

    _init() {
        let text;
        this._game.gameField.innerHTML = "";

        switch (this._gameStatus) {
            case "victory" :
                text = `You Won!!! Your Score: ${this._game.score}`;
                break;
            case "noPlay" :
                text = "Game By Hunter";
                break;
            case "gameOver" :
                text = `Game Over! Your Score: ${this._game.score}`;
                break;
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