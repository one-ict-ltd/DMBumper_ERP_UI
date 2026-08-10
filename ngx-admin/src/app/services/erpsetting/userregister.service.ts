import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserregisterService {
  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getUsers(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getUsers`,
      this.httpOptions
    );
  }
  public getUsersById(userId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Menu/getUsers?userId=${userId}`,
      this.httpOptions
    );
  }
  public saveRegister(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/Register`,
      master,
      this.httpOptions
    );
  }
  public ChangePassword(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/ChangePassword`,
      master,
      this.httpOptions
    );
  }
  public deleteUsers(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Menu/deleteUsers`,
      master,
      this.httpOptions
    );
  }

}
