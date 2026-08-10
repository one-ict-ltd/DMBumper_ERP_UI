import { Component, OnInit } from "@angular/core";
// import { FormControl } from "@angular/forms";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";

// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";

@Component({
  selector: 'ngx-party-report',
  templateUrl: './party-report.component.html',
  styleUrls: ['./party-report.component.scss']
})
export class PartyReportComponent implements OnInit {

  //date = new Date().getFullYear();
  fromdateSelected = new Date();
  todateSelected = new Date();
  territorySelected: any = {};
  territoryList: any[]
  territoryCode: any = "";
  depotCode: any = "";

  // yearName = this.date;
  // prevYearName = this.date - 1;

  pageNavigation = "Party Report";

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

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private salesinvoiceService: SalesinvoiceService,
  ) {
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
    //console.log("userInfo[0].employeeid", userInfo[0].employeeid);
    this.apiUrl = `SalesInvoiceReport/PartyReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&depotCode=${this.depotCode}&territoryCode=${this.territoryCode}&partyId=0`;

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
    this.GetAllDepo();
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
        // if (this.depotList.length == 1) {
        //   this.depotSelected = { id: this.depotList[0].id, name: this.depotList[0].name };
        //   this.depotCode = this.depotList[0].id;
        //   this.getAllTerritory(this.depotCode);
        // }
        if (returns.data.length == 1) {
          this.depotSelected = { id: returns.data[0].depotCode, name: returns.data[0].depotName };
          this.depotCode = returns.data[0].depotCode;
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

  private getReportData() {
    debugger;
    this.bodyData = [];
    this.bodyDataCollection = [];

    // this.totalInvoiceAmt = 0.00;
    // this.totalReturnAmt = 0.00;
    this.totalNetSalesAmt = 0.00;
    // this.totalCollection = 0.00;
    this.totalDiscount = 0.00;
    // this.totalOthers = 0.00;
    // this.totalGrossRet = 0.00;
    // this.totalNetCollectionAmt = 0.00;
    // this.ttlIncentiveAmount = 0.00;
    // this.totalDues = 0.00;
    // this.openingBalance = 0.00;
    // this.ttlOpeningBalance = 0.00;
    // this.closingBalance = 0.00;
    // this.totalclosingBalance = 0.00;

    this.apiUrl = "";
    this.apiUrl = `Party/AccSpGetPartyByDepotTerritoyJson?depoCode=${this.depotCode}&territoryCode=${this.territoryCode}&partyId=0`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
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