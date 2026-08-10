import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})

export class PoductPricingService {
  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public SaveProductPricing(master: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}ProductPricing/SaveProductPricing`, master, this.httpOptions
    );
  }

  public SaveCashSetUp(master: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}ProductPricing/SaveCashSetUp`, master, this.httpOptions
    );
  }

  public GetProductPricingByMasterId(pricingId: any, productWiseSpecificationId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductPricing/GetProductPricingByMasterId?pricingId=${pricingId}&productWiseSpecificationId=${productWiseSpecificationId}`,
      this.httpOptions
    );
  }

  public GetProductPricingNewByMasterId(pricingId: any, productWiseSpecificationId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductPricing/GetProductPricingNByMasterId?pricingId=${pricingId}&productWiseSpecificationId=${productWiseSpecificationId}`,
      this.httpOptions
    );
  }

  public GetEmployeeCashSalaryJSON(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductPricing/GetEmployeeCashSalaryJSON`,
      this.httpOptions
    );
  }

}