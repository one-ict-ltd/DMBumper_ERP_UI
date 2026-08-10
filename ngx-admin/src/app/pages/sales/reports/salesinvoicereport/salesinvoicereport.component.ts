//import { O } from "@angular/cdk/keycodes";
import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommonService } from "app/@core/mock/common.service";
import { CommoncomboService } from "app/services/commoncombo.service";
// import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { StockinService } from "app/services/inventory/stockin.service";
// import { MenuService } from "app/services/menu.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";

@Component({
  selector: "ngx-salesinvoicereport",
  templateUrl: "./salesinvoicereport.component.html",
  styleUrls: ["./salesinvoicereport.component.scss"],
})
export class SalesinvoicereportComponent implements OnInit {
  pageNavigation = "Sales Invoice Summary Report";
  rReportHeader = "Sales Invoice Summary";
  tableHeader = [
    "#",
    "Customer Name",
    "Invoice No.",
    "Mobile No.",
    "Shipping Address",
    "Invoice Amount (TK)",
  ];
  apiUrl = "";

  bodyData: any = [];
  params = [];

  partyId: any = 0;
  partyName: any = "";
  partySelected: any;
  partyList: any = [];

  salesInvoiceId: any = 0;
  salesInvoiceNumber: any = "";
  salesInvoiceSelected: any;
  salesInvoiceList: any = [];

  userName: any = "";
  salesUserId: any = 0;
  salesUserList: any = [];
  salesUserSelected: any;

  sbuId: number = 0;
  sbuList: any = [];
  sbuSelected: any;

  fromDate: Date = new Date();
  toDate: Date = new Date();

  showbody: boolean = false;
  netTotal: number = 0;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private stockinService: StockinService,
    //private menuService: MenuService,
    //private producttransferService: ProducttransferService,

    private datePipe: DatePipe,
    private salesinvoiceService: SalesinvoiceService
  ) {
    this.partyId = 0;
    this.salesInvoiceId = 0;
    this.salesUserId = 0;
    this.getDropdownData();
  }

  ngOnInit(): void { }
  RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      this.generateReport("pdf");
    } else if (clicked == "print") {
      this.generateReport("print");
    } else if (clicked == "csv") {
      this.onExportCSV();
    } else if (clicked == "refresh") {
      this.onRefresh();
    } else if (clicked == "email") {
      this.onEmail();
    } else {
      this.toastrService.warning("Message", "please clicked any button");
    }
  }
  private onRefresh() {
    this.salesInvoiceSelected = null;
    this.partySelected = null;
    this.salesInvoiceList = null;
    this.salesUserList = null;
    this.bodyData = [];
    this.showbody = false;
    this.sbuId = 0;
    this.sbuList = [];
    this.sbuSelected = {};
  }

  private onPreview() {
    this.getReportData();
    this.showbody = true;
  }

  private onExportCSV() {
    this.getReportData();
    //this.commonService.downloadCSVFile( this.chartofAccounts, this.pageNavigation);
    var fileName = this.pageNavigation + ".xlsx";
    this.commonService.generateExcel(this.bodyData, this.tableHeader, fileName);
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  private getDropdownData() {
    this.GetSbuList(0);
    this.GetAllPartysByTypeId(0);
    this.GetPartyWiseSalesInvoiceNo(0);
    this.GetDateRangeWiseUserName(null, null);
  }

  GetSbuList(companyId: number = 0) {
    this.sbuSelected = null;
    this.sbuList = [];
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      let element = { id: 0, name: "All" };
      this.sbuList = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
      if (this.sbuList.length > 0) this.sbuList.splice(0, 0, element);
    });
  }

  GetAllPartysByTypeId(partyTypeId: any, sbuId: number = 0) {
    this.partySelected = null;
    this.partyList = [];
    this.salesinvoiceService
      .GetAllPartysByTypeId(partyTypeId, sbuId)
      .subscribe((returns: any) => {
        let element = { id: 0, name: "All", address: "", mobileNo: "" };
        this.partyList = returns.data.map((val: any) => ({
          id: val.partyId,
          name: val.partyName,
          address: val.address,
          mobileNo: val.mobileNo,
        }));
        if (this.partyList.length > 0) this.partyList.splice(0, 0, element);
      });
  }

  GetPartyWiseSalesInvoiceNo(partyId) {
    this.salesInvoiceList = [];
    this.salesinvoiceService
      .GetSalesInvoiceListByPartyId(partyId)
      .subscribe((returns: any) => {
        let element = { id: 0, name: "All" };
        this.salesInvoiceList = returns.data.map((val: any) => ({
          id: val.salesInvoiceId,
          name: val.salesInvoiceNo,
        }));
        if (this.salesInvoiceList.length > 0)
          this.salesInvoiceList.splice(0, 0, element);
      });
  }

  GetSalesUserName() {
    this.GetDateRangeWiseUserName(
      this.datePipe.transform(this.fromDate, "yyyy-MM-dd"),
      this.datePipe.transform(this.toDate, "yyyy-MM-dd")
    );
  }

  GetDateRangeWiseUserName(fromDate: any, toDate: any) {
    this.salesUserList = [];
    let element = { id: 0, name: "All" };
    this.salesinvoiceService
      .GetDateRangeWiseUserName(fromDate, toDate)
      .subscribe((returns: any) => {
        console.log(returns.data);
        this.salesUserList = returns.data.map((val: any) => ({
          id: val.salesUserId,
          name: val.userName,
        }));

        if (this.salesUserList.length > 0)
          this.salesUserList.splice(0, 0, element);
      });
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }
  setParam() {
    this.params = [];
    //debugger;
    this.params.push({
      leftLabel: "Branch Name",
      leftValue: this.sbuSelected == undefined ? "All" : this.sbuSelected.name,
      rightLabel: "Total Sales Amount",
      rightValue: "",
    });
    this.params.push({
      leftLabel: "Sales By",
      leftValue:
        this.salesUserSelected == undefined
          ? "All"
          : this.salesUserSelected.name,
      rightLabel: "Customer Name",
      rightValue:
        this.partySelected == undefined ? "All" : this.partySelected.name,
      // rightLabel: "Invoice Number",
      // rightValue:
      // this.salesInvoiceSelected == undefined ? "All" : this.salesInvoiceSelected.name,
    });
    this.params.push({
      leftLabel: "From Invoice Date",
      leftValue: this.datePipe.transform(this.fromDate, "dd-MMM-yyyy"),
      rightLabel: "To Invoice Date",
      rightValue: this.datePipe.transform(this.toDate, "dd-MMM-yyyy"),
    });
  }
  getUesr() {
    // console.log(this.salesUserId)
    // console.log(this.salesUserSelected)
  }
  private getReportData() {
    this.apiUrl = `SalesInvoice/GetSalesInvoiceReportData?salesInvoiceId=${this.salesInvoiceId
      }&partyId=${this.partyId}&salesUserId=${this.salesUserId
      }&fromDate=${this.datePipe.transform(
        this.fromDate,
        "yyyy-MM-dd"
      )}&toDate=${this.datePipe.transform(this.toDate, "yyyy-MM-dd")}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        //debugger;
        this.bodyData = [];
        this.bodyData = returns.data;
        // this.renderHtml(this.bodyData);
        // console.log("Report.bodyData")
        // console.log(this.bodyData)
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  generateReport(buttonAction: any) {
    //debugger;
    this.setParam();
    var fileName = this.pageNavigation + ".pdf";
    this.getReportData();
    this.netTotal = this.bodyData.reduce(
      (accumulator, current) => accumulator + current.grandTotal,
      0
    );
    this.params[0].rightValue = this.netTotal;
    const content = document.getElementById("reportHeader");
    this.commonService.generateSalesReport(buttonAction, fileName, content);
  }

  GenerateSalesReport(salesInvoiceId: any) {
    this.salesinvoiceService
      .GetSalesInvoiceReportById(salesInvoiceId, "Pdf")
      .subscribe((returns: any) => {
        //this.commonService.GenerateBase64ToReport(returns);
        let res = JSON.parse(returns);
        if (res.status) {
          this.commonService.GenerateBase64ToReport(res.data[0].data);
        } else {
          this.toastrService.warning("Message", this.commonService.nodatafound);
        }
      });
  }
}
