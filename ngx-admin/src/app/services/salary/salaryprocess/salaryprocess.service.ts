import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SalaryprocessService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public ProcessEmployeesSalary(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryStructure/ProcessEmployeesSalary`,
      master,
      this.httpOptions
    );
  }

  public GetSalaryMasterByPeriodId(salaryPeriodId, salaryDepotName: string = null) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryStructure/GetSalaryMasterByPeriodId?salaryPeriodId=${salaryPeriodId}&salaryDepotName=${salaryDepotName}`,
      this.httpOptions
    );
  }


}
