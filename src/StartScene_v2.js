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
        //console.log(menu.getElem());
        this._menu = menu;
        this._menuElem = menu.getElem();
    }

    _initBall() {
        this._ball = new Ball({
            game: this,
            speed: 300,
            /*position: {
                x: -20,
                y: -20
            },*/
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
        //console.log(this._position);
       /* this._updateInfo(dt);
        this._updateBoard(dt, this._board);
        this._updateBall(dt, this._ball);*/



    }

    render(dt) {
        /*let newArr = [];
        this._blockArr.forEach((item) => {
            if (item) {
                newArr.push(item);
            }
        });
        this._blockArr = newArr;*/
        //console.log(this._blockArr);


        this._board.render(dt);

        if (!this._game.gameField.contains(this._boardElem)) {
            this._game.gameField.appendChild(this._boardElem);
        }



        this._renderBlock();



        if (!this._game.gameField.contains(this._menuElem)) {
            this._game.gameField.appendChild(this._menuElem);
            console.log("append child");
        }

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

        this._ball.render(dt);

        if (!this._game.gameField.contains(this._ballElem)) {
            this._game.gameField.appendChild(this._ballElem);
        }

        this._removeBlock();











        /*this._board.render(dt);

        if (!this._game.gameField.contains(this._boardElem)) {
            this._game.gameField.appendChild(this._boardElem);
        }

        this._renderBlock();

        this._removeBlock();

        this._ball.render(dt);

        if (!this._game.gameField.contains(this._ballElem)) {
            this._game.gameField.appendChild(this._ballElem);
        }

        if (!this._game.gameField.contains(this._menuElem)) {
            this._game.gameField.appendChild(this._menuElem);
            console.log("append child");
        }*/

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

   /* _updateInfo() {

    }*/

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

