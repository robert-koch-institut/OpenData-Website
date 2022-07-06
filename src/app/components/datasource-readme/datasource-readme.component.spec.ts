import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceReadmeComponent } from './datasource-readme.component';

describe('DatasourceReadmeComponent', () => {
  let component: DatasourceReadmeComponent;
  let fixture: ComponentFixture<DatasourceReadmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasourceReadmeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceReadmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
