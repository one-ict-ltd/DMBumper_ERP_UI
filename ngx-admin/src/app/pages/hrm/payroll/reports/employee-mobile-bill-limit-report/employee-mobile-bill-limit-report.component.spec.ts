import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMobileBillLimitReportComponent } from './employee-mobile-bill-limit-report.component';

describe('EmployeeMobileBillLimitReportComponent', () => {
  let component: EmployeeMobileBillLimitReportComponent;
  let fixture: ComponentFixture<EmployeeMobileBillLimitReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeMobileBillLimitReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMobileBillLimitReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
