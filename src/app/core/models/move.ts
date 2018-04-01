import { Direction, DirIndex, directions } from './direction';

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
