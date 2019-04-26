"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
  function Game(gameField, headerField) {
    _classCallCheck(this, Game);

    this.gameField = gameField;
    this.headerField = headerField;
    this.lifes = 1;
    this.score = 0;
    this._stop = false;
    //this._isStart = false;
    this.keys = {};
    this.round = new Round();
    this.header = new Header({});
    this._sceneArr = [];
    //this._start();

    this._initEvent();
    this.setScene({
      scene: StartScene,
      round: this.round,
      isClear: true
    });
    this.start();
  }

  _createClass(Game, [{
    key: "_initEvent",
    value: function _initEvent() {
      var _this = this;

      this.keys = {};
      document.addEventListener("keydown", function (e) {
        _this.keys[e.which] = true;

        console.log("down", e.which);
      });
      document.addEventListener("keyup", function (e) {
        _this.keys[e.which] = false;
        /*if (e.which === 13) {
          this._pressEnter();
        }*/
        //console.log("up", e.which);
      });
    }
  }, {
    key: "setScene",
    value: function setScene(options) {
      if (options.isClear) {
        this.gameField.innerHTML = "";
        this.headerField.innerHTML = "";
      }

      var scene = new options.scene(this, options.round, options.isLoss);
      if (scene instanceof GameScene || scene instanceof StartScene) {
        this._sceneArr = [];
      }
      if (this.activeScene) {
        this._sceneArr.push(this.activeScene);
      }
      this.activeScene = scene;
    }
  }, {
    key: "returnScene",
    value: function returnScene() {
      this.gameField.innerHTML = "";
      console.log(this._sceneArr);
      this.activeScene = this._sceneArr.pop();
    }

    /* _pressEnter() {
       if (this._isStart) {
         this._isStart = false;
         this.pause();
       } else {
         this._isStart = true;
         this.start();
       }
     }*/

  }, {
    key: "update",
    value: function update(dt) {
      this.activeScene.update(dt);
      this._updateHeader(dt);
    }
  }, {
    key: "render",
    value: function render(dt) {
      this.activeScene.render(dt);
      this._renderHeader(dt);
    }

    /*pause() {
      this.stop();
      }*/

  }, {
    key: "_updateHeader",
    value: function _updateHeader(dt) {
      this.header.setScore(this.score);
      this.header.setLifes(this.lifes);
    }
  }, {
    key: "_renderHeader",
    value: function _renderHeader(dt) {
      if (!this.headerField.contains(this.header.getElem())) {
        this.headerField.appendChild(this.header.getElem());
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      console.log("stop" + this._animation);
      this._stop = true;

      //cancelAnimationFrame(this._animation);
      //this.activeScene.stop();
    }
  }, {
    key: "start",
    value: function start() {
      var _this2 = this;

      this._stop = false;
      var last = performance.now(),
          fps = 60,
          slomo = 0.5,
          // slow motion multiplier
      step = 1 / fps,
          slowStep = slomo * step,
          dt = 0,
          now = void 0;
      console.log("slomo:  ", slomo);
      var frame = function frame() {
        now = performance.now();
        dt = dt + Math.min(1, (now - last) / 1000);
        while (dt > slowStep) {
          //  console.log("while");
          dt = dt - slowStep;
          // console.log("update");
          _this2.update(step);
        }
        last = now;

        //console.log("render");
        _this2.render(dt / slomo * fps);
        //cancelAnimationFrame(this._animationFrameStart);
        if (!_this2._stop) {
          _this2._animation = requestAnimationFrame(frame);
        }
        //console.log(this._animation);
      };

      requestAnimationFrame(frame);
    }
  }, {
    key: "checkKeyPress",
    value: function checkKeyPress(keyCode) {
      // handle key press + release
      var isKeyPressed = !!this.keys[keyCode];
      this.lastKeyState = this.lastKeyState || {};

      // disallow key event from previous scene
      if (typeof this.lastKeyState[keyCode] === 'undefined') {
        this.lastKeyState[keyCode] = isKeyPressed;
        return false;
      }

      // allow press only when state was changed
      if (this.lastKeyState[keyCode] !== isKeyPressed) {
        this.lastKeyState[keyCode] = isKeyPressed;
        return isKeyPressed;
      } else {
        return false;
      }
    }
  }]);

  return Game;
}();

function vectorNorm(vec) {
  var x = vec.x,
      y = vec.y,
      d = Math.sqrt(x * x + y * y);

  return {
    x: x / d,
    y: y / d
  };
}

function vectorSum(vec1, vec2) {
  return {
    x: vec1.x + vec2.x,
    y: vec1.y + vec2.y
  };
}

function vectorScalar(num, vec) {
  return {
    x: vec.x * num,
    y: vec.y * num
  };
}

function vectorDiff(vec1, vec2) {
  return {
    x: vec1.x - vec2.x,
    y: vec1.y - vec2.y
  };
}

function vectorTurn(vec1, vec2) {
  return {
    x: vec1.x * vec2.x,
    y: vec1.y * vec2.y
  };
}

function vectorScalarMult(vec1, vec2) {
  return vec1.x * vec2.x + vec1.y * vec2.y;
}

function vectorModule(vec) {
  return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

function vectorTurnAngle(vec, angle) {
  return {
    x: vec.x * Math.cos(angle) - vec.y * Math.sin(angle),
    y: vec.x * Math.sin(angle) + vec.y * Math.cos(angle)
  };
}
//lounch game
function calcQuad(a, b, c) {
  var d = b * b - 4 * a * c;
  if (d < 0) {
    return null;
  }
  var x_1 = (-b + Math.sqrt(d)) / (2 * a);
  var x_2 = (-b - Math.sqrt(d)) / (2 * a);
  return {
    x_1: x_1,
    x_2: x_2
  };
}

function calcCentr(direc, pos, coord, r) {
  var k = direc.y / direc.x;
  var d = pos.y - k * pos.x;
  var a = 1 + k * k;
  var b = -2 * coord.x + 2 * k * d - 2 * k * coord.y;
  var c = coord.x * coord.x + d * d - 2 * d * coord.y + coord.y * coord.y - r * r;
  var resX = calcQuad(a, b, c);
  if (resX.x_1 * direc.x < resX.x_2 * direc.x) {
    return {
      x: resX.x_1,
      y: k * resX.x_1 + d
    };
  } else {
    return {
      x: resX.x_2,
      y: k * resX.x_2 + d
    };
  }
}

var res = calcQuad(1, 2, 1);

console.log(Math.sign(0) + " " + 2 * res.x_2);
var gameLounch = new Game(document.getElementById("game-field"), document.getElementById("header-field"));

/*document.getElementById("start").addEventListener("click", () => {
  gameLounch.start();
  setTimeout(() => {
    gameLounch.stop();
  }, 10000);
});

document.getElementById("stop").addEventListener("click", () => {
  gameLounch.stop();
});*/
/*let last = performance.now(),
  fps = 60,
  slomo = 1, // slow motion multiplier
  step = 1 / fps,
  slowStep = slomo * step,
  dt = 0,
  now;

let frame = () => {
  now = performance.now();
  dt = dt + Math.min(1, (now - last) / 1000);
  while (dt > slowStep) {
    dt = dt - slowStep;
    update(step);
  }
  last = now;

  render(dt / slomo * fps);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);*/