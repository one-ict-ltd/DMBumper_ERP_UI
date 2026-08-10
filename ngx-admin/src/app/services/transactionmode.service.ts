
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class TransactionmodeService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) {}

  public getTransactionMode(): Observable<any> { 
    return this.http.get<any>(
      `${this.apiUrl}TransactionMode/getTransactionMode?transactionModeId=0`,
      this.httpOptions
    );
  }
  public getTransactionModeById(transactionModeId: any) { 
    return this.http.get<any>(
      `${this.apiUrl}TransactionMode/getTransactionMode?transactionModeId=${transactionModeId}`,
      this.httpOptions
    );
  }
  public saveTransactionMode(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}TransactionMode/setTransactionMode`,
      master,
      this.httpOptions
    );
  }
  public deleteTransactionMode(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}TransactionMode/deleteTransactionMode`,
      master,
      this.httpOptions
    );   
  } 
  
}

