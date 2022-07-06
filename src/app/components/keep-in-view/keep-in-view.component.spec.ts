import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeepInViewComponent } from './keep-in-view.component';

describe('KeepInViewComponent', () => {
  let component: KeepInViewComponent;
  let fixture: ComponentFixture<KeepInViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeepInViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeepInViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
