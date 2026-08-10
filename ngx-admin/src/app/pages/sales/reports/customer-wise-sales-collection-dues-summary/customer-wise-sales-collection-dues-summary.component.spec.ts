import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerWiseSalesCollectionDuesSummaryComponent } from './customer-wise-sales-collection-dues-summary.component';

describe('CustomerWiseSalesCollectionDuesSummaryComponent', () => {
  let component: CustomerWiseSalesCollectionDuesSummaryComponent;
  let fixture: ComponentFixture<CustomerWiseSalesCollectionDuesSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerWiseSalesCollectionDuesSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerWiseSalesCollectionDuesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
