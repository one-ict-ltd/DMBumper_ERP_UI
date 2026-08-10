import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RptCoaService {

  private baseUrl: string = this.commonService.baseUrl;
  private httpOptions = this.commonService.getHttpOptions();
  
  constructor(private http: HttpClient, private commonService: CommonService) {}
  public getReportData(apiUrl: string, param: string): Observable<any> {    
    return this.http.get<any>(`${this.baseUrl + apiUrl + param}`, this.httpOptions);
  }  
}
