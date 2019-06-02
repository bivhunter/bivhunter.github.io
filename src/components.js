"use strict";

//Параметри текст заголовку і пунктів меню
//Має методи виділення попереднього і наступного пунктів по колу, зміною CSS классу "menu_selected"
//CSS класси побудовані на основі назви пункту меню, використовуються для подальших дій зовнішніми
//об'єктами після підтвердження вибору конкретного пункту меню
class Menu {
	constructor(options) {
		this._headerText = options.header || "";
		this._menuItemsList = options.menuItems || [];
		this._init();
	}

	_init() {
		let menuWrapper = document.createElement("div");
		menuWrapper.classList.add("menu");
		
        this._initMenuList();

        menuWrapper.appendChild(this._initHeader());
        menuWrapper.appendChild(this._menuList);

        
		this._elem = menuWrapper;
		this._initMarker();

		//console.log(menuWrapper);
	}

	_initHeader() {
        let header = document.createElement("h1");
        header.textContent = this._headerText;
        header.classList.add("menu-header");
        return header;
    }
	
	_initMenuList() {
        let menuList = document.createElement("ul");
        this._menuItemsList.forEach(item => {
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
        
        this._menuList = menuList;
    }
	
	_initMarker() {
        this._marker = document.createElement("div");
        this._marker.classList.add("menu-marker");

        let selectedItem = this._menuList.firstElementChild;
        this._selectedItem = selectedItem;
        this._select(selectedItem);


	}

	_select(elem) {
		this._selectedItem.classList.remove("menu-selected");
		elem.classList.add("menu-selected");
		elem.querySelector("span").appendChild(this._marker);
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
		/*this.score = options.score || 0;
		this.life = options.life || 0;
		this.round = options.round || 0;*/

		this._options = {
			Round: options.round || 0,
			Life: options.life || 0,
			Score: options.score || 0
		};
		this._init();
	}

	_init() {

		/*let header = document.createElement("div");
		header.classList.add("header");*/

		let ul = document.createElement("ul");
		ul.classList.add("header-list");
		//		header.appendChild(ul);

		for (let key in this._options) {
			if(!this._options.hasOwnProperty(key)) {
				continue;
			}
			let li = document.createElement("li");
			let span = document.createElement("span");
			let classStr = "header-" + key.toLowerCase();

			span.classList.add(classStr);
			span.textContent = `${key}: ${this._options[key]}`;

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

	setLife(str) {
		this._elem.querySelector(".header-life").textContent = "Life: " + str;
	}

	setScore(str) {
		this._elem.querySelector(".header-score").textContent = "Score: " + str;
	}

}

class Round {
	constructor() {
		this._rounds = {
			round_Demo: [
				"                   ",
                "                   ",
                "                   ",
				"    w         w    ",
				"   w w       w w   ",
				"  w s w     w s w  ",
				" w s s w s w s s w ",
				"w s w s w w s w s w",
				" w s s w s w s s w ",
				"  w s w     w s w  ",
				"   w w       w w   ",
				"    w         w    "
			],
			round_1: [
                "                   ",
                "                   ",
                "                   ",
				"ww w  w  w  wwww  w",
				"  w  w  w  wwww  w ",
				" w  w  w  wwww  w  ",
				"w  w  w  wwww  w  w",
				"  w  w  wwww  w  w ",
				" w  w  wwww  w  w  ",
				"w  w  wwww  w  w  w",
				"  w  wwww  w  w  w ",
				" w  wwww  w  w  w  "
				],
			round_2: [
                "                   ",
                "                   ",
                "                   ",
				"    www  w  www    ",
				"  w  w  www  w  w  ",
				" www   wwwww   www ",
				"wwsww wwwswww wwsww",
				" sws wssswsssw sws ",
				"wwsww wwwswww wwsww",
				" www   wwwww   www ",
				"  w  w  www  w  w  ",
				"    w w  w  w w    "
			],
            round_3: [
                "                   ",
                "                   ",
                "                   ",
				"wwwww s  w  s wwwww",
				"swwwss  wsw  sswwws",
				" www   wsssw   www ",
				" sws  ws w sw  sws ",
				"s w  ws wsw sw  w s",
				"  s ws wsssw sw s  ",
				"   ws w sws w sw   ",
				"w ws w  w w  w sw w",
				" ws w sw w ws w sw "
			],
            round_4: [
                "                   ",
                "                   ",
                "                   ",
				"  sws  wswsw  sws  ",
				"w wsw  w w w  wsw w",
				" w s w   w   w s w ",
				"w  w  wswswsw  w  w",
				"sswwwsswwwwwsswwwss",
				"w  w  wswswsw  w  w",
				" w s w   w   w s w ",
				"w wsw  w w w  wsw w",
				"  sws  wswsw  sws  "
			],
            round_5: [
                "                   ",
                "                   ",
                "                   ",
				"s   sss  w  sss   s",
				"  w  s  w w  s  w  ",
				" w w   w s w   w w ",
				"w s wsw sws wsw s w",
				" sws w swsws w sws ",
				"w s wsw sws wsw s w",
				" w w   w s w   w w ",
				"  w  s  w w  s  w  ",
				"s   sss  w  sss   s"
			],
            round_6: [
                "                   ",
                "                   ",
                "                   ",
				"    wsw  w  wsw    ",
				"  w  w  wsw  w  w  ",
				" wsw   wsssw   wsw ",
				"wswsw wsswssw wswsw",
				"swwwswsswwwsswswwws",
				"wswsw wsswssw wswsw",
				" wsw   wsssw   wsw ",
				"  w  w  wsw  w  w  ",
				"    wsw  w  wsw w  "
			],
            round_7: [
                "                   ",
                "                   ",
                "                   ",
				"s w  s wswsw s  w s",
				" wsw s w w w s wsw ",
				"w w w w www w w w w",
				" wsw swswswsws wsw ",
				"wswsswswswswswsswsw",
				" wsw swswswsws wsw ",
				"w w w w www w w w w",
				" wsw s w w w s wsw ",
				"s w  s wswsw s  w s"
			],
            round_8: [
                "                   ",
                "                   ",
                "                   ",
				"swwwsws sws swswwws",
				" sws ws  w  sw sws ",
				"w w ws sw ws sw w w",
				"ws sw  swsws  ws sw",
				" wswssswswswssswsw ",
				"sw w s w w w s w ws",
				" sws swswswsws sws ",
				"s w s w w w w s w s",
				"  w s  w w w  s w  "
			],
            round_9: [
                "                   ",
                "                   ",
                "                   ",
				"w s  w  sws  w  s w",
				" sws   swsws   sws ",
				"sw ws sws sws sw ws",
				"w s wsws w swsw s w",
				" ssssws wsw swssss ",
				"w s ws wsssw sw s w",
				"sw wsws wsw swsw ws",
				" sws sws w sws sws ",
				"w s   sws sws   s w"
			],
            round_10: [
                "                   ",
                "                   ",
                "                   ",
				"ssswsws wsw swswsss",
				" w wsw wsssw wsw w ",
				"s wsssw wsw wsssw s",
				"wswsssws w swssswsw",
				"swsswssssssssswssws",
				"wswsssws w swssswsw",
				"s wsssw wsw wsssw s",
				" w wsw wsssw wsw w ",
				"ssswsws wsw swswsss"
			]

		};
		this._activeRound = this._rounds.round_Demo;
		this._activeRoundNum = "Demo";
		//console.log("round", this._activeRoundNum);
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
		if ( !this._rounds[round] ) {
			return null;
		}
		this._activeRound = this._rounds[round];
		this._activeRoundNum ++;
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