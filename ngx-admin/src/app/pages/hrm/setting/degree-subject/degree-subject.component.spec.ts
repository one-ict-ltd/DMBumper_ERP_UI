import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DegreeSubjectComponent } from './degree-subject.component';

describe('DegreeSubjectComponent', () => {
  let component: DegreeSubjectComponent;
  let fixture: ComponentFixture<DegreeSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DegreeSubjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DegreeSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
