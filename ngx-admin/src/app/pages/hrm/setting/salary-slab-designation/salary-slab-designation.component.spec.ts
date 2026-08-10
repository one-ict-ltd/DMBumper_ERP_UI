import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarySlabDesignationComponent } from './salary-slab-designation.component';

describe('SalarySlabDesignationComponent', () => {
  let component: SalarySlabDesignationComponent;
  let fixture: ComponentFixture<SalarySlabDesignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalarySlabDesignationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalarySlabDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
