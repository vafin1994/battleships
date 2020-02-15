import {Injectable} from '@angular/core';
import * as socketIo from 'socket.io-client';
import {environment} from '../environments/environment';
import {ActivatedRoute, Params} from '@angular/router';
import {QueryParams} from './interfaces';
import {Row} from './battleships/battleshipInterface';

const serverUrl = environment.socketUrl;

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  readyToStart = false;
  isMyTurn: boolean;
  myField: Row[] = [];
  enemyField: Row[] = [];
  cellsWithShips: { row: number, column: number }[] = [];
  isEnemyReady = false;
  enemyDice: number;
  myDice: number;
  params: QueryParams;
  private socket;

  constructor(private route: ActivatedRoute) {
    this.socket = socketIo(serverUrl);
    this.route.queryParams.subscribe((params: QueryParams) => {
      this.params = params;
      this.params = params;
      if (params.myRouletteSocketId) {
        this.socket.emit('initMessage', this.params);
      }
    });
    this.socket.on('messageToUser', (data: any) => this.onMessageToUser(data));
    this.socket.on('gameMove', (move: any) => this.onGameMove(move));
  }

  sendMessageToUser(message: string) {
    this.socket.emit('messageToUser', message);
  }

  sendGameMove(move: string) {
    this.socket.emit('gameMove', move);
  }

  onGameMove(move: string) {
    const moveJson = JSON.parse(move);
    if (moveJson.state === 'ready') {
      this.isEnemyReady = true;
      this.enemyDice = moveJson.dice;
      if (this.readyToStart) {
        this.isMyTurn = this.myDice > this.enemyDice;
      }
      this.myDice = null;
      this.enemyDice = null;
    }
    if (moveJson.row >= 0 && moveJson.column >= 0) {
      this.checkEnemyShot(moveJson.row, moveJson.column);
    }
  }

  checkEnemyShot(row, column) {
    const cell = {row: row, column: column, result: false};
    const index = this.cellsWithShips.findIndex((obj: { column: number, row: number }) => obj.row === row && obj.column === column);
    if (index >= 0) {
      // Противник попал
      this.isMyTurn = false;
      cell.result = true;
      const cellString = JSON.stringify(cell);
      this.sendMessageToUser(cellString);
    } else {
      // Противник не попал
      this.isMyTurn = true;
      const cellString = JSON.stringify(cell);
      this.sendMessageToUser(cellString);
    }
  }


  onMessageToUser(data: string) {
    console.log(data);
    const dataObj: { row: number, column: number, result: boolean } = JSON.parse(data);
    console.log(dataObj);
    this.enemyField[dataObj.row].cells[dataObj.column].isShip = dataObj.result;
    if (dataObj.result) {
      this.isMyTurn = true;
    } else {
      this.isMyTurn = false;
    }
  }
}
