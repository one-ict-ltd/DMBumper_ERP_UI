import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeApprovalMatrixComponent } from './employee-approval-matrix.component';

describe('EmployeeApprovalMatrixComponent', () => {
  let component: EmployeeApprovalMatrixComponent;
  let fixture: ComponentFixture<EmployeeApprovalMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeApprovalMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeApprovalMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
