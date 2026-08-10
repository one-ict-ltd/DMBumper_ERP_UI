import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInfromProductionComponent } from './stock-infrom-production.component';

describe('StockInfromProductionComponent', () => {
  let component: StockInfromProductionComponent;
  let fixture: ComponentFixture<StockInfromProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockInfromProductionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInfromProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
