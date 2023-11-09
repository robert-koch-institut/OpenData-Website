import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'app-imprint-page',
  templateUrl: './imprint-page.component.html',
  styleUrls: ['./imprint-page.component.scss']
})
export class ImprintComponent implements OnInit {

  isSmall$: Observable<boolean>;

  constructor(private breakpointObs: BreakpointObserver, private titleService: TitleService) {
    this.isSmall$ = this.breakpointObs.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(map(x => x.matches))
  }

  ngOnInit(): void {
    this.titleService.title = 'Impressum';
  }

}
