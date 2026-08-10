import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDistributionApprovalComponent } from './sales-distribution-approval.component';

describe('SalesDistributionApprovalComponent', () => {
  let component: SalesDistributionApprovalComponent;
  let fixture: ComponentFixture<SalesDistributionApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesDistributionApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesDistributionApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
