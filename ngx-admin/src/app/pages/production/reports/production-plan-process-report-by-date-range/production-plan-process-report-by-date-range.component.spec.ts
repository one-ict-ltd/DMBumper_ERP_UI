import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPlanProcessReportByDateRangeComponent } from './production-plan-process-report-by-date-range.component';

describe('ProductionPlanProcessReportByDateRangeComponent', () => {
  let component: ProductionPlanProcessReportByDateRangeComponent;
  let fixture: ComponentFixture<ProductionPlanProcessReportByDateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionPlanProcessReportByDateRangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionPlanProcessReportByDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
