
import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommonService } from "app/@core/mock/common.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { StockinwithbarcodeService } from "app/services/inventory/stockinwithbarcode.service";
// import { StockinService } from "app/services/inventory/stockin.service";
// import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: 'ngx-stock-in-details-search-report',
  templateUrl: './stock-in-details-search-report.component.html',
  styleUrls: ['./stock-in-details-search-report.component.scss']
})
export class StockInDetailsSearchReportComponent implements OnInit {
  pageNavigation = "Stock-In Details Search Report";
  rReportHeader = "Stock-In Details Search Report";
  tableHeader = [
    "#",
    "Store Name",
    "Stock In Date",
    "Product Name",
    "Receive Qty.",
    "UOM",
    "purchasePrice",
    "Barcode No.",
    "Product Serial",
    "Party Name",
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
    //private stockinService: StockinService,
    //private menuService: MenuService,
    //private producttransferService: ProducttransferService,

    private datePipe: DatePipe,
    //private salesinvoiceService: SalesinvoiceService
    private StockinwithbarcodeService: StockinwithbarcodeService
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
    // if (this.SearchText == "" || this.SearchText == null) {
    //   this.toastrService.warning("Message", "Please input Search Text");
    //   return;
    // }
    this.apiUrl = `StockInWithBarcode/GetStockInDetailsReportData?SearchingText=${this.SearchText}&fDate=${this.commonService.DateFormat(this.fromDate)}&tDate=${this.commonService.DateFormat(this.toDate)}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      console.log(returns);
      debugger;
      if (returns.success) {
        this.bodyData = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  generateReport(buttonAction: any) {
    //debugger;
    var fileName = this.pageNavigation + ".pdf";
    this.getReportData();
    const content = document.getElementById("reportHeader");
    this.generateSalesReport(buttonAction, fileName, content);
  }

  // GenerateSalesReport(salesInvoiceId: any) {
  //   this.StockinwithbarcodeService
  //     .GetStockInDetailsReportData('','','')
  //     .subscribe((returns: any) => {
  //       this.commonService.GenerateBase64ToReport(returns);
  //     });
  // }

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
