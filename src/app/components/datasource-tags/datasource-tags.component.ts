import { Component, Input, OnInit } from '@angular/core';
import { OpenDataDatasource } from 'src/app/models/datasource';

@Component({
  selector: 'app-datasource-tags',
  templateUrl: './datasource-tags.component.html',
  styleUrls: ['./datasource-tags.component.scss']
})
export class DatasourceTagsComponent implements OnInit {
  @Input() datasource?: OpenDataDatasource;
  @Input() amount: number = 10;

  showAll: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
