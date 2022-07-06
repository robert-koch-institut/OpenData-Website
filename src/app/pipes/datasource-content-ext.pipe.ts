import { Pipe, PipeTransform } from '@angular/core';
import { DatasourceContent } from '../models/datasource';
import * as _ from 'lodash';

@Pipe({
  name: 'datasourceContentExt'
})
export class DatasourceContentExtPipe implements PipeTransform {

  transform(value: DatasourceContent, ...args: unknown[]): string | undefined {
    return _.last(value.path.toLowerCase().split('.'));
  }
  
}
