import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonService } from "../@core/mock/common.service";

@Injectable({
  providedIn: "root",
})

export class ClientService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  
  constructor(private http: HttpClient, private commonService: CommonService) {}

  public getClients(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Help/getHelpMaster?helpMasterId=0&helpDetailId=0&helpMultiId=0&helpImageId=0`,
      this.httpOptions
    );
  }
  public getClientByID(helpid: any) {
    return this.http.get<any>(
      `${this.apiUrl}Help/getHelpMaster?helpMasterId=${helpid}&helpDetailId=0&helpMultiId=0&helpImageId=0`,
      this.httpOptions
    );
  }
  public saveClients(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Help/setHelp`,
      master,
      this.httpOptions
    );
  }
  public updateClients(client: any): Observable<string> {
    return this.http.put<string>(
      `${this.apiUrl}updateClients`,
      client,
      this.httpOptions
    );
  }
  public deleteClients(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Help/deletehelpMaster`,
      master,
      this.httpOptions
    );
  }
}
