import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class BomFinishGoodStockInService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public SaveBomFinishGoodStockIn(master: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}BomFinishGoodStockIn/SaveBomFinishGoodStockIn`, master, this.httpOptions
    );
  }
  public DeleteBomFinishGoodStockInMasterById(bomStockInId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}BomFinishGoodStockIn/DeleteBomFinishGoodStockInMasterById`, bomStockInId,
      this.httpOptions
    );
  }
  public DeleteBomFinishGoodStockInDetailsById(bomDetailsId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}BomFinishGoodStockIn/DeleteBomFinishGoodStockInDetailsById`, bomDetailsId,
      this.httpOptions
    );
  }
  public GetBomFinishGoodStockInMasterById(bomStockInId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}BomFinishGoodStockIn/GetBomFinishGoodStockInMasterById?bomStockInId=${bomStockInId}`,
      this.httpOptions
    );
  }
  public GetBomFinishGoodStockInDetailsByMasterId(bomStockInId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}BomFinishGoodStockIn/GetBomFinishGoodStockInDetailsByMasterId?bomStockInId=${bomStockInId}`,
      this.httpOptions
    );
  }
  public GetBomFinishGoodStockInReportDataById(bomStockInId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}BomFinishGoodStockIn/GetBomFinishGoodStockInReportDataById?bomStockInId=${bomStockInId}`,
      this.httpOptions
    );
  }
  public GetMaxBomFinishGoodStockInNumber(bomDate: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}BomFinishGoodStockIn/GetMaxBomFinishGoodStockInNumber?bomDate=${bomDate}`,
      this.httpOptions
    );
  }
  public GetBomFinishGoodProductSpec(productId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}BomFinishGoodStockIn/GetBomFinishGoodProductSpec?productId=${productId}`,
      this.httpOptions
    );
  }
  public GetBomMasterProductSpec(productId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Bom/GetBomProductWiseSpecification?productId=${productId}`,
      this.httpOptions
    );
  }
}
