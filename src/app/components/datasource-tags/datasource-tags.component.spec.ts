import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceTagsComponent } from './datasource-tags.component';

describe('DatasourceTagsComponent', () => {
  let component: DatasourceTagsComponent;
  let fixture: ComponentFixture<DatasourceTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasourceTagsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
