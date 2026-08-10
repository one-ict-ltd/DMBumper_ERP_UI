import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CostsheetheadService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public GetCostSheetParentHead() {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/GetCostSheetParentHead`,
      this.httpOptions
    );
  }

  public GetCostSheetHeadById(costSheetHeadId, parentHeadId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/GetCostSheetHeadById?costSheetHeadId=${costSheetHeadId}&parentHeadId=${parentHeadId}`,
      this.httpOptions
    );
  }

  public SaveCostSheetHead(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}CostCentre/SaveCostSheetHead`,
      master,
      this.httpOptions
    );
  }

  public DeleteCostSheetHeadById(costSheetHeadId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}CostCentre/DeleteCostSheetHeadById`,
      costSheetHeadId,
      this.httpOptions
    );
  }

  public GetDuplicateCostSheetHead(costSheetHeadId, costHeadName) {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/GetDuplicateCostSheetHead?costSheetHeadId=${costSheetHeadId}&costHeadName=${costHeadName}`,
      this.httpOptions
    );
  }
}
