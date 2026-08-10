import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalSalesClosingStatementComponent } from './national-sales-closing-statement.component';

describe('NationalSalesClosingStatementComponent', () => {
  let component: NationalSalesClosingStatementComponent;
  let fixture: ComponentFixture<NationalSalesClosingStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NationalSalesClosingStatementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NationalSalesClosingStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
