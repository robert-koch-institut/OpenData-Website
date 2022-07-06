import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-keep-in-view',
  templateUrl: './keep-in-view.component.html',
  styleUrls: ['./keep-in-view.component.scss']
})
export class KeepInViewComponent implements OnInit {

  @Input() topOffset: number = 0;

  @ViewChild('keepInView') keepInViewElement!: ElementRef;

  constructor(private elementRef: ElementRef, private renderer: Renderer2, @Inject(DOCUMENT) private document: any) { }

  ngOnInit(): void {
  }

  // TODO: auch auf resize achte
  @HostListener('window:resize')
  onResize() {
    _.delay(() => this.onScroll(), 30);
  }

  @HostListener('window:scroll')
  onScroll() {
    const bb = this.elementRef.nativeElement.getBoundingClientRect();

    if (bb.top <= 0) {
      this.renderer.addClass(this.keepInViewElement.nativeElement, 'fixed');
      this.renderer.setStyle(this.keepInViewElement.nativeElement, 'top', `${this.topOffset}px`);

      const parentWidth = this.keepInViewElement.nativeElement.parentElement.clientWidth || 0;
      this.renderer.setStyle(this.keepInViewElement.nativeElement, 'width', `${parentWidth}px`);
    }
    else {
      this.renderer.removeClass(this.keepInViewElement.nativeElement, 'fixed');
      this.renderer.removeStyle(this.keepInViewElement.nativeElement, 'top');
      this.renderer.removeStyle(this.keepInViewElement.nativeElement, 'width');
    }
  }
}
