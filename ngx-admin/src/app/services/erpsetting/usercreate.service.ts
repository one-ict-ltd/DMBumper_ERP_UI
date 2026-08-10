import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsercreateService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getEmployee(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/getEmployee?companyId=0&employeeId=0`,
      this.httpOptions
    );
  }
  public getEmployeeById(companyId, employeeId) {

    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/getEmployee?companyId=${companyId}&employeeId=${employeeId}`,
      this.httpOptions
    );
  }
  public saveEmployee(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeInformation/setEmployeeForCreateUser`,
      master,
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

}
