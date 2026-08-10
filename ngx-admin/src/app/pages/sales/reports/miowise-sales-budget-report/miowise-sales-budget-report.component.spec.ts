import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MIOWiseSalesBudgetReportComponent } from './miowise-sales-budget-report.component';

describe('MIOWiseSalesBudgetReportComponent', () => {
  let component: MIOWiseSalesBudgetReportComponent;
  let fixture: ComponentFixture<MIOWiseSalesBudgetReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MIOWiseSalesBudgetReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MIOWiseSalesBudgetReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
