import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AutovouchersettingService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getAutoVoucherMaster(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}VoucherType/getAutoVoucherMaster?companyId=0&sbuId=0&autoVoucherMasterId=0`,
      this.httpOptions
    );
  }

  public getAutoVoucherMasterById(autoVoucherMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}VoucherType/getAutoVoucherMaster?companyId=0&sbuId=0&autoVoucherMasterId=${autoVoucherMasterId}`,
      this.httpOptions
    );
  }

  public saveAutoVoucherMaster(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}VoucherType/setAutoVoucherMaster`,
      master,
      this.httpOptions
    );
  }

  public deleteAutoVoucherMaster(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}VoucherType/deleteAutoVoucherMaster`,
      master,
      this.httpOptions
    );
  }

  public getAutoVoucherDetailByMasterId(autoVoucherMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}VoucherType/getAutoVoucherDetailByMasterId?autoVoucherMasterId=${autoVoucherMasterId}`,
      this.httpOptions
    );
  }
}
