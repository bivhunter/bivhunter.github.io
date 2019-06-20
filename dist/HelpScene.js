"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HelpScene = function () {
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

            this._help = $("<div></div>").addClass("help");

            var table = $("<table></table>").addClass("help-table").appendTo(this._help);

            $("<tr></tr>").html("<th>Action: </th> <th>Key</th>").appendTo(table);

            for (var key in this._itemsObj) {
                if (!this._itemsObj.hasOwnProperty(key)) {
                    continue;
                }

                $("<tr></tr>").html("<td>" + key + ": </td> <td>" + this._itemsObj[key] + "</td>").appendTo(table);
            }

            /*
            this._help = document.createElement("div");
            this._help.classList.add("help");
              let table = document.createElement("table");
            table.classList.add("help-table");
            let trHead = document.createElement("tr");
            trHead.innerHTML = `<th>Action: </th> <th>Key</th>`;
            table.appendChild(trHead);
              for (let key in this._itemsObj) {
                if (!this._itemsObj.hasOwnProperty(key)) {
                    continue;
                }
                  let tr = document.createElement("tr");
                tr.innerHTML = `<td>${key}: </td> <td>${this._itemsObj[key]}</td>`;
                table.appendChild(tr);
            }
              this._help.appendChild(table);
            */
        }
    }, {
        key: "update",
        value: function update() {
            if (this._game.checkKeyPress(27) || this._game.checkKeyPress(13)) {
                this._menu.getElem().remove();
                this._game.returnScene();
            }
        }
    }, {
        key: "render",
        value: function render() {
            if (!this._game.gameField.find("*").is(this._menu.getElem())) {
                this._game.gameField.append(this._menu.getElem());
            }

            if (!this._menu.getElem().find("*").is(this._help)) {
                this._menu.getElem().append(this._help);
            }
        }
    }]);

    return HelpScene;
}();