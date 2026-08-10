import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryFGStockComponent } from './factory-fgstock.component';

describe('FactoryFGStockComponent', () => {
  let component: FactoryFGStockComponent;
  let fixture: ComponentFixture<FactoryFGStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactoryFGStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoryFGStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
