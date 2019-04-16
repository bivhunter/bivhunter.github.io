"use strict";

class Ball {
	constructor(options) {
		//розмір шару
		this._size = options.size || 30;
		this._color = options.color || "#FF2323";
		this._borderColor = options.borderColor || "#A70000";
		//частота виклику setInterval
		//this._timeInterval = options.timeInterval || 30;
		this._coord = options.coord || {
			x: 250,
			y: 100
		};
		//зміна позиції px за інтервал
		this._step = 10;
		//рівняння  прямої руху (y = kx + b), d знак зміни x
		this._coordRule = options.coord || {
			k: -0.5,
			b: this._coord.y - this._coord.x * -0.5,
			d: -1
		}
	}

	_render() {
		this._ball = document.createElement("div");
		this._ball.classList.add("ball");
		//-6 для компенсації board
		this._ball.style.width = this._size - 6 + "px";
		this._ball.style.height = this._size - 6 + "px";

		this._ball.style.borderRadius = this._size - 6 + "px";
		//this._ball.style.border = `3px  ${this._borderColor}`;
		this._ball.style.borderStyle = "groove ridge ridge groove";
		this._ball.style.borderWidth = "3px";
		this._ball.style.borderColor = this._borderColor;
		this._ball.style.position = 'absolute';
		this._ball.style.background = `radial-gradient(white, ${this._color})`;
		//переміщення на початкову позицію
		this._setPosition(this._coord);
	}

	startMove() {
		//щоб не створювалося більше одного інтервалу
		this._blockList = this._ball.parentNode.querySelectorAll(".block");
		clearInterval(this._timerId);
		this._timerId = setInterval(() => {
			this._move();
		}, this._timeInterval);
	}

	stopMove() {
		clearInterval(this._timerId);
	}

	_move() {
		this._calcCoord(this._coord);
		this._setPosition(this._coord);
	}

	_calcY(x) {
		return x * this._coordRule.k + this._coordRule.b
	}

	_calcX(y) {
		return Math.round((y - this._coordRule.b) / this._coordRule.k);
	}

	_calcB() {
		return this._coord.y - this._coord.x * this._coordRule.k;
	}


	_calcCoord(coord) {
		///let borderCoord = this._ball.parentNode.getBoundingClientRect();
		/*this._finalRule = {
			k: this._coordRule.k,
			b: this._coordRule.b,
			d: this._coordRule.d * this._step,
		}*/

		let shiftX = coord.x + this._coordRule.d * this._step;
		//console.log(shiftX);
		this._coord = {
			x: shiftX,
			y: this._calcY(shiftX)
		}

		this._touchLeft(this._coord);
		this._touchTop(this._coord);
		this._touchRight(this._coord);
		this._touchBottom(this._coord);

		if (this._isTouchBlock(this._blockList[0])) {
			console.log("touch");
			//this._touchBlock(this._blockList[0]);
			this.stopMove();
		};
		//console.log(this._coord);
		//console.log(coord);
	}

	/*_touchBlock(block) {
		let ballRect = this._ball.getBoundingRect();
		if ()
	}*/

	_isTouchBlock(block) {
		let xColl = false;
		let yColl = false;
		let block_x = parseInt(getComputedStyle(block).left);
		console.log(block_x + " " + block.offsetWidth + " " + this._coord.x);
		console.log(block_x + block.offsetWidth >= this._coord.x)
		let block_y = parseInt(getComputedStyle(block).top);
		//console.log(block);
		if ((block_x + block.offsetWidth >= this._coord.x) &&
			(block_x <= this._coord.x + this._ball.offsetWidth)) {
			console.log("collX");
			xColl = true;
		}

		if ((block_y + block.offsetHeight >= this._coord.y) &&
			(block_y <= this._coord.y + this._ball.offsetHeight)) {
			console.log("collY");
			yColl = true;
		}

		if (xColl && yColl) {
			return true;
		}
		return false;
	}

	//задання координат при дотику, та зміна рівняння прямої руху
	_touchLeft(coord) {
		if (coord.x < this._step) {
			this._coord.x = 0;
			this._coord.y = this._calcY(0);

			this._coordRule.d = -this._coordRule.d;
			this._coordRule.k = -this._coordRule.k;
			//console.log("touch");
		}
	}

	_touchTop(coord) {
		if (coord.y < this._step * Math.abs(this._coordRule.k)) {
			this._coord.y = 0;
			this._coord.x = this._calcX(0);
			//this._coordRule.d = -this._coordRule.d;

			this._coordRule.k = -this._coordRule.k;
			this._coordRule.b = this._calcB();

			//console.log("touch");
		}
	}

	_touchRight(coord) {
		let rightBorder = this._ball.parentNode.clientWidth - this._ball.offsetWidth;
		if (coord.x > rightBorder - this._step) {
			this._coord.x = rightBorder;
			this._coord.y = this._calcY(rightBorder);

			this._coordRule.d = -this._coordRule.d;
			this._coordRule.k = -this._coordRule.k;
			this._coordRule.b = this._calcB();
			console.log("touch");
		}
	}

	_touchBottom(coord) {
		let bottomBorder = this._ball.parentNode.clientHeight - this._ball.offsetHeight;
		if (coord.y > bottomBorder - this._step * Math.abs(this._coordRule.k)) {
			this._coord.y = bottomBorder;
			this._coord.x = this._calcX(bottomBorder);
			//this._coordRule.d = -this._coordRule.d;

			this._coordRule.k = -this._coordRule.k;
			this._coordRule.b = this._calcB();

			//console.log("touch");
		}
	}



	_setPosition(coord) {
		this._ball.style.left = coord.x + "px";
		this._ball.style.top = coord.y + "px";
	}

	getElem() {
		this._render();
		return this._ball;
	}
}

/*let ball = new Ball({});
let ballElem = ball.getElem();

function macroCollision(obj1, obj2) {

}

document.getElementById("game-field").appendChild(ballElem);
//ball.startMove();

document.getElementById("start").addEventListener("click", () => {
	ball.startMove();
});

document.getElementById("stop").addEventListener("click", () => {
	ball.stopMove();
});
*/
/*setInterval(() => {
	ball.stopMove();
}, 2000);*/