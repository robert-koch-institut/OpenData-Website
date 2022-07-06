import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private sanatizer: DomSanitizer) {

  }

  transform(value: string, ...args: never[]): SafeHtml {
    return this.sanatizer.bypassSecurityTrustHtml(value);
  }

}
