import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class SuppliertermsconditionsService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getTermsAndConditions(supplierId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getTermsAndConditions?supplierId=${supplierId}`,
      this.httpOptions
    );
  }

  public getTermsAndConditionsNoStuff(supplierId: any, productTypeId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getTermsAndConditionsNoStuff?supplierId=${supplierId}&productTypeId=${productTypeId}`,
      this.httpOptions
    );
  }

  public getProductsupplier(): Observable<any> {
    debugger
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductSupplier`,
      this.httpOptions
    );
  }


  public saveTermsAndConditions(supplierId, productTypeId, master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseOrder/setTermsAndConditions?supplierId=${supplierId}&productTypeId=${productTypeId}`,
      master,
      this.httpOptions
    );
  }
  public deleteTermsAndConditionsId(termsAndConditionsId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseOrder/deleteTermsAndConditionsId`,
      termsAndConditionsId,
      this.httpOptions
    );
  }
}
