"use strict";

var _game = require("./game");

var _jquery = require("/lib/jquery-3.4.1");

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Запуск гри

var gameLounch = new _game.Game((0, _jquery2.default)("#game-field"), (0, _jquery2.default)("#header-field"));