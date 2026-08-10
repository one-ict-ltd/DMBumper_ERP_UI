import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SalesapprovalmatrixService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public SaveApprovalMatrix(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ApprovalMatrix/SaveApprovalMatrix`, master,
      this.httpOptions
    );
  }

  public GetApprovalMatrix(approvalTypeId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}ApprovalMatrix/GetApprovalMatrix?approvalTypeId=${approvalTypeId}`,
      this.httpOptions
    );
  }

  public GetApprovalMatrixByTypeId(approvalTypeId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}ApprovalMatrix/GetApprovalMatrixByTypeId?approvalTypeId=${approvalTypeId}`,
      this.httpOptions
    );
  }

  public DeleteApprovalMatrixByTypeId(approvalTypeId: any): Observable<string> {
    debugger
    return this.http.post<string>(
      `${this.apiUrl}ApprovalMatrix/DeleteApprovalMatrixByTypeId`, approvalTypeId,
      this.httpOptions
    );
  }

  // ApprovalType 
  public GetApprovalTypeById(approvalTypeId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ApprovalMatrix/GetApprovalTypeById?approvalTypeId=${approvalTypeId}`,
      this.httpOptions
    );
  }

  public DeleteApprovalTypeById(approvalTypeId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ApprovalMatrix/DeleteApprovalTypeId`, approvalTypeId,
      this.httpOptions
    );
  }

  public SaveApprovalType(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ApprovalMatrix/SaveApprovalType`, master,
      this.httpOptions
    );
  }

  // Approver Type 

  public SaveApproverType(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ApprovalMatrix/SaveApproverType`, master,
      this.httpOptions
    );
  }

  public GetApproverTypeId(approverTypeId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ApprovalMatrix/GetApproverTypeId?approverTypeId=${approverTypeId}`,
      this.httpOptions
    );
  }

  public DeleteApproverTypeById(approverTypeId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ApprovalMatrix/DeleteApproverTypeId`, approverTypeId,
      this.httpOptions
    );
  }


  public GetApproverTypeById(approverTypeId, approvalTypeId): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}ApprovalMatrix/GetApproverTypeById?approverTypeId=${approverTypeId}&approvalTypeId=${approvalTypeId}`,
      this.httpOptions
    );
  }
}
