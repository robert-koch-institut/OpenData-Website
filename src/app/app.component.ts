import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { map, Observable } from 'rxjs';
import { DatasourceService } from './services/datasource.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly datasource = this.datasourceService.getDatasource();
  isSmall$: Observable<boolean>;

  constructor(private datasourceService: DatasourceService, private titleService: Title, private breakpointObs: BreakpointObserver){
    this.isSmall$ = this.breakpointObs.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(map(x => x.matches))
  }
  
  ngOnInit(): void {
    this.titleService.setTitle(`Open RKI - ${this.datasource.name}`);
  }
  
}
