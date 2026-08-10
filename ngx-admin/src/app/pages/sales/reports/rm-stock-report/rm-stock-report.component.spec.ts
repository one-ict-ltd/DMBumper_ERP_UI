import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmStockReportComponent } from './rm-stock-report.component';

describe('RmStockReportComponent', () => {
  let component: RmStockReportComponent;
  let fixture: ComponentFixture<RmStockReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmStockReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
