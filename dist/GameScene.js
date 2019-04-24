"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameScene = function () {
	function GameScene(game, round) {
		_classCallCheck(this, GameScene);

		this._game = game;
		this._round = round;
		this._startInfoTime = 0;
		this._endInfoTime = 10;
		this._initRound();

		this._renderCount = 0;
		this._updateCount = 0;
	}

	_createClass(GameScene, [{
		key: "_initRound",
		value: function _initRound() {
			// this._ballCoord = this._ball.getCoord();
			//ініціалізація шара
			this._game.header.setRound(this._round.getActiveRoundNum());
			this._initBoard();
			this._initBall();

			this._initBlocks(this._round.getActiveRound());

			this._initInfo();

			//ініціалізація блоків

		}
	}, {
		key: "_initInfo",
		value: function _initInfo(round) {

			this._info = new Info("");
			this._isShowInfo = true;
			this._infoText = "Round " + this._round.getActiveRoundNum();
		}
	}, {
		key: "_initBall",
		value: function _initBall() {
			this._ball = new Ball({
				game: this,
				speed: 100,
				/*position: {
    	x: -20,
    	y: -20
    },*/
				direction: {
					x: 1,
					y: -2
				}
			});
			this._ballElem = this._ball.getElem();
			this._ball.isOnBoard = true;
			//this._updateBall(0, this._ball);
			//this._ball.render();
			//this._game.gameField.appendChild(this._ballElem);
		}
	}, {
		key: "_initBoard",
		value: function _initBoard() {
			this._board = new Board({
				gameField: this._game.gameField
			});
			this._boardElem = this._board.getElem();
			this._game.gameField.appendChild(this._boardElem);
			this._board.init();
			this._boardMinPosition = this._boardElem.offsetWidth / 2;
			this._boardMaxPosition = this._game.gameField.clientWidth - this._boardElem.offsetWidth / 2;
		}
	}, {
		key: "_initBlocks",
		value: function _initBlocks(round) {
			this._blockArr = [];
			this._blockForRemove = [];
			// this._isPause = true;
			this._blockCount = 0;
			var block = void 0;
			for (var i = 0; i < round.length; i++) {
				var y = i * 20;
				for (var j = 0; j < round[i].length; j++) {
					var x = j * 50;
					if (round[i][j] === " ") {
						continue;
					}
					if (round[i][j] === "b") {
						block = new Block({
							x: x,
							y: y,
							class: "bricks"
						});
					} else if (round[i][j] === "p") {
						block = new Block({
							x: x,
							y: y,
							class: "penoblock"
						});
					}

					this._blockArr.push(block);
				}
			}
		}
	}, {
		key: "_checkKeys",
		value: function _checkKeys() {
			if (this._game.checkKeyPress(32)) {
				this._ball.isOnBoard = false;
			}

			if (this._game.checkKeyPress(13) || this._game.checkKeyPress(27)) {
				this._blockCount = 0;
				this._game.setScene({
					scene: PauseScene,
					isClear: false
				});
				this._isPause = true;
			}
		}
	}, {
		key: "update",
		value: function update(dt) {

			//console.log(this._position);


			this._updateInfo(dt);
			if (this._isShowInfo) {
				return;
			}

			this._updateBoard(dt, this._board);
			this._updateBall(dt, this._ball);

			this._checkKeys();

			//	this._ball2.update(dt);
			//this._updateCount++;

			//console.log("update" + dt);
		}
	}, {
		key: "render",
		value: function render(dt) {

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
	}, {
		key: "_renderBlock",
		value: function _renderBlock() {
			var _this = this;

			if (this._isPause) {
				this._blockArr.forEach(function (block) {
					_this._game.gameField.appendChild(block.getElem());
				});
				this._isPause = false;
				this._blockCount === this._blockArr.length;
			}

			if (this._blockCount < this._blockArr.length) {
				this._game.gameField.appendChild(this._blockArr[this._blockCount].getElem());
				this._blockCount++;
				return;
			}
			this._isBlockRender = true;
		}
	}, {
		key: "_updateBoard",
		value: function _updateBoard(dt, board) {
			if (this._game.keys["37"] && this._game.keys["39"] || !this._game.keys["37"] && !this._game.keys["39"]) {
				board.direction = 0;
				board.moveMult = 0;
				// console.log("no press");
			} else {
				board.moveMult += 0.7;
				if (this._game.keys["37"]) {
					if (board.direction > 0) {
						board.moveMult = 0;
					}
					board.direction = -1;
					// console.log("left press");
				} else if (this._game.keys["39"]) {
					if (board.direction < 0) {
						board.moveMult = 0;
					}
					board.direction = 1;
					// console.log("right press");
				}
			}
			var speed = Math.min(dt * 100 * board.moveMult, 200);
			board.speed = board.direction * speed;
			//console.log("speed: ", board.speed, "direction: ", board.direction);
			board.position += board.speed;
			this._calcBoardPos(board);
		}
	}, {
		key: "_updateInfo",
		value: function _updateInfo(dt) {
			var info = this._info;

			if (this._startInfoTime < 5 || !this._isBlockRender) {
				this._startInfoTime += dt;
				info.enableAnimation();
				info.animate(dt, 5, this._infoText);
				console.log(this._startInfoTime);
				this._isShowInfo = true;
				return;
			}

			info.disableAnimation();
			this._isShowInfo = false;
		}
	}, {
		key: "_calcBoardPos",
		value: function _calcBoardPos(board) {

			if (this._boardMaxPosition < board.position) {
				board.position = this._boardMaxPosition;
			}
			if (this._boardMinPosition > board.position) {
				board.position = this._boardMinPosition;
			}
			board.renderPosition = board.position;
			//console.log("render pos: ", board.renderPosition);
		}
	}, {
		key: "_updateBall",
		value: function _updateBall(dt, ball) {

			if (ball.isOnBoard) {
				ball.sendToBoard(this._board);
				return;
			}

			if (ball.direction.x === 0) {
				ball.direction.x = 0.01;
			}

			if (ball.direction.y === 0) {
				ball.direction.y = 0.01;
			}
			ball.speed = vectorScalar(dt * ball.speedCoef, ball.direction);
			this._excessBallSpeed(ball.speed);

			this._calcBallPosition(ball);
			//console.log(ballPos);
			//ball.setPos(ballPos);
		}
	}, {
		key: "_excessBallSpeed",
		value: function _excessBallSpeed(speed) {
			//будет в gameScene
			if (speed.x >= 30 || speed.y >= 30) {
				var error = new Error("big speed: ");
				this.stop();
				console.log(error);
				console.log(speed);
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
	}, {
		key: "_calcBallPosition",
		value: function _calcBallPosition(ball) {
			ball.touchedElem = {};
			//console.log("befor move", ball.position);
			ball.position = vectorSum(ball.speed, ball.position);
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

			var distance = 0;
			for (var key in ball.touchedElem) {
				if (+ball.touchedElem[key] > distance) {
					distance = +ball.touchedElem[key];

					ball.position = ball[key].position;
					ball.speed = ball[key].speed;
					ball.direction = ball[key].direction;
				}
			}
			//console.log(ball.position, ball.speed, ball.direction);
			if (distance !== 0) {
				ball.speedCoef += 0.2;
				//console.log(ball.speedCoef);
				this._calcBallPosition(ball);
			} else {
				//console.log("render");
				ball.renderPosition = vectorScalar(1, ball.position);
			}

			//console.log("end position2: ", ball.position);
			//this._touchBlock(this._newPosition);
			//this._position = this._newPosition;
		}
	}, {
		key: "_calcTouchedBoardPos",
		value: function _calcTouchedBoardPos(ball, board) {
			ball.board = {};
			ball.board.position = vectorScalar(1, ball.position);
			var point = this._findTouchedBoardPoint(ball, board);

			if (point === null) {
				return;
			}
			ball.board.position = ball.calcCentr(point);
			var vecCentrToVertex = vectorDiff(point, ball.board.position);
			//console.log("point: ", point, " ball.board.position: ", ball.board.position);
			var normal = {
				x: -vecCentrToVertex.y,
				y: vecCentrToVertex.x
			};
			//console.log(vectorTurn(vecCentrToVertex, {x: -1, y: 1}));
			//console.log(this.direction);
			//кут між напрямком руху і вектором з центра до вершини до вершини
			var angle = Math.acos(vectorScalarMult(ball.direction, vectorNorm(vecCentrToVertex)));

			//console.log(vectorScalarMult(normal, vecCentrToVertex));

			var sign = Math.sign(vectorScalarMult(normal, ball.direction));
			//console.log(vectorScalarMult(normal, vecCentrToVertex));

			var distance = vectorModule(vectorDiff(ball.position, ball.board.position));

			ball.touchedElem.board = distance;
			//console.log("distance: ", distance);
			ball.board.direction = vectorNorm(vectorTurnAngle(ball.direction, Math.PI - sign * 2 * angle));
			//console.log(vectorModule(this.direction));
			//console.log("angle: " + angle);
			//this._game.stop();

			ball.board.speed = vectorScalar(distance, ball.board.direction);
		}
	}, {
		key: "_findBoardTouchedPoints",
		value: function _findBoardTouchedPoints(ball, board) {
			var _this2 = this;

			this._boardPointTouchedArr = [];
			var pointArr = board.getPointArr();
			pointArr.forEach(function (point) {
				//округления для нейтрализации ошибки вычисления
				var distance = Math.round(vectorModule(vectorDiff(ball.board.position, point)) * 100) / 100;
				if (distance <= ball.radius) {
					_this2._boardPointTouchedArr.push(point);
				}
			});
			return this._boardPointTouchedArr;
		}
	}, {
		key: "_findTouchedBoardPoint",
		value: function _findTouchedBoardPoint(ball, board) {

			var numPoints = this._findBoardTouchedPoints(ball, board).length;
			//console.log("numPoints: ", numPoints);
			var resPoint = void 0;
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
				return ball.direction.x > 0 ? this._boardPointTouchedArr[0] : this._boardPointTouchedArr[1];
			}

			if (numPoints === 3) {
				//console.log("pointNum === 3: ");
				return this._boardPointTouchedArr[1];
			}
			if (ball.direction.x > 0) {
				//resPoint = this._boardPointTouchedArr[0];
				resPoint = this._boardPointTouchedArr[Math.floor(numPoints / 2) - 1];
			} else {
				resPoint = this._boardPointTouchedArr[Math.floor(numPoints / 2) + numPoints % 2];
			}
			ball.board.position = ball.calcCentr(resPoint);
			var module = vectorModule(vectorDiff(ball.board.position, resPoint));
			//console.log("before recurse: ", numPoints, "module: ", module, "ball.board.position: ", ball.board.position, resPoint);
			return this._findTouchedBoardPoint(ball, board);
		}
	}, {
		key: "_isTouchedBorder",
		value: function _isTouchedBorder(position, ball) {
			var rightBorder = this._game.gameField.clientWidth - ball.radius;
			var bottomBorder = this._game.gameField.clientHeight - ball.radius;
			var topBorder = ball.radius;
			var leftBorder = ball.radius;

			if (position.x - leftBorder < 0 || position.y - topBorder < 0 || position.x - rightBorder > 0 || position.y - bottomBorder > 0) {
				return true;
			} else {
				return false;
			}
		}
	}, {
		key: "_calcTouchedBorderPos",
		value: function _calcTouchedBorderPos(position, ball) {
			var rightBorder = this._game.gameField.clientWidth - ball.radius;
			var bottomBorder = this._game.gameField.clientHeight - ball.radius;
			var topBorder = ball.radius;
			var leftBorder = ball.radius;

			var distance = 0;
			ball.border = {};

			//console.log("pos start touch: ", newPos);
			var obj = {};

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
				this.gameOver(true);
				//console.log("bottom dist", distance);
			}

			for (var key in obj) {
				if (obj[key] > distance) {
					distance = obj[key];
					if (key === "left" || key === "right") {
						ball.newDirection = {
							x: -1 * ball.direction.x,
							y: ball.direction.y
						};
						console.log("left, right");
					} else {
						ball.newDirection = {
							x: ball.direction.x,
							y: -1 * ball.direction.y
						};
						console.log("top, bottom");
					}
				}
			}

			ball.touchedElem.border = distance;
			var over = vectorScalar(distance, ball.direction);
			ball.border.speed = vectorScalar(distance, ball.newDirection);
			ball.border.direction = {
				x: ball.newDirection.x,
				y: ball.newDirection.y
			};

			ball.border.position = vectorDiff(position, over);
			//console.log("borderTouch: ", position, ball.border.position);
		}
	}, {
		key: "_calcTouchedBlockPos",
		value: function _calcTouchedBlockPos(ball) {
			ball.block = {};
			this._calcCentrOver(ball);
			//  console.log("coord before: ", coord, this._centrOver);
			ball.position = vectorDiff(ball.position, vectorScalar(ball.centrOver, ball.direction));
			// console.log("coord: ", coord);
			ball.touchSide = false;

			//console.log(blockArr);
			//console.log(blockArr, this._touchedBlockArr);
			var normalH = ball.getNormal({
				x: Math.sign(ball.direction.x),
				y: 0
			});

			var normalV = ball.getNormal({
				x: 0,
				y: Math.sign(ball.direction.y)
			});
			//якщо є дотик до сторони, то не перевіряти далі
			this._calcSideBlockRebound(normalH, normalV, ball);
			if (ball.touchSide) {
				//	console.log("touchBlockSide");
				return;
			}

			var vertex = this._findNearVertex(this._touchedBlockArr[0], ball);
			if (vertex === null) {
				//console.log("vertex null");
				return;
			}
			this._calcVertexRebound(this._touchedBlockArr[0], ball, vertex);
		}
	}, {
		key: "_calcVertexRebound",
		value: function _calcVertexRebound(block, ball, vertex) {
			//якщо нема вершини ближче радіуса то не перевіряти далі
			//console.log(vertex);
			ball.block.position = ball.calcCentr(vertex);
			var vecCentrToVertex = vectorDiff(vertex, ball.block.position);

			var normal = {
				x: -vecCentrToVertex.y,
				y: vecCentrToVertex.x
			};
			//console.log(vectorTurn(vecCentrToVertex, {x: -1, y: 1}));
			//console.log(this.direction);
			//кут між напрямком руху і вектором з центра до вершини до вершини
			var angle = Math.acos(vectorScalarMult(ball.direction, vectorNorm(vecCentrToVertex)));

			//console.log(vectorScalarMult(normal, vecCentrToVertex));

			var sign = Math.sign(vectorScalarMult(normal, ball.direction));
			//console.log(vectorScalarMult(normal, vecCentrToVertex));

			var distance = vectorModule(vectorDiff(ball.position, vertex)) + ball.centrOver;

			this._touchingBlock(block);

			ball.touchedElem.block = distance;
			ball.block.direction = vectorNorm(vectorTurnAngle(ball.direction, Math.PI - sign * 2 * angle));
			//console.log(vectorModule(this.direction));
			//console.log("angle: " + angle);
			//this._game.stop();

			ball.block.speed = vectorScalar(distance, ball.block.direction);

			//console.log("touch vertex", ball.position, ball.block.position, block);
		}
	}, {
		key: "_findNearVertex",
		value: function _findNearVertex(block, ball) {
			for (var i = 0; i < block.getVertexs().length; i++) {
				var d = vectorModule(vectorDiff(block.getVertexs()[i], ball.position));
				//console.log("d: " + d, coord, this.position);

				if (d < ball.radius) {
					return block.getVertexs()[i];
				}
			}
			return null;
		}
	}, {
		key: "_calcSideBlockRebound",
		value: function _calcSideBlockRebound(normalH, normalV, ball) {
			var distH = 0,
			    distV = 0,
			    dist = 0;

			var blockH = void 0,
			    blockV = void 0,
			    block = void 0;

			for (var i = 0; i < this._touchedBlockArr.length; i++) {
				if (this._touchedBlockArr[i].isContainCoord(normalH)) {
					distH = (ball.radius - Math.min(Math.abs(ball.position.x - this._touchedBlockArr[i].right()), Math.abs(ball.position.x - this._touchedBlockArr[i].left()))) / Math.abs(ball.direction.x);
					blockH = this._touchedBlockArr[i];
				}

				if (this._touchedBlockArr[i].isContainCoord(normalV)) {
					distV = (ball.radius - Math.min(Math.abs(ball.position.y - this._touchedBlockArr[i].bottom()), Math.abs(ball.position.y - this._touchedBlockArr[i].top()))) / Math.abs(ball.direction.y);
					blockV = this._touchedBlockArr[i];
				}
			}

			if (distH + distV === 0) {
				return;
			}

			if (distH > distV) {
				dist = distH;
				block = blockH;
				ball.newDirection = {
					x: -Math.sign(normalH.x) * ball.direction.x,
					y: ball.direction.y
				};
				//console.log("horizont");
			} else {
				dist = distV;
				block = blockV;
				ball.newDirection = {
					x: ball.direction.x,
					y: -Math.sign(normalV.y) * ball.direction.y
				};
				//console.log("vertical");
			}
			//console.log("distV: ", distV, "distH: ", distH);
			ball.touchSide = true;

			this._touchingBlock(block);

			ball.touchedElem.block = dist + ball.centrOver;
			var over = vectorScalar(dist + ball.centrOver, ball.direction);
			ball.block.speed = vectorScalar(dist + ball.centrOver, ball.newDirection);
			ball.block.direction = {
				x: ball.newDirection.x,
				y: ball.newDirection.y
			};

			ball.block.position = vectorDiff(ball.position, over);
			//console.log("blockSideTouch: ", ball.touchedElem.block, ball.centrOver, ball.position, ball.speed, ball.direction, ball.block);
		}
	}, {
		key: "_calcCentrOver",
		value: function _calcCentrOver(ball) {
			//console.log("calcCentr");
			for (var i = 0; i < this._touchedBlockArr.length; i++) {
				if (this._touchedBlockArr[i].isContainCoord(ball.position)) {
					ball.centrOver = ball.radius;
					// console.log("centrOver: ", this._centrOver, blockArr[i]);
					return;
				}
			}
			ball.centrOver = 0;
		}
	}, {
		key: "_isTouchBlocksVsBall",
		value: function _isTouchBlocksVsBall(ball) {
			var _this3 = this;

			this._touchedBlockArr = [];
			this._blockArr.forEach(function (block) {
				if (_this3._isTouchBlockVsBall(block, ball)) {
					_this3._touchedBlockArr.push(block);
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
	}, {
		key: "_isTouchBlockVsBall",
		value: function _isTouchBlockVsBall(block, ball) {
			//console.log(block.right(), block.left(), block.top(), block.bottom());
			var xColl = false;
			var yColl = false;
			//console.log(block_x + " " + block.offsetWidth + " " + ball._ball.newPosition.x);
			//console.log(block_x + block.offsetWidth >= ball._ball.newPosition.x)
			//console.log(block);
			if (block.right() > ball.position.x - ball.radius && block.left() < ball.position.x + ball.radius) {
				//console.log("collX");
				xColl = true;
			}

			if (block.bottom() > ball.position.y - ball.radius && block.top() < ball.position.y + ball.radius) {
				//console.log("collY");
				yColl = true;
			}

			return xColl && yColl;
		}
	}, {
		key: "_touchingBlock",
		value: function _touchingBlock(block) {
			block.touching();
			this._game.score += block.getScore();
			this._blockForRemove.push(block);
		}
	}, {
		key: "_removeBlock",
		value: function _removeBlock() {
			var _this4 = this;

			/*let listBlock = this._game.gameField.querySelectorAll(".remove");
   for (let i = 0; i < listBlock.length; i++) {
   	this._game.gameField.removeChild(listBlock[i].getElem());
   }*/

			this._blockForRemove.forEach(function (block) {
				//	console.log("remove: ", block);
				if (block.remove) {
					var pos = _this4._blockArr.indexOf(block);
					/*if (pos === -1) {
         this._game.stop();
     }*/
					if (pos >= 0) {
						_this4._blockArr.splice(pos, 1);
						_this4._game.gameField.removeChild(block.getElem());
					}
				}
			});

			this._blockForRemove = [];
			if (this._blockArr.length === 0) {
				this.gameOver(false);
			}
		}
	}, {
		key: "getBlockArr",
		value: function getBlockArr() {
			return this._blockArr;
		}
	}, {
		key: "_showInfo",
		value: function _showInfo(text) {
			this._info.setText(text);
			console.log("loss");
			this._endInfoTime = 0;
		}
	}, {
		key: "gameOver",
		value: function gameOver(isLoss) {

			this._game.setScene({
				scene: GameOverScene,
				round: this._game.round,
				isClear: false,
				isLoss: isLoss
			});
		}
	}, {
		key: "stop",
		value: function stop() {
			//this._ballElem.remove();
			this._game.stop();
			console.log(this._renderCount);
			console.log(this._updateCount);
		}
	}]);

	return GameScene;
}();