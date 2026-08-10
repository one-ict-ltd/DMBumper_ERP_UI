import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccountreportService {

  apiUrl: string = this.commonService.baseUrl;
  reportApiUrl: string = this.commonService.baseReportUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;
  userProfile: any = this.commonService.GetUserProfile();
  constructor(private http: HttpClient, private commonService: CommonService) { }

  public GetCompanyAliasName() {
    let data: {} = JSON.parse(this.userProfile);
    return data[0].uc[0].aliasName;
  }

  public RptPaymentReceipt(companyId, sbuId, ledgerId, fromDate, toDate, reportFormat: any) {
    return this.http.get<any>(
      `${this.reportApiUrl}AccountsReport/RptPaymentReceipt?companyId=${companyId}&sbuId=${sbuId}&ledgerId=${ledgerId}&fromDate=${fromDate}&toDate=${toDate}&reportFormat=${reportFormat}`,
      this.httpOptions
    );
  }

  public RptBalanceSheetNotes(companyId, sbuId, noteMasterId, fromDate, toDate, rptType, reportFormat: any) {
    return this.http.get<any>(
      `${this.reportApiUrl}AccountsReport/RptBalanceSheetNotes?companyId=${companyId}&sbuId=${sbuId}&noteMasterId=${noteMasterId}&fromDate=${fromDate}&toDate=${toDate}&rptType=${rptType}&reportFormat=${reportFormat}`,
      this.httpOptions
    );
  }

}
