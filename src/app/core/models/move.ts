import { Direction, DirIndex } from './direction';
/**
 * Represents a Move, holds the positions of the origin cell, the target
 * cell & the cell to delete, as well as the direction of the movement,
 * though such direction is only used to calculate the target & delete peg
 *
 * @param  {number} publicx
 * @param  {number} publicy
 * @param  {Direction} publicdirection
 */
export class Move {
  toX = 0;
  toY = 0;
  deleteX = 0;
  deleteY = 0;

  constructor(
    public x: number,
    public y: number,
    public direction: Direction,
  ) {
    this.toX = this.x + direction[ DirIndex.x ] * 2;
    this.toY = this.y + direction[ DirIndex.y ] * 2;

    this.deleteX = this.x + direction[ DirIndex.x ];
    this.deleteY = this.y + direction[ DirIndex.y ];
  }
}
