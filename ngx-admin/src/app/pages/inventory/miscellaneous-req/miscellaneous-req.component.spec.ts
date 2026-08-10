import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscellaneousReqComponent } from './miscellaneous-req.component';

describe('MiscellaneousReqComponent', () => {
  let component: MiscellaneousReqComponent;
  let fixture: ComponentFixture<MiscellaneousReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiscellaneousReqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscellaneousReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
