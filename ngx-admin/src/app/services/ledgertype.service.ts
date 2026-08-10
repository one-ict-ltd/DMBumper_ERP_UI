import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class LedgertypeService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) {}

  public getLedgerType(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}LedgerType/getledgerType?ledgerTypeId=0`,
      this.httpOptions
    );
  }
  public getLedgerTypeById(ledgerTypeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}LedgerType/getledgerType?ledgerTypeId=${ledgerTypeId}`,
      this.httpOptions
    );
  }
  public saveLedgerType(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}LedgerType/setledgerType`,
      master,
      this.httpOptions
    );
  }
  public deleteLedgerType(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}LedgerType/deleteledgerType`,
      master,
      this.httpOptions
    );   
  }
}
