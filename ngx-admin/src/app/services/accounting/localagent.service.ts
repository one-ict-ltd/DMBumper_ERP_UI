import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LocalagentService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getLocalAgent(nid): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Dahmashi/getLocalAgentDetailAll?nid=${nid}`,
      this.httpOptions
    );
  }

  public getDahmashiPartyAll(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Dahmashi/getDahmashiPartyAll`,
      this.httpOptions
    );
  }

  public saveLocalAgent(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Dahmashi/setLocalAgentDetail`,
      master,
      this.httpOptions
    );
  }

  public saveUpdateAllAgent(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Dahmashi/saveUpdateAllAgent`,
      master,
      this.httpOptions
    );
  }

}
