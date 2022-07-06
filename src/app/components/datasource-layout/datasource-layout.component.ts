import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TemplatePortal } from '@angular/cdk/portal';
import { AfterViewInit, Component, ContentChildren, OnDestroy, OnInit, QueryList, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, shareReplay, startWith } from 'rxjs/operators';
import { DatasourceLayoutItemComponent } from '../datasource-layout-item/datasource-layout-item.component';

export type DatasourceLayoutItemPosition = 'toc' | 'licence-small' | 'licence' | 'links' | 'title' | 'authors' | 'contributors' | 'abstract' | 'tag' | 'cite' | 'content' | 'doc';

@Component({
  selector: 'app-datasource-layout',
  templateUrl: './datasource-layout.component.html',
  styleUrls: ['./datasource-layout.component.scss'],
  // encapsulation: ViewEncapsulation.ShadowDom
})
export class DatasourceLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  isSmallWidth$: Observable<boolean> = of(false);

  portalsByPosition: { [key in DatasourceLayoutItemPosition]: BehaviorSubject<TemplatePortal | null> } = {
    // 'date': new BehaviorSubject<TemplatePortal | null>(null),
    'title': new BehaviorSubject(<TemplatePortal | null>null),
    'licence-small': new BehaviorSubject(<TemplatePortal | null>null),
    'authors': new BehaviorSubject<TemplatePortal | null>(null),
    'licence': new BehaviorSubject<TemplatePortal | null>(null),
    'contributors': new BehaviorSubject<TemplatePortal | null>(null),
    'abstract': new BehaviorSubject<TemplatePortal | null>(null),
    'tag': new BehaviorSubject<TemplatePortal | null>(null),
    'cite': new BehaviorSubject<TemplatePortal | null>(null),
    'content': new BehaviorSubject<TemplatePortal | null>(null),
    'doc': new BehaviorSubject<TemplatePortal | null>(null),
    'links': new BehaviorSubject<TemplatePortal | null>(null),
    'toc': new BehaviorSubject<TemplatePortal | null>(null),
  };

  @ContentChildren(DatasourceLayoutItemComponent, { descendants: true }) items!: QueryList<DatasourceLayoutItemComponent>;
  itemSubscription?: Subscription;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isSmallWidth$ = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall])
      .pipe(map(x => x.matches))
      .pipe(shareReplay(1));
  }

  ngOnDestroy(): void {
    if (this.itemSubscription) {
      this.itemSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.itemSubscription = this.items.changes
      .pipe(startWith(this.items))
      .pipe(map((x: QueryList<DatasourceLayoutItemComponent>) => x.toArray()))
      .pipe(delay(1))
      .subscribe(x => {
        x.forEach(p => {
          if (this.portalsByPosition.hasOwnProperty(p.position)) {
            this.portalsByPosition[p.position].next(p.content);
          }
        });
      });
  }

  ngOnInit(): void {
  }

}
