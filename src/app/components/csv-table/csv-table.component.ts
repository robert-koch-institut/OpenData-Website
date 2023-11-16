import { DataSource } from '@angular/cdk/collections';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { differenceInCalendarDays, isValid, parseISO } from 'date-fns';
import * as _ from 'lodash';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import * as Papa from 'papaparse';
import { AsyncSubject, BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { ROW_COUNT_FILTER_LIMIT } from 'src/app/models/constants';
import { TableData, TableColumn, TableCategoryColumnFilter, TableColumnFilterPredicate, TableColumnFilter, TableNumberColumnFilter, TableDateColumnFilter } from 'src/app/models/table-data';
import { FormatIfNumberPipe } from 'src/app/pipes/format-if-number.pipe';



@Component({
  selector: 'app-csv-table',
  templateUrl: './csv-table.component.html',
  styleUrls: ['./csv-table.component.scss']
})
export class CsvTableComponent implements OnInit, OnChanges {



  @Input() csvUrl?: string;
  @Input() fileName?: string;
  @Input() noParseFields: string[] = [];

  tableData$?: Observable<TableData>;

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild('tableContainer') tableContainer?: ElementRef;

  constructor(private http: HttpClient) { }


  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.csvUrl) {
      this.updateTableData();
    }
  }

  ngAfterViewInit() {
  }

  private updateTableData() {
    let httpHeaders = new HttpHeaders();
    this.tableData$ = this.parseCsv(this.csvUrl, httpHeaders);//.pipe(delay(100000));
  }

  afterTableInit(data: TableData) {
    if (this.sort && data.datasource) {
      data.datasource.sort = this.sort;
    }
  }

  private parseCsv(url?: string, headers?: HttpHeaders): Observable<TableData> {
    const emptyResult = new TableData([], new TableVirtualScrollDataSource());
    if (!url) {
      return of(emptyResult);
    }

    return this.http.get(url, { responseType: 'text', headers, observe: 'response' })
      .pipe(map(response => {
        if (response.body !== null) {
          const parsedCsv = Papa.parse(response.body, {
            header: true,
            dynamicTyping: (field: string | number) => {
              return !this.noParseFields.some(x => x === field)
            },
            skipEmptyLines: true
          });

          if (parsedCsv.meta.fields) {
            const ds = new TableVirtualScrollDataSource(parsedCsv.data)
            if (this.sort) {
              ds.sort = this.sort;
            }

            return new TableData(
              this.createColumns(parsedCsv.meta.fields, parsedCsv.data),
              ds
            );
          }
        }
        return emptyResult;
      }));
  }

  private readonly numberDefaults = { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER };
  private readonly dateDefaults = { min: new Date(4000, 12, 31), max: new Date(0) };
  private createColumns(fields: string[], data: any[]): any {
    if (data.length > ROW_COUNT_FILTER_LIMIT) {
      return fields.map(x => new TableColumn(x));
    }

    const result = _.reduce(data, (prev, curr, i) => {
      _.toPairs(prev).forEach(([field, obj]) => {
        const value = curr[field];
        if (typeof value === 'string') {
          const date = parseISO(value);
          if (isValid(date)) {
            TableDateColumnFilter.createFakeDateField(curr, field, date);

            if (date < obj.date.min) {
              obj.date.min = date;
            }
            if (date > obj.date.max) {
              obj.date.max = date;
            }
          }
          else {
            obj.category.add(value);
          }
        } else if (typeof value === 'number') {
          if (value < obj.number.min) {
            obj.number.min = value;
          }
          if (value > obj.number.max) {
            obj.number.max = value;
          }
        } else if (value === undefined || value === null) {
          obj.hasEmpty = true;
        }
      });
      return prev;
    }, _.fromPairs(fields.map(x => [x, { category: new Set<string>(), number: { ...this.numberDefaults }, date: { ...this.dateDefaults }, hasEmpty: false }])));

    return _.map(result, (x, k) => {
      let filter: TableColumnFilter | undefined = undefined;
      if (x.category.size > 0) {
        filter = new TableCategoryColumnFilter(k, [...x.category.values()])
      } else if (x.number.min !== this.numberDefaults.min && x.number.max !== this.numberDefaults.max) {
        filter = new TableNumberColumnFilter(k, x.number.min, x.number.max);
      }
      else if (x.date.min !== this.dateDefaults.min && x.date.max !== this.dateDefaults.max && differenceInCalendarDays(x.date.max, x.date.min) > 1) {
        filter = new TableDateColumnFilter(k, x.date.min, x.date.max);
      }

      const valueTypePredicates = [
        x.category.size > 0,
        x.number.min !== this.numberDefaults.min && x.number.max !== this.numberDefaults.max,
        x.date.min !== this.dateDefaults.min && x.date.max !== this.dateDefaults.max && differenceInCalendarDays(x.date.max, x.date.min) > 1
      ]
      const valueTypes = valueTypePredicates.filter(x => x);
      if (valueTypes.length > 1) {
        console.warn(`More than one value type detected in field '${k}'.`);
        const categories = _.uniqBy(data, k).map(x => x[k]);
        filter = new TableCategoryColumnFilter(k, categories);
      }

      return new TableColumn(k, filter);
    });
  }

}
