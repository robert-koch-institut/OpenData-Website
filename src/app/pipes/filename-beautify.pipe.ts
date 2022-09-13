import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'filenameBeautify'
})
export class FilenameBeautifyPipe implements PipeTransform {

  transform(filename: string, ...args: unknown[]): string {
    const splited = filename.split('.').filter(x => x);
    const noExt = _.head(splited) || '';
    return noExt.split('_').join(' ');
  }

}
