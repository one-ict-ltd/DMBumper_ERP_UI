import { Component, OnInit } from "@angular/core";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'ngx-sales-target-vs-achievement',
  templateUrl: './sales-target-vs-achievement.component.html',
  styleUrls: ['./sales-target-vs-achievement.component.scss']
})
export class SalesTargetVsAchievementComponent implements OnInit {



  //date = new Date().getFullYear();
  fromdateSelected = new Date();
  todateSelected = new Date();
  territoryList: any[]

  zoneCode: any = "";
  regionCode: any = "";
  areaCode: any = "";
  depotCode: any = "";
  territoryCode: any = "";
  //mioCode: any = "";

  zoneSelected: any;
  regionSelected: any;
  areaSelected: any;
  depotSelected: any;
  territorySelected: any;

  // yearName = this.date;
  // prevYearName = this.date - 1;

  pageNavigation = "Product Category Wise Sales Target vs Achievement (AH)";

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

  base64Pdf: any;
  showDateRange: boolean = false;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private salesinvoiceService: SalesinvoiceService,
    private fieldforcemasterService: FieldforcemasterService,
    private sanitizer: DomSanitizer
  ) {
    this.fDate = new Date(this.commonService.GetFirstDateOfMonth(new Date()));
    this.tDate = new Date(this.commonService.GetLastDateOfMonth(new Date()));
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
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.apiUrl = "";
      let userInfo = this.commonService.GetUserProfileJson();
      //console.log("userInfo[0].employeeid", userInfo[0].employeeid);
      //this.apiUrl = `SalesInvoiceReport/GetSalesRegisterReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&depotCode=${this.depotCode}&territoryCode=${this.territoryCode}&partyId=${this.partyId}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}`;
      this.apiUrl = `SalesInvoiceReport/GetSalesTargetVsAchievementReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode}&areaCode=${this.areaCode}&depotCode=${this.depotCode}&territoryCode=${this.territoryCode}&empCode=${this.mioCode}`;

      //console.log(this.apiUrl);
      this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
        let res = JSON.parse(returns);
        //console.log(res);
        if (res.status) {
          this.commonService.GenerateBase64ToReport(res.data[0].data);
        } else {
          console.log(res.message);
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
    debugger;
    //this.GetAllPartysByTypeId(0);
    this.getzone();
    this.GetAllDepo();
  }


  public zoneList = [];
  public getzone() {
    //debugger;
    this.fieldforcemasterService.getZone(0).subscribe((retuns: any) => {
      if (retuns.length) {
        this.zoneList = retuns.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }

  public getdepotbyCode(code) {
    debugger;
    this.resetRegion;
    this.resetArea();
    this.depotSelected = null;
    this.resetDepot;
    this.resetTerritory();
    this.resetMIO();
    this.fieldforcemasterService.getDepoByZoneCode(code).subscribe((retuns: any) => {
      //debugger;
      if (retuns.success) {
        this.depotList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }

  public RegionList = [];
  public getregionbydepoCode(ZoneCode) {
    this.resetRegion();
    this.resetArea();
    this.fieldforcemasterService.GetRegionByZoneOrDepoCode(ZoneCode, '').subscribe((retuns: any) => {
      if (retuns.success) {
        this.RegionList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }
  resetRegion() {
    this.regionCode = "";
    this.RegionList = [];
    this.regionSelected = null;
  }

  public AreaList = [];
  public getareabyregionCode(ZoneCode) {
    this.resetArea();
    this.fieldforcemasterService.getAreabyregioncode(ZoneCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.AreaList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }

  resetArea() {
    this.areaCode = "";
    this.AreaList = [];
    this.areaSelected = null;
  }

  depotList: any[];
  public GetAllDepo() {
    this.resetDepot;
    this.resetTerritory();
    this.resetMIO();

    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetAllDepot`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.depotList = returns.data.map((val: any) => ({
          id: val.depotCode,
          name: val.depotName,
        }));

        // if (this.depotList.length == 1) {
        //   this.depotSelected = { id: this.depotList[0].id, name: this.depotList[0].name };
        //   this.depotCode = this.depotList[0].id;
        //   this.getAllTerritory(this.depotCode);
        // }
      }
    })
  }

  resetDepot() {

    this.depotCode = "";
    this.depotList = [];
    this.depotSelected = null;
    this.depotSelected = {};
  }

  getAllTerritory(areaCode: any = '') {
    this.resetTerritory();
    this.resetMIO();
    // this.salesinvoiceService.GetAllTerritoryForDepot(depotCode).subscribe((returns: any) => {
    //   if (returns.success) {
    //     this.territoryList = returns.data.map((val: any) => ({
    //       id: val.TerritoryCode,
    //       name: val.TerritoryName,
    //     }));
    //   }
    // });

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

  private getReportData() {

    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `SalesInvoiceReport/GetSalesTargetVsAchievementReport?reportFormat=Pdf&userId=${userInfo[0].employeeid}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode}&areaCode=${this.areaCode}&depotCode=${this.depotCode}&territoryCode=${this.territoryCode}&empCode=${this.mioCode}`;
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

  private onPreview() {
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.getReportData();
      //this.showbody = true;
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  currencyFormatter(currency) {
    return this.commonService.roundWithDecimalPoint(currency, 0);
  }
}

