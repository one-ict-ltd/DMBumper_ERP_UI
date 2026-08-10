import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotemasterblsheetService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getNoteMaster(noteType: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}NoteMaster/getNoteMaster?companyId=0&sbuId=0&noteMasterId=0&noteType=${noteType}`,
      this.httpOptions
    );
  }
  public getNoteMasterById(noteMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}NoteMaster/getNoteMaster?companyId=0&sbuId=0&noteMasterId=${noteMasterId}&noteType=All`,
      this.httpOptions
    );
  }
  public saveNoteMaster(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}NoteMaster/setNoteMaster`,
      master,
      this.httpOptions
    );
  }
  public deleteNoteMaster(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}NoteMaster/deleteNoteMaster`,
      master,
      this.httpOptions
    );
  }
}
