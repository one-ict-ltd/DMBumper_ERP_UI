import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProcessattendanceService {

  apiUrl: string = this.commonService.baseUrl;
  crApiUrl: string = this.commonService.baseReportUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public ProcessAttendance(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Attendance/ProcessAttendance`,
      master,
      this.httpOptions
    );
  }

  public GetAttendanceByDate(startDate: string, endDate: string, companyId: number) {
    return this.http.get<any>(
      `${this.apiUrl}Attendance/GetAttendanceByDate?startDate=${startDate}&endDate=${endDate}&companyId=${companyId}`,
      this.httpOptions
    );
  }
  public DailyAttendanceReport(startDate: string, companyId: number, sbuId: number, departmentId: number) {
    return this.http.get<any>(
      `${this.apiUrl}Attendance/DailyAttendanceReport?startDate=${startDate}&companyId=${companyId}&sbuId=${sbuId}&departmentId=${departmentId}`,
      this.httpOptions
    );
  }

  public DailyAttendanceReportCR(companyId: number, sbuId: number, departmentId: number, startDate: string, EndDate: string, reportFormat: string) {
    return this.http.get<any>(
      `${this.crApiUrl}AttendanceReport/GetDailyAttendanceReport?comId=${companyId}&sbuId=${sbuId}&deptId=${departmentId}&fDate=${startDate}&tDate=${EndDate}&reportFormat=${reportFormat}`,
      this.httpOptions
    );
  }

  public AttendanceSummaryReportCR(companyId: number, sbuId: number, departmentId: number, empId: number, startDate: string, EndDate: string, reportFormat: string) {
    return this.http.get<any>(
      `${this.crApiUrl}AttendanceReport/GetAttendanceSummaryReport?comId=${companyId}&sbuId=${sbuId}&deptId=${departmentId}&empId=${empId}&fDate=${startDate}&tDate=${EndDate}&reportFormat=${reportFormat}`,
      this.httpOptions
    );
  }
  public GetAttendanceSummaryByDateRange(companyId: number, sbuId: number, departmentId: number, empId: number, startDate: string, EndDate: string) {
    return this.http.get<any>(
      `${this.apiUrl}Attendance/GetAttendanceSummaryByDateRange?comId=${companyId}&sbuId=${sbuId}&deptId=${departmentId}&empId=${empId}&fDate=${startDate}&tDate=${EndDate}`,
      this.httpOptions
    );
  }
  public GetEmpWiseAttendanceReport(companyId: number, empId: number, fromDate: string, toDate: string) {
    return this.http.get<any>(
      `${this.apiUrl}Attendance/GetEmpWiseAttendanceReport?companyId=${companyId}&empId=${empId}&fromDate=${fromDate}&toDate=${toDate}`,
      this.httpOptions
    );
  }

  public GetEmpWiseAttendanceReportForESS() {
    return this.http.get<any>(
      `${this.apiUrl}Attendance/GetEmpWiseAttendanceReportForESS`,
      this.httpOptions
    );
  }

  public HrmJoiningReportJson(date: string, locationId: number, departmentId: number) {
    return this.http.get<any>(
      `${this.apiUrl}Attendance/HrmJoiningReportJson?joinDate=${date}&locationId=${locationId}&departmentId=${departmentId}`,
      this.httpOptions
    );
  }

  public HrmHeldupReportJson(date: string, locationId: number, departmentId: number) {
    return this.http.get<any>(
      `${this.apiUrl}Attendance/HrmHeldupReportJson?joinDate=${date}&locationId=${locationId}&departmentId=${departmentId}`,
      this.httpOptions
    );
  }
  public GetEmployeeAttnClarificationById(employeeClarificationId: number) {
    return this.http.get<any>(
      `${this.apiUrl}Attendance/GetEmployeeAttnClarificationById?employeeClarificationId=${employeeClarificationId}`,
      this.httpOptions
    );
  }

  public SaveEmployeeAttnClarification(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Attendance/SaveEmployeeAttnClarification`,
      master,
      this.httpOptions
    );
  }

  public getDuplicateAttendanceDate(employeecClarificationId, attendanceDate, empId) {
    return this.http.get<any>(
      `${this.apiUrl}Attendance/GetDuplicateAttendanceDateForClarification?employeecClarificationId=${employeecClarificationId}&attendanceDate=${attendanceDate}&empId=${empId}`,
      this.httpOptions
    );
  }

  public GetEmployeeClarificationForApprovalJson() {
    return this.http.get<any>(
      `${this.apiUrl}Attendance/GetEmployeeClarificationForApprovalJson`,
      this.httpOptions
    );
  }
  public SetEmployeeClarificationForApproval(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Attendance/SetEmployeeClarificationForApproval`, master,
      this.httpOptions
    );
  }
}
