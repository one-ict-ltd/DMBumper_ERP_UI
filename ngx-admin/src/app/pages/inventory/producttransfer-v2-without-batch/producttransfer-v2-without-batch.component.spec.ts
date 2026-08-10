import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducttransferV2WithoutBatchComponent } from './producttransfer-v2-without-batch.component';

describe('ProducttransferV2WithoutBatchComponent', () => {
  let component: ProducttransferV2WithoutBatchComponent;
  let fixture: ComponentFixture<ProducttransferV2WithoutBatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProducttransferV2WithoutBatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducttransferV2WithoutBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
