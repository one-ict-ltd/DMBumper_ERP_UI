import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateSalesInvoiceBySalesOrderComponent } from './generate-sales-invoice-by-sales-order.component';

describe('GenerateSalesInvoiceBySalesOrderComponent', () => {
  let component: GenerateSalesInvoiceBySalesOrderComponent;
  let fixture: ComponentFixture<GenerateSalesInvoiceBySalesOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateSalesInvoiceBySalesOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateSalesInvoiceBySalesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
