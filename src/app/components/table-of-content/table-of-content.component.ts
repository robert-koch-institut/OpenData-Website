import { OpenDataDatasource } from 'src/app/models/datasource';
import * as _ from 'lodash';
import { DOCUMENT } from '@angular/common';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ArrayDataSource } from '@angular/cdk/collections';
import { MarkdownService } from 'ngx-markdown';
import { Component, OnInit, OnChanges, AfterViewInit, Input, ViewChildren, QueryList, ElementRef, Renderer2, Inject, SimpleChanges, HostListener } from '@angular/core';

interface TocItem {
  fragment: string;
  label: string;
  level: number;
  children: TocItem[];
  active: boolean;
}

@Component({
  selector: 'app-table-of-content',
  templateUrl: './table-of-content.component.html',
  styleUrls: ['./table-of-content.component.scss']
})
export class TableOfContentComponent implements OnInit, OnChanges, AfterViewInit, OnInit {


  @Input() scrollContainerSelector?: string;
  @Input() datasource?: OpenDataDatasource;
  @ViewChildren('tocItem') tocElements?: QueryList<ElementRef>;
  private activeElement?: HTMLElement;
  private tocItems: TocItem[] = [];

  constructor(private renderer: Renderer2, private markdownService: MarkdownService, @Inject(DOCUMENT) private document: any) {
  }

  ngAfterViewInit(): void {
    if (this.tocElements && this.tocElements.length > 0) {
      // this.activateElement(this.tocElements.first.nativeElement);
    }
  }

  // private _transformer = (node: TocItem, level: number) => {
  //   return {
  //     expandable: !!node.children && node.children.length > 0,
  //     name: node.name,
  //     level: level,
  //   };
  // };

  // treeControl = new FlatTreeControl<TocItem>(
  //   node => node.level,
  //   node => node.level === 2,
  // );

  // treeFlattener = new MatTreeFlattener(
  //   this._transformer,
  //   node => node.level,
  //   node => node.expandable,
  //   node => node.children,
  // );

  treeDataSource = new ArrayDataSource<TocItem>([]);
  treeControl = new NestedTreeControl<TocItem>(node => node.children);
  // dataSource = new ArrayDataSource(TREE_DATA);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.datasource) {
      this.updateTocItems();
    }
  }

  ngOnInit(): void {
    this.updateTocItems();
    // this.treeDataSource = new ArrayDataSource(this.createDocumentationTocItems());
  }

  hasChild = (_: number, node: TocItem) => node.children.length > 0;

  private readonly h2RegEx = /<h(?<level>[23]+) id="(?<fragment>.*)">(?<title>.*)<\/h[23]+>/g;
  private createDocumentationTocItems() {
    const result: TocItem[] = [];
    if (this.datasource) {
      const compiled = this.markdownService.parse(this.datasource.readme);
      let parent: TocItem | null = null;

      let match = this.h2RegEx.exec(compiled);
      do {
        if (match && match.groups && match.groups.title && match.groups.fragment && match.groups.level) {
          const level = parseInt(match.groups.level);
          if (level === 2) {
            if (parent !== null) {
              result.push(parent);
            }
            parent = { label: match.groups.title, fragment: match.groups.fragment, level, children: [], active: false }
          }
          else {
            parent?.children.push({ label: match.groups.title, fragment: match.groups.fragment, level, children: [], active: false });
          }
        }
      } while ((match = this.h2RegEx.exec(compiled)) !== null);
    }
    return result;
  }

  private updateTocItems() {
    this.tocItems = this.createDocumentationTocItems();
    this.treeDataSource = new ArrayDataSource(this.tocItems);
    this.activateFirstItem();
  }

  @HostListener('window:scroll', ['$event.target'])
  onWindowScrolled(eventTarget: any) {
    const scrollContainer = eventTarget.scrollingElement;
    this.tocItems.forEach(x => {
      x.active = false;
      this.treeControl.collapse(x);
      x.children.forEach(c => {
        c.active = false;
        this.treeControl.collapse(c);
      });
    });

    const foundH2 = _.findLast(this.tocItems, h2 => {
      const targetElement = scrollContainer.querySelector(`#${decodeURIComponent(h2.fragment)}`)
      return Math.floor(targetElement.getBoundingClientRect().top) <= 0;
    });

    if (foundH2) {
      this.activateTocItem(foundH2);

      const foundH3 = _.findLast(foundH2.children, h3 => {
        const targetElement = scrollContainer.querySelector(`#${decodeURIComponent(h3.fragment)}`)
        return Math.floor(targetElement.getBoundingClientRect().top) <= 0;
      });

      if (foundH3) {
        foundH3.active = true;
      }
    }

    this.activateFirstItem();
  }

  private activateFirstItem() {
    if (this.tocItems.length > 0 && !this.tocItems.some(x => x.active)) {
      this.activateTocItem(this.tocItems[0]);
    }
  }

  private activateTocItem(item: TocItem) {
    item.active = true;
    this.treeControl.expand(item);
    this.tocItems.forEach(x => {
      if (x !== item) {
        this.treeControl.collapse(x);
      }
    });
  }

  private isInViewport(ele: any) {
    const rect = ele.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (this.document.documentElement.clientHeight) &&
      rect.right <= (this.document.documentElement.clientWidth)
    );
  };

  // private activateElement(element: HTMLElement) {
  //   console.log("activated", element);
  //   this.activeElement = element;
  //   // element.parentElement?.parentElement
  //   this.renderer.addClass(element, 'active');
  // }

  // private cleanup() {
  //   if (this.activeElement) {
  //     this.renderer.removeClass(this.activeElement, 'active');
  //     this.activeElement = undefined;
  //   }
  // }

}
