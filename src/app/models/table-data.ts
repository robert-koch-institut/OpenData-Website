import { MatTableDataSource } from "@angular/material/table";
import { compareAsc, formatISO, parseISO } from "date-fns";
import * as _ from 'lodash';

export interface TableColumnFilter {
    getPredicate(): TableColumnFilterPredicate;
    get isActive(): boolean;
    get label(): string | undefined;
    clear(): void;
}
export type TableColumnFilterPredicate = (data: any) => boolean;

export class TableCategoryColumnFilter implements TableColumnFilter {
    categories: { value: string, checked: boolean }[] = [];

    constructor(private field: string, categories: string[] = []) {
        this.categories = _.sortBy(categories, x => x).map(x => ({ value: x, checked: true }));
    }

    get checkedCategories() {
        return this.categories.filter(x => x.checked);
    }
    get isActive(): boolean {
        return this.checkedCategories.length !== this.categories.length;
    }
    get label(): string | undefined {
        const checkedCategories = this.checkedCategories;
        if (this.checkedCategories.length !== this.categories.length) return checkedCategories.length.toString();
        return undefined;
    }

    clear() {
        this.checkAllCategories();
    }

    checkAllCategories() {
        this.categories.forEach(x => x.checked = true);
    }

    uncheckAllCategories() {
        this.categories.forEach(x => x.checked = false);
    }

    getPredicate(): TableColumnFilterPredicate {
        const checkedCategories = this.checkedCategories;
        if (checkedCategories.length === this.categories.length) {
            return () => true;
        }
        if (checkedCategories.length === 0) {
            return () => false;
        }
        return (data) => checkedCategories.some(category => category.value === data[this.field]);
    };
}

export class TableNumberColumnFilter implements TableColumnFilter {
    value?: number | [number, number];
    constructor(public field: string, public min: number, public max: number) {
    }

    get isActive(): boolean {
        const isArrayDefault = () => Array.isArray(this.value) && this.min !== this.value[0] && this.max !== this.value[1];
        return this.value !== undefined && !isArrayDefault();
    }

    get label(): string | undefined {
        if (this.value === undefined) return undefined;
        if (typeof this.value === 'number') return this.value.toString();
        if (Array.isArray(this.value) && this.value.length >= 2) return `${this.value[0]} - ${this.value[1]}`;
        return '';
    }

    getPredicate(): TableColumnFilterPredicate {
        if (this.value === undefined) return () => true;
        if (typeof this.value === 'number') return (data) => data[this.field] === this.value!;

        const valueArray = this.value;
        return (data) => data[this.field] >= valueArray[0] && data[this.field] <= valueArray[1];
    };

    clear() {
        this.value = undefined;
    }
}

export class TableDateColumnFilter implements TableColumnFilter {
    static fakeDateFieldName(field: string) {
        return `$_fakeDate.${field}`;
    }

    static createFakeDateField(curr: any, field: string, date: Date) {
        curr[this.fakeDateFieldName(field)] = date;
    }

    private readonly isoFormatConfig = { representation: 'date' as const };
    value?: Date | [Date, Date];

    private fakeField: string;
    constructor(public field: string, public min: Date, public max: Date) {
        this.fakeField = TableDateColumnFilter.fakeDateFieldName(field);
    }

    get isActive(): boolean {
        const isArrayDefault = () => Array.isArray(this.value) && this.min !== this.value[0] && this.max !== this.value[1];
        return this.value !== undefined && !isArrayDefault();
    }

    get label(): string | undefined {
        if (this.value === undefined) return undefined;
        if (Array.isArray(this.value) && this.value.length >= 2) return `${formatISO(this.value[0], this.isoFormatConfig)} - ${formatISO(this.value[1], this.isoFormatConfig)}`;
        if (this.value instanceof Date) return formatISO(this.value, this.isoFormatConfig);
        return '';
    }

    getPredicate(): TableColumnFilterPredicate {
        if (this.value === undefined) return () => true;
        if (this.value instanceof Date) return (data) => compareAsc(data[this.fakeField], this.value as Date) === 0;

        const valueArray = this.value;
        return (data) => {
            const date = data[this.fakeField];
            return compareAsc(date, valueArray[0]) !== -1 && compareAsc(date, valueArray[1]) !== 1;
        };
    };

    clear() {
        this.value = undefined;
    }
}

export class TableColumn {
    constructor(public field: string, public filter?: TableColumnFilter) {
    }
}

export class TableData {
    get fields() {
        return this.columns.map(x => x.field);
    }

    get anyActiveFilter() {
        return this.columns.some(x => x.filter && x.filter.isActive);
    }

    get filterRowCount() {
        return this.datasource.filteredData.length;
    }

    get rowCount() {
        return this.datasource.data.length;
    }


    constructor(public columns: TableColumn[], public datasource: MatTableDataSource<any>) {
    }

    updateFilter() {
        const predicates = this.columns.filter(x => x.filter).map(x => x.filter!.getPredicate());
        this.datasource.filterPredicate = x => {
            return predicates.every(p => p(x));
        }
        this.datasource.filter = 'dummy';// _.random().toString();
    }

    clearFilter() {
        this.columns.forEach(c => c.filter?.clear());
        this.updateFilter();
    }
}