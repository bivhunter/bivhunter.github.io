"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//Закінчення гри з показом набраних балів через Info
//Єдине продовження це початок нової після натискання Enter або ESC
var FinalScene =
/*#__PURE__*/
function () {
  function FinalScene(game, gameStatus) {
    _classCallCheck(this, FinalScene);

    this._game = game;
    this._round = game.round;
    this._gameStatus = gameStatus;
    this._infoTime = 0;

    this._init();
  }

  _createClass(FinalScene, [{
    key: "_init",
    value: function _init() {
      var text;

      switch (this._gameStatus) {
        case "victory":
          text = "You Won!!! Your Score: ".concat(this._game.score);
          break;

        case "noPlay":
          text = "Game By Hunter";
          break;

        case "gameOver":
          text = "Game Over! Your Score: ".concat(this._game.score);
          break;
      }

      this._infoText = text;
      this._info = new Info("");
    }
  }, {
    key: "update",
    value: function update(dt) {
      if (!this._infoTime) {
        this._info.enableAnimation();

        this._infoTime += dt;
        return;
      }

      if (this._infoTime < 10) {
        this._info.animate(dt, 10, this._infoText);

        this._infoTime += dt;
        return;
      }

      this._info.disableAnimation();

      this._checkKey();
    }
  }, {
    key: "_checkKey",
    value: function _checkKey() {
      if (this._game.checkKeyPress(13) || this._game.checkKeyPress(27)) {
        this._game.round.getDemoRound();

        this._game.life = 1;
        this._game.score = 0;

        this._game.setScene({
          scene: StartScene,
          isClear: true
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (!this._game.gameField.contains(this._info.getElem())) {
        this._game.gameField.appendChild(this._info.getElem());
      }
    }
  }]);

  return FinalScene;
}();