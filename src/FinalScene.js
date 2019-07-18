//Закінчення гри з показом набраних балів через Info
//Єдине продовження це початок нової після натискання Enter або ESC
export class FinalScene {
    constructor(game, gameStatus) {
        this._game = game;
        this._round = game.round;
        this._gameStatus = gameStatus;

        this._infoTime = 0;
        this._init();
    }

    _init() {
        let text;

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

        this._infoText = text;
        this._info = new Info("");
    }

    update(dt) {
        if (!this._infoTime) {
            this._info.enableAnimation();
            this._infoTime += dt;
            return;
        }

        if (this._infoTime < 10) {
            this._info.animate( dt, 10, this._infoText );
            this._infoTime += dt;
            return;
        }

        this._info.disableAnimation();
        this._checkKey();
    }

    _checkKey () {
        if (this._game.checkKeyPress(13) || this._game.checkKeyPress(27))   {
            this._game.round.getDemoRound();
            this._game.life = 1;
            this._game.score = 0;
            this._game.setScene({
                scene: StartScene,
                isClear: true
            });
        }
    }

    render() {
        if (!this._game.gameField.find("*").is(this._info.getElem())) {
            this._game.gameField.append(this._info.getElem());
        }
    }
}