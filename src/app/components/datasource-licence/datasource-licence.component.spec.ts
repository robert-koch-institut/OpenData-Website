import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceLicenceComponent } from './datasource-licence.component';

describe('DatasourceLicenceComponent', () => {
  let component: DatasourceLicenceComponent;
  let fixture: ComponentFixture<DatasourceLicenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasourceLicenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
