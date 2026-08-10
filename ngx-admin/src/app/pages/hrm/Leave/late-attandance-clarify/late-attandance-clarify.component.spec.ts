import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LateAttandanceClarifyComponent } from './late-attandance-clarify.component';

describe('LateAttandanceClarifyComponent', () => {
  let component: LateAttandanceClarifyComponent;
  let fixture: ComponentFixture<LateAttandanceClarifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LateAttandanceClarifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LateAttandanceClarifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
