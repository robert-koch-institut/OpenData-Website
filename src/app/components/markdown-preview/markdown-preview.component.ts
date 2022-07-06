import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { removeHtmlTags, replaceRelativeRootUrls } from "src/app/util/md-helpers";
import { map, switchMap } from 'rxjs/operators';
import emojify from 'src/app/util/emojify';
import * as _ from 'lodash';
// import emojify from 'emojify.js';


@Component({
  selector: 'app-markdown-preview',
  templateUrl: './markdown-preview.component.html',
  styleUrls: ['./markdown-preview.component.scss']
})
export class MarkdownPreviewComponent implements OnInit, OnChanges {

  @Input() url?: string;
  @Input() baseUrl?: string;
  // @Output() done: EventEmitter<void> = new EventEmitter<void>();
  // isLoading: boolean = true;
  mdData$: Observable<string | undefined>;

  private url$ = new BehaviorSubject<string | undefined>(undefined);

  constructor(private http: HttpClient) {
    // this.markdownService.renderer.image = (href, title, text) => {
    //   if (href !== null && this.baseUrl !== undefined) {
    //     href = href.startsWith('/') ? `${this.baseUrl}${href}` : href;
    //   }
    //   return `<img src="${href}" alt="${text}" ${title === null ? '' : 'title="' + title + '"'} >`
    // }

    this.mdData$ = this.url$.pipe(switchMap(x => {
      if (x === undefined) return of(undefined);

      return this.http.get(x, { responseType: 'text' })
        .pipe(map(md => {
          // console.log("loaded md", md);
          md = removeHtmlTags(md, ['font']);
          if (this.baseUrl) {
            md = replaceRelativeRootUrls(md, this.baseUrl);
          }
          return  emojify.replace(md);
        }));
    }))
  }




  ngOnChanges(changes: SimpleChanges): void {
    // console.log("MARKDOWNPREVIEW :: Changes", changes);
    if (changes.url) {
      this.url$.next(changes.url.currentValue);
    }

  }

  ngOnInit(): void {
    // console.log("MARKDOWNPREVIEW :: Init", this.url);
  }

  // private removeHtmlTags(content: string, tags: string[]) {
  //   return _.reduce(tags, (prev, curr) => {
  //     const regEx = new RegExp(`\<${curr}.*?\>(?<inner>.+?)\<\/${curr}\>`, 'gs');
  //     // const c = regEx.exec(prev);
  //     return prev.replace(regEx, '$<inner>');
  //     // return a;
  //     // return prev;
  //   }, content);


  // }

  // private replaceRelativeGithubUrls(content: string, baseUrl: string) {
  //   const figureUrlRegEx = /!\[(?<title>.*?)\]\((?<url>\/.*?)\)/gs;
  //   return content.replace(figureUrlRegEx, `![$<title>](${baseUrl}$<url>)`);
  //   // return content;
  // }

  // onLoad(event: any) {
  //   // this.isLoading = false;
  //   this.done.emit();
  //   // console.log("MARKDOWN Load!", event);
  // }

  // onError(event: any) {
  //   // this.isLoading = false;
  //   this.done.emit();
  //   // console.log("MARKDOWN Error!", event);
  // }

}
