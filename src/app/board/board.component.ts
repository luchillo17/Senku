import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { chunk, cloneDeep } from 'lodash';
import { from } from 'rxjs/observable/from';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { zip } from 'rxjs/observable/zip';
import { concatMap, filter, first, tap } from 'rxjs/operators';

import { BackTrackingService, calculateCCord, Cell, CellState, Move, PegDirective } from '../core';

interface CustomizeClasses {
  neon: boolean;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: [ './board.component.scss' ],
})
export class BoardComponent {
  @ViewChildren(PegDirective, { read: ElementRef })
  public set pegsList(pegList: QueryList<ElementRef>) {
    this.pegs = chunk(pegList.map((pegRef) => pegRef.nativeElement), 7);
  }

  private movePlayer: AnimationPlayer;
  private deletePlayer: AnimationPlayer;

  pegs: SVGCircleElement[][];

  matrix: Cell[][] = [];

  constructor(
    public backTracking: BackTrackingService,
    public builder: AnimationBuilder,
  ) {
    backTracking.matrixSubject
      .subscribe((matrix) => {
        this.matrix = cloneDeep(matrix);
      });

    backTracking.animateSubject.subscribe(this.animateMoves);
    backTracking.resetSubject.subscribe(this.reset);

    backTracking.customizeSubject.pipe(
      filter((customizing) => !customizing),
    ).subscribe(() => backTracking.setBoardFromMatrix(this.matrix));
  }

  reset = () => {
    this.backTracking
      .matrixSubject
      .pipe(first())
      .subscribe((matrix) => this.matrix = cloneDeep(matrix));
  }

  animateMoves = () => {
    from(this.backTracking.solution).pipe(
      concatMap((move) => this.animateMove(move)),
    ).subscribe(() => {
      this.movePlayer.destroy();
      this.deletePlayer.destroy();
      this.movePlayer = this.deletePlayer = null;
      console.log('====================================');
      console.log('Moves animation finished');
      console.log('====================================');
    });
  }

  animateMove = (move: Move) => {
    return zip(
      this.animatePeg(move),
      this.animateDelete(move),
    );
  }

  animatePeg = (move: Move) => {
    const animation = this.builder.build([
      style({ zIndex: '9999' }),
      animate('400ms ease-out', style({
        cx: `${calculateCCord(move.toX)}px`,
        cy: `${calculateCCord(move.toY)}px`,
      })),
    ]);

    return this.animateCell(
      this.pegs[ move.y ][ move.x ],
      animation,
      true,
    ).pipe(tap(() => {
      this.matrix[move.y][move.x].peg = CellState.void;
      this.matrix[move.toY][move.toX].peg = CellState.peg;
    }));
  }

  animateDelete = (move: Move) => {
    const animation = this.builder.build([
      animate('400ms ease-out', style({ opacity: 0 })),
    ]);

    return this.animateCell(
      this.pegs[ move.deleteY ][ move.deleteX ],
      animation,
      false,
    ).pipe(tap(() => {
      this.matrix[move.deleteY][move.deleteX].peg = CellState.void;
    }));
  }

  animateCell = (peg: SVGCircleElement, animation: AnimationFactory, isMoveAnimation: boolean) => {
    return fromPromise(new Promise((resolve, reject) => {

      let oldPlayer = isMoveAnimation ? this.movePlayer : this.deletePlayer;

      // Create player for move animation & play
      const player = animation.create(peg);
      player.play();
      player.onDone(resolve);

      if (isMoveAnimation) {
        this.movePlayer = player;
      } else {
        this.deletePlayer = player;
      }

      /**
       * Destroy old players, order is important,
       * destroy after new player is running.
       */
      if (oldPlayer) {
        oldPlayer.destroy();
        oldPlayer = null;
      }
    }));
  }
}
