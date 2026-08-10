
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})

export class VouchertypeService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) {}

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

  ///////////////////////////////////////////
  // public setbuttonClicked(data: any) {
  //   this.button = data;
  // }

  // public getbuttonClicked() {
  //   return this.button;
  // }
}

