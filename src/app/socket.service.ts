import {Injectable} from '@angular/core';
import * as socketIo from 'socket.io-client';
import {environment} from '../environments/environment';
import {ActivatedRoute, Params} from '@angular/router';
import {QueryParams} from './interfaces';

const serverUrl = environment.socketUrl;

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  messagesArr = [];
  params: QueryParams;
  private socket;

  constructor(private route: ActivatedRoute) {
    this.socket = socketIo(serverUrl);
    this.route.queryParams.subscribe((params: QueryParams) => {
      this.params = params;
      if (params.myRouletteSocketId) {
        this.socket.emit('initMessage', this.params);
      }
    });
    this.socket.on('messageToUser', (data: any) => this.onMessageToUser(data));
  }

  sendMessageToUser(command: string) {
    this.socket.emit('messageToUser', command);
  }


  onMessageToUser(data) {
    this.messagesArr.push(data);
    console.log('Message');
    console.log(data);
  }
}
