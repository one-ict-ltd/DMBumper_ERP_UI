import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
import { Observable } from "rxjs";
import { NbDialogService, NbToastrService } from "@nebular/theme";
@Injectable({
  providedIn: "root",
})
export class FieldforcemasterService {
  apiUrl: string = this.commonService.baseUrl;
  fftApiUrl: string = this.commonService.fieldForceGlobalUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;
  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private toastrService: NbToastrService
  ) { }

  //#region Zone------------------
  public getZone(ZoneID: any) {
    return this.http.get<any>(
      `${this.fftApiUrl}GetZoneById?ZoneId=${ZoneID}`,
      this.httpOptions
    );
  }

  public saveZone(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ERPCompany/Zone`,
      master,
      this.httpOptions
    );
  }

  public saveExamContent(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Schedule/ExamContent`,
      master,
      this.httpOptions
    );
  }

  public deleteExamContent(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Schedule/DeleteExamContent`,
      master,
      this.httpOptions
    );
  }

  public getExamByContentId(ContentId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Schedule/getExamByContentId?contentId=${ContentId}`,
      this.httpOptions
    );
  }

  public getExamById(examId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Schedule/getExamById?examId=${examId}`,
      this.httpOptions
    );
  }

  public getExamQuestionByexamId(examId: any) {
    return this.http.get<any>(
      `${this.apiUrl}Schedule/getExamQuestionSetByexamId?examId=${examId}`,
      this.httpOptions
    );
  }

  public SaveExamQuestionSet(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Schedule/ExamQuestionSet`,
      master,
      this.httpOptions
    );
  }

  public SetsalesTarget(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Schedule/SetsalesTarget`,
      master,
      this.httpOptions
    );
  }

  public GetSetsalesTargetIdJson(employeeId: any, month: any, year: any) {
    return this.http.get<any>(
      `${this.apiUrl}Schedule/GetSetsalesTargetIdJson?employeeId=${employeeId}&month=${month}&year=${year}`,
      this.httpOptions
    );
  }

  public deletezone(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ERPCompany/deleteZone`,
      master,
      this.httpOptions
    );
  }
  //#endregion

  //#region   Depo----------

  public getDepo(DepotID: any) {
    return this.http.get<any>(
      `${this.apiUrl}ERPCompany/getDepo?DepotID=${DepotID}`,
      this.httpOptions
    );
  }

  public getExamContent() {
    return this.http.get<any>(
      `${this.apiUrl}Schedule/getExamContent`,
      this.httpOptions
    );
  }

  public getExamContentById(id) {
    return this.http.get<any>(
      `${this.apiUrl}Schedule/getExamContentById?contentId=${id}`,
      this.httpOptions
    );
  }

  public getAllExamContent() {
    return this.http.get<any>(
      `${this.apiUrl}Schedule/getAllExamContent`,
      this.httpOptions
    );
  }


  public saveDepo(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ERPCompany/Depo`,
      master,
      this.httpOptions
    );
  }

  public deletedepo(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ERPCompany/deleteDepo`,
      master,
      this.httpOptions
    );
  }
  public getDepoByZoneCode(code: any) {
    return this.http.get<any>(
      `${this.apiUrl}ERPCompany/getDepotbyZoneCode?code=${code}`,
      this.httpOptions
    );
  }

  //#region Region   --------------
  public getRegion(RegionID: any) {
    return this.http.get<any>(
      `${this.apiUrl}ERPCompany/getRegion?RegionID=${RegionID}`,
      this.httpOptions
    );
  }

  public saveRegion(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ERPCompany/Region`,
      master,
      this.httpOptions
    );
  }

  public deleteRegion(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ERPCompany/deleteRegion`,
      master,
      this.httpOptions
    );
  }
  //#endregion
  //#region Territory
  public getTerritory(TerritoryID: any) {
    return this.http.get<any>(
      `${this.apiUrl}ERPCompany/getTerritory?TerritoryID=${TerritoryID}`,
      this.httpOptions
    );
  }

  public saveTerriotory(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ERPCompany/setTerritory`,
      master,
      this.httpOptions
    );
  }

  public deleteTerriotory(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ERPCompany/deleteTerritory`,
      master,
      this.httpOptions
    );
  }
  //#endregion

  //#endregion

  //#region   Area----------
  public getRegionbydepocode(code: any) {
    return this.http.get<any>(
      `${this.apiUrl}ERPCompany/getRegionbydepocode?code=${code}`,
      this.httpOptions
    );
  }

  public GetRegionByZoneOrDepoCode(zoneCode: any, depoCode: any) {
    return this.http.get<any>(
      `${this.apiUrl}ERPCompany/GetRegionByZoneOrDepoCode?zoneCode=${zoneCode}&depoCode=${depoCode}`,
      this.httpOptions
    );
  }

  public saveArea(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ERPCompany/setArea`,
      master,
      this.httpOptions
    );
  }
  public getAreabyregioncode(code: any) {
    return this.http.get<any>(
      `${this.apiUrl}ERPCompany/getAreabyregioncode?code=${code}`,
      this.httpOptions
    );
  }

  public getArea(AreaID: any) {
    return this.http.get<any>(
      `${this.apiUrl}ERPCompany/getArea?AreaID=${AreaID}`,
      this.httpOptions
    );
  }

  public deleteArea(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ERPCompany/deleteArea`,
      master,
      this.httpOptions
    );
  }

  //#endregion Region  --------------

  //#region  Market ---------------
  public getMarket(MarketId: any) {
    return this.http.get<any>(
      `${this.apiUrl}ERPCompany/getMarket?MarketId=${MarketId}`,
      this.httpOptions
    );
  }

  public getAreabyRegopmcode(code: any) {
    return this.http.get<any>(
      `${this.apiUrl}ERPCompany/getAreabyRegopmcode?code=${code}`,
      this.httpOptions
    );
  }

  public getTerritorybyAreacode(code: any) {
    return this.http.get<any>(
      `${this.apiUrl}ERPCompany/getTerritorybyAreacode?code=${code}`,
      this.httpOptions
    );
  }

  public getTerritorybyUser() {
    return this.http.get<any>(
      `${this.apiUrl}ERPCompany/getTerritorybyUser`,
      this.httpOptions
    );
  }

  public getPendingPickingAreaByUser(code: any = null) {
    return this.http.get<any>(
      `${this.apiUrl}ERPCompany/getPendingPickingAreaByUser?code=${code}`,
      this.httpOptions
    );
  }

  public getTerritoryForPickingByUser(areaCode: any = null) {
    return this.http.get<any>(
      `${this.apiUrl}ERPCompany/getTerritoryForPickingByUser?areaCode=${areaCode}`,
      this.httpOptions
    );
  }

  public saveTerritory(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ERPCompany/setMarket`,
      master,
      this.httpOptions
    );
  }

  public deleteMarket(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}ERPCompany/deleteMarket`,
      master,
      this.httpOptions
    );
  }
  //#endregion  Market ---------------

  //#region   Doctor -----------------------
  public getDoctor(doctorId) {
    return this.http.get<any>(
      `${this.apiUrl}Doctor/GetDoctor?doctorId=${doctorId}`,
      this.httpOptions
    );
  }

  public getMarketbyTerritorycode(code: any) {
    return this.http.get<any>(
      `${this.apiUrl}ERPCompany/getMarketbyTerritorycode?code=${code}`,
      this.httpOptions
    );
  }

  public saveDoctor(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Schedule/setDoctor`,
      master,
      this.httpOptions
    );
  }

  public getDoctorCategory(doctorcategoryId) {
    return this.http.get<any>(
      `${this.apiUrl}Schedule/GetDoctorCategory?doctorCategoryId=${doctorcategoryId}`,
      this.httpOptions
    );
  }

  public getDoctorRx(doctorId) {
    return this.http.get<any>(
      `${this.apiUrl}Schedule/GetDoctorRx?doctorId=${doctorId}`,
      this.httpOptions
    );
  }

  // public savePlan(master: any): Observable<string> {
  //   debugger;
  //   return this.http.post<string>(
  //     `${this.apiUrl}Schedule/setPlanUpload`,
  //     master,
  //     this.httpOptions
  //   );
  // }
  public savePlan(code: any) {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Schedule/setPlanUpload?model=${code}`,
      this.httpOptions
    );
  }
  public savePlanDoc(code: any) {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Schedule/setPlanUploadDoc?model=${code}`,
      this.httpOptions
    );
  }
  public deleteDoctor(master: any): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Schedule/deleteDoctor`,
      master,
      this.httpOptions
    );
  }

  //#endregion Doctor -----------------------

  //#region Report

  public getMIO(TerritoryCode) {
    return this.http.get<any>(
      `${this.fftApiUrl}getMIO?code=${TerritoryCode}`,
      this.httpOptions
    );
  }
  public GetEmployeeforAllEmployeeCT(Code, Type) {
    return this.http.get<any>(
      `${this.apiUrl}Schedule/GetEmployeeforAllEmployeeCT?code=${Code}&Type=${Type}`,
      this.httpOptions
    );
  }
  public getCustomer(MarketName) {
    return this.http.get<any>(
      `${this.fftApiUrl}GetCustomerbyMarketCode?MarketCode=${MarketName}`,
      this.httpOptions
    );
  }
  public GetDoctorByTerritoryMarket(MarketID, TerritoryID) {
    return this.http.get<any>(
      `${this.apiUrl}Doctor/GetDoctorByTerritoryMarket?MarketID=${MarketID}&TerritoryID=${TerritoryID}`,
      this.httpOptions
    );
  }

  //#endregion  Report


  //#region common DropdownList

  public GetRegionByZoneCode(code: any) {
    return this.http.get<any>(
      `${this.apiUrl}ERPCompany/GetRegionByZoneCode?ZoneCode=${code}`,
      this.httpOptions
    );
  }
  public GetDepoByRegionCode(code: any) {
    return this.http.get<any>(
      `${this.apiUrl}ERPCompany/GetDepoByRegionCode?RegionCode=${code}`,
      this.httpOptions
    );
  }
  public GetAllDepo(code: any) {
    return this.http.get<any>(
      `${this.apiUrl}ERPCompany/GetAllDepot?code=${code}`,
      this.httpOptions
    );
  }

  public GetAreaByRegionCode(code: any) {
    return this.http.get<any>(
      `${this.apiUrl}ERPCompany/GetAreaByRegionCode_v2?code=${code}`,
      this.httpOptions
    );
  }
  public GetAreaByDepoCode(code: any) {
    return this.http.get<any>(
      `${this.apiUrl}ERPCompany/GetAreaByDepoCode?DepoCode=${code}`,
      this.httpOptions
    );
  }



  //#endregion

}
