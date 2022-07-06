import { Component, Input, OnInit } from '@angular/core';
import { ExternalLink, OpenDataDatasource } from 'src/app/models/datasource';
import { BaseHrefPipe } from 'src/app/pipes/base-href.pipe';

@Component({
  selector: 'app-datasource-links',
  templateUrl: './datasource-links.component.html',
  styleUrls: ['./datasource-links.component.scss']
})
export class DatasourceLinksComponent implements OnInit {

  @Input() datasource?: OpenDataDatasource;

  constructor() { }

  ngOnInit(): void {
  }

}
