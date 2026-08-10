import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class StockreceiveService {
  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;
  constructor(private http: HttpClient, private commonService: CommonService) { }

  public GetAllProductReceiveNumber(sbuId: any, type: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}stock/GetProductTransferTRNNoById?stockReceiveSbuId=${sbuId}&type=${type}`,
      this.httpOptions
    );
  }

  public GetMaxStockReceiveNumber(date: any, receiveType: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}stock/GetMaxStockTransferNumber?dateTime=${date}&receiveType=${receiveType}`,
      this.httpOptions
    );
  }

  public GetStockReceiveById(stockReceiveId: any, receiveType: any, fromDate: Date = null, toDate: Date = null): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}stock/GetStockReceiveById?stockReceiveId=${stockReceiveId}&receiveType=${receiveType}&fDate=${this.commonService.DateFormat(fromDate)}&tDate=${this.commonService.DateFormat(toDate)}`,
      this.httpOptions
    );
  }

  public SaveStockTransferReceive(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}stock/SaveStockReceive`,
      master,
      this.httpOptions
    );
  }

  public DeleteStockTransferReceiveById(masterId: number): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}stock/DeleteStockTransferReceiveById`,
      masterId,
      this.httpOptions
    );
  }

  public GetProductTransferDetailsById(prodTrnfrId: any) {
    return this.http.get<any>(
      `${this.apiUrl}stock/GetProductTransferStockDetailsById?prodReqId=${prodTrnfrId}`,
      this.httpOptions
    );
  }

  public getStockReceiveIdWiseInUpdate(stockReceiveId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}stock/getStockReceiveIdWiseInUpdate?stockReceiveId=${stockReceiveId}`,
      this.httpOptions
    );
  }

  public getStockReceiveReportById(voucherTypeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}stock/GetRptStockReceivePreview?stockReceiveId=${voucherTypeId}`,
      this.httpOptions
    );
  }


}
