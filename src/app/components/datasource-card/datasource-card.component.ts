import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OpenDataDatasource } from 'src/app/models/datasource';

@Component({
  selector: 'app-datasource-card',
  templateUrl: './datasource-card.component.html',
  styleUrls: ['./datasource-card.component.scss']
})
export class DatasourceCardComponent implements OnInit {

  @Input() datasource?: OpenDataDatasource;
  // @Output() onShowPreview: EventEmitter<DatasourceContent> = new EventEmitter<DatasourceContent>();
  // @Output() onDownload: EventEmitter<DatasourceContent> = new EventEmitter<DatasourceContent>();
  // download$?: Observable<string>;

  constructor() { }

  ngOnInit(): void {
  }

}
