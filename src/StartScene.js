class StartScene extends GameScene {
	constructor(game) {
		super(game);
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
			speed: 1000,
			direction: {
				x: 0.1,
				y: -1
			}
		});
		this._ballElem = this._ball.getElem();
	}

	update(dt) {
		this._checkKeys();
		super.update(dt);
	}

	render(dt) {

        if (!this._game.gameField.contains(this._menuElem)) {
            this._game.gameField.appendChild(this._menuElem);
        }
		super.render(dt);

	}

	_checkKeys() {
		if (this._game.checkKeyPress(38) || this._game.checkKeyPress("W".charCodeAt(0))) {
			this._menu.selectPrevious();
		}

		if (this._game.checkKeyPress(40) || this._game.checkKeyPress("S".charCodeAt(0))) {
			this._menu.selectNext();
		}

		if (this._game.checkKeyPress(13)) {

			switch (this._menu.getSelectedItem().classList[0]) {
				case "menu-start-game":
					this._game.lifes = 2;
					this._game.score = 0;
                    this._game.round.getFirstRound();
					this._game.setScene({
						scene: GameScene,
						isClear: true
					});
					break;
				case "menu-help":
					this.isPause = true;
                    this._clearScene();
					this._game.setScene({
						scene: HelpScene,
						isClear: false
					});
					break;
				case "menu-quit":
					this._clearScene();
					this._game.setScene({
						scene: FinalScene,
						gameStatus: "noPlay",
						isClear: false
					});
					break;
			}
		}
	}

	_updateBoard(dt, board) {
		//ініт шара проходить після ініт боард,
		// тому для першого апдейту добавлено" || this._game.gameField.clientWidth / 2;"
		board.position = this._ball.renderPosition.x || this._game.gameField.clientWidth / 2;
		this._calcBoardPos(board)
	}

	_updateBall(dt, ball) {
		super._updateBall(dt, ball);
		this.ballOnBoard = false;
	}

    _clearScene() {
        if (this._game.gameField.contains(this._menuElem)) {
            this._game.gameField.removeChild(this._menuElem);
        }

        if (this._game.gameField.contains(this._info.getElem()))
        this._game.gameField.removeChild(this._info.getElem());
    }

	gameOver() {
		this._game.setScene({
			scene: StartScene,
			isClear: true
		});
	}
}