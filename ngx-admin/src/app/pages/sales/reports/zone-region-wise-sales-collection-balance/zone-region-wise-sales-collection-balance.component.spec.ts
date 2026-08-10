import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneRegionWiseSalesCollectionBalanceComponent } from './zone-region-wise-sales-collection-balance.component';

describe('ZoneRegionWiseSalesCollectionBalanceComponent', () => {
  let component: ZoneRegionWiseSalesCollectionBalanceComponent;
  let fixture: ComponentFixture<ZoneRegionWiseSalesCollectionBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneRegionWiseSalesCollectionBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneRegionWiseSalesCollectionBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
