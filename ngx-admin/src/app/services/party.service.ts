
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class PartyService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getParty(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Party/getparty?partyId=0`,
      this.httpOptions
    );
  }
  public getSupplier(supplierId: any = 0): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Party/getSupplier?supplierId=${supplierId}`,
      this.httpOptions
    );
  }
public getSupplierForConvertToLedger(supplierId: any = 0, isConverted: any = 0): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Party/getSupplierForConvertToLedger?supplierId=${supplierId}&isConverted=${isConverted}`,
      this.httpOptions
    );
  }

  public GetPartyByIdJsonNewForGrid(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Party/GetPartyByIdJsonNewForGrid?partyId=0`,
      this.httpOptions
    );
  }
  public GetPartyByIdJsonNewNewForGrid(territoryCode:any=""): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Party/GetPartyByIdJsonNewNewForGrid?partyId=0&territoryCode=${territoryCode}`,
      this.httpOptions
    );
  }

  public AccSpGetPartyObserbationGridJson(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Party/AccSpGetPartyObserbationGridJson?partyId=0`,
      this.httpOptions
    );
  }

  public getpartyAccount(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Party/getpartyAccount?partyId=0`,
      this.httpOptions
    );
  }

  public getPartyById(partyId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Party/getparty?partyId=${partyId}`,
      this.httpOptions
    );
  }

  public getpartyObserbation(partyId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Party/getpartyObserbation?partyId=${partyId}`,
      this.httpOptions
    );
  }

  public saveParty(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Party/setparty`,
      master,
      this.httpOptions
    );
  }
  public saveLedgersConvertedFromBenificiary(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Party/saveLedgersConvertedFromBenificiary`,
      master,
      this.httpOptions
    );
  }

  public setpartyObservation(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Party/setpartyObservation`,
      master,
      this.httpOptions
    );
  }

  public deleteParty(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Party/deleteparty`,
      master,
      this.httpOptions
    );
  }
  public getDuplicateParty(partyId, partyName) {
    return this.http.get<any>(
      `${this.apiUrl}Party/getDuplicateParty?partyId=${partyId}&partyName=${partyName}`,
      this.httpOptions
    );
  }

  public getDuplicatePartyCode(partyId, partyCode) {
    return this.http.get<any>(
      `${this.apiUrl}Party/getDuplicatePartyCode?partyId=${partyId}&partyCode=${partyCode}`,
      this.httpOptions
    );
  }

  public getNewPartyCode() {
    return this.http.get<any>(
      `${this.apiUrl}Party/getNewPartyCode`,
      this.httpOptions
    );
  }
  public GetPartyContactByPartyId(partyId) {
    return this.http.get<any>(
      `${this.apiUrl}Party/GetPartyContactByPartyId?partyId=${partyId}`,
      this.httpOptions
    );
  }

  public GetPartyAddressByPartyId(partyId) {
    return this.http.get<any>(
      `${this.apiUrl}Party/GetPartyAddressByPartyId?partyId=${partyId}`,
      this.httpOptions
    );
  }

  public GetPartyBankByPartyId(partyId) {
    return this.http.get<any>(
      `${this.apiUrl}Party/GetPartyBankByPartyId?partyId=${partyId}`,
      this.httpOptions
    );
  }

  public SaveSalesHoldForCustomer(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Party/SaveSalesHoldForCustomer`,
      master,
      this.httpOptions
    );
  }
}




