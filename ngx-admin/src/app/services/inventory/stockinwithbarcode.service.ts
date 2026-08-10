import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StockinwithbarcodeService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getAllProduct() {
    return this.http.get<any>(
      `${this.apiUrl}Product/getProduct`,
      this.httpOptions
    );
  }

  public getAllProductSpecification(productId) {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getAllProductForRequisition?productId=${productId}`,
      this.httpOptions
    );
  }
  public SaveStockInWithBarcode(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}StockInWithBarcode/SaveStockInWithBarcode`, master,
      this.httpOptions
    );
  }

  public DeleteStockInWithBarcodeById(barcodeId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}StockInWithBarcode/DeleteStockInWithBarcodeById`, barcodeId,
      this.httpOptions
    );
  }
  public GetStockInWithBarcodeById(barcodeId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}StockInWithBarcode/GetStockInWithBarcodeById?barcodeId=${barcodeId}`,
      this.httpOptions
    );
  }
  public GetStockInWithBarcodeDetailsById(barcodeId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}StockInWithBarcode/GetStockInWithBarcodeDetailsById?barcodeId=${barcodeId}`,
      this.httpOptions
    );
  }

  public getCurrentStock(specificationId: any, storeId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Stock/getCurrentstock?specificationId=${specificationId}&storeId=${storeId}`,
      this.httpOptions
    );
  }

  public getMaxBarcodeNo(date: any) {
    return this.http.get<any>(
      `${this.apiUrl}StockInWithBarcode/GetMaxBarcodeNo?date=${date}`,
      this.httpOptions
    );
  }

  public GetAllPartyByPartyType(PartyType: any) {
    return this.http.get<any>(
      `${this.apiUrl}StockInWithBarcode/GetAllPartyByPartyType?PartyType=${PartyType}`,
      this.httpOptions
    );
  }

  public GetStockInWithBarcodeReportData(fromDate: any, toDate: any, fromSbuId: any, fromStoreId: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}StockInWithBarcode/GetStockInWithBarcodeReportData?fromDate=${fromDate}&toDate=${toDate}&fromSbuId=${fromSbuId}&fromStoreId=${fromStoreId}`,
      this.httpOptions
    );
  }
  public getStockInWithOutPoReportById(barcodeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}StockInWithBarcode/getRptStockInWithOutPo?barcodeId=${barcodeId}`,
      this.httpOptions
    );
  }
  public GetStockInDetailsReportData(searchingText: any, fDate: any, tDate: any) {
    return this.http.get<any>(//searchingText, DateTime? fDate, DateTime? tDate
      `${this.apiUrl}StockInWithBarcode/GetStockInDetailsReportData?searchingText=${searchingText}&fDate=${fDate}&tDate=${tDate}`,
      this.httpOptions
    );
  }
}