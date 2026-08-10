import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShiftassignService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public AssignShiftGroup(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Attendance/AssignShiftGroup`,
      master,
      this.httpOptions
    );
  }

  public GetShiftAssignById(punchCardId, companyId, sbuId, employeeId, department): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Attendance/GetShiftAssignById?punchCardId=${punchCardId}&companyId=${companyId}&sbuId=${sbuId}&employeeId=${employeeId}&department=${department}`,
      this.httpOptions
    );
  }

  public GetPunchCardById(punchCardId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Attendance/GetPunchCardById?punchCardId=${punchCardId}`,
      this.httpOptions
    );
  }

  public DeletePunchCardById(punchCardId): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Attendance/DeletePunchCardById`,
      punchCardId,
      this.httpOptions
    );
  }

  public UpdatePunchCardNo(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Attendance/UpdatePunchCardNo`,
      master,
      this.httpOptions
    );
  }

}
