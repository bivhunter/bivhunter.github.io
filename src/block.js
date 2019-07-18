
export class Block {

	constructor(options) {
		this._x = options.x || 0;
		this._y = options.y || 0;
		this._blockClass = options.blockClass || "block";
        this._width = options.width || 50;
        this._height = options.height || 20;
		this._remove = false;
		this._init();
	}

    static isTouchBlockVsBall(block, ball) {
        let xColl = false;
        let yColl = false;

        if ((block.right() > ball.position.x - ball.radius) &&
            (block.left() < ball.position.x + ball.radius)) {
            xColl = true;
        }

        if ((block.bottom() > ball.position.y - ball.radius) &&
            (block.top() < ball.position.y + ball.radius)) {
            //console.log("collY");
            yColl = true;
        }

        return (xColl && yColl);
    }

    static  findNearVertex( block, ball ) {
        for ( let i = 0; i < block.getVertexes().length; i++ ) {
            let d = block.getVertexes()[ i ].diff( ball.position ).module();

            if ( d < ball.radius ) {
                return block.getVertexes()[ i ];
            }
        }
        return null;
    }

	_init() {

		let block = $("<div></div>").addClass("block").addClass(this._blockClass);
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

	_initVertexes() {
        this._A = new Vector( this.left(), this.top() );
        this._B = new Vector( this.right(), this.top() );
        this._C = new Vector( this.right(), this.bottom() );
        this._D = new Vector( this.left(), this.bottom() );
	}

	isContainCoord(vec) {
		return (vec.x > this.left() && vec.x < this.right() &&
			vec.y > this.top() && vec.y < this.bottom());
	}

	touching() {
		this._score = 0;
		if (this._blockClass === "block-strong") {
			this._changeClass("block-strong", "block-weak");
			this._score = 30;
		} else if (this._blockClass === "block-weak") {
			this._remove = true;
			this._score = 20;
		}
	}

	isRemove() {
		return this._remove;
	}

	getScore() {
		return this._score || 0;
	}

	getElem() {
		return this._block;
	}

	getVertexes() {
        this._initVertexes();
		return [
			this._A,
			this._B,
			this._C,
			this._D
		];
	}

	right() {
		return this._x + this._width;
	}

	bottom() {
		return this._y + this._height;
	}

	top() {
		return this._y;
	}

	left() {
		return this._x;
	}

	_changeClass(cls1, cls2) {
		this._block.removeClass(cls1);
		this._block.addClass(cls2);
		this._blockClass = cls2;
	}
}