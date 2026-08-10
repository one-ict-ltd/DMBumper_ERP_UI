import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})

export class AccountnatureService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) {}

  public getAccountNature(): Observable<any> { 
    return this.http.get<any>(
      `${this.apiUrl}GroupNature/getgroupNature?groupNatureId=0`,
      this.httpOptions
    );
  }
  public getAccountNatureById(groupNatureId: any) {
    return this.http.get<any>(
      `${this.apiUrl}GroupNature/getgroupNature?groupNatureId=${groupNatureId}`,
      this.httpOptions
    );
  }
  public saveAccountNature(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}GroupNature/setgroupNature`,
      master,
      this.httpOptions
    );
  }
  public deleteAccountNature(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}GroupNature/deletegroupNature`,
      master,
      this.httpOptions
    );   
  }
   
}
