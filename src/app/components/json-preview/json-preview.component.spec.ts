import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonPreviewComponent } from './json-preview.component';

describe('JsonPreviewComponent', () => {
  let component: JsonPreviewComponent;
  let fixture: ComponentFixture<JsonPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsonPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
