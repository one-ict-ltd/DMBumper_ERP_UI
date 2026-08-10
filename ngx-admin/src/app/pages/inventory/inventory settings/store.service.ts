import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getStore(companyId,sbuId,storeId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Sbu/getStore?companyId=${companyId}&sbuId=${sbuId}&storeId=${storeId}`,
      this.httpOptions
    );
  }
  public saveStore(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Sbu/setStore`,
      master,
      this.httpOptions
    );
  }
  public deleteStore(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Sbu/deleteStore`,
      master,
      this.httpOptions
    );
  }
}
