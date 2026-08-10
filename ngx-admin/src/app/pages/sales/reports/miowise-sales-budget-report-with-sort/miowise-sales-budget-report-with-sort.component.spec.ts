import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MIOWiseSalesBudgetReportWithSortComponent } from './miowise-sales-budget-report-with-sort.component';

describe('MIOWiseSalesBudgetReportWithSortComponent', () => {
  let component: MIOWiseSalesBudgetReportWithSortComponent;
  let fixture: ComponentFixture<MIOWiseSalesBudgetReportWithSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MIOWiseSalesBudgetReportWithSortComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MIOWiseSalesBudgetReportWithSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
