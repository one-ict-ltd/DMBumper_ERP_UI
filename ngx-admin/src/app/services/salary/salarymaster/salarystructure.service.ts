import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SalarystructureService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public SaveSalaryEmployeeStructure(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryStructure/SaveSalaryEmployeeStructure`,
      master,
      this.httpOptions
    );
  }

  public GetSalaryAllEmployeeStructure() {
    return this.http.get<any>(
      `${this.apiUrl}SalaryStructure/GetSalaryAllEmployeeStructure`,
      this.httpOptions
    );
  }

  public GetSalaryEmployeeStructureByEmpId(employeeId, salaryHeadType) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryStructure/GetSalaryEmployeeStructureByEmpId?employeeId=${employeeId}&salaryHeadType=${salaryHeadType}`,
      this.httpOptions
    );
  }

  public GetDuplicateSalaryEmployeeStructure(employeeId) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryStructure/GetDuplicateSalaryEmployeeStructure?employeeId=${employeeId}`,
      this.httpOptions
    );
  }

  public DeleteSalaryEmployeeStructureByEmpId(employeeId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryStructure/DeleteSalaryEmployeeStructureByEmpId`,
      employeeId,
      this.httpOptions
    );
  }

  public UpdateSalaryEmployeeStructure(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryStructure/UpdateSalaryEmployeeStructure`,
      master,
      this.httpOptions
    );
  }

}
