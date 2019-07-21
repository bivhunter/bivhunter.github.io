"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Board =
/*#__PURE__*/
function () {
  function Board(options) {
    _classCallCheck(this, Board);

    this._gameField = options.gameField;
    this.moveMult = 0;
    this.direction = 0;

    this._init();
  }

  _createClass(Board, [{
    key: "_init",
    value: function _init() {
      var board = document.createElement("div");
      board.classList.add("board");
      this._elem = board;
    } //ініціалізація основних розмірів проходить ззовні, після рендерінгу дошки
    //щоб в CSS можна було задати різні розміри

  }, {
    key: "init",
    value: function init() {
      this._width = this._elem.clientWidth;
      this._height = this._elem.clientHeight;
      this._borderWidth = (this._elem.offsetWidth - this._width) / 2;
      this._topPosition = this._gameField.clientHeight - this._elem.offsetHeight / 2 - 2;
      this.position = this._gameField.clientWidth / 2;
      this.renderPosition = this.position;

      this._setPosition(this.position);

      this._boardPointInit();
    } //Стартова позиція для шара на дошці

  }, {
    key: "vecForBallStart",
    value: function vecForBallStart(ball) {
      var x = this.renderPosition;
      var y = this._topPosition - this._height / 2 - this._borderWidth - ball.radius;
      return new Vector(x, y);
    } //Для знаходження точок границі використовується рівняння еліпса
    //a, b - мала і велика осі
    //x_0, y_0 - центр еліпса
    //крок дискретизації 1px

  }, {
    key: "_boardPointInit",
    value: function _boardPointInit() {
      var pointArr = [];
      var b = this._height / 2 + 3;
      var a = this._width / 2 + 3;
      var y_0 = this._topPosition;
      var x_0 = this.position;
      var bottom = this._gameField.clientHeight; //точки лівої границі

      for (var i = bottom; i > y_0; i--) {
        pointArr.push(new Vector(x_0 - a, i));
      } //точки верхньої границі


      for (var _i = -a; _i <= a; _i++) {
        var y = y_0 - b / a * Math.sqrt(a * a - _i * _i);
        pointArr.push(new Vector(x_0 + _i, y));
      } //точки правої границі


      for (var _i2 = y_0 + 1; _i2 < bottom; _i2++) {
        pointArr.push(new Vector(x_0 + a, _i2));
      }

      this._pointerArr = pointArr;
      this._x_0 = x_0;
    } //повертає масив точок зміщених від початкової позиції
    //на актуальну позицію дошки

  }, {
    key: "getPointArr",
    value: function getPointArr() {
      var delta = this.position - this._x_0;
      var resArr = [];

      this._pointerArr.forEach(function (point) {
        resArr.push(new Vector(point.x + delta, point.y));
      });

      return resArr;
    }
  }, {
    key: "render",
    value: function render() {
      this._setPosition(this.renderPosition);
    }
  }, {
    key: "getElem",
    value: function getElem() {
      return this._elem;
    }
  }, {
    key: "right",
    value: function right() {
      return this.position + this._width / 2 + this._borderWidth;
    }
  }, {
    key: "bottom",
    value: function bottom() {
      return this._topPosition + this._height / 2 + this._borderWidth;
    }
  }, {
    key: "top",
    value: function top() {
      return this._topPosition - this._height / 2 - this._borderWidth;
    }
  }, {
    key: "left",
    value: function left() {
      return this.position - this._width / 2 - this._borderWidth;
    }
  }, {
    key: "_setPosition",
    value: function _setPosition(num) {
      this._elem.style.left = num - this._width / 2 - this._borderWidth + "px";
      this._elem.style.top = this._topPosition - this._height / 2 - this._borderWidth + "px";
    } //Тестові методи для промальовки точок границі дошки
    //Та їх додавання до gameField

  }, {
    key: "_testPoint",
    value: function _testPoint() {
      this._pointerArr.forEach(function (point) {
        var elem = document.createElement("div");
        elem.classList.add("point");
        elem.style.left = point.x + "px";
        elem.style.top = point.y + 1 + "px";
        document.getElementById("game-field").appendChild(elem);
      });
    } //змещення точок при зміщенні дошки

  }, {
    key: "renderPoint",
    value: function renderPoint() {
      var pointArr = this.getPointArr();
      var field = document.getElementById("game-field");
      var pointList = field.querySelectorAll(".point");

      for (var i = 0; i < pointList.length; i++) {
        pointList[i].style.left = pointArr[i].x + "px";
      }
    }
  }]);

  return Board;
}();