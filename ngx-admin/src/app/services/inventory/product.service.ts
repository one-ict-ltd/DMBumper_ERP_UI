import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";
//import { NbDialogService, NbToastrService } from "@nebular/theme";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;
  constructor(private http: HttpClient, private commonService: CommonService) { }

  //////drop down//////
  public getProductCategory(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductCategory`,
      this.httpOptions
    );
  }

  public getCategorySales(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getCategorySales`,
      this.httpOptions
    );
  }

  public GetUOMConverterInfoByProductSpecId(productWiseSpecificationId: any, fromUomId: any, toUomId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Product/GetUOMConverterInfoByProductSpecId?productWiseSpecificationId=${productWiseSpecificationId}&fromUomId=${fromUomId}&toUomId=${toUomId}`,
      this.httpOptions
    );
  }

  public getProductSubCategory(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductSubCategory`,
      this.httpOptions
    );
  }
  public getProductSubCategorybyId(categoryId, subcategoryId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductSubCategory?productCategoryId=${categoryId}&productSubCategoryId=${subcategoryId}`,
      this.httpOptions
    );
  }
  public getProductType(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductType`,
      this.httpOptions
    );
  }
  public getProductTypeForDirectStockIn(companyId: number, sbuId: number, productTypeId: number, flag: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductType?companyId=${companyId}&sbuId=${sbuId}&productTypeId=${productTypeId}&flag=${flag}`,
      this.httpOptions
    );
  }

  public getProductGrade(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductGrade`,
      this.httpOptions
    );
  }

  public getProductModel(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductModel`,
      this.httpOptions
    );
  }

  public getProductBrand(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductBrand?brandId=0`,
      this.httpOptions
    );
  }

  public getProductUOM(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductUOM`,
      this.httpOptions
    );
  }

  public getProductOriginCountry(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductOriginCountry`,
      this.httpOptions
    );
  }

  public getCompany(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Product/getProductCompany`,
      this.httpOptions
    );
  }

  public getProduct(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Product/getProduct?productId=0`,
      this.httpOptions
    );
  }

  public getMaterial(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Product/getMaterial?productId=0`,
      this.httpOptions
    );
  }

  public getProductById(productId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Product/getProduct?productId=${productId}`,
      this.httpOptions
    );
  }
  public getFinishedProduct() {
    return this.http.get<any>(
      `${this.apiUrl}Product/getFinishedProducts`,
      this.httpOptions
    );
  }
  public getLastPurchaseOrderDetailsBySpecId(productId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Product/getLastPurchaseOrderDetailsBySpecId?productId=${productId}`,
      this.httpOptions
    );
  }
  public getTypeWiseProducts(productId: any, productTypeId: any, flag: any = "") {
    return this.http.get<any>(
      `${this.apiUrl}Product/getTypeWiseProducts?productId=${productId}&productTypeId=${productTypeId}&flag=${flag}`,
      this.httpOptions
    );
  }
  public GetAllFinishGoods() {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getAllProductForRequisition`,
      this.httpOptions
    );
  }
  public getProductByCategoryId(categoryId: number, month: number, year: string) {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductByCategoryId?categoryId=${categoryId}&monthId=${month}&year=${year}`,
      this.httpOptions
    );
  }

  public saveProduct(master: any): Observable<string> {
    console.log(master);
    return this.http.post<string>(
      `${this.apiUrl}Product/setProduct`,
      master,
      this.httpOptions
    );
  }


  public saveMaterial(master: any): Observable<string> {
    console.log(master);
    return this.http.post<string>(
      `${this.apiUrl}Product/setMaterial`,
      master,
      this.httpOptions
    );
  }


  public saveProductSpecification(master: any, productId): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Product/setProductWiseSpecification?productId=${productId}`,
      master,
      this.httpOptions
    );
  }

  public saveProductSize(master: any, productId): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Product/setProductWiseSize?productId=${productId}`,
      master,
      this.httpOptions
    );
  }

  public saveProductPricing(master: any, productId): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Product/setProducPricing?productId=${productId}`,
      master,
      this.httpOptions
    );
  }

  public saveProductDiscount(master: any, productId): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Product/setProductDiscount?productId=${productId}`,
      master,
      this.httpOptions
    );
  }

  public saveProductSupplier(master: any, productId): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Product/setProductSupplier?productId=${productId}`,
      master,
      this.httpOptions
    );
  }


  public deleteProduct(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Product/deleteProduct`,
      master,
      this.httpOptions
    );
  }

  public deleteDiscount(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Product/deleteProductDiscount`,
      master,
      this.httpOptions
    );
  }


  public getcolorInUpdate(productId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Product/getProductWiseColor?productId=${productId}`,
      this.httpOptions
    );
  }

  public getSpecificationDetailsInUpdate(productId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Product/getProductSpecificationDetailsInUpdate?productId=${productId}`,
      this.httpOptions
    );
  }

  public getProductsupplierInUpdate(productId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Product/getProductWiseSupplierInUpdate?productId=${productId}`,
      this.httpOptions
    );
  }

  public getcolor(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductColor`,
      this.httpOptions
    );
  }

  public getproductSpecification(productCategoryId, productId, skuNumber): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Product/getProductSpecification?productCategoryId=${productCategoryId}&productId=${productId}&currentNumber=${skuNumber}`,
      this.httpOptions
    );
  }

  public getSizeInUpdate(productId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Product/getProductWiseSize?productId=${productId}`,
      this.httpOptions
    );
  }

  public getSpecificationInUpdate(productId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Product/getProductWiseSpecificationInUpdateJsonById?productId=${productId}`,
      this.httpOptions
    );
  }

  public getDiscountList(productId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Product/getDiscountList?productId=${productId}`,
      this.httpOptions
    );
  }

  public getSize(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductSize`,
      this.httpOptions
    );
  }

  public getBarCode(productId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Product/getProductWiseBarCodeJsonById?productId=${productId}`,
      this.httpOptions
    );
  }

  public getBarCodeInUpdate(productId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Product/getProductWiseBarCodeInUpdateJsonById?productId=${productId}`,
      this.httpOptions
    );
  }


  public getProductsupplier(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductSupplier`,
      this.httpOptions
    );
  }

  public getDiscoutType(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getProductDiscountType`,
      this.httpOptions
    );
  }

  public getSupplierIdWise(supplierId): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Product/getProductSupplierIdWise?supplierId=${supplierId}`,
      this.httpOptions
    );
  }

  // getProductImage(url:any): Observable<Blob> {
  //   return this.httpClient.get('http://myip/image/' + url, { responseType: "blob" });
  // }
  getProductImage(filePath: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Product/getProductImage?filePath=${filePath}`,
      this.httpOptions
    );
  }





  //Start Product Set 

  public GetProductSetMasterById(productSetMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Product/GetProductSetMasterById?productSetMasterId=${productSetMasterId}`,
      this.httpOptions
    );
  }

  public GetProductSetDetailsById(productSetMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Product/GetProductSetDetailsById?productSetMasterId=${productSetMasterId}`,
      this.httpOptions
    );
  }
  public GetProductSetReportById(productSetMasterId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Product/GetProductSetReportById?productSetMasterId=${productSetMasterId}`,
      this.httpOptions
    );
  }

  public SaveProductSet(master: any): Observable<string> {
    console.log(master);
    return this.http.post<string>(
      `${this.apiUrl}Product/SaveProductSet`, master,
      this.httpOptions
    );
  }

  public DeleteProductSetMasterByMasterId(productSetMasterId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Product/DeleteProductSetMasterByMasterId`, productSetMasterId,
      this.httpOptions
    );
  }

  public DeleteProductSetDetailsById(productSetDetailsId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Product/DeleteProductSetDetailsById`, productSetDetailsId,
      this.httpOptions
    );
  }
  public getAllProductSpecification(productId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ProductCategory/getAllProductForRequisition?productId=${productId}`,
      this.httpOptions
    );
  }

  //End Product Set

  //#region  Save ProductWiseColor

  public saveProductWiseColor(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Product/SetProductWiseColor`,
      master,
      this.httpOptions
    );
  }

  public GetProductWiseColorById(productWiseColorId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Product/GetProductWiseColorById?productWiseColorId=${productWiseColorId}`,
      this.httpOptions
    );
  }
  public VarifyPromoProductUploadData(skuNumber: string, packSize: string) {
    return this.http.get<any>(
      `${this.apiUrl}Product/VarifyPromoProductUploadData?skuNumber=${skuNumber}&productCode=${packSize}`,
      this.httpOptions
    );
  }
  public UploadPromoProduct(master: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}Product/UploadPromoProduct`,
      master,
      this.httpOptions
    );
  }
  public GetAllPromoUploadedProducts(productId: number) {
    return this.http.get<any>(
      `${this.apiUrl}Product/GetAllPromoUploadedProducts?productId=${productId}`,
      this.httpOptions
    );
  }

  public DeleteProductWiseColorById(productWiseColorId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Product/DeleteProductWiseColorById`, productWiseColorId,
      this.httpOptions
    );
  }
  public DeleteProductWiseSpectById(spectId: number): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Product/DeleteProductWiseSpectById`, spectId,
      this.httpOptions
    );
  }
  //#endregion

  // start -- Product Specification Info 
  public getProductSpecInfo(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Product/getProductSpecInfo`,
      this.httpOptions
    );
  }
  public getProductSpecInfoById(productSpecInfoId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Product/getProductSpecInfo?productSpecInfoId=${productSpecInfoId}`,
      this.httpOptions
    );
  }
  public saveProductSpecInfo(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Product/setProductSpecInfo`,
      master,
      this.httpOptions
    );
  }
  public deleteProductSpecInfo(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Product/deleteProductSpecInfo`,
      master,
      this.httpOptions
    );
  }
  // end --Product Specification Info 

}
