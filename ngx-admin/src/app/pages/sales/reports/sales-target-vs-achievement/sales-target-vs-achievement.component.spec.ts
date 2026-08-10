import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesTargetVsAchievementComponent } from './sales-target-vs-achievement.component';

describe('SalesTargetVsAchievementComponent', () => {
  let component: SalesTargetVsAchievementComponent;
  let fixture: ComponentFixture<SalesTargetVsAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesTargetVsAchievementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesTargetVsAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
