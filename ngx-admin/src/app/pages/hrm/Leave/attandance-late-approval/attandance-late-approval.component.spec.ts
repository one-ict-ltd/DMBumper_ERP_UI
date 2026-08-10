import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttandanceLateApprovalComponent } from './attandance-late-approval.component';

describe('AttandanceLateApprovalComponent', () => {
  let component: AttandanceLateApprovalComponent;
  let fixture: ComponentFixture<AttandanceLateApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttandanceLateApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttandanceLateApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
