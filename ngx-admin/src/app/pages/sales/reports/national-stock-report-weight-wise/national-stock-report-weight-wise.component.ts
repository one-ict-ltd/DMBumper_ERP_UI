import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { DomSanitizer } from "@angular/platform-browser";
import * as XLSX from "xlsx-js-style";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";

@Component({
  selector: 'ngx-national-stock-report-weight-wise',
  templateUrl: './national-stock-report-weight-wise.component.html',
  styleUrls: ['./national-stock-report-weight-wise.component.scss']
})
export class NationalStockReportWeightWiseComponent implements OnInit {
  public reportTitleName: string = "Quantity Wise National Stock Report";
  public productName: string = "";
  companyName: string;
  public dateRange: string = "";
  @ViewChild("simple_table", { static: false }) TABLE: ElementRef;
  userProfile: any[];
  companyAlias: string;
  isPreview: boolean = false;
  public tableHeaderPP = [];

  //date = new Date().getFullYear();


  fromdateSelected = new Date();
  todateSelected = new Date();
  reportTypeSelected: any = {};
  territorySelected: any = {};
  areaSelected: any = {};
  regionSelected: any = {};

  reportTypeList: any[] = [
    { id: 'region', name: 'Region' },
    { id: 'area', name: 'Area' },
    { id: 'territory', name: 'Territory' }
  ];

  mioType: any = "";
  mioTypeSelected: any = {};
  mioTypeList: any[] = [
    { id: 'All', name: 'All' },
    { id: 'Existing', name: 'Existing' },
    { id: 'Separated', name: 'Separated' },
  ];
  productSpecSelected: any = {};
  productWiseSpecificationId: number = 0;
  territoryList: any[];
  areaList: any[];
  regionList: any[];
  regionCode: any = "";
  zoneCode: any = "";
  areaCode: any = "";
  territoryCode: any = "";
  reportType: any = "";
  colspan: number = 3;
  showArea: boolean = false;
  showTerritory: boolean = false;

  productTypeList: any[];
  productTypeSelected: {};
  productTypeName: any = "Commercial";

  pageNavigation = "National Stock Report Quantity Wise";

  apiUrl = "";
  bodyData: any = [];
  bodyDataCollection: any = [];
  bodyDataPayment: any = [];
  params = [];

  parties = [];
  branchs = [];
  companyId: number = 0;

  showbody: boolean = false;
  partySelected: any;
  branchSelected: any;

  TotalReceived = 0;
  TotalPayment = 0;
  fDate: Date;
  tDate: Date;

  showDateRange: boolean = false;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private sanitizer: DomSanitizer,
    private productrequisitionService: ProductrequisitionService
  ) {
    this.fDate = new Date(); //(this.commonService.GetAnyMonthAndDateOfYear(12, 1));
    // this.tDate = new Date(this.commonService.GetLastDateOfMonth(new Date()));
    this.getAllDropdown();
    this.mioType = "All";
    this.mioTypeSelected = { id: this.mioTypeList[0].id, name: this.mioTypeList[0].name };
    this.userProfile = commonService.GetUserProfileJson();
    this.companyName = this.userProfile[0].uc[0].companyName;

    this.productTypeList = [
      { id: 'Commercial', name: 'Commercial' },
      { id: 'Sample', name: 'Sample' },
      { id: 'Export', name: 'Export' },
    ]
    this.productTypeSelected = { id: 'Commercial', name: 'Commercial' };
  }

  ngOnInit(): void { }
  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      //this.generateReport("pdf");
      this.generateCrReport("pdf");
    } else if (clicked == "print") {
      this.generateCrReport("pdf");
    } else if (clicked == "csv") {
      //this.onExportCSV();
      //this.generateCrReport("Excel");
      this.ExportTOExcel(this.reportTitleName);
    } else if (clicked == "refresh") {
      this.onRefresh();
    } else if (clicked == "email") {
      this.onEmail();
    } else {
      this.toastrService.warning("Message", "please clicked any button");
    }
  }

  generateCrReport(reportFormat: any) {

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `SalesInvoiceReport/GetNationalStockByQtyReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&fDate=${this.commonService.DateFormat(this.fDate)}&productWiseSpecificationId=${this.productWiseSpecificationId}&productTypeName=${this.productTypeName}`;

    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }

  productSpecList = [];
  public getAllProductForRequisition() {
    this.productWiseSpecificationId = 0;
    this.productSpecSelected = null;
    this.productSpecList = [];
    this.productrequisitionService
      .getAllProductForRequisition()
      .subscribe((returns: any) => {
        this.productSpecList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uomId: val.uomId,
          uomName: val.uomName,
          productId: val.productId,
          price: val.price,
          tradePrice: val.tradePrice,
          unitVat: val.unitVat,
        }));
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
    this.GetAllZone();
    this.getAllProductForRequisition();
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
        if (this.zoneList.length == 1) {
          this.zoneSelected = { id: this.zoneList[0].id, name: this.zoneList[0].name };
          this.zoneCode = this.zoneList[0].id;
          this.GetAllRegion(this.zoneCode);
        }
        //}
      }
    })
  }

  GetAllRegion(zoneCode: any = '') {
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
  resetRegion() {
    this.regionCode = "";
    this.regionList = [];
    this.regionSelected = null;
  }


  getAllArea(regionCode: string = '') {
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

  resetArea() {
    this.areaCode = "";
    this.areaList = [];
    this.areaSelected = null;
  }


  getAllTerritory(areaCode: string = '') {
    this.territoryList = [];
    this.territorySelected = {};
    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetTerritory?areaCode=${areaCode}`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.territoryList = returns.data.map((val: any) => ({
          id: val.TerritoryCode,
          name: val.TerritoryName
        }));
      }
    });
  }

  resetTerritory() {
    this.territoryCode = "";
    this.territoryList = [];
    this.territorySelected = null;
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


  mioList = [];
  mioSelected: {};
  mioCode = "";
  // public GetAllMIOByTerritory() {
  //   this.resetMIO();
  //   this.comboService
  //     .GetAllMIOByTerritory(this.territoryCode)
  //     .subscribe((returns: any) => {
  //       if (returns.status) {
  //         debugger;
  //         this.mioList = returns.data.map((val: any) => ({
  //           id: val.employeeNo,
  //           name: val.mioName,
  //         }));
  //       }
  //     });
  // }

  resetMIO() {
    this.mioList = [];
    this.mioCode = "";
    this.mioSelected = null;
  }


  _openingBalance = 0.00;

  _totalSalesCashTP = 0.00;
  _totalSalesCreditTP = 0.00;
  _totalSalesTP = 0.00;

  _totalSalesCash = 0.00;
  _totalSalesCredit = 0.00;
  _totalSales = 0.00;

  _totalReturnCash = 0.00;
  _totalReturnCredit = 0.00;
  _ttlReturnAmount = 0.00;
  _netSalesAmount = 0.00;
  _totalCollectionCash = 0.00;
  _totalCollectionCredit = 0.00;
  _ttlCollectionAmount = 0.00;
  _adjustedAmount = 0.00;
  _closingBalance = 0.00;

  partyId = 0;

  totalInvoice = 0;
  private GetPreviewData_bak() {

    this.bodyData = [];
    this.bodyDataCollection = [];

    this._openingBalance = 0.00;
    this._totalSalesCash = 0.00;
    this._totalSalesCredit = 0.00;
    this._totalSales = 0.00;
    this._totalReturnCash = 0.00;
    this._totalReturnCredit = 0.00;
    this._ttlReturnAmount = 0.00;
    this._netSalesAmount = 0.00;
    this._totalCollectionCash = 0.00;
    this._totalCollectionCredit = 0.00;
    this._ttlCollectionAmount = 0.00;
    this._adjustedAmount = 0.00;
    this._closingBalance = 0.00;

    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetZoneRegionWiseSalesCollectionBalanceReport?zoneCode=${this.zoneCode}&regionCode=${this.regionCode}&areaCode=${this.areaCode}&territoryCode=${this.territoryCode}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&type=${this.reportType}&mioType=${this.mioType}`;

    this.commonService.ConsoleLog(this.apiUrl);

    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
        if (this.bodyData.length == 0)
          this.toastrService.success("Message", this.commonService.nodatafound);
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }

      //this.openingBalance = this.bodyData.length > 0 ? this.bodyData[0].obAmount : 0.00;

      this.bodyData.forEach(a => {

        this._openingBalance += parseFloat(a.openingBalance);;

        this._totalSalesCashTP += parseFloat(a.totalSalesCashTP);;
        this._totalSalesCreditTP += parseFloat(a.totalSalesCreditTP);;
        this._totalSalesTP += parseFloat(a.totalSalesTP);;

        this._totalSalesCash += parseFloat(a.totalSalesCash);;
        this._totalSalesCredit += parseFloat(a.totalSalesCredit);;
        this._totalSales += parseFloat(a.totalSales);;

        this._totalReturnCash += parseFloat(a.totalReturnCash);;
        this._totalReturnCredit += parseFloat(a.totalReturnCredit);;
        this._ttlReturnAmount += parseFloat(a.ttlReturnAmount);;

        this._netSalesAmount += parseFloat(a.netSalesAmount);;
        this._totalCollectionCash += parseFloat(a.totalCollectionCash);;
        this._totalCollectionCredit += parseFloat(a.totalCollectionCredit);;

        this._ttlCollectionAmount += parseFloat(a.ttlCollectionAmount);;
        this._adjustedAmount += parseFloat(a.adjustedAmount);;
        this._closingBalance += parseFloat(a.closingBalance);;

      });

    });
  }


  base64Pdf: any;
  private GetPreviewData() {

    let userInfo = this.commonService.GetUserProfileJson();

    this.apiUrl = `SalesInvoiceReport/GetNationalStockByQtyReport?reportFormat=Pdf&userId=${userInfo[0].employeeid}&fDate=${this.commonService.DateFormat(this.fDate)}`;

    debugger;
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      //console.log(res);
      if (res.status) {
        this.base64Pdf = this.sanitizer.bypassSecurityTrustResourceUrl(res.data[0].data);
        //this.commonService.GenerateBase64ToReport(returns);
      }
      else {
        console.log(res.message);
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }




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

  // private onPreview() {
  //   // if (this.reportType == undefined || this.reportType == null || this.reportType == '') {
  //   //   this.toastrService.warning('Please Select Report Type', 'Warning');
  //   //   return false;
  //   // }
  //   this.changeTypeWiseView();
  //   this.GetPreviewData();
  //   this.showbody = true;
  // }



  changeTypeWiseView() {
    switch (this.reportType) {
      case 'region':
        this.showTerritory = false;
        this.showArea = false;
        this.colspan = 3;
        break;
      case 'area':
        this.showTerritory = false;
        this.showArea = true;
        this.colspan = 4;
        break;
      case 'territory':
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
    this.toastrService.warning("Message", "email button clicked");
  }

  currencyFormatter(currency) {
    return this.commonService.roundWithDecimalPoint(currency, 0);
  }

  private onPreview() {
    this.showbody = true;
    this.getReportData();
  }


  public totalFAC_CtnQty: number = 0;
  public totalTRA_CtnQty: number = 0;
  public totalRAJ_CtnQty: number = 0;
  public totalBOG_CtnQty: number = 0;
  public totalMYM_CtnQty: number = 0;
  public totalJAS_CtnQty: number = 0;
  public totalCUM_CtnQty: number = 0;
  public totalRAN_CtnQty: number = 0;
  public totalFAR_CtnQty: number = 0;
  public totalBAR_CtnQty: number = 0;
  public totalCHI_CtnQty: number = 0;
  public totalSYL_CtnQty: number = 0;
  public totalDHA_CtnQty: number = 0;
  public totalKHU_CtnQty: number = 0;
  public totalKUS_CtnQty: number = 0;
  public totalBBA_CtnQty: number = 0;
  public totalTOT_CtnQty: number = 0;



  public totalFAC_CtnQtyAmount: number = 0;
  public totalTRA_CtnQtyAmount: number = 0;
  public totalRAJ_CtnQtyAmount: number = 0;
  public totalBOG_CtnQtyAmount: number = 0;
  public totalMYM_CtnQtyAmount: number = 0;
  public totalJAS_CtnQtyAmount: number = 0;
  public totalCUM_CtnQtyAmount: number = 0;
  public totalRAN_CtnQtyAmount: number = 0;
  public totalFAR_CtnQtyAmount: number = 0;
  public totalBAR_CtnQtyAmount: number = 0;
  public totalCHI_CtnQtyAmount: number = 0;
  public totalSYL_CtnQtyAmount: number = 0;
  public totalDHA_CtnQtyAmount: number = 0;
  public totalKHU_CtnQtyAmount: number = 0;
  public totalKUS_CtnQtyAmount: number = 0;
  public totalBBA_CtnQtyAmount: number = 0;
  public totalTOT_CtnQtyAmount: number = 0;
  private getReportData() {
    this.showbody = true;
    this.isPreview = true;
    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `SalesInvoice/GetNationalStockByQtyReport?userId=${userInfo[0].employeeid}&fDate=${this.commonService.DateFormat(this.fDate)}&productWiseSpecificationId=${this.productWiseSpecificationId}&productTypeName=${this.productTypeName}`;
    this.dateRange = "";

    let fDate = this.commonService.GetMonthAndYear(this.fDate);

    if (fDate) {
      this.dateRange =
        "Date: " + this.commonService.DateFormat(this.fDate, "dd-MMM-yyyy");
    }

    this.bodyData = [];
    this.clearGrandTotal();
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        var i = 0;
        this.bodyData = returns.data;
        this.bodyData.forEach(element => {
          this.totalFAC_CtnQty += element.FAC_CtnQty;
            this.totalTRA_CtnQty += element.TRA_CtnQty;
          this.totalRAJ_CtnQty += element.RAJ_CtnQty;
          this.totalBOG_CtnQty += element.BOG_CtnQty;
          this.totalMYM_CtnQty += element.MYM_CtnQty;
          this.totalJAS_CtnQty += element.JAS_CtnQty;
          this.totalCUM_CtnQty += element.CUM_CtnQty;
          this.totalRAN_CtnQty += element.RAN_CtnQty;
          this.totalFAR_CtnQty += element.FAR_CtnQty;
          this.totalBAR_CtnQty += element.BAR_CtnQty;
          this.totalCHI_CtnQty += element.CHI_CtnQty;
          this.totalSYL_CtnQty += element.SYL_CtnQty;
          this.totalDHA_CtnQty += element.DHA_CtnQty;
          this.totalKHU_CtnQty += element.KHU_CtnQty;
          this.totalKUS_CtnQty += element.KUS_CtnQty;
          this.totalBBA_CtnQty += element.BBA_CtnQty;
          this.totalTOT_CtnQty += element.TOT_CtnQty;

          this.totalFAC_CtnQtyAmount += element.FAC_CtnQtyAmount;
           this.totalTRA_CtnQtyAmount += element.TRA_CtnQtyAmount;
          this.totalRAJ_CtnQtyAmount += element.RAJ_CtnQtyAmount;
          this.totalBOG_CtnQtyAmount += element.BOG_CtnQtyAmount;
          this.totalMYM_CtnQtyAmount += element.MYM_CtnQtyAmount;
          this.totalJAS_CtnQtyAmount += element.JAS_CtnQtyAmount;
          this.totalCUM_CtnQtyAmount += element.CUM_CtnQtyAmount;
          this.totalRAN_CtnQtyAmount += element.RAN_CtnQtyAmount;
          this.totalFAR_CtnQtyAmount += element.FAR_CtnQtyAmount;
          this.totalBAR_CtnQtyAmount += element.BAR_CtnQtyAmount;
          this.totalCHI_CtnQtyAmount += element.CHI_CtnQtyAmount;
          this.totalSYL_CtnQtyAmount += element.SYL_CtnQtyAmount;
          this.totalDHA_CtnQtyAmount += element.DHA_CtnQtyAmount;
          this.totalKHU_CtnQtyAmount += element.KHU_CtnQtyAmount;
          this.totalKUS_CtnQtyAmount += element.KUS_CtnQtyAmount;
          this.totalBBA_CtnQtyAmount += element.BBA_CtnQtyAmount;
          this.totalTOT_CtnQtyAmount += element.TOT_CtnQtyAmount;
        });

        this.totalFAC_CtnQty = this.commonService.round(this.totalFAC_CtnQty);
         this.totalTRA_CtnQty = this.commonService.round(this.totalTRA_CtnQty);
        this.totalRAJ_CtnQty = this.commonService.round(this.totalRAJ_CtnQty);
        this.totalBOG_CtnQty = this.commonService.round(this.totalBOG_CtnQty);
        this.totalMYM_CtnQty = this.commonService.round(this.totalMYM_CtnQty);
        this.totalJAS_CtnQty = this.commonService.round(this.totalJAS_CtnQty);
        this.totalCUM_CtnQty = this.commonService.round(this.totalCUM_CtnQty);
        this.totalRAN_CtnQty = this.commonService.round(this.totalRAN_CtnQty);
        this.totalFAR_CtnQty = this.commonService.round(this.totalFAR_CtnQty);
        this.totalBAR_CtnQty = this.commonService.round(this.totalBAR_CtnQty);
        this.totalCHI_CtnQty = this.commonService.round(this.totalCHI_CtnQty);
        this.totalSYL_CtnQty = this.commonService.round(this.totalSYL_CtnQty);
        this.totalDHA_CtnQty = this.commonService.round(this.totalDHA_CtnQty);
        this.totalKHU_CtnQty = this.commonService.round(this.totalKHU_CtnQty);
        this.totalKUS_CtnQty = this.commonService.round(this.totalKUS_CtnQty);
        this.totalBBA_CtnQty = this.commonService.round(this.totalBBA_CtnQty);
        this.totalTOT_CtnQty = this.commonService.round(this.totalTOT_CtnQty);

        this.totalFAC_CtnQtyAmount = this.commonService.round(this.totalFAC_CtnQtyAmount);
         this.totalTRA_CtnQtyAmount = this.commonService.round(this.totalTRA_CtnQtyAmount);
        this.totalRAJ_CtnQtyAmount = this.commonService.round(this.totalRAJ_CtnQtyAmount);
        this.totalBOG_CtnQtyAmount = this.commonService.round(this.totalBOG_CtnQtyAmount);
        this.totalMYM_CtnQtyAmount = this.commonService.round(this.totalMYM_CtnQtyAmount);
        this.totalJAS_CtnQtyAmount = this.commonService.round(this.totalJAS_CtnQtyAmount);
        this.totalCUM_CtnQtyAmount = this.commonService.round(this.totalCUM_CtnQtyAmount);
        this.totalRAN_CtnQtyAmount = this.commonService.round(this.totalRAN_CtnQtyAmount);
        this.totalFAR_CtnQtyAmount = this.commonService.round(this.totalFAR_CtnQtyAmount);
        this.totalBAR_CtnQtyAmount = this.commonService.round(this.totalBAR_CtnQtyAmount);
        this.totalCHI_CtnQtyAmount = this.commonService.round(this.totalCHI_CtnQtyAmount);
        this.totalSYL_CtnQtyAmount = this.commonService.round(this.totalSYL_CtnQtyAmount);
        this.totalDHA_CtnQtyAmount = this.commonService.round(this.totalDHA_CtnQtyAmount);
        this.totalKHU_CtnQtyAmount = this.commonService.round(this.totalKHU_CtnQtyAmount);
        this.totalKUS_CtnQtyAmount = this.commonService.round(this.totalKUS_CtnQtyAmount);
        this.totalBBA_CtnQtyAmount = this.commonService.round(this.totalBBA_CtnQtyAmount);
        this.totalTOT_CtnQtyAmount = this.commonService.round(this.totalTOT_CtnQtyAmount);

      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });


    //let value = this.comboService
  }



  clearGrandTotal() {

    this.totalFAC_CtnQty = 0;
    this.totalTRA_CtnQty = 0;
    this.totalRAJ_CtnQty = 0;
    this.totalBOG_CtnQty = 0;
    this.totalMYM_CtnQty = 0;
    this.totalJAS_CtnQty = 0;
    this.totalCUM_CtnQty = 0;
    this.totalRAN_CtnQty = 0;
    this.totalFAR_CtnQty = 0;
    this.totalBAR_CtnQty = 0;
    this.totalCHI_CtnQty = 0;
    this.totalSYL_CtnQty = 0;
    this.totalDHA_CtnQty = 0;
    this.totalKHU_CtnQty = 0;
    this.totalKUS_CtnQty = 0;
    this.totalBBA_CtnQty = 0;
    this.totalTOT_CtnQty = 0;

    this.totalFAC_CtnQtyAmount = 0;
     this.totalTRA_CtnQtyAmount = 0;
    this.totalRAJ_CtnQtyAmount = 0;
    this.totalBOG_CtnQtyAmount = 0;
    this.totalMYM_CtnQtyAmount = 0;
    this.totalJAS_CtnQtyAmount = 0;
    this.totalCUM_CtnQtyAmount = 0;
    this.totalRAN_CtnQtyAmount = 0;
    this.totalFAR_CtnQtyAmount = 0;
    this.totalBAR_CtnQtyAmount = 0;
    this.totalCHI_CtnQtyAmount = 0;
    this.totalSYL_CtnQtyAmount = 0;
    this.totalDHA_CtnQtyAmount = 0;
    this.totalKHU_CtnQtyAmount = 0;
    this.totalKUS_CtnQtyAmount = 0;
    this.totalBBA_CtnQtyAmount = 0;
    this.totalTOT_CtnQtyAmount = 0;

  }


  ExportTOExcel(fileName: string) {

    if (!this.isPreview) {
      this.toastrService.warning("Message", "Please Preview data First and then download Excel.");
      return;
    }

    //debugger;
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.TABLE.nativeElement
    );

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    fileName = fileName + ".xlsx";
    XLSX.writeFile(wb, fileName);
  }

}

