import { Injectable } from '@angular/core';
import { cloneDeep, each, shuffle, some } from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { boards, BoardTypes, Cell, CellState, directions, getBoardPegCount, Move } from './models';

@Injectable()
export class BackTrackingService {
  pegs = 0;
  boardPegs = 0;
  matrix: Matrix;
  solution: Move[] = [];
  noSolutionMatrixes = new Set<number>();

  matrixSubject: BehaviorSubject<Cell[][]> = new BehaviorSubject(null);

  constructor() {
    this.setBoard(BoardTypes.solitair);
  }

  setBoard(type: BoardTypes) {
    this.matrix = cloneDeep(boards[ type ]);
    this.pegs = getBoardPegCount(this.matrix);
    this.boardPegs = this.pegs;
    this.solution = [];
    this.noSolutionMatrixes.clear();

    const boardMatrix: Cell[][] = this.matrix
      .map((row, y) => row.map(
        (peg, x) => new Cell(x, y, peg === CellState.peg),
      ));
    this.matrixSubject.next(boardMatrix);
  }

  solve = () => {
    console.log('====================================');
    console.log('Solving');
    console.log('====================================');

    performance.mark('start');

    const moves = this.getAllowedMoves();

    const hasSolution = some(moves, this.recursiveMove);

    performance.mark('end');
    performance.measure('BackTracking', 'start', 'end');

    const measure: PerformanceMeasure = performance.getEntriesByName('BackTracking')[ 0 ];
    performance.clearMarks();
    performance.clearMeasures();

    console.log('====================================');
    console.log('HasSolution: ', hasSolution);
    console.log('Duration: ', measure.duration);
    console.log('Moves: ', this.solution);
    console.log('====================================');
  }

  recursiveMove = (move: Move): boolean => {
    // Apply move
    this.applyMove(move);

    // If less or equal to 1 peg count, solution found
    if (this.pegs <= 1) {
      this.addSolution(move);
      return true;
    }

    // TODO: Check if board state has been processed before

    // Get allowed moves
    const allowedMoves = this.getAllowedMoves();

    // Loop through moves & call recursively
    const hasSolution = some(allowedMoves, this.recursiveMove);

    // If has solution, register move && return true
    if (hasSolution) {
      this.addSolution(move);
      return true;
    }

    // If none true undo move & return false
    this.revertMove(move);
    return false;
  }

  getAllowedMoves() {
    const moves: Move[] = [];

    each(this.matrix, (row, y) => {
      each(row, (cell, x) => {
        if (cell !== CellState.peg) {
          return;
        }
        moves.push(...this.getCellMoves(x, y));
      });
    });

    return moves;
  }

  getCellMoves(x: number, y: number): Move[] {
    return shuffle(directions)
      .map((dir) => new Move(x, y, dir))
      .filter(this.isMoveValid);
  }

  isMoveValid = (move: Move) => {
    /**
     * Check if target is in range,
     * if target is empty & there's peg to delete.
     */
    return move.toX >= 0 && move.toX < 7 &&
      move.toY >= 0 && move.toY < 7 &&
      this.matrix[ move.toY ][ move.toX ] === CellState.void &&
      this.matrix[ move.deleteY ][ move.deleteX ] === CellState.peg;
  }

  applyMove(move: Move) {
    this.matrix[ move.y ][ move.x ] = CellState.void;
    this.matrix[ move.toY ][ move.toX ] = CellState.peg;
    this.matrix[ move.deleteY ][ move.deleteX ] = CellState.void;
    this.pegs--;
  }

  revertMove(move: Move) {
    this.matrix[ move.y ][ move.x ] = CellState.peg;
    this.matrix[ move.toY ][ move.toX ] = CellState.void;
    this.matrix[ move.deleteY ][ move.deleteX ] = CellState.peg;
    this.pegs++;
  }

  addSolution(move: Move) {
    // Solutions are added in inverse order
    this.solution.unshift(move);
  }

  printMatrix() {
    console.table(this.matrix);
  }
}
