import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from 'app/@core/mock/common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesRemittanceService {


  apiUrl: string = this.commonService.baseUrl;
  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  public SaveRemittance(remittance: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesRemittance/SaveRemittance`, remittance, this.commonService.getHttpOptions()
    );
  }
  public UpdateHasRemittanceOfCollectionMaster(myCollections: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesRemittance/UpdateHasRemittanceOfCollectionMaster`, myCollections, this.commonService.getHttpOptions()
    );
  }

  GetRemittanceById(remittanceId: number) {
    return this.http.get<string>(
      `${this.apiUrl}SalesRemittance/GetRemittanceById?remittanceId=${remittanceId}`, this.commonService.getHttpOptions()
    );
  }

  GetOplTranNoStatus(oplTranNo: string, remittanceId: number = 0) {
    return this.http.get<string>(
      `${this.apiUrl}SalesRemittance/GetOplTranNoStatus?oplTranNo=${oplTranNo}&remittanceId=${remittanceId}`, this.commonService.getHttpOptions()
    );
  }
  GetRemittanceList(arg0: number, arg1: any, arg2: any) {
    return this.http.get<string>(
      `${this.apiUrl}SalesRemittance/GetRemittanceList?remittanceId=${arg0}&fDate=${arg1}&tDate=${arg2}`, this.commonService.getHttpOptions()
    );
  }

  GetCashInHandByDepotCode(depotCode: any, queryDate: Date = new Date()): Observable<string> {
    const qDate = this.commonService.DateFormat(queryDate);
    return this.http.get<string>(
      `${this.apiUrl}SalesRemittance/GetCashInHandByDepotCode?depotCode=${depotCode}&queryDate=${qDate}`, this.commonService.getHttpOptions()
    );
  }
  GetDepotWiseCollections(depotCode: string): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesRemittance/GetDepotWiseCollections?depotCode=${depotCode}`, this.commonService.getHttpOptions()
    );
  }

  DeleteRemittance(remittanceId: number): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesRemittance/DeleteRemittance?remittanceId=${remittanceId}`, remittanceId, this.commonService.getHttpOptions()
    );
  }

  DownloadRemittanceSlip(remittanceSlipId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalesRemittance/downloadRemittanceSlipsByRemslipId?remittanceSlipId=${remittanceSlipId}`,
      this.commonService.getHttpOptions()
    );
  }
}
