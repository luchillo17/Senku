import { CellState } from './base-boards';

export function getBoardPegCount(matrix: Matrix): number {
  let pegs = 0;
  for (const row of matrix) {
    for (const cell of row) {
      if (cell === CellState.peg) {
        pegs++;
      }
    }
  }
  return pegs;
}

export function calculateCCord(c: number) {
  const distance = 10;
  const offset = 5;
  return c * distance + offset;
}
