import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentstockComponent } from './currentstock.component';

describe('CurrentstockComponent', () => {
  let component: CurrentstockComponent;
  let fixture: ComponentFixture<CurrentstockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentstockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
