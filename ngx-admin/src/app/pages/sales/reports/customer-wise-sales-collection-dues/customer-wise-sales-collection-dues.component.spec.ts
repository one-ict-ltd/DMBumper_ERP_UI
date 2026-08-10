import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerWiseSalesCollectionDuesComponent } from './customer-wise-sales-collection-dues.component';

describe('CustomerWiseSalesCollectionDuesComponent', () => {
  let component: CustomerWiseSalesCollectionDuesComponent;
  let fixture: ComponentFixture<CustomerWiseSalesCollectionDuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerWiseSalesCollectionDuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerWiseSalesCollectionDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
