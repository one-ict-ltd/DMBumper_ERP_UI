import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BudgetheadService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getBudgetHead(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Budget/getBudgetHeadMaster?companyId=0&sbuId=0&budgetMainHeadId=0&budgetSubHeadId=0&budgetHeadMasterId=0`,
      this.httpOptions
    );
  }

  public getBudgetHeadById(budgetHeadMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Budget/getBudgetHeadMaster?companyId=0&sbuId=0&budgetMainHeadId=0&budgetSubHeadId=0&budgetHeadMasterId=${budgetHeadMasterId}`,
      this.httpOptions
    );
  }

  public saveBudgetHead(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Budget/setBudgetHeadMaster`,
      master,
      this.httpOptions
    );
  }

  public deleteBudgetHead(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Budget/deleteBudgetHeadMaster`,
      master,
      this.httpOptions
    );
  }

  public getBudgetHeadDetailsByMasterId(budgetHeadMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Budget/getBudgetHeadDetailsByMasterId?budgetHeadMasterId=${budgetHeadMasterId}`,
      this.httpOptions
    );
  }

}
