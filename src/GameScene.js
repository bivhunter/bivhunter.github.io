/*jshint esversion: 6 */
"use strict";
class GameScene {
	constructor(game) {
		this._game = game;
		this._round = game.round;

		this._SPEED_COEF = 150 + (+this._round.getActiveRoundNum() * 5);
        this._BOARD_MOVE_MULT = 0.08;

		this._acceleration = 0.2;
		this._infoTime = 0;
		this._endInfoTime = 10;
        this.ballOnBoard = true;
		this._initRound();

		this._renderCount = 0;
		this._updateCount = 0;
	}

	_initRound() {
		// this._ballCoord = this._ball.getCoord();
		//ініціалізація шара
		this._game.header.setRound(this._round.getActiveRoundNum());
		this._initBoard();
		this._initBall();

		this._initBlocks(this._round.getActiveRound());

		this._initInfo();



		//ініціалізація блоків


	}

	_initInfo(round) {

		this._info = new Info("");
		this._isShowInfo = true;
		this._infoText = "Round " + this._round.getActiveRoundNum();
	}



	_initBall() {
		this._ball = new Ball({
			game: this,
			speed: this._SPEED_COEF,
			direction: {
				x: 1,
				y: -10
			}
		});
		this._ballElem = this._ball.getElem();
		//this._updateBall(0, this._ball);
		//this._ball.render();
		//this._game.gameField.appendChild(this._ballElem);

	}

	_initBoard() {
		this._board = new Board({
			gameField: this._game.gameField
		});
		this._board.speedCoef = this._SPEED_COEF;
		this._boardElem = this._board.getElem();
		this._game.gameField.appendChild(this._boardElem);
		this._board.init();
        //console.log("board init", this._board.renderPosition);
		this._boardMinPosition = this._boardElem.offsetWidth / 2;
		this._boardMaxPosition = this._game.gameField.clientWidth - this._boardElem.offsetWidth / 2;
		//console.log("this._boars masx min", this._boardMaxPosition, this._boardMinPosition);
	}

	_initBlocks(round) {
		this._blockArr = [];
		this._blockForRemove = [];
		// this.isPause = true;
		//
		this._blockNumber = 0;
		let block;
		for (let i = 0; i < round.length; i++) {
			let y = i * 20;
			for (let j = 0; j < round[i].length; j++) {
				let x = j * 50;
				if (round[i][j] === " ") {
					continue;
				}
				if (round[i][j] === "w") {
					block = new Block({
						x: x,
						y: y,
						blockClass: "block-weak"
					});
				} else if (round[i][j] === "s") {
					block = new Block({
						x: x,
						y: y,
						blockClass: "block-strong"
					});
				}

				this._blockArr.push(block);
			}
		}
	}

	_checkKeys() {
		if (this._game.checkKeyPress(32)) {
			this.ballOnBoard = false;
		}

		if (this._game.checkKeyPress(13) || this._game.checkKeyPress(27)) {
			this._blockNumber = 0;
			this._game.setScene({
				scene: PauseScene,
				isClear: false
			});
			this.isPause = true;
		}

		this._checkKeysBoard(this._board);
	}

	_checkKeysBoard(board) {
		if (((this._game.keys["37"] || this._game.keys["A".charCodeAt(0) + ""]) &&
				(this._game.keys["39"] || this._game.keys["D".charCodeAt(0) + ""])) ||
			(!this._game.keys["37"] && !this._game.keys["39"] &&
				!this._game.keys["A".charCodeAt(0) + ""] &&
				!this._game.keys["D".charCodeAt(0) + ""])) {
			board.direction = 0;
			board.moveMult = 0;
			// console.log("no press");
		} else {
			board.moveMult += this._BOARD_MOVE_MULT;
			if (this._game.keys["37"] || this._game.keys["A".charCodeAt(0) + ""]) {
				if (board.direction > 0) {
					board.moveMult = 0;
				}
				board.direction = -1;
				// console.log("left press");
			} else if (this._game.keys["39"] || this._game.keys["D".charCodeAt(0) + ""]) {
				if (board.direction < 0) {
					board.moveMult = 0;
				}
				board.direction = 1;
				// console.log("right press");
			}
		}
	}

	update(dt) {

		//console.log(this._position);


		this._updateInfo(dt);
		if (this._isShowInfo) {
			return;
		}



		this._updateBoard(dt, this._board);
        //this._boardTest = false;
		this._updateBall(dt, this._ball);

        this._checkKeys();

		//	this._ball2.update(dt);
		//this._updateCount++;

		//console.log("update" + dt);
	}

	render(dt) {

		this._board.render(dt);

		if (!this._game.gameField.contains(this._boardElem)) {
			this._game.gameField.appendChild(this._boardElem);
		}

		this._renderBlock();

		if (this._isShowInfo) {
			if (!this._game.gameField.contains(this._info.getElem())) {
				this._game.gameField.appendChild(this._info.getElem());
			}
			return;
		} else {
			if (this._game.gameField.contains(this._info.getElem())) {
				this._game.gameField.removeChild(this._info.getElem());
			}

		}

		this._ball.render(dt);

		if (!this._game.gameField.contains(this._ballElem)) {
			this._game.gameField.appendChild(this._ballElem);
		}

		//запускається останнім, щоб після запуску нової сцени
		//не вимальовувалися старі елементи
		this._removeBlock();
	}

	_renderBlock() {
		if (this.isPause) {
			this._blockArr.forEach(block => {
				this._game.gameField.appendChild(block.getElem());
			});
			this.isPause = false;
			this._blockNumber === this._blockArr.length;
		}

		if (this._blockNumber < this._blockArr.length) {
			this._game.gameField.appendChild(this._blockArr[this._blockNumber].getElem());
			this._blockNumber++;
			return;
		}
		this._isBlockRender = true;
	}

	_updateBoard(dt, board) {

		let speed = Math.min(dt * board.speedCoef * board.moveMult, 150);
		board.speed = board.direction * speed;
		console.log("speed: ", board.speed, "direction: ", board.direction);
		board.position += board.speed;
		this._calcBoardPos(board);

	}

	_updateInfo(dt) {
		let info = this._info;
		if ( !this._infoTime ) {
            info.enableAnimation();
            this._infoTime += dt;
            return;
		}

		if (this._infoTime < 5 || !this._isBlockRender) {
			this._infoTime += dt;

			info.animate(dt, 4, this._infoText);
			//console.log(this._infoTime);

		//	this._isShowInfo = true;

			// Щоб після визову returnScene з HelpScene під час інфо, шар був на дошці.

			return;
		}

		info.disableAnimation();

		this._isShowInfo = false;
        this._infoTime = 0;
	}


	_calcBoardPos(board) {

		if (this._boardMaxPosition < board.position) {
			board.position = this._boardMaxPosition;
		}
		if (this._boardMinPosition > board.position) {
			board.position = this._boardMinPosition;
		}
		board.renderPosition = board.position;
//		console.log("render pos: ", board.renderPosition, board.position);
	}

	_updateBall(dt, ball) {



		if (this.ballOnBoard) {
			ball.sendToBoard(this._board);
			return;
		}

		if (ball.direction.x === 0) {
			ball.direction.x = 0.01;
		}

		if (ball.direction.y === 0) {
			ball.direction.y = 0.01;
		}

		console.log(ball.direction);
        ball.speed = Vector.vectorFromObj(ball.direction.scalar(dt * ball.speedCoef));
		this._excessBallSpeed(ball.speed);

		this._calcBallPosition(dt, ball);
		//console.log(ballPos);
		//ball.setPos(ballPos);
	}

	_excessBallSpeed(speed) { //будет в gameScene
		if (speed.x >= 30 || speed.y >= 30) {
			let error = new Error("big speed: ");
            this.stop();
			console.log(error);
			console.log(speed, this._ball.direction);
		}


		/*if (this._count > 1) {
			let error = new Error("doubleTouch vertex");
			this._game.stop();
			console.log(error);

		}*/

		/*if (this._sideT > 1 || this._sideL > 1 || this._sideR > 1 || this._sideB > 1) {
			let error = new Error("doubleTouch border");
			this._game.stop();
			console.log(error);

		}*/
		/*
				this._count = 0;
				this._sideT = 0;
				this._sideB = 0;
				this._sideR = 0;
				this._sideL = 0;*/
		//console.log(this._speed);

	}

	_calcBallPosition(dt, ball) {
		ball.touchedElem = {};
		//console.log("befor move", ball.position);
		ball.position = ball.position.sum(ball.speed);
		//console.log("after move", ball.position);
		if (this._isTouchedBorder(ball.position, ball)) {
			this._calcTouchedBorderPos(ball.position, ball);
		}

		if (this._isTouchBlocksVsBall(ball)) {
			//console.log("touch block", ball.position);
			this._calcTouchedBlockPos(ball);
			this._touchedBlockArr = [];
		}

		if (ball.direction.y > 0) {
			if (this._isTouchBlockVsBall(this._board, ball)) {
				//  console.log("touch board border", ball.touchedElem.board, ball.board);
				this._calcTouchedBoardPos(ball, this._board);

			}
		}

		let distance = 0;
		for (let key in ball.touchedElem) {
			if (+ball.touchedElem[key] > distance) {
				distance = +ball.touchedElem[key];

				ball.position = ball[key].position;
				ball.speed = ball[key].speed;
				ball.direction = ball[key].direction;

			}
		}
		//console.log(ball.position, ball.speed, ball.direction);
		if (distance !== 0) {
			ball.speedCoef += this._acceleration;
			this._board.speedCoef = ball.speedCoef;
			//console.log(ball.speedCoef);
			// Предотвращает потерю динамики игры при маленьком угле движения
			//относительно горизонтали
			this._corectionDirection(dt, ball);
			this._calcBallPosition(dt, ball);
		} else {
			//console.log("render");
            ball.renderPosition.setValue(ball.position);
		}

		//console.log("end position2: ", ball.position);
		//this._touchBlock(this._newPosition);
		//this._position = this._newPosition;
	}

	_corectionDirection(dt, ball) {
		if (Math.abs(ball.direction.x / ball.direction.y) > 10) {
			ball.direction.x = 10 * ball.direction.y;
			ball.direction = ball.direction.norm();
            ball.speed.setValue(ball.direction.scalar(dt * ball.speedCoef));
			//console.log("corection");
		}
		//console.log(ball.direction.x / ball.direction.y);
	}

	_calcTouchedBoardPos(ball, board) {
		ball.board = {};
		ball.board.position = Vector.vectorFromObj(ball.position);
		let point = this._findTouchedBoardPoint(ball, board);

		if (point === null) {
			return;
		}

		/*if(this._boardTest) {
			alert("bag ball vs board rebound");
		}
		this._boardTest = true;*/
		ball.board.position = ball.calcCentr(point);
		let vecCentrToVertex = point.diff(ball.board.position);

		let normal = new Vector ( -vecCentrToVertex.y, vecCentrToVertex.x );

		//кут між напрямком руху і вектором з центра до вершини до вершини
		let angle = Math.acos( Vector.scalarMult(ball.direction, vecCentrToVertex.norm() ) );

		//console.log(Vector.scalarMult(normal, vecCentrToVertex));

		let sign = Math.sign(Vector.scalarMult(normal, ball.direction));
		//console.log(Vector.scalarMult(normal, vecCentrToVertex));

		let distance = ball.position.diff(ball.board.position).module();

		ball.touchedElem.board = distance;
		//console.log("distance: ", distance);
		ball.board.direction = ball.direction.turnAngle(Math.PI - sign * 2 * angle).norm();
		//console.log(vectorModule(this.direction));
		//console.log("angle: " + angle);
		//this._game.stop();

		ball.board.speed = ball.board.direction.scalar(distance);


	}

	_findBoardTouchedPoints(ball, board) {
		this._boardPointTouchedArr = [];
		let pointArr = board.getPointArr();
		pointArr.forEach(point => {
			//округления для нейтрализации ошибки вычисления
			let distance = Math.round(ball.board.position.diff(point).module() * 100) / 100;
			if (distance <= ball.radius) {
				this._boardPointTouchedArr.push(point);
			}
		});
		return this._boardPointTouchedArr;
	}

	_findTouchedBoardPoint(ball, board) {

		let numPoints = this._findBoardTouchedPoints(ball, board).length;
		//console.log("numPoints: ", numPoints);
		let resPoint;
		if (numPoints === 0) {
			//console.log("point === null");
			return null;
		}

		if (numPoints === 1) {
			//console.log("pointNum === 1: ", this._boardPointTouchedArr[0]);
			return this._boardPointTouchedArr[0];
		}

		if (numPoints === 2) {
			//console.log("pointNum === 2: ");
			return (ball.direction.x > 0) ? this._boardPointTouchedArr[0] : this._boardPointTouchedArr[1];
		}

		/*if (numPoints === 3) {
			console.log("pointNum === 3: ");
			return this._boardPointTouchedArr[1];
		}*/

		//первый вариант, большая погрешность, меньше ресурсов
		/*if (ball.direction.x < 0) {
			//resPoint = this._boardPointTouchedArr[0];
			resPoint = this._boardPointTouchedArr[Math.floor(numPoints / 2) - 1];
		} else {
			resPoint = this._boardPointTouchedArr[Math.floor(numPoints / 2) + numPoints % 2];
		}*/

        if (ball.direction.x > 0) {
            //resPoint = this._boardPointTouchedArr[0];
            resPoint = this._boardPointTouchedArr[numPoints - 2];
        } else {
            resPoint = this._boardPointTouchedArr[1];
        }

		ball.board.position = ball.calcCentr(resPoint);
		return this._findTouchedBoardPoint(ball, board);
	}

	_isTouchedBorder(position, ball) {
		let rightBorder = this._game.gameField.clientWidth - ball.radius;
		let bottomBorder = this._game.gameField.clientHeight - ball.radius;
		let topBorder = ball.radius;
		let leftBorder = ball.radius;

		if (position.x - leftBorder < 0 || position.y - topBorder < 0 ||
			position.x - rightBorder > 0 || position.y - bottomBorder > 0) {
			return true;
		} else {
			return false;
		}
	}

	_calcTouchedBorderPos(position, ball) {
		let rightBorder = this._game.gameField.clientWidth - ball.radius;
		let bottomBorder = this._game.gameField.clientHeight - ball.radius - 5;
		let topBorder = ball.radius;
		let leftBorder = ball.radius;

		let distance = 0;
		ball.border = {};

		//console.log("pos start touch: ", newPos);
		let obj = {};

		if (position.x - leftBorder < 0) {
			obj.left = (position.x - leftBorder) / ball.direction.x;
		}

		if (position.y - topBorder < 0) {
			obj.top = (position.y - topBorder) / ball.direction.y;
			//console.log("top dist", distance);
		}

		if (position.x > rightBorder) {
			obj.right = (position.x - rightBorder) / ball.direction.x;
			//console.log("right dist", distance);
		}

		if (position.y > bottomBorder) {
			this.gameOver("loss");
			//console.log("bottom dist", distance);
		}

		for (let key in obj) {
			if (obj[key] > distance) {
				distance = obj[key];
				if (key === "left" || key === "right") {
					ball.newDirection = new Vector( -1 * ball.direction.x, ball.direction.y );
				} else {
					ball.newDirection = new Vector ( ball.direction.x, -1 * ball.direction.y);
				}
			}
		}

		ball.touchedElem.border = distance;
		let over = ball.direction.scalar(distance);
		ball.border.speed = ball.newDirection.scalar(distance);
		ball.border.direction = Vector.vectorFromObj( ball.newDirection );
	
		ball.border.position = position.diff(over);
		//console.log("borderTouch: ", position, ball.border.position);
	}

	_calcTouchedBlockPos(ball) {
		ball.block = {};
		this._calcCentrOver(ball);
		//  console.log("coord before: ", coord, this._centrOver);
		ball.position = ball.position.diff(ball.direction.scalar(ball.centrOver));
		// console.log("coord: ", coord);
		ball.touchSide = false;

		//console.log(blockArr);
		//console.log(blockArr, this._touchedBlockArr);

		let normalH = ball.getNormal( new Vector(Math.sign(ball.direction.x), 0));

		let normalV = ball.getNormal( new Vector(0, Math.sign(ball.direction.y)));

		//якщо є дотик до сторони, то не перевіряти далі
		this._calcSideBlockRebound(normalH, normalV, ball);
		if (ball.touchSide) {
			//	console.log("touchBlockSide");
			return;
		}

		let vertex = this._findNearVertex(this._touchedBlockArr[0], ball);
		if (vertex === null) {
			//console.log("vertex null");
			return;
		}
		this._calcVertexRebound(this._touchedBlockArr[0], ball, vertex);
	}

	_calcVertexRebound(block, ball, vertex) {
		//якщо нема вершини ближче радіуса то не перевіряти далі
		//console.log(vertex);
		ball.block.position = ball.calcCentr(vertex);
		let vecCentrToVertex = vertex.diff(ball.block.position);

		let normal = new Vector( -vecCentrToVertex.y, vecCentrToVertex.x);
		
		//кут між напрямком руху і вектором з центра до вершини
		let angle = Math.acos(Vector.scalarMult(ball.direction, vecCentrToVertex.norm()));

		//console.log(Vector.scalarMult(normal, vecCentrToVertex));

		let sign = Math.sign(Vector.scalarMult(normal, ball.direction));
		//console.log(Vector.scalarMult(normal, vecCentrToVertex));

		let distance = ball.position.diff(vertex).module() + ball.centrOver;

		this._touchingBlock(block);


		ball.touchedElem.block = distance;
		ball.block.direction = ball.direction.turnAngle(Math.PI - sign * 2 * angle).norm();
		//console.log(vectorModule(this.direction));
		//console.log("angle: " + angle);
		//this._game.stop();

		ball.block.speed = ball.block.direction.scalar(distance);

		//console.log("touch vertex", ball.position, ball.block.position, block);
	}

	_findNearVertex(block, ball) {
		for (let i = 0; i < block.getVertexes().length; i++) {
			let d = block.getVertexes()[i].diff(ball.position).module();

			if (d < ball.radius) {
				return block.getVertexes()[i];
			}
		}
		return null;
	}

	_calcSideBlockRebound(normalH, normalV, ball) {
		let distH = 0,
			distV = 0,
			dist = 0;

		let blockH,
			blockV,
			block;

		for (let i = 0; i < this._touchedBlockArr.length; i++) {
			if (this._touchedBlockArr[i].isContainCoord(normalH)) {
				distH = (ball.radius - Math.min(Math.abs(ball.position.x - this._touchedBlockArr[i].right()),
					Math.abs(ball.position.x - this._touchedBlockArr[i].left()))) / Math.abs(ball.direction.x);
				blockH = this._touchedBlockArr[i];
			}

			if (this._touchedBlockArr[i].isContainCoord(normalV)) {
				distV = (ball.radius - Math.min(Math.abs(ball.position.y - this._touchedBlockArr[i].bottom()),
					Math.abs(ball.position.y - this._touchedBlockArr[i].top()))) / Math.abs(ball.direction.y);
				blockV = this._touchedBlockArr[i];
			}
		}

		if (distH + distV === 0) {
			return;
		}

		if (distH > distV) {
			dist = distH;
			block = blockH;
			ball.newDirection = new Vector( -Math.sign(normalH.x) * ball.direction.x,
				ball.direction.y);
		} else {
			dist = distV;
			block = blockV;
			ball.newDirection = new Vector( ball.direction.x,
				-Math.sign(normalV.y) * ball.direction.y);
		}

		ball.touchSide = true;
		this._touchingBlock(block);
		ball.touchedElem.block = dist + ball.centrOver;

		let over = ball.direction.scalar( dist + ball.centrOver );
		ball.block.speed = ball.newDirection.scalar( dist + ball.centrOver );
		ball.block.direction = Vector.vectorFromObj( ball.newDirection );
		ball.block.position = ball.position.diff( over );
	}


	_calcCentrOver(ball) {
		//console.log("calcCentr");
		for (let i = 0; i < this._touchedBlockArr.length; i++) {
			if (this._touchedBlockArr[i].isContainCoord(ball.position)) {
				ball.centrOver = ball.radius;
				// console.log("centrOver: ", this._centrOver, blockArr[i]);
				return;
			}
		}
		ball.centrOver = 0;
	}

	_isTouchBlocksVsBall(ball) {
		this._touchedBlockArr = [];
		this._blockArr.forEach((block) => {
			if (this._isTouchBlockVsBall(block, ball)) {
				this._touchedBlockArr.push(block);
			}
		});

		return !(this._touchedBlockArr.length === 0);
		/*if (this._touchedBlockArr.length === 4) {
		    console.log("posi: ", this._newPosition, this.speed, coord);
		    this._game.stop();
		}*/
		//console.log("touch blockArr", this._touchedBlockArr.length, this._touchedBlockArr);
		//console.log("touchBlock");

	}



	_isTouchBlockVsBall(block, ball) {
		//console.log(block.right(), block.left(), block.top(), block.bottom());
		let xColl = false;
		let yColl = false;
		//console.log(block_x + " " + block.offsetWidth + " " + ball._ball.newPosition.x);
		//console.log(block_x + block.offsetWidth >= ball._ball.newPosition.x)
		//console.log(block);
		if ((block.right() > ball.position.x - ball.radius) &&
			(block.left() < ball.position.x + ball.radius)) {
			//console.log("collX");
			xColl = true;
		}

		if ((block.bottom() > ball.position.y - ball.radius) &&
			(block.top() < ball.position.y + ball.radius)) {
			//console.log("collY");
			yColl = true;
		}

		return (xColl && yColl);
	}

	_touchingBlock(block) {
		block.touching();
		this._game.score += block.getScore();
		this._blockForRemove.push(block);
	}


	_removeBlock() {

		/*let listBlock = this._game.gameField.querySelectorAll(".remove");
		for (let i = 0; i < listBlock.length; i++) {
			this._game.gameField.removeChild(listBlock[i].getElem());
		}*/

		this._blockForRemove.forEach((block) => {
			//	console.log("remove: ", block);
			if (block.isRemove()) {
				let pos = this._blockArr.indexOf(block);
				/*if (pos === -1) {
				    this._game.stop();
				}*/
				if (pos >= 0) {
					this._blockArr.splice(pos, 1);
					this._game.gameField.removeChild(block.getElem());
				}
			}
		});

		this._blockForRemove = [];
		if (this._blockArr.length === 0) {
			this.gameOver("victory");
		}

	}

	getBlockArr() {
		return this._blockArr;
	}

	_showInfo(text) {
		this._info.setText(text);
		console.log("loss");
		this._endInfoTime = 0;
	}

	gameOver(gameStatus) {
		this.isPause = true;
		this._game.setScene({
			scene: GameOverScene,
			isClear: false,
			gameStatus: gameStatus
		});



	}

	stop() {
		//this._ballElem.remove();
		this._game.stop();
		console.log(this._renderCount);
		console.log(this._updateCount);
	}



}