import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PurchaseorderService {
  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getPurchaseOrder(purchaseOrderId: any, purchaseTypeId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getPurchaseOrder?purchaseOrderId=${purchaseOrderId}&purchaseTypeId=${purchaseTypeId}`,
      this.httpOptions
    );
  }

  public getPurchaseOrderDetailsData(purchaseOrderId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getPurchaseOrderDetailsData?purchaseOrderId=${purchaseOrderId}`,
      this.httpOptions
    );
  }
  public getProductTypeWiseTermsAndConditions(purchaseOrderId, productTypeId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getProductTypeWiseTermsAndConditions?purchaseOrderId=${purchaseOrderId}&productTypeId=${productTypeId}`,
      this.httpOptions
    );
  }

  public getPurchaseOrderDetails(purchaseOrderDetailsId: any) {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getPurchaseOrderDetails?purchaseOrderDetailsId=${purchaseOrderDetailsId}`,
      this.httpOptions
    );
  }

  public savePurchaseOrder(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseOrder/setPurchaseOrder`,
      master,
      this.httpOptions
    );
  }

  public deletePurchaseOrderById(purchaseOrderId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseOrder/deletePurchaseOrderById`,
      purchaseOrderId,
      this.httpOptions
    );
  }
  public deletePurchaseOrderDetailsById(
    purchaseOrderDetailsId: any
  ): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseOrder/DeletePurchaseOrderDetailsById?purchaseOrderDetailsId=${purchaseOrderDetailsId}`,
      this.httpOptions
    );
  }

  public getProductsupplier(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductSupplier`,
      this.httpOptions
    );
  }

  public getPurchaseReq(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/getPurchaseRequisition`,
      this.httpOptions
    );
  }

  public getPurchaseOrderDetailsById(purchaseReqId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseRequisition/GetPurchaseReqDetailsByMasterId?masterId=${purchaseReqId}`,
      this.httpOptions
    );
  }

  public getmaxPurchaseOrder(purchaseOrderDate): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurCommon/GetMaxPurchaseOrderNumber?purchaseOrderDate=${purchaseOrderDate}`,
      this.httpOptions
    );
  }
  public GetTransactionType(transactionTypeId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}CmnDropDown/GetCmnTransactionType?transactionTypeId=${transactionTypeId}`,
      this.httpOptions
    );
  }

  public getPurchaseOrderDetailsInUpdate(purchaseOrderId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/GetPurchaseOrderBypurchaseOrderId?purchaseOrderId=${purchaseOrderId}`,
      this.httpOptions
    );
  }

  public getTermsAndConditionSupplierIdWise(supplierId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getTermsAndConditionsNoStuff?supplierId=${supplierId}`,
      this.httpOptions
    );
  }

  public getTermsAndConditionPOIdWiseInUpdate(
    purchaseOrderId
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getTermsAndConditionsInUpdate?purchaseOrderId=${purchaseOrderId}`,
      this.httpOptions
    );
  }

  public getReportById(purchaseOrderId: any) {
    return this.http.get<any>(
      `${this.apiUrl}AccountReport/getRptVoucherPreview?vmasterId=${purchaseOrderId}`,
      this.httpOptions
    );
  }

  // For Direct Purchase

  public savePurchaseMaster(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Purchase/setPurchaseMaster`,
      master,
      this.httpOptions
    );
  }

  public GetPurchaseById(purchaseOrderId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Purchase/GetPurchaseById?purchaseOrderId=${purchaseOrderId}`,
      this.httpOptions
    );
  }

  public GetAutoStockInOutSettingStatusById(
    autoStockInOutId: any
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}AutoStockInOutSetting/GetAutoStockInOutSettingStatusById?autoStockInOutId=${autoStockInOutId}`,
      this.httpOptions
    );
  }

  //#region reports

  public GetPurchaseOrderNumberByType(
    reportTypeId: any,
    partyId: any
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/GetPurchaseOrderNumberByType?reportTypeId=${reportTypeId}&partyId=${partyId}`,
      this.httpOptions
    );
  }

  public SpGetPartyBySbu(reportTypeId: any, sbuId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/SpGetPartyBySbu?reportTypeId=${reportTypeId}&sbuId=${sbuId}`,
      this.httpOptions
    );
  }

  public GetDateRangeWisePoEntryUser(
    fromDate: any,
    toDate: any
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/GetDateRangeWisePoEntryUser?fromDate=${fromDate}&toDate=${toDate}`,
      this.httpOptions
    );
  }

  public GetPurchaseOrdersReportData(
    reportTypeId: any,
    sbuId: any,
    partyId: any,
    userId: any,
    fromDate: any,
    toDate: any
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/GetPurchaseOrdersReportData?reportTypeId=${reportTypeId}&sbuId=${sbuId}&partyId=${partyId}&userId=${userId}&fromDate=${fromDate}&toDate=${toDate}`,
      this.httpOptions
    );
  }
  //#endregion
  // GRN
  public getRejectedGRN(purchaseOrderId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/GetRejectedGRN?purchaseOrderId=${purchaseOrderId}`,
      this.httpOptions
    );
  }
  public getRejectedImportGRN(ImpPreLCInfoMasterId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getRejectedImportGRN?ImpPreLCInfoMasterId=${ImpPreLCInfoMasterId}`,
      this.httpOptions
    );
  }
  public getGRNsupplierChallanNo(purchaseOrderId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getGRNsupplierChallanNo?poId=${purchaseOrderId}`,
      this.httpOptions
    );
  }
  public getPurchaseOrdersForGRN(purchaseOrderId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getPurchaseOrdersForGRN?poId=${purchaseOrderId}`,
      this.httpOptions
    );
  }
  public getPurchaseOrdersForGRNN(purchaseOrderId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getPurchaseOrdersForGRNN?poId=${purchaseOrderId}`,
      this.httpOptions
    );
  }
  public getPurchaseOrdersForRejectedGRN(purchaseOrderId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getPurchaseOrdersForRejectedGRN?poId=${purchaseOrderId}`,
      this.httpOptions
    );
  }
  public getLcNo(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getLcNo`,
      this.httpOptions
    );
  }
  public getLcNoForRejectedQty(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getLcNoForRejectedQty`,
      this.httpOptions
    );
  }

  public getPODetailsByLcInfo(ImpPreLCInfoMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getPODetailsByLcInfo?ImpPreLCInfoMasterId=${ImpPreLCInfoMasterId}`,
      this.httpOptions
    );
  }


  public getPODetailsByIdForGRN(grnMasterid: any, poId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getPODetailsByIdForGRN?poId=${poId}&grnMasterid=${grnMasterid}`,
      this.httpOptions
    );
  }

  public GetGRNImportDetails(grnMasterid: any, poId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/GetGRNImportDetails?lcId=${poId}&grnMasterid=${grnMasterid}`,
      this.httpOptions
    );
  }

  public getPODetailsByIdForGRNforReport(grnMasterid: any, poId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getPODetailsByIdForGRNForPdfReport?poId=${poId}&grnMasterid=${grnMasterid}`,
      this.httpOptions
    );
  }


  public SaveGRN(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseOrder/setGRN`,
      master,
      this.httpOptions
    );
  }

  public setGRNImport(master: any): Observable<string> {
    debugger
    return this.http.post<string>(
      `${this.apiUrl}PurchaseOrder/setGRNImport`,
      master,
      this.httpOptions
    );
  }

  public GetGRN(grnId: any, fDate: Date = null, tDate: Date = null): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getGRN?grnId=${grnId}&fDate=${this.commonService.DateFormat(fDate)}&tDate=${this.commonService.DateFormat(tDate)}`,
      this.httpOptions
    );
  }
  public GetGRNForReturnOrder(grnId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getGRNForReturnOrder?grnId=${grnId}`,
      this.httpOptions
    );
  }
  public getGRNForQA(): Observable<any> {
    debugger
    return this.http.get<any>(
      `${this.apiUrl}GRN/getGRNForQA`,
      this.httpOptions
    );
  }
  public getGRNForRetest(): Observable<any> {
    debugger
    return this.http.get<any>(
      `${this.apiUrl}GRN/getGRNForRetest`,
      this.httpOptions
    );
  }
  public SetGrnLogtbl(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}GRN/setGrnLogtbl`,
      master,
      this.httpOptions
    );
  }
  public getGRNImportForQA(): Observable<any> {
    debugger
    return this.http.get<any>(
      `${this.apiUrl}GRN/getGRNImportForQA`,
      this.httpOptions
    );
  }
  public getGrnDetailsForQA(grnMasterId: any, InitialOrRetest: any): Observable<any> {
    debugger
    return this.http.get<any>(
      `${this.apiUrl}GRN/getGrnDetailsForQA?grnMasterId=${grnMasterId}&InitialOrRetest=${InitialOrRetest}`,
      this.httpOptions
    );
  }

  public getGrnDetailsForRetest(grnMasterId: any, grnType: any): Observable<any> {
    debugger
    return this.http.get<any>(
      `${this.apiUrl}GRN/getGrnDetailsForRetest?grnMasterId=${grnMasterId}&grnType=${grnType}`,
      this.httpOptions
    );
  }
  public UpdateGRNQaForApproval(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}GRN/UpdateGRNQaForApproval`,
      master,
      this.httpOptions
    );
  }
  public UpdateGRNImportQaForApproval(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}GRN/UpdateGRNImportQaForApproval`,
      master,
      this.httpOptions
    );
  }
  public getGRNImport(grnId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getGRNImport?grnId=${grnId}`,
      this.httpOptions
    );
  }
  public getGRNImportForReturnOrder(grnId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getGRNImportForReturnOrder?grnId=${grnId}`,
      this.httpOptions
    );
  }
  public GetGRNDetailsById(grnId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getGRNDetailsById?grnId=${grnId}`,
      this.httpOptions
    );
  }
  public GetGrnImportDetailsForQA(ImpgrnMasterId: any, InitialOrRetest: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}GRN/getGrnImportDetailsForQA?ImpgrnMasterId=${ImpgrnMasterId}&InitialOrRetest=${InitialOrRetest}`,
      this.httpOptions
    );
  }
  public DeleteGRNById(grnId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseOrder/deleteGRNById`,
      grnId,
      this.httpOptions
    );
  }

  public getGRNNo(grnDate: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurCommon/GetMaxGRNNo?grnDate=${grnDate}`,
      this.httpOptions
    );
  }
  public GetMaxGRNImpNo(grnDate: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurCommon/GetMaxGRNImpNo?grnDate=${grnDate}`,
      this.httpOptions
    );
  }

  //#endregion


  // BIll Creation

  public getSupplierWiseProductsForBill(billMasterid: any, supplierId: any, poId: number = 0): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getSupplierWiseProductsForBill?supplierId=${supplierId}&billMasterid=${billMasterid}&poId=${poId}`,
      this.httpOptions
    );
  }

public getBillPayableJV(billMasterId: any, partyId: any, paymentAmount: any, vatPaymentAmount: any, vdsPaymentAmount: any, tdsPaymentAmount: any, netPaymentAmount: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getBillPayableJV?billMasterId=${billMasterId}&partyId=${partyId}&paymentAmount=${paymentAmount}&vatPaymentAmount=${vatPaymentAmount}&vdsPaymentAmount=${vdsPaymentAmount}&tdsPaymentAmount=${tdsPaymentAmount}&netPaymentAmount=${netPaymentAmount}`,
      this.httpOptions
    );
  }

  public getSupplierWiseProductsForBillForPdfReport(billMasterid: any, supplierId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getSupplierWiseProductsForBillForPdfReport?supplierId=${supplierId}&billMasterid=${billMasterid}`,
      this.httpOptions
    );
  }

  public SaveBill(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseOrder/setBill`,
      master,
      this.httpOptions
    );
  }

  public GetBill(billId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getBill?billId=${billId}`,
      this.httpOptions
    );
  }
  public GetBillForPdfReport(billId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getBillForPdfReport?billId=${billId}`,
      this.httpOptions
    );
  }
  public GetBillDetailsById(billId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getBillDetailsById?billId=${billId}`,
      this.httpOptions
    );
  }

  public DeleteBillById(billId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseOrder/deleteBillById`,
      billId,
      this.httpOptions
    );
  }

  public getBillNo(billDate: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurCommon/GetMaxBillNo?billDate=${billDate}`,
      this.httpOptions
    );
  }

  //#endregion


  // BIll Payment
  public getBillInfoForPayment(billId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getBillInfoForPayment?billId=${billId}`,
      this.httpOptions
    );
  }
  public getBillPaymentNo(paymentDate: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}PurCommon/GetMaxBillPaymentNo?paymentDate=${paymentDate}`,
      this.httpOptions
    );
  }

  public DeleteBillPaymentById(billId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseOrder/DeleteBillPaymentById`,
      billId,
      this.httpOptions
    );
  }

public SaveBillPayableVoucherPosting(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseOrder/setBillPayableVoucherPosting`,
      master,
      this.httpOptions
    );
  }

   public getBillPayableVoucher(voucherMasterId: any, fromDate: any, toDate: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getBillPayableVoucher?voucherMasterId=${voucherMasterId}&fromDate=${fromDate}&toDate=${toDate}`,
      this.httpOptions
    );
  }

  public getSupplierInfoForBillPayment(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getSupplierInfoForBillPayment`,
      this.httpOptions
    );
  }

  public SaveBillPayment(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseOrder/setBillPayment`,
      master,
      this.httpOptions
    );
  }

  public getBillPaymentById(voucherMasterId: any, fromDate: any, toDate: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getBillPayment?voucherMasterId=${voucherMasterId}&fromDate=${fromDate}&toDate=${toDate}`,
      this.httpOptions
    );
  }

  public getSupplierWiseBillsForPayment(billMasterid: any, supplierId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/getSupplierWiseBillsForPayment?supplierId=${supplierId}&billMasterid=${billMasterid}`,
      this.httpOptions
    );
  }

  //#endregion

  //Budget

  public getBudgetCategoryList(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/GetBudgetCategoryList`,
      this.httpOptions
    );
  }
  public SaveBudgetCreate(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}PurchaseOrder/SaveBudgetCreate`,
      master,
      this.httpOptions
    );
  }
  public GetBudgetCreateList(BudgetCreateId: any): Observable<any> {
    debugger
    return this.http.get<any>(
      `${this.apiUrl}PurchaseOrder/GetBudgetCreateList?BudgetCreateId=${BudgetCreateId}`,
      this.httpOptions
    );
  }

  //#endregion
}
