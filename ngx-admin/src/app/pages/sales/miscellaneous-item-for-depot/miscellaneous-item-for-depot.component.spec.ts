import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscellaneousItemForDepotComponent } from './miscellaneous-item-for-depot.component';

describe('MiscellaneousItemForDepotComponent', () => {
  let component: MiscellaneousItemForDepotComponent;
  let fixture: ComponentFixture<MiscellaneousItemForDepotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiscellaneousItemForDepotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscellaneousItemForDepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
