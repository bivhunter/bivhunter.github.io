"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Обирає продовження гри при після закінчення раунда будь яким способом
//перемога, втрата шара, вихід, рестарт. І повідомляє про це
//через Info
var GameOverScene = function () {
    function GameOverScene(game, gameStatus) {
        _classCallCheck(this, GameOverScene);

        this._game = game;
        this._gameStatus = gameStatus;
        this._round = game.round;

        this._infoTime = 0;
        this._init();
    }

    _createClass(GameOverScene, [{
        key: "_init",
        value: function _init() {
            this._isShowInfo = true;
            this._info = new Info("");
        }
    }, {
        key: "update",
        value: function update(dt) {
            if (this._isShowInfo) {
                this._updateInfo(dt);
                return;
            }

            this._chooseContinuation(dt);
        }
    }, {
        key: "_updateInfo",
        value: function _updateInfo(dt) {
            var text = this._gameStatus[0].toUpperCase() + this._gameStatus.slice(1) + "!";
            this._showInfo(dt, this._info, text);
        }
    }, {
        key: "render",
        value: function render() {
            if (this._isShowInfo) {
                if (!this._game.gameField.find("*").is(this._info.getElem())) {
                    this._game.gameField.append(this._info.getElem());
                }
                return;
            } else {
                if (this._game.gameField.find("*").is(this._info.getElem())) {
                    this._info.getElem().remove();
                }
            }
        }
    }, {
        key: "_showInfo",
        value: function _showInfo(dt, info, text) {
            if (!this._isShowInfo) {
                return;
            }

            if (!this._infoTime) {
                info.enableAnimation();
                this._infoTime += dt;
                return;
            }

            if (this._infoTime <= 7) {
                this._infoTime += dt;
                info.animate(dt, 5, text);
                return;
            }

            info.disableAnimation();
            this._isShowInfo = false;
            this._infoTime = 0;
        }
    }, {
        key: "_chooseContinuation",
        value: function _chooseContinuation() {
            switch (this._gameStatus) {
                case "victory":
                    {
                        var round = this._round.getNextRound();
                        if (round) {
                            this._game.setScene({
                                scene: GameScene,
                                isClear: true
                            });
                        } else {
                            this._setFinalScene("victory");
                        }
                    }
                    break;
                case "restart":
                    {
                        this._game.life--;
                        if (this._game.life > 0) {
                            this._game.setScene({
                                scene: GameScene,
                                isClear: true
                            });
                        } else {
                            this._setFinalScene("gameOver");
                        }
                    }
                    break;
                case "loss":
                    {
                        this._game.life--;
                        if (this._game.life > 0) {
                            this._clearScene();
                            this._game.returnScene(true);
                        } else {
                            this._setFinalScene("gameOver");
                        }
                    }
                    break;
                case "quit":
                    {
                        this._setFinalScene("gameOver");
                    }
                    break;
            }
        }
    }, {
        key: "_setFinalScene",
        value: function _setFinalScene(gameStatus) {
            this._clearScene();
            this._game.setScene({
                scene: FinalScene,
                gameStatus: gameStatus,
                isClear: false
            });
        }
    }, {
        key: "_clearScene",
        value: function _clearScene() {
            if (this._game.gameField.find("*").is(this._info.getElem())) {
                this._info.getElem().remove();
            }
        }
    }]);

    return GameOverScene;
}();