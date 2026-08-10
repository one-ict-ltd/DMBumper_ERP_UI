import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PurchasereturnService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public SavePurchaseReturnMaster(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseReturn/SavePurchaseReturnMaster`, master,
      this.httpOptions
    );
  }

  public GetPurchaseReturnMasterByMasterId(purchaseReturnMasterId: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurchaseReturn/GetPurchaseReturnMasterByMasterId?purchaseReturnMasterId=${purchaseReturnMasterId}`,
      this.httpOptions
    );
  }

  public GetPurchaseReturnDetailsByMasterId(purchaseReturnMasterId: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurchaseReturn/GetPurchaseReturnDetailsByMasterId?purchaseReturnMasterId=${purchaseReturnMasterId}`,
      this.httpOptions
    );
  }

  public DeletePurchaseReturnMasterByMasterId(purchaseReturnMasterId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseReturn/DeletePurchaseReturnMasterByMasterId`, purchaseReturnMasterId,
      this.httpOptions
    );
  }

  public GetMaxPurchaseReturnNumber(date: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}PurchaseReturn/GetMaxPurchaseReturnNumber?dateTime=${date}`,
      this.httpOptions
    );
  }

  public GetPOListBySupplierId(supplierId: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}PurchaseReturn/GetPOListBySupplierId?supplierId=${supplierId}`,
      this.httpOptions
    );
  }

}
