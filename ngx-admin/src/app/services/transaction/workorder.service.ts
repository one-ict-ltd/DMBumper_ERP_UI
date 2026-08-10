import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WorkorderService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getVisaWorkOrder(isProcessed): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Dahmashi/getVisaWorkOrder?visaWorkOrderId=0&isProcessed=${isProcessed}`,
      this.httpOptions
    );
  }
  public getVisaWorkOrderById(visaWorkOrderId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Dahmashi/getVisaWorkOrder?visaWorkOrderId=${visaWorkOrderId}&isProcessed=ALL`,
      this.httpOptions
    );
  }

  public saveVisaWorkOrder(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Dahmashi/setVisaWorkOrder`,
      master,
      this.httpOptions
    );
  }

  public deleteVisaWorkOrder(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Dahmashi/deleteVisaWorkOrder`,
      master,
      this.httpOptions
    );
  }

  public getVisaInfoByWorkOrder(workOrderNo: any) {
    return this.http.get<any>(
      `${this.apiUrl}Dahmashi/getVisaInfoByWorkOrder?workOrderNo=${workOrderNo}`,
      this.httpOptions
    );
  }

  public getAllVisaInfo() {
    return this.http.get<any>(
      `${this.apiUrl}Dahmashi/getVisaInfoByWorkOrder?workOrderNo=`,
      this.httpOptions
    );
  }

  public getVisaGroupByWorkOrderId(visaWorkOrderId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Dahmashi/getVisaGroupByWorkOrderId?visaWorkOrderId=${visaWorkOrderId}`,
      this.httpOptions
    );
  }

  public createAutoJournalForWorkOrder(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Dahmashi/createAutoJournalForWorkOrder`,
      master,
      this.httpOptions
    );
  }

  public getRptVisaWorkOrder(visaId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Dahmashi/getRptVisaWorkOrder?visaId=${visaId}`,
      this.httpOptions
    );
  }

  public getDuplicateVisaWorkOrder(visaId, workOrderNo) {
    return this.http.get<any>(
      `${this.apiUrl}Dahmashi/GetDuplicateVisaWorkOrder?visaId=${visaId}&workOrderNo=${workOrderNo}`,
      this.httpOptions
    );
  }

}
