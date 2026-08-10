import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BudgetsubheadService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getBudgetSubHead(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Budget/getBudgetSubHead?budgetMainHeadId=0&budgetSubHeadId=0`,
      this.httpOptions
    );
  }

  public getBudgetSubHeadById(budgetSubHeadId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Budget/getBudgetSubHead?budgetMainHeadId=0&budgetSubHeadId=${budgetSubHeadId}`,
      this.httpOptions
    );
  }

  public saveBudgetSubHead(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Budget/setBudgetSubHead`,
      master,
      this.httpOptions
    );
  }

  public deleteBudgetSubHead(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Budget/deleteBudgetSubHead`,
      master,
      this.httpOptions
    );
  }
}
