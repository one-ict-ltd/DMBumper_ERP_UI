import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";
@Injectable({
  providedIn: "root",
})
export class FftReportService {
  apiUrl: string = this.commonService.baseUrl;
  fftApiUrl: string = this.commonService.fieldForceGlobalUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;
  constructor(private http: HttpClient, private commonService: CommonService) { }

  public GetTSOAttendenceReportData(
    ZoneCode: any,
    DepotCode: any,
    RegionCode: any,
    AreaCode: any,
    TerritoryCode: any,
    EmpCode: any,
    FDate: any,
    TDate: any
  ) {
    return this.http.get<any>(
      `${this.apiUrl}Report/GetTSOAttendenceReport?ZoneCode=${ZoneCode}&DepotCode=${DepotCode}&RegionCode=${RegionCode}&AreaCode=${AreaCode}&TerritoryCode=${TerritoryCode}&EmpCode=${EmpCode}&fromDate=${FDate}&toDate=${TDate}`,
      this.httpOptions
    );
  }
  public GetRoadMapReportdata(
    ZoneCode: any,
    DepotCode: any,
    RegionCode: any,
    AreaCode: any,
    TerritoryCode: any,
    EmpCode: any,
    Date: any
  ) {
    return this.http.get<any>(
      `${this.apiUrl}Report/RoadMapReportPDF?ZoneCode=${ZoneCode}&DepotCode=${DepotCode}&RegionCode=${RegionCode}&AreaCode=${AreaCode}&TerritoryCode=${TerritoryCode}&EmpCode=${EmpCode}&Date=${Date}`,
      this.httpOptions
    );
  }
  public GetLocationAll(
    Type: any,
    ZoneCode: any,
    DepotCode: any,
    RegionCode: any,
    AreaCode: any,
    TerritoryCode: any,
    EmpCode
  ) {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Report/GetLocationAll?Type=${Type}&ZoneCode=${ZoneCode}&DepotCode=${DepotCode}&RegionCode=${RegionCode}&AreaCode=${AreaCode}&TerritoryCode=${TerritoryCode}&EmpCode=${EmpCode}`,
      this.httpOptions
    );
  }
  //for Home Controller ='global/api/GetLocationMIO/'
  public GetLocationMIO_Map(
    Type: any,
    ZoneCode: any,
    DepotCode: any,
    RegionCode: any,
    AreaCode: any,
    TerritoryCode: any,
    EmpCode: any,
    Date: any
  ) {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Report/GetLocationMIO_Map?Type=${Type}&ZoneCode=${ZoneCode}&DepotCode=${DepotCode}&RegionCode=${RegionCode}&AreaCode=${AreaCode}&TerritoryCode=${TerritoryCode}&EmpCode=${EmpCode}&Date=${Date}`,
      this.httpOptions
    );
  }
  //for Home Controller ='global/api/GetLocationMIO/'
  public GetLocationMIO(
    Type: any,
    ZoneCode: any,
    DepotCode: any,
    RegionCode: any,
    AreaCode: any,
    TerritoryCode: any,
    EmpCode: any,
    Date: any
  ) {
    return this.http.get<any>(
      `${this.apiUrl}Report/GetLocationMIO?Type=${Type}&ZoneCode=${ZoneCode}&DepotCode=${DepotCode}&RegionCode=${RegionCode}&AreaCode=${AreaCode}&TerritoryCode=${TerritoryCode}&EmpCode=${EmpCode}&Date=${Date}`,
      this.httpOptions
    );
  }
  public GetFFTSalesReport(
    ZONE_CODE,
    DEPOT_CODE,
    REGION_COE,
    AREA_CODE,
    TERRITORY_CODE,
    EmpId,
    FDate,
    TDate,
    StoreId,
    SalesInvoiceId
  ) {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Report/GetFFTSalesReport?ZONE_CODE=${ZONE_CODE}&DEPOT_CODE=${DEPOT_CODE}&REGION_COE=${REGION_COE}&AREA_CODE=${AREA_CODE}&TERRITORY_CODE=${TERRITORY_CODE}&EmpId=${EmpId}&FDate=${FDate}&TDate=${TDate}&StoreId=${StoreId}&SalesInvoiceId=${SalesInvoiceId}`,
      this.httpOptions
    );
  }
  public GetEmp_DoctorPromotionalItemReportData(
    ZONE_CODE,
    DEPOT_CODE,
    REGION_COE,
    AREA_CODE,
    TERRITORY_CODE,
    EmpId,
    DoctorId,
    FDate,
    TDate
  ) {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Report/GetEmp_DoctorPromotionalItemReportData?ZONE_CODE=${ZONE_CODE}&DEPOT_CODE=${DEPOT_CODE}&REGION_COE=${REGION_COE}&AREA_CODE=${AREA_CODE}&TERRITORY_CODE=${TERRITORY_CODE}&EmpId=${EmpId}&DoctorId=${DoctorId}&FDate=${FDate}&TDate=${TDate}`,
      this.httpOptions
    );
  }


  public GetDailyAttendenceReportData() {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Report/GetDailyAttendanceReport`,
      this.httpOptions
    );
  }
  public GetDCRSummaryReportData(
    ZONE_CODE,
    REGION_COE,
    AREA_CODE,
    TERRITORY_CODE,
    FDate,
    TDate,
    ReportId
  ) {
    debugger;
    return this.http.get<any>(
      `${this.apiUrl}Report/getDcrSummaryReport?zoneCode=${ZONE_CODE}&regionCode=${REGION_COE}&areaCode=${AREA_CODE}&territoryCode=${TERRITORY_CODE}&fromDate=${this.commonService.DateFormat(FDate)}&toDate=${this.commonService.DateFormat(TDate)}&reportId=${ReportId}`,
      this.httpOptions
    );
  }
}
