import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMonitorReportComponent } from './product-monitor-report.component';

describe('ProductMonitorReportComponent', () => {
  let component: ProductMonitorReportComponent;
  let fixture: ComponentFixture<ProductMonitorReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductMonitorReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMonitorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
