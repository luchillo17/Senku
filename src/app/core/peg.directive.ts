import { Directive, HostBinding, HostListener, Input, OnInit } from '@angular/core';

import { calculateCCord, Cell, CellState } from './models';

@Directive({
  selector: '[appPeg]',
})
export class PegDirective implements OnInit {
  @Input()
  pegCell: Cell;

  @Input()
  editing = false;

  @HostBinding('id') id = '';

  @HostBinding('style.fill-opacity')
  public get display(): number {
    return this.pegCell.peg === CellState.peg ? 1 : 0;
  }

  @HostBinding('class.neon')
  public get neonClass(): boolean {
    const condition = this.editing && this.pegCell.peg !== CellState.none;
    return condition;
  }

  @HostBinding('attr.cx')
  public get cx(): number {
    return calculateCCord(this.pegCell.x);
  }

  @HostBinding('attr.cy')
  public get cy(): number {
    return calculateCCord(this.pegCell.y);
  }

  @HostBinding('attr.r')
  r = 4;

  @HostListener('click')
  public toggleCell() {
    if (!this.editing || this.pegCell.peg === CellState.none) {
      return;
    }
    this.pegCell.peg = this.pegCell.peg === CellState.peg ? CellState.void : CellState.peg;
  }

  constructor() {}

  ngOnInit() {
    this.id = `peg-${this.pegCell.x}-${this.pegCell.y}`;
  }

}
