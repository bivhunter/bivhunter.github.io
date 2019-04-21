"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Block = function () {
	function Block(options) {
		_classCallCheck(this, Block);

		this.x = options.x || 0;
		this.y = options.y || 0;
		this._class = options.class || "block";
		this.remove = false;
		this._init();
	}

	_createClass(Block, [{
		key: "_init",
		value: function _init() {
			var block = document.createElement("div");
			block.classList.add("block");
			block.classList.add(this._class);
			/*block.innerHTML = this.x + "   " + this.y;*/

			this._width = 50;
			this._height = 20;
			block.style.left = this.x + "px";
			block.style.top = this.y + "px";

			this.A = {
				x: this.left(),
				y: this.top()
			};

			this.B = {
				x: this.right(),
				y: this.top()
			};

			this.C = {
				x: this.right(),
				y: this.bottom()
			};

			this.D = {
				x: this.left(),
				y: this.bottom()
			};

			this._block = block;
		}
	}, {
		key: "isContainCoord",
		value: function isContainCoord(vec) {
			return vec.x > this.left() && vec.x < this.right() && vec.y > this.top() && vec.y < this.bottom();
		}
	}, {
		key: "touching",
		value: function touching() {
			var score = 0;
			if (this._class === "bricks") {
				this._changeClass("bricks", "bricks-2");
				score = 20;
			} else if (this._class === "penoblock") {
				this.remove = true;
				score = 20;
			} else if (this._class === "bricks-2") {
				this.remove = true;
				score = 30;
			}
			return score;
		}
	}, {
		key: "getElem",
		value: function getElem() {
			return this._block;
		}
	}, {
		key: "getVertexs",
		value: function getVertexs() {
			return [this.A, this.B, this.C, this.D];
		}
	}, {
		key: "right",
		value: function right() {
			return this.x + this._width;
		}
	}, {
		key: "bottom",
		value: function bottom() {
			return this.y + this._height;
		}
	}, {
		key: "top",
		value: function top() {
			return this.y;
		}
	}, {
		key: "left",
		value: function left() {
			return this.x;
		}
	}, {
		key: "_changeClass",
		value: function _changeClass(cls1, cls2) {
			this._block.classList.remove(cls1);
			this._block.classList.add(cls2);
			this._class = cls2;
		}

		/*remove() {
  	this._block.remove();
  }*/

	}]);

	return Block;
}();