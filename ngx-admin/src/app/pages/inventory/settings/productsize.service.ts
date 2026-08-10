import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductsizeService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getProductSize(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductSize`,
      this.httpOptions
    );
  }
  public getProductSizeById(sizeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductSize?sizeId=${sizeId}`,
      this.httpOptions
    );
  }
  public saveProductSize(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductCategory/setProductSize`,
      master,
      this.httpOptions
    );
  }
  public deleteProductSize(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductCategory/deleteProductSize`,
      master,
      this.httpOptions
    );
  }
}
