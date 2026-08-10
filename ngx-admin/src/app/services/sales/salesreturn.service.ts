import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SalesreturnService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public SaveSalesReturnMaster(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesReturn/SaveSalesReturnMaster`, master,
      this.httpOptions
    );
  }

  public SaveSalesGrossReturnMaster(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesReturn/SaveSalesGrossReturnMaster`, master,
      this.httpOptions
    );
  }

  public SaveSalesGrossReturnMultiple(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesReturn/SaveSalesGrossReturnMultiple`, master,
      this.httpOptions
    );
  }

  public GetSalesReturnMasterByMasterId(salesReturnMasterId: any, fdate: Date = null, tdate: Date = null): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesReturn/GetSalesReturnMasterByMasterId?salesReturnMasterId=${salesReturnMasterId}&fDate=${fdate}&tDate=${tdate}`,
      this.httpOptions
    );
  }

  public GetSalesReturnDetailsByMasterId(salesReturnMasterId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesReturn/GetSalesReturnDetailsByMasterId?salesReturnMasterId=${salesReturnMasterId}`,
      this.httpOptions
    );
  }

  public GetSalesReturnReportByMasterId(salesReturnMasterId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesReturn/GetSalesReturnReportByMasterId?salesReturnMasterId=${salesReturnMasterId}`,
      this.httpOptions
    );
  }

  public GetSalesGrossReturnById(salesReturnMasterId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesReturn/GetSalesGrossReturnById?salesReturnMasterId=${salesReturnMasterId}`,
      this.httpOptions
    );
  }

  public GetSalesGrossReturnMultiById(salesReturnMasterId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesReturn/GetSalesGrossReturnMultiById?salesReturnMasterId=${salesReturnMasterId}`,
      this.httpOptions
    );
  }


  public DeleteSalesReturnMasterByMasterId(salesReturnMasterId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesReturn/DeleteSalesReturnMasterByMasterId`, salesReturnMasterId,
      this.httpOptions
    );
  }

  public SalSpDeleteSalesGrossReturn(salesReturnMasterId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesReturn/SalSpDeleteSalesGrossReturn`, salesReturnMasterId,
      this.httpOptions
    );
  }

  public GetMaxSalesReturnNumber(date: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesReturn/GetMaxSalesReturnNumber?dateTime=${date}`,
      this.httpOptions
    );
  }

  public GetMaxSalesGrossReturnNumber(date: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesReturn/GetMaxSalesGrossReturnNumber?dateTime=${date}`,
      this.httpOptions
    );
  }


  //#region product return

  public GetSalesPExpireReturnById(salesReturnMasterId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesReturn/GetSalesPExpireReturnById?salesReturnMasterId=${salesReturnMasterId}`,
      this.httpOptions
    );
  }

  public SaveSalesPExpireReturnMaster(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesReturn/SaveSalesPExpireReturnMaster`, master,
      this.httpOptions
    );
  }

  public GetMaxSalesPExpireReturnNumber(date: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesReturn/GetMaxSalesPExpireReturnNumber?dateTime=${date}`,
      this.httpOptions
    );
  }

  public SalSpDeleteSalesPExpireReturn(salesReturnMasterId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesReturn/SalSpDeleteSalesPExpireReturn`, salesReturnMasterId,
      this.httpOptions
    );
  }

  public DeletePExpireReturnDetailsById(detailsId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesReturn/DeletePExpireReturnDetailsById`, detailsId,
      this.httpOptions
    );
  }


  public GetSalesPExpireReturnDetailsByMasterId(salesReturnMasterId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      //`${this.apiUrl}SalesReturn/GetSalesPExpireReturnDetailsByMasterId?salesReturnMasterId=${salesReturnMasterId}`,
      `${this.apiUrl}SalesReturn/GetSalesPExpireReturnById?salesReturnMasterId=${salesReturnMasterId}`,
      this.httpOptions
    );
  }

  //#endregion

  public GetSalesGrossReturnDetailsProductByMasterId(salesReturnMasterId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesReturn/GetSalesGrossReturnDetailsProductByMasterId?salesReturnMasterId=${salesReturnMasterId}`,
      this.httpOptions
    );
  }

  public GetSalesGrossReturnSummary(masterId: string, fDate: any, tDate: any, depotCode: string, territoryCode: string, partyId: number): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesReturn/GetSalesGrossReturnSummary?masterId=${masterId}&fDate=${fDate}&tDate=${tDate}&depotCode=${depotCode}&territoryCode=${territoryCode}&partyId=${partyId}`,
      this.httpOptions
    );
  }

  public GetManufactAndExpireDateFromStock(BatchNo: any, productWiseSpecificationId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesReturn/GetManufactAndExpireDateFromStock?BatchNo=${BatchNo}&productWiseSpecificationId=${productWiseSpecificationId}`,
      this.httpOptions
    );
  }
}
