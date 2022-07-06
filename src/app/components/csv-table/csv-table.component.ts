import { DataSource } from '@angular/cdk/collections';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import * as Papa from 'papaparse';
import { AsyncSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

interface TableData {
  columns: string[];
  data: MatTableDataSource<any>;
}

@Component({
  selector: 'app-csv-table',
  templateUrl: './csv-table.component.html',
  styleUrls: ['./csv-table.component.scss']
})
export class CsvTableComponent implements OnInit, OnChanges {

  @Input() csvUrl?: string;
  @Input() isLfs: boolean = false;
  @Input() fileName?: string;

  tableData$?: Observable<TableData>;

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild('tableContainer') tableContainer?: ElementRef;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // this.updateTableData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.csvUrl) {
      this.updateTableData();
    }
  }

  applyFilter = _.debounce((event: Event, tableData: TableData) => {
    const filterValue = (event.target as HTMLInputElement).value;
    tableData.data.filter = filterValue.trim().toLowerCase();
  }, 250);

  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    // this.logTableContainer();
  }

  // logTableContainer() {
  //   console.log('ELEMENTREF', this.tableContainer);
  // }

  private updateTableData() {
    console.log('updateTableData');
    let httpHeaders = new HttpHeaders();
    this.tableData$ = this.parseCsv(this.csvUrl, httpHeaders);//.pipe(delay(100000));
  }

  afterTableInit(data: TableData) {
    console.log("AFTER VIEW INIT", this.sort, data);
    if (this.sort) {
      data.data.sort = this.sort;
    }
  }

  private parseCsv(url?: string, headers?: HttpHeaders): Observable<TableData> {
    console.log('parseCsv', url);
    const emptyResult = { columns: [], data: new TableVirtualScrollDataSource(), isLfs: false, truncated: false };
    if (!url) {
      return of(emptyResult);
    }

    return this.http.get(url, { responseType: 'text', headers, observe: 'response' }).pipe(map(response => {
      console.log("RESP HEADERS", response.headers.keys());
      if (response.body !== null) {
        const parsedCsv = Papa.parse(response.body, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });

        if (parsedCsv.meta.fields) {
          const ds = new TableVirtualScrollDataSource(parsedCsv.data)
          if (this.sort) {
            ds.sort = this.sort;
          }
          return {
            columns: parsedCsv.meta.fields,
            data: ds
          };
        }
      }
      return emptyResult;
    }));
  }

}
