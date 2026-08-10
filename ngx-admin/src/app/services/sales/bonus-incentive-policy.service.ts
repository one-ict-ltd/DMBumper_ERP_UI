import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class BonusIncentivePolicyService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public SaveGeneralCustomerBonusPolicy(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/SaveGeneralCustomerBonusPolicy`,
      master,
      this.httpOptions
    );
  }

  public SaveDiscountRatePolicy(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/SaveDiscountRatePolicy`,
      master,
      this.httpOptions
    );
  }
  public SaveFlatRatePolicyList(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/SaveFlatRatePolicyList`,
      master,
      this.httpOptions
    );
  }

  public SaveListOfDiscountItemPolicy(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/SaveListOfDiscountItemPolicy`,
      master,
      this.httpOptions
    );
  }
  // public GetProductsForDiscount(productTypeId: number): Observable<string> {
  //   return this.http.get<any>(
  //     `${this.apiUrl}SalesBonusAndIncentivePolicy/GetProductsForDiscount?productTypeId=1`,
  //     this.httpOptions
  //   );
  // }
  public UpdateStatusOfDiscountItemPolicy(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/UpdateStatusOfDiscountItemPolicies`,
      master,
      this.httpOptions
    );
  }


  public SaveDiscountItemPolicy(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/SaveDiscountItemPolicy`,
      master,
      this.httpOptions
    );
  }
  public SaveDiscountItemPolicyForMultipleItems(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/SaveDiscountItemPolicyForMultipleProduct`,
      master,
      this.httpOptions
    );
  }

  public DeleteGeneralCustomerBonusPolicy(
    generalPolicyId: any
  ): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/DeleteGeneralCustomerBonusPolicy`, generalPolicyId,
      this.httpOptions
    );
  }

  public DeleteDiscountRatePolicy(
    DiscountRateId: any
  ): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/DeleteDiscountRatePolicy`, DiscountRateId,
      this.httpOptions
    );
  }

  public DeleteDiscountItemPolicy(
    DiscountItemId: any
  ): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/DeleteDiscountItemPolicy`, DiscountItemId,
      this.httpOptions
    );
  }

  public GetGeneralCustomerBonusPolicy(generalPolicyId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/GetGeneralCustomerBonusPolicy?generalPolicyId=${generalPolicyId}`,
      this.httpOptions
    );
  }

  public GetSalesDiscountRatePolicy(DiscountRateId: any, depotCode: any, partyId : number =0, discountType: any, fromDate: Date = null, toDate: Date = null): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/GetSalesDiscountRatePolicy?DiscountRateId=${DiscountRateId}&depotCode=${depotCode}&partyId=${partyId}&discountType=${discountType}&fromDate=${fromDate}&toDate=${toDate}`,
      this.httpOptions
    );
  }



  public GetSalesDiscountItemPolicy(DiscountItemId: any, fromDate : Date, endDate : Date): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/GetSalesDiscountItemPolicy?DiscountItemId=${DiscountItemId}&fromDate=${fromDate}&endDate=${endDate}`,
      this.httpOptions
    );
  }

  public GetitemPriceBySpecId(SecId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/GetitemPriceBySpecId?SecId=${SecId}`,
      this.httpOptions
    );
  }

  public SaveMangoCustomerBonusPolicy(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/SaveMangoCustomerBonusPolicy`,
      master,
      this.httpOptions
    );
  }

  public DeleteMangoCustomerBonusPolicy(
    mangoPolicyId: any
  ): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/DeleteMangoCustomerBonusPolicy`, mangoPolicyId,
      this.httpOptions
    );
  }

  public GetMangoCustomerBonusPolicy(mangoPolicyId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/GetMangoCustomerBonusPolicy?mangoPolicyId=${mangoPolicyId}`,
      this.httpOptions
    );
  }


  public SaveProductSpecWiseIncentive(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/SaveProductSpecWiseIncentivePolicy`,
      master,
      this.httpOptions
    );
  }

  public DeleteProductSpecWiseIncentive(
    incentivePolicyId: any
  ): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/DeleteProductSpecWiseIncentivePolicy`, incentivePolicyId,
      this.httpOptions
    );
  }

  public GetProductSpecWiseIncentivePolicy(incentivePolicyId: any, fDate: any = null, tDate: any = null): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/GetProductSpecWiseIncentivePolicy?incentivePolicyId=${incentivePolicyId}&fDate=${fDate}&tDate=${tDate}`,
      this.httpOptions
    );
  }

  public SaveCategorySales(categoryWiseProductVM: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}SalesBonusAndIncentivePolicy/SaveCategorySales`,
      categoryWiseProductVM,
      this.httpOptions
    );
  }


}
