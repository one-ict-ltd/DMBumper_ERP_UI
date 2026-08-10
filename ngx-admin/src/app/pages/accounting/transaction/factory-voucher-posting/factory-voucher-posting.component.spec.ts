import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryVoucherPostingComponent } from './factory-voucher-posting.component';

describe('FactoryVoucherPostingComponent', () => {
  let component: FactoryVoucherPostingComponent;
  let fixture: ComponentFixture<FactoryVoucherPostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactoryVoucherPostingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoryVoucherPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
