import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserpermissionService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getUserPermission(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getUserPermissionGroup?companyId=0&userGroupId=0&userPermissionGroupId=0`,
      this.httpOptions
    );
  }

  public getUserPermissionById(companyId, userGroupId, userPermissionGroupId) {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getUserPermissionGroup?companyId=${companyId}&userGroupId=${userGroupId}&userPermissionGroupId=${userPermissionGroupId}`,
      this.httpOptions
    );
  }
  public saveUserPermission(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/setUserPermissionGroup`,
      master,
      this.httpOptions
    );
  }
  public deleteUserPermission(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/deleteUserPermissionGroup`,
      master,
      this.httpOptions
    );
  }
}
