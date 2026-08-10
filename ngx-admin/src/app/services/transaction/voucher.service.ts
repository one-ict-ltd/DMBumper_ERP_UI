
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class VoucherService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getVoucher(voucherMasterId, voucherTypeId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Voucher/getvoucherMaster?voucherMasterId=${voucherMasterId}&voucherTypeId=${voucherTypeId}`,
      this.httpOptions
    );
  }

  public getVoucherWithDate(voucherMasterId, voucherTypeId, fromDate, toDate): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Voucher/getvoucherMasterWithDate?voucherMasterId=${voucherMasterId}&voucherTypeId=${voucherTypeId}&fromDate=${fromDate}&toDate=${toDate}`,
      this.httpOptions
    );
  }

  public getUploadedVoucher(voucherTypeId: number = 0): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Voucher/getUploadedVoucher?voucherTypeId=${voucherTypeId}`,
      this.httpOptions
    );
  }

  public VoucherEditDeleteCheck(voucherMasterId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Voucher/VoucherEditDeleteCheck?voucherMasterId=${voucherMasterId}`,
      this.httpOptions
    );
  }

  public getVoucherForPosting(voucherMasterId, voucherTypeId, isPost): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Voucher/getvoucherMasterForPosting?voucherMasterId=${voucherMasterId}&voucherTypeId=${voucherTypeId}&isPost=${isPost}`,
      this.httpOptions
    );
  }

  public getVoucherReportById(voucherTypeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}AccountReport/getRptVoucherPreview?vmasterId=${voucherTypeId}`,
      this.httpOptions
    );
  }

  public getVoucherNo(voucherTypeId, voucherDate): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Voucher/getvoucherNo?voucherTypeId=${voucherTypeId}&voucherDate=${voucherDate}`,
      this.httpOptions
    );
  }
  public getVoucherById(voucherMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Voucher/getvoucherMaster?voucherMasterId=${voucherMasterId}`,
      this.httpOptions
    );
  }
  public getVoucherDetailByMasterId(voucherMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Voucher/getvoucherDetailByMasterId?voucherMasterId=${voucherMasterId}`,
      this.httpOptions
    );
  }
  public getVoucherAttachmentByMasterId(voucherMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Voucher/getvoucherAttachmentByMasterId?voucherMasterId=${voucherMasterId}`,
      this.httpOptions
    );
  }
  public downloadVoucherAttachmentByAttachmentId(voucherAttachmentId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Voucher/downloadVoucherAttachmentByMasterId?voucherAttachmentId=${voucherAttachmentId}`,
      this.httpOptions
    );
  }
  public getCostCentreAllocationByMasterId(voucherMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Voucher/getCostCentreAllocationByMasterId?voucherMasterId=${voucherMasterId}`,
      this.httpOptions
    );
  }
  public getBalanceById(ledgerId, partyId) {
    return this.http.get<any>(
      `${this.apiUrl}Voucher/getBalanceAmountByLedger?ledgerId=${ledgerId}&partyId=${partyId}`,
      this.httpOptions
    );
  }
  public saveVoucher(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Voucher/setVoucher`,
      master,
      this.httpOptions
    );
  }

  public updateVoucher(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Voucher/UpdateVoucherMaster`,
      master,
      this.httpOptions
    );
  }

  public deleteVoucher(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Voucher/deletevoucherMaster`,
      master,
      this.httpOptions
    );
  }

  public checkLockFiscalYear(voucherDate) {
    return this.http.get<any>(
      `${this.apiUrl}Voucher/CheckLockFiscalYear?voucherDate=${voucherDate}`,
      this.httpOptions
    );
  }

  public getVoucherType(voucherTypeId) {
    return this.http.get<any>(
      `${this.apiUrl}VoucherType/getVoucherType?voucherTypeId=${voucherTypeId}`,
      this.httpOptions
    );
  }

}
