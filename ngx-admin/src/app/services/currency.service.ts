import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})

export class CurrencyService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getCurrency(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Currency/getcurrency?currencyId=0`,
      this.httpOptions
    );
  }
  public getCurrencyById(currencyId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Currency/getcurrency?currencyId=${currencyId}`,
      this.httpOptions
    );
  }
  public saveCurrency(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Currency/setcurrency`,
      master,
      this.httpOptions
    );
  }
  public deleteCurrency(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Currency/deletecurrency`,
      master,
      this.httpOptions
    );
  }
  public getDuplicateCurrency(currencyId, currencyName) {
    return this.http.get<any>(
      `${this.apiUrl}Currency/getDuplicateCurrency?currencyId=${currencyId}&currencyName=${currencyName}`,
      this.httpOptions
    );
  }
  public getAllActiveInActiveCurrency(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Currency/getAllActiveInActiveCurrency?currencyId=0`,
      this.httpOptions
    );
  }
}


