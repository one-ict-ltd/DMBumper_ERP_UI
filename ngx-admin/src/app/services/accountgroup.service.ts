import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AccountgroupService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) {}

  public getAccountGroup(): Observable<any> { 
    return this.http.get<any>(
      `${this.apiUrl}AccountGroup/getaccountGroup?accountGroupId=0&groupNatureId=0`,
      this.httpOptions
    );
  }
  public getAccountGroupById(accountGroupId: any,groupNatureId:any) {
    return this.http.get<any>(
      `${this.apiUrl}AccountGroup/getaccountGroup?accountGroupId=${accountGroupId}&groupNatureId=${groupNatureId}`,
      this.httpOptions
    );
  }
  public saveAccountGroup(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}AccountGroup/setaccountGroup`,
      master,
      this.httpOptions
    );
  }
  public deleteAccountGroup(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}AccountGroup/deleteaccountGroup`,
      master,
      this.httpOptions
    );   
  }
  public getDuplicateAccountGroup(accountGroupId,groupName) {
    return this.http.get<any>(
      `${this.apiUrl}AccountGroup/getDuplicateAccountGroup?accountGroupId=${accountGroupId}&groupName=${groupName}`,
      this.httpOptions
    );
  }
}
