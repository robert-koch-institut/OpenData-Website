import { Pipe, PipeTransform } from '@angular/core';
import { DatasourceContent, FileDatasourceContent, FolderDatasourceContent } from '../models/datasource';
import * as _ from 'lodash';

@Pipe({
  name: 'extToIconname'
})
export class ExtentionToIconnamePipe implements PipeTransform {

  transform(value: string | undefined, ...args: unknown[]): string {
    switch (value) {
      case 'csv': return 'leaderboard';
      case 'json': return 'leaderboard';
      case 'md': return 'text_snippet';
      case 'pdf': return 'text_snippet';
      case 'xz': return 'compress';
    }

    return 'note';
  }

}
