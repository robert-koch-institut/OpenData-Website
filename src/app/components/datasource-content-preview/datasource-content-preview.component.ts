import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { DatasourceContent, FileDatasourceContent, OpenDataDatasource } from 'src/app/models/datasource';
import { FileDownloadService } from 'src/app/services/file-download.service';
import { FieldsNotToParse } from 'src/app/models/constants';

@Component({
  selector: 'app-datasource-content-preview',
  templateUrl: './datasource-content-preview.component.html',
  styleUrls: ['./datasource-content-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatasourceContentPreviewComponent implements OnInit, OnChanges {

  @Input() datasource?: OpenDataDatasource;
  @Input() content?: DatasourceContent;

  @Output() close = new EventEmitter<void>(true);


  baseUrl?: string;
  contentPathExt?: string;
  fieldsNotToParse: string[] = [];

  constructor(private downloadService: FileDownloadService) { }


  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update() {
    this.contentPathExt = _.last(this.content?.path.split('.'));
    this.baseUrl = this.datasource
      ? `https://raw.githubusercontent.com/robert-koch-institut/${this.datasource.id}/${this.datasource.branch}`
      : undefined;

    this.fieldsNotToParse = FieldsNotToParse.filter((x: any) => {
      let match = true;
      if (this.datasource && x.hasOwnProperty('datasource')) {
        match = this.datasource.id === x['datasource'];
      }
      if (this.content && x.hasOwnProperty('filename')) {
        match = match && this.content.path === x['filename'];
      }
      return match;
    }).map(x => x.field);
  }

  startDownload(content: FileDatasourceContent) {
    this.downloadService.download(content);
  }

  doClose() {
    this.close.emit();
  }
}
