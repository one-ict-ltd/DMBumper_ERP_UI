import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrossReturnMultipleComponent } from './gross-return-multiple.component';

describe('GrossReturnMultipleComponent', () => {
  let component: GrossReturnMultipleComponent;
  let fixture: ComponentFixture<GrossReturnMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrossReturnMultipleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrossReturnMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
