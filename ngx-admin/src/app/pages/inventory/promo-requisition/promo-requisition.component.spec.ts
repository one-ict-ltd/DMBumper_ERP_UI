import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoRequisitionComponent } from './promo-requisition.component';

describe('PromoRequisitionComponent', () => {
  let component: PromoRequisitionComponent;
  let fixture: ComponentFixture<PromoRequisitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromoRequisitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
