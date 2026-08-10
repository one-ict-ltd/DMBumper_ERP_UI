import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class LedgerService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getLedger(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Ledgers/getledger?ledgerId=0&accountGroupId=0&groupNatureId=0&companyId=0&sbuId=0&ledgerTypeId=0`,
      this.httpOptions
    );
  }
  public getLedgerById(ledgerId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Ledgers/getledger?ledgerId=${ledgerId}&accountGroupId=0&groupNatureId=0&companyId=0&sbuId=0&ledgerTypeId=0`,
      this.httpOptions
    );
  }
  public saveLedgers(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Ledgers/setledgers`,
      master,
      this.httpOptions
    );
  }
  public deleteLedgers(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Ledgers/deleteledger`,
      master,
      this.httpOptions
    );
  }
  public getDuplicateLedger(ledgerId, accountName) {
    return this.http.get<any>(
      `${this.apiUrl}Ledgers/getDuplicateLedger?ledgerId=${ledgerId}&accountName=${accountName}`,
      this.httpOptions
    );
  }

  public GetAutoLedgerCode(accountGroupId) {
    return this.http.get<any>(
      `${this.apiUrl}Ledgers/GetAutoLedgerCode?accountGroupId=${accountGroupId}`,
      this.httpOptions
    );
  }
}
