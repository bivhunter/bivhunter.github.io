class InfoScene {
    constructor (game, round) {
        this._game = game;
        this._round = round;
        this._time = 0;
        this._init();
    }

    _init() {
        let div = document.createElement("div");
        div.classList.add("info");
        let message = document.createElement("h1");
        message.classList.add("info-message");
        div.appendChild(message);
        this._game.gameField.appendChild(div);
        this._text = "Round " + this._round.getActiveRoundNum();
        this._message = message;
    }

    update(dt) {

        this._message.textContent = this._text;
        this._time += dt;
        if (this._time > 4) {
            this._game.setScene(GameScene, this._round);
        }
    }

    render() {

    }
}