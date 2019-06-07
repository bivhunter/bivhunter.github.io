//Обирає продовження гри при після закінчення раунда будь яким способом
//перемога, втрата шара, вихід, рестарт. І повідомляє про це
//через Info
class GameOverScene {
    constructor(game, gameStatus) {
        this._game = game;
        this._gameStatus = gameStatus;
        this._round = game.round;

        this._infoTime = 0;
        this._init();
    }

    _init() {
        this._isShowInfo = true;
        this._isMenu = false;
        this._info = new Info("");
    }

    update(dt) {
        if(this._isShowInfo) {
            this._updateInfo(dt);
            return;
        }

        this._chooseContinuation(dt);
    }

    _updateInfo(dt) {
        let text = this._gameStatus[0].toUpperCase() + this._gameStatus.slice(1) + "!";
        this._showInfo(dt, this._info, text);
    }

    render() {
        if (this._isShowInfo) {
            if (!this._game.gameField.contains(this._info.getElem())) {
                this._game.gameField.appendChild(this._info.getElem());
            }
        } else {
            if (this._game.gameField.contains(this._info.getElem())) {
                this._game.gameField.removeChild(this._info.getElem());
            }
        }
    }

    _showInfo(dt, info, text) {
        if (!this._isShowInfo) {
            return;
        }

        if ( !this._infoTime) {
            info.enableAnimation();
            this._infoTime += dt;
            return;
        }

        if (this._infoTime > 7) {
            info.disableAnimation();
            this._isShowInfo = false;
            this._infoTime = 0;
           // this._clearScene();
        }

        this._infoTime += dt;
        info.animate(dt, 5, text);
        }

    _chooseContinuation() {
        switch (this._gameStatus) {
            case "victory" : {
                let round = this._round.getNextRound();
                if (round) {
                    this._game.setScene({
                        scene: GameScene,
                        isClear: true
                    });
                } else {
                    this._setFinalScene("victory");
                }
            }
                break;
            case "restart" : {
                this._game.life--;
                if (this._game.life > 0) {
                    this._game.setScene({
                        scene: GameScene,
                        isClear: true
                    });
                } else {
                    this._setFinalScene("gameOver");
                }
            }
                break;
            case "loss" : {
                this._game.life--;
                if (this._game.life > 0) {
                    this._game.returnScene(true);
                } else {
                    this._setFinalScene("gameOver");
                }
            }
                break;
            case "quit" : {
                this._setFinalScene("gameOver");
            }
                break;
        }
    }

    _setFinalScene(gameStatus) {
        this._clearScene();
        this._game.setScene({
            scene: FinalScene,
            gameStatus: gameStatus,
            isClear: false
        });
    }

    _clearScene() {
        if (this._game.gameField.contains(this._info.getElem()))
            this._game.gameField.removeChild(this._info.getElem());
    }
}