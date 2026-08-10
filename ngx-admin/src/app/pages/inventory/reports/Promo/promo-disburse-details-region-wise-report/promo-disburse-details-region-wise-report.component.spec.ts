import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoDisburseDetailsRegionWiseReportComponent } from './promo-disburse-details-region-wise-report.component';

describe('PromoDisburseDetailsRegionWiseReportComponent', () => {
  let component: PromoDisburseDetailsRegionWiseReportComponent;
  let fixture: ComponentFixture<PromoDisburseDetailsRegionWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromoDisburseDetailsRegionWiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoDisburseDetailsRegionWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
