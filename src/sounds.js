import { audioCtx } from "./audioContext";
import { eventBus } from "./eventBus";

class Sounds {
    constructor() {
        this.list = {};
        this._subscribeEvent();
    }

    _subscribeEvent() {
        eventBus.subscribe('touch', (data) => {
            this._touch(data);
        });

        eventBus.subscribe('changeMenuItem', (data) => {
            this._changeMenuItem(data);
        });
    }

    _changeMenuItem() {
        let sound = this.list.changeMenuItem;
        if (!sound) {
            console.log("no sound");
            return;
        }
        this._playOnce(sound);
    }

    _touch(data) {
        let sound = this.list.touch;
        if (!sound) {
            console.log("no sound");
            return;
        }
        this._playOnce(sound);

    }

    _playOnce(sound) {
        let source = audioCtx.createBufferSource();
        source.buffer = sound;
        source.connect(audioCtx.destination);
        source.loop = false;
        source.start(0.6);
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