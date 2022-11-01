import { BlockScrollStrategy, CdkOverlayOrigin, Overlay, ScrollStrategy } from '@angular/cdk/overlay';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatSelectionListChange } from '@angular/material/list';
import { timeStamp } from 'console';
import { TableCategoryColumnFilter, TableColumnFilter, TableColumnFilterPredicate, TableDateColumnFilter, TableNumberColumnFilter } from 'src/app/models/table-data';

@Component({
  selector: 'app-csv-table-filter',
  templateUrl: './csv-table-filter.component.html',
  styleUrls: ['./csv-table-filter.component.scss']
})
export class CsvTableFilterComponent implements OnInit {

  @Input() filter?: TableColumnFilter;
  @Output() onColumnFilterChanged = new EventEmitter<TableColumnFilterPredicate>();

  isOpen = false;
  scrollStrat: ScrollStrategy;

  // scrollStrat = new BlockScrollStrategy();

  get tableCategoryFilter() {
    return this.filter && this.filter instanceof TableCategoryColumnFilter && this.filter as TableCategoryColumnFilter;
  }

  get tableNumberFilter() {
    return this.filter && this.filter instanceof TableNumberColumnFilter && this.filter as TableNumberColumnFilter;
  }

  get tableDateFilter() {
    return this.filter && this.filter instanceof TableDateColumnFilter && this.filter as TableDateColumnFilter;
  }

  constructor(private overlay: Overlay) {
    this.scrollStrat = this.overlay.scrollStrategies.close();
  }

  ngOnInit(): void {

  }

  private allParents(element: HTMLElement) {
    const parents: HTMLElement[] = [];
    let elem = element;
    while (elem.parentElement) {
      parents.push(elem.parentElement);
      elem = elem.parentElement;
    }
    return parents;
  }

  onOverlayOutsideClick(event: MouseEvent, trigger: CdkOverlayOrigin, overlay: any) {
    console.log("OVERLAY", overlay);
    const htmlTarget = event.target as HTMLElement;
    if (htmlTarget) {
      const parents = this.allParents(htmlTarget);
      console.log("CLICK", event, trigger, parents);
      if (parents.every(p => p !== trigger.elementRef.nativeElement && !p.classList.contains('mat-datepicker-popup'))) {
        this.isOpen = false;
      }
    }
  }

  // ### START CategoryFilter

  categoryValue(index: number, item: any) {
    return item.value;
  }

  get searchEnabled() { return this.tableCategoryFilter && this.tableCategoryFilter.categories.length > 10 };
  searchText: string = '';
  searchResult?: { value: string; checked: boolean; }[];

  search(value: string) {
    if (this.tableCategoryFilter) {
      this.searchResult = this.tableCategoryFilter.categories.filter(x => x.value.toLowerCase().indexOf(value.toLowerCase()) >= 0);
    }
  }
  clearSearch() {
    this.searchText = '';
    this.searchResult = undefined;
  }

  selectAllChanged(event: MatCheckboxChange) {
    console.log("all changed", event);
    if (this.tableCategoryFilter) {
      if (event.checked) {
        this.tableCategoryFilter.checkAllCategories();
      } else {
        this.tableCategoryFilter.uncheckAllCategories();
      }
      this.onColumnFilterChanged.emit(this.tableCategoryFilter.getPredicate());
    }
  }

  onSelectionListChange(event: MatSelectionListChange) {
    if (this.tableCategoryFilter) {
      event.options.forEach(x => x.value.checked = x.selected);
      this.onColumnFilterChanged.emit(this.tableCategoryFilter.getPredicate());
    }
  }

  // ### END CategoryFilter

  // ### START NumberFilter

  Math = Math;

  get isValueNumberFilter() {
    return this.tableNumberFilter && typeof this.tableNumberFilter.value === 'number';
  }

  get isRangeNumberFilter() {
    return this.tableNumberFilter && Array.isArray(this.tableNumberFilter.value);
  }

  get rangeNumberFilterValue() {
    if (this.tableNumberFilter && Array.isArray(this.tableNumberFilter.value)) return this.tableNumberFilter.value;
    return [0, 0];
  }

  get isSmallRange() {
    return this.tableNumberFilter && ((this.tableNumberFilter.max - this.tableNumberFilter.min) < 1000);
  }

  changeNumberValue(value?: number | [number, number]) {
    if (this.tableNumberFilter) {
      this.tableNumberFilter.value = value;
      this.onColumnFilterChanged.emit(this.tableNumberFilter.getPredicate());
    }
  }

  // ### END NumberFilter

  // ### START DateFilter

  // dateRange: FormGroup = new FormGroup({
  //   start: new FormControl<Date | null>(this.tableDateFilter ? this.tableDateFilter.min : new Date()),
  //   end: new FormControl<Date | null>(this.tableDateFilter ? this.tableDateFilter.max : new Date()),
  // });

  get isValueDateFilter() {
    return this.tableDateFilter && this.tableDateFilter.value instanceof Date;
  }

  get isRangeDateFilter() {
    return this.tableDateFilter && Array.isArray(this.tableDateFilter.value);
  }

  get rangeDateFilterValue() {
    if (this.tableDateFilter && Array.isArray(this.tableDateFilter.value)) return this.tableDateFilter.value;
    return [new Date(), new Date()];
  }

  changeDateValue(value?: Date | [Date, Date]) {
    if (this.tableDateFilter) {
      this.tableDateFilter.value = value;
      this.onColumnFilterChanged.emit(this.tableDateFilter.getPredicate());
    }
  }

  changeDateRange(index: 0 | 1, value: Date) {
    if (this.tableDateFilter && Array.isArray(this.tableDateFilter.value)) {
      const newValue: [Date, Date] = [index === 0 ? value : this.tableDateFilter.value[0], index === 1 ? value : this.tableDateFilter.value[1]];
      this.tableDateFilter.value = newValue;
      this.onColumnFilterChanged.emit(this.tableDateFilter.getPredicate());
    }
  }

  onDateChange(a: string, event: any) {
    console.log("DATE CHANGE", a, event);
  }

  // ### END DateFilter
}
