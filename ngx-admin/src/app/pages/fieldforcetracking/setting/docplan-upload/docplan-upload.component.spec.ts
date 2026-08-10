import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocplanUploadComponent } from './docplan-upload.component';

describe('DocplanUploadComponent', () => {
  let component: DocplanUploadComponent;
  let fixture: ComponentFixture<DocplanUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocplanUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocplanUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
