import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})

export class CostcentreService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getCostCentre(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/getcostCentre?costCentreId=0`,
      this.httpOptions
    );
  }
  public getCostCentreById(costCentreId: any) {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/getcostCentre?costCentreId=${costCentreId}`,
      this.httpOptions
    );
  }
  public saveCostCentre(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}CostCentre/setcostCentre`,
      master,
      this.httpOptions
    );
  }
  public deleteCostCentre(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}CostCentre/deletecostCentre`,
      master,
      this.httpOptions
    );
  }

  public getDuplicateCostCentre(costCentreId, costCentreName) {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/getDuplicateCostCentre?costCentreId=${costCentreId}&costCentreName=${costCentreName}`,
      this.httpOptions
    );
  }


  //Cost center Category 

  public getCostCentreCategory(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/getcostCentreCategory?costCentreCategoryId=0`,
      this.httpOptions
    );
  }
  public getCostCentreCategoryById(costCentreCategoryId: any) {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/getcostCentreCategory?costCentreCategoryId=${costCentreCategoryId}`,
      this.httpOptions
    );
  }
  public saveCostCentreCategory(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}CostCentre/setCostCentreCategory`,
      master,
      this.httpOptions
    );
  }
  public deleteCostCentreCategory(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}CostCentre/deletecostCentreCategory`,
      master,
      this.httpOptions
    );
  }

  public getDuplicateCostCentreCategory(costCentreCategoryId, costCentreCategoryName) {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/getDuplicateCostCentreCategory?costCostCentreCategoryId=${costCentreCategoryId}&costCentreCategoryName=${costCentreCategoryName}`,
      this.httpOptions
    );
  }

  //Cost center Location 

  public getCostCentreLocation(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/getcostCentreLocation?costCentreLocationId=0`,
      this.httpOptions
    );
  }
  public getCostCentreLocationById(costCentreLocationId: any) {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/getcostCentreLocation?costCentreLocationId=${costCentreLocationId}`,
      this.httpOptions
    );
  }
  public saveCostCentreLocation(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}CostCentre/setCostCentreLocation`,
      master,
      this.httpOptions
    );
  }
  public deleteCostCentreLocation(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}CostCentre/deletecostCentreLocation`,
      master,
      this.httpOptions
    );
  }

  public getDuplicateCostCentreLocation(costCostCentreLocationId, costCentreLocationName) {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/getDuplicateCostCentreLocation?costCostCentreLocationId=${costCostCentreLocationId}&costCentreLocationName=${costCentreLocationName}`,
      this.httpOptions
    );
  }

  public getCostCentrebyCategoryIdandLocationId(costCostCentreLocationId, costCentreCategoryId) {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/getCostCentrebyCategoryIdandLocationId?costCostCentreLocationId=${costCostCentreLocationId}&costCentreCategoryId=${costCentreCategoryId}`,
      this.httpOptions
    );
  }

}



