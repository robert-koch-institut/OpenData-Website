import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceContributorListComponent } from './datasource-contributor-list.component';

describe('DatasourceContributorListComponent', () => {
  let component: DatasourceContributorListComponent;
  let fixture: ComponentFixture<DatasourceContributorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasourceContributorListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceContributorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
