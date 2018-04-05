import { Component } from '@angular/core';

import { BackTrackingService, BoardTypes } from '../core';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: [ './controls.component.scss' ],
})
export class ControlsComponent {

  defaultBoard = BoardTypes.solitair;
  boardOptions: { key: string, value: number }[];

  constructor(
    public backTracking: BackTrackingService,
  ) {
    this.boardOptions = Object.keys(BoardTypes)
      .filter((key) => Number.isNaN(+key))
      .map((key) => ({ key, value: BoardTypes[ key ] }));
  }

  setBoard(type: BoardTypes) {
    this.backTracking.setBoard(type);

    console.log('====================================');
    console.log('MatSelect value changed: ', type);
    console.log('====================================');
    this.backTracking.printMatrix();
  }

  customize(active: boolean) {
    this.defaultBoard = BoardTypes.custom;
    this.backTracking.customizeSubject.next(active);
  }

  animate() {
    this.backTracking.animateSubject.next(true);
  }

  reset() {
    this.backTracking.resetSubject.next(true);
  }
}
