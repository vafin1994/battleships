import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SocketService} from '../socket.service';
import {GamesService} from '../games.service';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent implements OnInit {

  commandToServer = '';
  params: any;

  constructor(private route: ActivatedRoute, private socket: SocketService, private gamesService: GamesService) {
    console.log('New frame called');
    this.route.queryParams.subscribe(params => {
      this.params = params;
    });
  }

  sendMessageToUser() {
    this.socket.sendMessageToUser(this.commandToServer);
  }

  ngOnInit() {
  }

}
