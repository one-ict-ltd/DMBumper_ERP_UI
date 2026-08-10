import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparativeStatementApprovalComponent } from './comparative-statement-approval.component';

describe('ComparativeStatementApprovalComponent', () => {
  let component: ComparativeStatementApprovalComponent;
  let fixture: ComponentFixture<ComparativeStatementApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComparativeStatementApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparativeStatementApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
