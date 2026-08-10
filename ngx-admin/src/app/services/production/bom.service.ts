import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class BomService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public SaveBomMaster(master: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}Bom/SaveBomMaster`, master, this.httpOptions
    );
  }
  public DeleteBomMasterById(pendingbomId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Bom/DeleteBomMasterById`, pendingbomId,
      this.httpOptions
    );
  }
  public DeleteBomDetailsById(bomDetailsId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Bom/DeleteBomDetailsById`, bomDetailsId,
      this.httpOptions
    );
  }
  public GetBomMasterById(pendingbomId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Bom/GetBomMasterById?pendingbomId=${pendingbomId}`,
      this.httpOptions
    );
  }
  public GetApprovedBomMasterById(bomId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Bom/GetApprovedBomMasterById?bomId=${bomId}`,
      this.httpOptions
    );
  }
  public GetPendingBomMasterById(pendingbomId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Bom/GetPendingBomMasterById?pendingbomId=${pendingbomId}`,
      this.httpOptions
    );
  }
  public GetBomDetailsByMasterId(pendingbomId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Bom/GetBomDetailsByMasterId?pendingbomId=${pendingbomId}`,
      this.httpOptions
    );
  }
  public GetBomReportDataById(pendingbomId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Bom/GetBomReportDataById?pendingbomId=${pendingbomId}`,
      this.httpOptions
    );
  }
  public GetMaxBomMasterNumber(bomDate: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Bom/GetMaxBomMasterNumber?bomDate=${bomDate}`,
      this.httpOptions
    );
  }
  public GetBomMasterProductSpec(productId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Bom/GetBomProductWiseSpecification?productId=${productId}`,
      this.httpOptions
    );
  }

  public GetProductWiseSpecificationWsieBOM(productId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Bom/GetProductWiseSpecificationWsieBOM?productId=${productId}`,
      this.httpOptions
    );
  }
  public SaveBomForApproval(master: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}Bom/SaveBomForApproval`, master, this.httpOptions
    );
  }
  public getAllbomForList(bomForId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Bom/GetAllbomForList?bomForId=${bomForId}`,
      this.httpOptions
    );
  }

  public getBomTypeIdByName(bomType: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Bom/getBomTypeIdByName?bomType=${bomType}`,
      this.httpOptions
    );
  }
  public GetBOMForListFromBOM(planId: any, materialType: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Bom/GetBOMForListFromBOM?planId=${planId}&materialType=${materialType}`,
      this.httpOptions
    );
  }
  public getRevisionNoFromBOM(productWiseSpecificationId: any, materialsType: any) {
    return this.http.get<any>(
      `${this.apiUrl}Bom/GetRevisionNoFromBOM?productWiseSpecificationId=${productWiseSpecificationId}&materialsType=${materialsType}`,
      this.httpOptions
    );
  }
  public GetBomMasterIsApproveOrNot(pendingbomId: any, materialsType: any) {
    return this.http.get<any>(
      `${this.apiUrl}Bom/GetBomMasterIsApproveOrNot?pendingbomId=${pendingbomId}&materialsType=${materialsType}`,
      this.httpOptions
    );
  }
  public GetBomMasterIsExistOrNot(bomProductWiseSpecificationId: any, materialsType: any) {
    return this.http.get<any>(
      `${this.apiUrl}Bom/GetBomMasterIsExistOrNot?bomProductWiseSpecificationId=${bomProductWiseSpecificationId}&materialsType=${materialsType}`,
      this.httpOptions
    );
  }
  public getLastGroupName(productWiseSpecificationId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Bom/GetLastGroupNameForBom?productWiseSpecificationId=${productWiseSpecificationId}`,
      this.httpOptions
    );
  }
  public GetBomMasterByIdForApprovedBom(bomId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Bom/GetBomMasterByIdForApprovedBom?bomId=${bomId}`,
      this.httpOptions
    );
  }
  public GetBomDetailsByMasterIdForApprovedBom(bomId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Bom/GetBomDetailsByMasterIdForApprovedBom?bomId=${bomId}`,
      this.httpOptions
    );
  }
  public DeleteBomDetailsByIdForApprovedBom(bomDetailsId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Bom/DeleteBomDetailsByIdForApprovedBom`, bomDetailsId,
      this.httpOptions
    );
  }
  public SaveBomMasterFromApproval(master: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}Bom/SaveBomMasterFromApproval`, master, this.httpOptions
    );
  }

  public GetAllActiveInActiveBomListJson(productWiseSpecificationId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Bom/GetAllActiveInActiveBomListJson?productWiseSpecificationId=${productWiseSpecificationId}`,
      this.httpOptions
    );
  }
  public SaveActiveInActiveBom(master: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}Bom/SaveActiveInActiveBom`, master, this.httpOptions
    );
  }
}
