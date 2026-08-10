import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from 'app/@core/mock/common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MiscellaneousItemService {
  apiUrl: string = this.commonService.baseUrl;
  reportApiUrl: string = this.commonService.baseReportUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;
  userProfile: any = this.commonService.GetUserProfile();
  constructor(private http: HttpClient, private commonService: CommonService) { }

  GetCompanyAliasName() {
    let data: {} = JSON.parse(this.userProfile);
    return data[0].uc[0].aliasName;
  }

  //#region Factory

  SaveMiscellaneousItem(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesDistribution/SaveMiscellaneousItem`,
      master,
      this.commonService.getHttpOptions()
    );
  }
  DeleteMiscellaneousItem(miscellaneousItemId: number): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesDistribution/DeleteMiscellaneousItem`,
      miscellaneousItemId,
      this.commonService.getHttpOptions()
    );
  }
  DeleteMiscellaneousItemDetails(miscellaneousItemDetailsId: number): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesDistribution/DeleteMiscellaneousItemDetails`,
      miscellaneousItemDetailsId,
      this.commonService.getHttpOptions()
    );
  }

  GetMiscellaneousItemById(miscellaneousItemId: number = 0): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesDistribution/GetMiscellaneousItemById?miscellaneousItemId=${miscellaneousItemId}`,
      this.commonService.getHttpOptions()
    );
  }

  GetMiscellaneousItemDetailsByMasterId(miscellaneousItemId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesDistribution/GetMiscellaneousItemDetailsByMasterId?miscellaneousItemId=${miscellaneousItemId}`,
      this.commonService.getHttpOptions()
    );
  }

  GetMaxMiscellaneousNumber(dateTime: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesDistribution/GetMaxMiscellaneousNumber?dateTime=${dateTime}`,
      this.commonService.getHttpOptions()
    );
  }
  //#endregion Factory

  //#region Depot

  SaveMiscellaneousItemDepot(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesDistribution/SaveMiscellaneousItemDepot`,
      master,
      this.commonService.getHttpOptions()
    );
  }
  DeleteMiscellaneousItemDepot(master: number): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesDistribution/DeleteMiscellaneousItemDepot`,
      master,
      this.commonService.getHttpOptions()
    );
  }

  DeleteMiscellaneousItemDetailsDepot(master: number): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesDistribution/DeleteMiscellaneousItemDetailsDepot`,
      master,
      this.commonService.getHttpOptions()
    );
  }
  DeleteMiscellaneousItemFileDepot(miscellaneousItemFileId: number): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesDistribution/DeleteMiscellaneousItemFileDepot`, //not implemented
      miscellaneousItemFileId,
      this.commonService.getHttpOptions()
    );
  }

  GetMiscellaneousItemDepotById(miscellaneousItemId: number = 0): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesDistribution/GetMiscellaneousItemDepotById?miscellaneousItemId=${miscellaneousItemId}`,
      this.commonService.getHttpOptions()
    );
  }

  GetMiscellaneousItemDetailsDepotByMasterId(miscellaneousItemId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesDistribution/GetMiscellaneousItemDetailsDepotByMasterId?miscellaneousItemId=${miscellaneousItemId}`,
      this.commonService.getHttpOptions()
    );
  }

  GetMaxMiscellaneousNumberDepot(dateTime: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesDistribution/GetMaxMiscellaneousNumberDepot?dateTime=${dateTime}`,
      this.commonService.getHttpOptions()
    );
  }

  GetAllMiscellaneousType(param: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesDistribution/GetAllMiscellaneousType?param=${param}`,
      this.commonService.getHttpOptions()
    );
  }
  //#endregion Depot
  // #region  miscellaneous item for depot(Approval)
GetALLMiscellaneousItemDepotByApproval(isApproved: number = 0): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesDistribution/GetALLMiscellaneousItemDepotByApproval?isApproved=${isApproved}`,
      this.commonService.getHttpOptions()
    );
  }
  SaveMiscellaneousItemForDepotApproval(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesDistribution/SaveMiscellaneousItemForDepotApproval`,
      master,
      this.commonService.getHttpOptions()
    );
  }
  // #endregion miscellaneous item for depot(Approval)

}
