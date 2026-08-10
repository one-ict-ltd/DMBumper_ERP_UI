import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryFCQCComponent } from './factory-fcqc.component';

describe('FactoryFCQCComponent', () => {
  let component: FactoryFCQCComponent;
  let fixture: ComponentFixture<FactoryFCQCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactoryFCQCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoryFCQCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
