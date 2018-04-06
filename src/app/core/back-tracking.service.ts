import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { cloneDeep, each, shuffle, some } from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { boards, BoardTypes, Cell, CellState, directions, getBoardPegCount, Move } from './models';

@Injectable()
export class BackTrackingService {

  // Initial BackTrackingService state
  solved = false;

  pegs = 0;
  matrix: Matrix;
  solution: Move[] = [];
  noSolutionMatrixes = new Set<number>();

  // Cell Matrix BehaviorSubject that holds the last Cell Matrix generated
  matrixSubject: BehaviorSubject<Cell[][]> = new BehaviorSubject(null);

  // Event subjects for board-controls components communication
  resetSubject: Subject<boolean> = new Subject();
  animateSubject: Subject<boolean> = new Subject();
  customizeSubject: Subject<boolean> = new BehaviorSubject(false);

  // Inject Material Snack Bar service & set initial English board configuration
  constructor(
    public snackBar: MatSnackBar,
  ) {
    this.setBoard(BoardTypes.solitair);
  }

  /**
   * Set the matrix based on saved initial configurations selected by @param type
   *
   * @param  {BoardTypes} type
   * @returns void
   */
  setBoard(type: BoardTypes): void {

    // Reset board state, pegCount, solution & clear the Set of board states without solution
    this.solved = false;
    this.matrix = cloneDeep(boards[ type ]);
    this.pegs = getBoardPegCount(this.matrix);
    this.solution = [];
    this.noSolutionMatrixes.clear();

    // Calculate & emit the Cell matrix for the board UI
    const boardMatrix: Cell[][] = this.matrix
      .map((row, y) => row.map(
        (peg, x) => new Cell(x, y, peg),
      ));
    this.matrixSubject.next(boardMatrix);
  }

  /**
   * Set matrix based on Cell matrix in case we want to edit the board
   *
   * @param  {Cell[][]} matrix
   * @returns void
   */
  setBoardFromMatrix = (matrix: Cell[][]): void => {

    // Reset matrix state, pegCount, solution & clear the Set of board states without solution
    this.solved = false;
    this.matrix = matrix.map(
      (row) => row.map((cell) => cell.peg),
    );
    this.pegs = getBoardPegCount(this.matrix);
    this.solution = [];
    this.noSolutionMatrixes.clear();

    // Calculate & emit the matrix for the algorithm
    const boardMatrix: Cell[][] = this.matrix
      .map((row, y) => row.map(
        (peg, x) => new Cell(x, y, peg),
      ));
    this.matrixSubject.next(boardMatrix);
    this.printMatrix();
  }

  /**
   * Starts the algorithm by calling the recursive function with all possible moves
   * of starting state of matrix, measures the time taken to find the solution & displays
   * it through a SnackBar
   *
   * @returns void
   */
  solve = (): void => {

    // Mark start time of algorithm
    performance.mark('start');

    // Get all possible moves for initial board state
    const moves = this.getAllowedMoves();

    // Try all moves found 1 by 1 until one returns true, meaning we found a solution
    this.solved = some(moves, this.recursiveMove);

    // Mark end time & measure
    performance.mark('end');
    performance.measure('BackTracking', 'start', 'end');

    // Get measure in local var & clear the measures memory
    const measure: PerformanceMeasure = performance.getEntriesByName('BackTracking')[ 0 ];
    performance.clearMarks();
    performance.clearMeasures();

    // Set the message for the SnackBar to inform user if solution & duration
    let message = 'Solution not found';
    if (this.solved) {
      message = `Solution found in ${measure.duration} ms`;
    }

    // Display result message to user
    this.snackBar.open(message, 'close');

    console.log('====================================');
    console.log('HasSolution: ', this.solved);
    console.log('Duration: ', measure.duration);
    console.log('Moves: ', this.solution);
    console.log('====================================');
  }

  /**
   * Recursive move function that makes BackTracking to try and find a solution
   *
   * @param  {Move} move
   * @returns boolean
   */
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

  /**
   * Get all possible moves for current matrix state
   *
   * @returns Move
   */
  getAllowedMoves(): Move[] {
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

  /**
   * Get all valid moves of cell in coords (x, y) passed as params
   *
   * @param  {number} x
   * @param  {number} y
   * @returns Move
   */
  getCellMoves(x: number, y: number): Move[] {
    return shuffle(directions)
      .map((dir) => new Move(x, y, dir))
      .filter(this.isMoveValid);
  }

  /**
   * Check if move valid
   *
   * @param  {Move} move
   * @returns boolean
   */
  isMoveValid = (move: Move): boolean => {
    /**
     * Check if target is in range,
     * if target is empty & there's peg to delete.
     */
    return move.toX >= 0 && move.toX < 7 &&
      move.toY >= 0 && move.toY < 7 &&
      this.matrix[ move.toY ][ move.toX ] === CellState.void &&
      this.matrix[ move.deleteY ][ move.deleteX ] === CellState.peg;
  }

  /**
   * Apply Peg Move
   *
   * @param  {Move} move
   * @returns void
   */
  applyMove(move: Move) {
    this.matrix[ move.y ][ move.x ] = CellState.void;
    this.matrix[ move.toY ][ move.toX ] = CellState.peg;
    this.matrix[ move.deleteY ][ move.deleteX ] = CellState.void;
    this.pegs--;
  }

  /**
   * Undo Peg Move
   *
   * @param  {Move} move
   * @returns void
   */
  revertMove(move: Move): void {
    this.matrix[ move.y ][ move.x ] = CellState.peg;
    this.matrix[ move.toY ][ move.toX ] = CellState.void;
    this.matrix[ move.deleteY ][ move.deleteX ] = CellState.peg;
    this.pegs++;
  }

  /**
   * Add move to solution array at the left end
   *
   * @param  {Move} move
   * @returns void
   */
  addSolution(move: Move): void {
    // Solutions are added in inverse order
    this.solution.unshift(move);
  }

  /**
   * Print matrix in console, debug purpose
   *
   * @returns void
   */
  printMatrix(): void {
    console.table(this.matrix);
  }
}
