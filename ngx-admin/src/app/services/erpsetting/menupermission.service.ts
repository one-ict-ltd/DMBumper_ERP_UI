import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MenupermissionService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getMenuPermission(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getMenuPermission?companyId=0&moduleId=0&userGroupId=0&employeeId=0&menuPermissionId=0`,
      this.httpOptions
    );
  }

  public getMenuPermissionById(companyId, moduleId, userGroupId, employeeId, menuPermissionId) {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getMenuPermission?companyId=${companyId}&moduleId=${moduleId}&userGroupId=${userGroupId}&employeeId=${employeeId}&menuPermissionId=${menuPermissionId}`,
      this.httpOptions
    );
  }

  public saveMenuPermission(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/setMenuPermission`,
      master,
      this.httpOptions
    );
  }

  public deleteMenuPermission(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/deleteMenuPermission`,
      master,
      this.httpOptions
    );
  }
}
