import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceCiteComponent } from './datasource-cite.component';

describe('DatasourceCiteComponent', () => {
  let component: DatasourceCiteComponent;
  let fixture: ComponentFixture<DatasourceCiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasourceCiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceCiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
