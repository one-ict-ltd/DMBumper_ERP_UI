import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VisasalesService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getVisaSales(isProcessed): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Dahmashi/getVisaSales?visaSaleId=0&isProcessed=${isProcessed}`,
      this.httpOptions
    );
  }
  public getVisaSalesById(visaSaleId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Dahmashi/getVisaSales?visaSaleId=${visaSaleId}&isProcessed=ALL`,
      this.httpOptions
    );
  }

  public saveVisaSales(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Dahmashi/setVisaSales`,
      master,
      this.httpOptions
    );
  }

  public deleteVisaSales(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Dahmashi/deleteVisaSales`,
      master,
      this.httpOptions
    );
  }

  public getPassengerInfoByPassport(passportNo: any) {
    return this.http.get<any>(
      `${this.apiUrl}Dahmashi/getPassengerInfoByPassport?passportNo=${passportNo}`,
      this.httpOptions
    );
  }

  public createAutoReceiveVoucherForSales(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Dahmashi/createAutoReceiveVoucherForSales`,
      master,
      this.httpOptions
    );
  }

  public getDuplicateVisaSales(visaSaleId, passportNo) {
    return this.http.get<any>(
      `${this.apiUrl}Dahmashi/getDuplicateVisaSales?visaSaleId=${visaSaleId}&passportNo=${passportNo}`,
      this.httpOptions
    );
  }

}
