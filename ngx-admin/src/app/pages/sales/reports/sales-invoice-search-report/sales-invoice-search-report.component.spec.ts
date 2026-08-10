import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesInvoiceSearchReportComponent } from './sales-invoice-search-report.component';

describe('SalesInvoiceSearchReportComponent', () => {
  let component: SalesInvoiceSearchReportComponent;
  let fixture: ComponentFixture<SalesInvoiceSearchReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesInvoiceSearchReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesInvoiceSearchReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
