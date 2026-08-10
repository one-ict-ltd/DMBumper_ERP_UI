import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class LedgeropeningbalanceService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getOpeningBalance(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}OpeningBalance/getopeningBalance?openingBalanceId=0&ledgerId=0&partyId=0`,
      this.httpOptions
    );
  }
  public getOpeningBalanceById(openingBalanceId: any) {

    return this.http.get<any>(
      `${this.apiUrl}OpeningBalance/getopeningBalance?openingBalanceId=${openingBalanceId}&ledgerId=0&partyId=0`,
      this.httpOptions
    );
  }
  public saveOpeningBalance(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}OpeningBalance/setopeningBalance`,
      master,
      this.httpOptions
    );
  }
  public deleteOpeningBalance(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}OpeningBalance/deleteopeningBalance`,
      master,
      this.httpOptions
    );
  }

  public getDuplicateOpeningBalance(openingBalanceId, ledgerId, partyId) {
    return this.http.get<any>(
      `${this.apiUrl}OpeningBalance/getDuplicateOpeningBalance?openingBalanceId=${openingBalanceId}&ledgerId=${ledgerId}&partyId=${partyId}`,
      this.httpOptions
    );
  }

}
