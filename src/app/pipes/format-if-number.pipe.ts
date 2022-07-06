import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { isNumber } from 'lodash';

@Pipe({
  name: 'formatIfNumber'
})
export class FormatIfNumberPipe implements PipeTransform {

  private defNumberFormat = new DecimalPipe('de');
  transform(value: any, ...args: any[]): any {
    let colName: string | undefined;
    if (args.length === 1) {
      colName = args[0];
    }

    // console.log("Pipe processing", colName);
    if ((colName === undefined || !this.isIdField(colName)) && isNumber(value)) {
      // console.log("FORMATING");
      return this.defNumberFormat.transform(value);
    }
    // console.log("RAW");
    return value;
  }

  private idFieldPredicates = [
    (field: string) => field.toLowerCase().startsWith('id'),
    (field: string) => field.indexOf('Id') > -1,
  ];

  private isIdField(name: string) {
    return this.idFieldPredicates.some(p => p(name));
  }

}
