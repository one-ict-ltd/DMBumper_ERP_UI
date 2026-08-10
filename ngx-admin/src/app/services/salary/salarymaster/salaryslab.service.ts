import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SalaryslabService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public SaveSalarySlab(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryMaster/SaveSalarySlab`,
      master,
      this.httpOptions
    );
  }

  public GetSalarySlabById(salarySlabId, salaryGradeId) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryMaster/GetSalarySlabById?salarySlabId=${salarySlabId}&salaryGradeId=${salaryGradeId}`,
      this.httpOptions
    );
  }

  public GetDuplicateSalarySlab(salarySlabId, salaryGradeId, slabName) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryMaster/GetDuplicateSalarySlab?salarySlabId=${salarySlabId}&salaryGradeId=${salaryGradeId}&slabName=${slabName}`,
      this.httpOptions
    );
  }

  public DeleteSalarySlabById(salarySlabId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryMaster/DeleteSalarySlabById`,
      salarySlabId,
      this.httpOptions
    );
  }
}
