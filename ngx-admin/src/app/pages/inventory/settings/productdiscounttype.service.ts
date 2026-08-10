import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductdiscounttypeService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getProductDiscountType(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductDiscountType?DiscountTypeId)=${0}`,
      this.httpOptions
    );
  }
  public getProductDiscountTypeById(DiscountTypeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductDiscountType?DiscountTypeId)=${DiscountTypeId}`,
      this.httpOptions
    );
  }
  public saveProductDiscountType(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductCategory/setProductDiscountType`,
      master,
      this.httpOptions
    );
  }
  public deleteProductDiscountType(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductCategory/deleteProductDiscountType`,
      master,
      this.httpOptions
    );
  }
}
