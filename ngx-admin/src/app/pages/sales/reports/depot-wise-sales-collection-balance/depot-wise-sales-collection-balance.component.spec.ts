import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotWiseSalesCollectionBalanceComponent } from './depot-wise-sales-collection-balance.component';

describe('DepotWiseSalesCollectionBalanceComponent', () => {
  let component: DepotWiseSalesCollectionBalanceComponent;
  let fixture: ComponentFixture<DepotWiseSalesCollectionBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepotWiseSalesCollectionBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepotWiseSalesCollectionBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
