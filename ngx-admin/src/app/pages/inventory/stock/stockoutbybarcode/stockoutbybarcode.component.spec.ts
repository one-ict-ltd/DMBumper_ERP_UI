import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockoutbybarcodeComponent } from './stockoutbybarcode.component';

describe('StockoutbybarcodeComponent', () => {
  let component: StockoutbybarcodeComponent;
  let fixture: ComponentFixture<StockoutbybarcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockoutbybarcodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockoutbybarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
