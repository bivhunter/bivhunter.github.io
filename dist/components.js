"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Menu = function () {
	function Menu(options) {
		_classCallCheck(this, Menu);

		this._header = options.header;
		this._menuItems = options.menuItems || [];
		this._init();
	}

	_createClass(Menu, [{
		key: "_init",
		value: function _init() {
			var menuWrapper = document.createElement("div");
			menuWrapper.classList.add("menu");

			var header = document.createElement("h1");
			header.textContent = this._header;
			header.classList.add("menu-header");

			var menuItems = document.createElement("ul");

			this._menuItems.forEach(function (item) {
				var listItem = document.createElement("li");
				menuItems.appendChild(listItem);

				var span = document.createElement("span");
				listItem.appendChild(span);
				span.textContent = item;

				var temp = item.split(" ");
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
	}, {
		key: "selectNext",
		value: function selectNext() {
			var selectedItem = this._menuItems.querySelector(".menu-selected");
			selectedItem.classList.remove("menu-selected");
			if (selectedItem.nextElementSibling) {
				selectedItem.nextElementSibling.classList.add("menu-selected");
			} else {
				this._menuItems.firstElementChild.classList.add("menu-selected");
			}
			selectedItem = this._menuItems.querySelector(".menu-selected");
			selectedItem.querySelector("span").appendChild(this.marker);
		}
	}, {
		key: "selectPrevious",
		value: function selectPrevious() {
			var selectedItem = this._menuItems.querySelector(".menu-selected");
			selectedItem.classList.remove("menu-selected");
			if (selectedItem.previousElementSibling) {
				selectedItem.previousElementSibling.classList.add("menu-selected");
			} else {
				this._menuItems.lastElementChild.classList.add("menu-selected");
			}
			selectedItem = this._menuItems.querySelector(".menu-selected");
			selectedItem.querySelector("span").appendChild(this.marker);
		}
	}, {
		key: "getSelectedItem",
		value: function getSelectedItem() {
			return this._elem.querySelector(".menu-selected");
		}
	}, {
		key: "getElem",
		value: function getElem() {
			return this._elem;
		}
	}]);

	return Menu;
}();

var Header = function () {
	function Header(options) {
		_classCallCheck(this, Header);

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

	_createClass(Header, [{
		key: "_init",
		value: function _init() {

			/*let header = document.createElement("div");
   header.classList.add("header");*/

			var ul = document.createElement("ul");
			ul.classList.add("header-list");
			//		header.appendChild(ul);

			for (var key in this.options) {
				var li = document.createElement("li");
				li.textContent = key + ": ";

				var span = document.createElement("span");
				var classStr = "header-" + key.toLowerCase();
				span.classList.add(classStr);
				span.textContent = this.options[key];

				ul.appendChild(li);
				li.appendChild(span);
			}
			this._elem = ul;
		}
	}, {
		key: "getElem",
		value: function getElem() {
			return this._elem;
		}
	}, {
		key: "setRound",
		value: function setRound(str) {
			this._elem.querySelector(".header-round").textContent = str;
		}
	}, {
		key: "setLifes",
		value: function setLifes(str) {
			this._elem.querySelector(".header-lifes").textContent = str;
		}
	}, {
		key: "setScore",
		value: function setScore(str) {
			this._elem.querySelector(".header-score").textContent = str;
		}
	}]);

	return Header;
}();

var Round = function () {
	function Round() {
		_classCallCheck(this, Round);

		this._rounds = {
			round_Demo: ["                    ", "                    ", "                    ", "    p        p    ", "   p p      p p   ", "  p p p    p p p  ", " p p p p  p p p p ", "p p p p pp p p p p", " p p p p  p p p p ", "  p p p    p p p  ", "   p p      p p   ", "    p        p    "],
			round_1: ["                    ", "                    ", "         p          "],
			round_2: ["                    ", "                    ", "         b          "],
			round_4: ["                    ", "                    ", "                    ", "bbbbbbbbbbbbbbbbbb", "bbbbbbbbbbbbbbbbbb", "bbbbbbbbbbbbbbbbbb", "bbbbbbbbbbbbbbbbbb", "bbbbbbbbbbbbbbbbbb", "bbbbbbbbbbbbbbbbbb", "bbbbbbbbbbbbbbbbbb", "bbbbbbbbbbbbbbbbbb", "bbbbbbbbbbbbbbbbbb"],
			round_3: ["                    ", "                    ", "                    ", "    p        p    ", "   p p      p p   ", "  p p p    p p p  ", " p p p p  p p p p ", "p p p p pp p p p p", " p p p p  p p p p ", "  p p p    p p p  ", "   p p      p p   ", "    p        p    "]

		};
		this._activeRound = this._rounds.round_Demo;
		this._activeRoundNum = "Demo";
		console.log("round", this._activeRoundNum);
	}

	_createClass(Round, [{
		key: "getActiveRound",
		value: function getActiveRound() {
			return this._activeRound;
		}
	}, {
		key: "getFirstRound",
		value: function getFirstRound() {
			this._activeRound = this._rounds.round_1;
			this._activeRoundNum = 1;
			return this;
		}
	}, {
		key: "getActiveRoundNum",
		value: function getActiveRoundNum() {
			return this._activeRoundNum;
		}
	}, {
		key: "getNextRound",
		value: function getNextRound() {
			var round = "round_" + (this._activeRoundNum + 1);
			if (!this._rounds[round]) {
				return null;
			}
			this._activeRound = this._rounds[round];
			this._activeRoundNum++;
			return this;
		}
	}]);

	return Round;
}();

var Info = function () {
	function Info(text) {
		_classCallCheck(this, Info);

		this._text = text;
		this.time = 0;
		this.animationTime = 0;
		this.count = 0;
		this._init();
	}

	_createClass(Info, [{
		key: "_init",
		value: function _init() {
			var div = document.createElement("div");
			div.classList.add("info");
			this._elem = div;
			var message = document.createElement("p");
			message.classList.add("info-message");
			message.textContent = this._text;
			this._message = message;
			div.appendChild(message);
		}
	}, {
		key: "enableAnimation",
		value: function enableAnimation() {
			this.isAnimation = true;
		}
	}, {
		key: "disableAnimation",
		value: function disableAnimation() {
			this.isAnimation = false;
			this.time = 0;
			this.animationTime = 0;
			this.count = 0;
		}
	}, {
		key: "animate",
		value: function animate(dt, duration, text) {
			if (!this.isAnimation) {
				return;
			}

			if (this.time < duration) {
				this.time += dt;
				var period = duration / (text.length + 5);
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
	}, {
		key: "getElem",
		value: function getElem() {
			return this._elem;
		}
	}, {
		key: "addText",
		value: function addText(text) {
			this._message.textContent += text;
		}
	}, {
		key: "setText",
		value: function setText(text) {
			this._message.textContent = text;
		}
	}]);

	return Info;
}();