import { stringify } from '@angular/compiler/src/util';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { Contributor } from 'src/app/models/datasource';

@Component({
  selector: 'app-datasource-contributor-list',
  templateUrl: './datasource-contributor-list.component.html',
  styleUrls: ['./datasource-contributor-list.component.scss']
})
export class DatasourceContributorListComponent implements OnInit, OnChanges {

  @Input() contributors?: Contributor[];
  @Input() authors?: string[];
  // contributorList: { role: string; contributors: string[]; }[] = [];
  showRole?: Contributor;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.contributors) {
    //   this.updateContributorList();
    // }
  }
  // private updateContributorList() {
  //   let list: { role: string, contributors: string[] }[] = [];
  //   if (this.contributors) {
  //     list = _.map(_.groupBy(this.contributors, x => x.role), (x, k) => {
  //       return { role: k, contributors: _.orderBy(x.map(c => c.name), c => c)  };
  //     });
  //   }
  //   this.contributorList = _.orderBy(list, x => x.role);
  // }

  ngOnInit(): void {
  }

}
