import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerWiseSalesReportComponent } from './customer-wise-sales-report.component';

describe('CustomerWiseSalesReportComponent', () => {
  let component: CustomerWiseSalesReportComponent;
  let fixture: ComponentFixture<CustomerWiseSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerWiseSalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerWiseSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
