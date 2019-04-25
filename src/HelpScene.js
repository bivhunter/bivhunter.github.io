class HelpScene {
    constructor(game) {
        this._game = game;
        this._itemsObj = {
            Up: "↑  or  W",
            Down: "↓  or  S",
            Left: "←  or  A",
            Right: "→  or  D",
            "Select, Pause": "ENTER",
            "Quit, Back": "ESC",
            "Run ball": "SPACE"
        };

        this._init();
    }

    _init() {
        let menu = new Menu({
            header: "Game help",
            menuItems: ["Back"]
        });
        this._menu = menu;

        this._help = document.createElement("div");
        this._help.classList.add("help");

        let table = document.createElement("table");
        table.classList.add("help-table");
        let trHead = document.createElement("tr");
        trHead.innerHTML = `<th>Action: </th> <th>Key</th>`;
        table.appendChild(trHead);

        for (let key in this._itemsObj) {
            let tr = document.createElement("tr");
            tr.innerHTML = `<td>${key}: </td> <td>${this._itemsObj[key]}</td>`;
            table.appendChild(tr);
        }

        this._help.appendChild(table);

    }

    update() {
        if (this._game.checkKeyPress(27) || this._game.checkKeyPress(13)) {
            this._game.returnScene();
        }
    }

    render() {
        if (!this._game.gameField.contains(this._menu.getElem())) {
            this._game.gameField.appendChild(this._menu.getElem());
        }

        if (!this._menu.getElem().contains(this._help)) {
            this._menu.getElem().appendChild(this._help);
        }

    }
}