import { AfterViewInit, Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import * as Rellax from 'rellax';

@Directive({
  selector: '[rellax]'
})
export class RellaxDirective implements OnDestroy, OnChanges {
  private rellaxIns: Rellax.RellaxInstance;
  @Input() rellax?: Rellax.RellaxOptions;

  private defaultOptions: Rellax.RellaxOptions = {};

  constructor(elementRef: ElementRef) {
    this.rellaxIns = new Rellax(elementRef.nativeElement, {...this.defaultOptions, ...this.rellax});
  }
  ngOnChanges(changes: SimpleChanges): void {
    const newOptions = { ...this.defaultOptions, ...this.rellax }
    this.rellaxIns.options = newOptions;
  }
  ngOnDestroy(): void {
    this.rellaxIns.destroy();
  }

}
