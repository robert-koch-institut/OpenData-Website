import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'filenameBeautify'
})
export class FilenameBeautifyPipe implements PipeTransform {

  transform(filename: string, ...args: unknown[]): string {
    const noExt =   _.initial(filename.split('.'));
    return noExt.join('').split('_').join(' ');
  }

}
