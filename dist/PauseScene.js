"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PauseScene =
/*#__PURE__*/
function () {
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
        switch (this._menu.getSelectedItem().classList[0]) {
          case "menu-resume":
            {
              this._clearScene();

              this._game.returnScene();
            }
            break;

          case "menu-restart":
            this._setScene(GameOverScene, "restart");

            break;

          case "menu-help":
            this._setScene(HelpScene);

            break;

          case "menu-quit":
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
      if (!this._game.gameField.contains(this._menuElem)) {
        this._game.gameField.appendChild(this._menuElem);
      }
    }
  }, {
    key: "_clearScene",
    value: function _clearScene() {
      if (this._game.gameField.contains(this._menuElem)) {
        this._game.gameField.removeChild(this._menuElem);
      }
    }
  }]);

  return PauseScene;
}();