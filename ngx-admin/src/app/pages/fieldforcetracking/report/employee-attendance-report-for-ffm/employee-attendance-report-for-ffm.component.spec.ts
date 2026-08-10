import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAttendanceReportForFFMComponent } from './employee-attendance-report-for-ffm.component';

describe('EmployeeAttendanceReportForFFMComponent', () => {
  let component: EmployeeAttendanceReportForFFMComponent;
  let fixture: ComponentFixture<EmployeeAttendanceReportForFFMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeAttendanceReportForFFMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAttendanceReportForFFMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
