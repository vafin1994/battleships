import {Component, OnInit} from '@angular/core';
import {Cell, Row} from './battleshipInterface';
import {SocketService} from '../socket.service';

@Component({
  selector: 'app-battleships',
  templateUrl: './battleships.component.html',
  styleUrls: ['./battleships.component.css']
})
export class BattleshipsComponent implements OnInit {
  currentState: 'plan' | 'fight' = 'plan';

  myReserveVessels = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
  alreadyDeployed = 0;
  lastDeployedCoordinates: { row: number, column: number };
  shipOrientation: '' | 'vertical' | 'horizontal' = '';
  availableCells: { row: number, column: number }[] = [];

  constructor(public socket: SocketService) {
    this.createField(this.socket.myField);
    this.createField(this.socket.enemyField);
  }

  createField(field) {
    for (let i = 0; i < 10; i++) {
      const row: Row = {cells: []};
      for (let j = 0; j < 10; j++) {
        row.cells.push({row: i, column: j, isChecked: false, isShip: false, isNearVessel: false});
      }
      field.push(row);
    }
  }

  tryToPutVessel(cell: Cell) {
    if (!this.checkIsCellAvailableForDeployment(cell)) {
      return;
    }
    if (cell.isShip ||
      this.myReserveVessels.length === 0 || cell.isNearVessel) {
      return;
    }
    if (this.alreadyDeployed > 0) {
      if (cell.row !== this.lastDeployedCoordinates.row) {
        this.shipOrientation = 'vertical';
      } else {
        this.shipOrientation = 'horizontal';
      }
    }
    this.alreadyDeployed++;
    if (this.alreadyDeployed > 0 && this.myReserveVessels[0] > 1 && this.alreadyDeployed < this.myReserveVessels[0]) {
      this.checkNextAvailableCell(this.lastDeployedCoordinates, cell, this.myReserveVessels[0]);
    }
    this.lastDeployedCoordinates = {column: cell.column, row: cell.row};
    this.socket.cellsWithShips.push(this.lastDeployedCoordinates);
    this.socket.myField[cell.row].cells[cell.column].isShip = true;
    if (this.alreadyDeployed === this.myReserveVessels[0]) {
      this.shipOrientation = '';
      this.alreadyDeployed = 0;
      this.myReserveVessels.splice(0, 1);
      this.markNearVesselCells(this.socket.myField);
    }
    if (this.myReserveVessels.length === 0) {
      this.socket.readyToStart = true;
    }
  }

  checkNextAvailableCell(previousCoordinate: { row: number, column: number }, cell: Cell, lengthOfVessel) {
    this.availableCells = [];
    let nextRow: number;
    let previousRow: number;
    let nextColumn: number;
    let previousColumn: number;
    if (cell.row < 9) {
      nextRow = cell.row + 1;
      this.availableCells.push({column: cell.column, row: nextRow});
    }
    if (cell.row > 0) {
      previousRow = cell.row - 1;
      this.availableCells.push({column: cell.column, row: previousRow});
    }
    if (cell.column < 9) {
      nextColumn = cell.row + 1;
      this.availableCells.push({column: nextColumn, row: cell.row});
    }
    if (cell.column > 0) {
      previousColumn = cell.row - 1;
      this.availableCells.push({column: previousColumn, row: cell.row});
    }
    // TODO проверить на то, влезает ли судно горизонтально или вертикально и если не влезает, пометить ячейки
  }


  checkIsCellAvailableForDeployment(cell: Cell) {
    if (!this.lastDeployedCoordinates) {
      return true;
    } else if (this.alreadyDeployed > 0) {
      return this.isCellNearPreviousCell(cell);
    } else if (this.alreadyDeployed === 0) {
      return true;
    }
  }

  isCellNearPreviousCell(cell: Cell) {
    if (cell.row > this.lastDeployedCoordinates.row && cell.row + this.myReserveVessels[0] - 1 - this.alreadyDeployed > 9 ||
      cell.row < this.lastDeployedCoordinates.row && cell.row - this.myReserveVessels[0] + 1 + this.alreadyDeployed < 0 ||
      cell.column > this.lastDeployedCoordinates.column && cell.column + this.myReserveVessels[0] - 1 - this.alreadyDeployed > 9 ||
      cell.column < this.lastDeployedCoordinates.column && cell.column - this.myReserveVessels[0] + 1 + this.alreadyDeployed < 0) {
      return false;
    }
    if (cell.row === this.lastDeployedCoordinates.row + 1 && cell.column === this.lastDeployedCoordinates.column
      || cell.row === this.lastDeployedCoordinates.row - 1 && cell.column === this.lastDeployedCoordinates.column
      || cell.column === this.lastDeployedCoordinates.column + 1 && cell.row === this.lastDeployedCoordinates.row
      || cell.column === this.lastDeployedCoordinates.column - 1 && cell.row === this.lastDeployedCoordinates.row) {
      if (this.shipOrientation === 'vertical' && cell.row === this.lastDeployedCoordinates.row
        || this.shipOrientation === 'horizontal' && cell.column === this.lastDeployedCoordinates.column) {
        return false;
      } else {
        if (cell.isShip || cell.isNearVessel) {
          return false;
        } else {
          return true;
        }
      }

    } else {
      return false;
    }
  }

  markNearVesselCells(field: Row[]) {
    for (let i = 0; i < field.length; i++) {
      for (let j = 0; j < field[i].cells.length; j++) {
        const currentCell = field[i].cells[j];
        if (currentCell.isShip) {
          if (field[i - 1] && field[i - 1].cells[j - 1]) {
            field[i - 1].cells[j - 1].isNearVessel = true;
          }
          if (field[i - 1] && field[i - 1].cells[j]) {
            field[i - 1].cells[j].isNearVessel = true;
          }
          if (field[i - 1] && field[i - 1].cells[j + 1]) {
            field[i - 1].cells[j + 1].isNearVessel = true;
          }
          if (field[i] && field[i].cells[j - 1]) {
            field[i].cells[j - 1].isNearVessel = true;
          }
          if (field[i] && field[i].cells[j + 1]) {
            field[i].cells[j + 1].isNearVessel = true;
          }
          if (field[i + 1] && field[i + 1].cells[j - 1]) {
            field[i + 1].cells[j - 1].isNearVessel = true;
          }
          if (field[i + 1] && field[i + 1].cells[j]) {
            field[i + 1].cells[j].isNearVessel = true;
          }
          if (field[i + 1] && field[i + 1].cells[j + 1]) {
            field[i + 1].cells[j + 1].isNearVessel = true;
          }
        }
      }
    }
  }


  tryToShoot(cell: Cell) {
    if (this.socket.isMyTurn) {
      this.socket.sendGameMove(JSON.stringify(cell));
      this.socket.enemyField[cell.row].cells[cell.column].isChecked = true;
    } else {
      return;
    }
  }

  startFight() {
    this.socket.myDice = Math.floor(Math.random() * 6);
    if (this.socket.isEnemyReady) {
      this.socket.isMyTurn = this.socket.myDice > this.socket.enemyDice;
    }
    this.socket.sendGameMove(JSON.stringify({state: 'ready', dice: this.socket.myDice}));
    this.currentState = 'fight';
  }

  sendMessageToUser() {
    this.socket.sendMessageToUser('test');
  }

  ngOnInit() {
  }

}
