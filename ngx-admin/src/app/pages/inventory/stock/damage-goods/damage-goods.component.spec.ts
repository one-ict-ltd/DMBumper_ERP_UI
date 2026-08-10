import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageGoodsComponent } from './damage-goods.component';

describe('DamageGoodsComponent', () => {
  let component: DamageGoodsComponent;
  let fixture: ComponentFixture<DamageGoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DamageGoodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
