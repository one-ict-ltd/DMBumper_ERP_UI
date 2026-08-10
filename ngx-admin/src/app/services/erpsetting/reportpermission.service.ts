import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReportpermissionService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getReportPermission(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getReportPermission?employeeId=0&reportPermissionId=0`,
      this.httpOptions
    );
  }

  public getReportPermissionById(employeeId, reportPermissionId) {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getReportPermission?employeeId=${employeeId}&reportPermissionId=${reportPermissionId}`,
      this.httpOptions
    );
  }

  public saveReportPermission(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/setReportPermission`,
      master,
      this.httpOptions
    );
  }

  public deleteReportPermission(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/deleteReportPermission`,
      master,
      this.httpOptions
    );
  }
}
