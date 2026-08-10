import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductionPlanService {
  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  constructor(private http: HttpClient, private commonService: CommonService) { }

  public GetProductionPlanByIdwithDate(fromDate: Date, toDate: Date, planId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionPlan/GetProductionPlanByIdwithDate?fromDate=${fromDate}&toDate=${toDate}&planId=${planId}`,
      this.httpOptions
    );
  }

  public GetProductionPlanById(planId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionPlan/GetProductionPlanById?planId=${planId}`,
      this.httpOptions
    );
  }

  public GetBatchTypeById(batchTypeId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionPlan/GetBatchTypeById?batchTypeId=${batchTypeId}`,
      this.httpOptions
    );
  }

  public SaveProductionPlan(master: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}ProductionPlan/SaveProductionPlan`, master, this.httpOptions
    );
  }
  public DeleteProductionPlanById(planId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductionPlan/DeleteProductionPlanById`, planId,
      this.httpOptions
    );
  }
  public DeleteProductionProcessQaById(productionQaId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductionPlan/DeleteProductionProcessQaById`, productionQaId,
      this.httpOptions
    );
  }
  public getPlanNo(planDate: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurCommon/GetMaxPlanNo?planDate=${planDate}`,
      this.httpOptions
    );
  }

  public getBatchNo(planDate: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurCommon/GetMaxBatchNo?planDate=${planDate}`,
      this.httpOptions
    );
  }

  public CheckDuplicatedBatchNo(planId: any, batchNo: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionPlan/CheckDuplicatedBatchNo?planId=${planId}&batchNo=${batchNo}`,
      this.httpOptions
    );
  }

  public GetProductionPlanForRequisition(planId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionPlan/GetProductionPlanForRequisition?planId=${planId}`,
      this.httpOptions
    );
  }

  public GetProductionPlanForRequisitionWithType(planId: any, bomType: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionPlan/GetProductionPlanForRequisitionWithType?planId=${planId}&bomType=${bomType}`,
      this.httpOptions
    );
  }


  public GetProductionPlanForProdProcess(planId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionPlan/GetProductionPlanForProdProcess?planId=${planId}`,
      this.httpOptions
    );
  }

  public GetProductionPlanBatch(planId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionPlan/GetProductionPlanBatch?planId=${planId}`,
      this.httpOptions
    );
  }
  public GetProductionProcessBatch(planId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionPlan/GetProductionProcessBatch?planId=${planId}`,
      this.httpOptions
    );
  }

  public GetProductionProcessList(planId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionPlan/GetProductionProcesslist?planId=${planId}`,
      this.httpOptions
    );
  }
  public GetProductionPlanForStockIn(planId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionPlan/GetProductionPlanForStockIn?planId=${planId}`,
      this.httpOptions
    );
  }

  public GetBatchWiseProcesses(productWiseSpecificationId: any, productionTypeId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionProcess/GetBatchWiseProcesses?productWiseSpecificationId=${productWiseSpecificationId}&productionTypeId=${productionTypeId}`,
      this.httpOptions
    );
  }
  public GetProductionQAById(productionQaId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionProcess/GetProductionQAById?productionQaId=${productionQaId}`,
      this.httpOptions
    );
  }
  public GetProductionQAByIdDate(fromDate: Date, toDate: Date, productionQaId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionProcess/GetProductionQAByIdDate?fromDate=${fromDate}&toDate=${toDate}&productionQaId=${productionQaId}`,
      this.httpOptions
    );
  }
  public SaveProductionProcess(model: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}ProductionProcess/SaveProductionProcess`, model,
      this.httpOptions
    );
  }
  public SaveProductionQA(model: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}ProductionProcess/SaveProductionQA`, model,
      this.httpOptions
    );
  }
  public DeleteProductionProcessById(planId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductionProcess/DeleteProductionProcessById`, planId,
      this.httpOptions
    );
  }

  public SaveProductionMachine(model: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}ProductionProcess/SaveProductionMachine`, model,
      this.httpOptions
    );
  }

  public SetProcessTransfer(productionPlanId: number, outputQty: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionProcess/SetProcessTransfer?productionPlanId=${productionPlanId}&outputQty=${outputQty}`,
      this.httpOptions
    );
  }

  ////GetProductionPlanProcessById(int? productionPlanId, int? productionTypeId, int? productWiseSpecificationId)
  public GetProductionPlanProcessById(productionPlanId: number, productionTypeId, productWiseSpecificationId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionProcess/GetProductionPlanProcessById?productionPlanId=${productionPlanId}&productionTypeId=${productionTypeId}&productWiseSpecificationId=${productWiseSpecificationId}`,
      this.httpOptions
    );
  }
  public GetProductionPlanMachineById(prdPlanProcessId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionProcess/GetProductionPlanMachineById?prdPlanProcessId=${prdPlanProcessId}`,
      this.httpOptions
    );
  }
  public GetProductionPlanWithType(planId: any, bomType: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionPlan/GetProductionPlanWithType?planId=${planId}&bomType=${bomType}`,
      this.httpOptions
    );
  }

  public GetProductionPlanListForApproval(planId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionPlan/GetProductionPlanByIdForApproval?planId=${planId}`,
      this.httpOptions
    );
  }
  public UpdateProductionPlanForApproval(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductionPlan/UpdateProductionPlanForApproval`,
      master,
      this.httpOptions
    );
  }
  //transfer Note
  public GetMaxTransferNoteNumber(transferDate: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionPlan/GetMaxTransferNoteNumber?transferDate=${transferDate}`,
      this.httpOptions
    );
  }
  public GetTransferedProductionProcessBatch(planId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionPlan/GetTransferedProductionProcessBatch?planId=${planId}`,
      this.httpOptions
    );
  }
  public GetCheckManufacturingAndPackingProcessComplete(planId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionPlan/GetCheckManufacturingAndPackingProcessComplete?planId=${planId}`,
      this.httpOptions
    );

  }
  public SaveTransferNote(master: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}ProductionPlan/SaveTransferNote`, master, this.httpOptions
    );
  }
  public GetTransferNoteById(productTransferId: any, fromDate: Date = null, toDate: Date = null): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionPlan/GetTransferNoteById?productTransferId=${productTransferId}&fDate=${this.commonService.DateFormat(fromDate)}&tDate=${this.commonService.DateFormat(toDate)}`,
      this.httpOptions
    );
  }
  public DeleteTransferNoteById(Id: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductionPlan/DeleteTransferNoteById`, Id,
      this.httpOptions
    );
  }
  public UpdateTransferNote(master: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}ProductionPlan/UpdateTransferNote`, master, this.httpOptions
    );
  }
  public GetTransferNoteByIdForBatch(productTransferId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionPlan/GetTransferNoteByIdForBatch?productTransferId=${productTransferId}`,
      this.httpOptions
    );
  }
  public GetTransferNoteListForStockIn(productTransferId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductionPlan/GetTransferNoteListForStockIn?productTransferId=${productTransferId}`,
      this.httpOptions
    );
  }

  public DeleteProcessMachineById(prdPlanMachineId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductionPlan/deleteProcessMachineById`, prdPlanMachineId,
      this.httpOptions
    );
  }
}
