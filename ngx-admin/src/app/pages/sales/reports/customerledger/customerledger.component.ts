import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: "ngx-customerledger",
  templateUrl: "./customerledger.component.html",
  styleUrls: ["./customerledger.component.scss"],
})
export class CustomerledgerComponent implements OnInit {
  public date = new Date().getFullYear();
  public fromdateSelected = new Date();
  public todateSelected = new Date();

  public yearName = this.date;
  public prevYearName = this.date - 1;

  public pageNavigation = "Customer Ledger";
  public tableHeader = [
    "Date",
    this.yearName + " (Tk.)",
    "Previous Year (Tk.)",
  ];

  public apiUrl = "";
  public bodyData: any = [];
  public bodyDataCollection: any = [];
  public bodyDataPayment: any = [];
  public params = [];

  public parties = [];
  public branchs = [];
  public companyId: number = 0;

  public showbody: boolean = false;
  public partySelected: any;
  public branchSelected: any;

  public TotalReceived = 0;
  public TotalPayment = 0;
  fDate: Date;
  tDate: Date;
  showDateRange: boolean = false;
  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService
  ) {
    this.fDate = (this.commonService.GetAnyMonthAndDateOfYear(12, 1));
    this.tDate = new Date();
    this.getCustomerData();
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
    if (this.partySelected == null || this.partySelected == undefined) {
      this.toastrService.warning("Message", "Please select a customer");
      return;
    }
    this.apiUrl = `SalesInvoiceReport/GetCustomerLedger?partyId=${this.partySelected.id}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&reportFormat=${reportFormat}`;

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

  public getCustomerData() {
    debugger;
    this.comboService.GetPartyForDropdownJson().subscribe((returns: any) => {
      if (returns.status) {
        console.log(returns);
        this.parties = returns.data.map((val) => ({
          id: val.partyId,
          //name: val.partyName,
          name: val.partyCodeName,
        }));
      }
    });
  }

  public totalInvoice = 0.0;
  public totalCollection = 0.0;
  public totalBalance = 0.0;

  private getReportData() {
    debugger;
    this.apiUrl = `SalesInvoice/GetInvoiceListByPartyId?partyId=${this.partySelected.id}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}`;

    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
        this.totalInvoice = 0;
        this.bodyData.forEach(
          (a) => (this.totalInvoice += parseFloat(a.grandTotal))
        );
        this.totalBalance = this.totalInvoice - this.totalCollection;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });

    this.apiUrl = `SalesCollection/GetCollectionListByPartyId?partyId=${this.partySelected.id}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyDataCollection = returns.data;
        this.totalCollection = 0;
        this.bodyDataCollection.forEach(
          (a) => (this.totalCollection += parseFloat(a.collectionamount))
        );
        this.totalBalance = 0;
        this.totalBalance = this.totalInvoice - this.totalCollection;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  private onRefresh() {
    this.partySelected = null;
    this.branchSelected = null;
    this.fromdateSelected = new Date();
    this.todateSelected = new Date();
    this.companyId = 0;
    this.bodyData = [];
    this.bodyDataCollection = [];
    this.bodyDataPayment = [];
    this.showbody = false;
  }

  private onPreview() {
    this.getReportData();
    this.showbody = true;
  }

  private onExportCSV() {
    this.getReportData();
    var fileName = this.pageNavigation + ".xlsx";
    this.commonService.generateExcel(this.bodyData, this.tableHeader, fileName);
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }
  public datalength = 0;
  public generateReport(buttonAction: any) {
    this.setParam();
    var fileName = this.pageNavigation + ".pdf";
    this.getReportData();
    const content = document.getElementById("reportHeader");
    this.datalength = 0;
    this.datalength =
      this.bodyData.length > this.bodyDataCollection.length
        ? this.bodyData.length
        : this.bodyDataCollection.length;

    if (this.datalength > 0)
      this.generatePdfCashBook(
        buttonAction,
        fileName,
        content,
        this.datalength
      );
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  getYearName(e) {
    //debugger;
    this.yearName = e.getFullYear();
    this.prevYearName = e.getFullYear() - 1;
  }

  public generatePdfCashBook(
    buttonAction: any,
    fileName: string,
    content: any,
    datalength: number
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional

    let lTableHeight = 0;
    let rTableHeight = 0;

    let legend = {
      height: 100,
      totalheight: datalength * 100,
    };
    //debugger;
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      //var a = doc.internal.setFont("helvetica", "italic");
      doc.setFontSize(8);
      for (var i = 1; i <= pageCount; i++) {
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
    // legend.totalheight=legend.height+this.datalength;
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table_top",
          startY: legend.height + 30,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
        });
        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 80,
          styles: { font: "Meta" },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 120,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          tableWidth: 250,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [250, 250, 250],
            fontSize: 11,
            halign: "center",
            textColor: 50,
          },
          bodyStyles: {
            fillColor: [250, 250, 250],
            textColor: 50,
            // halign:"right"
          },
          columnStyles: {
            //  0: { halign: "center" },
            // 3: { halign: "right" },
            2: { halign: "right" },
          },

          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
          didDrawPage: function (d) {
            lTableHeight = d.cursor.y;
          },
        });
        autoTable(doc, {
          html: "#body_table_collection",

          startY: legend.height + 120,
          margin: 300,

          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          tableWidth: 250,

          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
            textColor: 50,
          },
          headStyles: {
            fillColor: [250, 250, 250],
            fontSize: 11,
            halign: "center",
          },
          bodyStyles: {
            fillColor: [250, 250, 250],
            textColor: 50,
            // halign:"right"
          },
          columnStyles: {
            //  0: { halign: "center" },
            // 3: { halign: "right" },
            2: { halign: "right" },
          },

          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
          didDrawPage: function (d) {
            rTableHeight = d.cursor.y;
          },
        });

        legend.totalheight =
          lTableHeight > rTableHeight ? lTableHeight : rTableHeight;

        autoTable(doc, {
          html: "#header_table_botom",
          startY: legend.totalheight + 30,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
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
