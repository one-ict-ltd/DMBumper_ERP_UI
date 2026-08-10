import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseapprovalmatrixComponent } from './purchaseapprovalmatrix.component';

describe('PurchaseapprovalmatrixComponent', () => {
  let component: PurchaseapprovalmatrixComponent;
  let fixture: ComponentFixture<PurchaseapprovalmatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseapprovalmatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseapprovalmatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
