class GameOverScene {
    constructor(game, round, isLoss) {
        this._game = game;
        this._round = round;
        this._isLoss = isLoss;
        this._isShowInfo = true;
        this._time = 0;
        this._init();
    }

    _init() {

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
        //console.log(menu.getElem());
        this._menu = menu;
        this._menuElem = menu.getElem();
        this._isMenu = true;
        this._game.gameField.innerHTML = "";
        this._game.lifes = 0;
    }

    update(dt) {
        let text = this._isLoss ? "Loss!" : "Victory!";
        let info = this._info;
        if (this._isShowInfo) {
            this._time += dt;
            info.enableAnimation();
            info.animate(dt, 6, text);
            if (this._time > 6) {
                info.disableAnimation();
                this._isShowInfo = false;
                if (this._isLoss) {
                    this._game.lifes--;
                    if (this._game.lifes > 0) {
                        /*this._game.setScene({
                            scene: GameScene,
                            round: this._round,
                            isClear: true
                        });*/
                        this._game.returnScene(true);
                    } else {
                        this._initGameOverMenu();
                    }
                } else {
                    let round = this._round.getNextRound();
                    if (round) {
                        this._game.setScene({
                            scene: GameScene,
                            round: round,
                            isClear: true
                        });
                    } else {
                        console.log("round", round);
                        this._game.setScene({
                            scene: FinalScene,
                            round: round,
                            isClear: true
                        });
                    }
                }

            }
            return;
        }

        this._updateMenu();

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
                        this._game.lifes = 1;
                        this._game.score = 0;
                        this._game.setScene({
                            scene: StartScene,
                            round: this._game.round.getDemoRound(),
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
                        round: this._round,
                        isClear: true
                    });
                    break;

            }
        }
    }

    render(dt) {
        if (this._isMenu) {
            if (!this._game.gameField.contains(this._menuElem)) {
                this._game.gameField.appendChild(this._menuElem);
                console.log("append child");
            }

        } else {
            if (!this._game.gameField.contains(this._info.getElem())) {
                this._game.gameField.appendChild(this._info.getElem());
            }
        }



    }


}