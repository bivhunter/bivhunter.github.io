"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GameScene = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require("/lib/jquery-3.4.1");

var _jquery2 = _interopRequireDefault(_jquery);

var _board = require("./board");

var _ball = require("./ball");

var _block = require("./block");

var _components = require("./components");

var _PauseScene = require("./PauseScene");

var _GameOverScene = require("./GameOverScene");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Основна сцена гри, в якій відбуваються всі події
var GameScene = exports.GameScene = function () {
    function GameScene(game) {
        _classCallCheck(this, GameScene);

        this._game = game;
        this._round = game.round;

        //впливає на швидкість гри, більший левел більша швидкість
        this._SPEED_COEF = 150 + +this._round.getActiveRoundNum() * 5;
        //впливає на прискорення дошки
        this._BOARD_MOVE_MULT = 0.08;
        //впливає на зростання швидкості при відбиванні
        this._acceleration = 0.2;
        this._infoTime = 0;
        this.ballOnBoard = true;
        this._deffBall = _jquery2.default.Deferred();
        this._deffBoard = _jquery2.default.Deferred();
        //this._isLoadBall = false;
        //this._isLoadBoard = false;
        this._initRound();
    }

    _createClass(GameScene, [{
        key: "_initRound",
        value: function _initRound() {
            this._game.header.setRound(this._round.getActiveRoundNum());
            this._initBoard();
            this._initBall();
            this._initBlocks(this._round.getActiveRound());
            this._initInfo();
        }
    }, {
        key: "_initBoard",
        value: function _initBoard() {
            var _this = this;

            this._board = new _board.Board({
                gameField: this._game.gameField
            });
            this._board.speedCoef = this._SPEED_COEF;
            this._boardElem = this._board.getElem();

            this._deffBoard.done(function () {
                _this._board.init();
                _this._boardMinPosition = _this._boardElem.outerWidth() / 2;
                _this._boardMaxPosition = _this._game.gameField.innerWidth() - _this._boardElem.outerWidth() / 2;
            });
            //this._game.gameField.append( this._boardElem );

            // window.console.log("board min max", this._boardMinPosition,  this._boardMaxPosition);
        }
    }, {
        key: "_initBall",
        value: function _initBall() {
            var _this2 = this;

            this._ball = new _ball.Ball({
                game: this,
                speed: this._SPEED_COEF,
                direction: {
                    x: 1,
                    y: -10
                }
            });

            this._ballElem = this._ball.getElem();

            this._deffBall.done(function () {
                _this2._ball.setRadius(_this2._ballElem.outerWidth() / 2);
                //this._isLoadBall = true;
                _this2._ball.sendToBoard(_this2._board);
            });

            //this.ballOnBoard = false;
        }
    }, {
        key: "_initBlocks",
        value: function _initBlocks(round) {
            this._blockArr = [];
            this._blockForRemove = [];
            //використовується для поступового заповнення блоками ігрового простору
            this._blockNumber = 0;

            var block = void 0;
            for (var i = 0; i < round.length; i++) {
                var y = i * 20;
                for (var j = 0; j < round[i].length; j++) {
                    var x = j * 50;
                    if (round[i][j] === " ") {
                        continue;
                    }

                    if (round[i][j] === "w") {
                        block = new _block.Block({
                            x: x,
                            y: y,
                            blockClass: "block-weak"
                        });
                    }

                    if (round[i][j] === "s") {
                        block = new _block.Block({
                            x: x,
                            y: y,
                            blockClass: "block-strong"
                        });
                    }

                    this._blockArr.push(block);
                }
            }
        }
    }, {
        key: "_initInfo",
        value: function _initInfo(round) {
            this._info = new _components.Info("");
            this._isShowInfo = true;
            this._infoText = "Round " + this._round.getActiveRoundNum();
        }
    }, {
        key: "update",
        value: function update(dt) {
            //window.console.log("update dt", dt);

            if (this._isShowInfo) {
                this._updateInfo(dt);
                return;
            }

            if (this._deffBoard.state() === "resolved") {
                this._updateBoard(dt, this._board);
            }

            if (this._deffBall.state() === "resolved") {
                this._updateBall(dt, this._ball);
            }

            this._checkKeys();
        }
    }, {
        key: "_updateInfo",
        value: function _updateInfo(dt) {
            var info = this._info;
            if (!this._infoTime) {
                info.enableAnimation();
                this._infoTime += dt;
                return;
            }

            if (this._infoTime < 5 || !this._isBlockRender) {
                this._infoTime += dt;
                info.animate(dt, 4, this._infoText);
                return;
            }

            info.disableAnimation();
            this._isShowInfo = false;
            this._infoTime = 0;
        }
    }, {
        key: "_updateBoard",
        value: function _updateBoard(dt, board) {
            var speed = Math.min(dt * board.speedCoef * board.moveMult, 150);
            board.speed = board.direction * speed;
            board.position += board.speed;
            this._calcBoardPos(board);
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
            //board.renderPosition використовуєть в board._update
            board.renderPosition = board.position;
        }
    }, {
        key: "_updateBall",
        value: function _updateBall(dt, ball) {
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

            ball.speed = _components.Vector.FromObj(ball.direction.scalar(dt * ball.speedCoef));
            //генерує помилку при перевищенні швидкості в 30
            //всі розрахунки проводилися для меншої швидкості
            //метод в основному потрібний при розробці
            this._excessBallSpeed(ball.speed);
            this._calcBallPosition(dt, ball);
        }
    }, {
        key: "_excessBallSpeed",
        value: function _excessBallSpeed(speed) {
            if (speed.x >= 30 || speed.y >= 30) {
                var error = new Error("big speed: ");
                this.stop();
                window.console.log(error);
                window.console.log(speed, this._ball.direction);
            }
        }

        //основні значення шара це швидкість ball.speed - яку відстань пролетить шар за один кадр
        //координати на полі (ball.position)
        // ball.direction напрямок руху задається одиничним вектором

        //Позиція розраховується методом  _calcBallPosition так:
        //розраховується позиція шара наступного кадру, і переверіяться чи не залетить шар
        //на якийсь об'єкт.
        //Якщо шар при цій позиції залетів на якийсь об'єкт (або декілька), то
        //шукається відстань до точки дотику кожного об'єкту і береться найбільша.
        //І вже від цього об'єкту розраховується відскок (шукається напрямок direction).
        //Відстань (швидкість) відскоку розраховується, як швидкість мінус відстань перельоту
        //І повторно запускається метод  _calcBallPosition() для цієї швидкості і напрямкому
        //і так доки шар не пройде всю відстань початкової швидкості (speed)
        //Ця нова позиція записується в ball.renderPosition, яка використовується
        //для відмальовки шара в наступному кадрі.

    }, {
        key: "_calcBallPosition",
        value: function _calcBallPosition(dt, ball) {
            //об'єкт в який буде зберігатися з чим було зіткнення
            //і зміна speed, direction, position
            ball.touchedElem = {};
            ball.position = ball.position.sum(ball.speed);

            if (this._isTouchedBorder(ball.position, ball)) {
                this._calcTouchedBorderPos(ball.position, ball);
            }

            if (this._isTouchBlocksVsBall(ball)) {
                this._calcTouchedBlockPos(ball);
                this._touchedBlockArr = [];
            }

            if (ball.direction.y > 0) {
                if (_block.Block.isTouchBlockVsBall(this._board, ball)) {
                    //  window.console.log("touch board border", ball.touchedElem.board, ball.board);
                    this._calcTouchedBoardPos(ball, this._board);
                }
            }

            var distance = 0;
            //шукаємо об'єкт, з яким першим відбулося зіткнення
            for (var key in ball.touchedElem) {
                if (+ball.touchedElem[key] > distance) {
                    distance = +ball.touchedElem[key];

                    ball.position = ball[key].position;
                    ball.speed = ball[key].speed;
                    ball.direction = ball[key].direction;
                }
            }

            //якщо distance = 0, то зіткнення нема, інакше розраховуємо
            //позицію після відскоку з залишковою швидкістю
            if (distance !== 0) {
                ball.speedCoef += this._acceleration;
                this._board.speedCoef = ball.speedCoef;
                ball.correctionDirection(dt);
                this._calcBallPosition(dt, ball);
            } else {
                //кінцева позиція
                ball.renderPosition.setValue(ball.position);
            }
        }
    }, {
        key: "_isTouchedBorder",
        value: function _isTouchedBorder(position, ball) {
            var rightBorder = this._game.gameField.innerWidth() - ball.radius;
            var bottomBorder = this._game.gameField.innerHeight() - ball.radius;
            var topBorder = ball.radius;
            var leftBorder = ball.radius;

            return position.x - leftBorder < 0 || position.y - topBorder < 0 || position.x - rightBorder > 0 || position.y - bottomBorder > 0;
        }
    }, {
        key: "_calcTouchedBorderPos",
        value: function _calcTouchedBorderPos(position, ball) {
            var rightBorder = this._game.gameField.innerWidth() - ball.radius;
            var bottomBorder = this._game.gameField.innerHeight() - ball.radius - 5;
            var topBorder = ball.radius;
            var leftBorder = ball.radius;

            var distance = 0;
            ball.border = {};
            var obj = {};

            if (position.x - leftBorder < 0) {
                obj.left = (position.x - leftBorder) / ball.direction.x;
            }

            if (position.y - topBorder < 0) {
                obj.top = (position.y - topBorder) / ball.direction.y;
            }

            if (position.x > rightBorder) {
                obj.right = (position.x - rightBorder) / ball.direction.x;
            }

            if (position.y > bottomBorder) {
                this.gameOver("loss");
            }

            //distance найбюільша (якщо виліт за дві границі)
            // відстань на яку шар вийшов за границю поля
            //і відскок розраховується від цієї границі поля
            for (var key in obj) {
                if (!obj.hasOwnProperty(key)) {
                    continue;
                }

                if (obj[key] > distance) {
                    distance = obj[key];
                    if (key === "left" || key === "right") {
                        ball.newDirection = new _components.Vector(-1 * ball.direction.x, ball.direction.y);
                    } else {
                        ball.newDirection = new _components.Vector(ball.direction.x, -1 * ball.direction.y);
                    }
                }
            }

            ball.touchedElem.border = distance;
            var over = ball.direction.scalar(distance);
            ball.border.speed = ball.newDirection.scalar(distance);
            ball.border.direction = _components.Vector.FromObj(ball.newDirection);
            ball.border.position = position.diff(over);
        }

        //грубий пошук всіх блоків, на які залетить шар

    }, {
        key: "_isTouchBlocksVsBall",
        value: function _isTouchBlocksVsBall(ball) {
            var _this3 = this;

            this._touchedBlockArr = [];
            this._blockArr.forEach(function (block) {
                if (_block.Block.isTouchBlockVsBall(block, ball)) {
                    _this3._touchedBlockArr.push(block);
                }
            });

            return this._touchedBlockArr.length !== 0;
        }

        // Відскок від блоку ділиться на два варіанти
        //відскок від бокової частини _calcSideBlockRebound
        // або відскок від кута блоку _calcVertexRebound

    }, {
        key: "_calcTouchedBlockPos",
        value: function _calcTouchedBlockPos(ball) {
            ball.block = {};
            //перевіряє чи залетить центр шару в блок, якщо так, то для подальших
            //розрахунків віднімається радіус, це дозволяє досягти швидкості не в 15,
            //а в 30, це критичні швидкості для розрахунків
            this._calcCentrOver(ball);
            ball.position = ball.position.diff(ball.direction.scalar(ball.centrOver));
            ball.touchSide = false;

            //вертикальний та горизонтальний вектори нормалі у напрямку руху шара
            var normalH = ball.getNormal(new _components.Vector(Math.sign(ball.direction.x), 0));
            var normalV = ball.getNormal(new _components.Vector(0, Math.sign(+ball.direction.y)));
            //якщо є дотик до сторони, то не перевіряти далі
            this._calcSideBlockRebound(normalH, normalV, ball);
            if (ball.touchSide) {
                return;
            }

            var vertex = _block.Block.findNearVertex(this._touchedBlockArr[0], ball);
            if (vertex === null) {
                //window.console.log("vertex null");
                return;
            }
            this._calcVertexRebound(this._touchedBlockArr[0], ball, vertex);
        }
    }, {
        key: "_calcCentrOver",
        value: function _calcCentrOver(ball) {
            for (var i = 0; i < this._touchedBlockArr.length; i++) {
                if (this._touchedBlockArr[i].isContainCoord(ball.position)) {
                    ball.centrOver = ball.radius;
                    return;
                }
            }
            ball.centrOver = 0;
        }

        //за допомогою векторів нормалі шукаємо якого блоку торкнеться спочатку, 
        //за принципом: вершина якого вектора зайде глибше в блок

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
                    distV = (ball.radius - Math.min(Math.abs(ball.position.y - this._touchedBlockArr[i].bottom()), Math.abs(ball.position.y - this._touchedBlockArr[i].top()))) / Math.abs(+ball.direction.y);
                    blockV = this._touchedBlockArr[i];
                }
            }

            if (distH + distV === 0) {
                return;
            }

            if (distH > distV) {
                dist = distH;
                block = blockH;
                ball.newDirection = new _components.Vector(-Math.sign(normalH.x) * ball.direction.x, ball.direction.y);
            } else {
                dist = distV;
                block = blockV;
                ball.newDirection = new _components.Vector(ball.direction.x, -Math.sign(+normalV.y) * ball.direction.y);
            }

            ball.touchSide = true;
            this._touchingBlock(block);
            ball.touchedElem.block = dist + ball.centrOver;

            var over = ball.direction.scalar(dist + ball.centrOver);
            ball.block.speed = ball.newDirection.scalar(dist + ball.centrOver);
            ball.block.direction = _components.Vector.FromObj(ball.newDirection);
            ball.block.position = ball.position.diff(over);
        }

        //вершина буде точкою дотику, тому шукаємо позицію шара 
        //з центром на прямій руху і границя якого містить вершину
        //новий напрямок вираховується як при відскоку від прямої
        //але яка є дотичною до шара у точці вершини
        //Для цього рахуємо кут між прямою руху і дотичною і
        // використовуємо поворот вектора на потрібний кут, який прісля
        //нормалізації і буде новим напрямком руху

    }, {
        key: "_calcVertexRebound",
        value: function _calcVertexRebound(block, ball, vertex) {
            ball.block.position = ball.calcCentr(vertex);
            var vecCentrToVertex = vertex.diff(ball.block.position);
            var normal = new _components.Vector(-vecCentrToVertex.y, vecCentrToVertex.x);

            //кут між напрямком руху і вектором з центра до вершини
            var angle = Math.acos(_components.Vector.scalarMult(ball.direction, vecCentrToVertex.norm()));
            var sign = Math.sign(_components.Vector.scalarMult(normal, ball.direction));
            var distance = ball.position.diff(vertex).module() + ball.centrOver;
            this._touchingBlock(block);

            ball.touchedElem.block = distance;
            ball.block.direction = ball.direction.turnAngle(Math.PI - sign * 2 * angle).norm();
            ball.block.speed = ball.block.direction.scalar(distance);
        }

        //Для розрахунку відскоку використовується такий метод
        //Береться масив точок, які лежать на границі дошки з відстанню 1px одна від одної
        //знаходяться всі точки, які потраплять в шар після зіткнення
        //шар зміщується назад так що передостання з дальніх точок лежить на його границі
        //і так рекурсивно продовжується доки не залишається одна точка, від якої
        // і разраховується відскок аналогічно до відскоку від вершини блоку

    }, {
        key: "_calcTouchedBoardPos",
        value: function _calcTouchedBoardPos(ball, board) {
            ball.board = {};
            ball.board.position = _components.Vector.FromObj(ball.position);
            var point = this._findTouchedBoardPoint(ball, board);

            if (point === null) {
                return;
            }

            ball.board.position = ball.calcCentr(point);
            var vecCentrToVertex = point.diff(ball.board.position);

            var normal = new _components.Vector(-vecCentrToVertex.y, vecCentrToVertex.x);
            var angle = Math.acos(_components.Vector.scalarMult(ball.direction, vecCentrToVertex.norm()));
            var sign = Math.sign(_components.Vector.scalarMult(normal, ball.direction));
            var distance = ball.position.diff(ball.board.position).module();

            ball.touchedElem.board = distance;
            ball.board.direction = ball.direction.turnAngle(Math.PI - sign * 2 * angle).norm();
            ball.board.speed = ball.board.direction.scalar(distance);
        }

        //знаходить всі точки границі дошки, які потраплять до шару

    }, {
        key: "_findTouchedBoardPoints",
        value: function _findTouchedBoardPoints(ball, board) {
            var _this4 = this;

            this._boardPointTouchedArr = [];
            var pointArr = board.getPointArr();
            pointArr.forEach(function (point) {
                //округлення для нейтралізації помилки при розрахунках
                var distance = Math.round(ball.board.position.diff(point).module() * 100) / 100;
                if (distance <= ball.radius) {
                    _this4._boardPointTouchedArr.push(point);
                }
            });
            return this._boardPointTouchedArr;
        }
    }, {
        key: "_findTouchedBoardPoint",
        value: function _findTouchedBoardPoint(ball, board) {
            var numPoints = this._findTouchedBoardPoints(ball, board).length;
            var resPoint = void 0;
            if (numPoints === 0) {
                return null;
            }

            if (numPoints === 1) {
                return this._boardPointTouchedArr[0];
            }

            //з двух точок береться ближча
            //при подальшому продовженні рекурсії може помилково статися так,
            //що точок в шарі не буде
            if (numPoints === 2) {
                return ball.direction.x > 0 ? this._boardPointTouchedArr[0] : this._boardPointTouchedArr[1];
            }

            if (ball.direction.x > 0) {
                resPoint = this._boardPointTouchedArr[numPoints - 2];
            } else {
                resPoint = this._boardPointTouchedArr[1];
            }

            ball.board.position = ball.calcCentr(resPoint);
            return this._findTouchedBoardPoint(ball, board);
        }
    }, {
        key: "_checkKeys",
        value: function _checkKeys() {
            if (this._game.checkKeyPress(32)) {
                this.ballOnBoard = false;
            }

            if (this._game.checkKeyPress(13) || this._game.checkKeyPress(27)) {
                this._blockNumber = 0;
                this._game.setScene({
                    scene: _PauseScene.PauseScene,
                    isClear: false
                });
                this.isPause = true;
            }
            this._checkKeysBoard(this._board);
        }
    }, {
        key: "_checkKeysBoard",
        value: function _checkKeysBoard(board) {
            if ((this._game.keys["37"] || this._game.keys["A".charCodeAt(0) + ""]) && (this._game.keys["39"] || this._game.keys["D".charCodeAt(0) + ""]) || !this._game.keys["37"] && !this._game.keys["39"] && !this._game.keys["A".charCodeAt(0) + ""] && !this._game.keys["D".charCodeAt(0) + ""]) {
                //якщо кнопки управління не натиснуті або натиснуто більше однієї
                //дошка стоїть
                board.direction = 0;
                board.moveMult = 0;
            } else {
                //при зміні напрямку руху коеф прискорення анулюється
                board.moveMult += this._BOARD_MOVE_MULT;
                if (this._game.keys["37"] || this._game.keys["A".charCodeAt(0) + ""]) {
                    if (board.direction > 0) {
                        board.moveMult = 0;
                    }
                    board.direction = -1;
                } else if (this._game.keys["39"] || this._game.keys["D".charCodeAt(0) + ""]) {
                    if (board.direction < 0) {
                        board.moveMult = 0;
                    }
                    board.direction = 1;
                }
            }
        }
    }, {
        key: "render",
        value: function render(dt) {
            // window.console.log("render dt", dt);
            if (this._deffBoard.state() === "resolved") {
                this._board.render(dt);
            }

            if (!this._game.gameField.find("*").is(this._boardElem)) {
                this._game.gameField.append(this._boardElem);
                this._deffBoard.resolve();
            }

            /*if (!this._game.gameField.contains(this._boardElem)) {
            	this._game.gameField.appendChild(this._boardElem);
            }*/

            this._renderBlock();

            if (this._isShowInfo) {
                if (!this._game.gameField.find("*").is(this._info.getElem())) {
                    this._game.gameField.append(this._info.getElem());
                }
                return;
            } else {
                if (this._game.gameField.find("*").is(this._info.getElem())) {
                    this._info.getElem().remove();
                }
            }

            /*if (this._isShowInfo) {
            	if (!this._game.gameField.contains(this._info.getElem())) {
            		this._game.gameField.appendChild(this._info.getElem());
            	}
            	return;
            } else {
            	if (this._game.gameField.contains(this._info.getElem())) {
            		this._game.gameField.removeChild(this._info.getElem());
            	}
            		}*/

            if (!this._game.gameField.find("*").is(this._ballElem)) {
                this._game.gameField.append(this._ballElem);
                this._deffBall.resolve();
            }

            if (this._deffBall.state() === "resolved") {
                this._ball.render(dt);
            }

            /*	if (!this._game.gameField.contains(this._ballElem)) {
            		this._game.gameField.appendChild(this._ballElem);
            	}*/

            //запускається останнім, щоб після запуску нової сцени
            //не вимальовувалися старі елементи
            this._removeBlock();
        }

        //після паузи блоки вимальовуються миттєво,
        //при старті раунда по одному в кожному кадрі

    }, {
        key: "_renderBlock",
        value: function _renderBlock() {
            var _this5 = this;

            if (this.isPause) {
                this._blockArr.forEach(function (block) {
                    _this5._game.gameField.append(block.getElem());
                });
                this.isPause = false;
                this._blockNumber = this._blockArr.length;
            }

            if (this._blockNumber < this._blockArr.length) {
                this._game.gameField.append(this._blockArr[this._blockNumber].getElem());
                this._blockNumber++;
                return;
            }
            this._isBlockRender = true;
        }

        //викликається при зіткненні з блоком

    }, {
        key: "_touchingBlock",
        value: function _touchingBlock(block) {
            block.touching();
            this._game.score += block.getScore();
            this._blockForRemove.push(block);
        }

        //видаляє блоки з масиву блоків і з ігрового поля,
        // які мають статус block.isRemove true

    }, {
        key: "_removeBlock",
        value: function _removeBlock() {
            var _this6 = this;

            this._blockForRemove.forEach(function (block) {
                if (block.isRemove()) {
                    var pos = _this6._blockArr.indexOf(block);
                    if (pos >= 0) {
                        _this6._blockArr.splice(pos, 1);
                        block.getElem().remove();
                    }
                }
            });

            this._blockForRemove = [];
            if (this._blockArr.length === 0) {
                this.gameOver("victory");
            }
        }
    }, {
        key: "gameOver",
        value: function gameOver(gameStatus) {
            this.isPause = true;
            this._game.setScene({
                scene: _GameOverScene.GameOverScene,
                isClear: false,
                gameStatus: gameStatus
            });
        }
    }, {
        key: "stop",
        value: function stop() {
            this._game.stop();
        }
    }]);

    return GameScene;
}();