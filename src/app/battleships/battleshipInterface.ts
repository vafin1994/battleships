export interface Cell {
  row: number;
  column: number;
  isShip: boolean;
  isChecked: boolean;
  isNearVessel: boolean;
}

export interface Row {
  cells: Cell[];
}
