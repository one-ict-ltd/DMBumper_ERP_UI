import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashInhandReportComponent } from './cash-inhand-report.component';

describe('CashInhandReportComponent', () => {
  let component: CashInhandReportComponent;
  let fixture: ComponentFixture<CashInhandReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashInhandReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashInhandReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
