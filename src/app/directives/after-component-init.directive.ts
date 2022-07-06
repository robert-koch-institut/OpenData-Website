import { AfterViewInit, Directive, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[afterComponentInit]'
})
export class AfterComponentInitDirective implements AfterViewInit {

  @Output() afterComponentInit = new EventEmitter<void>();

  constructor(private element: ElementRef) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.afterComponentInit.emit();
    }, 10);
  }

}
