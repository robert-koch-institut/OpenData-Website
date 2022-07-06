import { Component, OnInit } from '@angular/core';
import { DatasourceService } from 'src/app/services/datasource.service';

@Component({
  selector: 'app-datasource-content-page',
  templateUrl: './datasource-content-page.component.html',
  styleUrls: ['./datasource-content-page.component.scss']
})
export class DatasourceContentPageComponent implements OnInit {

  readonly datasource = this.datasourceService.getDatasource();

  constructor(private datasourceService: DatasourceService){
  }
  ngOnInit(): void {
  }

}
