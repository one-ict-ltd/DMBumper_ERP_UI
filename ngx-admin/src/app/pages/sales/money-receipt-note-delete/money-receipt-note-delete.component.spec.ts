import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyReceiptNoteDeleteComponent } from './money-receipt-note-delete.component';

describe('MoneyReceiptNoteDeleteComponent', () => {
  let component: MoneyReceiptNoteDeleteComponent;
  let fixture: ComponentFixture<MoneyReceiptNoteDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoneyReceiptNoteDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyReceiptNoteDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
