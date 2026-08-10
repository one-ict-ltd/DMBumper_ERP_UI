import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ProducttransferService {

  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  public GetProductTransferById(prodTrnfrId: any, transferType: any, fromDate: Date = null, toDate: Date = null): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductTransfer/GetProductTransferById?prodTrnfrId=${prodTrnfrId}&transferType=${transferType}&fDate=${this.commonService.DateFormat(fromDate)}&tDate=${this.commonService.DateFormat(toDate)}`,
      this.httpOptions
    );
  }

  public GetProductTransferDetailsByMasterId(prodTrnfrId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}ProductTransfer/GetProductTransferDetailsByMasterId?prodTrnfrId=${prodTrnfrId}`,
      this.httpOptions
    );
  }
  public GetProductReqDetailsForProdTrnsfrById(prodReqId: any, storeId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ProductTransfer/GetProductReqDetailsForProdTrnsfrById?prodReqId=${prodReqId}&storeId=${storeId}`,
      this.httpOptions
    );
  }
  public SaveProductTransfer(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}ProductTransfer/SaveProductTransfer`,
      master,
      this.httpOptions
    );
  }
  public SaveProductTransferWithoutBatch(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}ProductTransfer/SaveProductTransferWithoutBatch`,
      master,
      this.httpOptions
    );
  }
  public GetProductTransferDpottoDepotById(prodTrnfrId: any): Observable<any> {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}ProductTransfer/GetProductTransferDpottoDepotById?prodTrnfrId=${prodTrnfrId}`,
      this.httpOptions
    );
  }
  public DeleteProductTransferById(prodTrnfrId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductTransfer/DeleteProductTransferById?`, prodTrnfrId,
      this.httpOptions
    );
  }
  public DeleteProductTransferDetailsById(productTrnfrDetailsId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductTransfer/DeleteProductTransferDetailsById`, productTrnfrDetailsId,
      this.httpOptions
    );
  }
  // public GetAllProductReqNumber(prodReqNumber: any): Observable<string> {
  //   return this.http.get<string>(
  //     `${this.apiUrl}PurCommon/GetProductReqNumber?prodReqNumber=${prodReqNumber}`,
  //     this.httpOptions
  //   );
  // }
  public GetAllProductReqNumberBySbuId(sbuId: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}ProductTransfer/GetAllProductReqNumberBySbuId?sbuId=${sbuId}`,
      this.httpOptions
    );
  }
  public GetMaxProductTransferNumber(date: any, transferType: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}ProductTransfer/GetMaxProductTransferNumber?dateTime=${date}&transferType=${transferType}`,
      this.httpOptions
    );
  }
  public GetProductTransferReportData(fromDate: any, toDate: any, fromSbuId: any, fromStoreId: any): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}ProductTransfer/GetProductTransferReportData?fromDate=${fromDate}&toDate=${toDate}&fromSbuId=${fromSbuId}&fromStoreId=${fromStoreId}`,
      this.httpOptions
    );
  }
  public deleteProductTrnfrDetailsById(productTrnfrDetailsId: any): Observable<string> {
    console.log(this.httpOptions);
    return this.http.get<string>(
      `${this.apiUrl}ProductTransfer/DeleteProductTrnfrDetailsById?productTrnfrDetailsId=${productTrnfrDetailsId}`,
      this.httpOptions
    );
  }
  public getDestructionNoteReceiveForRePack(): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}ProductTransfer/getDestructionNoteReceiveForRePack?`,
      this.httpOptions
    );
  }
  public GetDestructionNoteReceiveDetailById(destructionNoteReceiveId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ProductTransfer/getDestructionNoteReceiveDetailForRePack?destructionNoteReceiveId=${destructionNoteReceiveId}`,
      this.httpOptions
    );
  }
  public SaveRePackProductTransfer(master: any): Observable<string> {
    debugger;
    return this.http.post<string>(
      `${this.apiUrl}ProductTransfer/SaveRePackProductTransfer`,
      master,
      this.httpOptions
    );
  }
  public GetRePackProductTransferById(RePackProductTransferId: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}ProductTransfer/GetRePackProductTransferById?RePackProductTransferId=${RePackProductTransferId}`,
      this.httpOptions
    );
  }
  public GetRePackProductTransferNoListForReceive(RePackProductTransferId: any): Observable<any> {
    //debugger;
    return this.http.get<any>(
      `${this.apiUrl}ProductTransfer/GetRePackProductTransferNoListForReceive?RePackProductTransferId=${RePackProductTransferId}`,
      this.httpOptions
    );
  }
  public GetRePackTransferDetailsById(RePackProductTransferId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}ProductTransfer/GetRePackTransferDetailsById?RePackProductTransferId=${RePackProductTransferId}`,
      this.httpOptions
    );
  }
  public DeleteRePackProductTransferById(RePackProductTransferId: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ProductTransfer/DeleteRePackProductTransferById`, RePackProductTransferId,
      this.httpOptions
    );
  }
}

