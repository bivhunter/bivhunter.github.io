class GameOverScene {
    constructor(game, gameStatus) {
        this._game = game;
        this._gameStatus = gameStatus;
        this._round = game.round;

        this._time = 0;
        this._init();
    }

    _init() {
        this._isShowInfo = true;
        this._isMenu = false;
        this._info = new Info("");
    }

    _initGameOverMenu() {
        let menu = new Menu({
            header: "Game Over",
            menuItems: [
                "New Game",
                "Help",
                "Quit"
            ]
        });

        this._menu = menu;
        this._menuElem = menu.getElem();
        this._isMenu = true;
        this._game.gameField.innerHTML = "";
        this._game.lifes = 0;
    }

    update(dt) {
        if(this._isShowInfo) {
            this._updateInfo(dt);
            return;
        }

        if(this._isMenu) {
            this._updateMenu();
            return;
        }

        this._chooseContinuation(dt);
    }

    _updateInfo(dt) {
        let text = this._gameStatus[0].toUpperCase() + this._gameStatus.slice(1) + "!";

        this._showInfo(dt, this._info, text);
        console.log("updateInfo");
    }



    _updateMenu() {
        if (this._game.checkKeyPress(38) || this._game.checkKeyPress("W".charCodeAt(0))) {
            this._menu.selectPrevious();
        }

        if (this._game.checkKeyPress(40) || this._game.checkKeyPress("S".charCodeAt(0))) {
            this._menu.selectNext();
        }

        if (this._game.checkKeyPress(27)) {
            this._game.returnScene();
        }

        if (this._game.checkKeyPress(13)) {
            console.log(this._game.round);
            switch (this._menu.getSelectedItem().classList[0]) {
                case "menu-new-game":
                    {
                        this._game.round.getDemoRound();
                        this._game.lifes = 1;
                        this._game.score = 0;
                        this._game.setScene({
                            scene: StartScene,
                            isClear: true
                        });
                    }
                    break;
                case "menu-help":
                    this._game.setScene({
                        scene: HelpScene,
                        isClear: true
                    });
                    break;
                case "menu-quit":
                    this._game.setScene({
                        scene: FinalScene,
                        gameStatus: "gameOver",
                        isClear: true
                    });
                    break;

            }
        }
    }

    render(dt) {
        if (this._isShowInfo) {
            if (!this._game.gameField.contains(this._info.getElem())) {
                this._game.gameField.appendChild(this._info.getElem());
            }
            return;
        } else {
            if (this._game.gameField.contains(this._info.getElem())) {
                this._game.gameField.removeChild(this._info.getElem());
            }
        }

        if (this._isMenu) {
            if (!this._game.gameField.contains(this._menuElem)) {

                this._game.gameField.appendChild(this._menuElem);
                console.log("append child");
            }
        }
    }


    _showInfo(dt, info, text) {
        if (this._isShowInfo) {
            this._time += dt;
            info.enableAnimation();
            info.animate(dt, 6, text);
            if (this._time > 6) {
                info.disableAnimation();
                this._isShowInfo = false;
            }
        }
    }

    _chooseContinuation(dt) {
        switch (this._gameStatus) {
            case "victory" : {
                let round = this._round.getNextRound();
                if (round) {
                    this._game.setScene({
                        scene: GameScene,
                        isClear: true
                    });
                } else {
                    console.log("round", round);
                    this._game.setScene({
                        scene: FinalScene,
                        gameStatus: "victory",
                        isClear: true
                    });
                }
            }
                break;
            case "restart" : {
                this._game.lifes--;
                if (this._game.lifes > 0) {
                    this._game.setScene({
                        scene: GameScene,
                        isClear: true
                    });
                } else {
                    this._game.setScene({
                        scene: GameOverScene,
                        isClear: true,
                        gameStatus: "loss"
                    });
                }
            }
                break;
            case "loss" : {
                console.log("loss");
                this._game.lifes--;
                if (this._game.lifes > 0) {
                    this._game.returnScene(true);
                } else {
                    this._initGameOverMenu();
                }
            }
                break;
            case "quit" : {
                    this._initGameOverMenu();
            }
                break;
        }
    }



}