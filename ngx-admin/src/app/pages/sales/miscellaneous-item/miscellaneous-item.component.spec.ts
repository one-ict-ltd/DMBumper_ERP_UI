import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscellaneousItemComponent } from './miscellaneous-item.component';

describe('MiscellaneousItemComponent', () => {
  let component: MiscellaneousItemComponent;
  let fixture: ComponentFixture<MiscellaneousItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiscellaneousItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscellaneousItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
