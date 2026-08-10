import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerritoryOfficerWiseCollectionComponent } from './territory-officer-wise-collection.component';

describe('TerritoryOfficerWiseCollectionComponent', () => {
  let component: TerritoryOfficerWiseCollectionComponent;
  let fixture: ComponentFixture<TerritoryOfficerWiseCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerritoryOfficerWiseCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoryOfficerWiseCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
