import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductrequisitionService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getProductRequisitionNo(productRequisitionDate: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}PurCommon/GetMaxProductReqNumber?prodReqDate=${productRequisitionDate}`,
      this.httpOptions
    );
  }
  public getProductRequisition(prodReqId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductRequisition/getProductRequisition?prodReqId=${prodReqId}`,
      this.httpOptions
    );
  }

  public getProductReqDetailsById(prodReqId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ProductRequisition/GetProductReqDetails?prodReqId=${prodReqId}`,
      this.httpOptions
    );
  }
  public getAllProductForRequisition() {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getAllProductForRequisition`,
      this.httpOptions
    );
  }
  public getAllProductForRequisitionByProductTypeId(productTypeId: number) {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/GetAllProductForRequisitionByProductTypeId?productTypeId=${productTypeId}`,
      this.httpOptions
    );
  }

  public getAllProductForCreditNote() {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getAllProductForCreditNote`,
      this.httpOptions
    );
  }
  public getAllProductForFrizz() {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/GetAllProductForFrizz`,
      this.httpOptions
    );
  }
  public GetAllProductForDiscountPolicy(withoutDealProduct: number = 0, fromDate: Date = null, toDate: Date = null, partyId: number = 0) {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/GetAllProductForDiscountPolicy?withoutDealProduct=${withoutDealProduct}&fromDate=${fromDate}&toDate=${toDate}&partyId=${partyId}`,
      this.httpOptions
    );
  }
  public GetAllProductForAllDiscountPolicy(policyType: string, partyId: number, fromDate: Date, toDate: Date, withoutDealProduct: boolean = false) {
    debugger
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/GetAllProductForAllDiscountPolicy?policyType=${policyType}&partyId=${partyId}&fromDate=${fromDate}&toDate=${toDate}&withoutDealProduct=${withoutDealProduct}`,
      this.httpOptions
    );
  }
  public setDepotToDepotTransfer(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductRequisition/setDepotToDepotTransfer`, master,
      this.httpOptions
    );
  }
  public saveProductRequisition(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductRequisition/setProductRequisition`, master,
      this.httpOptions
    );
  }
  public deleteProductRequisitionById(prodReqId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductRequisition/DeleteProductReqById?prodReqId=${prodReqId}`,
      this.httpOptions
    );
  }
  public deleteProductRequisitionDetailsById(productReqDetailsId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductRequisition/deleteproductReqDetailsId?productReqDetailsId=${productReqDetailsId}`,
      this.httpOptions
    );
  }

  public getProductReqReportById(prodReqId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ProductRequisition/getRptGridProductReq?prodReqId=${prodReqId}`,
      this.httpOptions
    );
  }
  public getAllFinalizeRequisitionProducts(finalizeDetailId) {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getAllFinalizeRequisitionProducts?finalizeDetailId==${finalizeDetailId}`,
      this.httpOptions
    );
  }
  public getProductMonitorById(monitorId: any, fDate: any, tDate: any, territoryCode: string = '') {
    return this.http.get<any>(
      `${this.apiUrl}SalesMonitorAndTarget/GetProductMonitor?monitorId=${monitorId}&fromDate=${fDate}&toDate=${tDate}&territoryCode=${territoryCode}`,
      this.httpOptions
    );
  }


  public saveProductMonitor(master: any) {
    return this.http.post<any>(
      `${this.apiUrl}SalesMonitorAndTarget/SaveProductMonitor`, master,
      this.httpOptions
    );
  }

  public GetWeeklyProductTarget(fDate: any, tDate: any, weeklyTargetId: number = 0) {
    return this.http.get<any>(
      `${this.apiUrl}SalesMonitorAndTarget/GetWeeklyProductTarget?fDate=${fDate}&tDate=${tDate}&weeklyTargetId=${weeklyTargetId}`,
      this.httpOptions
    );
  }

  public GetWeeklyTargetPercentageById(weeklyTargetId: number = 0) {
    return this.http.get<any>(
      `${this.apiUrl}SalesMonitorAndTarget/GetWeeklyTargetPercentageById?weeklyTargetId=${weeklyTargetId}`,
      this.httpOptions
    );
  }

  public saveWeeklyTarget(master: any) {
    return this.http.post<any>(
      `${this.apiUrl}SalesMonitorAndTarget/SaveWeeklyTargetPercentage`, master,
      this.httpOptions
    );
  }

  public deleteWeeklyTargetPercentage(weeklyTargetId: any) {
    return this.http.post<any>(
      `${this.apiUrl}SalesMonitorAndTarget/DeleteWeeklyTargetPercentage`, weeklyTargetId,
      this.httpOptions
    );
  }

  public deleteProductMonitor(monitorId: any) {
    return this.http.post<any>(
      `${this.apiUrl}SalesMonitorAndTarget/DeleteProductMonitor`, monitorId,
      this.httpOptions
    );
  }
  public getAllProductForBOM(type: any) {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/GetAllProductForBOM?type=${type}`,
      this.httpOptions
    );
  }
  public updateFrizzProductStatus(lstDetailsViewModel: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesInvoice/UpdateFrizzProductStatus`, lstDetailsViewModel,
      this.httpOptions
    );
  }
  public saveExecutiveWiseProduct(execProdList: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesMonitorAndTarget/saveExecutiveWiseProduct`, execProdList,
      this.httpOptions
    );
  }
}
