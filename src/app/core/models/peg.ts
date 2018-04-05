import { CellState } from '.';

export class Cell {
  constructor(
    public x: number,
    public y: number,
    public peg: CellState = CellState.peg,
  ) { }
}
