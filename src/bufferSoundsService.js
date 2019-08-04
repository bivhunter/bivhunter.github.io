import { audioCtx } from "./audioContext";

export class BufferSoundsService {

    constructor() {
    }


    buffer(urlList) {
        let urlObjArr = this._reformatUrlList(urlList);
        return new Promise((resolve, reject) => {
            this._requestUrlList(urlObjArr).then((data) => {
                let bufferSoundList = {};

                data.forEach((item) => {
                    bufferSoundList[item.name] = item.data;
                });
                console.log("bufferSoundList", bufferSoundList);
                resolve(bufferSoundList);

            });
        });
    }

    _reformatUrlList(urlList) {
        let arr = [];
        for (let key in urlList) {
            if(urlList.hasOwnProperty(key)) {
                arr.push( {
                    name: key,
                    url: urlList[ key ]
                } );
            }
        }
        return arr;
    }

    _requestUrlList(urlList) {

        let promiseList = urlList.map((item) => {
            return new Promise((resolve) => {
                this.decodeData(this._getDataFromUrl(item.url)).then((data) => {
                    item.data = data;
                    resolve(item);
                });
            });
        });

        return Promise.all(promiseList);

    }

    decodeData(promise) {
        return promise.then(
            (data) => audioCtx.decodeAudioData(data),
            (error) => error);
    }

    _getDataFromUrl(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = "arraybuffer";
        xhr.onload = () => {
            if (xhr.status === 200) {
                console.log("ok");
                resolve(xhr.response);
            } else {
                reject(new Error('no found file'));
            }
        };
        xhr.send();
    });

}
}