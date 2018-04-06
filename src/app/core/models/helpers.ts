import { CellState } from './base-boards';

/**
 * Count current matrix pegs
 *
 * @param  {Matrix} matrix
 * @returns number
 */
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

/**
 * Calculate SVG Circle coordinate in the SVG viewBox coordinate space
 *
 * @param  {number} c
 * @returns number
 */
export function calculateCCord(c: number): number {
  const distance = 10;
  const offset = 5;
  return c * distance + offset;
}
