import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BomFinishGoodStockInComponent } from './bom-finish-good-stock-in.component';

describe('BomFinishGoodStockInComponent', () => {
  let component: BomFinishGoodStockInComponent;
  let fixture: ComponentFixture<BomFinishGoodStockInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BomFinishGoodStockInComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BomFinishGoodStockInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
