import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SalaryreportService {

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

  public RptPayslip(companyId, sbuId, employeeId, salaryPeriodId, reportFormat: any) {
    return this.http.get<any>(
      `${this.reportApiUrl}SalaryReport/RptPayslip?companyId=${companyId}&sbuId=${sbuId}&employeeId=${employeeId}&salaryPeriodId=${salaryPeriodId}&reportFormat=${reportFormat}`,
      this.httpOptions
    );
  }

  public RptPayslipBank(companyId, sbuId, employeeId, salaryPeriodId, reportFormat: any) {
    return this.http.get<any>(
      `${this.reportApiUrl}SalaryReport/RptPayslipBank?companyId=${companyId}&sbuId=${sbuId}&employeeId=${employeeId}&salaryPeriodId=${salaryPeriodId}&reportFormat=${reportFormat}`,
      this.httpOptions
    );
  }

  public RptSalarySheet(companyId, sbuId, salaryPeriodId, reportFormat: any, reportType: any = "ALL Employee", perionType: any = 1, locationId: any = 0, departmentIds: string = '') {
    return this.http.get<any>(
      `${this.reportApiUrl}SalaryReport/RptSalarySheet?companyId=${companyId}&sbuId=${sbuId}&salaryPeriodId=${salaryPeriodId}&reportFormat=${reportFormat}&reportType=${reportType}&perionType=${perionType}&salaryLocation=${locationId}&departmentIds=${departmentIds}`,
      this.httpOptions
    );
  }

  public RptSalarySummarySheet(companyId, sbuId, salaryPeriodId, reportFormat: any, salaryTypeId: number, reportType: any = "ALL Employee", salaryDepotName: string, isCashPayment: boolean = false, empTypeName: string = '', departments: string = '') {
    debugger
    return this.http.get<any>(
      `${this.reportApiUrl}SalaryReport/RptSalarySummarySheet?reportFormat=${reportFormat}&companyId=${companyId}&sbuId=${sbuId}&salaryPeriodId=${salaryPeriodId}&reportType=${reportType}&salaryType=${salaryTypeId}&salaryDepotName=${salaryDepotName}&isCashPayment=${isCashPayment}&empTypeName=${empTypeName}&departments=${departments}`,
      this.httpOptions
    );
  }
  public RptMobileBillSheet(companyId, sbuId, salaryPeriodId, reportFormat: any) {
    return this.http.get<any>(
      `${this.reportApiUrl}SalaryReport/RptMobileBillSheet?reportFormat=${reportFormat}&companyId=${companyId}&sbuId=${sbuId}&salaryPeriodId=${salaryPeriodId}`,
      this.httpOptions
    );
  }
  public GetEmployeeMobileBillInfo(userId: number = 0, employeeId: number = 0, reportFormat: any) {
    return this.http.get<any>(
      `${this.reportApiUrl}Pims/GetEmployeeMobileBillInfo?userId=${0}&employeeId=${0}&reportFormat=pdf`,
      this.httpOptions
    );
  }

  public RptMobileBillSheetSummary(companyId, sbuId, salaryPeriodId, reportFormat: any) {
    return this.http.get<any>(
      `${this.reportApiUrl}SalaryReport/RptMobileBillSheetSummary?reportFormat=${reportFormat}&companyId=${companyId}&sbuId=${sbuId}&salaryPeriodId=${salaryPeriodId}`,
      this.httpOptions
    );
  }
  public SalaryComparisonReport(reportFormat: any, userId, salaryPeriodId) {
    return this.http.get<any>(
      `${this.reportApiUrl}SalaryReport/GetSalaryComparisonReport?reportFormat=${reportFormat}&userId=${userId}&salaryPeriodId=${salaryPeriodId}`,
      this.httpOptions
    );
  }

}
