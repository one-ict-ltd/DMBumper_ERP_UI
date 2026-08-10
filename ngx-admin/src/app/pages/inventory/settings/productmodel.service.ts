import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})
export class ProductmodelService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public getProductModel(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductModel`,
      this.httpOptions
    );
  }
  public getProductModelById(modelId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductModel?modelId)=${modelId}`,
      this.httpOptions
    );
  }
  public saveProductModel(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductCategory/setProductModel`,
      master,
      this.httpOptions
    );
  }
  public deleteProductModel(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductCategory/deleteProductModel`,
      master,
      this.httpOptions
    );
  }
}
