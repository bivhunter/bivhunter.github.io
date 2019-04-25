class PauseScene {
	constructor(game, round) {
		this._round = round;
		this._game = game;
		this._init();
	}

	_init() {
		let menu = new Menu({
			header: "Pause",
			menuItems: [
				"Resume",
				"Restart",
				"Help",
				"Quit"
			]
		});
		//console.log(menu.getElem());
		this._menu = menu;
		this._menuElem = menu.getElem();
	}



	update() {
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
				case "menu-resume":
					{
						this._game.returnScene();
					}
					break;
				case "menu-restart":
					this._game.setScene({
						scene: GameOverScene,
						round: this._game.round,
						isClear: true,
						isLoss: true
					});
					break;
				case "menu-help":
					this._game.setScene({
						scene: HelpScene,
						isClear: true
					});
					break;
				case "menu-quit":
					this._game.lifes = 0;
					this._game.setScene({
						scene: GameOverScene,
						round: this._game.round,
						isClear: true,
						isLoss: true
					});
					break;
			}



		}
	}

	render() {

		if (!this._game.gameField.contains(this._menuElem)) {
			this._game.gameField.appendChild(this._menuElem);
			console.log("append child");
		}
	}
}