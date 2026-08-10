import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInPromoSampleComponent } from './stock-in-promo-sample.component';

describe('StockInPromoSampleComponent', () => {
  let component: StockInPromoSampleComponent;
  let fixture: ComponentFixture<StockInPromoSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockInPromoSampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInPromoSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
