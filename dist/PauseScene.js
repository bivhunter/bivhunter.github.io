"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PauseScene = function () {
	function PauseScene(game) {
		_classCallCheck(this, PauseScene);

		this._game = game;
		this._init();
	}

	_createClass(PauseScene, [{
		key: "_init",
		value: function _init() {
			var menu = new Menu({
				header: "Pause",
				menuItems: ["Resume", "Restart", "Help", "Quit"]
			});

			this._menu = menu;
			this._menuElem = menu.getElem();
		}
	}, {
		key: "update",
		value: function update() {
			if (this._game.checkKeyPress(38) || this._game.checkKeyPress("W".charCodeAt(0))) {
				this._menu.selectPrevious();
			}

			if (this._game.checkKeyPress(40) || this._game.checkKeyPress("S".charCodeAt(0))) {
				this._menu.selectNext();
			}

			if (this._game.checkKeyPress(27)) {
				this._clearScene();
				this._game.returnScene();
			}

			if (this._game.checkKeyPress(13)) {
				switch (this._menu.getSelectedItem().attr("data-name")) {
					case "resume":
						{
							this._clearScene();
							this._game.returnScene();
						}
						break;
					case "restart":
						this._setScene(GameOverScene, "restart");
						break;
					case "help":
						this._setScene(HelpScene);
						break;
					case "quit":
						this._setScene(GameOverScene, "quit");
						break;
				}
			}
		}
	}, {
		key: "_setScene",
		value: function _setScene(scene, gameStatus) {
			this._clearScene();
			this._game.setScene({
				scene: scene,
				gameStatus: gameStatus,
				isClear: false
			});
		}
	}, {
		key: "render",
		value: function render() {
			if (!this._game.gameField.find("*").is(this._menuElem)) {
				this._game.gameField.append(this._menuElem);
			}
		}
	}, {
		key: "_clearScene",
		value: function _clearScene() {
			if (this._game.gameField.find("*").is(this._menuElem)) {
				this._menuElem.remove();
			}
		}
	}]);

	return PauseScene;
}();