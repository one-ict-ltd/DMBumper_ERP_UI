import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StockinwithoutpoService {
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

  public getAllProductForRequisition() {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getAllProductForRequisition`,
      this.httpOptions
    );
  }

  public GetAllPromoSampleProducts() {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/GetAllPromoSampleProducts`,
      this.httpOptions
    );
  }
  public getAllProductSpecification(productId) {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getAllProductForRequisition?productId=${productId}`,
      this.httpOptions
    );
  }
  public getAllProductSpecificationForStockInStockOut(productId) {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getAllProductForStockInStockOut?productId=${productId}`,
      this.httpOptions
    );
  }

  public saveStockIn(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Stock/setStockInWithOutPO`, master,
      this.httpOptions
    );
  }

  public saveStockIn_FromTransferNote(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Stock/setStockInWithOutPO_FromTransferNote`, master,
      this.httpOptions
    );
  }

  public saveRmPmStockIn(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Stock/setRmPmStockInWithOutPO`, master,
      this.httpOptions
    );
  }
  public setFactoryFGStockIn(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Stock/setFactoryFGStockIn`, master,
      this.httpOptions
    );
  }

  public setFactoryFGStockInQA(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Stock/setFactoryFGStockInQA`, master,
      this.httpOptions
    );
  }

  public getStockDetailsWithOutPOIn(stockMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Stock/getStockDetailsWithOutPOIn?stockMasterId=${stockMasterId}`,
      this.httpOptions
    );
  }

  public getFactoryFGProductionDetailsByIn(stockMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Stock/getFactoryFGProductionDetailsByIn?stockMasterId=${stockMasterId}`,
      this.httpOptions
    );
  }


  public getStockInWithOtPO(stockMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Stock/getStockInWithOutPO?stockMasterId=${stockMasterId}`,
      this.httpOptions
    );
  }
  public getRmPmStockInWithOtPO(stockMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Stock/getRmPmStockInWithOutPO?stockMasterId=${stockMasterId}`,
      this.httpOptions
    );
  }

  public GetStockInWithProductionById(stockMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Stock/GetStockInWithProductionById?stockMasterId=${stockMasterId}`,
      this.httpOptions
    );
  }

  public GetStockInWithProductionById_FromTransferNote(stockMasterId: any, fromDate: Date = null, toDate: Date = null): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Stock/GetStockInWithProductionById_FromTransferNote?stockMasterId=${stockMasterId}&fDate=${this.commonService.DateFormat(fromDate)}&tDate=${this.commonService.DateFormat(toDate)}`,
      this.httpOptions
    );
  }

  public GetFactoryFGStockInJSON(stockMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Stock/GetFactoryFGStockInJSON?stockMasterId=${stockMasterId}`,
      this.httpOptions
    );
  }

  public GetFactoryFGStockInJSONForStock(stockMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Stock/GetFactoryFGStockInJSONForStock?stockMasterId=${stockMasterId}`,
      this.httpOptions
    );
  }

  public getCurrentStock(specificationId: any, storeId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Stock/getCurrentstock?specificationId=${specificationId}&storeId=${storeId}`,
      this.httpOptions
    );
  }

  public getStockInWithOutPoReportById(stockMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Stock/getRptStockInWithOutPo?stockMasterId=${stockMasterId}`,
      this.httpOptions
    );
  }

  public getRptFactoryFGStockIn(stockMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Stock/getRptFactoryFGStockIn?stockMasterId=${stockMasterId}`,
      this.httpOptions
    );
  }


}
