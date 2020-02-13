import {Component, OnInit} from '@angular/core';
import {VugasiConnectionService} from '../vugasi-connection.service';
import {Game} from '../interfaces';
import {GamesService} from '../games.service';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.css']
})
export class GamesListComponent implements OnInit {
  gamesList: Game[] = [];

  constructor(private vugasiConnectionService: VugasiConnectionService, private gamesService: GamesService) {
    this.getGamesList();
  }

  getGamesList() {
    this.vugasiConnectionService.getGamesList().subscribe(
      (response: Game[]) => {
        this.gamesList = response;
      }
    );
  }

  ngOnInit() {
  }

}
