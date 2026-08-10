import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SalaryheadService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public SaveSalaryHead(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryMaster/SaveSalaryHead`,
      master,
      this.httpOptions
    );
  }

  public GetSalaryHeadById(salaryHeadId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryMaster/GetSalaryHeadById?salaryHeadId=${salaryHeadId}`,
      this.httpOptions
    );
  }

  public GetDuplicateSalaryHead(salaryHeadId, salaryHeadName) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryMaster/GetDuplicateSalaryHead?salaryHeadId=${salaryHeadId}&salaryHeadName=${salaryHeadName}`,
      this.httpOptions
    );
  }

  public DeleteSalaryHeadById(salaryHeadId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryMaster/DeleteSalaryHeadById`,
      salaryHeadId,
      this.httpOptions
    );
  }
}
