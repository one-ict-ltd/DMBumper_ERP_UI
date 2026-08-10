import { TestBed } from '@angular/core/testing';

import { StockoutbybarcodeService } from './stockoutbybarcode.service';

describe('StockoutbybarcodeService', () => {
  let service: StockoutbybarcodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockoutbybarcodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
