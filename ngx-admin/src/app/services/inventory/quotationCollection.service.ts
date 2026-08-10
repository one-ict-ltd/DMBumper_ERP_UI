import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class QuotationCollectionService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getQuotationCollectionNo(quotationCollectionDate: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurCommon/GetMaxQuotationCollectionNumber?quotationCollDate=${quotationCollectionDate}`,
      this.httpOptions
    );
  }

  public getQuotationCollectionById(quotationCollectionId): Observable<any> {
    debugger
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/getQuotationCollection?quotationCollectionId=${quotationCollectionId}`,
      this.httpOptions
    );
  }

  public setQuotationCollection(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseRequisition/setQuotationCollection`, master,
      this.httpOptions
    );
  }

  public GetQuotationCollDetailsByMasterId(quotationCollectionId): Observable<any> {
   // debugger
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/GetQuotationCollDetailsByMasterId?masterId=${quotationCollectionId}`,
      this.httpOptions
    );
  }

  public DeleteQuotationCollById(quotationCollectionId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseRequisition/DeleteQuotationCollectionById`, quotationCollectionId,
      this.httpOptions
    );
  }

  public DeleteQuotationCollDetailsById(quotationCollDetailsIdDetailsId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseRequisition/DeleteQuotationCollDetailsById`, quotationCollDetailsIdDetailsId,
      this.httpOptions
    );
  }



}

