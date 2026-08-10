import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class StockoutService {
  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;
  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getStockOut(stockMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Stock/getStockOut?stockMasterId=${stockMasterId}`,
      this.httpOptions
    );
  }

  public getmaxSRNo(purchaseOrderDate): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Stock/getSRNumber?purchaseOrderDate=${purchaseOrderDate}`,
      this.httpOptions
    );
  }

  public saveStockOut(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Stock/setStockOut`, master,
      this.httpOptions
    );
  }

  public deleteStockOutById(stockMasterId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Stock/deleteStockOutById?stockMasterId=${stockMasterId}`,
      this.httpOptions
    );
  }

  
  public getStockDetailsOut(stockMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Stock/getStockDetailsOut?stockMasterId=${stockMasterId}`,
      this.httpOptions
    );
  }

  public getStockOutReportById(stockMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Stock/getRptStockOut?stockMasterId=${stockMasterId}`,
      this.httpOptions
    );
  }

}
