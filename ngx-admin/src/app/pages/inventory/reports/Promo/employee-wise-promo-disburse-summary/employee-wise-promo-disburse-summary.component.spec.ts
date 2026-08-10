import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeWisePromoDisburseSummaryComponent } from './employee-wise-promo-disburse-summary.component';

describe('EmployeeWisePromoDisburseSummaryComponent', () => {
  let component: EmployeeWisePromoDisburseSummaryComponent;
  let fixture: ComponentFixture<EmployeeWisePromoDisburseSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeWisePromoDisburseSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeWisePromoDisburseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
