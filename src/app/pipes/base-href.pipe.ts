import { APP_BASE_HREF } from '@angular/common';
import { Inject, Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'baseHref'
})
export class BaseHrefPipe implements PipeTransform {
  constructor(@Inject(APP_BASE_HREF) private baseHref: string) {

  }

  transform(value: string, ...args: never[]): string {
    return `${_.trimEnd(this.baseHref, '/')}/${_.trim(value, '/')}`;
  }

}
