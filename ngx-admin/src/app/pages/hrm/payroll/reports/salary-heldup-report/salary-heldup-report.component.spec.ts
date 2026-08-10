import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryHeldupReportComponent } from './salary-heldup-report.component';

describe('SalaryHeldupReportComponent', () => {
  let component: SalaryHeldupReportComponent;
  let fixture: ComponentFixture<SalaryHeldupReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryHeldupReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryHeldupReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
