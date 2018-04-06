import { Directive, HostBinding, HostListener, Input, OnInit } from '@angular/core';

import { calculateCCord, Cell, CellState } from './models';

@Directive({
  selector: '[appPeg]',
})
export class PegDirective implements OnInit {
  // Inputs
  @Input()
  pegCell: Cell;

  @Input()
  editing = false;

  // Binding for attributes of the SVG Circle of the peg this directive is attached to
  @HostBinding('id') id = '';

  // Conditional show or hide this peg
  @HostBinding('style.fill-opacity')
  public get display(): number {
    return this.pegCell.peg === CellState.peg ? 1 : 0;
  }

  // Conditional add neon class when customizing the board
  @HostBinding('class.neon')
  public get neonClass(): boolean {
    const condition = this.editing && this.pegCell.peg !== CellState.none;
    return condition;
  }

  // Bind x coordinate
  @HostBinding('attr.cx')
  public get cx(): number {
    return calculateCCord(this.pegCell.x);
  }

  // Bind y coordinate
  @HostBinding('attr.cy')
  public get cy(): number {
    return calculateCCord(this.pegCell.y);
  }

  // Bind radius
  @HostBinding('attr.r')
  r = 4;

  /**
   * On click toggle the cell peg value
   *
   * @returns void
   */
  @HostListener('click')
  public toggleCell() {
    // Ignore click if not editing or peg outside of board
    if (!this.editing || this.pegCell.peg === CellState.none) {
      return;
    }
    this.pegCell.peg = this.pegCell.peg === CellState.peg ? CellState.void : CellState.peg;
  }

  constructor() { }

  ngOnInit() {
    this.id = `peg-${this.pegCell.x}-${this.pegCell.y}`;
  }

}
