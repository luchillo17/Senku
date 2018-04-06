import { CellState } from '.';

/**
 * Represents a Cell in the UI Cell Matrix
 *
 * @param  {number} publicx
 * @param  {number} publicy
 * @param  {CellState=CellState.peg} publicpeg
 */
export class Cell {
  constructor(
    public x: number,
    public y: number,
    public peg: CellState = CellState.peg,
  ) { }
}
