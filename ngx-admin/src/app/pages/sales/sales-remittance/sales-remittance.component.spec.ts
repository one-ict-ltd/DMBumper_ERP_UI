import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesRemittanceComponent } from './sales-remittance.component';

describe('SalesRemittanceComponent', () => {
  let component: SalesRemittanceComponent;
  let fixture: ComponentFixture<SalesRemittanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesRemittanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesRemittanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
