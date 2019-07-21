"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//Параметри: текст заголовку і пунктів меню
//Має методи виділення попереднього і наступного пунктів по колу, зміною CSS классу "menu_selected"
//CSS класси побудовані на основі назви пункту меню, використовуються для подальших дій зовнішніми
//об'єктами після підтвердження вибору конкретного пункту меню
var Menu =
/*#__PURE__*/
function () {
  function Menu(options) {
    _classCallCheck(this, Menu);

    this._headerText = options.header || "";
    this._menuItemsList = options.menuItems || [];

    this._init();
  }

  _createClass(Menu, [{
    key: "_init",
    value: function _init() {
      var menuWrapper = document.createElement("div");
      menuWrapper.classList.add("menu");

      this._initMenuList();

      menuWrapper.appendChild(this._initHeader());
      menuWrapper.appendChild(this._menuList);
      this._elem = menuWrapper;

      this._initMarker();
    }
  }, {
    key: "_initHeader",
    value: function _initHeader() {
      var header = document.createElement("h1");
      header.textContent = this._headerText;
      header.classList.add("menu-header");
      return header;
    }
  }, {
    key: "_initMenuList",
    value: function _initMenuList() {
      var menuList = document.createElement("ul");

      this._menuItemsList.forEach(function (item) {
        var listItem = document.createElement("li");
        menuList.appendChild(listItem);
        var span = document.createElement("span");
        listItem.appendChild(span);
        span.textContent = item;
        var temp = item.split(" ");
        item = temp.join("-");
        listItem.classList.add("menu-" + item.toLowerCase());
      });

      menuList.classList.add("menu-list");
      this._menuList = menuList;
    }
  }, {
    key: "_initMarker",
    value: function _initMarker() {
      this._marker = document.createElement("div");

      this._marker.classList.add("menu-marker");

      var selectedItem = this._menuList.firstElementChild;
      this._selectedItem = selectedItem;

      this._select(selectedItem);
    }
  }, {
    key: "_select",
    value: function _select(elem) {
      this._selectedItem.classList.remove("menu-selected");

      elem.classList.add("menu-selected");
      elem.querySelector("span").appendChild(this._marker);
      this._selectedItem = elem;
    }
  }, {
    key: "selectNext",
    value: function selectNext() {
      if (this._selectedItem.nextElementSibling) {
        this._select(this._selectedItem.nextElementSibling);
      } else {
        this._select(this._menuList.firstElementChild);
      }
    }
  }, {
    key: "selectPrevious",
    value: function selectPrevious() {
      if (this._selectedItem.previousElementSibling) {
        this._select(this._selectedItem.previousElementSibling);
      } else {
        this._select(this._menuList.lastElementChild);
      }
    }
  }, {
    key: "getSelectedItem",
    value: function getSelectedItem() {
      return this._selectedItem;
    }
  }, {
    key: "getElem",
    value: function getElem() {
      return this._elem;
    }
  }]);

  return Menu;
}(); //Частина над ігровим полем з відображенням інформації про перебіг гри


var Header =
/*#__PURE__*/
function () {
  function Header(options) {
    _classCallCheck(this, Header);

    this._options = {
      Round: options.round || 0,
      Life: options.life || 0,
      Score: options.score || 0
    };

    this._init();
  }

  _createClass(Header, [{
    key: "_init",
    value: function _init() {
      var ul = document.createElement("ul");
      ul.classList.add("header-list"); //		header.appendChild(ul);

      for (var key in this._options) {
        if (!this._options.hasOwnProperty(key)) {
          continue;
        }

        var li = document.createElement("li");
        var span = document.createElement("span");
        var classStr = "header-" + key.toLowerCase();
        span.classList.add(classStr);
        span.textContent = "".concat(key, ": ").concat(this._options[key]); //Додає обгортку для показу блоку біля поля Score

        if (key === "Score") {
          var block = document.createElement("div");
          block.classList.add("header-block");
          li.appendChild(block);
        }

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
      this._elem.querySelector(".header-round").textContent = "Round: " + str;
    }
  }, {
    key: "setLife",
    value: function setLife(str) {
      this._elem.querySelector(".header-life").textContent = "Life: " + str;
    }
  }, {
    key: "setScore",
    value: function setScore(str) {
      this._elem.querySelector(".header-score").textContent = "Score: " + str;
    }
  }]);

  return Header;
}(); //Має колекцію раундів у вигляді об'єкту, де ключ назва, а значення масив рядків які відповідають
//розміщенню блоків на ігровому полі


var Round =
/*#__PURE__*/
function () {
  function Round() {
    _classCallCheck(this, Round);

    this._rounds = {
      round_test: ["                   ", "                   ", "                   ", "              w    "],
      round_Demo: ["                   ", "                   ", "                   ", "    w         w    ", "   w w       w w   ", "  w s w     w s w  ", " w s s w s w s s w ", "w s w s w w s w s w", " w s s w s w s s w ", "  w s w     w s w  ", "   w w       w w   ", "    w         w    "],
      round_1: ["                   ", "                   ", "                   ", "ww w  w  w  wwww  w", "  w  w  w  wwww  w ", " w  w  w  wwww  w  ", "w  w  w  wwww  w  w", "  w  w  wwww  w  w ", " w  w  wwww  w  w  ", "w  w  wwww  w  w  w", "  w  wwww  w  w  w ", " w  wwww  w  w  w  "],
      round_2: ["                   ", "                   ", "                   ", "    www  w  www    ", "  w  w  www  w  w  ", " www   wwwww   www ", "wwsww wwwswww wwsww", " sws wssswsssw sws ", "wwsww wwwswww wwsww", " www   wwwww   www ", "  w  w  www  w  w  ", "    w w  w  w w    "],
      round_3: ["                   ", "                   ", "                   ", "wwwww s  w  s wwwww", "swwwss  wsw  sswwws", " www   wsssw   www ", " sws  ws w sw  sws ", "s w  ws wsw sw  w s", "  s ws wsssw sw s  ", "   ws w sws w sw   ", "w ws w  w w  w sw w", " ws w sw w ws w sw "],
      round_4: ["                   ", "                   ", "                   ", "  sws  wswsw  sws  ", "w wsw  w w w  wsw w", " w s w   w   w s w ", "w  w  wswswsw  w  w", "sswwwsswwwwwsswwwss", "w  w  wswswsw  w  w", " w s w   w   w s w ", "w wsw  w w w  wsw w", "  sws  wswsw  sws  "],
      round_5: ["                   ", "                   ", "                   ", "s   sss  w  sss   s", "  w  s  w w  s  w  ", " w w   w s w   w w ", "w s wsw sws wsw s w", " sws w swsws w sws ", "w s wsw sws wsw s w", " w w   w s w   w w ", "  w  s  w w  s  w  ", "s   sss  w  sss   s"],
      round_6: ["                   ", "                   ", "                   ", "    wsw  w  wsw    ", "  w  w  wsw  w  w  ", " wsw   wsssw   wsw ", "wswsw wsswssw wswsw", "swwwswsswwwsswswwws", "wswsw wsswssw wswsw", " wsw   wsssw   wsw ", "  w  w  wsw  w  w  ", "    wsw  w  wsw w  "],
      round_7: ["                   ", "                   ", "                   ", "s w  s wswsw s  w s", " wsw s w w w s wsw ", "w w w w www w w w w", " wsw swswswsws wsw ", "wswsswswswswswsswsw", " wsw swswswsws wsw ", "w w w w www w w w w", " wsw s w w w s wsw ", "s w  s wswsw s  w s"],
      round_8: ["                   ", "                   ", "                   ", "swwwsws sws swswwws", " sws ws  w  sw sws ", "w w ws sw ws sw w w", "ws sw  swsws  ws sw", " wswssswswswssswsw ", "sw w s w w w s w ws", " sws swswswsws sws ", "s w s w w w w s w s", "  w s  w w w  s w  "],
      round_9: ["                   ", "                   ", "                   ", "w s  w  sws  w  s w", " sws   swsws   sws ", "sw ws sws sws sw ws", "w s wsws w swsw s w", " ssssws wsw swssss ", "w s ws wsssw sw s w", "sw wsws wsw swsw ws", " sws sws w sws sws ", "w s   sws sws   s w"],
      round_10: ["                   ", "                   ", "                   ", "ssswsws wsw swswsss", " w wsw wsssw wsw w ", "s wsssw wsw wsssw s", "wswsssws w swssswsw", "swsswssssssssswssws", "wswsssws w swssswsw", "s wsssw wsw wsssw s", " w wsw wsssw wsw w ", "ssswsws wsw swswsss"]
    };
    this._activeRound = this._rounds.round_Demo;
    this._activeRoundNum = "Demo";
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
    key: "getDemoRound",
    value: function getDemoRound() {
      this._activeRound = this._rounds.round_Demo;
      this._activeRoundNum = "Demo";
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
}(); //Виводить повідомлення з анімацією
//Старт анімації (enableAnimation()),
//Сама анімація animate(dt, duration, text)
//Зупинити анімацію disableAnimation();


var Info =
/*#__PURE__*/
function () {
  function Info(text) {
    _classCallCheck(this, Info);

    this._text = text || "";

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
      this._isAnimation = true;
      this._animationLetterTime = 0;
      this._animationTime = 0;
      this._letterCount = 0;
    }
  }, {
    key: "disableAnimation",
    value: function disableAnimation() {
      this._isAnimation = false;
    }
  }, {
    key: "animate",
    value: function animate(dt, duration, text) {
      if (!this._isAnimation || this._animationTime > duration || this._letterCount >= text.length) {
        return;
      }

      this._animationTime += dt;
      var textNoSpace = text.replace(/\s+/g, ""); //"textNoSpace.length + 1", бо перед показом перщшої літери проходить 1 period

      var period = duration / (textNoSpace.length + 1);

      if (this._animationLetterTime < period) {
        this._animationLetterTime += dt;
        return;
      } //прибирає затримку на SPACE


      while (text[this._letterCount] === " ") {
        this.addText(text[this._letterCount]);
        this._letterCount++;
      }

      this.addText(text[this._letterCount]);
      this._animationLetterTime -= period;
      this._letterCount++;
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