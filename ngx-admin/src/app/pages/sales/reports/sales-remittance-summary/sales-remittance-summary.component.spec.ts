import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesRemittanceSummaryComponent } from './sales-remittance-summary.component';

describe('SalesRemittanceSummaryComponent', () => {
  let component: SalesRemittanceSummaryComponent;
  let fixture: ComponentFixture<SalesRemittanceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesRemittanceSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesRemittanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
