import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";

@Injectable({
  providedIn: 'root'
})
export class StockoutbybarcodeService {
  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;
  constructor(private http: HttpClient, private commonService: CommonService) { }

  public GetMaxStockOutNo(date: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}StockOutByBarcode/GetMaxStockOutNo?date=${date}`,
      this.httpOptions
    );
  }
  public GetBarcodeDetails(barcodeNo: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}StockOutByBarcode/GetBarcodeDetails?barcodeNo=${barcodeNo}`,
      this.httpOptions
    );
  }

  public GetStockOutByBarcodeByMasterId(stockMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}StockOutByBarcode/GetStockOutByBarcodeByMasterId?stockMasterId=${stockMasterId}`,
      this.httpOptions
    );
  }
  public GetStockOutByBarcodeDetailsByMasterId(stockMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}StockOutByBarcode/GetStockOutByBarcodeDetailsByMasterId?stockMasterId=${stockMasterId}`,
      this.httpOptions
    );
  }
  public SaveStockOutByBarcode(master: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}StockOutByBarcode/SaveStockOutByBarcode`, master,
      this.httpOptions
    );
  }
  public DeleteStockOutByBarcodeByMasterId(master: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}StockOutByBarcode/DeleteStockOutByBarcodeByMasterId`, master,
      this.httpOptions
    );
  }





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
