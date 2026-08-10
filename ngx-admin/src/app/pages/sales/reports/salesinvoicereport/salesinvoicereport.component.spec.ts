import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesinvoicereportComponent } from './salesinvoicereport.component';

describe('SalesinvoicereportComponent', () => {
  let component: SalesinvoicereportComponent;
  let fixture: ComponentFixture<SalesinvoicereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesinvoicereportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesinvoicereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
