import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmStockReportComponent } from './pm-stock-report.component';

describe('PmStockReportComponent', () => {
  let component: PmStockReportComponent;
  let fixture: ComponentFixture<PmStockReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmStockReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
