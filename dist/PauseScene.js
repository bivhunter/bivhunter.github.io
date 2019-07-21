import { Menu } from "./components";
import { GameOverScene } from "./GameOverScene";
import { HelpScene } from "./HelpScene";
export class PauseScene {
  constructor(game) {
    this._game = game;

    this._init();
  }

  _init() {
    let menu = new Menu({
      header: "Pause",
      menuItems: ["Resume", "Restart", "Help", "Quit"]
    });
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

  _setScene(scene, gameStatus) {
    this._clearScene();

    this._game.setScene({
      scene: scene,
      gameStatus: gameStatus,
      isClear: false
    });
  }

  render() {
    if (!this._game.gameField.find("*").is(this._menuElem)) {
      this._game.gameField.append(this._menuElem);
    }
  }

  _clearScene() {
    if (this._game.gameField.find("*").is(this._menuElem)) {
      this._menuElem.remove();
    }
  }

}