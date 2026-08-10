import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsergroupService {
  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getUserGroup(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getUserGroup?userGroupId=0`,
      this.httpOptions
    );
  }
  public getUserGroupById(userGroupId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getUserGroup?userGroupId=${userGroupId}`,
      this.httpOptions
    );
  }
  public saveUserGroup(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/setUserGroup`,
      master,
      this.httpOptions
    );
  }

  public saveUserWiseLedger(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}AccountGroup/saveAccountWiseLedger`,
      master,
      this.httpOptions
    );
  }

  public deleteUserGroup(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/deleteUserGroup`,
      master,
      this.httpOptions
    );
  }
}
