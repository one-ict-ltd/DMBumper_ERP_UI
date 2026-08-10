import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MioSalesBudgetReportCompareComponent } from './mio-sales-budget-report-compare.component';

describe('MioSalesBudgetReportCompareComponent', () => {
  let component: MioSalesBudgetReportCompareComponent;
  let fixture: ComponentFixture<MioSalesBudgetReportCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MioSalesBudgetReportCompareComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MioSalesBudgetReportCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
