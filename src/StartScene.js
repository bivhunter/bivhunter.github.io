import $ from 'jquery';
import { GameScene } from "./GameScene";
import { Menu } from "./components";
import { Ball } from "./ball";
import { HelpScene } from "./HelpScene";
import { FinalScene } from "./FinalScene";
//Початкова сцена Гри з показом демо на фоні
//і початковим меню
export class StartScene extends GameScene {
	constructor(game) {
		super(game);
		console.log("start scene");
	}

	_initRound(round) {
		super._initRound(round);
		this._initMenu();
	}

	_initInfo() {
		super._initInfo();
		this._infoText = "Demo";

		//Щоб Info на задньому плані було нижче Menu
		this._info.getElem().css({
			background: "inherit",
			verticalAlign: "bottom"
		});
		/*
		this._info.getElem().style.background = "inherit";
		this._info.getElem().style.verticalAlign = "bottom";
		*/
	}

	_initMenu() {
		let menu = new Menu({
			header: "Ricochet",
			menuItems: [
				"Start Game",
				"Help",
				"Quit"
			]
		});

		this._menu = menu;
		this._menuElem = menu.getElem();
	}

	_initBall() {
		this._ball = new Ball({
			game: this,
			speed: 500,
			direction: {
				x: 0.1,
				y: -1
			}
		});
      
        this._ballElem = this._ball.getElem();

        this._deffBall.done( () => {
            this._ball.setRadius(this._ballElem.outerWidth() / 2);
            //this._isLoadBall = true;
            this._ball.sendToBoard( this._board );
        });
	}

	update(dt) {
		this._checkKeys();
		super.update(dt);
	}

	render(dt) {
        if (!this._game.gameField.find("*").is( $(this._menuElem) ) ) {
            this._game.gameField.append( $(this._menuElem) );
        }
		super.render(dt);
	}

	_checkKeys() {
		if (this._game.checkKeyPress(38) || this._game.checkKeyPress("W".charCodeAt(0))) {
			this._menu.selectPrevious();
		}

		if (this._game.checkKeyPress(40) || this._game.checkKeyPress("S".charCodeAt(0))) {
			this._menu.selectNext();
		}

		if (this._game.checkKeyPress(13)) {
			switch (this._menu.getSelectedItem().attr("data-name")) {
				case "start-game":
					this._game.life = 5;
					this._game.score = 0;
                    this._game.round.getFirstRound();
					this._game.setScene({
						scene: GameScene,
						isClear: true
					});
					break;
				case "help":
					this.isPause = true;
                    this._clearScene();
					this._game.setScene({
						scene: HelpScene,
						isClear: false
					});
					break;
				case "quit":
					this._clearScene();
					this._game.setScene({
						scene: FinalScene,
						gameStatus: "noPlay",
						isClear: false
					});
					break;
			}
		}
	}

    //ініт ball проходить після ініт board,
    // тому для першого апдейту добавлено" this._game.gameField.clientWidth / 2;"
	_updateBoard(dt, board) {
		if (!this._ball.renderPosition || this._deffBall.state() !== "resolved" ||
            this._deffBall.state() !== "resolved") {
            board.position = this._game.gameField.innerWidth() / 2;
		} else {
            board.position = this._ball.renderPosition.x;
        }

		this._calcBoardPos(board);
	}

	_updateBall(dt, ball) {
		super._updateBall(dt, ball);
		//Дозволити політ шара після початкового встановлення на дошку
		this.ballOnBoard = false;
	}

    _clearScene() {
        if (this._game.gameField.find("*").is(this._menuElem)) {
            this._menuElem.remove();
        }

        if (this._game.gameField.find("*").is( this._info.getElem() ) ) {
            this._info.getElem().remove();
        }
    }

	gameOver() {
		this._game.setScene({
			scene: StartScene,
			isClear: true
		});
	}
}