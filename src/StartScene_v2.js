class StartScene_v2 extends GameScene {
    constructor (game, round) {
        super (game, round);
    }

    _initRound(round) {
        super._initRound(round);
        this._initMenu();
    }

    _initInfo() {
        super._initInfo();
        this._infoText = "Demo";
        this._info.getElem().style.background = "inherit";
        this._info.getElem().style.verticalAlign = "bottom";
    }

    _initMenu() {
        let menu = new Menu({
            header: "Ricochet",
            menuItems: [
                "Start Game",
                "Help",
                "Quit"
            ]
        });

        this._menu = menu;
        this._menuElem = menu.getElem();
    }

    _initBall() {
        this._ball = new Ball({
            game: this,
            speed: 300,
            direction: {
                x: 1,
                y: -1
            }
        });
        this._ballElem = this._ball.getElem();
        this._ball.isOnBoard = true;
    }

    update(dt) {
        this._checkKeys();
        super.update(dt);
    }

    render(dt) {
        if (!this._game.gameField.contains(this._menuElem)) {
            this._game.gameField.appendChild(this._menuElem);
            console.log("append child");
        }

        super.render(dt);
    }

    _checkKeys() {
        if (this._game.checkKeyPress(38)) {
            this._menu.selectPrevious();
        }

        if (this._game.checkKeyPress(40)) {
            this._menu.selectNext();
        }

        if (this._game.checkKeyPress(13)) {

            switch (this._menu.getSelectedItem().classList[0]) {
                case "menu-start-game":
                    this._game.setScene({
                        scene: GameScene,
                        round: this._game.round.getFirstRound(),
                        isClear: true
                    });
                    break;
                case "menu-help":
                    this._isPause = true;
                    this._game.setScene({
                        scene: HelpScene,
                        isClear: true
                    });
                    break;
                case "menu-quit":
                    this._game.setScene({
                        scene: FinalScene,
                        isClear: true
                    });
                    break;
            }
        }
    }

    _updateBoard(dt, board) {
        board.position = this._ball.renderPosition.x;
        this._calcBoardPos(board)
    }

    _updateBall(dt, ball) {
        super._updateBall(dt, ball);
        ball.isOnBoard = false;
    }

    gameOver() {
        this._game.setScene({
            scene: StartScene_v2,
            round: this._game.round,
            isClear: true
        });
    }
}

