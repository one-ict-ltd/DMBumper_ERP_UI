import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProducttypeService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getProductType(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductType`,
      this.httpOptions
    );
  }
  public getProductTypeById(productTypeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductType?productTypeId=${productTypeId}`,
      this.httpOptions
    );
  }
  public saveProductType(master: any): Observable<string> {
    //debugger;
    return this.http.post<string>(
      `${this.apiUrl}ProductCategory/setProductType`,
      master,
      this.httpOptions
    );
  }
  public deleteProductType(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductCategory/deleteProductType`,
      master,
      this.httpOptions
    );
  }
}
