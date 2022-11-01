import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    const i = value === 0 ? 0 : Math.floor(Math.log(value) / Math.log(1024));
    return (value / Math.pow(1024, i)).toFixed(0) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  }

}
