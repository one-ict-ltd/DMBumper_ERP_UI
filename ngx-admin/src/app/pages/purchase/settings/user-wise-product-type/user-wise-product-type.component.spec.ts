import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWiseProductTypeComponent } from './user-wise-product-type.component';

describe('UserWiseProductTypeComponent', () => {
  let component: UserWiseProductTypeComponent;
  let fixture: ComponentFixture<UserWiseProductTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserWiseProductTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWiseProductTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
