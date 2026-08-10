import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getModule(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getModule?moduleId=0`,
      this.httpOptions
    );
  }
  public getModuleById(moduleId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getModule?moduleId=${moduleId}`,
      this.httpOptions
    );
  }
  public saveModule(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/setModule`,
      master,
      this.httpOptions
    );
  }
  public deleteModule(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/deleteModule`,
      master,
      this.httpOptions
    );
  }
}
