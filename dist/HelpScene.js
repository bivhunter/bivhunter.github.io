"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var HelpScene =
/*#__PURE__*/
function () {
  function HelpScene(game) {
    _classCallCheck(this, HelpScene);

    this._game = game;
    this._itemsObj = {
      Up: "↑  or  W",
      Down: "↓  or  S",
      Left: "←  or  A",
      Right: "→  or  D",
      "Select, Pause": "ENTER",
      "Quit, Back": "ESC",
      "Run ball": "SPACE"
    };

    this._init();
  }

  _createClass(HelpScene, [{
    key: "_init",
    value: function _init() {
      this._menu = new Menu({
        header: "Game help",
        menuItems: ["Back"]
      });
      this._help = document.createElement("div");

      this._help.classList.add("help");

      var table = document.createElement("table");
      table.classList.add("help-table");
      var trHead = document.createElement("tr");
      trHead.innerHTML = "<th>Action: </th> <th>Key</th>";
      table.appendChild(trHead);

      for (var key in this._itemsObj) {
        if (!this._itemsObj.hasOwnProperty(key)) {
          continue;
        }

        var tr = document.createElement("tr");
        tr.innerHTML = "<td>".concat(key, ": </td> <td>").concat(this._itemsObj[key], "</td>");
        table.appendChild(tr);
      }

      this._help.appendChild(table);
    }
  }, {
    key: "update",
    value: function update() {
      if (this._game.checkKeyPress(27) || this._game.checkKeyPress(13)) {
        this._game.gameField.removeChild(this._menu.getElem());

        this._game.returnScene();
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (!this._game.gameField.contains(this._menu.getElem())) {
        this._game.gameField.appendChild(this._menu.getElem());
      }

      if (!this._menu.getElem().contains(this._help)) {
        this._menu.getElem().appendChild(this._help);
      }
    }
  }]);

  return HelpScene;
}();