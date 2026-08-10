import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseRequisitionHOComponent } from './purchase-requisition-ho.component';

describe('PurchaseRequisitionHOComponent', () => {
  let component: PurchaseRequisitionHOComponent;
  let fixture: ComponentFixture<PurchaseRequisitionHOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseRequisitionHOComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseRequisitionHOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
