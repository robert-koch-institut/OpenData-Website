import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DatasourceService } from './services/datasource.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly datasource = this.datasourceService.getDatasource();

  constructor(private datasourceService: DatasourceService, private titleService: Title){

  }
  ngOnInit(): void {
    this.titleService.setTitle(`Open RKI - ${this.datasource.name}`);
  }
  
}
