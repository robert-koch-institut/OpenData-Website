import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import * as _ from 'lodash';
import { OpenDataDatasource } from 'src/app/models/datasource';

@Component({
  selector: 'app-datasource-cite',
  templateUrl: './datasource-cite.component.html',
  styleUrls: ['./datasource-cite.component.scss']
})
export class DatasourceCiteComponent implements OnInit, OnChanges {

  @Input() datasource?: OpenDataDatasource;
  private datePipe = new DatePipe('de');
  citeString: string = '';
  readonly tooltipMessage = 'Zitierangaben in Zwischenablage kopiert';

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.datasource) {
      this.citeString = this.createCiteString();
    }
  }

  ngOnInit(): void {
  }

  showTooltip(tooltip: MatTooltip) {
    tooltip.disabled = false;
    tooltip.show();
    setTimeout(() => {
      tooltip.hide();
      tooltip.disabled = true;
    }, 2000);
  }

  private createCiteString() {
    if (!this.datasource) {
      return '';
    }

    let creatorStr = '';
    if (this.datasource.authors.length >= 4) {
      creatorStr = `${this.datasource.authors[0]}, et al.`;
    } else {
      creatorStr = _.reduce(this.datasource.authors, (prev, curr, i, arr) => {
        const isLast = i === arr.length - 1;
        if (i === 0) {
          prev += curr;
        } else if (isLast) {
          prev += `und ${curr}`
        } else {
          prev += `, ${curr}`
        }
        return prev;
      }, '')
    }

    return `${creatorStr} (${this.datePipe.transform(this.datasource.lastUpdated, 'yyyy')}): ${this.datasource.name}, Berlin:Zenodo. DOI: ${this.datasource.doi}`;
  }

}
