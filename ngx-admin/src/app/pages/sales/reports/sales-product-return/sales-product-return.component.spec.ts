import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesProductReturnComponent } from './sales-product-return.component';

describe('SalesProductReturnComponent', () => {
  let component: SalesProductReturnComponent;
  let fixture: ComponentFixture<SalesProductReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesProductReturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesProductReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
