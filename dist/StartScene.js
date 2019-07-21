"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

//Початкова сцена Гри з показом демо на фоні
//і початковим меню
var StartScene =
/*#__PURE__*/
function (_GameScene) {
  _inherits(StartScene, _GameScene);

  function StartScene(game) {
    _classCallCheck(this, StartScene);

    return _possibleConstructorReturn(this, _getPrototypeOf(StartScene).call(this, game));
  }

  _createClass(StartScene, [{
    key: "_initRound",
    value: function _initRound(round) {
      _get(_getPrototypeOf(StartScene.prototype), "_initRound", this).call(this, round);

      this._initMenu();
    }
  }, {
    key: "_initInfo",
    value: function _initInfo() {
      _get(_getPrototypeOf(StartScene.prototype), "_initInfo", this).call(this);

      this._infoText = "Demo"; //Щоб Info на задньому плані було нижче Menu

      this._info.getElem().style.background = "inherit";
      this._info.getElem().style.verticalAlign = "bottom";
    }
  }, {
    key: "_initMenu",
    value: function _initMenu() {
      var menu = new Menu({
        header: "Ricochet",
        menuItems: ["Start Game", "Help", "Quit"]
      });
      this._menu = menu;
      this._menuElem = menu.getElem();
    }
  }, {
    key: "_initBall",
    value: function _initBall() {
      this._ball = new Ball({
        game: this,
        speed: 1000,
        direction: {
          x: 0.1,
          y: -1
        }
      });
      this._ballElem = this._ball.getElem();
    }
  }, {
    key: "update",
    value: function update(dt) {
      this._checkKeys();

      _get(_getPrototypeOf(StartScene.prototype), "update", this).call(this, dt);
    }
  }, {
    key: "render",
    value: function render(dt) {
      if (!this._game.gameField.contains(this._menuElem)) {
        this._game.gameField.appendChild(this._menuElem);
      }

      _get(_getPrototypeOf(StartScene.prototype), "render", this).call(this, dt);
    }
  }, {
    key: "_checkKeys",
    value: function _checkKeys() {
      if (this._game.checkKeyPress(38) || this._game.checkKeyPress("W".charCodeAt(0))) {
        this._menu.selectPrevious();
      }

      if (this._game.checkKeyPress(40) || this._game.checkKeyPress("S".charCodeAt(0))) {
        this._menu.selectNext();
      }

      if (this._game.checkKeyPress(13)) {
        switch (this._menu.getSelectedItem().classList[0]) {
          case "menu-start-game":
            this._game.life = 5;
            this._game.score = 0;

            this._game.round.getFirstRound();

            this._game.setScene({
              scene: GameScene,
              isClear: true
            });

            break;

          case "menu-help":
            this.isPause = true;

            this._clearScene();

            this._game.setScene({
              scene: HelpScene,
              isClear: false
            });

            break;

          case "menu-quit":
            this._clearScene();

            this._game.setScene({
              scene: FinalScene,
              gameStatus: "noPlay",
              isClear: false
            });

            break;
        }
      }
    } //ініт ball проходить після ініт board,
    // тому для першого апдейту добавлено" this._game.gameField.clientWidth / 2;"

  }, {
    key: "_updateBoard",
    value: function _updateBoard(dt, board) {
      if (!this._ball.renderPosition) {
        board.position = this._game.gameField.clientWidth / 2;
      } else {
        board.position = this._ball.renderPosition.x;
      }

      this._calcBoardPos(board);
    }
  }, {
    key: "_updateBall",
    value: function _updateBall(dt, ball) {
      _get(_getPrototypeOf(StartScene.prototype), "_updateBall", this).call(this, dt, ball); //Дозволити політ шара після початкового встановлення на дошку


      this.ballOnBoard = false;
    }
  }, {
    key: "_clearScene",
    value: function _clearScene() {
      if (this._game.gameField.contains(this._menuElem)) {
        this._game.gameField.removeChild(this._menuElem);
      }

      if (this._game.gameField.contains(this._info.getElem())) this._game.gameField.removeChild(this._info.getElem());
    }
  }, {
    key: "gameOver",
    value: function gameOver() {
      this._game.setScene({
        scene: StartScene,
        isClear: true
      });
    }
  }]);

  return StartScene;
}(GameScene);