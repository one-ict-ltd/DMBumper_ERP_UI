import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ElementRef,
  ViewChild,
  Input,
} from "@angular/core";
// import { FormControl } from "@angular/forms";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { take } from "rxjs/operators";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";

import * as XLSX from "xlsx-js-style";

@Component({
  selector: "ngx-sales-report-nationally",
  templateUrl: "./sales-report-nationally.component.html",
  styleUrls: ["./sales-report-nationally.component.scss"],
})
export class SalesReportNationallyComponent implements OnInit {
  @ViewChild("simple_tableData") tableSales: ElementRef;
  @ViewChild("simple_tableData", { static: false }) TABLE: ElementRef;
  @Input() subReportId: string = '';

  // @ViewChild('simple_tableCollection') tableCal: ElementRef;
  // @ViewChild('simple_tableReturn') tableRtn: ElementRef;
  // @ViewChild('simple_tableDue') tableDue: ElementRef;
  //date = new Date().getFullYear();
  fromdateSelected = new Date();
  todateSelected = new Date();
  reportTypeSelected: any = {};
  reportPeriodSelected: any = {};
  reportNameSelected: any = {};
  territorySelected: any = {};
  masterReportSelected: any = {};
  areaSelected: any = {};
  regionSelected: any = {};
  reportMasterId = 0;
  reportTypeList: any[] = [
    { id: "All", name: "All" },
    { id: "zone", name: "SM" },
    { id: "Region", name: "RSM" },
    { id: "area", name: "AM" },
    { id: "territory", name: "MIO" },
  ];

  reportTypes: any[] = [];
  reportPeriodList: any[] = [
    { id: 1, name: "YTD" },
    { id: 2, name: "MTD" },
    { id: 3, name: "Day" },
  ];
  filePath: string = '';

  // [
  //   { id: "monthlyTotalSales", name: "MIO/AM/RSM/NAT Total Sales Trend" },
  //   {
  //     id: "salesTrendByProductValue",
  //     name: "MIO/AM/RSM/NAT Sales Trend By Product [Value]",
  //   },
  //   {
  //     id: "salesTrendByProductUnit",
  //     name: "MIO/AM/RSM/NAT Sales Trend By Product [Unit]",
  //   },
  //   {
  //     id: "salesOutstandingChemist",
  //     name: "MIO/AM/RSM/NAT Sales Outstanding [Chemist]",
  //   },
  //   {
  //     id: "salesOutstandingInstitution",
  //     name: "MIO/AM/RSM/NAT Sales Outstanding [Institution/Clinic]",
  //   },
  //   {
  //     id: "productWiseSalesTrendValue",
  //     name: "National Product Wise Sales Trend  [Value]",
  //   },
  //   {
  //     id: "productWiseSalesTrendUnit",
  //     name: "National Product Wise Sales Trend  [Unit]",
  //   },
  //   {
  //     id: "nationalPerformanceByProduct",
  //     name: "National Performance By Product [Value]",
  //   },
  //   {
  //     id: "nationalPerformanceByFFTotal",
  //     name: "National Performance By MIO/AM/RSM/NAT [Total]",
  //   },
  //   { id: "customerWiseSalesTrend", name: "Customer Wise Sales Trend" },
  //   {
  //     id: "customerWiseSalesTrendByProductValue",
  //     name: "Customer Wise Sales Trend By Product (Value)",
  //   },
  //   {
  //     id: "customerWiseSalesTrendByProductUnit",
  //     name: "Customer Wise Sales Trend By Product (UNIT)",
  //   },
  //   {
  //     id: "customerWiseOutstandingChemist",
  //     name: "Customer Wise Outstanding Chemist",
  //   },
  //   {
  //     id: "customerWiseOutstandingInstitution",
  //     name: "Customer Wise Outstanding Institution/Clinic",
  //   },
  // ];

  mioType: any = "";
  mioTypeSelected: any = {};
  mioTypeList: any[] = [
    { id: "All", name: "All" },
    { id: "Existing", name: "Existing" },
    { id: "Separated", name: "Separated" },
  ];

  reportNameList: any[];
  territoryList: any[];
  masterReportList: any[];
  areaList: any[];
  regionList: any[];
  regionCode: string = "";
  regionName: string = "";
  zoneCode: string = "";
  zoneName: string = "";
  areaCode: string = "";
  areaName: string = "";
  territoryCode: string = "";
  territoryName: string = "";
  reportType: string = "";
  reportTypeName: string = "";
  reportName: string = "";
  reportPeriod: string = "";
  colspan: number = 3;
  showArea: boolean = false;
  showTerritory: boolean = false;

  pageNavigation = '';
  public tableHeaderP = [];
  public tableHeaderPP = [];

  apiUrl = "";
  bodyData: any = [];
  bodyDataCollection: any = [];
  bodyDataPayment: any = [];
  params = [];

  parties = [];
  branchs = [];
  companyId: number = 0;

  showbody: boolean = false;
  isPreview: boolean = false;
  partySelected: any;
  branchSelected: any;
  productSpecList = [];
  productSelected = {};
  productWiseSpecificationId: number = 0;
  //productName: string = '';
  TotalReceived = 0;
  TotalPayment = 0;
  fDate: Date;
  tDate: Date;

  showDateRange: boolean = false;

  userProfile: any[];
  companyName: string;
  companyAlias: string;
  isExcel: boolean = false;
  valreportType:string="";

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private salesinvoiceService: SalesinvoiceService,
    private sanitizer: DomSanitizer,
    private productrequisitionService: ProductrequisitionService,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private salesInvoiceService: SalesinvoiceService
  ) {
    this.fDate = new Date(); //(this.commonService.GetAnyMonthAndDateOfYear(12, 1));
    this.tDate = new Date();
    this.getAllDropdown();
    this.reportTypes = this.reportTypeList;
    this.mioType = "All";
    this.mioTypeSelected = {
      id: this.mioTypeList[0].id,
      name: this.mioTypeList[0].name,
    };

    //debugger
    this.userProfile = commonService.GetUserProfileJson();
    //this.companyName = this.userProfile[0].uc[0].companyName.replace(' (AH)', '');
    this.companyName = this.userProfile[0].uc[0].companyName;
    this.companyAlias = this.userProfile[0].uc[0].aliasName;
    this.InitDropDownSettings()
    this.isExcel = false;

  }

  ngOnInit(): void {
    if (this.subReportId != '') {
      this.getAllSubReport(this.subReportId);
    }
    this.pageNavigation = this.subReportId === '' ? "Nationally Sales Report" : this.subReportId === '1' ? "National Reports"
      : this.subReportId === '2' ? "FFs Reports" : this.subReportId === '3' ? "Customer Reports" : this.subReportId === '6' ? "PMD Reports" : "Update FFs";
    this.cdRef.detectChanges();
  }

  public RptButtonAction() {
    debugger
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      if (this.isnationalPerformanceByProductReport||this.isnationalPerformanceByFFTotalReport|| this.isMIONationalPerformanceByProductReport || this.isAMNationalPerformanceByProductReport || this.isRSMNationalPerformanceByProductReport|| this.isSMNationalPerformanceByProductReport) {
        this.generateCrReport("pdf");
      }
      else {
        //this.download();
        this.getExcelFile();
        //this.downloadFile(this.filePath, '');
      }
      //this.ExportTOExcel(this.reportTitleName);
    } else if (clicked == "print") {
      if (this.isnationalPerformanceByProductReport||this.isnationalPerformanceByFFTotalReport||this.isMIONationalPerformanceByProductReport || this.isAMNationalPerformanceByProductReport || this.isRSMNationalPerformanceByProductReport|| this.isSMNationalPerformanceByProductReport) {
        this.generateCrReport("pdf");
      }
      else {
        //this.download();
        this.getExcelFile();
        //this.downloadFile(this.filePath, '');
      }
      //this.ExportTOExcel(this.reportTitleName);
    } else if (clicked == "csv") {
      //this.onExportCSV();
      //this.generateCrReport("Excel");
      if (this.isMIONationalPerformanceByProductReport || this.isAMNationalPerformanceByProductReport || this.isRSMNationalPerformanceByProductReport|| this.isSMNationalPerformanceByProductReport|| this.isnationalPerformanceByFFTotalReport|| this.isnationalPerformanceByProductReport) {
        this.generateCrReport("Excel");
      }
      else {
        //this.download();
        this.getExcelFile();
        //this.downloadFile(this.filePath, '');
      }
      //this.ExportTOExcel(this.reportTitleName);
    } else if (clicked == "refresh") {
      this.onRefresh();
    } else if (clicked == "email") {
      this.onEmail();
    } else {
      this.toastrService.warning("Message", "please clicked any button");
    }
  }


  generateCrReport(reportFormat: any) {
    debugger
    // if (
    //   this.reportType == undefined ||
    //   this.reportType == null ||
    //   this.reportType == ""
    // ) {
    //   this.toastrService.warning("Please Select Report Type", "Warning");
    //   return false;
    // }
    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    // this.apiUrl = `SalesInvoiceReport/GetNationalSalesPerformance?userId=${userInfo[0].employeeid
    //   }&reportName=${this.reportName}&reportTypeName=${this.reportType}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode}&areaCode=${this.areaCode}&territoryCode=${this.territoryCode}&fDate=${this.commonService.DateFormat(
    //     this.fDate
    //   )}&tDate=${this.commonService.DateFormat(
    //     this.tDate
    //   )}&productWiseSpecificationId=${this.productWiseSpecificationId}
    // &reportPeriod=${this.reportPeriod}`;



    this.apiUrl = `SalesInvoiceReport/GetNationalSalesPerformance?userId=${userInfo[0].employeeid}&reportName=${this.reportName}&reportTypeName=${this.reportType}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode}&areaCode=${this.areaCode}&territoryCode=${this.territoryCode}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(
      this.tDate
    )}&productWiseSpecificationId=${this.productWiseSpecificationId}&reportFormat=${reportFormat}`;

    this.apiUrl = `SalesInvoiceReport/GetNationalSalesPerformance?userId=${userInfo[0].employeeid}&reportName=${this.reportName}&reportTypeName=${this.reportTypeName}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode}&areaCode=${this.areaCode}&territoryCode=${this.territoryCode}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(
      this.tDate
    )}&productWiseSpecificationId=${this.productWiseSpecificationId}&reportFormat=${reportFormat}`;

    this.commonService
      .GetCrystalReportData(this.apiUrl)
      .subscribe((returns: any) => {
        let res = JSON.parse(returns);
        if (res.status) {
          this.commonService.GenerateBase64ToReport(res.data[0].data);
        } else {
          this.toastrService.warning("Message", this.commonService.nodatafound);
        }
      });
  }

  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Customer Name",
      leftValue: this.partySelected.name,
    });
  }

  public onCheckboxChange(e) {
    if (e.target.checked) {
      this.showDateRange = true;
    } else {
      this.showDateRange = false;
    }
  }

  public getAllDropdown() {
    this.getAllProduct();
    this.getAllReport();
    this.GetAllZone()
    // this.getAllSubReport();
  }
  public getAllProduct() {
    this.productrequisitionService
      .getAllProductForRequisition()
      .pipe(take(1))
      .subscribe((returns: any) => {
        this.productSpecList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uomId: val.uomId,
          uomName: val.uomName,
          productId: val.productId,
          price: val.price,
        }));
      });
  }

  public productChange(event: any) {
    this.productWiseSpecificationId = 0;
    this.productName = "";
    if (event) {
      this.productName = event.name;
      this.productWiseSpecificationId = event.id;
    }
  }

  zoneList: any[];
  zoneSelected = {};
  public async GetAllZone() {
    debugger
    this.zoneSelected = {};

    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetZone`;
    const returns = await this.commonService.getApiData(this.apiUrl).toPromise()
    if (returns.success) {
      this.zoneList = returns.data.map((val: any) => ({
        id: val.ZoneCode,
        name: val.ZoneName,
      }));
      if (this.zoneList.length == 1) {
        this.zoneSelected = {
          id: this.zoneList[0].id,
          name: this.zoneList[0].name,
        };
        this.zoneCode = this.zoneList[0].id;
        this.GetAllRegion(this.zoneCode);
      }

      //this.InitDropDownSettings();
      //}
    }
    // .subscribe((returns: any) => {
    //   if (returns.success) {
    //     this.zoneList = returns.data.map((val: any) => ({
    //       id: val.ZoneCode,
    //       name: val.ZoneName,
    //     }));

    //     //if (this.zoneList.length > 0) {
    //     if (this.zoneList.length == 1) {
    //       this.zoneSelected = {
    //         id: this.zoneList[0].id,
    //         name: this.zoneList[0].name,
    //       };
    //       this.zoneCode = this.zoneList[0].id;
    //       this.GetAllRegion(this.zoneCode);
    //     }
    //     //}
    //   }
    // });
  }

  async InitDropDownSettings() {
    debugger
    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetUsersByUserName`;
    let userInfo: any = await this.commonService.getApiData(this.apiUrl).toPromise();
    if (userInfo.success) {
      const user: any = userInfo.data[0];
      if (user && user.POSTING_LOCATION == 'Z') {
        let zone = this.zoneList.filter(x => x.id == user.ZoneCode)[0];
        this.zoneList = this.zoneList.filter(x => x.id == user.ZoneCode);
        if (zone) {
          this.zoneSelected = {
            id: zone.id,
            name: zone.name,
          };
          this.zoneCode = zone.id;
          this.GetAllRegion(this.zoneCode);
        }
      }
      else if (user && user.POSTING_LOCATION == 'D') {
        let zone = this.zoneList.filter(x => x.id
          == user.ZoneCode)[0];
        if (zone) {
          this.zoneSelected = {
            id: zone.id,
            name: zone.name,
          };
          this.zoneCode = zone.id;
          this.GetAllRegion(this.zoneCode);
        }
      }

    }
  }

  GetAllRegion(zoneCode: any = "") {
    this.regionList = [];
    this.regionCode = "";
    this.regionSelected = {};
    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetRegion?zoneCode=${zoneCode}`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.regionList = returns.data.map((val: any) => ({
          id: val.RegionCode,
          name: val.RegionName,
        }));
      }
    });
  }

  getAllSubReport(reportMasterId: any = "") {
    debugger
    this.reportNameList = [];
    this.reportName = "";
    this.reportNameSelected = {};
    this.apiUrl = "";
    this.apiUrl = `SalesNational/GetReportDetails?dmsReportMasterId=${reportMasterId}`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {

        this.reportNameList = returns.data.map((val: any) => ({
          id: val.reportValue,
          name: val.reportName,
          reportType: val.reportType
        }));
      }
    });
  }

  getAllArea(regionCode: string = "") {
    debugger
    this.areaList = [];
    this.areaSelected = {};
    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetAreaForNationalSalesReport?regionCode=${regionCode}`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.areaList = returns.data.map((val: any) => ({
          id: val.AreaCode,
          name: val.AreaName,
        }));
      }
    });
  }

  getAllTerritory(areaCode: string = "") {
    this.territoryList = [];
    this.territorySelected = {};
    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetTerritory?areaCode=${areaCode}`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.territoryList = returns.data.map((val: any) => ({
          id: val.TerritoryCode,
          name: val.TerritoryName,
        }));
      }
    });
  }

  getAllReport() {
    this.masterReportList = [];
    this.masterReportSelected = {};
    this.apiUrl = "";
    this.apiUrl = `SalesNational/GetReportsName?reportMasterId=0`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.masterReportList = returns.data.map((val: any) => ({
          id: val.reportMasterId,
          name: val.masterReportName,
        }));
      }
    });
  }
  public partyList = [];
  public GetAllPartysByTypeId(partyTypeId: any) {
    this.comboService
      .GetAllPartysByTypeId(partyTypeId)
      .subscribe((returns: any) => {
        this.parties = returns.data.map((val: any) => ({
          id: val.partyId,
          name: val.partyName,
          address: val.address,
          mobileNo: val.mobileNo,
          territoryDetails: val.territoryDetails,
        }));
      });
  }
  public isShowTerritory: boolean = true;
  public isShowArea: boolean = true;
  public isShowZone: boolean = true;
  public isShowRegion: boolean = true;

  public isShowProduct: boolean = true;
  public isProductMandatory: boolean = false;
  public isShowReportType: boolean = true;
  public isShowFromDate: boolean = true;
  public isShowToDate: boolean = true;
  public isMIONationalPerformanceByProductReport: boolean = false;
  public isnationalPerformanceByProductReport: boolean = false;
  public isnationalPerformanceByFFTotalReport: boolean = false;
  public isAMNationalPerformanceByProductReport: boolean = false;
  public isRSMNationalPerformanceByProductReport: boolean = false;
  public isSMNationalPerformanceByProductReport: boolean = false;

  public isShowReportPeriod: boolean = true;
  public reportTitleName: string = "";
  public productName: string = "";
  public zone: string = "";
  public region: string = "";
  public territory: string = "";
  public dateRange: string = "Period- ";
  public reportChange(event: any) {
    this.onRefreshTable();
    //debugger;
    this.reportName = "";
    this.isShowProduct = false;
    this.isShowReportType = false;
    this.isProductMandatory = false;
    this.isnationalPerformanceByFFTotalReport = false;
    this.isnationalPerformanceByProductReport = false;

    this.productSelected = {}
    this.productName = ""
    this.productWiseSpecificationId = 0
    this.isShowReportPeriod = true;

    if (event) {
      this.reportName = event.id;
      this.reportTitleName = this.reportNameSelected["name"];
      debugger
      if (event.reportType) {
        this.reportTypes = this.reportTypeList.filter(x => x.id == event.reportType)
        this.valreportType = event.reportType
        this.reportTypeSelected = {}
        if (this.reportTypes.length == 1) {
          this.reportTypeSelected = { id: this.reportTypes[0].id, name: this.reportTypes[0].name }
          this.reportType = this.reportTypes[0].id
        }

      } else {
        // this.reportTypeSelected = {}
        this.reportTypes = this.reportTypeList;
      }
debugger;
      if (event.id == "monthlyTotalSales" || event.id == "salesOutstandingChemist" ||
        event.id == "MIOOutStandingTrendValue" || event.id == "monthlyTotalCollection" ||
        event.id == "ffDetailjoin" || event.id == "ffDetaildrop" ||
        event.id == "ffDetail" || event.id == "monthlyTotalSalesA"
        || event.id == "monthlyTotalSalesAR" || event.id == "monthlyTotalSalesInNumber" ||
        event.id == "monthlyTotalSalesCheNumber" || event.id == "salesOutstandingInstitution" ||
        event.id == "monthlyTotalSalesARD"
      ) {
        this.isShowReportType = true;
      } else if (
        event.id == "salesTrendByProductValue" ||
        event.id == "salesTrendByProductUnit"
      ) {
        this.isShowProduct = true;
        // this.isProductMandatory = true;
        this.isShowReportType = true;
       
      }
      else if (
        // event.id == "nationalPerformanceByProduct" ||
        // event.id == "nationalPerformanceByFFTotal" ||
         event.id == "salesTrendByProductValueDaily" || event.id == "salesTrendByProductUnitDaily"
      ) {
        this.isShowReportType = true;
        this.isShowProduct = true;
      }
      else if (
        event.id == "productWiseMIOSalesTrendValue" || event.id == "productWiseMIOSalesTrendUnit"
      ) {
        this.isShowReportType = true;
        //this.isShowProduct = true;
      }
      else if (
        event.id == "productWiseSalesTrendValue" ||
        event.id == "productWiseSalesTrendUnit"
      ) {
        this.isShowReportType = true;
        this.isShowProduct = true;

        if(this.valreportType=="zone")
          {
            this.isShowZone=true;
            this.isShowTerritory = false;
            this.isShowArea = false;
            this.isShowRegion=false;
  
          }
          else  if(this.valreportType=="Region")
            {
              this.isShowZone=true;
              this.isShowTerritory = false;
              this.isShowArea = false;
              this.isShowRegion=true;
    
            }
            else  if(this.valreportType=="area")
              {
                this.isShowZone=true;
                this.isShowTerritory = false;
                this.isShowArea = true;
                this.isShowRegion=true;
      
              }
              else  if(this.valreportType=="territory")
                {
                  this.isShowZone=true;
                  this.isShowTerritory = true;
                  this.isShowArea = true;
                  this.isShowRegion=true;
        
                }
  
        //this.isProductMandatory = true;
      } else if (
        event.id == "customerWiseSalesTrendByProductValue" ||
        event.id == "customerWiseSalesTrendByProductUnit"
      ) {
        this.isShowProduct = true;
        //this.isProductMandatory = true;
      }
      else if (
        event.id == "MIONationalPerformanceByProduct"
      ) {
        this.isShowProduct = false;
        this.isShowReportPeriod = false;
        this.isMIONationalPerformanceByProductReport = true;
        this.isShowTerritory = true;
        this.isShowArea = true;
        this.isShowRegion=true;
        this.isShowZone=true;

        //this.isProductMandatory = true;
      }
      else if (
        event.id == "nationalPerformanceByProduct"
      ) {
        this.isShowProduct = false;
        this.isShowReportPeriod = false;
        this.isnationalPerformanceByProductReport = true;

        //this.isProductMandatory = true;
      }
      else if (
        event.id == "nationalPerformanceByFFTotal"
      ) {
        this.isShowProduct = false;
        this.isShowReportPeriod = false;
        this.isnationalPerformanceByFFTotalReport = true;

        //this.isProductMandatory = true;
      }
      else if (
        event.id == "AMNationalPerformanceByProduct"
      ) {
        this.isShowProduct = false;
        this.isShowReportPeriod = false;
        this.isMIONationalPerformanceByProductReport = false;
        this.isAMNationalPerformanceByProductReport = true;
        this.isShowTerritory = false;
        this.isShowArea = true;
        this.isShowRegion=true;
        this.isShowZone=true;

        //this.isProductMandatory = true; RSMNationalPerformanceByProduct
      }
      else if (
        event.id == "RSMNationalPerformanceByProduct"
      ) {
        this.isShowProduct = false;
        this.isShowReportPeriod = false;
        this.isMIONationalPerformanceByProductReport = false;
        this.isAMNationalPerformanceByProductReport = false;
        this.isRSMNationalPerformanceByProductReport = true;
        this.isShowTerritory = false;
        this.isShowArea = false;
        this.isShowRegion=true;
        this.isShowZone=true;

        //this.isProductMandatory = true; RSMNationalPerformanceByProduct
      }
      else if (
        event.id == "SMNationalPerformanceByProduct"
      ) {
        this.isShowProduct = false;
        this.isShowReportPeriod = false;
        this.isMIONationalPerformanceByProductReport = false;
        this.isAMNationalPerformanceByProductReport = false;
        this.isRSMNationalPerformanceByProductReport = false;
        this.isSMNationalPerformanceByProductReport = true;
        this.isShowTerritory = false;
        this.isShowArea = false;
        this.isShowRegion=false;
        this.isShowZone=false;

        //this.isProductMandatory = true; RSMNationalPerformanceByProduct
      }
      // else if (
      //   event.id == "Mon_Short_depot"
      // ) {
      //   this.isShowProduct = false;
      //   this.isShowReportPeriod = false;
      //   this.isMIONationalPerformanceByProductReport = false;
      //   this.isShowTerritory = false;
      //   this.isShowArea = false;
      //   this.isShowRegion=false;
      //   this.isShowFromDate=false;
      //   this.isShowZone=false;
        

      //   //this.isProductMandatory = true;
      // }


      if (event.id == "ffDetailjoin" || event.id == "ffDetaildrop" || event.id == "ffDetail") {
        this.isShowReportPeriod = false;
      }
    }
  }
  public reportTypeChange(event: any) {
    //this.onRefreshTable();
    debugger;

    this.isShowTerritory = true;
    this.isShowArea = true;
    this.isShowRegion = true;
    if (event) {
      this.reportType = event.id;
      // alert(event.id);

    }

    if (this.reportType == "Region") {
      this.isShowTerritory = false;
      this.isShowArea = false;
      this.areaCode = null;
      this.territoryCode = null;
      this.territorySelected["id"] = "";
      this.areaSelected["id"] = "";

    }
    else if (this.reportType == "area") {

      this.isShowTerritory = false;
      this.territoryCode = null;
      this.territorySelected["id"] = "";

    }
    else {

      this.isShowTerritory = true;
      this.isShowArea = true;
      this.isShowRegion = true;

    }
  }

  _openingBalance = 0.0;

  _totalSalesCashTP = 0.0;
  _totalSalesCreditTP = 0.0;
  _totalSalesTP = 0.0;

  _totalSalesCash = 0.0;
  _totalSalesCredit = 0.0;
  _totalSales = 0.0;

  _totalReturnCash = 0.0;
  _totalReturnCredit = 0.0;
  _ttlReturnAmount = 0.0;
  _netSalesAmount = 0.0;
  _totalCollectionCash = 0.0;
  _totalCollectionCredit = 0.0;
  _ttlCollectionAmount = 0.0;
  _adjustedAmount = 0.0;
  _closingBalance = 0.0;

  partyId = 0;

  totalInvoice = 0;

  private onRefresh() {
    // this.partySelected = null;
    // //this.branchSelected = null;
    // this.fromdateSelected = new Date();
    // this.todateSelected = new Date();
    // //this.companyId = 0;
    // this.bodyData = [];
    // //this.bodyDataCollection = [];
    // //this.bodyDataPayment = [];
    // this.showbody = false;
    window.location.reload();
  }

  private onRefreshTable() {
    this.showbody = false;
    this.isPreview = false;
    this.bodyData = [];
    this.tableHeaderP = [];
    this.tableHeaderPP = [];
  }

  private onPreview() {
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      if (this.checkReportingCriteria()) {
        this.getReportData();
      }
      //this.GetPreviewData();
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }

  }
  checkReportingCriteria(): boolean {
    debugger;
    if (
      this.reportName == undefined ||
      this.reportName == null ||
      this.reportName == ""
    ) {
      this.toastrService.warning("Please Select Report Name", "Warning");
      return false;
    }
    if (this.isShowReportType) {
      if (
        this.reportType == undefined ||
        this.reportType == null ||
        this.reportType == ""
      ) {
        this.toastrService.warning("Please Select Report Type", "Warning");
        return false;
      }
    }

    if (this.isProductMandatory) {
      if (this.isEmpty(this.productSelected)) {
        this.toastrService.warning("Please Select Product", "Warning");
        return false;
      }
    }
    if (this.isMIONationalPerformanceByProductReport) {
      if (this.isEmpty(this.territorySelected)) {
        this.toastrService.warning("Please Select territory", "Warning");
        return false;
      }
    }
    if (this.isAMNationalPerformanceByProductReport) {
      if (this.isEmpty(this.areaSelected)) {
        this.toastrService.warning("Please Select area", "Warning");
        return false;
      }
    }
    if (this.isRSMNationalPerformanceByProductReport) {
      if (this.isEmpty(this.regionSelected)) {
        this.toastrService.warning("Please Select region", "Warning");
        return false;
      }
    }
    if (this.isSMNationalPerformanceByProductReport) {
      if (this.isEmpty(this.zoneSelected)) {
        this.toastrService.warning("Please Select Zone", "Warning");
        return false;
      }
    }
    return true;
  }

  public zoneChange(event: any) {
    this.zone = "";
    if (event) {
      this.zone = event.name;
    }
  }

  public areaChange(event: any) {
    debugger;
    this.areaName = "";
    if (event) {
      this.areaName = event.name;
    }
  }

  public territoryChange(event: any) {
    this.territory = "";
    if (event) {
      this.territory = event.name;
    }
  }

  public regionChange(event: any) {
    this.region = "";
    if (event) {
      this.region = event.name;
    }
  }

  public isEmpty(obj: Record<string, any>): boolean {
    return Object.keys(obj).length === 0;
  }

  getReportData2(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.dateRange = "";

      this.showbody = false;
      this.isPreview = true;
      this.bodyData = [];
      this.tableHeaderP = [];
      this.tableHeaderPP = [];

      this.reportName = "";
      this.reportType = "ALL";
      this.zoneCode = "";
      this.regionCode = "";
      this.areaCode = "";
      this.territoryCode = "";
      this.productWiseSpecificationId = 0;

      if (!this.isEmpty(this.reportNameSelected)) {
        this.reportName = this.reportNameSelected["id"];
      }
      if (!this.isEmpty(this.reportTypeSelected)) {
        this.reportType = this.reportTypeSelected["id"];
      }
      if (!this.isEmpty(this.reportPeriodSelected)) {
        this.reportPeriod = this.reportPeriodSelected["id"];
      }
      if (!this.isEmpty(this.zoneSelected)) {
        this.zoneCode = this.zoneSelected["id"];
      }
      if (!this.isEmpty(this.regionSelected)) {
        this.regionCode = this.regionSelected["id"];
      }
      if (!this.isEmpty(this.areaSelected)) {
        this.areaCode = this.areaSelected["id"];
      }
      if (!this.isEmpty(this.territorySelected)) {
        this.territoryCode = this.territorySelected["id"];
      }
      if (!this.isEmpty(this.masterReportSelected)) {
        this.reportMasterId = this.masterReportSelected["id"];
      }
      if (!this.isEmpty(this.productSelected)) {
        this.productWiseSpecificationId = this.productSelected["id"];
      }

      this.dateRange =
        "Period- " +
        this.commonService.GetMonthAndYear(this.fDate) +
        " To " +
        this.commonService.GetMonthAndYear(this.tDate);

      //this.setParam();
      // this.apiUrl = `AccountReport/getRptCostCentreWiseReport?companyId=${this.reportTypeSelected.id}&sbuId=${this.branchSelected.id}&costCentreId=${costCentreId}&costCostCentreLocationId=${costCentreLocationId}&costCentreCategoryId=${costCentreCategoryId}&ledgerId=${ledgerId}&natureId=${natureId}&groupId=${groupId}&fromDate=${this.fromdateSelected.toString().substring(3, 15)}&toDate=${this.todateSelected
      //   .toString().substring(3, 15)}`;
      //debugger;
      this.apiUrl = "";
      this.apiUrl = `SalesInvoice/GetSalesReportNationally?reportName=${this.reportName
        }&reportType=${this.reportType}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode
        }&areaCode=${this.areaCode}&territoryCode=${this.territoryCode
        }&fDate=${this.commonService.DateFormat(
          this.fDate
        )}&tDate=${this.commonService.DateFormat(
          this.tDate
        )}&productWiseSpecificationId=${this.productWiseSpecificationId}
    &reportPeriod=${this.reportPeriod}`;
      // GetSalesReportNationally(string reportName, string reportType, string zoneCode, string regionCode, string areaCode, string territoryCode, DateTime? fDate, DateTime? tDate, int? productWiseSpecificationId)
      this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
        if (returns.success) {
          if (returns.data.length > 0) {
            console.log('returns.data: ', returns.data);
            var i = 0;
            for (var property in returns.data[0]) {
              //  debugger
              if (property != "SL") {
                this.tableHeaderPP.push(property);
                this.tableHeaderP.push(property);
                i = i + 1;
              }
            }
            setTimeout(() => {
              // Update your table with the fetched data
              // Example: this.tableData = fetchedData;
              this.bodyData = returns.data;
              resolve();
            }, 500);
          }

          //   console.log(this.bodyData);
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
    });
  }

  getReportDataForExcel(): Promise<void> {
    debugger
    return new Promise((resolve, reject) => {
      this.dateRange = "";

      this.showbody = false;
      this.isPreview = true;
      this.bodyData = [];
      this.tableHeaderP = [];
      this.tableHeaderPP = [];

      this.reportName = "";
      this.reportType = "ALL";

      this.zoneCode = "";
      this.regionCode = "";
      this.areaCode = "";
      this.territoryCode = "";
      this.productWiseSpecificationId = 0;

      if (!this.isEmpty(this.reportNameSelected)) {
        this.reportName = this.reportNameSelected["id"];
      }
      if (!this.isEmpty(this.reportTypeSelected)) {
        this.reportType = this.reportTypeSelected["id"];
      }
      if (!this.isEmpty(this.reportTypeSelected)) {
        this.reportTypeName = this.reportTypeSelected["name"];
      }
      if (!this.isEmpty(this.reportPeriodSelected)) {
        this.reportPeriod = this.reportPeriodSelected["id"];
      }
      if (!this.isEmpty(this.zoneSelected)) {
        this.zoneCode = this.zoneSelected["id"];

      }
      if (!this.isEmpty(this.regionSelected)) {
        this.regionCode = this.regionSelected["id"];

      }
      if (!this.isEmpty(this.areaSelected)) {
        this.areaCode = this.areaSelected["id"];
      }
      if (!this.isEmpty(this.territorySelected)) {
        this.territoryCode = this.territorySelected["id"];

      }
      if (!this.isEmpty(this.masterReportSelected)) {
        this.reportMasterId = this.masterReportSelected["id"];
      }
      if (!this.isEmpty(this.productSelected)) {
        this.productWiseSpecificationId = this.productSelected["id"];
        //this.productName = this.productSelected == (undefined || null) ? '' : this.productSelected["name"];
      }

      this.dateRange =
        "Period- " +
        this.commonService.GetMonthAndYear(this.fDate) +
        " To " +
        this.commonService.GetMonthAndYear(this.tDate);

      //this.setParam();
      // this.apiUrl = `AccountReport/getRptCostCentreWiseReport?companyId=${this.reportTypeSelected.id}&sbuId=${this.branchSelected.id}&costCentreId=${costCentreId}&costCostCentreLocationId=${costCentreLocationId}&costCentreCategoryId=${costCentreCategoryId}&ledgerId=${ledgerId}&natureId=${natureId}&groupId=${groupId}&fromDate=${this.fromdateSelected.toString().substring(3, 15)}&toDate=${this.todateSelected
      //   .toString().substring(3, 15)}`;
      //debugger;
      this.apiUrl = "";
      this.apiUrl = `SalesInvoice/GetSalesReportNationallyExcelOnly?reportName=${this.reportName
        }&reportType=${this.reportType}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode
        }&areaCode=${this.areaCode}&territoryCode=${this.territoryCode
        }&fDate=${this.commonService.DateFormat(
          this.fDate
        )}&tDate=${this.commonService.DateFormat(
          this.tDate
        )}&productWiseSpecificationId=${this.productWiseSpecificationId}
    &reportPeriod=${this.reportPeriod}&reportTypeName=${this.reportTitleName}&zoneName=${this.zone}&regionName=${this.region}&territoryName=${this.territory}&area=${this.areaName}&productName=${this.productName}`;
      // GetSalesReportNationally(string reportName, string reportType, string zoneCode, string regionCode, string areaCode, string territoryCode, DateTime? fDate, DateTime? tDate, int? productWiseSpecificationId)
      // this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      //   console.log('returns.success: ', returns);
      //   if (returns.success) {
      //     debugger
      //     console.log('returns.success: ', returns);
      //     if (returns.data.length > 0) {
      //       // 
      //       setTimeout(() => {
      //         //this.bodyData = returns.data;
      //         resolve();
      //       }, 500);
      //     }

      //     //   console.log(this.bodyData);
      //   } else {
      //     this.toastrService.danger("Message", this.commonService.nodatafound);
      //   }
      // });
      this.commonService.getReportDataForDirectFile(this.apiUrl).subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.reportTitleName}_report.xlsx`; // Adjust the filename as needed
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, error => {
        console.error('Error downloading the file', error);
      });
    });
  }

  private getReportData() {
    this.dateRange = "";

    this.showbody = true;
    this.isPreview = true;
    this.bodyData = [];
    this.tableHeaderP = [];
    this.tableHeaderPP = [];

    this.reportName = "";
    this.reportType = "ALL";
    this.zoneCode = "";
    this.regionCode = "";
    this.areaCode = "";
    this.territoryCode = "";
    this.productWiseSpecificationId = 0;

    if (!this.isEmpty(this.reportNameSelected)) {
      this.reportName = this.reportNameSelected["id"];
    }
    if (!this.isEmpty(this.reportTypeSelected)) {
      this.reportType = this.reportTypeSelected["id"];
    }
    if (!this.isEmpty(this.reportPeriodSelected)) {
      this.reportPeriod = this.reportPeriodSelected["id"];
    }
    if (!this.isEmpty(this.zoneSelected)) {
      this.zoneCode = this.zoneSelected["id"];
    }
    if (!this.isEmpty(this.regionSelected)) {
      this.regionCode = this.regionSelected["id"];
    }
    if (!this.isEmpty(this.areaSelected)) {
      this.areaCode = this.areaSelected["id"];
    }
    if (!this.isEmpty(this.territorySelected)) {
      this.territoryCode = this.territorySelected["id"];
    }
    if (!this.isEmpty(this.masterReportSelected)) {
      this.reportMasterId = this.masterReportSelected["id"];
    }
    if (!this.isEmpty(this.productSelected)) {
      this.productWiseSpecificationId = this.productSelected["id"];
    }

    this.dateRange =
      "Period- " +
      this.commonService.GetMonthAndYear(this.fDate) +
      " To " +
      this.commonService.GetMonthAndYear(this.tDate);

    //this.setParam();
    // this.apiUrl = `AccountReport/getRptCostCentreWiseReport?companyId=${this.reportTypeSelected.id}&sbuId=${this.branchSelected.id}&costCentreId=${costCentreId}&costCostCentreLocationId=${costCentreLocationId}&costCentreCategoryId=${costCentreCategoryId}&ledgerId=${ledgerId}&natureId=${natureId}&groupId=${groupId}&fromDate=${this.fromdateSelected.toString().substring(3, 15)}&toDate=${this.todateSelected
    //   .toString().substring(3, 15)}`;
    //debugger;
    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetSalesReportNationally?reportName=${this.reportName
      }&reportType=${this.reportType}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode
      }&areaCode=${this.areaCode}&territoryCode=${this.territoryCode
      }&fDate=${this.commonService.DateFormat(
        this.fDate
      )}&tDate=${this.commonService.DateFormat(
        this.tDate
      )}&productWiseSpecificationId=${this.productWiseSpecificationId}
    &reportPeriod=${this.reportPeriod}`;
    // GetSalesReportNationally(string reportName, string reportType, string zoneCode, string regionCode, string areaCode, string territoryCode, DateTime? fDate, DateTime? tDate, int? productWiseSpecificationId)
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        if (returns.data.length > 0) {
          debugger;
          //console.log('returns.data: ', returns.data);
          var i = 0;
          for (var property in returns.data[0]) {
            //  debugger
            if (property != "SL") {
              this.tableHeaderPP.push(property);
              this.tableHeaderP.push(property);
              i = i + 1;
            }
          }
          this.bodyData = returns.data;
        }

        //   console.log(this.bodyData);
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  base64Pdf: any;
  private GetPreviewData() {
    if (
      this.reportType == undefined ||
      this.reportType == null ||
      this.reportType == ""
    ) {
      this.toastrService.warning("Please Select Report Type", "Warning");
      return false;
    }
    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `SalesInvoiceReport/GetZoneRegionWiseSalesCollectionBalance?reportFormat=Pdf&userId=${userInfo[0].employeeid
      }&zoneCode=${this.zoneCode}&regionCode=${this.regionCode}&areaCode=${this.areaCode
      }&territoryCode=${this.territoryCode}&fDate=${this.commonService.DateFormat(
        this.fDate
      )}&tDate=${this.commonService.DateFormat(this.tDate)}&type=${this.reportType
      }&mioType=${this.mioType}&reportPeriod=${this.reportPeriod}`;

    debugger;
    this.commonService
      .GetCrystalReportData(this.apiUrl)
      .subscribe((returns: any) => {
        let res = JSON.parse(returns);
        //console.log(res);
        if (res.status) {
          this.base64Pdf = this.sanitizer.bypassSecurityTrustResourceUrl(
            res.data[0].data
          );
          //this.commonService.GenerateBase64ToReport(returns);
        } else {
          console.log(res.message);
          this.toastrService.warning("Message", this.commonService.nodatafound);
        }
      });
  }

  changeTypeWiseView() {
    switch (this.reportType) {
      case "region":
        this.showTerritory = false;
        this.showArea = false;
        this.colspan = 3;
        break;
      case "area":
        this.showTerritory = false;
        this.showArea = true;
        this.colspan = 4;
        break;
      case "territory":
        this.showTerritory = true;
        this.showArea = true;
        this.colspan = 5;
        break;
      default:
        this.showTerritory = false;
        this.showArea = false;
        this.colspan = 3;
        break;
    }
  }
  setDateRangeHide(reportName: string) {
    debugger
    if (reportName === 'ffDetail' && (this.subReportId === '4' || this.subReportId === '')) {
      this.isShowFromDate = false;
      this.isShowToDate = false;
    }
    else if (reportName === 'Mon_Short_depot') {
      this.isShowFromDate = false;
      this.isShowToDate = true;
      this.isShowProduct = false;
      this.isShowReportPeriod = false;
      this.isMIONationalPerformanceByProductReport = false;
      this.isShowTerritory = false;
      this.isShowArea = false;
      this.isShowRegion=false;
    
      this.isShowZone=false;
      
    }
    else if (reportName === 'Expiry_Short_depot') {
      this.isShowFromDate = true;
      this.isShowToDate = true;
      this.isShowProduct = false;
      this.isShowReportPeriod = false;
      this.isMIONationalPerformanceByProductReport = false;
      this.isShowTerritory = false;
      this.isShowArea = false;
      this.isShowRegion=false;
    
      this.isShowZone=false;
      
    }
    else {
      this.isShowFromDate = true;
      this.isShowToDate = true;
    }


  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  currencyFormatter(currency) {
    return this.commonService.roundWithDecimalPoint(currency, 0);
  }

  downloadOld() {
    if (!this.isPreview) {
      this.toastrService.warning("Message", "Please preview the data.");
      return;
    }
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Table");
    const data = [];
    let table;
    let reportTitleName = "table.csv";
    if (this.showbody) {
      table = this.tableSales.nativeElement;
    }
    if (this.reportName) {
      reportTitleName = this.reportNameSelected["name"] + ".csv";
    }

    for (let i = 0; i < table.rows.length; i++) {
      const row = table.rows[i];
      const record = [];
      for (let j = 0; j < row.cells.length; j++) {
        // const computedStyle = window.getComputedStyle(row.cells[j].innerHTML);
        //  const backgroundColor = computedStyle.getPropertyValue('background-color');
        // console.log(backgroundColor)
        // if (backgroundColor) {
        //     excelRow.getCell(excelRow.cellCount).fill = {
        //         type: 'pattern',
        //         pattern: 'solid',
        //         fgColor: { argb: this.rgbToArgb(backgroundColor) },
        //     };
        // }
        record.push(row.cells[j].innerHTML);
      }
      data.push(record);
    }
    sheet.addRows(data);
    //   debugger
    workbook.csv.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "text/csv;charset=utf-8;" });
      FileSaver.saveAs(blob, reportTitleName);
    });
  }

  async getExcelFile() {
    if (this.checkReportingCriteria()) {
      await this.getReportDataForExcel();
      //this.downloadFile();
    }
    else return false;
  }

  async download() {
    debugger
    if (this.checkReportingCriteria()) {
      await this.getReportData2();
      setTimeout(() => {
        this.showbody = false;
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Table");
        const table = this.tableSales.nativeElement;
        const rows = table.querySelectorAll("tr");

        rows.forEach((row) => {
          const excelRow = sheet.addRow([]);
          const cells = row.querySelectorAll("td");
          let rowNo = excelRow.cellCount + 1;

          cells.forEach((cell) => {
            const cellValue = cell.textContent || "";
            excelRow.getCell(rowNo + excelRow.cellCount).value = cellValue; // Set cell value
          });

          // Manually set the background color based on your CSS class
          if (row.classList.contains("highlighted-row-sl-1")) {
            excelRow.eachCell((cell) => {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "ffffffff" }, // Set your desired background color
              };
            });
          } else if (row.classList.contains("highlighted-row-sl-2")) {
            excelRow.eachCell((cell) => {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "ff3cadda" }, // Set your desired background color
              };
            });
          } else if (row.classList.contains("highlighted-row-sl-3")) {
            excelRow.eachCell((cell) => {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "ffa4b6a4" }, // Set your desired background color
              };
            });
          } else if (row.classList.contains("highlighted-row-sl-4")) {
            excelRow.eachCell((cell) => {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "b256f1a9" }, // Set your desired background color
              };
            });
          }


        });
        //const reportTitleName = this.reportName ? `${this.reportTitleName}.csv` : 'table.csv';
        const reportTitleName = this.reportName
          ? `${this.reportTitleName}.xlsx`
          : "table.xlsx";

        workbook.xlsx.writeBuffer().then((buffer) => {
          //const blob = new Blob([buffer], { type: 'text/csv;charset=utf-8;' });
          const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          FileSaver.saveAs(blob, reportTitleName);
          this.isExcel = false;
        });
      }, 500);

    } else return false;
    //this.onPreview();


  }

  //title = 'Excel';
  // async download() {
  //   if (this.checkReportingCriteria()) {
  //     await this.getReportData2();

  //     const chunkSize = 1000; // Define the size of each chunk
  //     const rowsData = this.bodyData; // Your method to retrieve the full data array
  //     const totalChunks = Math.ceil(rowsData.length / chunkSize);

  //     const workbook = new ExcelJS.Workbook();
  //     const sheet = workbook.addWorksheet("Table");

  //     for (let i = 0; i < totalChunks; i++) {
  //       const chunk = rowsData.slice(i * chunkSize, (i + 1) * chunkSize);
  //       this.processChunk(chunk, sheet); // Process and add each chunk to the sheet

  //       // Optional: Add a delay to prevent blocking the UI
  //       await this.delay(100);
  //     }

  //     const reportTitleName = this.reportName
  //       ? `${this.reportTitleName}.xlsx`
  //       : "table.xlsx";

  //     const buffer = await workbook.xlsx.writeBuffer();
  //     const blob = new Blob([buffer], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });
  //     FileSaver.saveAs(blob, reportTitleName);
  //     this.isExcel = false;
  //   } else {
  //     return false;
  //   }
  // }

  processChunk(chunk: any[], sheet: ExcelJS.Worksheet) {
    chunk.forEach((row: any) => {
      const excelRow = sheet.addRow([]);

      row.forEach((cell: string, cellIndex: number) => {
        excelRow.getCell(cellIndex + 1).value = cell;
      });

      // Apply any necessary styling here
    });
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  ExportTOExcel(fileName: string) {
    //debugger;
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.TABLE.nativeElement
    );

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    fileName = fileName + ".xlsx";
    XLSX.writeFile(wb, fileName);
  }

  // Helper function to convert RGB to ARGB
  rgbToArgb(rgb) {
    const match = rgb.match(/rgb\((\d+), (\d+), (\d+)\)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      return `FF${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    }
    return null;
  }

  downloadFile(): void {
    this.salesInvoiceService.downloadSalesReportNationallyDynamicReportFile().subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'report.xlsx'; // Adjust the filename as needed
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error downloading the file', error);
    });
  }




}
