import { Component } from '@angular/core';

import { BackTrackingService, BoardTypes } from '../core';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: [ './controls.component.scss' ],
})
export class ControlsComponent {
  // Initial states
  animated = false;

  // Initial board setting from BoardTypes
  defaultBoard = BoardTypes.solitair;
  boardOptions: { key: string, value: number }[];

  // Inject the BackTrackingService
  constructor(
    public backTracking: BackTrackingService,
  ) {

    // Calculate boardOptions for select input based on available BoardTypes
    this.boardOptions = Object.keys(BoardTypes)
      .filter((key) => Number.isNaN(+key))
      .map((key) => ({ key, value: BoardTypes[ key ] }));
  }

  /**
   * Sets the board matrix based in the board type selected passed as parameter
   *
   * @param  {BoardTypes} type
   * @returns void
   */
  setBoard(type: BoardTypes) {
    this.backTracking.setBoard(type);
    this.animated = false;

    console.log('====================================');
    console.log('MatSelect value changed: ', type);
    console.log('====================================');
    this.backTracking.printMatrix();
  }

  /**
   * On customize button click, set the custom board as the current type
   * & emit customize event through BackTrackingService
   *
   * @param  {boolean} active
   * @returns void
   */
  customize(active: boolean) {
    this.defaultBoard = BoardTypes.custom;
    this.backTracking.customizeSubject.next(active);
    this.animated = false;
  }

  /**
   * Send animate event through BackTrackingService
   *
   * @returns void
   */
  animate() {
    this.animated = true;
    this.backTracking.animateSubject.next(true);
  }

  /**
   * Send animate event through BackTrackingService
   *
   * @returns void
   */
  reset() {
    this.backTracking.resetSubject.next(true);
    this.animated = false;
  }
}
