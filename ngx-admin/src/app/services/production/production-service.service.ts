import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductionServiceService {
  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  constructor(private http: HttpClient, private commonService: CommonService) { }


  public GetProductionProcessHeadById(headId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionProcess/GetProductionProcessHeadById?headId=${headId}`,
      this.httpOptions
    );
  }

  public SaveProductionProcessHead(master: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}ProductionProcess/SaveProductionProcessHead`, master, this.httpOptions
    );
  }
  public DeleteProductionProcessHeadById(headId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductionProcess/DeleteProductionProcessById`, headId,
      this.httpOptions
    );
  }

  //RMRequisition
  public GetMaxRMRequisitionMasterNumber(bomDate: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}BomRequisition/GetMaxRMRequisitionMasterNumber?bomDate=${bomDate}`,
      this.httpOptions
    );
  }
  public GetProductSpecificationByBomIdFromBomDetails(bomId: any, bomForId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}BomRequisition/GetProductSpecificationByBomIdFromBomDetails?bomId=${bomId}&bomForId=${bomForId}`,
      this.httpOptions
    );
  }

  public GetRMRequisitionMasterById(requisitionId: any): Observable<any> {
    debugger
    return this.http.get<any>(
      `${this.apiUrl}BomRequisition/GetRMRequisitionMasterById?requisitionId=${requisitionId}`,
      this.httpOptions
    );
  }

  public GetRMRequisitionMasterByIdWithDate(fromDate: Date, toDate: Date, requisitionId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}BomRequisition/GetRMRequisitionMasterByIdWithDate?fromDate=${fromDate}&toDate=${toDate}&requisitionId=${requisitionId}`,
      this.httpOptions
    );
  }
  public GetRMRequisitionDetialsByMasterId(requisitionId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}BomRequisition/GetRMRequisitionDetailsByMasterId?requisitionId=${requisitionId}`,
      this.httpOptions
    );
  }

  public SaveRMRequisitionMaster(master: any): Observable<any> {
    debugger
    return this.http.post<any>(
      `${this.apiUrl}BomRequisition/SaveRMRequisitionMaster`, master, this.httpOptions
    );
  }

  public DeleteRMRequisitionById(requisitionId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}BomRequisition/DeleteRMRequisitionMasterById`, requisitionId,
      this.httpOptions
    );
  }


  //PM requisition
  public GetMaxPMRequisitionMasterNumber(bomDate: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}BomRequisition/GetMaxPMRequisitionMasterNumber?bomDate=${bomDate}`,
      this.httpOptions
    );
  }
  public GetRequisitionNumberforIssue(type: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}BomRequisition/GetRequisitionNumberforIssue?type=${type}`,
      this.httpOptions
    );
  }

  //Machine Info

  public GetMachineInfoById(machineId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionProcess/GetMachineInfoById?machineId=${machineId}`,
      this.httpOptions
    );
  }

  public SaveMachineInfo(master: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}ProductionProcess/SaveMachineInfo`, master, this.httpOptions
    );
  }
  public DeleteMachineInfoById(machineId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductionProcess/DeleteMachineInfoById`, machineId,
      this.httpOptions
    );
  }

  // Product Issue
  public GetMaxIssueMasterNumber(bomDate: any, type: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}BomRequisition/GetMaxIssueMasterNumber?bomDate=${bomDate}&type=${type}`,
      this.httpOptions
    );
  }

  public SaveIssueMaster(master: any): Observable<any> {
    debugger
    return this.http.post<any>(
      `${this.apiUrl}ProductionIssue/SaveIssueMaster`, master, this.httpOptions
    );
  }

  public GetIssueMasterById(issueId: any, typeOfIssue: string): Observable<any> {
    debugger
    return this.http.get<any>(
      `${this.apiUrl}ProductionIssue/GetIssueMasterById?issueId=${issueId}&typeOfIssue=${typeOfIssue}`,
      this.httpOptions
    );
  }
  public GetIssueMasterByIdDate(fromDate: Date, toDate: Date, issueId: any, typeOfIssue: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionIssue/GetIssueMasterByIdDate?fromDate=${fromDate}&toDate=${toDate}&issueId=${issueId}&typeOfIssue=${typeOfIssue}`,
      this.httpOptions
    );
  }
  public GetIssueDetialsByMasterId(issueId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionIssue/GetIssueDetailsByMasterId?issueId=${issueId}`,
      this.httpOptions
    );
  }



  public SaveProductionProcessGroup(master: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}ProductionProcess/SaveProductionProcessGroup`, master, this.httpOptions
    );
  }

  public GetProcessHeadGroupMasterById(phGroupMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionProcess/GetProductionProcessGroupById?phGroupMasterId=${phGroupMasterId}`,
      this.httpOptions
    );
  }

  public GetProcessGroupDetailsById(phGroupMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionProcess/GetProcessGroupDetailsById?phGroupMasterId=${phGroupMasterId}`,
      this.httpOptions
    );
  }



  public DeleteProductionProcessGroupById(phGroupMasterId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductionProcess/DeleteProductionProcessGroupById`, phGroupMasterId,
      this.httpOptions
    );
  }

  public DeleteProcessGroupDetailsById(phGroupDetailId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductionProcess/DeleteProcessGroupDetailsById`, phGroupDetailId,
      this.httpOptions
    );
  }


  public GetGroupWiseProductSpecs(phGroupMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionProcess/GetGroupWiseProductSpecs?phGroupMasterId=${phGroupMasterId}`,
      this.httpOptions
    );
  }


  public SaveProductGroupAssign(master: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}ProductionProcess/SaveProductGroupAssign`, master, this.httpOptions
    );
  }
  public GetProductGroupAssignById(prdGroupAssignId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionProcess/GetProductGroupAssignById?prdGroupAssignId=${prdGroupAssignId}`,
      this.httpOptions
    );
  }



  public DeleteIssueById(issueId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductionIssue/DeleteIssueMasterById`, issueId,
      this.httpOptions
    );
  }

  //Product Receive

  public GetMaxReceiveMasterNumber(bomDate: any, type: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductReceive/GetMaxReceiveMasterNumber?bomDate=${bomDate}&type=${type}`,
      this.httpOptions
    );
  }
  public GetIssueNumberforReceive(type: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductReceive/GetIssueNumberforIssue?type=${type}`,
      this.httpOptions
    );
  }

  public GetIssueMasterByIdForReceive(issueId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductReceive/GetIssueDataById?issueId=${issueId}`,
      this.httpOptions
    );
  }

  public GetIssueDetialsByMasterIdForReceive(issueId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductReceive/GetIssueDetailsByMasterIdForReceive?issueId=${issueId}`,
      this.httpOptions
    );
  }

  public SaveReceiveMaster(master: any): Observable<any> {
    debugger
    return this.http.post<any>(
      `${this.apiUrl}ProductReceive/SaveReceiveMaster`, master, this.httpOptions
    );
  }

  public GetReceiveMasterById(receiveId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductReceive/GetReceiveMasterById?receiveId=${receiveId}`,
      this.httpOptions
    );
  }
  public GetReceiveMasterByIdDate(fromDate: Date, toDate: Date, receiveId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductReceive/GetReceiveMasterByIdDate?fromDate=${fromDate}&toDate=${toDate}&receiveId=${receiveId}`,
      this.httpOptions
    );
  }

  public GetReceiveDetialsByMasterId(receiveId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductReceive/GetReceiveDetailsByMasterId?receiveId=${receiveId}`,
      this.httpOptions
    );
  }

  public DeleteReceiveById(receiveId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductReceive/DeleteReceiveMasterById`, receiveId,
      this.httpOptions
    );
  }
  //product return
  public GetMaxReturnMasterNumber(ReturnDate: any, type: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductReceive/GetMaxReturnMasterNumber?ReturnDate=${ReturnDate}&type=${type}`,
      this.httpOptions
    );
  }
  public GetRequisitionNumberforReturn(type: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductReceive/GetRequisitionNumberforReturn?type=${type}`,
      this.httpOptions
    );
  }
  public GetRMPMReturnDetailsByReqMasterId(requisitionId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductReceive/GetRMPMReturnDetailsByReqMasterId?requisitionId=${requisitionId}`,
      this.httpOptions
    );
  }
  public SaveProductReturn(master: any): Observable<any> {
    debugger
    return this.http.post<any>(
      `${this.apiUrl}ProductReceive/SaveProductReturn`, master, this.httpOptions
    );
  }
  public GetReturnMasterByIdDate(fromDate: Date, toDate: Date, returnId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductReceive/GetReturnMasterByIdDate?fromDate=${fromDate}&toDate=${toDate}&returnId=${returnId}`,
      this.httpOptions
    );
  }
  public DeleteReturnById(ReturnMasterId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductReceive/DeleteReturnMasterById`, ReturnMasterId,
      this.httpOptions
    );
  }

  public GetReturnDetailsByReturnMasterId(ProductReturnMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductReceive/GetReturnDetailsByReturnMasterId?ProductReturnMasterId=${ProductReturnMasterId}`,
      this.httpOptions
    );
  }
  public SaveProductReceiveFromReturn(master: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}ProductReceive/SaveProductReceiveFromReturn`, master, this.httpOptions
    );
  }
  public DeleteProductReceiveFromReturnById(ProductReceiveFromReturnMasterId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductReceive/DeleteProductReceiveFromReturnById`, ProductReceiveFromReturnMasterId,
      this.httpOptions
    );
  }
  public GetReturnFromReceiveByIdDate(fromDate: Date, toDate: Date, ProductReceiveFromReturnMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductReceive/GetReturnFromReceiveByIdDate?fromDate=${fromDate}&toDate=${toDate}&ProductReceiveFromReturnMasterId=${ProductReceiveFromReturnMasterId}`,
      this.httpOptions
    );
  }

  public GetProductReceiveFromReturnDetails(ProductReceiveFromReturnMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductReceive/GetProductReceiveFromReturnDetails?ProductReceiveFromReturnMasterId=${ProductReceiveFromReturnMasterId}`,
      this.httpOptions
    );
  }

  public GetMaxReagentReqMasterNumber(reagentReqDate: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ReagentReq/GetMaxReagentReqNumber?reagentReqDate=${reagentReqDate}`,
      this.httpOptions
    );
  }

  public getAllProductForReagentReq() {
    return this.http.get<any>(
      `${this.apiUrl}ReagentReq/getAllProductForReagentReq`,
      this.httpOptions
    );
  }
  public saveReagentReq(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ReagentReq/saveReagentReq`, master,
      this.httpOptions
    );
  }

  public getReagentRequisition(reagentReqId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ReagentReq/getReagentRequisition?reagentReqId=${reagentReqId}`,
      this.httpOptions
    );
  }
  public deleteReagentReqById(reagentReqId: any): Observable<any> {
    return this.http.get<string>(
      `${this.apiUrl}ReagentReq/deleteReagentReqById?reagentReqId=${reagentReqId}`,
      this.httpOptions
    );
  }
  public getReagentReqDetailsById(reagentReqId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ReagentReq/getReagentReqDetails?reagentReqId=${reagentReqId}`,
      this.httpOptions
    );
  }
}
