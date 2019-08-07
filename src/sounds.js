import { audioCtx } from "./audioContext";
import { eventBus } from "./eventBus";

class Sounds {
    constructor() {
        this.list = {};
        this._subscribeEvent();
    }

    _subscribeEvent() {

        eventBus.subscribe('changeMenuItem', (data) => {
        this._playSound('changeMenuItem', data);
        });

        eventBus.subscribe('okMenuItem', (data) => {
            this._playSound('okMenuItem', data);
        });

        eventBus.subscribe('touch', (data) => {
            this._playSound('touch', data);
        });

        eventBus.subscribe('removeBlock', (data) => {
            this._playSound('removeBlock', data);
        });

        eventBus.subscribe('lostBall', (data) => {
            this._playSound('lostBall', data);
        });

        eventBus.subscribe('restart', (data) => {
            this._playSound('restart', data);
        });

        eventBus.subscribe('startRound', (data) => {
            this._playSound('startRound', data);
        });

        eventBus.subscribe('victoryRound', (data) => {
            this._playSound('victoryRound', data);
        });

        eventBus.subscribe('victoryGame', (data) => {
            this._playSound('victoryGame', data);
        });

        eventBus.subscribe('gameOver', (data) => {
            this._playSound('gameOver', data);
        });

        eventBus.subscribe('finalInfo', (data) => {
            this._playSound('finalInfo', data);
        });
    }

    _playSound(soundName, data) {
        let sound = this.list[soundName];
        if (!sound || data === 'StartScene') {
            console.log("no sound || startScene");
            return;
        }
        this._playOnce(sound);
    }

    _touch(data) {
        let sound = this.list.touch;
        if (!sound || data === 'StartScene') {
            console.log("no sound || startScene");
            return;
        }
        this._playOnce(sound);

    }

    _changeMenuItem() {
        let sound = this.list.changeMenuItem;
        if (!sound) {
            console.log("no sound");
            return;
        }
        this._playOnce(sound);
    }

    _lostBall() {

    }

    _removeBlock(data) {
        let sound = this.list.removeBlock;
        if (!sound || data === 'StartScene') {
            console.log("no sound || startScene");
            return;
        }
        this._playOnce(sound);
    }

    _okMenuItem(data) {

    }

    _newRound(data) {

    }

    _victory(data) {

    }

    _defeat(data) {

    }



    _playOnce(sound) {
        let source = audioCtx.createBufferSource();
        source.buffer = sound;
        source.connect(audioCtx.destination);
        source.loop = false;
        source.start(0);
        console.log("playOnce", source);
        //source.stop(0.8);
    }

    changeMenu() {

    }


    touchBlock() {

    }

    volumeUp() {

    }

    volumeDown() {
        
    }

}

export let sounds = new Sounds();