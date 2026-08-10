import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAppVersionComponent } from './update-app-version.component';

describe('UpdateAppVersionComponent', () => {
  let component: UpdateAppVersionComponent;
  let fixture: ComponentFixture<UpdateAppVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateAppVersionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAppVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
