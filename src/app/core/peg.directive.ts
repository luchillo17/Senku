import { Directive, HostBinding, Input, OnInit } from '@angular/core';

import { Cell } from './models';

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
    return this.pegCell.x * this.distance + this.offset;
  }

  @HostBinding('attr.cy')
  public get cy(): number {
    return this.pegCell.y * this.distance + this.offset;
  }

  @HostBinding('attr.r')
  r = 4;

  @Input()
  pegCell: Cell;

  private offset = 5;
  private distance = 10;

  constructor() {}

  ngOnInit() {
    this.id = `peg-${this.pegCell.x}-${this.pegCell.y}`;

  }

}
