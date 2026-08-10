import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../@core/mock/common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpOptions = this.commonService.getHttpOptions();
  apiUrl: string = this.commonService.baseUrl

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public login(user: any): Observable<string> {
    //debugger;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    }
    return this.http.post<string>(`${this.apiUrl}Login`, user, httpOptions);
  }
  public logout(): Observable<any> {
    //debugger;
    const data = { Name: localStorage.getItem('user_name') };
    return this.http.post<string>(`${this.apiUrl}Login/LogoutUser`, data, this.httpOptions);
  }
  public UserLogout(data: any): Observable<any> {
    console.log("UserLogout");
    // console.log(data);
    // console.log(this.httpOptions);
    return this.http.post<string>(`${this.apiUrl}Login/LogoutUser`, data, this.httpOptions);
  }
  public updateClients(client: any): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}updateClients`, client, this.httpOptions);
  }
  public deleteClients(clientId: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}deleteClients?id=` + clientId, this.httpOptions);
  }
  public updatePassword(user: any): Observable<string> {
    //console.log(user);
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        tat: localStorage.getItem("tat"),
      }),
    }
    return this.http.post<string>(`${this.apiUrl}Login/UpdatePassword`, user, httpOptions);
  }
}
