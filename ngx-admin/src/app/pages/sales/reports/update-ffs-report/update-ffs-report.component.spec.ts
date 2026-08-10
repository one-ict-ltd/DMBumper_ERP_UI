import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFfsReportComponent } from './update-ffs-report.component';

describe('UpdateFfsReportComponent', () => {
  let component: UpdateFfsReportComponent;
  let fixture: ComponentFixture<UpdateFfsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateFfsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFfsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
