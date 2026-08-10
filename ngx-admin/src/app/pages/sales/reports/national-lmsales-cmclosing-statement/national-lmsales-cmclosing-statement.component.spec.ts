import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalLmsalesCmclosingStatementComponent } from './national-lmsales-cmclosing-statement.component';

describe('NationalLmsalesCmclosingStatementComponent', () => {
  let component: NationalLmsalesCmclosingStatementComponent;
  let fixture: ComponentFixture<NationalLmsalesCmclosingStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NationalLmsalesCmclosingStatementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NationalLmsalesCmclosingStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
