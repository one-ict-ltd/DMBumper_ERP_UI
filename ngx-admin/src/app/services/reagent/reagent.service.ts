import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReagentService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  constructor(private http: HttpClient, private commonService: CommonService) { }

  public GetMaxReagentIssueMasterNumber(issueDate: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ReagentIssue/GetMaxReagentIssueNumber?reagentIssueDate=${issueDate}`,
      this.httpOptions
    );
  }
  public GetIssueMasterByIdDate(fromDate: Date, toDate: Date, issueId: any, typeOfIssue: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ReagentIssue/GetIssueReagentMasterByIdDate?fromDate=${fromDate}&toDate=${toDate}&issueId=${issueId}`,
      this.httpOptions
    );
  }

  public GetReagentRequisitionNumberforIssue(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ReagentIssue/GetReagentRequisitionNumberforIssue`,
      this.httpOptions
    );
  }

  public GetReagentRequisitionByIdToIssue(reagentReqId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ReagentIssue/GetReagentRequisitionByIdToIssue?reagentReqId=${reagentReqId}`,
      this.httpOptions
    );
  }

  public SaveReagentIssueMaster(master: any): Observable<any> {
    debugger
    return this.http.post<any>(
      `${this.apiUrl}ReagentIssue/SaveReagentIssueMaster`, master, this.httpOptions
    );
  }

  public getReagentIssueListByDate(fromDate: Date, toDate: Date, issueId: any, typeOfIssue: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ReagentIssue/getReagentIssueListByDate?fromDate=${fromDate}&toDate=${toDate}&issueId=${issueId}&typeOfIssue=${typeOfIssue}`,
      this.httpOptions
    );
  }

  public getReagentIssueDetailsByMasterId(issueId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ReagentIssue/getReagentIssueDetailsByMasterId?issueId=${issueId}`,
      this.httpOptions
    );
  }

  public DeleteReagentIssueById(issueId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ReagentIssue/DeleteReagentIssueMasterById`, issueId,
      this.httpOptions
    );
  }

  public GetMaxReagentReceiveNumber(receiveDate: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ReagentReceive/GetMaxReagentReceiveNumber?receiveDate=${receiveDate}`,
      this.httpOptions
    );
  }

  public GetReagentIssueNumberforReceive(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ReagentReceive/GetReagentIssueNumberForReceive`,
      this.httpOptions
    );
  }
  public GetReagentIssueDetailsByMasterIdForReceive(issueId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ReagentReceive/GetReagentIssueDetailsByMasterIdForReceive?issueId=${issueId}`,
      this.httpOptions
    );
  }

  public SaveReagentReceiveMaster(master: any): Observable<any> {
    debugger
    return this.http.post<any>(
      `${this.apiUrl}ReagentReceive/SaveReagentReceiveMaster`, master, this.httpOptions
    );
  }

  public getReagentReceiveListByDate(fromDate: Date, toDate: Date, receiveId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ReagentReceive/getReagentReceiveListByDate?fromDate=${fromDate}&toDate=${toDate}&receiveId=${receiveId}`,
      this.httpOptions
    );
  }

  public GetReagentReceiveDetialsByMasterId(receiveId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductReceive/getReagentReceiveDetailsByMasterId?receiveId=${receiveId}`,
      this.httpOptions
    );
  }
  public DeleteReagentReceiveById(receiveId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductReceive/DeleteReagentReceiveById`, receiveId,
      this.httpOptions
    );
  }

}
