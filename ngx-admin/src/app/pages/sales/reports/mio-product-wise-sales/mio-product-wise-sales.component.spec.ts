import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MioProductWiseSalesComponent } from './mio-product-wise-sales.component';

describe('MioProductWiseSalesComponent', () => {
  let component: MioProductWiseSalesComponent;
  let fixture: ComponentFixture<MioProductWiseSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MioProductWiseSalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MioProductWiseSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
