import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvTableFilterComponent } from './csv-table-filter.component';

describe('CsvTableFilterComponent', () => {
  let component: CsvTableFilterComponent;
  let fixture: ComponentFixture<CsvTableFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsvTableFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvTableFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
