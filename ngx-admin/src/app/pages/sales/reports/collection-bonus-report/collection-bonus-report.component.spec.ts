import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionBonusReportComponent } from './collection-bonus-report.component';

describe('CollectionBonusReportComponent', () => {
  let component: CollectionBonusReportComponent;
  let fixture: ComponentFixture<CollectionBonusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionBonusReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionBonusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
