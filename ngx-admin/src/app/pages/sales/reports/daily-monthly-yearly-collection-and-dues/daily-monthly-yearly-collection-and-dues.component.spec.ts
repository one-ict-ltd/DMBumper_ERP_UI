import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyMonthlyYearlyCollectionAndDuesComponent } from './daily-monthly-yearly-collection-and-dues.component';

describe('DailyMonthlyYearlyCollectionAndDuesComponent', () => {
  let component: DailyMonthlyYearlyCollectionAndDuesComponent;
  let fixture: ComponentFixture<DailyMonthlyYearlyCollectionAndDuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyMonthlyYearlyCollectionAndDuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyMonthlyYearlyCollectionAndDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
