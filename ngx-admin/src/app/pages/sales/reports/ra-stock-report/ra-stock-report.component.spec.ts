import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaStockReportComponent } from './ra-stock-report.component';

describe('RaStockReportComponent', () => {
  let component: RaStockReportComponent;
  let fixture: ComponentFixture<RaStockReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaStockReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
