import { Component } from '@angular/core';
import { BackTrackingService } from './core/back-tracking.service';
import { BoardTypes, CellState } from '../assets/base-boards';
import { Cell } from './core/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
})
export class AppComponent {

  boardOptions: { key: string, value: number }[];
  matrix: Cell[][] = [];

  constructor(
    public backTracking: BackTrackingService,
  ) {
    backTracking.printMatrix();
    this.boardOptions = Object.keys(BoardTypes)
      .filter((key) => Number.isNaN(+key))
      .map((key) => ({ key, value: BoardTypes[ key ] }));
  }

  setBoard(type: BoardTypes) {
    this.backTracking.setBoard(type);

    this.matrix = this.backTracking
      .matrix
      .map((row, y) => row.map(
        (peg, x) => new Cell(x, y, peg === CellState.peg),
      ));
    console.log('====================================');
    console.log('MatSelect value changed: ', type);
    console.log('====================================');
    this.backTracking.printMatrix();
  }
}
