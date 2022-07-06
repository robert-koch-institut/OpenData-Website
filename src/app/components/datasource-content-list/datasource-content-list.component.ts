import { NestedTreeControl } from '@angular/cdk/tree';
import { TrackByFunction } from '@angular/core';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import * as _ from 'lodash';
import { DatasourceContent, FileDatasourceContent, OpenDataDatasource } from 'src/app/models/datasource';
import { FileDownloadService } from 'src/app/services/file-download.service';
import { UiOverlayService } from 'src/app/services/ui-overlay.service';
import { DatasourceHelper } from 'src/app/util/datasource-helper';

@Component({
  selector: 'app-datasource-content-list',
  templateUrl: './datasource-content-list.component.html',
  styleUrls: ['./datasource-content-list.component.scss']
})
export class DatasourceContentListComponent implements OnInit, OnChanges {

  @Input() datasource?: OpenDataDatasource;

  treeControl = new NestedTreeControl<DatasourceContent>(node => node.$type === 'folder' ? DatasourceHelper.orderContent(node.content) : undefined);
  treeDatasource = new MatTreeNestedDataSource<DatasourceContent>();
  trackBy: TrackByFunction<DatasourceContent> = (index, node) => node.path;

  // datasourceContent?: DatasourceContent[];

  constructor(private overlayService: UiOverlayService, private downloadService: FileDownloadService) {

  }



  ngOnChanges(changes: SimpleChanges): void {
    if (changes.datasource) {
      this.treeDatasource.data = this.datasource === undefined ? [] : DatasourceHelper.orderContent(this.datasource.content);
    }
  }

  hasChild = (_: number, node: DatasourceContent) => node.$type === 'folder' && node.content.length > 0;

  

  ngOnInit(): void {
  }


  startDownload(content: FileDatasourceContent) {
    this.downloadService.download(content);
  }

  showPreview(content: DatasourceContent) {
    if (this.datasource) {
      this.overlayService.showContentPreview(this.datasource, content);
    }
  }

  trackByPath(i: number, file: DatasourceContent) {
    return file.path;
  }

  // downloadFile(content: DatasourceContent) {
  //   this.onDownload.next(content);
  // }


}
