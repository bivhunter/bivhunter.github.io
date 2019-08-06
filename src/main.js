import { Game } from "./game";
import { sounds } from "./sounds";
import { BufferSoundsService } from "./bufferSoundsService";
import { eventBus } from "./eventBus";
import $ from "jquery";


//Запуск гри\



/*
function getAudio( url ) {

}

function getUrl ( url ) {
   return new Promise((resolve, reject) => {
       let xhr = new XMLHttpRequest();
       xhr.open('GET', url);
       xhr.responseType = "arraybuffer";
       xhr.onload = () => {
           if (xhr.status === 200) {
               console.log("ok");
               resolve(xhr.response);
           } else {
               reject(new Error('no load file'));
           }
       };
       xhr.send();
   });

}

function connectData( url, audioContext ) {
    getUrl( url ).then((data) => {
        return audioContext.decodeAudioData(data);
    }).then((buffer) => {
        let source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start(0);
    });
}

*/



$(document).ready(() => {

    let urlList = {
        changeMenuItem: './audio/changeMenuItem.mp3',
        okMenuItem: './audio/okMenuItem.mp3',

        touch: './audio/touch.mp3',
        removeBlock: './audio/removeBlock.mp3',
        lostBall: './audio/lostBall.mp3',


        startRound: './audio/startRound.mp3',
        victory: './audio/victory.mp3',
        defeat: './audio/defeat.mp3'
    };

    let gameLounch = new Game( $("#game-field" ), $( "#header-field" ), eventBus );

    let bufferSoundsService = new BufferSoundsService();
    bufferSoundsService.buffer(urlList).then((data) => {
        $("#game-field" ).click();
        sounds.list = data;
    });




   // connectData('./audio/audio_1.mp3', audioContext);
   // console.log("main");


});


