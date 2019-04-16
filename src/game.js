"use strict";

class Game {
  constructor(gameField) {
    this.gameField = gameField;
    this.header = document.getElementById("header");
    this.lifes = 2;
    this.score = 0;
    this._stop = false;
    //this._isStart = false;
    this.keys = {};
    this.round = new Round();
    this._sceneArr = [];
    this.setScene({
        scene: StartScene,
        isClear: true
    });

    //this._start();

    //this._animationFrame;
    this._initEvent();
    this.start();
  }



  _initEvent() {
    this.keys = {};
    document.addEventListener("keydown", (e) => {
      this.keys[e.which] = true;

      console.log("down", e.which);
    });
    document.addEventListener("keyup", (e) => {
      this.keys[e.which] = false;
      /*if (e.which === 13) {
        this._pressEnter();
      }*/
      //console.log("up", e.which);
    });
  }

  setScene(options) {
      if (options.isClear) {
          this.gameField.innerHTML = "";
          this.header.innerHTML = "";
      }

      let scene = new options.scene(this, options.round, options.isLoss);
      if (scene instanceof  GameScene) {
          this._sceneArr = [];
      }
    if (this.activeScene) {
        this._sceneArr.push(this.activeScene);
    }
    this.activeScene = scene;
  }

  returnScene() {
    this.gameField.innerHTML = "";
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

  update(dt) {
    this.activeScene.update(dt);
  }

  render(dt) {
    this.activeScene.render(dt);
  }

  /*pause() {
    this.stop();

  }*/

  stop() {
    console.log("stop" + this._animation);
    this._stop = true;

    //cancelAnimationFrame(this._animation);
    //this.activeScene.stop();
  }

  start() {

    this._stop = false;
    let last = performance.now(),
      fps = 60,
      slomo = 0.5, // slow motion multiplier
      step = 1 / fps,
      slowStep = slomo * step,
      dt = 0,
      now;
    console.log("slomo:  ", slomo);
    let frame = () => {
      now = performance.now();
      dt = dt + Math.min(1, (now - last) / 1000);
      while (dt > slowStep) {
        //  console.log("while");
        dt = dt - slowStep;
        // console.log("update");
        this.update(step);
      }
      last = now;

      //console.log("render");
      this.render(dt / slomo * fps);
      //cancelAnimationFrame(this._animationFrameStart);
      if (!this._stop) {
        this._animation = requestAnimationFrame(frame);
      }
      //console.log(this._animation);
    };

    requestAnimationFrame(frame);
  }

  checkKeyPress(keyCode) {
    // handle key press + release
    let isKeyPressed = !!this.keys[keyCode];
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
}

function vectorNorm(vec) {
  let x = vec.x,
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
  }
}

function vectorDiff(vec1, vec2) {
  return {
    x: vec1.x - vec2.x,
    y: vec1.y - vec2.y
  }
}

function vectorTurn(vec1, vec2) {
  return {
    x: vec1.x * vec2.x,
    y: vec1.y * vec2.y
  }
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
  }
}
//lounch game
function calcQuad(a, b, c) {
  let d = b * b - 4 * a * c;
  if (d < 0) {
    return null;
  }
  let x_1 = (-b + Math.sqrt(d)) / (2 * a);
  let x_2 = (-b - Math.sqrt(d)) / (2 * a);
  return {
    x_1: x_1,
    x_2: x_2
  }
}

function calcCentr(direc, pos, coord, r) {
  let k = direc.y / direc.x;
  let d = pos.y - k * pos.x;
  let a = 1 + k * k;
  let b = -2 * coord.x + 2 * k * d - 2 * k * coord.y;
  let c = coord.x * coord.x + d * d - 2 * d * coord.y + coord.y * coord.y - r * r;
  let resX = calcQuad(a, b, c);
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

let res = calcQuad(1, 2, 1);

console.log(Math.sign(0) + " " + 2 * res.x_2);
let gameLounch = new Game(document.getElementById("game-field"));

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