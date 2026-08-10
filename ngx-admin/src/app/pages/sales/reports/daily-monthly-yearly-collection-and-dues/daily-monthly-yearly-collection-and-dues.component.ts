import { Component, OnInit } from "@angular/core";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'ngx-daily-monthly-yearly-collection-and-dues',
  templateUrl: './daily-monthly-yearly-collection-and-dues.component.html',
  styleUrls: ['./daily-monthly-yearly-collection-and-dues.component.scss']
})
export class DailyMonthlyYearlyCollectionAndDuesComponent implements OnInit {


  //date = new Date().getFullYear();
  fromdateSelected = new Date();
  todateSelected = new Date();
  territorySelected: any = {};
  territoryList: any[]
  territoryCode: any = "";
  depotCode: any = "";

  // yearName = this.date;
  // prevYearName = this.date - 1;

  pageNavigation = "Daily,Monthly,Yearly-Sales Collection And Dues";

  // tableHeader = [
  //   "Date",
  //   this.yearName + " (Tk.)",
  //   "Previous Year (Tk.)",
  // ];

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
  typeList: any[];
  typeSelected: {};
  typeId: number;
  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private salesinvoiceService: SalesinvoiceService,
    private sanitizer: DomSanitizer,
  ) {

    this.typeId = 0;
   // this.typeSelected = { id: 0, name: 'All' };
    this.typeList = [
      { id: 0, name: 'All' },
      { id: 1, name: 'Confirmed' },
      { id: 2, name: 'Not-Confirmed' },
    ]
    this.typeSelected = { id: 0, name: 'All' };
    this.fDate = new Date(); //(this.commonService.GetAnyMonthAndDateOfYear(12, 1));
    this.tDate = new Date();
    this.getAllDropdown();
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
    debugger;
    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.typeId = this.typeSelected['id'] ?? 0;
    //console.log("userInfo[0].employeeid", userInfo[0].employeeid);
    this.apiUrl = `SalesInvoiceReport/GetDailyMonthlyYearlySalesAndCollectionReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&fDate=${this.commonService.DateFormat(this.fDate)}&regionCode=${this.regionCode}`;
    //console.log(this.apiUrl);
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }


  base64Pdf: any;
  private getReportData() {

    let userInfo = this.commonService.GetUserProfileJson();
    //console.log("userInfo[0].employeeid", userInfo[0].employeeid);
    this.apiUrl = `SalesInvoiceReport/GetDailyMonthlyYearlySalesAndCollectionReport?reportFormat=Pdf&userId=${userInfo[0].employeeid}&fDate=${this.commonService.DateFormat(this.fDate)}&regionCode=${this.regionCode}`;

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


  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Customer Name",
      leftValue: this.partySelected.name,
    });
  }




  public getAllDropdown() {
    debugger;
    //this.GetAllPartysByTypeId(0);
    //this.GetAllZone();
   // this.GetAllDepo();
    this.GetAllRegion("")
  }

  zoneCode = "";
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

  regionList: any = [];
  regionCode: any = "";
  regionSelected: any = {};
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
  areaList: any = [];
  areaCode = '';
  areaSelected: any = {};
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

  getAllTerritoryByArea(areaCode: string = '') {
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

  depotList: any[];
  depotSelected = {};
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
          this.getAllTerritory(this.depotCode);
        }
        //}
      }
    })
  }

  getAllTerritory(depotCode: any = '') {
    this.territoryList = [];
    this.territorySelected = {};
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

  totalInvoiceAmt = 0.00;
  totalReturnAmt = 0.00;
  totalNetSalesAmt = 0.00;

  totalCollection = 0.00;
  totalDiscount = 0.00;
  totalOthers = 0.00;
  totalGrossRet = 0.00;

  totalDues = 0.00;
  totalNetCollectionAmt = 0.00;
  ttlIncentiveAmount = 0.00;
  totalBalance = 0.00;

  openingBalance = 0.00;
  closingBalance = 0.00;
  ttlOpeningBalance = 0.00;
  totalclosingBalance = 0.00;
  partyId = 0;
  private getReportData_Old() {
    debugger;
    this.bodyData = [];
    this.bodyDataCollection = [];
    this.totalNetSalesAmt = 0.00;
    this.totalDiscount = 0.00;
   
    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetSaleRegisterReport?depoCode=${this.depotCode}&territoryCode=${this.territoryCode}&partyId=${this.partyId}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode}&areaCode=${this.areaCode}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }

      this.openingBalance = this.bodyData.length > 0 ? this.bodyData[0].obAmount : 0.00;

      this.bodyData.forEach(a => {
        //this.ttlOpeningBalance += parseFloat(a.openingBalance);
        this.totalNetSalesAmt += parseFloat(a.netSalesAmount);
        //this.totalInvoiceAmt += parseFloat(a.netSalesAmount);

        // this.totalCollection += parseFloat(a.collectionAmount);
        // this.ttlIncentiveAmount += parseFloat(a.incentiveAmount);
        this.totalDiscount += parseFloat(a.bonusAmount);
        // //this.totalReturnAmt += parseFloat(a.returnAmount);
        // this.totalGrossRet += parseFloat(a.grossRetAmount);
        // this.totalOthers += parseFloat(a.othersAmount);

        // this.totalNetCollectionAmt += parseFloat(a.totalCollection);
        // this.totalclosingBalance += parseFloat(a.closingBalance);
      });

      // this.totalDues = this.openingBalance + this.totalNetSalesAmt;
      // this.closingBalance = this.totalDues - this.totalNetCollectionAmt;
    });
  }

  totalInvoice = 0;

  private onRefresh() {
    window.location.reload();
  }

  private onPreview() {
    this.getReportData();
    this.showbody = true;
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  currencyFormatter(currency) {
    return this.commonService.roundWithDecimalPoint(currency, 0);
  }
}
