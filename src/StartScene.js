class StartScene {
	constructor(game) {
		this._game = game;
		this._init();
	}

	_init() {
		let menu = new Menu({
			header: "Game",
			menuItems: [
				"Start",
				"Help",
				"Quit"
			]
		});
		//console.log(menu.getElem());
		this._menu = menu;
		this._menuElem = menu.getElem();
	}



	update(dt) {
		//console.log("update", dt);
		if (this._game.checkKeyPress(38)) {
			this._menu.selectPrevious();
		}

		if (this._game.checkKeyPress(40)) {
			this._menu.selectNext();
		}

		if (this._game.checkKeyPress(13)) {

			switch (this._menu.getSelectedItem().classList[0]) {
				case "menu-start":
					this._game.setScene({
                        scene: GameScene,
                        round: this._game.round,
                        isClear: true
					});
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
                        isClear: true
                    });
                    break;
			}



		}
	}

	render(dt) {
       // console.log("update", dt);
		if (!this._game.gameField.contains(this._menuElem)) {
			this._game.gameField.appendChild(this._menuElem);
			console.log("append child");
		}
	}

	toString() {
	    return "Start Scene";
    }


}