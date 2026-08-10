import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssPortalComponent } from './ess-portal.component';

describe('EssPortalComponent', () => {
  let component: EssPortalComponent;
  let fixture: ComponentFixture<EssPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
