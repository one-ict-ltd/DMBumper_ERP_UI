import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class DamageGoodsService {
  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;
  constructor(private http: HttpClient, private commonService: CommonService) { }


  public GetMaxDamageGoodsNumber(recvDate): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}DamageGoods/GetMaxDamageGoodsNumber?recvDate=${recvDate}`,
      this.httpOptions
    );
  }
  public GetDamageGoodsById(damageGoodsId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}DamageGoods/GetDamageGoodsById?damageGoodsId=${damageGoodsId}`,
      this.httpOptions
    );
  }

  public SaveDamageGoods(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}DamageGoods/SaveDamageGoods`, master,
      this.httpOptions
    );
  }

  public GetDamageGoodsDetailsById(damageGoodsId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}DamageGoods/GetDamageGoodsDetailsById?damageGoodsId=${damageGoodsId}`,
      this.httpOptions
    );
  }
  public getProductSerialNoByProductSpec(productWiseSpecificationId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}SalesInvoice/getProductSerialNoByProductSpec?productWiseSpecificationId=${productWiseSpecificationId}`,
      this.httpOptions
    );
  }
  public DeleteDamageGoodsById(damageGoodsId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}DamageGoods/DeleteDamageGoodsById`, damageGoodsId,
      this.httpOptions
    );
  }

  public GetDamageGoodsReportById(damageGoodsId: any) {
    return this.http.get<any>(
      `${this.apiUrl}DamageGoods/GetDamageGoodsReportById?damageGoodsId=${damageGoodsId}`,
      this.httpOptions
    );
  }

}
