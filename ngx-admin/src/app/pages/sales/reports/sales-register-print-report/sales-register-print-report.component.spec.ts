import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesRegisterPrintReportComponent } from './sales-register-print-report.component';

describe('SalesRegisterPrintReportComponent', () => {
  let component: SalesRegisterPrintReportComponent;
  let fixture: ComponentFixture<SalesRegisterPrintReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesRegisterPrintReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesRegisterPrintReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
