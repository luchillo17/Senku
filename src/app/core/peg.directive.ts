import { Directive, HostBinding, Input, OnInit } from '@angular/core';

import { calculateCCord, Cell } from './models';

@Directive({
  selector: '[appPeg]',
})
export class PegDirective implements OnInit {

  @HostBinding('id') id = '';

  @HostBinding('style.display')
  public get display(): string {
    return this.pegCell.peg ? '' : 'none';
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

  @Input()
  pegCell: Cell;

  constructor() {}

  ngOnInit() {
    this.id = `peg-${this.pegCell.x}-${this.pegCell.y}`;

  }

}
