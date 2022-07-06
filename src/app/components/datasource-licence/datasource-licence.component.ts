import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OpenDataDatasource } from 'src/app/models/datasource';

@Component({
  selector: 'app-datasource-licence',
  templateUrl: './datasource-licence.component.html',
  styleUrls: ['./datasource-licence.component.scss']
})
export class DatasourceLicenceComponent implements OnInit, OnChanges {

  @Input() datasource?: OpenDataDatasource;
  @Input() mode?: 'large' | 'small' = 'small'
  licenceUrl = '#';

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.datasource) {
      this.updateLicenceUrl();
    }
  }

  private licenceUrlMap = new Map<string, string>([["cc-by-4.0", "https://creativecommons.org/licenses/by/4.0/deed.de"]]);
  private updateLicenceUrl() {
    let update = "#";
    if (this.datasource) {
      const lowerLicenceId = this.datasource.licence.toLowerCase();
      if (this.licenceUrlMap.has(lowerLicenceId)) {
        update = this.licenceUrlMap.get(lowerLicenceId)!;
      }
    }
    this.licenceUrl = update;
    console.log("UPDATED url", update);
  }

  ngOnInit(): void {
  }

}
