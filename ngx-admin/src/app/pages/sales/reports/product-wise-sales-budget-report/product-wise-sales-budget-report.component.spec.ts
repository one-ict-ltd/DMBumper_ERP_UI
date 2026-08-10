import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWiseSalesBudgetReportComponent } from './product-wise-sales-budget-report.component';

describe('ProductWiseSalesBudgetReportComponent', () => {
  let component: ProductWiseSalesBudgetReportComponent;
  let fixture: ComponentFixture<ProductWiseSalesBudgetReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductWiseSalesBudgetReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductWiseSalesBudgetReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
