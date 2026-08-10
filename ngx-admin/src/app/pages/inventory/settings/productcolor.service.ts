import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductcolorService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getProductColor(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductColor`,
      this.httpOptions
    );
  }
  public getProductColorById(colorId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductColor?colorId=${colorId}`,
      this.httpOptions
    );
  }
  public saveProductColor(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductCategory/setProductColor`,
      master,
      this.httpOptions
    );
  }
  public deleteProductColor(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductCategory/deleteProductColor`,
      master,
      this.httpOptions
    );
  }
}
