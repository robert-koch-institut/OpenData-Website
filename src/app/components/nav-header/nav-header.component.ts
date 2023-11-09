import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import * as _ from 'lodash';
import { Observable, map, shareReplay } from 'rxjs';
import { DatasourceService } from 'src/app/services/datasource.service';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.scss']
})
export class NavHeaderComponent implements OnInit {
  shrinkHeader = false;
  readonly datasource = this.datasourceService.getDatasource();
  isSmall$: Observable<boolean>;

  @HostListener('window:resize', ['$event'])
  onScrollDebounced: _.DebouncedFunc<(x: Event) => void>;

  constructor(private elemRef: ElementRef<HTMLElement>, private datasourceService: DatasourceService, private breakpointObs: BreakpointObserver, public titleService: TitleService) {
    this.onScrollDebounced = _.debounce(x => this.onScroll(x), 50, { leading: true });
    this.isSmall$ = this.breakpointObs.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(map(x => x.matches), shareReplay());
  }

  ngOnInit(): void {
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    if (event.target) {
      const targetBB = this._getBoundingBox(event.target)
      if (targetBB) {
        if (!this.shrinkHeader) {
          const elementBB = this._getBoundingBox(this.elemRef.nativeElement);
          this.shrinkHeader = targetBB.scroll.top > (elementBB?.bb.height ?? 30) / 2;
        } else {
          this.shrinkHeader = targetBB.scroll.top > 0;
        }
      }
    }
  }

  private _getBoundingBox(eventTarget: EventTarget): { bb: DOMRect, scroll: { height: number, width: number, top: number, left: number } } | undefined {
    if (eventTarget instanceof Window) {
      return this._getBoundingBox(eventTarget.document);
    }
    if (eventTarget instanceof Document) {
      return this._getBoundingBox(eventTarget.documentElement);
    }
    if (eventTarget instanceof HTMLElement) {
      return {
        bb: eventTarget.getBoundingClientRect(),
        scroll: {
          height: eventTarget.scrollHeight,
          width: eventTarget.scrollWidth,
          top: eventTarget.scrollTop,
          left: eventTarget.scrollLeft
        }
      };
    }
    return undefined;
  }

}
