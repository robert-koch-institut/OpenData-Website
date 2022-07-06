import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import emojify from 'src/app/util/emojify';

@Component({
  selector: 'app-datasource-readme',
  templateUrl: './datasource-readme.component.html',
  styleUrls: ['./datasource-readme.component.scss']
})
export class DatasourceReadmeComponent implements OnInit, OnChanges {

  @Input() readme?: string;

  parsedReadme?: string;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.readme) {
      this.parsedReadme = emojify.replace(this.readme);
    }
  }

  ngOnInit(): void {
  }

}
