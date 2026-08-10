import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlankTemplateComponent } from './blank-template.component';

describe('BlankTemplateComponent', () => {
  let component: BlankTemplateComponent;
  let fixture: ComponentFixture<BlankTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlankTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlankTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
