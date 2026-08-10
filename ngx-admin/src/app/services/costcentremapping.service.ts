import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})

export class CostcentremappingService {
  
  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) {}

  public getCostCentreMapping(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/getcostCentreBranchMapping?costCentreMappingId=0&costCentreId=0&companyId=0&sbuId=0`,
      this.httpOptions
    );
  }
  public getCostCentreMappingById(costCentreMappingId: any) {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/getcostCentreBranchMapping?costCentreMappingId=${costCentreMappingId}&costCentreId=0&companyId=0&sbuId=0`,
      this.httpOptions
    );
  }
  public saveCostCentreMapping(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}CostCentre/setcostCentreBranchMapping`,
      master,
      this.httpOptions
    );
  }
  public deleteCostCentreMapping(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}CostCentre/deletecostCentreBranchMapping`,
      master,
      this.httpOptions
    );
  }

  public getDuplicateCostCentreMapping(costCentreMappingId, costCentreId,companyId,sbuId) {
    return this.http.get<any>(
      `${this.apiUrl}CostCentre/getDuplicateCostCentreMapping?costCentreMappingId=${costCentreMappingId}&costCentreId=${costCentreId}&companyId=${companyId}&sbuId=${sbuId}`,
      this.httpOptions
    );
  }

}
