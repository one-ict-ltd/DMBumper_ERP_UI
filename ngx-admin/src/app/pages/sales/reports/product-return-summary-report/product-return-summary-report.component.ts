import { Component, OnInit } from "@angular/core";
// import { FormControl } from "@angular/forms";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { SalesreturnService } from "app/services/sales/salesreturn.service";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'ngx-product-return-summary-report',
  templateUrl: './product-return-summary-report.component.html',
  styleUrls: ['./product-return-summary-report.component.scss']
})
export class ProductReturnSummaryReportComponent implements OnInit {


  //date = new Date().getFullYear();
  fromdateSelected = new Date();
  todateSelected = new Date();
  territorySelected: any = {};
  territoryList: any[]
  territoryCode: any = "";
  depotCode: any = "";
  productSpecSelected: {};
  productWiseSpecificationId:number = 0;
  // yearName = this.date;
  // prevYearName = this.date - 1;

  pageNavigation = "Sales Return Report";

  // tableHeader = [
  //   "Date",
  //   this.yearName + " (Tk.)",
  //   "Previous Year (Tk.)",
  // ];

  apiUrl = "";
  bodyData: any = [];
  bodyDetailsData: any = [];
  bodyDataCollection: any = [];
  bodyDataPayment: any = [];
  params = [];

  parties = [];
  branchs = [];
  companyId: number = 0;

  showbody: boolean = false;
  partySelected: any = {};
  branchSelected: any = {};

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
    private salesinvoiceService: SalesinvoiceService,
    private salesreturnService: SalesreturnService,
    private sanitizer: DomSanitizer,
  ) {
    this.fDate = new Date(); //(this.commonService.GetAnyMonthAndDateOfYear(12, 1));
    this.tDate = new Date();
    this.depotSelected = null;
    this.territorySelected = null;
    this.partySelected = null;
    this.productSpecSelected= null;
    this.getAllDropdown();
    this.getAllProductForRequisition();
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
      this.generateCrReport("Excel");
    } else if (clicked == "refresh") {
      this.onRefresh();
    } else if (clicked == "email") {
      this.onEmail();
    } else {
      this.toastrService.warning("Message", "please clicked any button");
    }
  }

  public productSpecList = [];
  public getAllProductForRequisition() {
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
  depotSelected: any = {};
  public GetAllDepo() {
    this.depotSelected = null;

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
    this.territorySelected = null;
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
  //totalReturnAmt = 0.00;

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

  // private getReportData() {
  //   debugger;
  //   this.bodyData = [];
  //   this.totalReturnAmt = 0.00;

  //   let depotCode = this.depotSelected == (undefined || null) ? '' : this.depotSelected["id"];
  //   let territoryCode = this.territorySelected == (undefined || null) ? '' : this.territorySelected["id"];
  //   let partyId = this.partySelected == (undefined || null) ? '0' : this.partySelected["id"];
  //   let productWiseSpecificationId = this.productSpecSelected == (undefined || null) ? '0' : this.productSpecSelected["id"];
  //   territoryCode = (territoryCode === undefined)? "":territoryCode;

  //   this.apiUrl = "";
  //   this.apiUrl = `SalesReturn/GetProductReturnSummary?masterId=${0}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&depotCode=${depotCode}&territoryCode=${territoryCode}&productSpecId=${productWiseSpecificationId}&partyId=${partyId}`;
  //   debugger;
  //   this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
  //     if (returns.success) {

  //       this.bodyData = returns.data;
  //       this.bodyData.forEach(a => {
  //         this.totalReturnAmt += parseFloat(a.amount ?? 0);
  //       });
  //       this.totalReturnAmt = this.commonService.roundWithDecimalPoint(this.totalReturnAmt, 0);
  //       // alert(this.totalReturnAmt);
  //     } else {
  //       this.toastrService.danger("Message", this.commonService.nodatafound);
  //     }
  //   });
  // }


  generateCrReport(reportFormat: any) {
    // debugger;
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.commonService.validateDates(fromDate, toDate)) {

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();

    let depotCode = this.depotSelected == (undefined || null) ? '' : this.depotSelected["id"];
    let territoryCode = this.territorySelected == (undefined || null) ? '' : this.territorySelected["id"];
    let partyId = this.partySelected == (undefined || null) ? '0' : this.partySelected["id"];
    let productWiseSpecificationId = this.productSpecSelected == (undefined || null) ? '0' : this.productSpecSelected["id"];
    //console.log("userInfo[0].employeeid", userInfo[0].employeeid);

    this.apiUrl = `SalesInvoiceReport/GetProductReturnSummary?reportFormat=Pdf&userId=${userInfo[0].employeeid}&masterId=${0}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&depotCode=${depotCode}&territoryCode=${territoryCode}&productSpecId=${productWiseSpecificationId}&partyId=${partyId}`;

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

  base64Pdf: any;
  private getReportData() {

    let depotCode = this.depotSelected == (undefined || null) ? '' : this.depotSelected["id"];
    let territoryCode = this.territorySelected == (undefined || null) ? '' : this.territorySelected["id"];
    let partyId = this.partySelected == (undefined || null) ? '0' : this.partySelected["id"];
    let productWiseSpecificationId = this.productSpecSelected == (undefined || null) ? '0' : this.productSpecSelected["id"];

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    //console.log("userInfo[0].employeeid", userInfo[0].employeeid);
   // this.apiUrl = `SalesInvoiceReport/GetDepotStockReport?reportFormat=Pdf&userId=${userInfo[0].employeeid}&depotCode=${this.depotCode}&productWiseSpecificationId=${this.productWiseSpecificationId}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}`;
    //this.apiUrl = `SalesReturn/GetProductReturnSummary?masterId=${0}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&depotCode=${depotCode}&territoryCode=${territoryCode}&productSpecId=${productWiseSpecificationId}&partyId=${partyId}`;
    this.apiUrl = `SalesInvoiceReport/GetProductReturnSummary?reportFormat=Pdf&userId=${userInfo[0].employeeid}&masterId=${0}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&depotCode=${depotCode}&territoryCode=${territoryCode}&productSpecId=${productWiseSpecificationId}&partyId=${partyId}`;

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

  master: {} = {};
  lstInvoiceDetails: any[] = [];
  lstDetailsViewModel: any[] = [];
  ttlCollectionAmount: number = 0;
  NetTotalPrice: number = 0;

  private onRefresh() {
    window.location.reload();
  }

  private onPreview() {
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

