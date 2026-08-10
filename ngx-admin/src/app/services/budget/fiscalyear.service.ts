import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FiscalyearService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getFiscalYear(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Budget/getFiscalYear?companyId=0&sbuId=0&fiscalYearId=0`,
      this.httpOptions
    );
  }

  public getFiscalYearById(fiscalYearId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Budget/getFiscalYear?companyId=0&sbuId=0&fiscalYearId=${fiscalYearId}`,
      this.httpOptions
    );
  }

  public saveFiscalYear(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Budget/setFiscalYear`,
      master,
      this.httpOptions
    );
  }

  public deleteFiscalYear(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Budget/deleteFiscalYear`,
      master,
      this.httpOptions
    );
  }

  public getDuplicateFiscalYear(fiscalYearId, yearName) {
    return this.http.get<any>(
      `${this.apiUrl}Budget/getDuplicateFiscalYear?fiscalYearId=${fiscalYearId}&yearName=${yearName}`,
      this.httpOptions
    );
  }

}
