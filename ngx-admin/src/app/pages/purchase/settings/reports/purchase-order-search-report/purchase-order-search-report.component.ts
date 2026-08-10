import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommonService } from "app/@core/mock/common.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { StockinService } from "app/services/inventory/stockin.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: "ngx-purchase-order-search-report",
  templateUrl: "./purchase-order-search-report.component.html",
  styleUrls: ["./purchase-order-search-report.component.scss"],
})
export class PurchaseOrderSearchReportComponent implements OnInit {
  pageNavigation = "Purchase Order Search Report";
  rReportHeader = "Purchase Order(s)";
  tableHeader = [
    "#",
    "PO Number.",
    "PO Date",
    "Party Name",
    "Mobile No.",
    "Product Name",
    "Qty.",
    "UOM",
    "Address",
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
    private datePipe: DatePipe,
    private salesinvoiceService: SalesinvoiceService
  ) {}

  ngOnInit(): void {
    this.fromDate.setDate(this.toDate.getDate() - 365);
  }
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
    this.toastrService.warning("Message", "Report not found!");
    // this.getReportData();
    // var fileName = this.pageNavigation + ".xlsx";
    // this.commonService.generateExcel(this.bodyData, this.tableHeader, fileName);
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  SearchText = "";
  private getReportData() {
    this.bodyData = [];
    if (this.SearchText == "" || this.SearchText == null) {
      this.toastrService.warning("Message", "Please input Search Text");
      return;
    }
    this.apiUrl = `PurchaseOrder/GetPOSearchResult?SearchingText=${
      this.SearchText
    }&FromDate=${this.datePipe.transform(
      this.fromDate,
      "yyyy-MM-dd"
    )}&ToDate=${this.datePipe.transform(this.toDate, "yyyy-MM-dd")}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      console.log(returns);
      if (returns.success) {
        //debugger;
        this.bodyData = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  generateReport(buttonAction: any) {
    this.toastrService.warning("Message", "Report not found!");
    // var fileName = this.pageNavigation + ".pdf";
    // this.getReportData();
    // const content = document.getElementById("reportHeader");
    // this.generateSalesReport(buttonAction, fileName, content);
  }

  GenerateReport(salesInvoiceId: any) {
    //   this.salesinvoiceService
    //     .GetSalesInvoiceReportById(salesInvoiceId, "Pdf")
    //     .subscribe((returns: any) => {
    //       this.commonService.GenerateBase64ToReport(returns);
    //     });
  }
}
