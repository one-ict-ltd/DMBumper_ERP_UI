import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MenutypeService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) {}

  public getmenutype(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getMenuTypes`,
      this.httpOptions
    );
  }
  public getmenutypeById(menuTypeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getMenuTypes?menuTypeId=${menuTypeId}`,
      this.httpOptions
    );
  }
  public savemenutype(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/setMenuTypes`,
      master,
      this.httpOptions
    );
  }
  public deletemenutype(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/deleteMenuTypes`,
      master,
      this.httpOptions
    );
  }
}
