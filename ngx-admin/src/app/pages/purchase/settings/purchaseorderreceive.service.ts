import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})
export class PurchaseorderreceiveService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getPurchaseOrderReceive(poReceiveId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrderReceive/getPurchaseOrderReceive?poReceiveId=${poReceiveId}`,
      this.httpOptions
    );
  }
  public getPurchaseOrderReceiveDetails(poReceiveId: any) {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrderReceive/getPurchaseOrderReceiveDetails?poReceiveId=${poReceiveId}`,
      this.httpOptions
    );
  }
  public getPurchaseOrderDetailsByIdForPoRecv(purchaseOrderId: any) {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrderReceive/GetPurchaseOrderDetailsByIdForPoRecv?purchaseOrderId=${purchaseOrderId}`,
      this.httpOptions
    );
  }
  public GetPurchaseOrderNumber() {
    return this.http.get<any>(
      `${this.apiUrl}PurCommon/GetPurchaseOrderNumber`,
      this.httpOptions
    );
  }
  public getMaxPurchaseOrderReceiveNumber(purchaseOrderRecvDate: any) {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurCommon/GetMaxPurchaseOrderReceiveNumber?purchaseOrderRecvDate=${purchaseOrderRecvDate}`,
      this.httpOptions
    );
  }
  public savePurchaseOrderReceive(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseOrderReceive/setPurchaseOrderReceive`,
      master,
      this.httpOptions
    );
  }
  public deletePurchaseOrderReceiveById_BAK(poReceiveId: any): Observable<string> {
    //debugger;
    return this.http.post<string>(
      `${this.apiUrl}PurchaseOrderReceive/DeletePurchaseOrderReceiveById?poReceiveId=${poReceiveId}`, this.httpOptions



    );
  }
  public deletePurchaseOrderReceiveById(poReceiveId: any): Observable<string> {
    //debugger;
    return this.http.post<string>(
      `${this.apiUrl}PurchaseOrderReceive/DeletePurchaseOrderReceiveById?poReceiveId=${poReceiveId}`,
      this.httpOptions
    );
  }
  public deletePurchaseOrderReceiveDetailsById(poReceiveDetailsId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseOrderReceive/DeletePurchaseOrderReceiveDetailsById?productReqDetailsId=${poReceiveDetailsId}`,
      this.httpOptions
    );
  }
}
