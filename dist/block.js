"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Block = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require("/lib/jquery-3.4.1");

var _jquery2 = _interopRequireDefault(_jquery);

var _components = require("./components");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Block = exports.Block = function () {
	function Block(options) {
		_classCallCheck(this, Block);

		this._x = options.x || 0;
		this._y = options.y || 0;
		this._blockClass = options.blockClass || "block";
		this._width = options.width || 50;
		this._height = options.height || 20;
		this._remove = false;
		this._init();
	}

	_createClass(Block, [{
		key: "_init",
		value: function _init() {

			var block = (0, _jquery2.default)("<div></div>").addClass("block").addClass(this._blockClass);
			block.css({
				left: this._x,
				top: this._y
			});
			this._block = block;

			/*let block = document.createElement("div");
   block.classList.add("block");
   block.classList.add(this._blockClass);
   		block.style.left = this._x + "px";
   block.style.top = this._y + "px";
   this._block = block;*/
		}
	}, {
		key: "_initVertexes",
		value: function _initVertexes() {
			this._A = new _components.Vector(this.left(), this.top());
			this._B = new _components.Vector(this.right(), this.top());
			this._C = new _components.Vector(this.right(), this.bottom());
			this._D = new _components.Vector(this.left(), this.bottom());
		}
	}, {
		key: "isContainCoord",
		value: function isContainCoord(vec) {
			return vec.x > this.left() && vec.x < this.right() && vec.y > this.top() && vec.y < this.bottom();
		}
	}, {
		key: "touching",
		value: function touching() {
			this._score = 0;
			if (this._blockClass === "block-strong") {
				this._changeClass("block-strong", "block-weak");
				this._score = 30;
			} else if (this._blockClass === "block-weak") {
				this._remove = true;
				this._score = 20;
			}
		}
	}, {
		key: "isRemove",
		value: function isRemove() {
			return this._remove;
		}
	}, {
		key: "getScore",
		value: function getScore() {
			return this._score || 0;
		}
	}, {
		key: "getElem",
		value: function getElem() {
			return this._block;
		}
	}, {
		key: "getVertexes",
		value: function getVertexes() {
			this._initVertexes();
			return [this._A, this._B, this._C, this._D];
		}
	}, {
		key: "right",
		value: function right() {
			return this._x + this._width;
		}
	}, {
		key: "bottom",
		value: function bottom() {
			return this._y + this._height;
		}
	}, {
		key: "top",
		value: function top() {
			return this._y;
		}
	}, {
		key: "left",
		value: function left() {
			return this._x;
		}
	}, {
		key: "_changeClass",
		value: function _changeClass(cls1, cls2) {
			this._block.removeClass(cls1);
			this._block.addClass(cls2);
			this._blockClass = cls2;
		}
	}], [{
		key: "isTouchBlockVsBall",
		value: function isTouchBlockVsBall(block, ball) {
			var xColl = false;
			var yColl = false;

			if (block.right() > ball.position.x - ball.radius && block.left() < ball.position.x + ball.radius) {
				xColl = true;
			}

			if (block.bottom() > ball.position.y - ball.radius && block.top() < ball.position.y + ball.radius) {
				//console.log("collY");
				yColl = true;
			}

			return xColl && yColl;
		}
	}, {
		key: "findNearVertex",
		value: function findNearVertex(block, ball) {
			for (var i = 0; i < block.getVertexes().length; i++) {
				var d = block.getVertexes()[i].diff(ball.position).module();

				if (d < ball.radius) {
					return block.getVertexes()[i];
				}
			}
			return null;
		}
	}]);

	return Block;
}();