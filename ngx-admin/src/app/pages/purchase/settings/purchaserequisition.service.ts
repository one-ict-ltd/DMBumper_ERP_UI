import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PurchaserequisitionService {

  apiUrl: string = this.commonService.baseUrl;
  reportApiUrl: string = this.commonService.baseReportUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }
  public getPurchaseRequisitionNo(purchaseRequisitionDate: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurCommon/GetMaxPurchaseReqNumber?purchaseReqDate=${purchaseRequisitionDate}`,
      this.httpOptions
    );
  }
  public GetPurchaseFinalRequisitionById(finalRequisitionId: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/GetPurchaseFinalRequisitionById?finalRequisitionId=${finalRequisitionId}`,

      this.httpOptions
    );
  }


  public isFinalisedRequisitionWordOrderedByFRId(finalRequisitionId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/IsFinalisedRequisitionWordOrderedByFRId?finalRequisitionId=${finalRequisitionId}`,
      this.httpOptions
    );
  }

  public GetPurchaseFinalRequisitionDetailsByMasterIdForPdfReport(finalRequisitionId: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/GetPurchaseFinalRequisitionDetailsByMasterIdForPdfReport?finalRequisitionId=${finalRequisitionId}`,

      this.httpOptions
    );
  }

  public GetAllFinalizeRequisitions(finalRequisitionId: any, approvalStatus: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/GetAllFinalizeRequisitions?finalRequisitionId=${finalRequisitionId}&appStatus=${approvalStatus}`,

      this.httpOptions
    );
  }

  public deletePurchaseFinalRequisitionById(finalRequisitionId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseRequisition/DeleteFinalPurchaseReqById`,
      finalRequisitionId,
      this.httpOptions
    );
  }
 public getRequisitionRevision(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/getRequisitionRevision`,
      this.httpOptions
    );
  }
  public getPurchaseRequisition(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/getPurchaseRequisition`,
      this.httpOptions
    );
  }
  public getPurchaseRequisitionById(purchaseReqId, isHo: any = 0): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/getPurchaseRequisition?purchaseReqId=${purchaseReqId}&isHo=${isHo}`,
      this.httpOptions
    );
  }
  public IsPurchaseRequisitionFinalisedByPRId(purchaseReqId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/IsPurchaseRequisitionFinalisedByPRId?purchaseReqId=${purchaseReqId}`,
      this.httpOptions
    );
  }
  public getPurchaseReqDetails(PurchaseReqDetailsId: any) {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/getPurchaseReqDetails?PurchaseReqDetailsId=${PurchaseReqDetailsId}`,
      this.httpOptions
    );
  }
  public getPurchaseReqDetailsbyMasterId(PurchaseReqMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/GetPurchaseReqDetailsByMasterId?masterId=${PurchaseReqMasterId}`,
      this.httpOptions
    );
  }
  public savePurchaseRequisition(master: any): Observable<string> {
    //debugger;
    return this.http.post<string>(
      `${this.apiUrl}PurchaseRequisition/setPurchaseRequisition`,
      master,
      this.httpOptions
    );
  }
  public deletePurchaseReqById(purchaseReqId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseRequisition/DeletePurchaseReqById?purchaseReqId=${purchaseReqId}`,
      purchaseReqId,
      this.httpOptions
    );
  }
  public deletePurchaseReqDetailsById(): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductRequisition/deleteproductReqDetailsId`,
      this.httpOptions
    );
  }
  public deletePurchaseRequisitionDetailsById(PurchaseReqDetailsId: any): Observable<string> {
    debugger
    return this.http.post<string>(
      `${this.apiUrl}PurchaseRequisition/DeletePurchaseReqDetailsById?PurchaseReqDetailsId=${PurchaseReqDetailsId}`,
      PurchaseReqDetailsId,
      this.httpOptions
    );
  }
  public getPurchaseReqReportById(purchaseReqId: any) {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/getPurchaseRequisitionGridReport?purchaseReqId=${purchaseReqId}`,
      this.httpOptions
    );
  }
  public getPurchaseFinalRequisitionNo(purchaseFinalRequisitionDate: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurCommon/GetMaxPurchaseFinalReqNumber?purchaseFinalReqDate=${purchaseFinalRequisitionDate}`,
      this.httpOptions
    );
  }
  // Purchase Requisition  Approval 

  public ApprovePurchaseRequisitionMaster(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseRequisition/ApprovePurchaseRequisitionMaster`,
      master,
      this.httpOptions
    );
  }

  public GetPurchaseRequisitionListForApproval(purchaseReqId: any) {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/GetPurchaseReqMasterListForApproval?purchaseReqId=${purchaseReqId}`,
      this.httpOptions
    );
  }
  public GetCSListForApproval(csId: any, approvalStatus: any) {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/GetCSListForApproval?purchaseReqId=${csId}&approvalStatus=${approvalStatus}`,
      this.httpOptions
    );
  }

  public UpdateComparativeStatementForApproval(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseRequisition/UpdateComparativeStatementForApproval`,
      master,
      this.httpOptions
    );
  }

  public GetPurchaseRequisitionDetailsByIdForApproval(
    purchaseReqId: any
  ): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/GetPurchaseRequisitionDetailsByIdForApproval?salesInvoiceId=${purchaseReqId}`,
      this.httpOptions
    );
  }


  public UpdatePurchaseRequisitionDetails(master: any): Observable<string> {//, salesInvoiceId: any, grandTotal: any
    return this.http.post<string>(
      `${this.apiUrl}PurchaseRequisition/UpdatePurchaseRequisitionDetails`,
      master,
      this.httpOptions
    );
  }


  public getApprovedRequisitionData(approvalStatus, finalizeMasterId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductRequisition/getProductApprovedRequisition?approvedStatus=${approvalStatus}&finalizeMasterId=${finalizeMasterId}`,
      this.httpOptions
    );
  }


  public SaveSaveFinalRequisition(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseRequisition/SaveFinalRequisition`, master,
      this.httpOptions
    );
  }
  //  ComperativeStatement


  public getComperativeStatementNo(prodcutDate: any): Observable<any> {
    // debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurCommon/GetComperativeStatementNo?productdate=${prodcutDate}`,
      this.httpOptions
    );
  }

  public getQuotationCollectionNoName(): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurCommon/GetQuotationCollectionNoName`,
      this.httpOptions
    );
  }

  public GetQuotationCollectionDetailsById(masterId: any, csMasterId: any): Observable<any> {
    //debugger
    return this.http.get<any>(
      `${this.apiUrl}PurCommon/GetQuotationCollectionDetail?masterId=${masterId}&csMasterId=${csMasterId}`
      , this.httpOptions
    );
  }

  public saveComparativeStatement(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}PurchaseRequisition/SetComparativeStatement`,
      master,
      this.httpOptions
    );
  }

  public GetComparativeStatementById(csMasterId: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/GetComparativeStatementById?csMasterId=${csMasterId}`,

      this.httpOptions
    );
  }

  public GetCSDetailsbyMasterId(csMasterId: any, supplierId: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/GetCSDetailsbyMasterId?csMasterId=${csMasterId}&supplierId=${supplierId}`,

      this.httpOptions
    );
  }



  public GetAllFinalizeRequisitionDetailByMasterId(finalRequisitionId: any, supplierId: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/GetAllFinalizeRequisitionDetailByMasterId?finalRequisitionId=${finalRequisitionId}&supplierId=${supplierId}`,

      this.httpOptions
    );
  }
  public GetAllComparativeStatementsbyStatus(status: any, quotationTypeId: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/GetAllComparativeStatementsbyStatus?approvalStatus=${status}&quotationTypeId=${quotationTypeId}`,

      this.httpOptions
    );
  }

  public GetAllComparativeStatementsForLCbyStatus(status: any, quotationTypeId: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/GetAllComparativeStatementsForLCbyStatus?approvalStatus=${status}&quotationTypeId=${quotationTypeId}`,

      this.httpOptions
    );
  }

  public deleteComparativeStatementById(csMasterId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseRequisition/DeleteComparativeStatementById`,
      csMasterId,
      this.httpOptions
    );
  }
  // for Import-------------------------------------------------------------------------------------------------------
  public saveChargeHead(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Import/setChargeHead`
      , master
      , this.httpOptions
    );
  }

  public getChargeHead(id: any): Observable<string> {
    return this.http.get<any>(
      `${this.apiUrl}Import/getChargeHead?chargeHeadId=${id}`, this.httpOptions
    )
  }

  public deleteChargeHead(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Import/deleteChargeHead`,
      master,
      this.httpOptions
    );
  }


  //for Benificiary

  public saveBenificiary(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Import/setBenificiary`
      , master
      , this.httpOptions
    );
  }

  public getBenificiary(id: any): Observable<string> {
    return this.http.get<any>(
      `${this.apiUrl}Import/getBenificiary?benificiaryId=${id}`, this.httpOptions
    )
  }

  public deleteBenificiary(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Import/deleteBenificiary`,
      master,
      this.httpOptions
    );
  }


  //for Local Agent

  public saveLocalAgent(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Import/setLocalAgent`
      , master
      , this.httpOptions
    );
  }

  public getLocalAgent(id: any): Observable<string> {
    return this.http.get<any>(
      `${this.apiUrl}Import/getLocalAgent?localAgentId=${id}`, this.httpOptions
    )
  }

  public deleteLocalAgent(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Import/deleteLocalAgent`,
      master,
      this.httpOptions
    );
  }
  // for Mode of Transport

  public saveModeOfTransport(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Import/setModeTransport`
      , master
      , this.httpOptions
    );
  }

  public getModeOfTransport(id: any): Observable<string> {
    return this.http.get<any>(
      `${this.apiUrl}Import/getModeTransport?modeTransportId=${id}`, this.httpOptions
    )
  }

  public deleteModeOfTransport(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Import/deleteModeTransport`,
      master,
      this.httpOptions
    );
  }

  // for Port Info

  public GetInsurenceCompanyById(id: any): Observable<string> {
    return this.http.get<any>(
      `${this.apiUrl}Import/GetInsurenceCompanyById?insurenceCompanyId=${id}`, this.httpOptions
    )
  }
  public savePortInfo(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Import/setPortInfo`
      , master
      , this.httpOptions
    );
  }

  public getPortInof(id: any): Observable<string> {
    return this.http.get<any>(
      `${this.apiUrl}Import/getPortInfo?portInfoId=${id}`, this.httpOptions
    )
  }

  public deletePortInfo(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Import/deletePortInfo`,
      master,
      this.httpOptions
    );
  }



  public getRefuisionNo(purchaseFinalRequisitionDate: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurCommon/GetMaxRequisitionNumber?purchaseFinalReqDate=${purchaseFinalRequisitionDate}`,
      this.httpOptions
    );
  }

  public getLcNo(lcOpenDate: any) {
    return this.http.get<any>(
      `${this.apiUrl}PurCommon/GetMaxLcNumber?lcOpenDate=${lcOpenDate}`, this.httpOptions
    )
  }



  public saveAdviceBank(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Import/setAdviseBank`
      , master
      , this.httpOptions
    );
  }

  public getAdviceBank(id: any): Observable<string> {
    return this.http.get<any>(
      `${this.apiUrl}Import/getAdviceBank?portInfoId=${id}`, this.httpOptions
    )
  }

  public deleteAdviceBank(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Import/deleteAdviceBank`,
      master,
      this.httpOptions
    );
  }



  public savePreLcInfo(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Import/SavePreLcInfo`
      , master
      , this.httpOptions
    );
  }


  public getPreLcInfo(id: any): Observable<string> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Import/GetSavePreLcInfo?PreLcId=${id}`, this.httpOptions
    )
  }

  public getLcInfo(id: any): Observable<string> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Import/GetLcInfo?lcId=${id}`, this.httpOptions
    )
  }

  public getPreLcDetailsInfoByMasterId(id: any): Observable<string> {
    return this.http.get<any>(
      `${this.apiUrl}Import/GetPreLcDetailsByMasterId?masterId=${id}`,
      this.httpOptions
    )
  }
  // public deletePrelcInfo(master: any): Observable<string> {
  //   return this.http.post<string>(
  //     `${this.apiUrl}Import/DeleteSavePreLcInfo`,
  //     master,
  //     this.httpOptions
  //   );


  // }

  public deletePrelcInfo(id: any): Observable<string> {

    return this.http.get<any>(
      `${this.apiUrl}Import/DeleteSavePreLcInfo?preLcId=${id}`,
      this.httpOptions
    )
  }


  public saveLcInfo(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Import/SaveLcInfo`
      , master
      , this.httpOptions
    );
  }

  public deleteLcInfo(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Import/DeleteLcInfo`,
      master,
      this.httpOptions
    );
  }


  public getPreLcandLcInfo(id: any): Observable<string> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Import/GetLCPreLCDataByPreLcId?PreLcId=${id}`, this.httpOptions
    )
  }
  public getPrelcIdListFromLcMasterTable(id: any): Observable<string> {

    return this.http.get<any>(
      `${this.apiUrl}Import/GetPreLcIdListFromLcMasterTable?flag=${id}`, this.httpOptions
    )
  }

  public saveBankInsuranceCharge(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Import/SaveBankInsuranceChargeInfo`
      , master
      , this.httpOptions
    );
  }

  public getBankInsuranceChargeData(id: any): Observable<string> {

    return this.http.get<any>(
      `${this.apiUrl}Import/GetBnakInsuranceChargeData?chargeId=${id}`, this.httpOptions
    )
  }
  public getBankInsuranceChargeDetailsInfoByMasterId(id: any): Observable<string> {
    return this.http.get<any>(
      `${this.apiUrl}Import/GetBankInsuracneDetailsByMasterId?masterId=${id}`,
      this.httpOptions
    )
  }
  public deleteChargeDetailsById(id: any): Observable<string> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Import/DeleteChargeDetialsInfoById?detailsId=${id}`, this.httpOptions
    )
  }

  public deletebankInsuranceChargeInfo(id: any): Observable<string> {

    return this.http.get<any>(
      `${this.apiUrl}Import/DeleteBankInsuranceChargeInfo?chargeId=${id}`,
      this.httpOptions
    )
  }
  //////// Shipment info///////////////////

  public getPreLcLcInfoForShipment(id: any): Observable<string> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Import/GetPreLcAndLcDataforShipment?PreLcId=${id}`, this.httpOptions
    )
  }

  public getShipmentNo(today: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurCommon/GetMaxShipmentNumber?TodatDate=${today}`,
      this.httpOptions
    );
  }

  public SaveShipmentInfo(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Import/SaveShipmentInfo`
      , master
      , this.httpOptions
    );
  }

  public getShipmentDatabyId(id: any): Observable<string> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Import/GetShipmentInfo?shipmentId=${id}`, this.httpOptions
    )
  }

  public deleteShipmentInfo(id: any): Observable<string> {

    return this.http.get<any>(
      `${this.apiUrl}Import/DeleteShipmentInfoById?shipmentId=${id}`,
      this.httpOptions
    )
  }

  // Bank Clearence


  public getReferceInfoforBankClearenceBasedOnShipmentInfo(id: any): Observable<string> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Import/getReferceInfoforBankClearenceBasedOnShipmentInfo?shipmentId=${id}`, this.httpOptions
    )
  }
  public getReferceInfoforCustomeClearanceeBasedOnBankClearanceInfo(id: any): Observable<string> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Import/getReferceInfoforCustomeClearanceeBasedOnBankClearanceInfo?clearanceId=${id}`, this.httpOptions
    )
  }

  public getPreLcLcShipmentInfoForBankClearence(id: any): Observable<string> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Import/getPreLcLcShipmentInfoForBankClearence?shipmentId=${id}`, this.httpOptions
    )
  }

  public getPreLcLcShipmentInfoForCustomeClearance(id: any): Observable<string> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Import/getPreLcLcShipmentInfoForCustomeClearance?clearanceId=${id}`, this.httpOptions
    )
  }

  public saveClearanceInfo(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Import/saveClearenctInfo`
      , master
      , this.httpOptions
    );
  }

  public getClearenceInfo(id: any, type): Observable<string> {
    return this.http.get<any>(
      `${this.apiUrl}Import/getClearenceData?portInfoId=${id}&type=${type}`, this.httpOptions
    )
  }


  public deleteClearacneInfo(id: any): Observable<string> {

    return this.http.get<any>(
      `${this.apiUrl}Import/DeleteClearanceInfo?clearanceId=${id}`,
      this.httpOptions
    )
  }
  // Amendment
  public getPreLcandLcInfoforAmemdment(id: any): Observable<string> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Import/GetLCPreLCDataByPreLcIdforAmendment?PreLcId=${id}`, this.httpOptions
    )
  }

  public SaveLcAmendmentInfo(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Import/SaveLcAmendmentInfo`
      , master
      , this.httpOptions
    );
  }

  public getLcAmendmentDatabyId(id: any): Observable<string> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Import/GetLcAmendmentInfo?amendmentId=${id}`, this.httpOptions
    )
  }

  public deleteLcAmendmentInfo(id: any): Observable<string> {

    return this.http.get<any>(
      `${this.apiUrl}Import/DeleteLcAmendmentInfoById?amendmentId=${id}`,
      this.httpOptions
    )
  }

  //Amendment Charge
  public getPrelcIdListFromLcMasterTableforAmendmentCharge(id: any): Observable<string> {

    return this.http.get<any>(
      `${this.apiUrl}Import/GetReferenctListForAmendmentCharge?amendmentId=${id}`, this.httpOptions
    )
  }
  public getPreLcandLcAndAmendentInfoforAmemdmentCharge(id: any): Observable<string> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Import/GetLCPreLCAmendmentDataforAmendmentCharge?amendmentId=${id}`, this.httpOptions
    )
  }

  public SaveLcAmendmentChargeInfo(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Import/SaveLcAmendmentChargeInfo`
      , master
      , this.httpOptions
    );
  }

  public getLcAmendmentChargeDatabyId(id: any): Observable<string> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Import/GetLcAmendmentChargeInfo?chargeId=${id}`, this.httpOptions
    )
  }

  public deleteLcAmendmentChargeInfo(id: any): Observable<string> {

    return this.http.get<any>(
      `${this.apiUrl}Import/DeleteLcAmendmentChargeInfoById?chargeId=${id}`,
      this.httpOptions
    )
  }
  //Other charge

  public getPreLcandLcBankInsuranceChargeInfoforOtherCharge(id: any): Observable<string> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Import/GetLCPreLCBankInsuranceChargeforOtherCharge?PreLcId=${id}`, this.httpOptions
    )
  }

  public getOhterChargeInfo(id: any): Observable<string> {
    return this.http.get<any>(
      `${this.apiUrl}Import/GetOtherChargeInfo?chargeId=${id}`, this.httpOptions
    )
  }

  public SaveOtherChargeInfo(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Import/SaveOtherChargeInfo`
      , master
      , this.httpOptions
    );
  }

  public deleteOtherChargeInfo(id: any): Observable<string> {

    return this.http.get<any>(
      `${this.apiUrl}Import/DeleteOtherChargeInfoById?chargeId=${id}`,
      this.httpOptions
    )
  }

  //Offshore charge
  public getPreLcandLcBankInsuranceOtherChargeInfoforOffshoreCharge(id: any): Observable<string> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Import/GetLCPreLCBankInsuranceChargeforOffshoreCharge?PreLcId=${id}`, this.httpOptions
    )
  }

  public getOffshoreChargeInfo(id: any): Observable<string> {
    return this.http.get<any>(
      `${this.apiUrl}Import/GetOffshoreChargeInfobyId?chargeId=${id}`, this.httpOptions
    )
  }

  public SaveOffshoreChargeInfo(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Import/SaveOffshoreChargeInfo`
      , master
      , this.httpOptions
    );
  }

  public deleteOffshoreChargeInfo(id: any): Observable<string> {

    return this.http.get<any>(
      `${this.apiUrl}Import/DeleteOtherChargeInfoById?chargeId=${id}`,
      this.httpOptions
    )
  }
  public RptPurchaseOrderReport(companyId, purchaseOrderId, reportFormat: any) {
    debugger;
    return this.http.get<any>(
      `${this.reportApiUrl}PurchaseRequisition/GetPurchaseOrderReport?companyId=${companyId}&purchaseRequisitionId=${purchaseOrderId}&reportFormat=${reportFormat}`,
      this.httpOptions
    );
  }
  public getBenificiaryByID(id: any): Observable<string> {
    return this.http.get<any>(
      `${this.apiUrl}Party/getBenificiaryByID?benificiaryId=${id}`, this.httpOptions
    )
  }
}
