import { DomSanitizer } from "@angular/platform-browser";
import { StockinwithoutpoService } from "app/services/inventory/Stockinwithoutpo.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { NbToastrService } from "@nebular/theme";
import { CommonService } from "app/@core/mock/common.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'ngx-promo-inv-stock-report',
  templateUrl: './promo-inv-stock-report.component.html',
  styleUrls: ['./promo-inv-stock-report.component.scss']
})
export class PromoInvStockReportComponent implements OnInit {

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

  pageNavigation = "Promo Stock Report";

  apiUrl = "";
  bodyData: any = [];
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
    private stockInWithOutPOService: StockinwithoutpoService
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
    debugger

    let productId = (this.productSelected == undefined || this.productSelected == null) ? 0 : this.productSelected['id'];

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `PromoReport/GetPromoStockReport?userId=${userInfo[0].employeeid}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&productWiseSpecificationId=${productId}&reportFormat=${reportFormat}`;

    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
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
    this.GetAllZone();
  }

  productSpecList = [];
  productSelected = {};
  public getAllProduct() {
    this.stockInWithOutPOService
      .GetAllPromoSampleProducts()
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

  base64Pdf: any;
  private GetPreviewData() {
    debugger
    this.bodyData = [];

    let userInfo = this.commonService.GetUserProfileJson();
    let productWiseSpecificationId = (this.productSelected == undefined || null) ? 0 : this.productSelected['id'];

    this.apiUrl = `Promo/promoStockReport?&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&productWiseSpecificationId=${productWiseSpecificationId}`;

    debugger;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      //let res = JSON.parse(returns);
      //console.log(res);
      if (returns.success) {
        debugger
        this.bodyData = returns.data;
        //this.base64Pdf = this.sanitizer.bypassSecurityTrustResourceUrl(res.data[0].data);
        //this.commonService.GenerateBase64ToReport(returns);
      }
      else {
        console.log(returns.message);
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }




  private onRefresh() {

    window.location.reload();
  }

  private onPreview() {

    this.changeTypeWiseView();
    this.GetPreviewData();
    this.showbody = true;
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
