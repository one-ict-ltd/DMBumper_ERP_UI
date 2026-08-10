import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SalaryperiodService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public SaveSalaryPeriod(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryMaster/SaveSalaryPeriod`,
      master,
      this.httpOptions
    );
  }

  public SaveEmployeeOtherExpense(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeInformation/SaveEmployeeOtherExpense`,
      master,
      this.httpOptions
    );
  }

  public GetSalaryPeriodById(salaryPeriodId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryMaster/GetSalaryPeriodById?salaryPeriodId=${salaryPeriodId}`,
      this.httpOptions
    );
  }

  public GetEmployeeOtherExpense(otherExpenseId: any) {
    return this.http.get<any>(
      `${this.apiUrl}EmployeeInformation/GetEmployeeOtherExpense?otherExpenseId=${otherExpenseId}`,
      this.httpOptions
    );
  }

  public GetDuplicateSalaryPeriod(salaryPeriodId, fiscalYearId, salaryTypeId, monthName, periodName) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryMaster/GetDuplicateSalaryPeriod?salaryPeriodId=${salaryPeriodId}&fiscalYearId=${fiscalYearId}&salaryTypeId=${salaryTypeId}&monthName=${monthName}&periodName=${periodName}`,
      this.httpOptions
    );
  }

  public DeleteSalaryPeriodById(salaryPeriodId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryMaster/DeleteSalaryPeriodById`,
      salaryPeriodId,
      this.httpOptions
    );
  }

  public DeleteEmployeeOtherExpense(otherExpenseId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}EmployeeInformation/DeleteEmployeeOtherExpense`,
      otherExpenseId,
      this.httpOptions
    );
  }

  public GetSalaryTypeById(salaryTypeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryMaster/GetSalaryTypeById?salaryTypeId=${salaryTypeId}`,
      this.httpOptions
    );
  }

  public GetBonusTypeById(bonusTypeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryMaster/GetBonusTypeById?bonusTypeId=${bonusTypeId}`,
      this.httpOptions
    );
  }
  public GetAllSalaryDepot(): Observable<string> {
    return this.http.get<any>(
      `${this.apiUrl}SalaryMaster/getAllSalaryDepot`,
      this.httpOptions
    );
  }
}
