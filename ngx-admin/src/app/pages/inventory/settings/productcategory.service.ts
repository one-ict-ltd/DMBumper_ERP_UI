import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductcategoryService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getProductCategory(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductCategory`,
      this.httpOptions
    );
  }
  public getProductCategoryById(productCategoryId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductCategory?productCategoryId=${productCategoryId}`,
      this.httpOptions
    );
  }
  public getProductCategorySpecByCategoryId(productCategoryId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductCategorySpecByCategoryId?productCategoryId=${productCategoryId}`,
      this.httpOptions
    );
  }
  public saveProductCategory(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductCategory/setProductCategory`,
      master,
      this.httpOptions
    );
  }
  public deleteProductCategory(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductCategory/deleteProductCategory`,
      master,
      this.httpOptions
    );
  }



}
