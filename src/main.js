import { Game } from "./game";
import $ from '../lib/jquery-3.4.1';

//Запуск гри

let gameLounch = new Game( $("#game-field" ), $( "#header-field" ) );