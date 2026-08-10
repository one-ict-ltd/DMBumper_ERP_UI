import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FftDashboardForMdComponent } from './fft-dashboard-for-md.component';

describe('FftDashboardForMdComponent', () => {
  let component: FftDashboardForMdComponent;
  let fixture: ComponentFixture<FftDashboardForMdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FftDashboardForMdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FftDashboardForMdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
