import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class StockinService {
  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }


  public getStockIn(stockMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Stock/getStockIn?stockMasterId=${stockMasterId}`,
      this.httpOptions
    );
  }

  public getStockDetailsIn(stockMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Stock/getStockDetailsIn?stockMasterId=${stockMasterId}`,
      this.httpOptions
    );
  }

  public deleteStockInById(stockMasterId: any): Observable<string> {
    return this.http.post<string>(
      //`${this.apiUrl}Stock/deleteStockInById?stockMasterId=${stockMasterId}`,
      `${this.apiUrl}Stock/deleteStockInById`, stockMasterId,
      this.httpOptions
    );
  }

  public DeleteFactoryProductionStockIn(stockMasterId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Stock/DeleteFactoryProductionStockIn`, stockMasterId,
      this.httpOptions
    );
  }

  public getStore(sbuId: any, companyId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Sbu/getStore?companyId=${companyId}&sbuId=${sbuId}&storeId=${0}`,
      this.httpOptions
    );
  }

  public getmaxMRNo(purchaseOrderDate): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Stock/getMRNumber?purchaseOrderDate=${purchaseOrderDate}`,
      this.httpOptions
    );
  }

  public getPOReceive(poReceiveId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrderReceive/getPurchaseOrderReceive?poReceiveId=${0}`,
      this.httpOptions
    );
  }

  public getPOReceivedetails(poReceiveId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Stock/GetPurchaseOrderReceiveDetails?poReceiveDetailsId=${poReceiveId}`,
      this.httpOptions
    );
  }

  public saveStockIn(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Stock/setStockIn`, master,
      this.httpOptions
    );
  }

  public getTRNNo(fromsbuId: any, fromDate, toDate): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Stock/getTRNNo?fromsbuId=${fromsbuId}&fromDate=${fromDate}&toDate=${toDate}`,
      this.httpOptions
    );
  }

  public getSRNo(sbuId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Stock/getSRNo?sbuId=${sbuId}`,
      this.httpOptions
    );
  }

  public getStockInReportById(stockMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Stock/getRptStockIn?stockMasterId=${stockMasterId}`,
      this.httpOptions
    );
  }

  public GetCurrentStock(
    storeId: any,
    productWiseSpecificationId: any,
    batchNo: any = ''
  ): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetCurrentStock?storeId=${storeId}&productWiseSpecificationId=${productWiseSpecificationId}&batchNo=${batchNo}`,
      this.httpOptions
    );
  }

  public GetBatchWisetStock(
    companyId: any,
    storeId: any,
  ): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}stock/getCurrentStockReport?productId=0&productWiseSpecificationId=0&companyId=${companyId}&sbuId=0&storeId=${storeId}&isStoreWiseGroup=0`,
      this.httpOptions
    );
  }
  public GetAllStockWithoutBatch(
    companyId: any,
    storeId: any,
  ): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}stock/GetAllStockWithoutBatch?productId=0&productWiseSpecificationId=0&companyId=${companyId}&sbuId=0&storeId=${storeId}&isStoreWiseGroup=0`,
      this.httpOptions
    );
  }
}
