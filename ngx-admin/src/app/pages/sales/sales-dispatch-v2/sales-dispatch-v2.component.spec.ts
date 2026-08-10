import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDispatchV2Component } from './sales-dispatch-v2.component';

describe('SalesDispatchV2Component', () => {
  let component: SalesDispatchV2Component;
  let fixture: ComponentFixture<SalesDispatchV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesDispatchV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesDispatchV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
