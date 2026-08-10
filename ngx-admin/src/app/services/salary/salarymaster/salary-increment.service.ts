import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class SalaryIncrementService {
  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public GetEmployeeSalaryIncrementUploadDataVerify(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryStructure/GetEmployeeIncrementUploadDataVerify`,
      master,
      this.httpOptions
    );
  }
  public SaveEmployeeSalaryIncrementUpload(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryStructure/SaveEmployeeSalaryIncrementUpload`,
      master,
      this.httpOptions
    );
  }
}
