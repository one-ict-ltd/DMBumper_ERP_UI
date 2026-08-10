import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getCompany(): Observable<any> {
    
    return this.http.get<any>(
      `${this.apiUrl}Company/getCompnay?companyId=0`,
      this.httpOptions
    );
  }
  public getCompanyById(companyId: any) {
    
    return this.http.get<any>(
      `${this.apiUrl}Company/getCompnay?companyId=${companyId}`,
      this.httpOptions
    );
  }
  public saveCompany(master: any): Observable<string> {
    
    return this.http.post<string>(
      `${this.apiUrl}Company/setCompany`,
      master,
      this.httpOptions
    );
  }
  public deleteCompany(master: any): Observable<string> {
    
    return this.http.post<string>(
      `${this.apiUrl}Company/deleteCompany`,
      master,
      this.httpOptions
    );
  }
}
