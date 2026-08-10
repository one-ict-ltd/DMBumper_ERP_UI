import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SalesinvoiceService {
  apiUrl: string = this.commonService.baseUrl;
  reportApiUrl: string = this.commonService.baseReportUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;
  userProfile: any = this.commonService.GetUserProfile();
  constructor(private http: HttpClient, private commonService: CommonService) { }

  public GetCompanyAliasName() {
    let data: {} = JSON.parse(this.userProfile);
    return data[0].uc[0].aliasName;
  }
  // public GetSalesInvoiceById(salesInvoiceId: any): Observable<any> {
  //   debugger;
  //   return this.http.get<any>(
  //     `${this.apiUrl}SalesInvoice/GetSalesInvoiceById?salesInvoiceId=${salesInvoiceId}`,
  //     this.httpOptions
  //   );
  // }
  public GetSalesInvoiceById(salesInvoiceId: any, fdate: Date = null, tdate: Date = null): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalesInvoiceById?salesInvoiceId=${salesInvoiceId}&fDate=${fdate}&tDate=${tdate}`,
      this.httpOptions
    );
  }

  public GetInvoiceGDNConfirmationData(salesInvoiceId: any, fdate: Date = null, tdate: Date = null, type: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetInvoiceGDNConfirmation?salesInvoiceId=${salesInvoiceId}&fDate=${fdate}&tDate=${tdate}&gdnType=${type}`,
      this.httpOptions
    );
  }



  public GetSalesInvoiceForPosById(salesInvoiceId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalesInvoiceForPosById?salesInvoiceId=${salesInvoiceId}`,
      this.httpOptions
    );
  }
  public GetSalesInvoiceDetailsByMasterId(
    salesInvoiceId: any
  ): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalesInvoiceDetailsByMasterId?salesInvoiceId=${salesInvoiceId}`,
      this.httpOptions
    );
  }

  public GetSalesDashboardChartData() {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalesDashboardChartData`,
      this.httpOptions
    );
  }

  public GetSalesDashboardDueChartData() {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalesDashboardDueChartData`,
      this.httpOptions
    );
  }

  public GetSalesInvoiceDetailsByIdForApproval(
    salesInvoiceId: any
  ): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalesInvoiceDetailsByIdForApproval?salesInvoiceId=${salesInvoiceId}`,
      this.httpOptions
    );
  }
  public GetSalesInvoiceTCByMasterId(salesInvoiceId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalesInvoiceTCByMasterId?salesInvoiceId=${salesInvoiceId}`,
      this.httpOptions
    );
  }

  public getTerritoryOfficerByPartyId(partyId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}ProductRequisition/getTerritoryOfficerByPartyId?partyId=${partyId}`,
      this.httpOptions
    );
  }

  public GetSalesInvoiceListForReturn(partyId: any, fDate: Date = null, tDate: Date = null): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetInvoiceListByPartyId?partyId=${partyId}&fDate=${fDate}&tDate=${tDate}`,
      this.httpOptions
    );
  }

  public SaveSalesInvoice(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/SaveSalesInvoice`,
      master,
      this.httpOptions
    );
  }

  public SaveTenderQuotation(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/SaveTenderQuotation`,
      master,
      this.httpOptions
    );
  }

  public GetTenderQuotationById(quotationMasterId: any, fDate: any, tDate: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetTenderQuotationId?quotationMasterId=${quotationMasterId}&fDate=${fDate}&tDate=${tDate}`,
      this.httpOptions
    );
  }

  public GetTenderQuotationDetailsById(quotationMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetTenderQuotationDetailsById?quotationMasterId=${quotationMasterId}`,
      this.httpOptions
    );
  }

  public DeleteTenderQuotationById(quotationMasterId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}SalesInvoice/DeleteTenderQuotationById`,
      quotationMasterId,
      this.httpOptions
    );
  }

  public SaveSaleInvoiceGDNConfirmation(model: any): Observable<string> {
    debugger
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/SaveSalesInvoiceGDNConfirmation`,
      model,
      this.httpOptions
    );
  }



  public UpdateSalesInvoiceDetails(master: any): Observable<string> {//, salesInvoiceId: any, grandTotal: any
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/UpdateSalesInvoiceDetails`,
      master,
      this.httpOptions
    );
  }
  public DeleteSalesInvoiceById(salesInvoiceId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/DeleteSalesInvoiceById`,
      salesInvoiceId,
      this.httpOptions
    );
  }

  public DeleteGDNById(salesInvoiceId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/DeleteGDNById`,
      salesInvoiceId,
      this.httpOptions
    );
  }

  public DeleteSalesInvoiceDetailsById(
    salesInvDetailsId: any
  ): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/DeleteSalesInvoiceDetailsById`, salesInvDetailsId,
      this.httpOptions
    );
  }
  public DeleteSalesInvoiceTCById(
    productTrnfrDetailsId: any
  ): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/DeleteSalesInvoiceTCById?salesInvoiceId=${productTrnfrDetailsId}`,
      this.httpOptions
    );
  }
  public GetMaxSalesInvoiceNumber(date: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetMaxSalesInvoiceNumber?dateTime=${date}`,
      this.httpOptions
    );
  }
  public GetSalesInvoiceReportDataById(
    salesInvoiceId: any //, partyId: any, fromDate: any, toDate: any): Observable<string>
  ) {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetSalesInvoiceReportData?salesInvoiceId=${salesInvoiceId}`,
      this.httpOptions
    );
  }
  public GetSalesInvoiceReportData(
    salesInvoiceId: any,
    partyId: any,
    fromDate: any,
    toDate: any
  ): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetSalesInvoiceReportData?salesInvoiceId=${salesInvoiceId}&partyId=${partyId}&fromDate=${fromDate}&toDate=${toDate}`,
      this.httpOptions
    );
  }
  public GetProductSpecDetailsBySpecId(productSpecId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetProductSpecDetailsBySpecId?productSpecId=${productSpecId}`,
      this.httpOptions
    );
  }
  public GetAllPartysByTypeId(
    partyTypeId: any,
    sbuId: any = 0,
    territoryCode: any = ''
  ): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetAllPartysByTypeId?partyTypeId=${partyTypeId}&sbuId=${sbuId}&territoryCode=${territoryCode}`,
      this.httpOptions
    );
  }
  public GetAllActivePartysByTypeId(
    partyTypeId: any,
    sbuId: any = 0,
    territoryCode: any = ''
  ): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetAllActivePartysByTypeId?partyTypeId=${partyTypeId}&sbuId=${sbuId}&territoryCode=${territoryCode}`,
      this.httpOptions
    );
  }
  public GetAllActivePartysForChallanByTypeId(
    partyTypeId: any,
    sbuId: any = 0,
    territoryCode: any = ''
  ): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetAllActivePartysForChallanByTypeId?partyTypeId=${partyTypeId}&sbuId=${sbuId}&territoryCode=${territoryCode}`,
      this.httpOptions
    );
  }
  public GetAllActivePartysForBillByTypeId(
    partyTypeId: any,
    sbuId: any = 0,
    territoryCode: any = ''
  ): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetAllActivePartysForBillByTypeId?partyTypeId=${partyTypeId}&sbuId=${sbuId}&territoryCode=${territoryCode}`,
      this.httpOptions
    );
  }
  public GetSalesInvoicesByPartyId(
    partyId: any
  ): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetSalesInvoiceByPartyId?partyId=${partyId}`,
      this.httpOptions
    );
  }
  public GetPartyDetailsById(partyId: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetPartyDetailsById?partyId=${partyId}`,
      this.httpOptions
    );
  }
  public GetSalesInvoiceListByPartyId(partyId: any, fDate: Date = null, tDate: Date = null): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetInvoiceListByPartyId?partyId=${partyId}&fDate=${fDate}&tDate=${tDate}`,
      this.httpOptions
    );
  }
  public GetDateRangeWiseUserName(fromdate, toDate): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetDateRangeWiseUserName?fromdate=${fromdate}&toDate=${toDate}`,
      this.httpOptions
    );
  }
  public GetCurrentStock(
    storeId: any,
    productWiseSpecificationId: any,
    batchNo: any = ''
  ): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetCurrentStock?storeId=${storeId}&productWiseSpecificationId=${productWiseSpecificationId}&batchNo=${batchNo}`,
      this.httpOptions
    );
  }
  public GetItemWsieBonus(
    invoiceDate: Date,
    partyId: number,
    productWiseSpecificationId: number,
    invQty: number,
  ): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetItemWsieBonus?invoiceDate=${invoiceDate}&partyId=${partyId}&productWiseSpecificationId=${productWiseSpecificationId}&invQty=${invQty}`,
      this.httpOptions
    );
  }
  public GetBarcodeDetails(barcodeNo: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetBarcodeDetails?barcodeNo=${barcodeNo}`,
      this.httpOptions
    );
  }

  public ApproveSalesInvoiceMaster(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/ApproveSalesInvoiceMaster`,
      master,
      this.httpOptions
    );
  }

  public DeleteSalesPicking(pickingMasterId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/DeleteSalesPicking`,
      pickingMasterId,
      this.commonService.getHttpOptions()
    );
  }


  public SetSalesPicking(master: any): Observable<string> {
    debugger
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/SetSalesPicking`,
      master,
      this.httpOptions
    );
  }

  public SetSalesDispatch(master: any): Observable<string> {
    debugger
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/SetSalesDispatch`,
      master,
      this.httpOptions
    );
  }

  public DestructionNoteApproval(master: any): Observable<string> {
    debugger
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/DestructionNoteApproval`,
      master,
      this.httpOptions
    );
  }

  public SetDamageExpireProductsReturn(master: any): Observable<string> {
    debugger
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/SetDamageExpireProductsReturn`,
      master,
      this.httpOptions
    );
  }

  public GetSalesDispatchDetailsbyId(distributionMasterId: number): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetSalesDispatchDetailsbyId?distributionMasterId=${distributionMasterId}`,
      this.httpOptions
    );
  }

  public GetCustomerDuesStatus(partyId: number, territoryCode: string = ''): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetCustomerDuesStatus?partyId=${partyId}&territoryCode=${territoryCode}`,
      this.httpOptions
    );
  }
  public SaveCollectionInvoiceFormDispatch(master: any): Observable<string> {
    debugger
    return this.http.post<string>(
      `${this.apiUrl}SalesCollection/SaveCollectionInvoiceFormDispatch`,
      master,
      this.httpOptions
    );
  }

  public SaveCollectionInvoiceFormDispatch_v2(master: any): Observable<string> {
    debugger
    return this.http.post<string>(
      `${this.apiUrl}SalesCollection/SaveCollectionInvoiceFormDispatch_V2`,
      master,
      this.httpOptions
    );
  }

  // Tender/bill collection: saves with territory/depot-free numbering
  public SaveCollectionInvoiceFormDispatch_v2ForBill(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesCollection/SaveCollectionInvoiceFormDispatch_V2ForBill`,
      master,
      this.httpOptions
    );
  }

  public GetSalesInvoiceMasterListForApproval(salesInvoiceId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalesInvoiceMasterListForApproval?salesInvoiceId=${salesInvoiceId}`,
      this.httpOptions
    );
  }
  public GetSalesInvoiceMasterListByStatusJson(status: any, territoryCode: string = '', transactionTypeId: number = null, areaCode: string = '') {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalesInvoiceMasterListByStatusJson?status=${status}&territoryCode=${territoryCode}&transactionTypeId=${transactionTypeId}&areaCode=${areaCode}`,
      this.httpOptions
    );
  }
  public GetSalesInvoiceMasterListByStatusandTerritory(status: any, territoryCode: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalesInvoiceMasterListByStatusandTerritory?status=${status}&territoryCode=${territoryCode}`,
      this.httpOptions
    );
  }
  public GetSalesPickingMasterListJson(pikingMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalesPickingMasterListJson?pikingMasterId=${pikingMasterId}`,
      this.httpOptions
    );
  }
  public GetMiscellaneousItemDepotListJson(typeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetMiscellaneousItemDepotListJson?typeId=${typeId}`,
      this.httpOptions
    );
  }
  public GetMiscellaneousItemMarketListJson() {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetMiscellaneousItemMarketListJson`,
      this.httpOptions
    );
  }
  public SalSpGetAllPickingJson(fDate: any = null, tDate: any = null) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalespickingJson?fDate=${fDate}&tDate=${tDate}`,
      this.httpOptions
    );
  }

  public GetSalSpGetAllSalesDispatchJson(fromDate: Date = null, toDate: Date = null) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalSpGetAllSalesDispatchJson?fromDate=${fromDate}&toDate=${toDate}`,
      this.httpOptions
    );
  }

  public GetAllDamageExpireProductReturn(MarketOrDepo: any, isApproved: number = null) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetAllDamageExpireProductReturn?MarketOrDepo=${MarketOrDepo}&isApproved=${isApproved}`,
      this.httpOptions
    );
  }

  // public GetSalesInvoiceListfromDispatchJson(dispatchMasterId: any)//, partyId: any = 0, collectionDate: Date = null)
  // {
  //   return this.http.get<any>(
  //     `${this.apiUrl}SalesInvoice/GetSalesInvoiceListfromDispatchJson?dispatchMasterId=${dispatchMasterId}`,
  //     this.httpOptions
  //   );
  // }
  public GetSalesInvoiceListfromDispatchJson(dispatchMasterId: any, partyId: any = null, collectionDate: Date = null) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalesInvoiceListfromDispatchJson?dispatchMasterId=${dispatchMasterId}&partyId=${partyId}&collectionDate=${collectionDate}`,
      this.httpOptions
    );
  }
  public GetSalesInvoiceListfromDispatchJson_v2(dispatchMasterId: any, partyId: any = 0, collectionDate: Date = null, territoryCode: any = '', transactionTypeId: any = null, mioCode: any = '') {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalesInvoiceListfromDispatchJson_v2?dispatchMasterId=${dispatchMasterId}&partyId=${partyId}&collectionDate=${collectionDate}&territoryCode=${territoryCode}&transactionTypeId=${transactionTypeId}&mioCode=${mioCode}`,
      this.httpOptions
    );
  }

  // Tender bill-collection: invoices for a party (no territory), bill-sourced only
  public GetSalesInvoiceListForBillCollection(collectionMasterId: any = 0, partyId: any = 0, collectionDate: Date = null) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalesInvoiceListForBillCollection?collectionMasterId=${collectionMasterId}&partyId=${partyId}&collectionDate=${collectionDate}`,
      this.httpOptions
    );
  }

  // Tender bill-collection: customers who have a bill-sourced invoice
  public GetPartybyTerritoryCodeForBillCollection(territoryCode: any = '', depotCode: any = '') {
    return this.http.get<any>(
      `${this.apiUrl}SalesCollection/GetPartybyTerritoryCodeForBillCollection?territoryCode=${territoryCode}&depotCode=${depotCode}`,
      this.httpOptions
    );
  }

  public GetCollectionAmountWiseCommissionPercent(collectionDate: Date) {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesCollection/GetCollectionAmountWiseCommissionPercent?collectionDate=${collectionDate}`,
      this.httpOptions
    );
  }
  public getProductSerialNoByProductSpec(productWiseSpecificationId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/getProductSerialNoByProductSpec?productWiseSpecificationId=${productWiseSpecificationId}`,
      this.httpOptions
    );
  }
  public GetAddressForReportFooter(companyId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetAddressForReportFooter?companyId=${companyId}`,
      this.httpOptions
    );
  }

  //Crystal Report Project API

  public GetSalesInvoiceReportById(salesInvoiceId: any, reportFormat: any) {
    //debugger;
    return this.http.get<any>(
      `${this.reportApiUrl}SalesInvoiceReport/GetSalesInvoiceReportById?salesInvoiceId=${salesInvoiceId}&reportFormat=${reportFormat}`,
      this.httpOptions
    );
  }

  public GetTenderQuotationReportById(quotationMasterId: any, reportFormat: any) {
    return this.http.get<any>(
      `${this.reportApiUrl}SalesInvoiceReport/GetTenderQuotationReportById?quotationMasterId=${quotationMasterId}&reportFormat=${reportFormat}`,
      this.httpOptions
    );
  }

  public GetTenderBillReportById(billMasterId: any, reportFormat: any) {
    return this.http.get<any>(
      `${this.reportApiUrl}SalesInvoiceReport/GetTenderBillReportById?billMasterId=${billMasterId}&reportFormat=${reportFormat}`,
      this.httpOptions
    );
  }

  public GetALLTenderQuotationApproval(isApproved: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetALLTenderQuotationApproval?isApproved=${isApproved}`,
      this.httpOptions
    );
  }

  public SaveTenderQuotationApproval(model: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}SalesInvoice/SaveTenderQuotationApproval`,
      model,
      this.httpOptions
    );
  }

  public GetAllTerritoryForDepot(depotCode: any = '') {// v2
    return this.http.get<any>(
      `${this.apiUrl}SalesCollection/GetAllTerritoryForDepot?depotCode=${depotCode}`,
      this.httpOptions
    );
  }

  public GetDuplicatePartyInfo(partyName: any, mobileNo: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetDuplicatePartyInfo?partyName=${partyName}&mobileNo=${mobileNo}`,
      this.httpOptions
    );
  }
  public SaveParty(
    model: any
    // companyId: any,
    // sbuId: any,
    // partyTypeId: any,
    // pName: any,
    // pMobile: any,
    // pAddress: any
  ) {
    //debugger;
    //return this.http.get<any>(
    // `${this.reportApiUrl}SalesInvoice/SaveParty?companyId=${companyId}&sbuId=${sbuId}&partyTypeId=${partyTypeId}&pName=${pName}&pMobile=${pMobile}&pAddress=${pAddress}`,
    // this.httpOptions
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/SaveParty`,
      model,
      this.httpOptions
    );
  }

  public GetPartyByTerritoryCode(territoryCode: any, depotCode: any = "") {
    return this.http.get<any>(
      `${this.apiUrl}SalesCollection/GetPartybyTerritoryCode?territoryCode=${territoryCode}&depotCode=${depotCode}`,
      this.httpOptions
    );
  }

  public GetPartybyDepotCode(depotCode: any = "") {
    return this.http.get<any>(
      `${this.apiUrl}SalesCollection/getPartybyDepotCode?depotCode=${depotCode}`,
      this.httpOptions
    );
  }

  public GetPartybyTerritoryCodeForCollection(territoryCode: any, depotCode: any = "") {
    return this.http.get<any>(
      `${this.apiUrl}SalesCollection/GetPartybyTerritoryCodeForCollection?territoryCode=${territoryCode}&depotCode=${depotCode}`,
      this.httpOptions
    );
  }

  public SaveTerritoryCollectionTarget(master: any): Observable<string> {
    console.log(master);
    return this.http.post<string>(
      `${this.apiUrl}SalesCollection/SaveTerritoryCollectionTarget`,
      master,
      this.commonService.getHttpOptions()
    );
  }

  public GetTerritoryCollectionTarget(collectionTargetId: any = 0): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesCollection/GetTerritoryCollectionTarget?collectionTargetId=${collectionTargetId}`,
      this.commonService.getHttpOptions()
    );
  }

  public DeleteTerritoryCollectionTarget(collectionTargetMasterId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesCollection/DeleteTerritoryCollectionTarget`,
      collectionTargetMasterId,
      this.commonService.getHttpOptions()
    );
  }

  public GetPicingItemSummary(pickingMasterId: number, reportFormat: any = ''): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoiceReport/GetPickingReportById?reportFormat=${reportFormat}&pickingMasterId=${pickingMasterId}`,
      this.commonService.getHttpOptions()
    );
  }

  public GetPicingInvoiceDetails(pickingMasterId: number, reportFormat: any = ''): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoiceReport/GetSalesInvoicesReportByPickingMasterId?reportFormat=${reportFormat}&pickingMasterId=${pickingMasterId}`,
      this.commonService.getHttpOptions()
    );
  }

  public GetCreditNoteList(partyId: number, salesinvoicId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesReturn/GetSalesPExpireReturnByPartyId?partyId=${partyId}&salesinvoicId=${salesinvoicId}`,
      this.commonService.getHttpOptions()
    );
  }
  public PExpireReturnInvoiceIdRemoveByUncheck(productExpireReturnId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesReturn/PExpireReturnInvoiceIdRemoveByUncheck?productExpireReturnId=${productExpireReturnId}`,
      this.commonService.getHttpOptions()
    );
  }

  public DeleteDispatch(masterId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/DeleteDispatch`,
      masterId,
      this.commonService.getHttpOptions()
    );
  }
  public GetSalesGrossReturnDetailsInvoiceByMasterId(salesReturnMasterId: any, partyId: any, collectionDate: Date = null) {
    return this.http.get<any>(
      `${this.apiUrl}SalesReturn/GetSalesGrossReturnDetailsInvoiceByMasterId?salesReturnMasterId=${salesReturnMasterId}&partyId=${partyId}`,
      this.httpOptions
    );
  }
  public GetCollectionDiscountNotApplicableProductList(partyId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetCollectionDiscountNotApplicableProductList?partyId=${partyId}`,
      this.httpOptions
    );
  }
  public GetAllApprovedDestructionNoteNo() {
    return this.http.get<any>(
      `${this.apiUrl}ProductTransfer/GetAllApprovedDestructionNoteNo`,
      this.httpOptions
    );
  }

  public GetAllDestructionNoteReceive(masterId: number) {
    return this.http.get<any>(
      `${this.apiUrl}ProductTransfer/GetAllDestructionNoteReceive?masterId=${masterId}`,
      this.httpOptions
    );
  }
  public GetDestructionNoteById(masterId: number) {
    return this.http.get<any>(
      `${this.apiUrl}ProductTransfer/GetDestructionNoteById?masterId=${masterId}`,
      this.httpOptions
    );
  }
  public DeleteDestructionNoteReceiveById(masterId: number) {
    return this.http.post<any>(
      `${this.apiUrl}ProductTransfer/DeleteDestructionNoteReceiveById`, masterId,
      this.httpOptions
    );
  }
  public SaveDestructionNoteReceive(model: any) {
    return this.http.post<any>(
      `${this.apiUrl}ProductTransfer/SaveDestructionNoteReceive`, model,
      this.httpOptions
    );
  }

  public GenerateSalesInvoiceBySalesOrder(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/GenerateSalesInvoiceBySalesOrder`,
      master,
      this.httpOptions
    );
  }

  public GenerateSalesInvoiceBySalesOrder_v2(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/GenerateSalesInvoiceBySalesOrder_v2`,
      master,
      this.httpOptions
    );
  }

  public GetSalesOrderMasterApprovedList(masterId: any, territoryCode) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalesOrderMasterApprovedList?masterId=${masterId}&territoryCode=${territoryCode}`,
      this.httpOptions
    );
  }

  public GetSalesOrderDetailsByIdForApproval(
    salesOrderId: any
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalesOrderDetailsByIdForApproval?salesOrderId=${salesOrderId}`,
      this.httpOptions
    );
  }
  public downloadSalesReportNationallyDynamicReportFile(): Observable<any> {
    return this.http.get(`${this.apiUrl}SalesInvoice/download`, {
      ...this.httpOptions,
      responseType: 'blob' // Set the responseType to 'blob'
    });
  }
  public getProductWiseSpecificationIdByName(productCode: string) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/getProductWiseSpecificationIdByName?productCode=${productCode}`,
      this.httpOptions
    );
  }
  public getTerritoryForTerritoryTransfer(
    TerritoryID: any
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/getTerritoryForTerritoryTransfer?TerritoryID=${TerritoryID}`,
      this.httpOptions
    );
  }
  public TransferTerritoryData(master: any) {
    return this.http.post<any>(
      `${this.apiUrl}SalesInvoice/TransferTerritoryData`,
      master,
      this.httpOptions
    );
  }

  // #region Tender Challan
  public SaveTenderChallan(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/SaveTenderChallan`,
      master,
      this.httpOptions
    );
  }

  public GetTenderChallanById(challanMasterId: any, fDate: any, tDate: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetTenderChallanById?challanMasterId=${challanMasterId}&fDate=${fDate}&tDate=${tDate}`,
      this.httpOptions
    );
  }
   public GetTenderChallanWihoutQuotationById(challanMasterId: any, fDate: any, tDate: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetTenderChallanWihoutQuotationById?challanMasterId=${challanMasterId}&fDate=${fDate}&tDate=${tDate}`,
      this.httpOptions
    );
  }
  public GetQuotationForChallan(partyId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetQuotationForChallan?partyId=${partyId}`,
      this.httpOptions
    );
  }
  public GetTenderQuotationDetailsForChallanById(quotationMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetTenderQuotationDetailsForChallanById?quotationMasterId=${quotationMasterId}`,
      this.httpOptions
    );
  }
  public GetTenderChallanDetailsForFinalChallanByQuotationMasterId(quotationMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetTenderChallanDetailsForFinalChallanByQuotationMasterId?quotationMasterId=${quotationMasterId}`,
      this.httpOptions
    );
  }
  // #endregion Tender Challan

  // #region Tender Bill
  public SaveTenderBill(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/SaveTenderBill`,
      master,
      this.httpOptions
    );
  }
  public GetTenderBillById(billMasterId: any, fDate: any, tDate: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetTenderBillById?billMasterId=${billMasterId}&fDate=${fDate}&tDate=${tDate}`,
      this.httpOptions
    );
  }
  public GetChallanForBill(partyId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetChallanForBill?partyId=${partyId}`,
      this.httpOptions
    );
  }
  public GetChallanDetailsForBillById(challanMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetChallanDetailsForBillById?challanMasterId=${challanMasterId}`,
      this.httpOptions
    );
  }
  // #endregion Tender Bill
}
