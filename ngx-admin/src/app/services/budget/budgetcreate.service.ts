import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BudgetcreateService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getBudget(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Budget/getBudgetMaster?companyId=0&sbuId=0&budgetMasterId=0`,
      this.httpOptions
    );
  }

  public getBudgetById(budgetMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Budget/getBudgetMaster?companyId=0&sbuId=0&budgetMasterId=${budgetMasterId}`,
      this.httpOptions
    );
  }

  public saveBudget(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Budget/setBudgetMaster`,
      master,
      this.httpOptions
    );
  }

  public deleteBudget(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Budget/deleteBudgetMaster`,
      master,
      this.httpOptions
    );
  }

  public getBudgetDetailsByMasterId(budgetMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Budget/getBudgetDetailsByMasterId?budgetMasterId=${budgetMasterId}`,
      this.httpOptions
    );
  }

}
