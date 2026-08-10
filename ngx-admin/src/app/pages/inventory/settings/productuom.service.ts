import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ProductuomService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getProductUOM(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductUOM`,
      this.httpOptions
    );
  }
  public getProductUOMById(uomId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductUOM?uomId=${uomId}`,
      this.httpOptions
    );
  }
  public saveProductUOM(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductCategory/setProductUOM`,
      master,
      this.httpOptions
    );
  }
  public deleteProductUOM(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductCategory/deleteProductUOM`,
      master,
      this.httpOptions
    );
  }
}
