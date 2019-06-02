"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FinalScene = function () {
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
            var text = void 0;
            //this._game.gameField.innerHTML = "";

            switch (this._gameStatus) {
                case "victory":
                    text = "You Won!!! Your Score: " + this._game.score;
                    break;
                case "noPlay":
                    text = "Game By Hunter";
                    break;
                case "gameOver":
                    text = "Game Over! Your Score: " + this._game.score;
                    break;
            }

            this._text = text;
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
                this._info.animate(dt, 10, this._text);
                this._infoTime += dt;
                return;
            }

            this._info.disableAnimation();
            this._game.stop();
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