import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalProductSalesReportComponent } from './national-product-sales-report.component';

describe('NationalProductSalesReportComponent', () => {
  let component: NationalProductSalesReportComponent;
  let fixture: ComponentFixture<NationalProductSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NationalProductSalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NationalProductSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
