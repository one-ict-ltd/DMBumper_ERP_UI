import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesExpiredProductComponent } from './sales-expired-product.component';

describe('SalesExpiredProductComponent', () => {
  let component: SalesExpiredProductComponent;
  let fixture: ComponentFixture<SalesExpiredProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesExpiredProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesExpiredProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
