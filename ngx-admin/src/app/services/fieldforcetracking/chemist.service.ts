// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class ChemistService {

//   constructor() { }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";
import { NbDialogService, NbToastrService } from "@nebular/theme";
@Injectable({
  providedIn: 'root'
})
export class ChemistService {
  apiUrl: string = this.commonService.baseUrl;
  apifieldForceGlobalUrl: string = this.commonService.fieldForceGlobalUrl;
  //apifieldForceERPCompanyUrl:string =this.commonService.fieldForceERPCompanyUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;
  constructor(private http: HttpClient, private commonService: CommonService,
    private toastrService: NbToastrService) { }

    //#region Chemist------------------
    public getChemist(ChemistId: any) {
      debugger;
      return this.http.get<any>(
        `${this.apiUrl}Chemists/getChemist?Id=${ChemistId}`,
        this.httpOptions
      );
    }

    public saveChemist(master: any): Observable<string> {
      debugger;
      return this.http.post<string>(
        `${this.apiUrl}Schedule/setChemist`,
        master,
        this.httpOptions
      );
    }
    
    public deleteChemist(master: any): Observable<string> {
      return this.http.post<string>(
        `${this.apiUrl}Schedule/deleteChemist`,
        master,
        this.httpOptions
      );
    }

    
  //#endregion

}

