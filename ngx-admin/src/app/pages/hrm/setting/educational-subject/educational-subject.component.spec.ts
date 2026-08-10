import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalSubjectComponent } from './educational-subject.component';

describe('EducationalSubjectComponent', () => {
  let component: EducationalSubjectComponent;
  let fixture: ComponentFixture<EducationalSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationalSubjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationalSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
