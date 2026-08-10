import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";
import { NbDialogService, NbToastrService } from "@nebular/theme";
@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})
export class MiovisitService {
  apiUrl: string = this.commonService.baseUrl;
  apifieldForceGlobalUrl: string = this.commonService.fieldForceGlobalUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;
  constructor(private http: HttpClient, private commonService: CommonService,
    private toastrService: NbToastrService) { }


  public getMIO(TerritoryCode) {
    return this.http.get<any>(
      `${this.apifieldForceGlobalUrl}getMIO?code=${TerritoryCode}`,
      this.httpOptions
    );
  }

  public getCustomer(MarketName) {
    return this.http.get<any>(
      `${this.apifieldForceGlobalUrl}GetCustomerbyMarketCode?MarketCode=${MarketName}`,
      this.httpOptions
    );
  }

  public GetDoctorByTerritoryMarket(MarketID, TerritoryID) {
    return this.http.get<any>(
      `${this.apiUrl}Doctor/GetDoctorByTerritoryMarket?MarketID=${MarketID}&TerritoryID=${TerritoryID}`,
      this.httpOptions
    );
  }

}
