import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class SalesofferService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public GetSalesOfferById(salesOfferId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesOffer/GetSalesOfferById?salesOfferId=${salesOfferId}`,
      this.httpOptions
    );
  }
  public GetSalesOfferDetailsByMasterId(salesOfferId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesOffer/GetSalesOfferDetailsByMasterId?salesOfferId=${salesOfferId}`,
      this.httpOptions
    );
  }
  // public GetSalesOfferTCByMasterId(salesOfferId: any): Observable<any> {
  //   debugger;
  //   return this.http.get<any>(
  //     `${this.apiUrl}SalesOffer/GetSalesOfferTCByMasterId?salesOfferId=${salesOfferId}`,
  //     this.httpOptions
  //   );
  // }
  public SaveSalesOffer(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesOffer/SaveSalesOffer`, master,
      this.httpOptions
    );
  }
  public DeleteSalesOfferById(salesOfferId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesOffer/DeleteSalesOfferById?salesOfferId=${salesOfferId}`,
      this.httpOptions
    );
  }
  public DeleteSalesOfferDetailsById(productTrnfrDetailsId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesOffer/DeleteSalesOfferDetailsById?salesOfferId=${productTrnfrDetailsId}`,
      this.httpOptions
    );
  }
  // public DeleteSalesOfferTCById(productTrnfrDetailsId: any): Observable<string> {
  //   return this.http.post<string>(
  //     `${this.apiUrl}SalesOffer/DeleteSalesOfferTCById?salesOfferId=${productTrnfrDetailsId}`,
  //     this.httpOptions
  //   );
  // }
  public GetMaxSalesOfferNumber(date: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesOffer/GetMaxSalesOfferNumber?dateTime=${date}`,
      this.httpOptions
    );
  }
  public GetSalesOfferReportDataById(salesOfferId: any)//, partyId: any, fromDate: any, toDate: any): Observable<string>
  {
    return this.http.get<string>(
      `${this.apiUrl}SalesOffer/GetSalesOfferReportData?salesOfferId=${salesOfferId}`,
      this.httpOptions
    );
  }
  public GetSalesOfferReportData(salesOfferId: any, partyId: any, fromDate: any, toDate: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesOffer/GetSalesOfferReportData?salesOfferId=${salesOfferId}&partyId=${partyId}&fromDate=${fromDate}&toDate=${toDate}`,
      this.httpOptions
    );
  }
  public GetProductSpecDetailsBySpecId(productSpecId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalesOffer/GetProductSpecDetailsBySpecId?productSpecId=${productSpecId}`,
      this.httpOptions
    );
  }
  public GetAllPartysByTypeId(partyTypeId: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesOffer/GetAllPartysByTypeId?partyTypeId=${partyTypeId}`,
      this.httpOptions
    );
  }
  public GetPartyDetailsById(partyId: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesOffer/GetPartyDetailsById?partyId=${partyId}`,
      this.httpOptions
    );
  }
  public GetSalesOfferListByPartyId(partyId: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesOffer/GetOfferListByPartyId?partyId=${partyId}`,
      this.httpOptions
    );
  }
  public GetCurrentStock(storeId: any, productWiseSpecificationId: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}SalesOffer/GetCurrentStock?storeId=${storeId}&productWiseSpecificationId=${productWiseSpecificationId}`,
      this.httpOptions
    );
  }
  public getProductImage(filePath: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}Product/getProductImage?filePath=${filePath}`,
      this.httpOptions
    );
  }
}

