import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessHeadGroupComponent } from './process-head-group.component';

describe('ProcessHeadGroupComponent', () => {
  let component: ProcessHeadGroupComponent;
  let fixture: ComponentFixture<ProcessHeadGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessHeadGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessHeadGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
