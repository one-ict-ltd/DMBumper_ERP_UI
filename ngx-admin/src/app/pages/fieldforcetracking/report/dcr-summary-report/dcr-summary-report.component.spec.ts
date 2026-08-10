import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcrSummaryReportComponent } from './dcr-summary-report.component';

describe('DcrSummaryReportComponent', () => {
  let component: DcrSummaryReportComponent;
  let fixture: ComponentFixture<DcrSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DcrSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DcrSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
