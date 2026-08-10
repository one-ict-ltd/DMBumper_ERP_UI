import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class FundsourceService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) {}

  public getFundSource(): Observable<any> { 
    return this.http.get<any>(
      `${this.apiUrl}FundSource/getfundSource?fundSourceId=0&companyId=0&sbuId=0`,
      this.httpOptions
    );
  }
  public getFundSourceById(fundSourceId: any) { 
    return this.http.get<any>(
      `${this.apiUrl}FundSource/getfundSource?fundSourceId=${fundSourceId}&companyId=0&sbuId=0`,
      this.httpOptions
    );
  }
  public saveFundSource(master: any): Observable<string> { 
    return this.http.post<string>(
      `${this.apiUrl}FundSource/setfundSource`,
      master,
      this.httpOptions
    );
  }
  public deleteFundSource(master: any): Observable<string> { 
    return this.http.post<string>(
      `${this.apiUrl}FundSource/deletefundSource`,
      master,
      this.httpOptions
    );   
  } 

  public getDuplicateFundSource(fundSourceId,fundSourceName) {
    return this.http.get<any>(
      `${this.apiUrl}FundSource/getDuplicateFundSource?fundSourceId=${fundSourceId}&fundSourceName=${fundSourceName}`,
      this.httpOptions
    );
  }
}



