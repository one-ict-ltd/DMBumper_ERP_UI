import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SalesDistributionService {
  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public SaveSalesDistribution(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesDistribution/SaveSalesDistribution`,
      master,
      this.httpOptions
    );
  }
  public DeleteSalesDistributionById(
    distributionMasterId: any
  ): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesDistribution/DeleteSalesDistributionById`, distributionMasterId,
      this.httpOptions
    );
  }
  public GetSalesDistributionById(distributionMasterId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesDistribution/GetSalesDistributionById?distributionMasterId=${distributionMasterId}`,
      this.httpOptions
    );
  }
  public GetMaxSalesDistributionNumber(date: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesDistribution/GetMaxSalesDistributionNumber?dateTime=${date}`,
      this.httpOptions
    );
  }
  public GetSalesDistributionDetailsByInvoiceId(
    salesInvoiceId: any
  ): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesDistribution/GetSalesDistributionDetailsByInvoiceId?salesInvoiceId=${salesInvoiceId}`,
      this.httpOptions
    );
  }
  public GetSalesDistributionDetailsByMasterId(
    distributionMasterId: any
  ): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesDistribution/GetSalesDistributionDetailsByMasterId?distributionMasterId=${distributionMasterId}`,
      this.httpOptions
    );
  }
  public DeleteSalesDistributionDetailsById(
    distributionDetailId: any
  ): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesDistribution/DeleteSalesDistributionDetailsById`, distributionDetailId,
      this.httpOptions
    );
  }
  public GetSalesDistributionReportDataById(distributionMasterId: any) {
    return this.http.get<string>(
      `${this.apiUrl}SalesDistribution/GetSalesDistributionReportDataById?distributionMasterId=${distributionMasterId}`,
      this.httpOptions
    );
  }
  public GetDepoWiseSalesInvoiceList(depoId: any) {
    return this.http.get<string>(
      `${this.apiUrl}SalesDistribution/GetDepoWiseSalesInvoiceList?depoId=${depoId}`,
      this.httpOptions
    );
  }
  public ApproveSalesDistribution(master: any) {
    return this.http.post<string>(
      `${this.apiUrl}SalesDistribution/ApproveSalesDistribution`,
      master,
      this.httpOptions
    );
  }
  public GetSalesDistributionListForApproval(distributionMasterId: any) {
    return this.http.get<string>(
      `${this.apiUrl}SalesDistribution/GetSalesDistributionListForApproval?distributionMasterId=${distributionMasterId}`,
      this.httpOptions
    );
  }
  public GetSalesDistributionApprovedList(distributionMasterId: any) {
    return this.http.get<string>(
      `${this.apiUrl}SalesDistribution/GetSalesDistributionApprovedList?distributionMasterId=${distributionMasterId}`,
      this.httpOptions
    );
  }
  //#region Deal Not Applicable
  public saveDealNotApplicableCustomerAndInstitute(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesDistribution/SaveDealNotApplicableCustomerAndInstitute`,
      master,
      this.httpOptions
    );
  }
  public getDealNotApplicableCustomerAndInstituteList(dealNotApplicableCustomerAndInstituteId: any) {
    return this.http.get<string>(
      `${this.apiUrl}SalesDistribution/getDealNotApplicableCustomerAndInstituteList?dealNotApplicableCustomerAndInstituteId=${dealNotApplicableCustomerAndInstituteId}`,
      this.httpOptions
    );
  }
  //#endregion
}
