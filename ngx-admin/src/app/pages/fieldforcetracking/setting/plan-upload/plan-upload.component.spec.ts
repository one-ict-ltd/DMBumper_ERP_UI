import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanUploadComponent } from './plan-upload.component';

describe('PlanUploadComponent', () => {
  let component: PlanUploadComponent;
  let fixture: ComponentFixture<PlanUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
