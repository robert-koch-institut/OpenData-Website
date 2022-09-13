import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { of, delay, Observable } from 'rxjs';

@Component({
  selector: 'app-json-preview',
  templateUrl: './json-preview.component.html',
  styleUrls: ['./json-preview.component.scss']
})
export class JsonPreviewComponent implements OnInit, OnChanges {

  @Input() jsonUrl: string = '';
  jsonStr$: Observable<string | null> = of(null); // = of('{"key": "value"}').pipe(delay(10000));
  // json = JSON.parse(this.jsonStr);

  constructor(private http: HttpClient) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.jsonUrl) {
      this.updateJson();
    }
  }

  updateJson() {
    // this.json = '';
    // if (this.jsonUrl) {

    // }
    this.jsonStr$ = this.jsonUrl
      ? this.http.get(this.jsonUrl, { responseType: 'text' as const })
      : of(null);
  }

  ngOnInit(): void {
  }

}
