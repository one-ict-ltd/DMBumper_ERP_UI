import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductbrandService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getProductBrand(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductBrand`,
      this.httpOptions
    );
  }
  public getProductBrandById(brandId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductBrand?brandId)=${brandId}`,
      this.httpOptions
    );
  }
  public saveProductBrand(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductCategory/setProductBrand`,
      master,
      this.httpOptions
    );
  }
  public deleteProductBrand(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductCategory/deleteProductBrand`,
      master,
      this.httpOptions
    );
  }
}
