import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGroupAssignComponent } from './product-group-assign.component';

describe('ProductGroupAssignComponent', () => {
  let component: ProductGroupAssignComponent;
  let fixture: ComponentFixture<ProductGroupAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductGroupAssignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGroupAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
