import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesCollectionFromDispatchV2Component } from './sales-collection-from-dispatch-v2.component';

describe('SalesCollectionFromDispatchV2Component', () => {
  let component: SalesCollectionFromDispatchV2Component;
  let fixture: ComponentFixture<SalesCollectionFromDispatchV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesCollectionFromDispatchV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesCollectionFromDispatchV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
