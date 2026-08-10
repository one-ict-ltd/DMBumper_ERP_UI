import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptScheduleReportComponent } from './rpt-schedule-report.component';

describe('RptScheduleReportComponent', () => {
  let component: RptScheduleReportComponent;
  let fixture: ComponentFixture<RptScheduleReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RptScheduleReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RptScheduleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
