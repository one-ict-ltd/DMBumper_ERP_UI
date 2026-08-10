import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/@core/mock/common.service";

@Injectable({
  providedIn: "root",
})
export class FftDashboardService {
  apiUrl: string = this.commonService.baseUrl;
  golbalApi: string = this.commonService.fieldForceGlobalUrl;
  httpOptions = this.commonService.getHttpOptions();
  button: any;
  constructor(private http: HttpClient, private commonService: CommonService) {}

  public LoadDashboardData() {
    return this.http.get<any>(
      `${this.apiUrl}Dashboard/CrmDashboard`,
      this.httpOptions
    );
  }
  public GetEmployees(code: any, Type: any, SType: any) {
    return this.http.get<any>(
      `${this.apiUrl}FFT_Employee/GetEmployeeforAllEmployee?code=${code}&Type=${Type}&SType=${SType}`,
      this.httpOptions
    );
  }
  public GetDepot(code: any) {
    return this.http.get<any>(
      `${this.apiUrl}FFT_Employee/GetDepot?code=${code}`,
      this.httpOptions
    );
  }
  public GetRegion(code: any) {
    return this.http.get<any>(
      `${this.apiUrl}FFT_Employee/GetRegion?code=${code}`,
      this.httpOptions
    );
  }
  public GetArea(code: any) {
    return this.http.get<any>(
      `${this.apiUrl}FFT_Employee/GetArea?code=${code}`,
      this.httpOptions
    );
  }
  public GetTerritory(code: any) {
    return this.http.get<any>(
      `${this.apiUrl}FFT_Employee/GetTerritory?code=${code}`,
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
    return this.http.get<any>(
      `${this.apiUrl}Dashboard/GetLocationAll?Type=${Type}&ZoneCode=${ZoneCode}&DepotCode=${DepotCode}&RegionCode=${RegionCode}&AreaCode=${AreaCode}&TerritoryCode=${TerritoryCode}&EmpCode=${EmpCode}`,
      this.httpOptions
    );
  }
  public GetSumData(
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
      `${this.apiUrl}Dashboard/GetSumData?Type=${Type}&ZoneCode=${ZoneCode}&DepotCode=${DepotCode}&RegionCode=${RegionCode}&AreaCode=${AreaCode}&TerritoryCode=${TerritoryCode}&EmpCode=${EmpCode}&Date=${Date}`,
      this.httpOptions
    );
  }
  public GetPieChartTotalStock(
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
      `${this.apiUrl}Dashboard/GetStockSales?Type=${Type}&ZoneCode=${ZoneCode}&DepotCode=${DepotCode}&RegionCode=${RegionCode}&AreaCode=${AreaCode}&TerritoryCode=${TerritoryCode}&EmpCode=${EmpCode}&Date=${Date}`,
      this.httpOptions
    );
  }
  public GetPieChartTotalSales(
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
      `${this.apiUrl}Dashboard/GetStockSalesSS?Type=${Type}&ZoneCode=${ZoneCode}&DepotCode=${DepotCode}&RegionCode=${RegionCode}&AreaCode=${AreaCode}&TerritoryCode=${TerritoryCode}&EmpCode=${EmpCode}&Date=${Date}`,
      this.httpOptions
    );
  }
  public GetSalesVsCollectionData(
    Totaldays: any,
    ZoneCode: any,
    DepotCode: any,
    RegionCode: any,
    AreaCode: any,
    TerritoryCode: any,
    EmpCode: any,
    FDate: any
  ) {
    return this.http.get<any>(
      `${this.apiUrl}Dashboard/GetSalesVsCollectionChartData?Totaldays=${Totaldays}&ZoneCode=${ZoneCode}&DepotCode=${DepotCode}&RegionCode=${RegionCode}&AreaCode=${AreaCode}&TerritoryCode=${TerritoryCode}&EmpCode=${EmpCode}&FDate=${FDate}`,
      this.httpOptions
    );
  }
  public GetAttendanceData(
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
      `${this.apiUrl}Dashboard/GetAttendanceData?Type=${Type}&ZoneCode=${ZoneCode}&DepotCode=${DepotCode}&RegionCode=${RegionCode}&AreaCode=${AreaCode}&TerritoryCode=${TerritoryCode}&EmpCode=${EmpCode}&Date=${Date}`,
      this.httpOptions
    );
  }
}
