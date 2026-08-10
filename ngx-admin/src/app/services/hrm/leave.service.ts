import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { connect } from "node:net";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})

export class LeaveService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  //Leave type service

  public getLeaveType(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}LeaveType/getleaveType?leaveTypeId=0`,
      this.httpOptions
    );
  }

  public getLeaveTypeById(leaveTypeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}LeaveType/getleaveType?leaveTypeId=${leaveTypeId}`,
      this.httpOptions
    );
  }

  public GetManualLeaveRegisterByemployeeIdJson() {
    return this.http.get<any>(
      `${this.apiUrl}LeaveRegister/GetManualLeaveRegisterByemployeeIdJson`,
      this.httpOptions
    );
  }

  public GetLeaveRegisterByIdJson(leaveId: any) {
    return this.http.get<any>(
      `${this.apiUrl}LeaveRegister/GetLeaveRegisterByIdJson?leaveId=${leaveId}`,
      this.httpOptions
    );
  }

  public GetManualLeaveBalance(employeeId, leaveYearId, leaveTypeId) {
    return this.http.get<any>(
      `${this.apiUrl}LeaveRegister/GetManualLeaveBalance?employeeId=${employeeId}&leaveYearId=${leaveYearId}&leaveTypeId=${leaveTypeId}`,
      this.httpOptions
    );
  }

  public saveLeaveType(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}LeaveType/setleaveType`,
      master,
      this.httpOptions
    );
  }

  public deleteLeaveType(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}LeaveType/deleteleaveType`,
      master,
      this.httpOptions
    );
  }

  public GetSalesDashboardData(fromDate, toDate) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalesDashboardData?fromDate=${fromDate}&toDate=${toDate}`,
      this.httpOptions
    );
  }

  public GetSalesDashboardDataDetails(fromDate, toDate, type, partyId) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalesDashboardDataDetails?fromDate=${fromDate}&toDate=${toDate}&type=${type}&partyId=${partyId}`,
      this.httpOptions
    );
  }


  public GetSalesDashboardDataDetailsPartyWise(fromDate, toDate, type) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalesDashboardDataDetailsPartyWise?fromDate=${fromDate}&toDate=${toDate}&type=${type}`,
      this.httpOptions
    );
  }

  public getDuplicateLeaveType(leaveTypeId, leaveTypeName) {
    return this.http.get<any>(
      `${this.apiUrl}LeaveType/getDuplicateleaveType?leaveTypeId=${leaveTypeId}&typeName=${leaveTypeName}`,
      this.httpOptions
    );
  }

  //Leave Year Service

  public getLeaveYear(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}LeaveYear/getleaveYear?leaveYearId=0`,
      this.httpOptions
    );
  }

  public getLeaveYearById(leaveYearId: any) {
    return this.http.get<any>(
      `${this.apiUrl}LeaveYear/getleaveYear?leaveYearId=${leaveYearId}`,
      this.httpOptions
    );
  }

  public saveLeaveYear(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}LeaveYear/setleaveYear`,
      master,
      this.httpOptions
    );
  }

  public deleteLeaveYear(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}LeaveYear/deleteleaveYear`,
      master,
      this.httpOptions
    );
  }

  public getDuplicateLeaveYear(leaveYearId, yearName) {
    return this.http.get<any>(
      `${this.apiUrl}LeaveYear/getDuplicateleaveYear?leaveYearId=${leaveYearId}&yearName=${yearName}`,
      this.httpOptions
    );
  }


  //Leave Policy Service

  public getLeavePolicy(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}LeavePolicy/getleavePolicy?leavePolicyId=0`,
      this.httpOptions
    );
  }

  public getLeavePolicyById(leavePolicyId: any) {
    return this.http.get<any>(
      `${this.apiUrl}LeavePolicy/getleavePolicy?leavePolicyId=${leavePolicyId}`,
      this.httpOptions
    );
  }

  public getleavePolicyByYearId(leaveYearId: any) {
    return this.http.get<any>(
      `${this.apiUrl}LeavePolicy/getleavePolicyByYearId?leaveYearId=${leaveYearId}`,
      this.httpOptions
    );
  }

  public saveLeavePolicy(master: any): Observable<string> {
    //console.log(master);
    return this.http.post<string>(
      `${this.apiUrl}LeavePolicy/setleavePolicy`,
      master,
      this.httpOptions
    );
  }

  public deleteLeavePolicy(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}LeavePolicy/deleteleavePolicy`,
      master,
      this.httpOptions
    );
  }

  public processLeavePolicy(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}LeavePolicy/processleavePolicy`,
      master,
      this.httpOptions
    );
  }

  public getDuplicateLeavePolicy(leavePolicyId, leaveYearId, leaveTypeId) {
    return this.http.get<any>(
      `${this.apiUrl}LeavePolicy/getDuplicateleavePolicy?leavePolicyId=${leavePolicyId}&leaveYearId=${leaveYearId}&leaveTypeId=${leaveTypeId}`,
      this.httpOptions
    );
  }




  //Leave Opening Balance Service

  public getLeaveOpeningBalance(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}LeaveOpeningBalance/getleaveOpeningBalance?leaveOpeningBalanceId=0`,
      this.httpOptions
    );
  }

  public getLeaveOpeningBalanceById(leaveOpeningBalanceId: any) {
    return this.http.get<any>(
      `${this.apiUrl}LeaveOpeningBalance/getleaveOpeningBalance?leaveOpeningBalanceId=${leaveOpeningBalanceId}`,
      this.httpOptions
    );
  }

  public getleaveOpeningBalanceByYearId(leaveYearId: any) {
    return this.http.get<any>(
      `${this.apiUrl}LeaveOpeningBalance/getleaveOpeningBalanceByYearId?leaveYearId=${leaveYearId}`,
      this.httpOptions
    );
  }

  public saveLeaveOpeningBalance(master: any): Observable<string> {
    //console.log(master);
    return this.http.post<string>(
      `${this.apiUrl}LeaveOpeningBalance/setleaveLeaveOpeningBalance`,
      master,
      this.httpOptions
    );
  }

  public deleteLeaveOpeningBalance(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}LeaveOpeningBalance/deleteleaveOpeningBalance`,
      master,
      this.httpOptions
    );
  }

  public deleteleaveRegister(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}LeaveRegister/deleteleaveRegister`,
      master,
      this.httpOptions
    );
  }

  public getDuplicateLeaveOpeningBalance(leaveOpeningBalanceId, leaveYearId, leaveTypeId, employeeId) {
    return this.http.get<any>(
      `${this.apiUrl}LeaveOpeningBalance/getDuplicateleaveOpeningBalance?leaveOpeningBalanceId=${leaveOpeningBalanceId}&leaveYearId=${leaveYearId}&leaveTypeId=${leaveTypeId}&employeeId=${employeeId}`,
      this.httpOptions
    );
  }

  public getDuplicateleaveRegister(leaveRegisterId, startDate, endDate, employeeId) {
    return this.http.get<any>(
      `${this.apiUrl}LeaveRegister/getDuplicateleaveRegister?leaveRegisterId=${leaveRegisterId}&startDate=${startDate}&endDate=${endDate}&employeeId=${employeeId}`,
      this.httpOptions
    );
  }


  //Leave Opening Balance Service

  public getLeaveApprovalMatrix(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}LeaveApprovalMatrix/GetApprovalMatrix?employeeId=0`,
      this.httpOptions
    );
  }

  public getLeaveApprovalMatrixByemployeeId(employeeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}LeaveApprovalMatrix/GetApprovalMatrix?employeeId=${employeeId}`,
      this.httpOptions
    );
  }

  public SaveApprovalMatrix(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}LeaveApprovalMatrix/SaveApprovalMatrix`, master,
      this.httpOptions
    );
  }

  public deleteLeaveApprovalMatrix(employeeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}LeaveApprovalMatrix/DeleteApprovalMatrixByemployeeId?employeeId=${employeeId}`,
      this.httpOptions
    );
  }

  public DeletePurchaseApprovalMatrixByemployeeId(employeeId: number, productTypeId: number) {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/DeletePurchaseApprovalMatrixByemployeeId?employeeId=${employeeId}&productTypeId=${productTypeId}`,
      this.httpOptions
    );
  }

  //Leave Register
  public GetLeaveBalance(leaveYearId, leaveTypeId) {
    return this.http.get<any>(
      `${this.apiUrl}LeaveRegister/GetLeaveBalance?leaveYearId=${leaveYearId}&leaveTypeId=${leaveTypeId}`,
      this.httpOptions
    );
  }


  public GetLeaveRegisterByemployeeIdJson() {
    return this.http.get<any>(
      `${this.apiUrl}LeaveRegister/GetLeaveRegisterByemployeeIdJson`,
      this.httpOptions
    );
  }
  public GetLateClarificationByemployeeIdJson() {
    return this.http.get<any>(
      `${this.apiUrl}LeaveRegister/GetLateClarificationByemployeeIdJson`,
      this.httpOptions
    );
  }
  public GetLeaveRegisterListByemployeeIdJson(fromDate: Date, toDate: Date, employeeId: number) {
    debugger
    return this.http.get<any>(
      `${this.apiUrl}LeaveRegister/GetLeaveRegisterListByemployeeIdJson?fromDate=${fromDate}&toDate=${toDate}&empId=${employeeId}`,
      this.httpOptions
    );
  }
  public GetLeaveRegisterForApprovalByEmployeeIdJson() {
    return this.http.get<any>(
      `${this.apiUrl}LeaveRegister/GetLeaveRegisterForApprovalByEmployeeIdJson`,
      this.httpOptions
    );
  }
  public GetLateAttandanceClarificationForApprovalByEmployeeIdJson() {
    return this.http.get<any>(
      `${this.apiUrl}LeaveRegister/GetLateAttandanceClarificationForApprovalByEmployeeIdJson`,
      this.httpOptions
    );
  }

  public SaveLeaveRegister(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}LeaveRegister/SaveLeaveRegister`, master,
      this.httpOptions
    );
  }

  public SetApproveLeave(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}LeaveRegister/SetApproveLeave`, master,
      this.httpOptions
    );
  }
  public SetApproveLateAttandance(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}LeaveRegister/SetApproveLateAttandance`, master,
      this.httpOptions
    );
  }

  public getTargetVsAchievementData(depotCode, territoryCode, fromDate, toDate) {
    return this.http.get<any>(
      `${this.apiUrl}SalesCollection/GetCollectionAndSalesTargetVsAchievement?depotCode=${depotCode}&territoryCode=${territoryCode}&fDate=${fromDate}&tDate=${toDate}`,
      this.httpOptions
    );
  }

}
