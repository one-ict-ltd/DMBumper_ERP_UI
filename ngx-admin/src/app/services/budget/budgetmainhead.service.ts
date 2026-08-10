import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BudgetmainheadService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getBudgetMainHead(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Budget/getBudgetMainHead?companyId=0&sbuId=0&budgetMainHeadId=0`,
      this.httpOptions
    );
  }

  public getBudgetMainHeadById(budgetMainHeadId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Budget/getBudgetMainHead?companyId=0&sbuId=0&budgetMainHeadId=${budgetMainHeadId}`,
      this.httpOptions
    );
  }

  public saveBudgetMainHead(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Budget/setBudgetMainHead`,
      master,
      this.httpOptions
    );
  }

  public deleteBudgetMainHead(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Budget/deleteBudgetMainHead`,
      master,
      this.httpOptions
    );
  }
}
