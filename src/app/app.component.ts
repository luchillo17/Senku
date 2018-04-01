import { Component } from '@angular/core';
import { BackTrackingService } from './core/back-tracking.service';
import { BoardTypes } from '../assets/base-boards';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  boardOptions: {key: string, value: number}[];
  constructor(
    public backTracking: BackTrackingService,
  ) {
    backTracking.printMatrix();
    this.boardOptions = Object.keys(BoardTypes)
      .filter((key) => Number.isNaN(+key))
      .map((key) => ({ key, value: BoardTypes[key]}));
  }

  setBoard(type: BoardTypes) {
    this.backTracking.setBoard(type);
    console.log('====================================');
    console.log('MatSelect value changed: ', type);
    console.log('====================================');
    this.backTracking.printMatrix();
  }
}
