"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InfoScene = function () {
    function InfoScene(game, round) {
        _classCallCheck(this, InfoScene);

        this._game = game;
        this._round = round;
        this._time = 0;
        this._init();
    }

    _createClass(InfoScene, [{
        key: "_init",
        value: function _init() {
            var div = document.createElement("div");
            div.classList.add("info");
            var message = document.createElement("h1");
            message.classList.add("info-message");
            div.appendChild(message);
            this._game.gameField.appendChild(div);
            this._text = "Round " + this._round.getActiveRoundNum();
            this._message = message;
        }
    }, {
        key: "update",
        value: function update(dt) {

            this._message.textContent = this._text;
            this._time += dt;
            if (this._time > 4) {
                this._game.setScene(GameScene, this._round);
            }
        }
    }, {
        key: "render",
        value: function render() {}
    }]);

    return InfoScene;
}();