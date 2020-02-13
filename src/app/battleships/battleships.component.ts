import {Component, OnInit} from '@angular/core';
import {Cell, Row} from './battleshipInterface';

@Component({
  selector: 'app-battleships',
  templateUrl: './battleships.component.html',
  styleUrls: ['./battleships.component.css']
})
export class BattleshipsComponent implements OnInit {
  currentState: 'plan' | 'fight' = 'plan';

  readyToStart = false;
  myField: Row[] = [];
  enemyField: Row[] = [];
  myReserveVessels = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
  alreadyDeployed = 0;
  lastDeployedCoordinates: { row: number, column: number };
  availableCells: { row: number, column: number }[] = [];

  constructor() {
    this.createField(this.myField);
    this.createField(this.enemyField);
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
    if (cell.isShip ||
      this.myReserveVessels.length === 0 || cell.isNearVessel) {
      return;
    }
    this.alreadyDeployed++;
    if (this.alreadyDeployed > 0 && this.myReserveVessels[0] > 1 && this.alreadyDeployed < this.myReserveVessels[0]) {
      console.log('Need to check');
      this.checkNextAvailableCell(this.lastDeployedCoordinates, cell, this.myReserveVessels[0]);
    }
    this.lastDeployedCoordinates = {column: cell.column, row: cell.row};
    this.myField[cell.row].cells[cell.column].isShip = true;
    if (this.alreadyDeployed === this.myReserveVessels[0]) {
      this.alreadyDeployed = 0;
      this.myReserveVessels.splice(0, 1);
      this.markNearVesselCells(this.myField);
    }
    if (this.myReserveVessels.length === 0) {
      this.readyToStart = true;
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
    console.log(this.availableCells);
  }


  checkIsCellAvailableForDeployment(cell) {
    // TODO put some logic here
    return true;
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
    console.log(cell);
    this.enemyField[cell.row].cells[cell.column].isChecked = true;
  }

  startFight() {
    // TODO send that you ready to fight
    this.currentState = 'fight';
  }

  ngOnInit() {
  }

}
