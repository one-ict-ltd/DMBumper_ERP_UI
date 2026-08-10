import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModulepermissionService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getModulePermission(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getModulePermission?companyId=0&modulePermissionId=0`,
      this.httpOptions
    );
  }

  public getModulePermissionById(companyId, modulePermissionId) {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getModulePermission?companyId=${companyId}&modulePermissionId=${modulePermissionId}`,
      this.httpOptions
    );
  }
  public saveModulePermission(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/setModulePermission`,
      master,
      this.httpOptions
    );
  }
  public deleteModulePermission(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/deleteModulePermission`,
      master,
      this.httpOptions
    );
  }

}
