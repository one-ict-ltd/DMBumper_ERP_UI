import { Component, OnInit } from "@angular/core";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { take } from 'rxjs/operators';

@Component({
  selector: 'ngx-product-wise-sales-budget-report',
  templateUrl: './product-wise-sales-budget-report.component.html',
  styleUrls: ['./product-wise-sales-budget-report.component.scss']
})
export class ProductWiseSalesBudgetReportComponent implements OnInit {


  //date = new Date().getFullYear();
  fromdateSelected = new Date();
  todateSelected = new Date();
  territorySelected: any = {};
  areaSelected: any = {};
  regionSelected: any = {};

  reportType: any = "Region";
  reportTypeSelected: any = { id: 'Region', name: 'Region' };
  reportTypeList: any[] = [
    { id: 'Region', name: 'Region' },
    { id: 'Area', name: 'Area' },
    { id: 'Territory', name: 'Territory' }
  ];

  mioType: any = "";
  mioTypeSelected: any = {};
  mioTypeList: any[] = [
    { id: 'All', name: 'All' },
    { id: 'Existing', name: 'Existing' },
    { id: 'Separated', name: 'Separated' },
  ];

  territoryList: any[];
  areaList: any[];
  regionList: any[];
  regionCode: any = "";
  zoneCode: any = "";
  areaCode: any = "";
  territoryCode: any = "";
  colspan: number = 3;
  showArea: boolean = false;
  showTerritory: boolean = false;

  pageNavigation = "Product Wise Sales Budget Report";

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
    private productrequisitionService: ProductrequisitionService,
    private sanitizer: DomSanitizer
  ) {
    this.fDate = new Date(this.commonService.GetFirstDateOfMonth(new Date())); //(this.commonService.GetAnyMonthAndDateOfYear(12, 1));
    this.tDate = new Date(this.commonService.GetLastDateOfMonth(new Date()));
    this.getAllDropdown();
    this.mioType = "All";
    this.mioTypeSelected = { id: this.mioTypeList[0].id, name: this.mioTypeList[0].name };
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
      this.generateCrReport("Excel");
    } else if (clicked == "refresh") {
      this.onRefresh();
    } else if (clicked == "email") {
      this.onEmail();
    } else {
      this.toastrService.warning("Message", "please clicked any button");
    }
  }

  generateCrReport(reportFormat: any) {
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      if (this.reportType == undefined || this.reportType == null || this.reportType == '') {
        this.toastrService.warning('Please Select Report Type', 'Warning');
        return;
      }

      if (this.productWiseSpecificationId == null || this.productWiseSpecificationId == 0) {
        this.toastrService.warning('Please select a product', 'Warning');
        return;
      }
      this.apiUrl = "";
      let userInfo = this.commonService.GetUserProfileJson();
      this.apiUrl = `SalesInvoiceReport/GetProductWiseSalesBudgetReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode}&areaCode=${this.areaCode}&territoryCode=${this.territoryCode}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&type=${this.reportType}&mioType=${this.mioType}&productWiseSpecificationId=${this.productWiseSpecificationId}`;

      this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
        let res = JSON.parse(returns);
        if (res.status) {
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

  productSpecList = [];
  productSelected: any;
  productWiseSpecificationId: number = 0;
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
  public GetAllMIOByTerritory() {
    this.resetMIO();
    this.comboService
      .GetAllMIOByTerritory(this.territoryCode)
      .subscribe((returns: any) => {
        if (returns.status) {
          debugger;
          this.mioList = returns.data.map((val: any) => ({
            id: val.employeeNo,
            name: val.mioName,
          }));
        }
      });
  }

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
    this.apiUrl = `SalesInvoice/GetZoneRegionWiseSalesCollectionBalanceReport?zoneCode=${this.zoneCode}&regionCode=${this.regionCode}&areaCode=${this.areaCode}&territoryCode=${this.territoryCode}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&type=${this.reportType}&mioType=${this.mioType}&productWiseSpecificationId=${this.productWiseSpecificationId}`;

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
    this.apiUrl = `SalesInvoiceReport/GetProductWiseSalesBudgetReport?reportFormat=Pdf&userId=${userInfo[0].employeeid}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode}&areaCode=${this.areaCode}&territoryCode=${this.territoryCode}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&type=${this.reportType}&mioType=${this.mioType}&productWiseSpecificationId=${this.productWiseSpecificationId}`;

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

  private onPreview() {
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      if (this.reportType == undefined || this.reportType == null || this.reportType == '') {
        this.toastrService.warning('Please Select Report Type', 'Warning');
        return false;
      }

      if (this.productWiseSpecificationId == null || this.productWiseSpecificationId == 0) {
        this.toastrService.warning('Please select a product', 'Warning');
        return;
      }

      this.changeTypeWiseView();
      this.GetPreviewData();
      this.showbody = true;
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }

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
}

