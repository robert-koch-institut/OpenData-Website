import { LOCALE_ID, NgModule, SecurityContext } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { CdkScrollableModule } from '@angular/cdk/scrolling'
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DatasourceLayoutItemComponent } from './components/datasource-layout-item/datasource-layout-item.component';
import { DatasourceLayoutComponent } from './components/datasource-layout/datasource-layout.component';
import { PortalModule } from '@angular/cdk/portal';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';
import { LayoutModule } from '@angular/cdk/layout';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { FullscreenOverlayContainer, OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatasourceReadmeComponent } from './components/datasource-readme/datasource-readme.component';
import { MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { DatasourceContentListComponent } from './components/datasource-content-list/datasource-content-list.component';
import { DatasourceContentPreviewComponent } from './components/datasource-content-preview/datasource-content-preview.component';
import { ImagePreviewComponent } from './components/image-preview/image-preview.component';
import { PdfPreviewComponent } from './components/pdf-preview/pdf-preview.component';
import { MarkdownPreviewComponent } from './components/markdown-preview/markdown-preview.component';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { CsvTableComponent } from './components/csv-table/csv-table.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { FormatIfNumberPipe } from './pipes/format-if-number.pipe';
import { APP_BASE_HREF, PlatformLocation, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { de } from 'date-fns/locale';
import { DatasourceCiteComponent } from './components/datasource-cite/datasource-cite.component';
import { DatasourceLicenceComponent } from './components/datasource-licence/datasource-licence.component';
import { DatasourceTagsComponent } from './components/datasource-tags/datasource-tags.component';
import { DatasourceContributorListComponent } from './components/datasource-contributor-list/datasource-contributor-list.component';
import { HttpClientModule } from '@angular/common/http';
import { AfterComponentInitDirective } from './directives/after-component-init.directive';
import { FileDownloadComponent } from './components/file-download/file-download.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge'
import { ContributorRoleLabelPipe } from './pipes/contributor-role-label.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MtxSliderModule } from '@ng-matero/extensions/slider';
import { MatRadioModule } from '@angular/material/radio';
import { AppRoutingModule } from './app-routing.module';
import { DatasourceContentPageComponent } from './pages/datasource-content-page/datasource-content-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { EmbedPageComponent } from './pages/embed-page/embed-page.component';
import { DatasourceCardComponent } from './components/datasource-card/datasource-card.component';
import { DatasourceLinksComponent } from './components/datasource-links/datasource-links.component';
import { BaseHrefPipe } from './pipes/base-href.pipe';
import { TableOfContentComponent } from './components/table-of-content/table-of-content.component';
import { MatListModule } from '@angular/material/list';
import { KeepInViewComponent } from './components/keep-in-view/keep-in-view.component';
import { ExtentionToIconnamePipe } from './pipes/extention-to-iconname';
import { DatasourceContentExtPipe } from './pipes/datasource-content-ext.pipe';
import { FilenameBeautifyPipe } from './pipes/filename-beautify.pipe';
import { JsonPreviewComponent } from './components/json-preview/json-preview.component';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { ImprintComponent } from './pages/imprint-page/imprint-page.component';
import { PrivacyComponent } from './pages/privacy-page/privacy-page.component';
import { FileSizePipe } from './pipes/file-size.pipe';
import { CsvTableFilterComponent } from './components/csv-table-filter/csv-table-filter.component';
import { DateFnsAdapter, DateFnsModule, MAT_DATE_FNS_FORMATS } from '@angular/material-date-fns-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

registerLocaleData(localeDe, 'de');

function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  // renderer.blockquote = (text: string) => {
  //   return '<blockquote class="blockquote"><p>' + text + '</p></blockquote>';
  // };
  renderer.link = (href: any, title: any, text: any) => {
    return `<a href="${href}" ${title === null ? '' : 'title="' + title + '"'} target="_blank">${text}</a>`;
  }

  return {
    renderer: renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
    smartLists: true,
    smartypants: false,
  };
}

function getBaseHref(platformLocation: PlatformLocation): string {
  return platformLocation.getBaseHrefFromDOM();
}

@NgModule({
  declarations: [
    AppComponent,
    DatasourceLayoutComponent,
    DatasourceLayoutItemComponent,
    DatasourceReadmeComponent,
    DatasourceContentListComponent,
    DatasourceContentPreviewComponent,
    ImagePreviewComponent,
    PdfPreviewComponent,
    MarkdownPreviewComponent,
    LoadingIndicatorComponent,
    CsvTableComponent,
    SafeHtmlPipe,
    ContributorRoleLabelPipe,
    FormatIfNumberPipe,
    DatasourceCiteComponent,
    DatasourceLicenceComponent,
    DatasourceTagsComponent,
    AfterComponentInitDirective,
    DatasourceContributorListComponent,
    FileDownloadComponent,
    DatasourceContentPageComponent,
    HomePageComponent,
    EmbedPageComponent,
    DatasourceCardComponent,
    DatasourceLinksComponent,
    BaseHrefPipe,
    TableOfContentComponent,
    KeepInViewComponent,
    ExtentionToIconnamePipe,
    DatasourceContentExtPipe,
    FilenameBeautifyPipe,
    JsonPreviewComponent,
    ImprintComponent,
    PrivacyComponent,
    FileSizePipe,
    CsvTableFilterComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    DateFnsModule,
    LayoutModule,
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE,
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptionsFactory,
      },
    }),
    MatProgressSpinnerModule,
    PdfViewerModule,
    MatListModule,
    MatIconModule,
    MatTreeModule,
    MatBadgeModule,
    MatDatepickerModule,
    MatRadioModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    ClipboardModule,
    CdkTreeModule,
    HighlightModule,
    MatMenuModule,
    ScrollingModule,
    MtxSliderModule,
    MatFormFieldModule,
    OverlayModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatCardModule,
    MatInputModule,
    MatSortModule,
    CdkScrollableModule,
    MatChipsModule,
    TableVirtualScrollModule,
    MatToolbarModule,
    PortalModule,
    NgxPageScrollCoreModule,
    AppRoutingModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'de' },
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
    { provide: DateAdapter, useClass: DateFnsAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FNS_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: de },
    { provide: APP_BASE_HREF, useFactory: getBaseHref, deps: [PlatformLocation] },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
