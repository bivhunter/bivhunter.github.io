"use strict";
class Block {
	constructor(options) {
		this.x = options.x || 0;
		this.y = options.y || 0;
		this._class = options.class || "block";
		this.remove = false;
		this._init();
	}

	_init() {
		let block = document.createElement("div");
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

	isContainCoord(vec) {
		return (vec.x > this.left() && vec.x < this.right() &&
			vec.y > this.top() && vec.y < this.bottom());
	}


	touching() {
		this.score = 0;
		if (this._class === "bricks") {
			this._changeClass("bricks", "bricks-2");
			this.score = 20;
		} else if (this._class === "penoblock") {
			this.remove = true;
			this.score = 20;
		} else if (this._class === "bricks-2") {
			this.remove = true;
			this.score = 30;
		}
	}

	getScore() {
		return this.score;
	}

	getElem() {
		return this._block;
	}

	getVertexs() {
		return [
			this.A,
			this.B,
			this.C,
			this.D
		]
	}

	right() {
		return this.x + this._width;
	}

	bottom() {
		return this.y + this._height;
	}

	top() {
		return this.y;
	}

	left() {
		return this.x;
	}

	_changeClass(cls1, cls2) {
		this._block.classList.remove(cls1);
		this._block.classList.add(cls2);
		this._class = cls2;
	}

	/*remove() {
		this._block.remove();
	}*/


}