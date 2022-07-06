import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceLinksComponent } from './datasource-links.component';

describe('DatasourceLinksComponent', () => {
  let component: DatasourceLinksComponent;
  let fixture: ComponentFixture<DatasourceLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasourceLinksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
