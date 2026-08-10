import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PromoRequisitionService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public deletePromoRequisitionById(userId: any, promoRequisitionId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Promo/DeletePromoRequisitionById?userId=${userId}&promoRequisitionId=${promoRequisitionId}`,
      this.httpOptions
    );
  }
  public getPromoRequisitionDetailsById(promoRequisitionId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Promo/GetPromoReqDetails?promoRequisitionId=${promoRequisitionId}`,
      this.httpOptions
    );
  }
  public GetAllPacketBySbuId(sbuId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Promo/GetAllPacketBySbuId?sbuId=${sbuId}`,
      this.httpOptions
    );
  }
  public GetMaxPacketTransferNumber(date: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}Promo/GetMaxPacketTransferNumberJson?dateTime=${date}`,
      this.httpOptions
    );
  }
  public GetMaxReceivedTransferNumber(date: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}Promo/GetMaxReceivedTransferNumberJson?dateTime=${date}`,
      this.httpOptions
    );
  }
  public GetMaxDistributeTransferNumber(date: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}Promo/GetMaxDistributeTransferNumberJson?dateTime=${date}`,
      this.httpOptions
    );
  }
  public GetMaxPacketingMasterNo(date: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}Promo/GetMaxPacketingMasterNo?dateTime=${date}`,
      this.httpOptions
    );
  }
  public SavePromoTransfer(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Promo/SavePromoTransfer`,
      master,
      this.httpOptions
    );
  }
  public GetPromoTransferById(prodTrnfrId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Promo/GetPromoTransferById?prodTrnfrId=${prodTrnfrId}`,
      this.httpOptions
    );
  }
  public GetPromoTransferDetailsByMasterId(prodTrnfrId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Promo/GetPromoTransferDetailsByMasterId?prodTrnfrId=${prodTrnfrId}`,
      this.httpOptions
    );
  }
  public DeletePromoTransferById(promoTrnfrId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Promo/DeletePromoTransferById?`, promoTrnfrId,
      this.httpOptions
    );
  }
  public getDistribution(sbuId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Promo/getDistribution?sbuId=${sbuId}`,
      this.httpOptions
    );
  }
  public getReceived(sbuId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Promo/getReceived?sbuId=${sbuId}`,
      this.httpOptions
    );
  }
  public getRequisition(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Promo/getRequisition`,
      this.httpOptions
    );
  }
  public GetAllPacketByDistribution(distributionId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Promo/GetAllPacketByDistribution?distributionId=${distributionId}`,
      this.httpOptions
    );
  }
  public GetAllPacketByReceived(distributionId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Promo/GetAllPacketByReceived?distributionId=${distributionId}`,
      this.httpOptions
    );
  }
  public GetTerritoryByRequisition(selectedRequisitionId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Promo/GetTerritoryByRequisition?requisitionId=${selectedRequisitionId}`,
      this.httpOptions
    );
  }
  public GetAreaManagerCodeByRequisition(selectedRequisitionId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Promo/GetAreaManagerCodeByRequisition?requisitionId=${selectedRequisitionId}`,
      this.httpOptions
    );
  }
  public GetRSMCodeByRequisition(selectedRequisitionId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Promo/GetRSMCodeByRequisition?requisitionId=${selectedRequisitionId}`,
      this.httpOptions
    );
  }
  public GetProductReqDetails(territoryCode: any, requisitionId: any, allocationType: string) {
    return this.http.get<any>(
      `${this.apiUrl}Promo/GetProductReqDetails?territoryCode=${territoryCode}&requisitionId=${requisitionId}&allocationType=${allocationType}`,
      this.httpOptions
    );
  }
  public SaveDepotPromoReceive(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Promo/SaveDepotPromoReceive`,
      master,
      this.httpOptions
    );
  }
  public SaveDepotPromoDistribution(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Promo/SaveDepotPromoDistribution`,
      master,
      this.httpOptions
    );
  }
  public SavePromoPacketing(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Promo/SavePromoPacketing`,
      master,
      this.httpOptions
    );
  }
  public SaveBulkPromoPacketing(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Promo/SaveBulkPromoPacketing`,
      master,
      this.httpOptions
    );
  }
  public GetPromoReceivedById(prodTrnfrId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Promo/GetPromoReceivedById?prodTrnfrId=${prodTrnfrId}`,
      this.httpOptions
    );
  }
  public GetPromoDistributionById(prodTrnfrId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Promo/GetPromoDistributionById?prodTrnfrId=${prodTrnfrId}`,
      this.httpOptions
    );
  }
  public GetProductSubCategoryByCategoryId(productCatId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Promo/GetProductSubCategoryByCategoryId?productCatId=${productCatId}`,
      this.httpOptions
    );
  }
  public GetPromoPacketById(packetingMasterId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Promo/GetPromoPacketById?GetPromoPacketById=${packetingMasterId}`,
      this.httpOptions
    );
  }
  public GetPromoReceiveDetailsByMasterId(prodTrnfrId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Promo/GetPromoReceiveDetailsByMasterId?prodTrnfrId=${prodTrnfrId}`,
      this.httpOptions
    );
  }
  public GetDepotPromoDistributionDetailsByMasterId(prodTrnfrId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Promo/GetDepotPromoDistributionDetailsByMasterId?prodTrnfrId=${prodTrnfrId}`,
      this.httpOptions
    );
  }
  public GetPromoPacketDetailsByMasterId(packetingMasterId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Promo/GetPromoPacketDetailsByMasterId?packetingMasterId=${packetingMasterId}`,
      this.httpOptions
    );
  }
  public GetPromoPacketNoDetailsByMasterId(packetingMasterId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Promo/GetPromoPacketNoDetailsByMasterId?packetingMasterId=${packetingMasterId}`,
      this.httpOptions
    );
  }
  public DeletePromoReceiveById(promoTrnfrId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Promo/DeletePromoReceiveById?`, promoTrnfrId,
      this.httpOptions
    );
  }
  public DeleteDepotPromoDistributionById(promoTrnfrId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Promo/DeleteDepotPromoDistributionById?`, promoTrnfrId,
      this.httpOptions
    );
  }
  public DeletePromoPacketById(promoTrnfrId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Promo/DeletePromoPacketById?`, promoTrnfrId,
      this.httpOptions
    );
  }
}
