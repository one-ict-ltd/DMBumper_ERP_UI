import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWiseNationalSalesReportComponent } from './product-wise-national-sales-report.component';

describe('ProductWiseNationalSalesReportComponent', () => {
  let component: ProductWiseNationalSalesReportComponent;
  let fixture: ComponentFixture<ProductWiseNationalSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductWiseNationalSalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductWiseNationalSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
