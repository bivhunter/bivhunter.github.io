export class EventBus {
    constructor() {
        this.channels = {};
    }
    subscribe(channel, fn) {
        if (!this.channels[channel]) {
            this.channels[channel]  = [];
        }
        this.channels[channel].push(fn);
    }

    unSubscribe(channel, fn) {
        if (!this.channels[channel]) {
            return;
        }

        this.channels[channel] = this.channels[channel].filter((item) => {
           return  item !== fn;
        });

    }

    publish(channel, message) {
        if (!this.channels[channel] || !this.channels[channel].length) {
            return;
        }
        this.channels[channel].forEach((item) => {
            item(message);
        });
    }

}