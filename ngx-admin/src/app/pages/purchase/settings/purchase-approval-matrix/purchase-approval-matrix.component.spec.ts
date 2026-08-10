import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseApprovalMatrixComponent } from './purchase-approval-matrix.component';

describe('PurchaseApprovalMatrixComponent', () => {
  let component: PurchaseApprovalMatrixComponent;
  let fixture: ComponentFixture<PurchaseApprovalMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseApprovalMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseApprovalMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
