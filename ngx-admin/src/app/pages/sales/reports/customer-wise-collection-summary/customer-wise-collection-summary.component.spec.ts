import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerWiseCollectionSummaryComponent } from './customer-wise-collection-summary.component';

describe('CustomerWiseCollectionSummaryComponent', () => {
  let component: CustomerWiseCollectionSummaryComponent;
  let fixture: ComponentFixture<CustomerWiseCollectionSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerWiseCollectionSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerWiseCollectionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
