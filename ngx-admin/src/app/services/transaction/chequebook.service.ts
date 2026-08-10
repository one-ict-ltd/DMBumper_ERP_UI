import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChequebookService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getChequeBookMaster(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ChequeBook/getChequeBookMaster?companyId=0&sbuId=0&chequeBookMasterId=0`,
      this.httpOptions
    );
  }
  public getChequeBookMasterById(chequeBookMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ChequeBook/getChequeBookMaster?companyId=0&sbuId=0&chequeBookMasterId=${chequeBookMasterId}`,
      this.httpOptions
    );
  }

  public saveChequeBookMaster(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ChequeBook/setChequeBookMaster`,
      master,
      this.httpOptions
    );
  }

  public deleteChequeBookMaster(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ChequeBook/deleteChequeBookMaster`,
      master,
      this.httpOptions
    );
  }

  public getVoucherForCreateCheque(companyId: any, sbuId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ChequeBook/getVoucherForCreateCheque?companyId=${companyId}&sbuId=${sbuId}`,
      this.httpOptions
    );
  }

  public getChequeBookDetailsByMasterId(chequeBookMasterId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ChequeBook/getChequeBookDetailsByMasterId?chequeBookMasterId=${chequeBookMasterId}`,
      this.httpOptions
    );
  }

}
