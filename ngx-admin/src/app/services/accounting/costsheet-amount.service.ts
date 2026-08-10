import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CostsheetAmountService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public GetFormulaType() {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/GetFormulaType`,
      this.httpOptions
    );
  }

  public GetCostSheetHeadByParentId(parentHeadId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/GetCostSheetHeadById?costSheetHeadId=0&parentHeadId=${parentHeadId}`,
      this.httpOptions
    );
  }

  public GetCostSheetHeadById(costSheetHeadId, parentHeadId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/GetCostSheetHeadById?costSheetHeadId=${costSheetHeadId}&parentHeadId=${parentHeadId}`,
      this.httpOptions
    );
  }

  public GetCostSheetHeadAmountById(costSheetHeadAmountId, costSheetHeadId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/GetCostSheetHeadAmountById?costSheetHeadAmountId=${costSheetHeadAmountId}&costSheetHeadId=${costSheetHeadId}`,
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

  public GetDuplicateCostSheetHeadAmount(costSheetHeadAmountId, costSheetHeadId, ledgerId) {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/GetDuplicateCostSheetHeadAmount?costSheetHeadAmountId=${costSheetHeadAmountId}&costSheetHeadId=${costSheetHeadId}&ledgerId=${ledgerId}`,
      this.httpOptions
    );
  }
}
