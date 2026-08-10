import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWiseSalesDuesComponent } from './product-wise-sales-dues.component';

describe('ProductWiseSalesDuesComponent', () => {
  let component: ProductWiseSalesDuesComponent;
  let fixture: ComponentFixture<ProductWiseSalesDuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductWiseSalesDuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductWiseSalesDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
