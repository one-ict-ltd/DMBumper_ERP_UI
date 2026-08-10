import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup, NgForm } from "@angular/forms";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { CommoncomboService } from "app/services/commoncombo.service";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { ElementRef } from "@angular/core";
import * as CanvasJS from "../../../../../assets/js/canvasjs.min";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: "ngx-fftdashboard",
  templateUrl: "./fftdashboard.component.html",
  styleUrls: ["./fftdashboard.component.scss"],
})
export class FftdashboardComponent implements OnInit {
  public apiUrl = "";
  public apiUrl2 = "";
  public bodyDataInvoice: any = [];
  public bodyDataCollection: any = [];

  public apiUrlLogInOutList = "";
  public bodyDataLogOutList: any = [];

  public todayTotalInvoice = 0;
  public todayVisitedDoctor = 0;
  public todayVisitedCustomer = 0;
  public todayTotalCollection = 0;
  public totalDoctor = 0;
  public totalCustomer = 0;
  public totalLoggedOut = 0;
  public totalLoggedIn = 0;
  public totalNotLocation = 0;
  public labelTest = "";

  //For Report
  public pageNavigation = "Accounting Dashboard";
  public pageNavigationreport = "Voucher Preview";
  public tableHeader = [
    "#",
    "Account Name",
    "Party Name",
    "Cost Centre Name",
    "Debit (Tk)",
    "Credit (Tk)",
  ];
  private gridApi;
  private gridColumnApi;

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public params = [];
  public bodyData: any = [];
  public TDR = 0;
  public TCR = 0;
  public AmountInWord = "";
  public Narration = "";
  public VoucherNo = "";
  public VoucherDate = "";
  public voucherTypeName = "";

  public ZONE_CODEList: [];
  public DEPOT_CODEList: [];
  public REGION_CODEList: [];
  public AREA_CODEList: [];
  public TERRITORY_CODEList: [];
  public userIdList: [];

  public ZONE_CODESelected: {};
  public DEPOT_CODESelected: {};
  public REGION_CODESelected: {};
  public AREA_CODESelected: {};
  public TERRITORY_CODESelected: {};
  public userIdSelected: {};

  public master: {
    DateT: Date;
    ZONE_CODE: string;
    DEPOT_CODE: string;
    REGION_CODE: string;
    AREA_CODE: string;
    TERRITORY_CODE: string;
    userId: string;
  };

  public getMaster() {
    this.master = {
      DateT: new Date(),
      ZONE_CODE: "",
      DEPOT_CODE: "",
      REGION_CODE: "",
      AREA_CODE: "",
      TERRITORY_CODE: "",
      userId: "",
    };
  }
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  constructor(
    private http: HttpClient,
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private comboService: CommoncomboService
  ) {
    this.getDashboardInfo();

    // this.commonService.valueSet('showlist');
    // this.columnDefs = [
    //   {
    //     headerName: "#",
    //     colId: "rowNum",
    //     valueGetter: "node.rowIndex + 1",
    //     pinned: "left",
    //     filter: false,
    //     width: 70,
    //   }, /// Dont Change
    //   {
    //     headerName: "Employee",
    //     field: "EMP_ID",
    //     filter: "agTextColumnFilter",
    //   },
    //   {
    //     headerName: "Location",
    //     field: "ZoneName",
    //     filter: "agTextColumnFilter",
    //   },
    //   {
    //     headerName: "Time",
    //     field: "Date",
    //     filter: "agTextColumnFilter",
    //   },
    //   {
    //     field: "action",
    //     cellRenderer: "btnCellRenderer",
    //     cellRendererParams: {
    //       clicked: function (field: any) {
    //         //localStorage.setItem("Token", user.auth_token);
    //         localStorage.setItem("button", field);
    //       },
    //     },
    //     minWidth: 250,
    //     editable: false,
    //     pinned: "right",
    //   },
    // ];
    // this.frameworkComponents = {
    //   btnCellRenderer: BtnCellRenderer,
    // };
    // this.defaultColDef = {
    //   sortable: true,
    //   resizable: true,
    //   filter: true,
    //   editable: true,
    // };
  }

  public getDashboardInfo() {
    //debugger;
    this.apiUrl = `Report/GetFFTDashboardData`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      this.todayTotalInvoice = returns.todayTotalInvoice;
      this.todayTotalCollection = returns.todayTotalCollection;

      this.todayVisitedDoctor = returns.todayVisitedDoctor;
      this.todayVisitedCustomer = returns.todayVisitedCustomer;

      this.totalDoctor = returns.totalDoctor;
      this.totalCustomer = returns.totalCustomer;

      this.totalLoggedOut = returns.totalLoggedOut;
      this.totalLoggedIn = returns.totalLoggedIn;
      this.totalNotLocation = returns.totalNotLocation;

      //this.rowData = returns.data;
    });
  }

  public getLogOutList(dialog: TemplateRef<any>) {
    this.apiUrlLogInOutList = `Report/GetOutData`;
    this.commonService
      .getReportData(this.apiUrlLogInOutList)
      .subscribe((data: any) => {
        this.openWithDataObjModel(dialog);
        this.bodyDataLogOutList = data.data;
        this.labelTest = "Logged Out Employee's";
      });
  }

  public getLogInList(dialog: TemplateRef<any>) {
    this.apiUrlLogInOutList = `Report/GetLoginData`;
    this.commonService
      .getReportData(this.apiUrlLogInOutList)
      .subscribe((data: any) => {
        this.openWithDataObjModel(dialog);
        this.bodyDataLogOutList = data.data;
        this.labelTest = "Logged In Employee's";
      });
  }

  public getNotLocation(dialog: TemplateRef<any>) {
    this.apiUrlLogInOutList = `Report/GetNotLocationData`;
    this.commonService
      .getReportData(this.apiUrlLogInOutList)
      .subscribe((data: any) => {
        this.openWithDataObjModel(dialog);
        this.bodyDataLogOutList = data.data;
        this.labelTest = "Location Not Found Employee's";
      });
  }

  //////////  Open Modal

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

  names: any;

  openWithDataModel() {
    this.dialogService
      .open(DialogNamePromptComponent)
      .onClose.subscribe((name) => name && this.names.push(name));
  }

  public openWithDataObjModel(dialog: TemplateRef<any>) {
    //debugger;
    this.dialogService.open(dialog, {
      context: this.data,
    });
  }

  /////////   End Modal

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  // onGridReady(params) {
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;

  //   // this.currencyService.getCurrency().subscribe((data: any) => {
  //   //   //debugger;
  //   //   if (data.success) {
  //   //     this.rowData = data.data;
  //   //   }
  //   // });
  // }

  ngOnInit(): void {
    this.apiUrl2 = `Report/GetFFTDashboardDataBarChart`;
    this.commonService.getReportData(this.apiUrl2).subscribe((returns: any) => {
      for (var i = 0; i < returns.data.length; i++) {
        this.bodyDataInvoice.push({
          label: returns.data[i].date,
          y: returns.data[i].invoiceAmount,
        });
        this.bodyDataCollection.push({
          label: returns.data[i].date,
          y: returns.data[i].collectionAmount,
        });
      }

      let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "Invoice/Collection of Month",
        },
        axisY: {
          title: "Invoice/day",
          max: 120000,
          titleFontColor: "#4F81BC",
          lineColor: "#4F81BC",
          labelFontColor: "#4F81BC",
          tickColor: "#4F81BC",
        },
        axisY2: {
          title: "Collection/day",
          max: 120000,
          titleFontColor: "#C0504E",
          lineColor: "#C0504E",
          labelFontColor: "#C0504E",
          tickColor: "#C0504E",
        },
        toolTip: {
          shared: true,
        },
        legend: {
          cursor: "pointer",
          itemclick: toggleDataSeries,
        },
        data: [
          {
            type: "column",
            name: "Invoice",
            max: 120000,
            legendText: "Invoice",
            showInLegend: true,
            dataPoints: this.bodyDataInvoice,
          },
          {
            type: "column",
            name: "Collection",
            max: 120000,
            legendText: "Collection",
            axisYType: "secondary",
            showInLegend: true,
            dataPoints: this.bodyDataCollection,
          },
        ],
      });
      chart.render();
      function toggleDataSeries(e) {
        if (
          typeof e.dataSeries.visible === "undefined" ||
          e.dataSeries.visible
        ) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        chart.render();
      }
    });
  }
}
