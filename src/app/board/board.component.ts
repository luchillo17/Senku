import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { chunk } from 'lodash';
import { from } from 'rxjs/observable/from';
import { zip } from 'rxjs/observable/zip';
import { concatMap } from 'rxjs/operators';

import { BackTrackingService, Cell, Move, PegDirective } from '../core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: [ './board.component.scss' ],
})
export class BoardComponent implements AfterViewInit {
  @ViewChildren(PegDirective, { read: ElementRef })
  public set pegsList(pegList: QueryList<ElementRef>) {
    this.pegs = chunk(pegList.map((pegRef) => pegRef.nativeElement), 7);
  }

  public movePlayer: AnimationPlayer;
  public deletePlayer: AnimationPlayer;


  pegs: SVGCircleElement[][];

  matrix: Cell[][] = [];

  constructor(
    public backTracking: BackTrackingService,
    public builder: AnimationBuilder,
  ) {
    backTracking.matrixSubject
      .subscribe((matrix) => {
        this.matrix = matrix;
      });

    backTracking.animateSubject.subscribe(this.animateMoves);
  }

  ngAfterViewInit() {
    console.log('====================================');
    console.log(this.pegs);
    console.log('====================================');
  }

  animateMoves = () => {
    from(this.backTracking.solution).pipe(
      concatMap((move) => this.animateMove(move)),
    ).subscribe(() => {
      console.log('====================================');
      console.log('Moves animated');
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
      animate('300ms ease-out', style({ transform: `translateY(${'5px'})` })),
    ]);

    return this.animateCell(
      this.movePlayer,
      this.pegs[ move.y ][ move.x ],
      animation,
    );
  }

  animateDelete = (move: Move) => {
    const animation = this.builder.build([
      animate('300ms ease-out', style({ opacity: 0 })),
    ]);

    return this.animateCell(
      this.deletePlayer,
      this.pegs[ move.deleteY ][ move.deleteX ],
      animation,
    );
  }

  animateCell = (player: AnimationPlayer, peg: SVGCircleElement, animation: AnimationFactory) => {
    return new Promise((resolve, reject) => {

      console.log('====================================');
      console.log('Player: ', player);
      console.log('====================================');

      let oldPlayer = player;

      // Create player for move animation & play
      player = animation.create(peg);
      player.play();
      player.onDone(() => {
        console.log('====================================');
        console.log('AnimationDone');
        console.log('====================================');
        resolve();
      });

      /**
       * Destroy old players, order is important,
       * destroy after new player is running.
       */
      if (oldPlayer) {
        oldPlayer.destroy();
        oldPlayer = null;
      }
    });
  }
}
