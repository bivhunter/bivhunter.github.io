class Menu {
	constructor(options) {
		this._header = options.header;
		this._menuItems = options.menuItems || [];
		this._init();
	}

	_init() {
		let menuWrapper = document.createElement("div");
		menuWrapper.classList.add("menu");

		let header = document.createElement("h1");
		header.textContent = this._header;
		header.classList.add("menu-header");

		let menuItems = document.createElement("ul");

		this._menuItems.forEach(item => {
			let listItem = document.createElement("li");
			menuItems.appendChild(listItem);


			let span = document.createElement("span");
            listItem.appendChild(span);
            span.textContent = item;

			let temp = item.split(" ");
			item = temp.join("-");
			listItem.classList.add("menu-" + item.toLowerCase());



		});

		menuItems.classList.add("menu-list");

		menuWrapper.appendChild(header);
		menuWrapper.appendChild(menuItems);
		this._elem = menuWrapper;
		this._menuItems = menuItems;

		this.marker = document.createElement("div");
		this.marker.classList.add("menu-marker");
		this.selectedItem = menuItems.firstElementChild;

        this.selectedItem.querySelector("span").appendChild(this.marker);
		this.selectedItem.classList.add("menu-selected");
		//console.log(menuWrapper);
	}

	selectNext() {
		let selectedItem = this._menuItems.querySelector(".menu-selected");
		selectedItem.classList.remove("menu-selected");
		if (selectedItem.nextElementSibling) {
			selectedItem.nextElementSibling.classList.add("menu-selected");
		} else {
			this._menuItems.firstElementChild.classList.add("menu-selected");
		}
        selectedItem = this._menuItems.querySelector(".menu-selected");
		selectedItem.querySelector("span").appendChild(this.marker);
	}

	selectPrevious() {
		let selectedItem = this._menuItems.querySelector(".menu-selected");
		selectedItem.classList.remove("menu-selected");
		if (selectedItem.previousElementSibling) {
			selectedItem.previousElementSibling.classList.add("menu-selected");
		} else {
			this._menuItems.lastElementChild.classList.add("menu-selected");
		}
        selectedItem = this._menuItems.querySelector(".menu-selected");
        selectedItem.querySelector("span").appendChild(this.marker);
	}

	getSelectedItem() {
		return this._elem.querySelector(".menu-selected");
	}

	getElem() {
		return this._elem;
	}
}

class Header {
	constructor(options) {
		this.score = options.score || 0;
		this.life = options.lifes || 0;
		this.round = options.round || 1;

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
			li.textContent = `${key}: `;

			let span = document.createElement("span");
			let classStr = "header-" + key.toLowerCase();
			span.classList.add(classStr);
			span.textContent = this.options[key];

			ul.appendChild(li);
			li.appendChild(span);
		}
		this._elem = ul;

	}

	getElem() {
		return this._elem;
	}

	setRound(str) {
		this._elem.querySelector(".header-round").textContent = str;
	}

	setLifes(str) {
		this._elem.querySelector(".header-lifes").textContent = str;
	}

	setScore(str) {
		this._elem.querySelector(".header-score").textContent = str;
	}

}

class Round {
	constructor() {
		this._rounds = {
			round_1: [
				"                    ",
				"                    ",
				"         p          ",
			],
            round_2: [
                "                    ",
                "                    ",
                "         b          ",
            ],
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

		};
		this._activeRound = this._rounds.round_1;
		this._activeRoundNum = 1;
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
    constructor (text) {
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

    getElem () {
        return this._elem;
    }

    addText(text) {
        this._message.textContent += text;
	}

    setText(text) {
        this._message.textContent = text;
    }

}