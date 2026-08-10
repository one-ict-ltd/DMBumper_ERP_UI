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
  selector: 'ngx-customer-wise-collection',
  templateUrl: './customer-wise-collection.component.html',
  styleUrls: ['./customer-wise-collection.component.scss']
})
export class CustomerWiseCollectionComponent implements OnInit {

  //date = new Date().getFullYear();
  fromdateSelected = new Date();
  todateSelected = new Date();
  territorySelected: any = {};
  territoryList: any[]
  territoryCode: any = "";
  depotCode: any = "";
  partyId: any = 0;

  // yearName = this.date;
  // prevYearName = this.date - 1;

  pageNavigation = "Collection Register";//"Customer Wise Collection";

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
  cUpToDate: Date;
  isOverDues: boolean = false;
  showDateRange: boolean = false;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private salesinvoiceService: SalesinvoiceService,
  ) {
    this.fDate = new Date(); //(this.commonService.GetAnyMonthAndDateOfYear(12, 1));
    this.tDate = new Date();
    this.cUpToDate = new Date();
    this.isOverDues = false;
    this.onRefresh();
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
    this.apiUrl = `SalesInvoiceReport/GetCustomerWiseCollection?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&depotCode=${this.depotCode}&territoryCode=${this.territoryCode}&partyId=${this.partyId}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&cUpToDate=${this.commonService.DateFormat(this.cUpToDate)}&isOverDues=${this.isOverDues}`;

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
    // Tender/bill: load only customers that have bill-sourced invoices (no depot/territory)
    this.LoadBillCustomers();
  }

  public LoadBillCustomers() {
    this.parties = [];
    this.partySelected = null;
    this.partyId = 0;
    this.salesinvoiceService
      .GetPartybyTerritoryCodeForBillCollection('', '')
      .subscribe((returns: any) => {
        this.parties = returns.data.map((val: any) => ({
          id: val.partyId,
          name: val.partyName,
          address: val.address,
          mobileNo: val.mobileNo,
        }));
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
    this.territoryCode = "";
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

  GetPartyByTerritoryCode(territoryCode: any) {
    this.partyId = 0;
    this.partyList = [];
    this.partySelected = null;

    this.salesinvoiceService
      .GetPartyByTerritoryCode(territoryCode, this.depotCode)
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

  private getReportData() {
    debugger;
    this.apiUrl = "";
    this.apiUrl = `SalesCollection/GetCustomerWiseCollection?depotCode=${this.depotCode}&territoryCode=${this.territoryCode}&partyId=${this.partyId}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&cUpToDate=${this.commonService.DateFormat(this.cUpToDate)}&isOverDues=${this.isOverDues}`;

    this.bodyData = [];
    this.bodyDataCollection = [];

    this.totalInvoiceAmt = 0.00;
    this.totalReturnAmt = 0.00;
    this.totalNetSalesAmt = 0.00;
    this.totalCollection = 0.00;
    this.totalDiscount = 0.00;
    this.totalOthers = 0.00;
    this.totalGrossRet = 0.00;
    this.totalNetCollectionAmt = 0.00;
    this.ttlIncentiveAmount = 0.00;
    this.totalDues = 0.00;
    this.openingBalance = 0.00;
    this.ttlOpeningBalance = 0.00;
    this.closingBalance = 0.00;
    this.totalclosingBalance = 0.00;

    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }

      this.openingBalance = this.bodyData.length > 0 ? this.bodyData[0].obAmount : 0.00;

      this.bodyData.forEach(a => {
        //this.ttlOpeningBalance += parseFloat(a.openingBalance);
        this.totalInvoiceAmt += parseFloat(a.invoiceAmount);
        this.totalReturnAmt += parseFloat(a.returnAmount);
        this.totalNetSalesAmt += parseFloat(a.netSalesAmount);

        this.totalCollection += parseFloat(a.collectionAmount);
        this.totalDiscount += parseFloat(a.discountAmount);
        this.ttlIncentiveAmount += parseFloat(a.incentiveAmount);
        this.totalGrossRet += parseFloat(a.grossRetAmount);
        this.totalOthers += parseFloat(a.othersAmount);
        this.totalNetCollectionAmt += parseFloat(a.totalCollection);

        this.totalclosingBalance += parseFloat(a.closingBalance);
      });

      // this.totalDues = this.openingBalance + this.totalNetSalesAmt;
      // this.closingBalance = this.totalDues - this.totalNetCollectionAmt;
    });
  }

  totalInvoice = 0;

  private onRefresh() {
    this.partySelected = null;
    //this.branchSelected = null;
    this.fDate = new Date();
    this.tDate = new Date();
    //this.companyId = 0;
    this.bodyData = [];
    //this.bodyDataCollection = [];
    //this.bodyDataPayment = [];
    this.showbody = false;


    this.territorySelected = {};
    this.territoryList = [];
    this.territoryCode = "";
    this.depotCode = "";
    this.partyId = 0;
  }

  private onPreview() {
    if (!this.partyId || this.partyId == 0) {
      this.toastrService.warning("Message", "Please select a customer.");
      return;
    }
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
    this.getReportData();
    this.showbody = true;
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