import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";
import { NbDialogService, NbToastrService } from "@nebular/theme";

@Injectable({
  providedIn: 'root'
})
export class EmployeeinformationService {
  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;
  constructor(private http: HttpClient, private commonService: CommonService,
    private toastrService: NbToastrService,) { }

  public GetMaxEmployeeNo(companyId) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetMaxEmployeeNo?companyId=${companyId}`,
      this.httpOptions
    );
  }

  public SaveEmployeeBasicInfo(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}EmployeeInformation/SaveEmployeeBasicInfo`,
      master,
      this.httpOptions
    );
  }

  public UpdateSalesLimit(territoryCode: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}EmployeeInformation/UpdateSalesLimit`,
      `"${territoryCode}"`,
      this.httpOptions
    );
  }

  public GetEmployeeBasicInfoById(employeeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetEmployeeBasicInfoById?employeeId=${employeeId}`,
      this.httpOptions
    );
  }

  public GetEmployeeBasicInfoByCompanyId(employeeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetEmployeeBasicInfoByCompanyId?employeeId=${employeeId}`,
      this.httpOptions
    );
  }

  public GetEmployeeBasicInfoByIdNew() {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetEmployeeBasicInfoByIdNew`,
      this.httpOptions
    );
  }

  public GetEmployeeBasicInfoByIdOptimized() {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetEmployeeBasicInfoByIdOptimized`,
      this.httpOptions
    );
  }

  public GetEmployeeBasicInfoByIdForESS() {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetEmployeeBasicInfoByIdForESS`,
      this.httpOptions
    );
  }

  public GetLeaveSummaryForESSJson() {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetLeaveSummaryForESSJson`,
      this.httpOptions
    );
  }

  public GetCelebtationForESSJson() {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetCelebtationForESSJson`,
      this.httpOptions
    );
  }

  public GetDispatcher() {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetDispatcher`,
      this.httpOptions
    );
  }

  public deleteEmployee(employeeId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeInformation/deleteEmployee`,
      employeeId,
      this.httpOptions
    );
  }

  public GetDuplicateEmployeeNo(employeeId, employeeNo) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetDuplicateEmployeeNo?employeeId=${employeeId}&employeeNo=${employeeNo}`,
      this.httpOptions
    );
  }

  public getDuplicateTerritoty(employeeId, PostingLocation, Code) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/getDuplicateTerritoty?employeeId=${employeeId}&PostingLocation=${PostingLocation}&Code=${Code}`,
      this.httpOptions
    );
  }

  public GetEmployeeInfoLoadById(employeeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetEmployeeInfoLoadById?employeeId=${employeeId}`,
      this.httpOptions
    );
  }
  public GetEmployeeInfoWhoHasLeaveById(employeeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetEmployeeInfoWhoHasLeaveById?employeeId=${employeeId}`,
      this.httpOptions
    );
  }

  public GetEmployeeInfoLoadByIdOptimized(employeeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetEmployeeInfoLoadByIdOptimized?employeeId=${employeeId}`,
      this.httpOptions
    );
  }
  public GetEmployeeInfoLoadByIdOptimizedForPaySlip(employeeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetEmployeeInfoLoadByIdOptimizedForPaySlip?employeeId=${employeeId}`,
      this.httpOptions
    );
  }

  public GetEmployeeInfoByPosting(employeeId: any) {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetEmployeeInfoByPosting?employeeId=${employeeId}`,
      this.httpOptions
    );
  }
  public SaveLoanInfo(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}EmployeeInformation/SaveLoanInfo`,
      master,
      this.httpOptions
    );
  }
  public SaveManualAttendance(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Attendance/SaveManualAttendance`,
      master,
      this.httpOptions
    );
  }
  public UpdatePostingLocation(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}EmployeeInformation/UpdatePostingLocation`,
      master,
      this.httpOptions
    );
  }

  public GetLoanInformation(loanId: any, employeeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetLoanInformation?loanId=${loanId}&employeeId=${employeeId}`,
      this.httpOptions
    );
  }

  public GetEmployeeLoanDetails(loanId: any) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetEmployeeLoanDetails?&loanId=${loanId}`,
      this.httpOptions
    );
  }

  public GetManualAttendance(manualAttendanceId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Attendance/GetManualAttendance?manualAttendanceId=${manualAttendanceId}`,
      this.httpOptions
    );
  }

  //master data load API

  public GetEmployeeType(employeeTypeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeType/getEmployeeType?employeeTypeId=${employeeTypeId}`,
      this.httpOptions
    );
  }

  public GetReligion(religionId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Religion/getEmployeeReligion?religionId=${religionId}`,
      this.httpOptions
    );
  }

  public GetCompanyBank(companybankId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Religion/getCompanyBank?companyBankId=${companybankId}`,
      this.httpOptions
    );
  }

  public GetSalaryDepot(salaryDepotId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Religion/getSalaryDepot?salaryDepotId=${salaryDepotId}`,
      this.httpOptions
    );
  }

  public getBloodGroup(bloodGroupId: any) {
    return this.http.get<any>(
      `${this.apiUrl}BloodGroup/getBloodGroup?bloodGroupId=${bloodGroupId}`,
      this.httpOptions
    );
  }

  public getGender(bloodGroupId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Gender/getGender?genderId=${bloodGroupId}`,
      this.httpOptions
    );
  }

  public getUniqueIdentity(uniqueIdentityId: any) {
    return this.http.get<any>(
      `${this.apiUrl}UniqueIdentity/getUniqueIdentity?uniqueIdentityId=${uniqueIdentityId}`,
      this.httpOptions
    );
  }

  public getActivityStatus(activityStatusId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ActivityStatus/getActivityStatus?activityStatusId=${activityStatusId}`,
      this.httpOptions
    );
  }
  public getEmployeeStatus(employeeStatusId: any) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeStatus/getEmployeeStatus?employeeStatusId=${employeeStatusId}`,
      this.httpOptions
    );
  }


  public GetEmployeeInfoUploadDataVerify(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeInformation/GetEmployeeInfoUploadDataVerify`,
      master,
      this.httpOptions
    );
  }
  public SaveEmployeeInfofromExcel(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeInformation/SaveEmployeeInfoFromExcelFile`,
      master,
      this.httpOptions
    );
  }


  public GetInactiveEmployeeInfoUploadDataVerify(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeInformation/GetInactiveEmployeeInfoUploadDataVerify`,
      master,
      this.httpOptions
    );
  }

  public SaveInactiveEmployeeInfofromExcel(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeInformation/SaveInactiveEmployeeInfoFromExcelFile`,
      master,
      this.httpOptions
    );
  }

  ///////////////// employeeTransfer ////////////////////////

  public SaveEmployeeTransfer(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}EmployeeInformation/SaveEmployeeTransfer`,
      master,
      this.httpOptions
    );
  }

  public GetEmployeeTransferById(employeeTransferId: any) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetEmployeeTransferById?employeeTransferId=${employeeTransferId}`,
      this.httpOptions
    );
  }

  public deleteEmployeeTransfer(employeeTransferId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeInformation/deleteEmployeeTransfer`,
      employeeTransferId,
      this.httpOptions
    );
  }


  ///////////////// employee Promo ////////////////////////

  public SaveEmployeePromotion(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}EmployeeInformation/SaveEmployeePromotion`,
      master,
      this.httpOptions
    );
  }

  public GetEmployeePromotionById(employeePromotionId: any) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetEmployeePromotionById?employeePromotionId=${employeePromotionId}`,
      this.httpOptions
    );
  }

  public GetEmployeeConfirmationById(employeePromotionId: any) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetEmployeeConfirmationById?employeePromotionId=${employeePromotionId}`,
      this.httpOptions
    );
  }

  public deleteEmployeePromotion(employeePromotionId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeInformation/deleteEmployeePromotion`,
      employeePromotionId,
      this.httpOptions
    );
  }


}
