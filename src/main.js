import { Game } from "./game";
import { Sound } from "./sound";
import { EventBus } from "./eventBus";
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

    let audioContext = new AudioContext();
    let eventBus = new EventBus();


   // connectData('./audio/audio_1.mp3', audioContext);
   // console.log("main");
    let gameLounch = new Game( $("#game-field" ), $( "#header-field" ), eventBus );
    let sound = new Sound(audioContext, gameLounch);
});


