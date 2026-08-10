import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SalarygradepercentService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public SaveSalaryGradePercent(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryMaster/SaveSalaryGradePercent`,
      master,
      this.httpOptions
    );
  }

  public GetSalaryGradePercentById(salaryGradePercentId, salaryGradeId, salaryHeadId) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryMaster/GetSalaryGradePercentById?salaryGradePercentId=${salaryGradePercentId}&salaryGradeId=${salaryGradeId}&salaryHeadId=${salaryHeadId}`,
      this.httpOptions
    );
  }

  public GetDuplicateSalaryGradePercent(salaryGradePercentId, salaryGradeId, salaryHeadId) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryMaster/GetDuplicateSalaryGradePercent?salaryGradePercentId=${salaryGradePercentId}&salaryGradeId=${salaryGradeId}&salaryHeadId=${salaryHeadId}`,
      this.httpOptions
    );
  }

  public DeleteSalaryGradePercentById(salaryGradePercentId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryMaster/DeleteSalaryGradePercentById`,
      salaryGradePercentId,
      this.httpOptions
    );
  }

  public GetSalaryCalulationTypeById(salaryCalulationTypeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryMaster/GetSalaryCalulationTypeById?salaryCalulationTypeId=${salaryCalulationTypeId}`,
      this.httpOptions
    );
  }
}
