import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SalarygradeService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public SaveSalaryGrade(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryMaster/SaveSalaryGrade`,
      master,
      this.httpOptions
    );
  }

  public GetSalaryGradeById(salaryGradeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryMaster/GetSalaryGradeById?salaryGradeId=${salaryGradeId}`,
      this.httpOptions
    );
  }

  public GetDuplicateSalaryGrade(salaryGradeId, gradeName) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryMaster/GetDuplicateSalaryGrade?salaryGradeId=${salaryGradeId}&gradeName=${gradeName}`,
      this.httpOptions
    );
  }

  public DeleteSalaryGradeById(salaryGradeId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryMaster/DeleteSalaryGradeById`,
      salaryGradeId,
      this.httpOptions
    );
  }
}
