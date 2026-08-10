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
  //button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getVoucherType(): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}VoucherType/getVoucherType`,
      this.httpOptions
    );
  }

  public getVoucherTypeById(voucherTypeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}VoucherType/getVoucherType?voucherTypeId=${voucherTypeId}`,
      this.httpOptions
    );
  }
  public saveVoucherType(master: any): Observable<string> {

    return this.http.post<string>(
      `${this.apiUrl}VoucherType/setVoucherType`,
      master,
      this.httpOptions
    );
  }
  public deleteVoucherType(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}VoucherType/deleteVoucherType`,
      master,
      this.httpOptions
    );
  }

  // ///////////////////////////////////////////
  // public setbuttonClicked(data: any) {
  //   this.button = data;
  // }

  // public getbuttonClicked() {
  //   return this.button;
  // }

  public GetMenuWiseTransactionDateUnlockList(masterId: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}CmnSetting/GetMenuWiseTransactionDateUnlockList?masterId=${masterId}`,
      this.httpOptions
    );
  }
  public GetMenuListForTransactionDateUnlock(): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}CmnSetting/GetMenuListForTransactionDateUnlock`,
      this.httpOptions
    );
  }
  public SaveMenuWiseTransactionDateUnlock(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}CmnSetting/SaveMenuWiseTransactionDateUnlock`,
      master,
      this.httpOptions
    );
  }
  public DeleteMenuWiseTransactionDateUnlock(masterId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}CmnSetting/DeleteMenuWiseTransactionDateUnlock`,
      masterId,
      this.httpOptions
    );
  }
}
