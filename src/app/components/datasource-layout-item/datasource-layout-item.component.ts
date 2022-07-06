import { TemplatePortal } from '@angular/cdk/portal';
import { Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DatasourceLayoutItemPosition } from '../datasource-layout/datasource-layout.component';



@Component({
  selector: 'app-datasource-layout-item',
  templateUrl: './datasource-layout-item.component.html',
  styleUrls: ['./datasource-layout-item.component.scss']
})
export class DatasourceLayoutItemComponent implements OnInit {

  @ViewChild(TemplateRef, { static: true }) _implicitContent: TemplateRef<any> | null = null;

  @Input() position: DatasourceLayoutItemPosition = 'abstract';

  private _contentPortal: TemplatePortal | null = null;

  get content(): TemplatePortal | null {
    return this._contentPortal;
  }

  constructor(private _viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    this._contentPortal = this._implicitContent && new TemplatePortal(this._implicitContent, this._viewContainerRef);
  }
}
