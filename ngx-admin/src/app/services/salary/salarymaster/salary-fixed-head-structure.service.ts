import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SalaryFixedHeadStructureService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public SaveSalaryEmployeeFixedHeadStructure(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryStructure/SaveSalaryEmployeeFixedHeadStructure`,
      master,
      this.httpOptions
    );
  }

  public SaveEmployeeSalaryStructureUpload(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryStructure/SaveEmployeeSalaryStructureUpload`,
      master,
      this.httpOptions
    );
  }

  public SaveBatchWiseSerialNoUpload(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryStructure/SaveBatchWiseSerialNoUpload`,
      master,
      this.httpOptions
    );
  }

  public SaveEmployeeMobileBill(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryStructure/SaveEmployeeMobileBill`,
      master,
      this.httpOptions
    );
  }
  public GetEmployeeSalaryFixedHeadUploadDataVerify(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryStructure/GetEmployeeSalaryFixedHeadUploadDataVerify`,
      master,
      this.httpOptions
    );
  }

  public GetEmployeeSalaryStructureUploadDataVerify(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryStructure/GetEmployeeSalaryStructureUploadDataVerify`,
      master,
      this.httpOptions
    );
  }
  public GetBatchWiseSerialNoUploadDataVerify(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryStructure/GetBatchWiseSerialNoUploadDataVerify`,
      master,
      this.httpOptions
    );
  }

  public GetMobileBillUploadDataVerify(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryStructure/GetMobileBillUploadDataVerify`,
      master,
      this.httpOptions
    );
  }

  public GetVoucherUploadDataVerify(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryStructure/GetVoucherUploadDataVerify`,
      master,
      this.httpOptions
    );
  }

  public SaveVoucherUploadExcel(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Voucher/setVoucherExcel`,
      master,
      this.httpOptions
    );
  }

  public DeleteSalaryEmployeeFixedHeadStructure(empFixedHeadStructureId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryStructure/DeleteSalaryEmployeeFixedHeadStructure`,
      empFixedHeadStructureId,
      this.httpOptions
    );
  }

  public GetSalaryEmployeeFixedHeadStructureById(empFixedHeadStructureId: any, salaryPeriodIdId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryStructure/GetSalaryEmployeeFixedHeadStructureById?empFixedHeadStructureId=${empFixedHeadStructureId}&salaryPeriodIdId=${salaryPeriodIdId}`,
      this.httpOptions
    );
  }

  public GetEmployeeMobileBillById(salaryPeriodIdId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryStructure/GetEmployeeMobileBillById?salaryPeriodIdId=${salaryPeriodIdId}`,
      this.httpOptions
    );
  }

  public GetSalaryHeadByType(salaryHeadType: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryStructure/GetSalaryHeadByType?salaryHeadType=${salaryHeadType}`,
      this.httpOptions
    );
  }
  public GetSalaryFixedHeadByEmpId(employeeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryStructure/GetSalaryFixedHeadByEmpId?employeeId=${employeeId}`,
      this.httpOptions
    );
  }

  public GetMiosalestargetmasterById(targetMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryStructure/GetMiosalestargetmasterById?targetMasterId=${targetMasterId}`,
      this.httpOptions
    );
  }


  public DeleteMioItemWiseSalesTarget(targetId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryStructure/DeleteMioItemWiseSalesTarget`,
      targetId,
      this.httpOptions
    );
  }

  public SaveMioItemWiseSalesTarget(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryStructure/SaveMioItemWiseSalesTarget`,
      master,
      this.httpOptions
    );
  }

  public GetMioSalesTargetUploadDataVerify(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryStructure/GetMioSalesTargetUploadDataVerify`,
      master,
      this.httpOptions
    );
  }

  public GetMioSalesTargetByTargetMasterId(targetMasterId: any): Observable<string> {
    return this.http.get<any>(
      `${this.apiUrl}SalaryStructure/GetMioSalesTargetMasterWithDetailsById?targetMasterId=${targetMasterId}`,
      this.httpOptions
    );
  }

}
