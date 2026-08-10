import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserwisecompanyService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getUserWiseCompany(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getUserWiseCompany`,
      this.httpOptions
    );
  }
  public getUserWiseCompanyById(userCompanyId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getUserWiseCompany?userCompanyId=${userCompanyId}`,
      this.httpOptions
    );
  }
  public saveUserWiseCompany(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/setUserWiseCompany`,
      master,
      this.httpOptions
    );
  }
  public deleteUserWiseCompany(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/deleteUserWiseCompany`,
      master,
      this.httpOptions
    );
  }


}
