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
import { DatePipe } from "@angular/common";

@Component({
  selector: 'ngx-outstanding-monitor-report',
  templateUrl: './outstanding-monitor-report.component.html',
  styleUrls: ['./outstanding-monitor-report.component.scss']
})
export class OutstandingMonitorReportComponent implements OnInit {

  tDate: Date;
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
  ];

  reportNameList: any[] = [
    {
      id: "Invoice Wise Collection Report",
      name: "Invoice Wise Collection Report",
    },
    {
      id: "Outstanding Monitoring Report",
      name: "Outstanding Monitoring Report",
    },
    {
      id: "MIO Wise Outstanding Report",
      name: "MIO Wise Outstanding Report",
    },
    {
      id: "National Outstanding Monitoring Report",
      name: "National Outstanding Monitoring Report",
    },
    {
      id: "AM Product Sales",
      name: "AM Product Sales",
    },
    {
      id: "RSM Product Sales",
      name: "RSM Product Sales",
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
  reportName: string = "";
  colspan: number = 3;
  showArea: boolean = false;
  showTerritory: boolean = false;
  isDuesAmtOnly: number = 0;
  invoiceNo: string = "";

  pageNavigation = "Outstanding Monitoring Report";
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
  mioSelected = {};
  productWiseSpecificationId: number = 0;
  TotalReceived = 0;
  TotalPayment = 0;
  fDate: Date;


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
    this.isOutstandingMonitoringReport = false;
  }

  ngOnInit(): void { }
  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      // if (this.reportName == 'Invoice Wise Collection Report')
      //   this.generateCrReport("Pdf");
      // else
      //   this.exportToPDF(this.reportTitleName)

      this.generateCrReport("Pdf");
    } else if (clicked == "print") {
      // if (this.reportName == 'Invoice Wise Collection Report')
      //   this.generateCrReport("Pdf");
      // else
      //   this.exportToPDF(this.reportTitleName)

      this.generateCrReport("Pdf");
    } else if (clicked == "csv") {
      // if (this.reportName == 'Invoice Wise Collection Report')
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
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      if (
        (this.reportName == undefined ||
          this.reportName == null ||
          this.reportName == "") //&& this.reportName != "Outstanding Monitoring Report"
      ) {
        this.toastrService.warning("Please Select Report Type", "Warning");
        return false;
      }
      if (this.reportName === "AM Product Sales") {

        if (this.isEmpty(this.areaSelected)) {
          this.toastrService.warning("Please Select Area", "Warning");
          return false;
        }
      }
      if (this.reportName === "RSM Product Sales") {

        if (this.isEmpty(this.regionSelected)) {
          this.toastrService.warning("Please Select Region", "Warning");
          return false;
        }
      }

      // if (this.isProductMandatory) {
      //   if (this.isEmpty(this.productSelected)) {
      //     this.toastrService.warning("Please Select Product", "Warning");
      //     return false;
      //   }
      // }

      this.apiUrl = "";
      let userInfo = this.commonService.GetUserProfileJson();

      this.apiUrl = `SalesInvoiceReport/GetNationalOutStandingReport?userId=${userInfo[0].employeeid}&reportName=${this.reportName}&reportType=${this.reportType}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode}&areaCode=${this.areaCode}&depotCode=${this.depotCode}&territoryCode=${this.territoryCode}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&productWiseSpecificationId=${this.productWiseSpecificationId}&reportFormat=${reportFormat}&isJsonOutput=0&isDuesAmtOnly=${this.isDuesAmtOnly}&invoiceNo=${this.invoiceNo}&mioCode=${this.mioCode}`;


      this.commonService
        .GetCrystalReportData(this.apiUrl)
        .subscribe((returns: any) => {
          //console.log(returns);
          let res = JSON.parse(returns);
          console.log(res);
          debugger;
          if (res.status && res.data[0].data != "") {
            this.commonService.GenerateBase64ToReport(res.data[0].data);
          } else {
            this.toastrService.warning("Message", this.commonService.nodatafound);
          }
        });
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
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
    this.GetAllDepo();
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


  depotList: any[];
  depotSelected = {};
  depotCode = '';
  public GetAllDepo() {
    this.depotSelected = {};
    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetAllDepot`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.depotList = returns.data.map((val: any) => ({
          id: val.depotCode,
          name: val.depotName,
        }));

        //if (this.depotList.length > 0) {
        if (this.depotList.length == 1) {
          this.depotSelected = { id: this.depotList[0].id, name: this.depotList[0].name };
          this.depotCode = this.depotList[0].id;
          this.getAllTerritoryByDepot(this.depotCode);
        }
        //}
      }
    })
  }


  getAllTerritory(areaCode: string = "") {
    this.territoryList = [];
    this.territoryCode = "";
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

  mioList = [];
  mioCode: string = "";
  public GetAllMIOByTerritory() {
    debugger
    this.mioCode = "";
    //this.mioSelected = null;
    this.comboService
      .GetAllMIOByTerritory(this.territoryCode)
      .subscribe((returns: any) => {
        if (returns.status) {
          this.mioList = returns.data.map((val: any) => ({
            id: val.employeeNo,
            name: val.mioName,
          }));
        }
      });
  }
  handleUncoughtError(control: string, event: any) {
    debugger
    if (control === 'mio' && event == undefined || event == null) {
      this.mioCode = "";
    }
    else if (control === 'zone' && event == undefined || event == null) {
      this.zoneCode = "";
    }
    else if (control === 'region' && event == undefined || event == null) {
      this.regionCode = "";
    }
    else if (control === 'area' && event == undefined || event == null) {
      this.areaCode = "";
    }
    else if (control === 'territory' && event == undefined || event == null) {
      this.territoryCode = "";
    }
    else if (control === 'depot' && event == undefined || event == null) {
      this.depotCode = "";
    }
  }


  getAllTerritoryByDepot(depotCode: any = '') {
    this.territoryList = [];
    this.territoryCode = "";
    this.territorySelected = {};

    this.depot = "";
    if (depotCode) {
      this.depot = this.depotSelected["name"];
    }

    this.salesinvoiceService.GetAllTerritoryForDepot(depotCode).subscribe((returns: any) => {
      if (returns.success) {
        this.territoryList = returns.data.map((val: any) => ({
          id: val.TerritoryCode,
          name: val.TerritoryName,
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
  public isOutstandingMonitoringReport: boolean = true;
  public isMioWiseOutstandingReport: boolean = true;
  public isProductWiseMIO: boolean = true;
  public isAMProductSale: boolean = true;
  public isMioShow: boolean = false;
  public reportTitleName: string = "";
  public productName: string = "";
  public zone: string = "";
  public region: string = "";
  public areaName: string = "";
  public territory: string = "";
  public depot: string = "";
  public dateRange: string = "Period- ";

  public reportChange(event: any) {
    this.onRefreshTable();
    debugger;
    this.reportName = "";
    this.isShowProduct = false;
    //this.isShowReportType = false;
    this.isProductMandatory = false;

    this.isNationalPerformance = false;
    this.isOutstandingMonitoringReport = false;
    this.isMioWiseOutstandingReport = false;
    this.isProductWiseMIO = false;
    this.isNationalPerformanceByProduct = false;
    //this.reportNameSelected = null;
    this.reportTitleName = "";

    if (event) {
      this.reportName = event.id;
      this.reportTitleName = this.reportNameSelected["name"];
      if (event.id == "Invoice Wise Collection Report") {
        this.isShowReportType = true;
        this.isNationalPerformance = true;
        this.isNationalPerformanceByProduct = false;
        this.isOutstandingMonitoringReport = false;
        this.isProductWiseMIO = false;
        this.isMioShow = false;
      }
      else if (
        event.id == "Outstanding Monitoring Report"
      ) {
        this.isShowProduct = false;
        this.isShowReportType = false;
        this.isNationalPerformance = false;
        this.isNationalPerformanceByProduct = false;
        this.isOutstandingMonitoringReport = true;
        this.isProductWiseMIO = false;
        this.isMioShow = false;
      } else if (
        event.id == "National Outstanding Monitoring Report"
      ) {
        this.isShowProduct = true;
        this.isShowReportType = true;
        this.isNationalPerformance = false;
        this.isNationalPerformanceByProduct = false;
        this.isOutstandingMonitoringReport = false;
        this.isProductWiseMIO = true;
        this.isMioShow = false;
      }
      else if (
        event.id == "MIO Wise Outstanding Report"
      ) {
        this.isShowProduct = true;
        this.isShowReportType = true;
        this.isNationalPerformance = false;
        this.isNationalPerformanceByProduct = false;
        this.isOutstandingMonitoringReport = false;
        this.isProductWiseMIO = false;
        this.isMioShow = true;
        this.isMioWiseOutstandingReport = true;
      }
      else if (
        event.id == "AM Product Sales" || event.id == "RSM Product Sales"
      ) {
        this.isShowProduct = true;
        this.isShowReportType = true;
        this.isNationalPerformance = false;
        this.isNationalPerformanceByProduct = false;
        this.isOutstandingMonitoringReport = false;
        this.isProductWiseMIO = false;
        this.isMioShow = true;
        this.isMioWiseOutstandingReport = false;
        this.isAMProductSale = true;
      }

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
  toDate: string = null;
  private onPreview() {
    debugger;
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      if (!this.reportName
        // this.reportName == undefined ||
        // this.reportName == null ||
        // this.reportName == ""
      ) {
        this.toastrService.warning("Please Select Report Name", "Warning");
        return false;
      }

      // if (this.isProductMandatory) {
      //   if (this.isEmpty(this.productSelected)) {
      //     this.toastrService.warning("Please Select Product", "Warning");
      //     return false;
      //   }
      // }

      //this.getReportData();



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
      this.mioCode = "";

      if (!this.isEmpty(this.reportNameSelected)) {
        this.reportName = this.reportNameSelected["id"];
      }
      if (!this.isEmpty(this.reportTypeSelected)) {
        this.reportType = this.reportTypeSelected["id"];
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
      if (!this.isEmpty(this.mioSelected)) {
        this.mioCode = this.mioSelected["id"];
      }


      let fDate = this.commonService.GetMonthAndYear(this.fDate);
      let tDate = this.commonService.GetMonthAndYear(this.tDate);

      if (fDate == tDate) {
        this.dateRange =
          "Period: " +
          this.commonService.DateFormat(this.fDate, "dd-MMM-yyyy") +
          " To " +
          this.commonService.DateFormat(this.tDate, "dd-MMM-yyyy");
      } else {
        this.dateRange =
          "Period: " +
          this.commonService.GetMonthAndYear(this.fDate) +
          " To " +
          this.commonService.GetMonthAndYear(this.tDate);
      }
      this.apiUrl = "";
      this.apiUrl = `SalesInvoice/GetNationalSalesPerformance?reportName=${this.reportName
        }&reportType=${this.reportType}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode
        }&areaCode=${this.areaCode}&territoryCode=${this.territoryCode
        }&fDate=${this.commonService.DateFormat(
          this.fDate
        )}&tDate=${this.commonService.DateFormat(
          this.tDate
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
          "Growth %",
          "Budget",
          "Sales",
          "Budget",
          "Sales",
          "Ach. %",
          "Growth %",
        ];
      else if (this.isNationalPerformance)
        this.tableHeaderP = [
          // "SL",
          // "Name Of Employee",
          // "Sales Code",
          // "Territory/Area/Region/Zone Name",
          // //"Designation",
          // "Cash",
          // "Credit",
          // "Total",
          // "Cash",
          // "Credit",
          // "Total",
          // "Cash",
          // "Credit",
          // "Total",
          // "Today",
          // "MTD",
          // "Today",
          // "MTD"
        ];
      else if (this.isOutstandingMonitoringReport)
        this.tableHeaderP = [
          "Invoice No.", "Inv. Date", "Terr. Code", "Emp. No.", "MIO / AM / RSM / SM", "Party Code", "Party Name", "Party Address", "Inv. Met.", "Inv. Type", "Invoice Amnt. (TP+VAT)", "Discounts", "Sales Return (TP+VAT)", "Discount Return", "Net Value", "Collection Amount", "Gross Return", "Other Adjustment", "Total Adjustment", "Balance"
          //"InvoiceNo", "invDate", "territoryCode", "empNo", "empName", "department", "partyCode", "partyName", "partyAddress", "invMet", "invType", "invAmountTpVAT", "salesReturn", "discounts", "netValue", "totalColl", "grossReturn", "otherAdjustment", "balance"
        ];
      else if (this.isProductWiseMIO)
        this.tableHeaderP = [
          "Cash",
          "Credit",
          "Total",
          "Cash",
          "Credit",
          "Total",
          "Cash",
          "Credit",
          "Total",
          "Cash",
          "Credit",
          "Total",
          "Cash",
          "Credit",
          "Total",
          "Cash",
          "Credit",
          "Total",
          "Cash",
          "Credit",
          "Total",
          "Cash",
          "Credit",
          "Total",
          "Cash Dues",
          "Credit Dues",
          "Total Dues"
        ];



      //let userInfo = this.commonService.GetUserProfileJson();
      this.apiUrl = `SalesInvoice/GetNationalOutStandingReport?reportName=${this.reportName}&reportType=${this.reportType}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode}&areaCode=${this.areaCode}&depotCode=${this.depotCode}&territoryCode=${this.territoryCode}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&productWiseSpecificationId=${this.productWiseSpecificationId}&reportFormat=Pdf&isJsonOutput=1&isDuesAmtOnly=${this.isDuesAmtOnly}&invoiceNo=${this.invoiceNo}&mioCode=${this.mioCode}`;


      this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
        if (returns.success && returns.data != "") {
          var i = 0;
          for (var property in returns.data[0]) {
            if (property != "slNo" && property != "SL") {
              this.tableHeaderPP.push(property);
            }
          }
          this.bodyData = returns.data;

          // console.log('tableHeaderP', this.tableHeaderP);
          // console.log('tableHeaderPP', this.tableHeaderPP);
          // console.log('bodyData', this.bodyData);
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
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
    this.reportType = "";
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
        "Period: " +
        this.commonService.DateFormat(this.fDate, "dd-MMM-yyyy") +
        " To " +
        this.commonService.DateFormat(this.tDate, "dd-MMM-yyyy");
    } else {
      this.dateRange =
        "Period: " +
        this.commonService.GetMonthAndYear(this.fDate) +
        " To " +
        this.commonService.GetMonthAndYear(this.tDate);
    }
    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetNationalSalesPerformance?reportName=${this.reportName
      }&reportType=${this.reportType}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode
      }&areaCode=${this.areaCode}&territoryCode=${this.territoryCode
      }&fDate=${this.commonService.DateFormat(
        this.fDate
      )}&tDate=${this.commonService.DateFormat(
        this.tDate
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
        "Growth %",
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
    else if (this.isOutstandingMonitoringReport)
      this.tableHeaderP = [
        "Invoice No.", "Inv. Date", "Terr. Code", "Emp. No.", "MIO / AM / RSM / SM", "Department", "Party Code", "Party Name", "Party Address", "Inv. Met.", "Inv. Type", "Invoice Amnt. (TP+VAT)", "Discounts", "Sales Return", "Net Value", "Collection Amount", "Gross Return", "Other Adjustment.", "Total Adjustment", "Balance"

        //"InvoiceNo", "invDate", "territoryCode", "empNo", "empName", "department", "partyCode", "partyName", "partyAddress", "invMet", "invType", "invAmountTpVAT", "salesReturn", "discounts", "netValue", "totalColl", "grossReturn", "otherAdjustment", "balance"
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
    //console.log('this.tableHeaderP: ', this.tableHeaderP)
    /* */
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        debugger;
        var i = 0;
        for (var property in returns.data[0].data) {
          if (property != "SL") {
            this.tableHeaderPP.push(property);
          }
        }
        this.bodyData = returns.data[0].data;
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



