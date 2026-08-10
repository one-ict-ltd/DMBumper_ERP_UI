import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
} from "@angular/core";
// import { FormControl } from "@angular/forms";
import { NbToastrService } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { take } from "rxjs/operators";


import * as XLSX from "xlsx-js-style";

import {
  FormBuilder,
} from "@angular/forms";
@Component({
  selector: "ngx-national-performance-report",
  templateUrl: "./national-performance-report.component.html",
  styleUrls: ["./national-performance-report.component.scss"],
})
export class NationalPerformanceReportComponent implements OnInit {

  fromdateSelected = new Date();
  todateSelected = new Date();
  reportTypeSelected: any = {};
  reportNameSelected: any = {};
  territorySelected: any = {};
  areaSelected: any = {};
  regionSelected: any = {};

  reportTypeList: any[] = [
    { id: "zone", name: "Zone" },
    { id: "region", name: "Region" },
    { id: "area", name: "Area" },
    { id: "territory", name: "Territory" },
    { id: "depot", name: "Depot" },
  ];

  reportNameList: any[] = [
    {
      id: "NationalPerformanceByMIO_AM_RSM_NAT",
      name: "National Performance By MIO / AM / RSM / NAT [Total]",
    },
    {
      id: "NationalPerformanceByProduct",
      name: "National Performance By Product [Value]",
    },
    {
      id: "MIOproductWiseSalesTrendValueunit",
      name: "Product Wise Sales Report Of MIO/AM/RSM/SM",
    },
    {
      id: "ProductWiseMIOReport",
      name: "MIO/AM/RSM/SM Wise Product Wise Performance Monitoring Report",
    },
    {
      id: "NationalSalesPerformanceMonitoring",
      name: "National Sales Performance Monitoring Report MIO/AM/RSM/NAT",
    },
    {
      id: "NationalCollectionPerformanceMonitoring",
      name: "National Collection Performance Monitoring Report MIO/AM/RSM/NAT",
    },
  ];

  mioType: any = "";
  mioTypeSelected: any = {};
  mioTypeList: any[] = [
    { id: "All", name: "All" },
    { id: "Existing", name: "Existing" },
    { id: "Separated", name: "Separated" },
  ];

  territoryList: any[];
  areaList: any[];
  regionList: any[];
  regionCode: string = "";
  zoneCode: string = "";
  areaCode: string = "";
  territoryCode: string = "";
  reportType: string = "";
  reportTypeName: string = "";
  reportName: string = "";
  colspan: number = 3;
  showArea: boolean = false;
  showTerritory: boolean = false;
  lastTwoDigitsOfReportYear: string = "";

  pageNavigation = "National Performance Report";
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
  TotalReceived = 0;
  TotalPayment = 0;
  fDate: Date;
  tDate: Date;

  showDateRange: boolean = false;

  userProfile: any[];
  companyName: string;
  companyAlias: string;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private salesinvoiceService: SalesinvoiceService,
    private sanitizer: DomSanitizer,
    private productrequisitionService: ProductrequisitionService,
    private formBuilder: FormBuilder
  ) {
    this.fDate = new Date(); //(this.commonService.GetAnyMonthAndDateOfYear(12, 1));
    this.tDate = new Date();
    this.getAllDropdown();
    this.mioType = "All";
    this.mioTypeSelected = {
      id: this.mioTypeList[0].id,
      name: this.mioTypeList[0].name,
    };
    this.userProfile = commonService.GetUserProfileJson();
    //this.companyName = this.userProfile[0].uc[0].companyName.replace(' (AH)', '');
    this.companyName = this.userProfile[0].uc[0].companyName;
    this.companyAlias = this.userProfile[0].uc[0].aliasName;
    //console.log(this.companyName, ': ' + this.companyAlias);

    this.isNationalPerformance = false;
    this.isNationalPerformanceByProduct = false;
    this.isSalesPerformance = false;
    this.isNationalSalesPerformanceMonitoring = false;
  }

  ngOnInit(): void { }
  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.bodyData = [];
      this.onPreview();
    } else if (clicked == "pdf") {
      // if (this.reportName == 'NationalPerformanceByMIO_AM_RSM_NAT')
      //   this.generateCrReport("Pdf");
      // else
      //   this.exportToPDF(this.reportTitleName)

      this.generateCrReport("Pdf");
    } else if (clicked == "print") {
      // if (this.reportName == 'NationalPerformanceByMIO_AM_RSM_NAT')
      //   this.generateCrReport("Pdf");
      // else
      //   this.exportToPDF(this.reportTitleName)

      this.generateCrReport("Pdf");
    } else if (clicked == "csv") {
      // if (this.reportName == 'NationalPerformanceByMIO_AM_RSM_NAT')
      //   this.generateCrReport("Excel");
      // else
      //   this.ExportTOExcel(this.reportTitleName);

      this.generateCrReport("Excel");
    } else if (clicked == "refresh") {
      this.onRefresh();
    } else if (clicked == "email") {
      this.onEmail();
    } else {
      this.toastrService.warning("Access denied", "Message");
    }
  }

  generateCrReport(reportFormat: any) {
    // obsolete

    if (
      (this.reportType == undefined ||
        this.reportType == null ||
        this.reportType == "") && this.reportName != "MIOproductWiseSalesTrendValueunit"
    ) {
      this.toastrService.warning("Please Select Report Type", "Warning");
      return false;
    }

    if (this.isProductMandatory) {
      if (this.isEmpty(this.productSelected)) {
        this.toastrService.warning("Please Select Product", "Warning");
        return false;
      }
    }
    this.reportTypeName = this.reportTypeSelected["name"];
    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();

    console.log(this.fDate);

    this.apiUrl = `SalesInvoice/GetNationalSalesPerformance?reportName=${this.reportName
      }&reportTypeName=${this.reportTypeName}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode
      }&areaCode=${this.areaCode}&territoryCode=${this.territoryCode
      }&fDate=${this.commonService.DateFormat(
        this.fDate
      )}&tDate=${this.commonService.DateFormat(
        this.fDate
      )}&productWiseSpecificationId=${this.productWiseSpecificationId}&'pdf'`;;


    //New: 20-Feb-2024 MOSTAFA
    this.apiUrl = `SalesInvoiceReport/GetNationalSalesPerformance?userId=${userInfo[0].employeeid}&reportName=${this.reportName}&reportTypeName=${this.reportTypeName}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode}&areaCode=${this.areaCode}&territoryCode=${this.territoryCode}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(
      this.fDate
    )}&productWiseSpecificationId=${this.productWiseSpecificationId}&reportFormat=${reportFormat}`;


    this.commonService
      .GetCrystalReportData(this.apiUrl)
      .subscribe((returns: any) => {
        console.log(returns);
        let res = JSON.parse(returns);
        console.log(res);
        if (res.status && res.data[0].data != "") {
          this.commonService.GenerateBase64ToReport(res.data[0].data);
        } else {
          this.toastrService.warning( this.commonService.nodatafound,"Message");
        }
      });
  }

  public setParam() {
    // obsolete
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
    this.GetAllZone();
    this.getAllProduct();
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
    debugger;
    this.territory = "";
    this.officerName = "";

    if (event) {
      this.territory = event.name;
      this.officerName = event.officerName;
    }
    else {
      this.territoryCode = "";
      this.territorySelected = {};
    }
  }

  public regionChange(event: any) {
    this.region = "";
    if (event) {
      this.region = event.name;
    }
  }

  zoneList: any[];
  zoneSelected = {};
  public GetAllZone() {
    this.zoneSelected = {};

    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetZone`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.zoneList = returns.data.map((val: any) => ({
          id: val.ZoneCode,
          name: val.ZoneName,
        }));

        //if (this.zoneList.length > 0) {
        // if (this.zoneList.length == 1) {
        //   this.zoneSelected = {
        //     id: this.zoneList[0].id,
        //     name: this.zoneList[0].name,
        //   };
        //   this.zoneCode = this.zoneList[0].id;
        //   this.GetAllRegion(this.zoneCode);
        // }
        //}
      }
    });
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

  getAllArea(regionCode: string = "") {
    this.areaList = [];
    this.areaSelected = {};
    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetArea?regionCode=${regionCode}`;
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
    this.officerName = "N/A";
    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetTerritory?areaCode=${areaCode}`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.territoryList = returns.data.map((val: any) => ({
          id: val.TerritoryCode,
          name: val.TerritoryName,
          officerName: val.officerName,
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

  public isShowProduct: boolean = true;
  public isProductMandatory: boolean = false;
  public isShowReportType: boolean = true;
  public isNationalPerformance: boolean = true;
  public isNationalPerformanceByProduct: boolean = true;
  public isSalesPerformance: boolean = true;
  public isProductWiseMIO: boolean = true;
  public isNationalSalesPerformanceMonitoring: boolean = true;
  public isNationalCollectionPerformanceMonitoring: boolean = true;

  public reportTitleName: string = "";
  public productName: string = "";
  public zone: string = "";
  public region: string = "";
  public areaName: string = "";
  public territory: string = "";
  public officerName: string = "";
  public dateRange: string = "As on- ";

  public reportChange(event: any) {
    this.onRefreshTable();
    debugger;
    this.reportName = "";
    this.isShowProduct = false;
    //this.isShowReportType = false;
    this.isProductMandatory = false;

    this.isNationalPerformance = false;
    this.isSalesPerformance = false;
    this.isProductWiseMIO = false;
    this.isNationalPerformanceByProduct = false;
    this.isNationalSalesPerformanceMonitoring = false;
    this.isNationalCollectionPerformanceMonitoring = false;
    //this.reportNameSelected = null;
    this.reportTitleName = "";

    if (event) {
      this.reportName = event.id;
      this.reportTitleName = this.reportNameSelected["name"];
      if (event.id == "NationalPerformanceByMIO_AM_RSM_NAT") {
        this.isShowReportType = true;
        this.isNationalPerformance = true;
        this.isNationalPerformanceByProduct = false;
        this.isSalesPerformance = false;
        this.isProductWiseMIO = false;
        this.isNationalSalesPerformanceMonitoring = false;
        this.isNationalCollectionPerformanceMonitoring = false;
        this.reportTypeList= [
          { id: "zone", name: "Zone" },
          { id: "region", name: "Region" },
          { id: "area", name: "Area" },
          { id: "territory", name: "Territory" },
          
        ];
      } else if (
        event.id == "NationalPerformanceByProduct" 
      ) {
        this.isShowProduct = true;
        //this.isProductMandatory = true;
        this.isShowReportType = true;
        this.isNationalPerformance = false;
        this.isNationalPerformanceByProduct = true;
        this.isSalesPerformance = false;
        this.isProductWiseMIO = false;
        this.isNationalSalesPerformanceMonitoring = false;
        this.isNationalCollectionPerformanceMonitoring = false;
        this.reportTypeList= [
          { id: "zone", name: "Zone" },
          { id: "region", name: "Region" },
          { id: "area", name: "Area" },
          { id: "territory", name: "Territory" },
         
        ];
      } else if (
        event.id == "MIOproductWiseSalesTrendValueunit"
      ) {
        this.isShowProduct = false;
        this.isShowReportType = false;
        this.isNationalPerformance = false;
        this.isNationalPerformanceByProduct = false;
        this.isSalesPerformance = true;
        this.isProductWiseMIO = false;
        this.isNationalSalesPerformanceMonitoring = false;
        this.isNationalCollectionPerformanceMonitoring = false;
        this.reportTypeList= [
          { id: "zone", name: "Zone" },
          { id: "region", name: "Region" },
          { id: "area", name: "Area" },
          { id: "territory", name: "Territory" },
         
        ];
      } else if (
        event.id == "ProductWiseMIOReport"
      ) {
        this.isShowProduct = true;
        this.isShowReportType = true;
        this.isNationalPerformance = false;
        this.isNationalPerformanceByProduct = false;
        this.isSalesPerformance = false;
        this.isProductWiseMIO = true;
        this.isNationalSalesPerformanceMonitoring = false;
        this.isNationalCollectionPerformanceMonitoring = false;
        this.reportTypeList= [
          { id: "zone", name: "Zone" },
          { id: "region", name: "Region" },
          { id: "area", name: "Area" },
          { id: "territory", name: "Territory" },
        
        ];
      }
      else if (
        event.id == "NationalSalesPerformanceMonitoring"
      ) {
        this.isShowProduct = true;
        this.isShowReportType = true;
        this.isNationalPerformance = false;
        this.isNationalPerformanceByProduct = false;
        this.isSalesPerformance = false;
        this.isProductWiseMIO = false;
        this.isNationalSalesPerformanceMonitoring = true;
        this.isNationalCollectionPerformanceMonitoring = false;
        this.isShowProduct = false;
        this.reportTypeList= [
          { id: "zone", name: "Zone" },
          { id: "region", name: "Region" },
          { id: "area", name: "Area" },
          { id: "territory", name: "Territory" },
          { id: "depot", name: "Depot" },
        ];
      }
      else if (
        event.id == "NationalCollectionPerformanceMonitoring"
      ) {
        this.isShowProduct = true;
        this.isShowReportType = true;
        this.isNationalPerformance = false;
        this.isNationalPerformanceByProduct = false;
        this.isSalesPerformance = false;
        this.isProductWiseMIO = false;
        this.isNationalSalesPerformanceMonitoring = false;
        this.isNationalCollectionPerformanceMonitoring = true;
        this.isShowProduct = false;
        this.reportTypeList= [
          { id: "zone", name: "Zone" },
          { id: "region", name: "Region" },
          { id: "area", name: "Area" },
          { id: "territory", name: "Territory" },
          { id: "depot", name: "Depot" },
        ];
      }

      // else if (event.id == "nationalPerformanceByProduct" || event.id == "nationalPerformanceByFFTotal") {
      //   this.isShowReportType = true;
      //   this.isShowProduct = true;
      // }
      // else if (event.id == "productWiseSalesTrendValue" || event.id == "productWiseSalesTrendUnit") {
      //   this.isShowReportType = true;
      //   this.isShowProduct = true;
      //   this.isProductMandatory = true;
      // }
      // else if (event.id == "customerWiseSalesTrendByProductValue" || event.id == "customerWiseSalesTrendByProductUnit") {
      //   this.isShowProduct = true;
      //   this.isProductMandatory = true;
      // }
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
    if (
      this.reportName == undefined ||
      this.reportName == null ||
      this.reportName == ""
    ) {
      this.toastrService.warning("Please Select Report Name", "Warning");
      return false;
    }
    // if (this.isShowReportType) {
    //   if (
    //     this.reportType == undefined ||
    //     this.reportType == null ||
    //     this.reportType == ""
    //   ) {
    //     this.toastrService.warning("Please Select Report Type", "Warning");
    //     return false;
    //   }
    // }

    if (this.isProductMandatory) {
      if (this.isEmpty(this.productSelected)) {
        this.toastrService.warning("Please Select Product", "Warning");
        return false;
      }
    }

    this.getReportData();
  }

  public isEmpty(obj: Record<string, any>): boolean {
    return Object.keys(obj).length === 0;
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
    this.reportTypeName = "All";
    this.zoneCode = "";
    this.regionCode = "";
    this.areaCode = "";
    this.territoryCode = "";
    this.productWiseSpecificationId = 0;
    this.lastTwoDigitsOfReportYear = this.fDate.getFullYear().toString().substr(-2);

    if (!this.isEmpty(this.reportNameSelected)) {
      this.reportName = this.reportNameSelected["id"];
    }
    if (!this.isEmpty(this.reportTypeSelected)) {
      this.reportType = this.reportTypeSelected["id"];
      this.reportTypeName = this.reportTypeSelected["name"];
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
    if (!this.isEmpty(this.productSelected)) {
      this.productWiseSpecificationId = this.productSelected["id"];
    }

    let fDate = this.commonService.GetMonthAndYear(this.fDate);
    let tDate = this.commonService.GetMonthAndYear(this.tDate);

    if (fDate == tDate) {
      this.dateRange =
        "As on: " +
        this.commonService.DateFormat(this.fDate, "dd-MMM-yyyy");
      // +" To " +
      // this.commonService.DateFormat(this.tDate, "dd-MMM-yyyy");
    } else {
      this.dateRange =
        "A on: " +
        this.commonService.GetMonthAndYear(this.fDate);
      //  +" To " +
      // this.commonService.GetMonthAndYear(this.tDate);
    }
    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetNationalSalesPerformance?reportName=${this.reportName
      }&reportType=${this.reportType}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode
      }&areaCode=${this.areaCode}&territoryCode=${this.territoryCode
      }&fDate=${this.commonService.DateFormat(
        this.fDate
      )}&tDate=${this.commonService.DateFormat(
        this.fDate
      )}&productWiseSpecificationId=${this.productWiseSpecificationId}`;

    if (this.isNationalPerformanceByProduct)
      this.tableHeaderP = [
        "Code",
        "Name",
        "Pack Size",
        "Budget",
        "Sales",
        "Budget",
        "Sales",
        "Ach. %",
       // "Growth %",
        "Budget",
        "Sales",
        "Budget",
        "Sales",
        "Ach. %",
        "Growth %",
      ];
    else if (this.isNationalPerformance)
      this.tableHeaderP = [
        "SL",
        "Name Of Employee",
        "Sales Code",
        "Territory/Area/Region/Zone Name",
        //"Designation",
        "Cash",
        "Credit",
        "Total",
        "Cash",
        "Credit",
        "Total",
        "Cash",
        "Credit",
        "Total",
        "Today",
        "MTD",
        "Today",
        "MTD"
      ];
    else if (this.isSalesPerformance)
      this.tableHeaderP = [
        "SL",
        "Category",
        "Code",
        "Name",
        "Pack Size",
        "Qty",
        "Value",
        "Qty",
        "Value",
        "Qty",
        "Value"
      ];
    else if (this.isProductWiseMIO)
      this.tableHeaderP = [
        "SL",
        "Code",
        "Name",
        "Designation",
        "Qty",
        "Value",
        "Qty",
        "Value",
        "Qty",
        "Value"
      ];
    else if (this.isNationalSalesPerformanceMonitoring) {
      this.tableHeaderP = [
        "CM",
        "CM TP",
        "LM",
        "LM TP",
        "CM",
        "CM TP",
        "LM",
        "LM TP",
        "CM",
        "LM",
        "CM",
        "LM",
        "CM",
        "LM",

      ];
    }
    else if (this.isNationalCollectionPerformanceMonitoring) {
      this.tableHeaderP = [
        "CM",
        "LM",
        "CM",
        "LM",
        "CM",
        "LM",
        `${this.lastTwoDigitsOfReportYear}`,
        `21-${this.lastTwoDigitsOfReportYear}`,
        "Up to 2020",
        "Total",
        "CM",
        "LM",
        "CM",
        "LM",
        "CM",
        "LM",

      ];
    }
    //console.log('this.tableHeaderP: ', this.tableHeaderP)
    /* */
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        //if (returns.data.length > 0) {
        debugger;
        var i = 0;
        for (var property in returns.data[0]) {
          if (property != "SL") {
            this.tableHeaderPP.push(property);
            //this.tableHeaderP.push(property);

          }
        }
        this.bodyData = returns.data;
        //}
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
      )}&tDate=${this.commonService.DateFormat(
        this.fDate
      )}&type=${this.reportType
      }&mioType=${this.mioType}`;

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

  private onEmail() {
    this.toastrService.warning("Access denied", "Message");
  }

  currencyFormatter(currency) {
    return this.commonService.roundWithDecimalPoint(currency, 0);
  }

  @ViewChild("simple_table", { static: false }) TABLE: ElementRef;
  //title = 'Excel';

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


  exportToPDF(fileName: string) {

  }


  exportToPDF2(excelBinaryString: string, fileName: string) {
    const excelData = new Uint8Array(
      excelBinaryString.split('').map(char => char.charCodeAt(0))
    );

    const workbook = XLSX.read(excelData, { type: 'array' });

    const sheets = workbook.SheetNames;
    sheets.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const html = XLSX.utils.sheet_to_html(worksheet);
      this.generatePDF(html, fileName.replace('.xlsx', '.pdf'));
    });
  }



  generatePDF(html: string, fileName: string) {
    const style = `
      <style>
          /* Add your CSS styles here */
      </style>
  `;

    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write('<html><head>' + style + '</head><body>' + html + '</body></html>');
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };

    setTimeout(() => {
      printWindow.close();
    }, 1000);
  }


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
}



