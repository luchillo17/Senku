import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { chunk, cloneDeep } from 'lodash';
import { from } from 'rxjs/observable/from';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { zip } from 'rxjs/observable/zip';
import { concatMap, filter, first, tap } from 'rxjs/operators';

import { BackTrackingService, calculateCCord, Cell, CellState, Move, PegDirective } from '../core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: [ './board.component.scss' ],
})
export class BoardComponent {

  // Query html for all pegs
  @ViewChildren(PegDirective, { read: ElementRef })
  public set pegsList(pegList: QueryList<ElementRef>) {
    this.pegs = chunk(pegList.map((pegRef) => pegRef.nativeElement), 7);
  }

  // Angular animation players, one for peg to move & one for peg to delete
  private movePlayer: AnimationPlayer;
  private deletePlayer: AnimationPlayer;

  // SVG circle list that represents all pegs of game
  pegs: SVGCircleElement[][];

  // Cell matrix that holds the board state
  matrix: Cell[][] = [];

  // Inject the animation builder & BackTrackingService
  constructor(
    public backTracking: BackTrackingService,
    public builder: AnimationBuilder,
  ) {

    // Get a clone of matrix inside the backTracking service
    backTracking.matrixSubject
      .subscribe((matrix) => {
        this.matrix = cloneDeep(matrix);
      });

    // Subscribe to animate, customize & reset event subjects of BackTrackingService
    backTracking.animateSubject.subscribe(this.animateMoves);
    backTracking.resetSubject.subscribe(this.reset);

    backTracking.customizeSubject.pipe(
      filter((customizing) => !customizing),
    ).subscribe(() => backTracking.setBoardFromMatrix(this.matrix));
  }


  /**
   * Resets the matrix state to before the animation of solutions is done
   *
   * @returns void
   */
  reset = () => {
    this.backTracking
      .matrixSubject
      .pipe(first())
      .subscribe((matrix) => this.matrix = cloneDeep(matrix));
  }


  /**
   * Animates the moves of the solution found in series
   *
   * @returns void
   */
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

  /**
   * Animate a single move with the peg move in parallel with the other peg deletion
   *
   * @memberof BoardComponent
   * @returns Observable
   */
  animateMove = (move: Move): Observable<any> => {
    return zip(
      this.animatePeg(move),
      this.animateDelete(move),
    );
  }

  /**
   * Calculates the move animation for this move based in position & target position,
   * then executes the animation and updates the matrix state accordingly
   *
   * @param  {Move} move
   * @returns Observable
   */
  animatePeg = (move: Move): Observable<any> => {
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
      this.matrix[ move.y ][ move.x ].peg = CellState.void;
      this.matrix[ move.toY ][ move.toX ].peg = CellState.peg;
    }));
  }

  /**
   * Executes the delete animation based on delete position
   * and updates the matrix state accordingly
   *
   * @param  {Move} move
   * @returns Observable
   */
  animateDelete = (move: Move): Observable<any> => {
    const animation = this.builder.build([
      animate('400ms ease-out', style({ opacity: 0 })),
    ]);

    return this.animateCell(
      this.pegs[ move.deleteY ][ move.deleteX ],
      animation,
      false,
    ).pipe(tap(() => {
      this.matrix[ move.deleteY ][ move.deleteX ].peg = CellState.void;
    }));
  }


  /**
   * General animation function, animates the peg based on animation parameter
   * & uses the specific player based on the @param isMoveAnimation parameter
   *
   * @param  {SVGCircleElement} peg
   * @param  {AnimationFactory} animation
   * @param  {boolean} isMoveAnimation
   * @returns Observable
   */
  animateCell = (peg: SVGCircleElement, animation: AnimationFactory, isMoveAnimation: boolean): Observable<any> => {
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
