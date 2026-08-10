import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MenuService {
  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getMenu(): Observable<any> {
    //debugger;
    // return this.http.get<any>(`${this.apiUrl}Help/getHelp`, this.httpOptions);
    //console.log(this.httpOptions);
    return this.http.get<any>(`${this.apiUrl}Menu/getUsersMenu`, this.commonService.getHttpOptions());
  }
  // public getClientByID(helpid: any) {
  //   return this.http.get<any>(
  //     `${this.apiUrl}Help/getHelpMaster?helpMasterId=${helpid}&helpDetailId=0&helpMultiId=0&helpImageId=0`,
  //     this.httpOptions
  //   );
  // }
  // public saveClients(master: any): Observable<string> {
  //   return this.http.post<string>(
  //     `${this.apiUrl}Help/setHelp`,
  //     master,
  //     this.httpOptions
  //   );
  // }
  // public updateClients(client: any): Observable<string> {
  //   return this.http.put<string>(
  //     `${this.apiUrl}updateClients`,
  //     client,
  //     this.httpOptions
  //   );
  // }
  // public deleteClients(master: any): Observable<string> {
  //   return this.http.post<string>(
  //     `${this.apiUrl}Help/deletehelpMaster`,
  //     master,
  //     this.httpOptions
  //   );
  // }
  public postTest(): Observable<string> {
    var body = {
      AdultQuantity: 1,
      ChildQuantity: 0,
      InfantQuantity: 0,
      EndUserIp: "103.129.35.134",
      JourneyType: "Oneway",
      Segments: [
        {
          Origin: "DAC",
          Destination: "DOH",
          CabinClass: "Economy",
          DepartureDateTime: "2021-02-17T13:06:34.251Z",
        },
      ],
    };
    return this.http.post<string>(
      ``,
      body,
      this.getHttpOptions()
    );
  }

  public getHttpOptions() {
    return {
      headers: new HttpHeaders({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
        "Content-Type": "application/json",
        Authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6Imdtc2FuemlkQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvdXNlcmRhdGEiOiIzODV8NDAyfCIsIm5iZiI6MTYxMzU2NTAwMywiZXhwIjoxNjE0MTY5ODAzLCJpYXQiOjE2MTM1NjUwMDMsImlzcyI6Imh0dHA6Ly8xOC4xNDEuMTM3LjE3Mzo1MDA1IiwiYXVkIjoiYXBpLnNhbmRib3guZmx5aHViLmNvbSJ9.lj0q9XDXy8dxF_dX9HRqy4QVfuJPhTnTwujMk6nDeBo",
        //auth_token: localStorage.getItem("auth_token"),
      }),
    };
  }
}
