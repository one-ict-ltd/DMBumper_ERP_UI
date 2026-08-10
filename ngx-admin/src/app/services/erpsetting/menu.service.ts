import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) {}

  public getMenus(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getMenus?id=0&moduleId=0&isparent=0`,
      this.httpOptions
    );
  }
  public getMenusById(id: any) {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getMenus?id=${id}&moduleId=0&isparent=0`,
      this.httpOptions
    );
  }
  public saveMenus(master: any): Observable<string> {
    console.log(master);
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}Menu/setMenus`,
      master,
      this.httpOptions
    );
  }
  public deleteMenus(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/deleteMenus`,
      master,
      this.httpOptions
    );
  }
}
