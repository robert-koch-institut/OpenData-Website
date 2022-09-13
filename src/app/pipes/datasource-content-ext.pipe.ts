import { Pipe, PipeTransform } from '@angular/core';
import { DatasourceContent } from '../models/datasource';
import * as _ from 'lodash';

@Pipe({
  name: 'datasourceContentExt'
})
export class DatasourceContentExtPipe implements PipeTransform {

  transform(filename: string, ...args: unknown[]): string | undefined {
    const splited = filename.split('.').filter(x => x);
    return _.tail(splited).join('.');
  }
  
}
