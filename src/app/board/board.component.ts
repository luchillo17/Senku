import { Component, OnInit } from '@angular/core';

import { BackTrackingService, Cell } from '../core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  matrix: Cell[][] = [];

  constructor(
    public backTracking: BackTrackingService,
  ) {
    backTracking.matrixSubject
      .subscribe((matrix) => {
        this.matrix = matrix;
      });
  }
}
