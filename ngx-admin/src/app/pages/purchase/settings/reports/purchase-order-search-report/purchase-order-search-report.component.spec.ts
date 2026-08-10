import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderSearchReportComponent } from './purchase-order-search-report.component';

describe('PurchaseOrderSearchReportComponent', () => {
  let component: PurchaseOrderSearchReportComponent;
  let fixture: ComponentFixture<PurchaseOrderSearchReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderSearchReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderSearchReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
