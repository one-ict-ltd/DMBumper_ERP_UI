import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePayslipBankComponent } from './employee-payslip-bank.component';

describe('EmployeePayslipBankComponent', () => {
  let component: EmployeePayslipBankComponent;
  let fixture: ComponentFixture<EmployeePayslipBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeePayslipBankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeePayslipBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
