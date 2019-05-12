class Menu {
	constructor(options) {
		this._header = options.header || "";
		this._menuList = options.menuItems || [];
		this._init();
	}

	_init() {
		let menuWrapper = document.createElement("div");
		menuWrapper.classList.add("menu");

		let header = document.createElement("h1");
		header.textContent = this._header;
		header.classList.add("menu-header");

		let menuList = document.createElement("ul");

		this._menuList.forEach(item => {
			let listItem = document.createElement("li");
			menuList.appendChild(listItem);


			let span = document.createElement("span");
			listItem.appendChild(span);
			span.textContent = item;

			let temp = item.split(" ");
			item = temp.join("-");
			listItem.classList.add("menu-" + item.toLowerCase());
		});

		menuList.classList.add("menu-list");

		menuWrapper.appendChild(header);
		menuWrapper.appendChild(menuList);
		this._elem = menuWrapper;
		this._menuList = menuList;

		this._initMarker();

		//console.log(menuWrapper);
	}

	_initMarker() {
        this.marker = document.createElement("div");
        this.marker.classList.add("menu-marker");

        let selectedItem = this._menuList.firstElementChild;
        this._selectedItem = selectedItem;
        this._select(selectedItem);


	}

	_select(elem) {
		this._selectedItem.classList.remove("menu-selected");
		elem.classList.add("menu-selected");
		elem.querySelector("span").appendChild(this.marker);
		this._selectedItem = elem;
	}

	selectNext() {
		if (this._selectedItem.nextElementSibling) {
            this._select(this._selectedItem.nextElementSibling);
		} else {
            this._select(this._menuList.firstElementChild);
		}
	}

	selectPrevious() {
		if (this._selectedItem.previousElementSibling) {
			this._select(this._selectedItem.previousElementSibling);
		} else {
			this._select(this._menuList.lastElementChild);
		}
	}

	getSelectedItem() {
		return this._selectedItem;
	}

	getElem() {
		return this._elem;
	}
}

class Header {
	constructor(options) {
		this.score = options.score || 0;
		this.life = options.lifes || 0;
		this.round = options.round || 0;

		this.options = {
			Round: this.round,
			Lifes: this.life,
			Score: this.score
		};
		this._init();
	}

	_init() {

		/*let header = document.createElement("div");
		header.classList.add("header");*/

		let ul = document.createElement("ul");
		ul.classList.add("header-list");
		//		header.appendChild(ul);

		for (let key in this.options) {
			let li = document.createElement("li");
			let span = document.createElement("span");
			let classStr = "header-" + key.toLowerCase();

			span.classList.add(classStr);
			span.textContent = `${key}: ${this.options[key]}`;

			if (key === "Score") {
				let block = document.createElement("div");
				block.classList.add("header-block");
				li.appendChild(block);
			}
			ul.appendChild(li);
			li.appendChild(span);
		}
		this._elem = ul;

	}

	getElem() {
		return this._elem;
	}

	setRound(str) {
		this._elem.querySelector(".header-round").textContent = "Round: " + str;
	}

	setLifes(str) {
		this._elem.querySelector(".header-lifes").textContent = "Lifes: " + str;
	}

	setScore(str) {
		this._elem.querySelector(".header-score").textContent = "Score: " + str;
	}

}

class Round {
	constructor() {
		this._rounds = {
			round_Demo: [
				"                    ",
				"                    ",
				"                    ",
				"    p        p    ",
				"   p p      p p   ",
				"  p p p    p p p  ",
				" p p p p  p p p p ",
				"p p p p pp p p p p",
				" p p p p  p p p p ",
				"  p p p    p p p  ",
				"   p p      p p   ",
				"    p        p    "
			],
			round_: [
				"                    ",
                "                    ",
                "                    ",
                "    p        p    ",
                "   p p      p p   ",
                "  p p p    p p p  ",
                " p p p p  p p p p ",
                "p p p p pp p p p p",
                " p p p p  p p p p ",
                "  p p p    p p p  ",
                "   p p      p p   ",
                "    p        p    "
		]
			,
						round_1: [
							"                    ",
							"                    ",
							"         p          ",
						]/*,
						round_4: [
							"                    ",
							"                    ",
							"                    ",
							"bbbbbbbbbbbbbbbbbb",
							"bbbbbbbbbbbbbbbbbb",
							"bbbbbbbbbbbbbbbbbb",
							"bbbbbbbbbbbbbbbbbb",
							"bbbbbbbbbbbbbbbbbb",
							"bbbbbbbbbbbbbbbbbb",
							"bbbbbbbbbbbbbbbbbb",
							"bbbbbbbbbbbbbbbbbb",
							"bbbbbbbbbbbbbbbbbb"
						],
						round_3: [
							"                    ",
							"                    ",
							"                    ",
							"    p        p    ",
							"   p p      p p   ",
							"  p p p    p p p  ",
							" p p p p  p p p p ",
							"p p p p pp p p p p",
							" p p p p  p p p p ",
							"  p p p    p p p  ",
							"   p p      p p   ",
							"    p        p    "
				]
*/
		};
		this._activeRound = this._rounds.round_Demo;
		this._activeRoundNum = "Demo";
		console.log("round", this._activeRoundNum);
	}

	getActiveRound() {
		return this._activeRound;
	}

	getFirstRound() {
		this._activeRound = this._rounds.round_1;
		this._activeRoundNum = 1;
		return this;
	}

	getDemoRound() {
		this._activeRound = this._rounds.round_Demo;
		this._activeRoundNum = "Demo";
		return this;
	}

	getActiveRoundNum() {
		return this._activeRoundNum;
	}

	getNextRound() {
		let round = "round_" + (this._activeRoundNum + 1);
		if (!this._rounds[round]) {
			return null;
		}
		this._activeRound = this._rounds[round];
		this._activeRoundNum++
			return this;
	}
}

class Info {
	constructor(text) {
		this._text = text;
		this.time = 0;
		this.animationTime = 0;
		this.count = 0;
		this._init();
	}

	_init() {
		let div = document.createElement("div");
		div.classList.add("info");
		this._elem = div;
		let message = document.createElement("p");
		message.classList.add("info-message");
		message.textContent = this._text;
		this._message = message;
		div.appendChild(message);

	}

	enableAnimation() {
		this.isAnimation = true;
	}

	disableAnimation() {
		this.isAnimation = false;
		this.time = 0;
		this.animationTime = 0;
		this.count = 0;
	}

	animate(dt, duration, text) {
		if (!this.isAnimation) {
			return;
		}

		if (this.time < duration) {
			this.time += dt;
			let period = duration / (text.length + 5);
			if (this.animationTime < period) {
				this.animationTime += dt;
			} else {
				if (this.count < text.length) {
					this.addText(text[this.count]);
					this.animationTime = 0;
					this.count++;
				}
			}

		}
	}

	getElem() {
		return this._elem;
	}

	addText(text) {
		this._message.textContent += text;
	}

	setText(text) {
		this._message.textContent = text;
	}

}