import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BillcollectionService {
  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;
  constructor(private http: HttpClient, private commonService: CommonService) { }


  public getInvoiceNumber(): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetSalesInvoiceById?salesInvoiceId=${0}`,
      this.httpOptions
    );
  }

  public getpaymentMode(): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesCollection/GetPaymentModeById?paymentModeId=${0}`,
      this.httpOptions
    );
  }
  public GetTransactionType(transactionTypeId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}CmnDropDown/GetCmnTransactionType?transactionTypeId=${transactionTypeId}`,
      this.httpOptions
    );
  }
  public getBillCollection(SalesCollection: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesCollection/GetSalesCollectionById?salesInvoiceId=${SalesCollection}`,
      this.httpOptions
    );
  }

  public getBillCollection_v2(salesCollectionId: any, fdate: Date = null, tdate: Date = null): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesCollection/GetSalesCollectionById_v2?salesCollectionId=${salesCollectionId}&fDate=${fdate}&tDate=${tdate}`,
      this.httpOptions
    );
  }

  public saveBillCollection(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesCollection/SaveCollectionInvoice`, master,
      this.httpOptions
    );
  }


  public getCollectionDetailsData(collectionMasterId): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesCollection/GetSalesCollectionDetailsByMasterId?salesCollectionId=${collectionMasterId}`,
      this.httpOptions
    );
  }

  public GetMaxSalesCollectionNumber(date): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesCollection/GetMaxSalesCollectionNumber?dateTime=${date}`,
      this.httpOptions
    );
  }

  // Tender/bill: territory/depot-free collection number preview (COL<yyMM>-<seq>)
  public GetMaxSalesCollectionNumberForBill(date): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesCollection/GetMaxSalesCollectionNumberForBill?dateTime=${date}`,
      this.httpOptions
    );
  }

  public GetMaxMoneyReceiptNo(date): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesInvoice/GetMaxMoneyReceiptNo?dateTime=${date}`,
      this.httpOptions
    );
  }

  public getBillCollectionReportById(collectionMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalesCollection/getRptBillCollection?collectionMasterId=${collectionMasterId}`,
      this.httpOptions
    );
  }

  public GetSalesInvoiceAmountById(salesInvoiceId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetSalesInvoiceAmountById?salesInvoiceId=${salesInvoiceId}`,
      this.httpOptions
    );
  }

  public GetAllMoneyReceiptNote(masterId: any, fdate: Date = null, tdate: Date = null) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetAllMoneyReceiptNote?masterId=${masterId}&fdate=${fdate}&tdate=${tdate}`,
      this.httpOptions
    );
  }

  public GetAllMoneyReceipt(masterId: any, fdate: Date = null, tdate: Date = null) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetAllMoneyReceipt?masterId=${masterId}&fdate=${fdate}&tdate=${tdate}`,
      this.httpOptions
    );
  }

  public GetAllMoneyReceiptDetails(masterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetAllMoneyReceiptDetails?masterId=${masterId}`,
      this.httpOptions
    );
  }

  public GetAllPendingMoneyRecipts(territoryCode: any, mioCode: string = '') {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetAllPendingMoneyRecipts?territoryCode=${territoryCode}&mioCode=${mioCode}`,
      this.httpOptions
    );
  }

  // Tender bill-collection: recent pending money receipts (no territory)
  public GetAllPendingMoneyReciptsForBill() {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/GetAllPendingMoneyReciptsForBill`,
      this.httpOptions
    );
  }

  public SaveMoneyReceiptNote(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/SaveMoneyReceiptNote`, master,
      this.httpOptions
    );
  }
  public SaveMoneyReceipt(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/SaveMoneyReceipt`, master,
      this.httpOptions
    );
  }
  public DeleteMoneyReceiptNoteById(masterId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/DeleteMoneyReceiptNoteById`, masterId,
      this.httpOptions
    );
  }

  public deleteBillCollectionById(collectionMasterId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesCollection/DeleteSalesCollectionById?salesInvoiceId=${collectionMasterId}`,
      this.httpOptions
    );
  }

  public DeleteSalesCollectionByMasterId(collectionMasterId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesCollection/DeleteSalesCollectionByMasterId`, collectionMasterId,
      this.httpOptions
    );
  }
}
