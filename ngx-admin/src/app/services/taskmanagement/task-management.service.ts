import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class TaskManagementService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  //#region   Common Service

  public GetTaskTypeList(taskTypeId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}TaskInfo/GetTaskTypeList?taskTypeId=${taskTypeId}`,
      this.httpOptions
    );
  }

  public GetTaskPriorityList(taskPriorityId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}TaskInfo/GetTaskPriorityList?taskPriorityId=${taskPriorityId}`,
      this.httpOptions
    );
  }

  public TaskStatusList(taskStatusId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}TaskInfo/TaskStatusList?taskStatusId=${taskStatusId}`,
      this.httpOptions
    );
  }
  public GetTaskTeamMember(teamLeaderId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}TaskInfo/GetTaskTeamMember?teamLeaderId=${teamLeaderId}`,
      this.httpOptions
    );
  }
  public GetParentTaskList(taskInfoId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}TaskInfo/GetParentTaskList?taskInfoId=${taskInfoId}`,
      this.httpOptions
    );
  }
  public GetParentTask(): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}MyTask/GetParentTaskInfo`,
      this.httpOptions
    );
  }

  //#endregion    Common Service

  //#region Task Info Entry

  public SaveTaskInfo(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}TaskInfo/SaveTaskInfo`,
      master,
      this.httpOptions
    );
  }

  public SaveTaskSatusLog(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}MyTask/SaveTaskStatusLog`,
      master,
      this.httpOptions
    );
  }

  public DeleteTaskInfoById(
    taskInfoId: any
  ): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}TaskInfo/DeleteTaskInfoById`, taskInfoId,
      this.httpOptions
    );
  }

  public GetTaskInfoById(taskInfoId: any, fdate: any, tdate: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}TaskInfo/GetTaskInfoById?taskInfoId=${taskInfoId}&fdate=${fdate}&tdate=${tdate}`,
      this.httpOptions
    );
  }

  public GetMaxTaskCode(taskInfoId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}TaskInfo/GetMaxTaskCode?taskInfoId=${taskInfoId}`,
      this.httpOptions
    );
  }

  //#endregion Task Info Entry



  //#region Team

  public SaveTaskTeam(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}TaskInfo/SaveTaskTeam`,
      master,
      this.httpOptions
    );
  }

  public DeleteTaskTeamById(
    taskTeamMasterIdId: any
  ): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}TaskInfo/DeleteTaskTeamById`, taskTeamMasterIdId,
      this.httpOptions
    );
  }

  public GetTaskTeamById(taskTeamMasterId: any, teamLeaderId: any, fdate: any, tdate: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}TaskInfo/GetTaskTeamById?taskTeamMasterId=${taskTeamMasterId}&teamLeaderId=${teamLeaderId}&fdate=${fdate}&tdate=${tdate}`,
      this.httpOptions
    );
  }


  //#endregion Team



  //#region My Task  

  public GetTodaysTaskInfoByempId(): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}MyTask/GetTodaysTaskInfoByempId`,
      this.httpOptions
    );
  }
  public GetTaskInfoByempIdStatus(statusId: any, taskId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}MyTask/GetTaskInfoByempIdStatus?statusId=${statusId}&taskId=${taskId}`,
      this.httpOptions
    );
  }

  //#endregion

  //#region Employee Monthly Task Assign

   public SaveEmployeeMonthlyTaskAssign(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}TaskInfo/SaveEmployeeMonthlyTaskAssign`,
      master,
      this.httpOptions
    );
  }

  public GetEmployeeMonthlyTaskAssignById(employeeMonthlyTaskAssignId, employeeId) {
    return this.http.get<any>(
      `${this.apiUrl}TaskInfo/GetEmployeeMonthlyTaskAssignById?employeeMonthlyTaskAssignId=${employeeMonthlyTaskAssignId}&employeeId=${employeeId}`,
      this.httpOptions
    );
  }

  public GetEmployeeMonthlyTaskAssignByYearMonth(employeeMonthlyTaskAssignId, employeeId, year, month) {
    return this.http.get<any>(
      `${this.apiUrl}TaskInfo/GetEmployeeMonthlyTaskAssignByYearMonth?employeeMonthlyTaskAssignId=${employeeMonthlyTaskAssignId}&employeeId=${employeeId}&year=${year}&month=${month}`,
      this.httpOptions
    );
  }

  public GetEmployeeMonthlyTaskAssignByYearMonthTeamMemberEmployeeId(employeeMonthlyTaskAssignId, employeeId,teamMemberEmployeeId, year, month) {
    return this.http.get<any>(
      `${this.apiUrl}TaskInfo/GetEmployeeMonthlyTaskAssignByYearMonthTeamMemberEmployeeId?employeeMonthlyTaskAssignId=${employeeMonthlyTaskAssignId}&employeeId=${employeeId}&teamMemberEmployeeId=${teamMemberEmployeeId}&year=${year}&month=${month}`,
      this.httpOptions
    );
  }

  public DeleteEmployeeMonthlyTaskAssignById(employeeMonthlyTaskAssignId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}TaskInfo/DeleteEmployeeMonthlyTaskAssignById`,
      employeeMonthlyTaskAssignId,
      this.httpOptions
    );
  }
  public GetEmployeeTeamByTeamLeadEmployeeId(employeeId) {
    return this.http.get<any>(
      `${this.apiUrl}TaskInfo/GetEmployeeTeamByTeamLeadEmployeeId?employeeId=${employeeId}`,
      this.httpOptions
    );
  }
  public GetCoreFunctionByDepartmentId(departmentId) {
    return this.http.get<any>(
      `${this.apiUrl}TaskInfo/GetCoreFunctionByDepartmentId?departmentId=${departmentId}`,
      this.httpOptions
    );
  }

  //#endregion

  //#region Employee Weekly Task Assign

   public SaveEmployeeWeeklyTaskAssign(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}TaskInfo/SaveEmployeeWeeklyTaskAssign`,
      master,
      this.httpOptions
    );
  }

  public GetEmployeeWeeklyTaskAssignById(employeeWeeklyTaskAssignId, employeeId) {
    return this.http.get<any>(
      `${this.apiUrl}TaskInfo/GetEmployeeWeeklyTaskAssignById?employeeWeeklyTaskAssignId=${employeeWeeklyTaskAssignId}&employeeId=${employeeId}`,
      this.httpOptions
    );
  }

  public GetEmployeeWeeklyTaskAssignByYearMonthWeek(employeeWeeklyTaskAssignId, employeeId, year, month, week) {
    return this.http.get<any>(
      `${this.apiUrl}TaskInfo/GetEmployeeWeeklyTaskAssignByYearMonthWeek?employeeWeeklyTaskAssignId=${employeeWeeklyTaskAssignId}&employeeId=${employeeId}&year=${year}&month=${month}&week=${week}`,
      this.httpOptions
    );
  }

  public DeleteEmployeeWeeklyTaskAssignById(employeeWeeklyTaskAssignId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}TaskInfo/DeleteEmployeeWeeklyTaskAssignById`,
      employeeWeeklyTaskAssignId,
      this.httpOptions
    );
  }
  
  //#endregion

  //#region Employee Weekly My Task Assign

   public SaveEmployeeWeeklyMyTaskAssign(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}TaskInfo/SaveEmployeeWeeklyMyTaskAssign`,
      master,
      this.httpOptions
    );
  }

  //#endregion

}
