export class Sound {
    constructor(audioContext, game) {
        this.game = game;
        this.audioCtx = audioContext;
        this._subscribeEvent();
    }

    _subscribeEvent() {
        this.game.eventBus.subscribe('touch', (data) => {
            this.touch(data);
        });
    }

    touch(data) {
        console.log(data);
    }

    touchBlock() {

    }

    volumeUp() {

    }

    volumeDown() {
        
    }

}