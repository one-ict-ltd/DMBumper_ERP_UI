import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscellaneousIssueComponent } from './miscellaneous-issue.component';

describe('MiscellaneousIssueComponent', () => {
  let component: MiscellaneousIssueComponent;
  let fixture: ComponentFixture<MiscellaneousIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiscellaneousIssueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscellaneousIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
