import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReportnameService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getReport(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getReport?moduleId=0&reportId=0`,
      this.httpOptions
    );
  }
  public getReportById(moduleId, reportId) {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getReport?moduleId=${moduleId}&reportId=${reportId}`,
      this.httpOptions
    );
  }
  public saveReport(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/setReport`,
      master,
      this.httpOptions
    );
  }
  public deleteReport(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/deleteReport`,
      master,
      this.httpOptions
    );
  }
}
