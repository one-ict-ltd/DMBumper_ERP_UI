import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WallettypeService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public SaveWalletType(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryMaster/SaveWalletType`,
      master,
      this.httpOptions
    );
  }

  public GetWalletTypeById(walletTypeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryMaster/GetWalletTypeById?walletTypeId=${walletTypeId}`,
      this.httpOptions
    );
  }

  public GetDuplicateWalletType(walletTypeId, walletTypeName) {
    return this.http.get<any>(
      `${this.apiUrl}SalaryMaster/GetDuplicateWalletType?walletTypeId=${walletTypeId}&walletTypeName=${walletTypeName}`,
      this.httpOptions
    );
  }

  public DeleteWalletTypeById(walletTypeId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalaryMaster/DeleteWalletTypeById`,
      walletTypeId,
      this.httpOptions
    );
  }


}
