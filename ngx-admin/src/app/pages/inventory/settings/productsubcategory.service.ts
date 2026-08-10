import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductsubcategoryService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getProductSubCategory(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductSubCategory`,
      this.httpOptions
    );
  }
  public getProductSubCategoryById(productSubCategoryId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductSubCategory?productSubCategoryId=${productSubCategoryId}`,
      this.httpOptions
    );
  }
  public saveProductSubCategory(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductCategory/setProductSubCategory`,
      master,
      this.httpOptions
    );
  }
  public deleteProductSubCategory(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductCategory/deleteProductSubCategory`,
      master,
      this.httpOptions
    );
  }
}
