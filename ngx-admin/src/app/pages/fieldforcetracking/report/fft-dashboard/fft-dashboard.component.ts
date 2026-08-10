import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { DatePipe, NgSwitchCase } from "@angular/common";
import * as CanvasJS from "../../../../../assets/js/canvasjs.min";
import { CommonService } from "app/@core/mock/common.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { FftDashboardService } from "app/services/fieldforcetracking/fft-dashboard.service";
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import * as Mapboxgl from "mapbox-gl";
interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}
@Component({
  selector: "ngx-fft-dashboard",
  templateUrl: "./fft-dashboard.component.html",
  styleUrls: ["./fft-dashboard.component.scss"],
})
export class FftDashboardComponent implements OnInit {
  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private comboService: CommoncomboService,
    private datePipe: DatePipe,
    private FftDashboardService: FftDashboardService,
    private fieldforcemasterService: FieldforcemasterService
  ) {
    this.getMasterT();
    this.getMaster();
  }

  ngOnInit(): void {
    this.LoadDashboard();
    this.LoadAllLocationData();
  }
  //#region report

  private pageNavigation: any;
  private gridApi: any;
  private gridColumnApi: any;
  private rowData: any;
  public columnDefs;
  public defaultColDef;

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  GetAttendanceData(rptType) {
    this.FftDashboardService.GetAttendanceData(
      rptType,
      this.masterT.ZONE_CODET,
      this.masterT.DEPOT_CODET,
      this.masterT.REGION_CODET,
      this.masterT.AREA_CODET,
      this.masterT.TERRITORY_CODET,
      this.masterT.userIdT,
      this.datePipe.transform(this.masterT.DateT, "yyyy-MM-dd")
    ).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }

  ButtonAction(rptType: any) {
    if ((rptType = "excel")) {
      this.pageNavigation = this.mpHeader;
      this.commonService.onExportCSV(this.gridApi, this.pageNavigation);
    }
    if ((rptType = "pdf")) {
      // this.pageNavigation = this.mpHeader;
      // this.commonService.onExportCSV(this.gridApi, this.pageNavigation);
    }
  }
  onRowClicked(event) { }

  GetModalReport(Type: any) {
    this.defaultColDef = {
      //flex: 1,
      //minWidth: 650,
      sortable: true,
      resizable: true,
      //floatingFilter: true,
    };

    this.columnDefs = [
      {
        headerName: "Emp. Code",
        field: "EMPID",
        filter: "agTextColumnFilter",
        //width: 140,
        sortable: true,
      },
      {
        headerName: "Emp Name",
        field: "EMPLOYEENAME",
        filter: "agTextColumnFilter",
        //width: 150,
        sortable: true,
      },
      {
        headerName: "Posting",
        field: "POSTINGLOCATION",
        filter: "agNumberColumnFilter",
        //valueFormatter: (params) => this.currencyFormatter(params.data.voucherAmount),
        //type: "rightAligned",
        //width: 130,
        sortable: true,
      },
      {
        headerName: "Zone Name",
        field: "ZoneName",
        filter: "agTextColumnFilter",
        //width: 200,
        sortable: true,
      },
      {
        headerName: "Region Name",
        field: "RegionName",
        filter: "agTextColumnFilter",
        //width: 180,
        sortable: true,
      },
      {
        headerName: "Area Name",
        field: "AreaName",
        filter: "agTextColumnFilter",
        //width: 180,
        sortable: true,
      },
      {
        headerName: "Territory Name",
        field: "TerritoryName",
        filter: "agTextColumnFilter",
        //width: 180,
        sortable: true,
      },
    ];
    debugger;
    switch (Type) {
      case "TE": {
        this.mpHeader = "Employee Details";
        let InTime = {
          headerName: "In Time",
          field: "InTime",
          filter: "agTextColumnFilter",
          //width: 180,
          sortable: true,
        };
        let OutTime = {
          headerName: "Out Time",
          field: "OutTime",
          filter: "agTextColumnFilter",
          //width: 180,
          sortable: true,
        };
        this.columnDefs.push(InTime);
        this.columnDefs.push(OutTime);

        console.log(this.columnDefs);
        break;
      }
      case "PI": {
        this.mpHeader = "Punched In Employee Details";
        let InTime = {
          headerName: "In Time",
          field: "InTime",
          filter: "agTextColumnFilter",
          sortable: true,
          //width: 180,
        };
        let Address = {
          headerName: "Address",
          field: "Address",
          filter: "agTextColumnFilter",
          sortable: true,
          //width: 180,
        };
        this.columnDefs.push(InTime);
        this.columnDefs.push(Address);

        console.log(this.columnDefs);
        break;
      }
      case "LP": {
        this.mpHeader = "Late Punched Employee Details";
        let InTime = {
          headerName: "In Time",
          field: "InTime",
          filter: "agTextColumnFilter",
          //width: 180,
          sortable: true,
        };
        let OutTime = {
          headerName: "Out Time",
          field: "OutTime",
          filter: "agTextColumnFilter",
          //width: 180,
          sortable: true,
        };
        let LateTime = {
          headerName: "Late Time",
          field: "LateTime",
          filter: "agTextColumnFilter",
          //width: 180,
          sortable: true,
        };
        let Address = {
          headerName: "Address",
          field: "Address",
          filter: "agTextColumnFilter",
          //width: 180,
          sortable: true,
        };

        this.columnDefs.push(InTime);
        this.columnDefs.push(OutTime);
        this.columnDefs.push(LateTime);
        this.columnDefs.push(Address);

        console.log(this.columnDefs);
        break;
      }
      case "DO": {
        this.mpHeader = "Day Off Employee Details";

        console.log(this.columnDefs);
        break;
      }
      case "PO": {
        this.mpHeader = "Punched Out Employee Details";
        let InTime = {
          headerName: "In Time",
          field: "InTime",
          filter: "agTextColumnFilter",
          //width: 180,
          sortable: true,
        };
        let OutTime = {
          headerName: "Out Time",
          field: "OutTime",
          filter: "agTextColumnFilter",
          //width: 180,
          sortable: true,
        };
        let Duration = {
          headerName: "Duration",
          field: "Duration",
          filter: "agTextColumnFilter",
          //width: 180,
          sortable: true,
        };
        let Address = {
          headerName: "Address",
          field: "Address",
          filter: "agTextColumnFilter",
          //width: 180,
          sortable: true,
        };

        this.columnDefs.push(InTime);
        this.columnDefs.push(OutTime);
        this.columnDefs.push(Duration);
        this.columnDefs.push(Address);

        console.log(this.columnDefs);
        break;
      }
      case "NOP": {
        this.mpHeader = "Not Punched Employee Details";
        console.log(this.columnDefs);
        break;
      }
    }
    this.GetAttendanceData(Type);
  }

  //#endregion end report

  //#region 1st Col
  ZONE_CODETList: [];
  DEPOT_CODETList: [];
  REGION_CODETList: [];
  AREA_CODETList: [];
  TERRITORY_CODETList: [];
  userListT: [];

  ZONE_CODETSelected: {};
  DEPOT_CODETSelected: {};
  REGION_CODETSelected: {};
  AREA_CODETSelected: {};
  TERRITORY_CODETSelected: {};
  userIdTSelected: {};

  masterT: {
    DateT: Date;
    ZONE_CODET: string;
    DEPOT_CODET: string;
    REGION_CODET: string;
    AREA_CODET: string;
    TERRITORY_CODET: string;
    userIdT: string;
  };

  public getMasterT() {
    this.masterT = {
      DateT: new Date(),
      ZONE_CODET: "",
      DEPOT_CODET: "",
      REGION_CODET: "",
      AREA_CODET: "",
      TERRITORY_CODET: "",
      userIdT: "",
    };
  }
  //#endregion 1st Col

  //#region 2nd Col
  TE: 0;
  PI: 0;
  LP: 0;
  OD: 0;
  PO: 0;
  NOP: 0;
  TP: 0;
  TX: 0;

  //#endregion 2nd Col

  //#region 2nd row 1st Col
  ZONE_CODEList: [];
  DEPOT_CODEList: [];
  REGION_CODEList: [];
  AREA_CODEList: [];
  TERRITORY_CODEList: [];
  userList: [];

  ZONE_CODESelected: {};
  DEPOT_CODESelected: {};
  REGION_CODESelected: {};
  AREA_CODESelected: {};
  TERRITORY_CODESelected: {};
  userIdSelected: {};

  master: {
    Date: Date;
    ZONE_CODE: string;
    DEPOT_CODE: string;
    REGION_CODE: string;
    AREA_CODE: string;
    TERRITORY_CODE: string;
    userId: string;
  };

  public getMaster() {
    this.master = {
      Date: new Date(),
      ZONE_CODE: "",
      DEPOT_CODE: "",
      REGION_CODE: "",
      AREA_CODE: "",
      TERRITORY_CODE: "",
      userId: "",
    };
  }

  //#endregion 2nd Col

  LoadDashboard() {
    //debugger;
    this.FftDashboardService.LoadDashboardData().subscribe((returns: any) => {
      //debugger;
      if (returns.success) {
        let zoneList = returns.data[0].zoneListViewModels;

        this.ZONE_CODETList = zoneList.map((val: any) => ({
          id: val.Code,
          name: val.Name + "-" + val.Code,
        }));

        this.ZONE_CODEList = zoneList.map((val: any) => ({
          id: val.Code,
          name: val.Name + "-" + val.Code,
        }));

        //this.SetDefaultDropdownValue(zoneList);

        this.LoadSumData();
        this.DropdownChange("", "");
      }
    });
  }

  SetDefaultDropdownValue(zoneList: any) {
    this.masterT.ZONE_CODET = zoneList[0]["Code"];
    this.master.ZONE_CODE = zoneList[0]["Code"];

    this.ZONE_CODETSelected = {
      id: zoneList[0]["Code"],
      name: zoneList[0]["Name"] + "-" + zoneList[0]["Code"],
    };
    this.ZONE_CODESelected = {
      id: zoneList[0]["Code"],
      name: zoneList[0]["Name"] + "-" + zoneList[0]["Code"],
    };

    this.DropdownChange("Z", "T");
    this.DropdownChange("Z", "");
  }

  LoadEmployees(resType: any, code: any, Type: any, SType: any) {
    this.FftDashboardService.GetEmployees(code, Type, "").subscribe(
      (returns: any) => {
        if (returns.success) {
          //debugger;
          //console.log(returns);
          let List = returns.data.map((val: any) => ({
            id: val.employeeNo,
            name: `${val.fullName} (${val.employeeNo})`,
          }));

          if (resType == "T") {
            this.masterT.userIdT = "";
            this.userIdTSelected = {};
            this.userListT = [];
            this.userListT = List;
          } else {
            this.master.userId = "";
            this.userIdSelected = {};
            this.userList = [];
            this.userList = List;
          }
        }
      }
    );
  }

  GetDepot(resType: any, code: any) {
    this.FftDashboardService.GetDepot(code).subscribe((returns: any) => {
      if (returns.success) {
        //debugger;
        //console.log(returns);
        let List = returns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }));

        if (resType == "T") {
          this.masterT.DEPOT_CODET = "";
          this.DEPOT_CODETSelected = {};
          this.DEPOT_CODETList = [];
          this.DEPOT_CODETList = List;
        } else {
          this.master.DEPOT_CODE = "";
          this.DEPOT_CODESelected = {};
          this.DEPOT_CODEList = [];
          this.DEPOT_CODEList = List;
        }
      }
    });
  }

  GetRegion(resType: any, code: any) {
    this.FftDashboardService.GetRegion(code).subscribe((returns: any) => {
      if (returns.success) {
        let List = returns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }));

        if (resType == "T") {
          this.masterT.REGION_CODET = "";
          this.REGION_CODETSelected = {};
          this.REGION_CODETList = [];
          this.REGION_CODETList = List;
        } else {
          this.master.REGION_CODE = "";
          this.REGION_CODESelected = {};
          this.REGION_CODEList = [];
          this.REGION_CODEList = List;
        }
      }
    });
  }

  public GetRegionByZoneOrDepoCode(resType: any, zoneCode: any, depoCode: any) {
    this.fieldforcemasterService
      .GetRegionByZoneOrDepoCode(zoneCode, depoCode)
      .subscribe((returns: any) => {
        if (returns.success) {
          let List = returns.data.map((val: any) => ({
            id: val.Code,
            name: val.Name,
          }));

          if (resType == "T") {
            this.masterT.REGION_CODET = "";
            this.REGION_CODETSelected = {};
            this.REGION_CODETList = [];
            this.REGION_CODETList = List;
          } else {
            this.master.REGION_CODE = "";
            this.REGION_CODESelected = {};
            this.REGION_CODEList = [];
            this.REGION_CODEList = List;
          }
        }
      });
  }

  GetArea(resType: any, code: any) {
    this.FftDashboardService.GetArea(code).subscribe((returns: any) => {
      if (returns.success) {
        //debugger;
        //console.log(returns);
        let List = returns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }));

        if (resType == "T") {
          this.masterT.AREA_CODET = "";
          this.AREA_CODETSelected = {};
          this.AREA_CODETList = [];
          this.AREA_CODETList = List;
        } else {
          this.master.AREA_CODE = "";
          this.AREA_CODESelected = {};
          this.AREA_CODEList = [];
          this.AREA_CODEList = List;
        }
      }
    });
  }

  GetTerritory(resType: any, code: any) {
    this.FftDashboardService.GetTerritory(code).subscribe((returns: any) => {
      if (returns.success) {
        //debugger;
        //console.log(returns);
        let List = returns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }));

        if (resType == "T") {
          this.TERRITORY_CODETSelected = {};
          this.TERRITORY_CODETList = [];
          this.TERRITORY_CODETList = List;
        } else {
          this.TERRITORY_CODEList = [];
          this.TERRITORY_CODESelected = {};
          this.TERRITORY_CODEList = List;
        }
      }
    });
  }

  DropdownChange(ddlName: any, resType: any) {
    //debugger;
    switch (ddlName) {
      case "Z": {
        this.masterT.DEPOT_CODET = "";
        this.master.DEPOT_CODE = "";
        this.masterT.REGION_CODET = "";
        this.master.REGION_CODE = "";
        this.masterT.AREA_CODET = "";
        this.master.AREA_CODE = "";
        this.masterT.TERRITORY_CODET = "";
        this.master.TERRITORY_CODE = "";
        this.master.userId = "";
        this.masterT.userIdT = "";
        //Zone
        let code =
          resType == "T" ? this.masterT.ZONE_CODET : this.master.ZONE_CODE;
        this.LoadEmployees(resType, code, "Z", "T");
        this.GetDepot(resType, code);
        this.GetRegionByZoneOrDepoCode(resType, code, "");
        break;
      }
      case "D": {
        this.masterT.REGION_CODET = "";
        this.master.REGION_CODE = "";
        this.masterT.AREA_CODET = "";
        this.master.AREA_CODE = "";
        this.masterT.TERRITORY_CODET = "";
        this.master.TERRITORY_CODE = "";
        this.master.userId = "";
        this.masterT.userIdT = "";
        //Depot
        let code =
          resType == "T" ? this.masterT.DEPOT_CODET : this.master.DEPOT_CODE;
        this.LoadEmployees(resType, code, "D", "T");
        this.GetRegion(resType, code);
        break;
      }
      case "R": {
        this.masterT.AREA_CODET = "";
        this.master.AREA_CODE = "";
        this.masterT.TERRITORY_CODET = "";
        this.master.TERRITORY_CODE = "";
        this.master.userId = "";
        this.masterT.userIdT = "";
        //Region
        let code =
          resType == "T" ? this.masterT.REGION_CODET : this.master.REGION_CODE;
        this.LoadEmployees(resType, code, "R", "T");
        this.GetArea(resType, code);
        break;
      }
      case "A": {
        this.masterT.TERRITORY_CODET = "";
        this.master.TERRITORY_CODE = "";
        this.master.userId = "";
        this.masterT.userIdT = "";
        //Area
        let code =
          resType == "T" ? this.masterT.AREA_CODET : this.master.AREA_CODE;
        this.LoadEmployees(resType, code, "A", "T");
        this.GetTerritory(resType, code);
        break;
      }
      case "T": {
        //Territory
        let code =
          resType == "T"
            ? this.masterT.TERRITORY_CODET
            : this.master.TERRITORY_CODE;
        this.LoadEmployees(resType, code, "T", "T");
        break;
      }
      default: {
        this.LoadEmployees("T", "", "", "");
        this.LoadEmployees("", "", "", "");
        break;
      }
    }
    if (resType == "T") this.LoadSumData();
    else this.LoadAllLocationData();
  }

  ChnageEnployee() {
    this.LoadAllLocationData();
  }

  LoadSumData() {
    let Type = this.masterT.AREA_CODET;
    let ZoneCode = this.masterT.ZONE_CODET;
    let DepotCode = this.masterT.DEPOT_CODET;
    let RegionCode = this.masterT.REGION_CODET;
    let AreaCode = this.masterT.AREA_CODET;
    let TerritoryCode = this.masterT.TERRITORY_CODET;
    let EmpCode = this.masterT.userIdT;
    let Date = this.datePipe.transform(this.masterT.DateT, "yyyy-MM-dd");

    this.FftDashboardService.GetSumData(
      Type,
      ZoneCode,
      DepotCode,
      RegionCode,
      AreaCode,
      TerritoryCode,
      EmpCode,
      Date
    ).subscribe((returns: any) => {
      if (returns.success) {
        //debugger;
        //console.log(returns.data[0]);
        this.TE = returns.data[0].TE;
        this.PI = returns.data[0].TI;
        this.LP = returns.data[0].TL;
        this.OD = returns.data[0].DO;
        this.PO = returns.data[0].TTO;
        this.NOP = returns.data[0].NOP;

        this.TP = returns.data[0].TP;
        this.TX = returns.data[0].TX;
      }
    });
    this.LoadBarChartTotalStock(this.TX, this.TP);
    this.GetSalesVsCollectionData(
      15,
      ZoneCode,
      DepotCode,
      RegionCode,
      AreaCode,
      TerritoryCode,
      EmpCode,
      Date
    );
    //this.LoadPieChartTotalStock(      Type,      ZoneCode,      DepotCode,      RegionCode,      AreaCode,      TerritoryCode,      EmpCode,      Date);
    //this.LoadPieChartTotalSales(      Type,      ZoneCode,      DepotCode,      RegionCode,      AreaCode,      TerritoryCode,      EmpCode,      Date    );
  }

  LoadBarChartTotalStock(tx, tp) {
    let chart = new CanvasJS.Chart("chartContainer", {
      backgroundColor: "rgb(196, 253, 253)",
      theme: "light2",
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Retail Plan/Execution",
      },
      data: [
        {
          type: "rangeBar",
          // axisX: {
          //   title: "",
          //   interval: 20,
          //   suffix: "",
          //   prefix: "",
          //   labelFontSize: 20,
          // },
          // axisY: {
          //   title: "",
          //   interval: 500,
          //   suffix: "",
          //   prefix: "",
          //   fontSize: 18,
          //   labelFontSize: 0,
          // },
          showInLegend: true,
          toolTipContent: "<b>{label}</b>:{y[1]}", //"<b>{name}</b>: ${y} (#percent%)",
          indexLabel: "{y[#index]}", //"{name} - #percent%",
          dataPoints: [
            { x: 0, y: [0, tx], label: "Execution" },
            { x: 20, y: [0, tp], label: "Plan" },
          ],
        },
      ],
    });

    chart.render();
  }

  GetSalesVsCollectionData(
    Totaldays,
    ZoneCode,
    DepotCode,
    RegionCode,
    AreaCode,
    TerritoryCode,
    EmpCode,
    Date
  ) {
    this.FftDashboardService.GetSalesVsCollectionData(
      Totaldays,
      ZoneCode,
      DepotCode,
      RegionCode,
      AreaCode,
      TerritoryCode,
      EmpCode,
      Date
    ).subscribe((returns: any) => {
      if (returns.success) {
        this.RenderSalesVsCollectionChart(returns.data);
      }
    });
  }

  RenderSalesVsCollectionChart(bodyData: any) {
    let salesData = [];
    let collectionData = [];

    bodyData.forEach((element) => {
      var xDate = new Date(`${element.Date}`);
      salesData.push({
        x: xDate,
        y: element.SalesAmount,
      });
      collectionData.push({
        x: xDate,
        y: element.CollectionAmount,
      });
    });

    var chart = new CanvasJS.Chart("SalesVsCollectionChart", {
      backgroundColor: "rgb(196, 253, 253)",
      animationEnabled: true,
      theme: "light1",
      title: {
        text: "Sales vs Collections",
      },
      axisX: {
        valueFormatString: "DD MMM",
        crosshair: {
          enabled: true,
          snapToDataPoint: true,
        },
      },
      axisY: {
        title: "Number of Sales & Collections (TK)", //Number of Visits
        includeZero: true,
        crosshair: {
          enabled: true,
        },
      },
      toolTip: {
        shared: true,
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "bottom",
        horizontalAlign: "center",
        dockInsidePlotArea: true,
        //itemclick: toogleDataSeries, //this function help to toggle show and hide sales or collection data
      },
      data: [
        {
          type: "spline",
          showInLegend: true,
          name: "Total Sales",
          markerType: "square",
          xValueFormatString: "DD MMM, YYYY",
          dataPoints: salesData,
        },
        {
          type: "spline",
          showInLegend: true,
          name: "Total Collections",
          lineDashType: "dash",
          color: "#F08080",
          dataPoints: collectionData,
        },
      ],
    });
    chart.render();
  }

  LoadPieChartTotalStock(
    Type,
    ZoneCode,
    DepotCode,
    RegionCode,
    AreaCode,
    TerritoryCode,
    EmpCode,
    Date
  ) {
    let bodyData: any;

    this.FftDashboardService.GetPieChartTotalStock(
      Type,
      ZoneCode,
      DepotCode,
      RegionCode,
      AreaCode,
      TerritoryCode,
      EmpCode,
      Date
    ).subscribe((returns: any) => {
      if (returns.success) {
        //bodyData = returns.data;
        //console.log("bodyData");
        //console.log(bodyData);

        for (var i = 0; i < returns.data.length; i++) {
          bodyData.push({
            y: returns.data[i].StockQty,
            name: returns.data[i].BrandName,
            color: returns.data[i].ColorCode,
          });
        }

        let chart = new CanvasJS.Chart("pieChartTotalStock", {
          theme: "light2",
          animationEnabled: true,
          exportEnabled: true,
          title: {
            text: "Stock",
          },
          data: [
            {
              type: "pie",
              showInLegend: true,
              toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
              indexLabel: "{name} - #percent%",
              dataPoints: bodyData,
            },
          ],
        });

        chart.render();
      }
    });
  }

  LoadPieChartTotalSales(
    Type,
    ZoneCode,
    DepotCode,
    RegionCode,
    AreaCode,
    TerritoryCode,
    EmpCode,
    Date
  ) {
    let bodyData: any;

    this.FftDashboardService.GetPieChartTotalStock(
      Type,
      ZoneCode,
      DepotCode,
      RegionCode,
      AreaCode,
      TerritoryCode,
      EmpCode,
      Date
    ).subscribe((returns: any) => {
      if (returns.success) {
        //bodyData = returns.data;
        //console.log("bodyData");
        //console.log(bodyData);

        for (var i = 0; i < returns.data.length; i++) {
          bodyData.push({
            y: returns.data[i].SaleQty,
            name: returns.data[i].BrandName,
            color: returns.data[i].ColorCode,
          });
        }

        let chart = new CanvasJS.Chart("pieChartTotalSales", {
          theme: "light2",
          animationEnabled: true,
          exportEnabled: true,
          title: {
            text: "Sales",
          },
          data: [
            {
              type: "pie",
              showInLegend: true,
              toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
              indexLabel: "{name} - #percent%",
              dataPoints: bodyData,
            },
          ],
        });

        chart.render();
      }
    });
  }

  //#region  Modal Popup
  mpHeader: string;
  public addDetails(dialog: TemplateRef<any>, rType: string) {
    debugger;
    this.GetModalReport(rType);
    this.openWithDataObjModel(dialog);
  }
  public openWithDataObjModel(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      context: this.data,
    });
  }

  data: Country[] = [
    {
      name: "Russia",
      flag: "f/f3/Flag_of_Russia.svg",
      area: 17075200,
      population: 146989754,
    },
    {
      name: "Canada",
      flag: "c/cf/Flag_of_Canada.svg",
      area: 9976140,
      population: 36624199,
    },
    {
      name: "United States",
      flag: "a/a4/Flag_of_the_United_States.svg",
      area: 9629091,
      population: 324459463,
    },
    {
      name: "China",
      flag: "f/fa/Flag_of_the_People%27s_Republic_of_China.svg",
      area: 9596960,
      population: 1409517397,
    },
  ];
  //#endregion Modal Popup

  Locationdata: any;
  TotalEmployees = 0;
  LoadAllLocationData() {
    let Type = "";
    let ZoneCode = this.master.ZONE_CODE;
    let DepotCode = this.master.DEPOT_CODE;
    let RegionCode = this.master.REGION_CODE;
    let AreaCode = this.master.AREA_CODE;
    let TerritoryCode = this.master.TERRITORY_CODE;
    let EmpCode = this.master.userId;
    //let Date = this.datePipe.transform(this.masterT.DateT, "yyyy-MM-dd");
    this.FftDashboardService.GetLocationAll(
      Type,
      ZoneCode,
      DepotCode,
      RegionCode,
      AreaCode,
      TerritoryCode,
      EmpCode
    ).subscribe((returns: any) => {
      if (returns.success) {
        //console.log(returns);
        //console.log(returns.data);
        this.Locationdata = returns.data;
        this.TotalEmployees = returns.data.length;
        getLocation(this.Locationdata, this.TotalEmployees);
      }
    });
  }
} // end of scope

function getLocation(Locationdata: any, empCount: any) {
  //console.log("Hit !");
  debugger;
  //$("#count").html(Locationdata.length);
  var featuresData = [];

  Locationdata.forEach((rc) => {
    var properties = {
      // description:
      //   "<strong>Detail:</strong>      <p>Code:" +
      //   rc.MIOCode +
      //   "</p>      <p>Name:" +
      //   rc.MIOName +
      //   "</p>     <p>Designation:" +
      //   rc.Designation +
      //   "</p>      <p>Posting:" +
      //   rc.Location +
      //   "</p>      <p>Address:" +
      //   rc.LLAddress +
      //   "</p>      <p>Date Time:" +
      //   rc.DateTime +
      //   "</p>",
      description: `<strong>Details:<br>----------------------------</strong><br><strong>Code</strong>: ${rc.MIOCode}<br><strong>Name</strong>: ${rc.MIOName}<br><strong>Designation</strong>: ${rc.Designation}<br><strong>Posting</strong>: ${rc.Location}<br><strong>Location</strong>: ${rc.LLAddress}<br><strong>Date Time</strong>: ${rc.DateTime}`,
    };
    var geomertry = {
      type: "Point",
      coordinates: [rc.Longitude, rc.Latitude], //[rc.Latitude, rc.Longitude], //
    };
    var object = {
      type: "Feature",
      properties: properties,
      geometry: geomertry,
    };
    featuresData.push(object);
  });
  //console.log(featuresData);

  Mapboxgl.accessToken =
    "pk.eyJ1IjoiYmFzaGFybmFpbSIsImEiOiJja2ZrbGlieDMwNHRqMnJwamxmZmVxeDFxIn0.oB7ArqzMqQEcPnD69k_wyQ";
  var map = new Mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [90.3893259, 23.7573822],
    zoom: 6.0,
  });

  map.on("load", function () {
    debugger;
    map.loadImage(
      "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
      // Add an image to use as a custom marker
      function (error, image) {
        if (error) throw error;
        map.addImage("custom-marker", image);

        map.addSource("places", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: featuresData,
          },
        });

        map.addLayer({
          id: "places",
          type: "symbol",
          source: "places",
          layout: {
            "icon-image": "custom-marker",
            "icon-allow-overlap": true,
          },
        });
      }
    );

    // Create a popup, but don't add it to the map yet.
    var popup = new Mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });
    map.on("mouseenter", "places", function (e) {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = "pointer";

      var coordinates = e.features[0].geometry.coordinates.slice();
      var description = e.features[0].properties.description;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });
    map.on("mouseleave", "places", function () {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });
  });
}
