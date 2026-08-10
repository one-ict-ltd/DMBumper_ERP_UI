import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyObservationComponent } from './party-observation.component';

describe('PartyObservationComponent', () => {
  let component: PartyObservationComponent;
  let fixture: ComponentFixture<PartyObservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyObservationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
