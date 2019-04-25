"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameOverScene = function () {
    function GameOverScene(game, round, isLoss) {
        _classCallCheck(this, GameOverScene);

        this._game = game;
        this._round = round;
        this._isLoss = isLoss;
        this._isShowInfo = true;
        this._time = 0;
        this._init();
    }

    _createClass(GameOverScene, [{
        key: "_init",
        value: function _init() {

            this._info = new Info("");
        }
    }, {
        key: "_initGameOverMenu",
        value: function _initGameOverMenu() {
            var menu = new Menu({
                header: "Game Over",
                menuItems: ["New Game", "Help", "Quit"]
            });
            //console.log(menu.getElem());
            this._menu = menu;
            this._menuElem = menu.getElem();
            this._isMenu = true;
            this._game.gameField.innerHTML = "";
            this._game.lifes = 0;
        }
    }, {
        key: "update",
        value: function update(dt) {
            var text = this._isLoss ? "Loss!" : "Victory!";
            var info = this._info;
            if (this._isShowInfo) {
                this._time += dt;
                info.enableAnimation();
                info.animate(dt, 6, text);
                if (this._time > 6) {
                    info.disableAnimation();
                    this._isShowInfo = false;
                    if (this._isLoss) {
                        this._game.lifes--;
                        if (this._game.lifes > 0) {
                            this._game.setScene({
                                scene: GameScene,
                                round: this._round,
                                isClear: true
                            });
                        } else {
                            this._initGameOverMenu();
                        }
                    } else {
                        var round = this._round.getNextRound();
                        if (round) {
                            this._game.setScene({
                                scene: GameScene,
                                round: round,
                                isClear: true
                            });
                        } else {
                            console.log("round", round);
                            this._game.setScene({
                                scene: FinalScene,
                                round: round,
                                isClear: true
                            });
                        }
                    }
                }
                return;
            }

            this._updateMenu();
        }
    }, {
        key: "_updateMenu",
        value: function _updateMenu() {
            if (this._game.checkKeyPress(38)) {
                this._menu.selectPrevious();
            }

            if (this._game.checkKeyPress(40)) {
                this._menu.selectNext();
            }

            if (this._game.checkKeyPress(27)) {
                this._game.returnScene();
            }

            if (this._game.checkKeyPress(13)) {
                console.log(this._game.round);
                switch (this._menu.getSelectedItem().classList[0]) {
                    case "menu-new-game":
                        {
                            this._game.lifes = 1;
                            this._game.score = 0;
                            this._game.setScene({
                                scene: StartScene,
                                round: this._game.round.getDemoRound(),
                                isClear: true
                            });
                        }
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
                            round: this._round,
                            isClear: true
                        });
                        break;

                }
            }
        }
    }, {
        key: "render",
        value: function render(dt) {
            if (this._isMenu) {
                if (!this._game.gameField.contains(this._menuElem)) {
                    this._game.gameField.appendChild(this._menuElem);
                    console.log("append child");
                }
            } else {
                if (!this._game.gameField.contains(this._info.getElem())) {
                    this._game.gameField.appendChild(this._info.getElem());
                }
            }
        }
    }]);

    return GameOverScene;
}();