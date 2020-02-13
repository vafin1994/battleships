import {Injectable} from '@angular/core';
import {Game} from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  selectedGame: Game;

  constructor() {
  }

  changeSelectedGame(game: Game) {
    this.selectedGame = game;
  }

}
