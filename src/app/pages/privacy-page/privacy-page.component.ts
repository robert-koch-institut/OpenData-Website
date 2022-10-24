import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-privacy-page',
  templateUrl: './privacy-page.component.html',
  styleUrls: ['./privacy-page.component.scss']
})
export class PrivacyComponent implements OnInit {

  isSmall$: Observable<boolean>;

  constructor(private breakpointObs: BreakpointObserver) {
    this.isSmall$ = this.breakpointObs.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(map(x => x.matches))
  }

  ngOnInit(): void {
  }

}
