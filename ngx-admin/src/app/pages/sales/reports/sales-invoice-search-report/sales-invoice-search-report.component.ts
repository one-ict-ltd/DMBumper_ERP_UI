//import { O } from "@angular/cdk/keycodes";
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
  selector: "ngx-sales-invoice-search-report",
  templateUrl: "./sales-invoice-search-report.component.html",
  styleUrls: ["./sales-invoice-search-report.component.scss"],
})
export class SalesInvoiceSearchReportComponent implements OnInit {
  pageNavigation = "Sales Invoice Search Report";
  rReportHeader = "Sales Invoice(s)";
  tableHeader = [
    "#",
    //"salesInvoiceId",
    "Invoice No.",
    "Invoice Date",
    "Party Name",
    "Mobile No.",
    "Address",
    "Product Name",
    "Product Serial",
    "Barcode No.",
    "UOM",
    "Qty.",
    "Warranty",
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

  ngOnInit(): void {
    //this.fromDate = new Date();
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
  SearchText = "";
  private getReportData() {
    this.bodyData = [];
    if (this.SearchText == "" || this.SearchText == null) {
      this.toastrService.warning("Message", "Please input Search Text");
      //return;
    }
    this.apiUrl = `SalesInvoice/GetSalesInvoiceSearchResult?SearchingText=${this.SearchText
      }&FromDate=${this.commonService.DateFormat(this.fromDate)}&ToDate=${this.datePipe.transform(this.toDate, "yyyy-MM-dd")}`;
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
    //debugger;
    //this.setParam();
    var fileName = this.pageNavigation + ".pdf";
    this.getReportData();
    // this.netTotal = this.bodyData.reduce(
    //   (accumulator, current) => accumulator + current.grandTotal,
    //   0
    // );
    //this.params[0].rightValue = this.netTotal;
    const content = document.getElementById("reportHeader");
    this.generateSalesReport(buttonAction, fileName, content);
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

  public generateSalesReport(
    buttonAction: any,
    fileName: string,
    content: any
    //,address: []
  ) {
    const doc = new jsPDF("l", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(50); //optional
    const legend = {
      height: 100,
    };
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      //var a = doc.internal.setFont("helvetica", "italic");
      doc.setFontSize(8);
      //debugger;
      for (var i = 1; i <= pageCount; i++) {
        // let addressLength = address.length;
        // for (var i = 1; i <= addressLength; i++) {
        //   console.log(address[i]["branchAddress"]);
        // }

        doc.setPage(i);
        doc.text(
          "Page " + String(i) + " of " + String(pageCount),
          doc.internal.pageSize.width / 1.2,
          doc.internal.pageSize.height - 20
        );
        doc.text(
          "Powered by : ONE ERP",
          doc.internal.pageSize.width / 2.3,
          doc.internal.pageSize.height - 20
        );
        doc.text(
          "Printed Date: " +
          new Date().toLocaleDateString() +
          " " +
          new Date().toLocaleTimeString(),
          20,
          doc.internal.pageSize.height - 20
        );
      }
    };

    //////////// TABLE DATA ////////////
    //debugger;
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 20,
          styles: { font: "Meta" },
          headStyles: {
            halign: "center",
            valign: "top",
            fontStyle: "bold",
            textColor: 50,
            fontSize: 20,
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 70,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
            fontSize: 11,
          },
          bodyStyles: {
            //fillColor: [216, 216, 216],
            textColor: 50,
            valign: "middle",
          },
          // columnStyles: {
          //   2: { halign: "center" },
          //   4: { halign: "center" },
          //   5: { halign: "right" },
          //   6: { halign: "right" },
          //   7: { halign: "right" },
          //   8: { halign: "right" },
          //   9: { halign: "right" },
          //   10: { halign: "right" },
          // },
          // alternateRowStyles: {
          //   //fillColor: [250, 250, 250],
          // },
        });

        addFooters(doc);

        ////////////PRINT ////////////
        if (buttonAction == "pdf") {
          doc.save(fileName);
        } else {
          window.open(URL.createObjectURL(doc.output("blob")), "_blank"); //doc.output("dataurlnewwindow");
          doc.close();
        }
      },
    });
  }
}
