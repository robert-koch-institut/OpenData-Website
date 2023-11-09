import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private _title: string = '';

  constructor(private _ngTitle: Title) { }

  set title(value: string) {
    this._title = value;
    this._ngTitle.setTitle(`RKI Open Data - ${value}`);
  }

  get title(): string {
    return this._title;
  }
}
