import { Game } from "./game";
import $ from "jquery";


//Запуск гри\
console.log("main");
let gameLounch = new Game( $("#game-field" ), $( "#header-field" ) );

