import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getBranch(): Observable<any> {     
    return this.http.get<any>(
      `${this.apiUrl}Sbu/getSbu?sbuId=0&companyId=0`,
      this.httpOptions
    );
  }
  public getBranchById(sbuId: any) {
    
    return this.http.get<any>(
      `${this.apiUrl}Sbu/getSbu?sbuId=${sbuId}&companyId=0`,
      this.httpOptions
    );
  }
  public saveBranch(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Sbu/setSbu`,
      master,
      this.httpOptions
    );
  }
  public deleteBranch(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Sbu/deleteSbu`,
      master,
      this.httpOptions
    );
  }
}
