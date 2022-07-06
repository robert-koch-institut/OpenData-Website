import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, ComponentRef, Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { combineLatest, Observable, of, race, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DatasourceContentPreviewComponent } from '../components/datasource-content-preview/datasource-content-preview.component';
import { DatasourceContent, OpenDataDatasource } from '../models/datasource';

@Injectable({
  providedIn: 'root'
})
export class UiOverlayService {
  private renderer: Renderer2;

  constructor(private overlay: Overlay, @Inject(DOCUMENT) private document: Document, private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
   }

  private previeWRef?: ComponentRef<DatasourceContentPreviewComponent>;


  showContentPreview(datasource: OpenDataDatasource, content: DatasourceContent) {
    this.showPreview(datasource, content);
  }

  private showPreview(datasource: OpenDataDatasource, content: DatasourceContent) {
    if (!this.previeWRef) {
      
      const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();
      const overlayRef = this.overlay.create({
        positionStrategy,
        hasBackdrop: true,
        panelClass: 'overlay-dialog-panel',
        scrollStrategy: this.overlay.scrollStrategies.block(),
        disposeOnNavigation: true,
        // minWidth: '60vw',
        // width: '60vw',
        // minHeight: '80vh',
        // height: '80vh'
      });
      //Then we create a portal to render a component
      const componentPortal = new ComponentPortal(DatasourceContentPreviewComponent);

      // We add a custom CSS class to our overlay
      // this.overlayRef.addPanelClass("example-overlay");

      //We render the portal in the overlay
      this.previeWRef = overlayRef.attach(componentPortal);
      this.renderer.addClass(this.document.body, 'noScroll');

      const subscription = race([overlayRef.backdropClick(), this.previeWRef.instance.close.asObservable()]).subscribe(() => {
        overlayRef.dispose();
        this.previeWRef = undefined;
        this.renderer.removeClass(this.document.body, 'noScroll');
        setTimeout(() => subscription.unsubscribe());
      });
    }
    // this.componentRef.injector.get(ChangeDetectorRef).detectChanges();
    
    this.previeWRef.instance.content = content;
    this.previeWRef.instance.datasource = datasource;
    this.previeWRef.instance.update();

  }

  // private showPreviewTabs(previews: ContentPreview[]) {
  //   if (!this.tabPreviewRef) {
  //     const positionStrategy = this.overlay.position().global().top('64px').centerHorizontally().centerVertically();
  //     const overlayRef = this.overlay.create({
  //       positionStrategy,
  //       hasBackdrop: true,
  //       // backdropClass: 'cdk-overlay-transparent-backdrop',
  //       panelClass: 'my-dialog-panel',
  //       scrollStrategy: this.overlay.scrollStrategies.block(),
  //       disposeOnNavigation: true,
  //       minWidth: '60vw',
  //       width: '60vw',
  //       minHeight: '80vh',
  //       height: '80vh'
  //     });
  //     const subscription = overlayRef.backdropClick().subscribe(x => {
  //       overlayRef.dispose();
  //       this.tabPreviewRef = undefined;
  //       setTimeout(() => subscription.unsubscribe());
  //     });
  //     //Then we create a portal to render a component
  //     const componentPortal = new ComponentPortal(TabPreviewComponent);

  //     // We add a custom CSS class to our overlay
  //     // this.overlayRef.addPanelClass("example-overlay");
  //     //We render the portal in the overlay
  //     this.tabPreviewRef = overlayRef.attach(componentPortal);
  //   }

  //   this.tabPreviewRef.instance.previews = previews;
  //   // this.tabPreviewRef.instance.vegaSpec = content.vegaViz;
  //   this.tabPreviewRef.changeDetectorRef.detectChanges();
  // }

}
