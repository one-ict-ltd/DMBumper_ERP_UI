import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPmdReportComponent } from './sales-pmd-report.component';

describe('SalesPmdReportComponent', () => {
  let component: SalesPmdReportComponent;
  let fixture: ComponentFixture<SalesPmdReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesPmdReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPmdReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
