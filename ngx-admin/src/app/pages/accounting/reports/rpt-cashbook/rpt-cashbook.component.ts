import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { RptCoaService } from "../../../../services/accounting/reports/rpt-coa.service";
import { VoucherService } from "app/services/transaction/voucher.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: "ngx-rpt-cashbook",
  templateUrl: "./rpt-cashbook.component.html",
  styleUrls: ["./rpt-cashbook.component.scss"],
})
export class RptCashbookComponent implements OnInit {
  public date = new Date().getFullYear();
  public fromdateSelected = new Date();
  public todateSelected = new Date();

  public pageNavigation = "Cash Book";
  public tableHeader = [
    "Date",
    "Particulars",
    "Voucher No",
    "Debit Amount",
    "Credit Amount",
  ];

  public apiUrl = "";
  public bodyData: any = [];
  public bodyDataReceived: any = [];
  public bodyDataTotalReceived: any = [];
  public bodyDataPayment: any = [];
  public bodyDataTotalDr: any = [];
  public bodyDataTotalCr: any = [];
  public params = [];

  public companies = [];
  public branchs = [];
  public ledgers = [];
  public companyId: number = 0;

  public showPaymentSignature: boolean = false;
  public showReceiptSignature: boolean = false;
  public showJournalSignature: boolean = false;
  public showbody: boolean = false;
  public companySelected: any;
  public branchSelected: any;
  public ledgerSelected: any;

  public TotalOBReceived = 0;
  public TotalReceived = 0;
  public TotalPayment = 0;
  public TotalCB = 0;
  public TotalDebit = 0;
  public TotalCredit = 0;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private rptCoaService: RptCoaService,
    private voucherService: VoucherService
  ) {
    this.getCompanyData();
  }

  ngOnInit(): void { }
  public RptButtonAction() {
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

  public setParam() {
    this.params = [];

    var ledgerName = "All Bank Ledger";
    if (this.ledgerSelected != null) {
      ledgerName = this.ledgerSelected["name"];
    }

    this.params.push({
      leftLabel: "Date:",
      leftValue: this.fromdateSelected.toString().substring(3, 15) + ' to ' + this.todateSelected.toString().substring(3, 15),
      rightLabel: "Ledger Name:",
      rightValue: ledgerName,
    });
  }

  public getCompanyData() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companies = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
      this.companySelected = {
        id: returns.data[0].companyId,
        name: returns.data[0].companyName,
      };
      this.getBranch(returns.data[0].companyId);
    });
  }

  public getBranch(companyId) {
    this.comboService.getSbuForAccounting(companyId).subscribe((returns: any) => {
      this.branchs = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
      this.branchSelected = {
        id: returns.data[0].sbuId,
        name: returns.data[0].sbuName,
      };
      this.getLedgerIdData();
    });
  }

  public getLedgerIdData() {
    this.comboService.getLedgersForNoteDetails(this.companySelected.id, this.branchSelected.id, 0, 0, 1)
      .subscribe((returns: any) => {
        this.ledgers = returns.data.map((val) => ({
          id: val.ledgerId,
          name: val.accountName,
        }));
      });
  }

  private getReportData() {
    var ledgerId = 0;
    if (this.ledgerSelected != null) {
      ledgerId = this.ledgerSelected["id"];
    }

    this.apiUrl = `AccountReport/getRptCashBook?companyId=${this.companySelected.id}&sbuId=${this.branchSelected.id}&ledgerId=${ledgerId}&fromDate=${this.fromdateSelected.toString().substring(3, 15)}&toDate=${this.todateSelected.toString().substring(3, 15)}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;

        this.bodyDataReceived = returns.data.filter(
          (item) => item.drAmount != 0
        );
        this.TotalOBReceived = 0;
        this.bodyDataReceived.forEach(
          (a) => (this.TotalOBReceived += parseFloat(a.drAmount))
        );

        this.bodyDataTotalReceived = returns.data.filter(
          (item) => item.voucherTypeName !== "OB" && item.drAmount != 0
        );
        this.TotalReceived = 0;
        this.bodyDataTotalReceived.forEach(
          (a) => (this.TotalReceived += parseFloat(a.drAmount))
        );

        this.bodyDataPayment = returns.data.filter(
          (item) => item.crAmount != 0
        );
        this.TotalPayment = 0;
        this.bodyDataPayment.forEach(
          (a) => (this.TotalPayment += parseFloat(a.crAmount))
        );

        this.TotalCB = this.TotalOBReceived - this.TotalPayment;
        this.TotalDebit = this.TotalOBReceived;
        this.TotalCredit = this.TotalPayment + this.TotalCB;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  private onRefresh() {
    this.companySelected = null;
    this.branchSelected = null;
    this.ledgerSelected = null;
    this.fromdateSelected = new Date();
    this.todateSelected = new Date();
    this.companyId = 0;
    this.bodyData = [];
    this.bodyDataReceived = [];
    this.bodyDataPayment = [];
    this.showbody = false;
    this.showPaymentSignature = false;
    this.showReceiptSignature = false;
    this.showJournalSignature = false;
  }

  private onPreview() {
    const fromDate = this.fromdateSelected;
    const toDate = this.todateSelected;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.getReportData();
      this.showbody = true;
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }

  private onExportCSV() {
    const fromDate = this.fromdateSelected;
    const toDate = this.todateSelected;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.getReportData();
      var fileName = this.pageNavigation + ".xlsx";
      this.commonService.generateExcel(this.bodyData, this.tableHeader, fileName);
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  public generateReport(buttonAction: any) {
    const fromDate = this.fromdateSelected;
    const toDate = this.todateSelected;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.setParam();
      var fileName = this.pageNavigation + ".pdf";
      this.getReportData();
      const content = document.getElementById("reportHeader");
      this.generatePdfCashBook(buttonAction, fileName, content);
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  public generatePdfCashBook(
    buttonAction: any,
    fileName: string,
    content: any
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional

    var legend = {
      height: 100,
      //totalheight:100+datalength,
    };

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
          startY: legend.height + 2,
          styles: { font: "Meta", fontSize: 14, halign: "center" },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 25,
          styles: { font: "Meta", fontSize: 11 },
          columnStyles: {
            0: { halign: "left", cellWidth: 40, },
            1: { halign: "left", cellWidth: 160, },
            2: { halign: "left", cellWidth: 80, },
            3: { halign: "left", cellWidth: 250, },
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 55,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontSize: 11,
            halign: "center",
            valign: "middle",
            fontStyle: "bold",
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
            // halign:"right"
          },
          columnStyles: {
            0: { cellWidth: 65 },
            1: { cellWidth: 250 },
            2: { cellWidth: 70 },
            3: { halign: "right", cellWidth: 65 },
            4: { halign: "right", cellWidth: 65 },
          },

          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
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


  ////voucherReport

  public vouchertableHeader = [
    "Account Code",
    "Account Name",
    // "Sub Ledger Name",
    "Cost Centre Name",
    "Debit (Tk)",
    "Credit (Tk)",
  ];
  public datalength: number;
  public TDR = 0;
  public TCR = 0;
  public AmountInWord = "";
  public Narration = "";
  public VoucherNo = "";
  public VoucherDate = "";
  public voucherTypeName = "";
  public CreatedBy = "";
  public bodyDataVoucher: any = [];

  public setParamVoucher() {
    this.params = [];
    this.params.push({
      leftLabel: "Voucher No",
      leftValue: "",
      rightLabel: "Voucher Date",
      rightValue: "",
    });
  }

  public generateVoucherReport(voucherMasterId) {
    //this.getVoucherReportData(voucherMasterId);
    this.getCrReportForVoucher(voucherMasterId);
  }

  private getCrReportForVoucher(voucherMasterId: any, reportFormat: any = 'pdf') {
    this.apiUrl = `AccountsReport/GetVoucherReportById?voucherMasterId=${voucherMasterId}&reportFormat=${reportFormat}`;
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      this.commonService.GenerateBase64ToReport(returns);
    });
  }

  private getVoucherReportData(voucherMasterId) {
    this.voucherService
      .getVoucherReportById(voucherMasterId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.bodyDataVoucher = returns.data;
          this.datalength = returns.data.length * 50;
          this.TDR = 0;
          this.TCR = 0;
          this.bodyDataVoucher.forEach(
            (a) => (this.TDR += parseFloat(a.drAmount))
          );
          this.bodyDataVoucher.forEach(
            (a) => (this.TCR += parseFloat(a.crAmount))
          );
          this.VoucherNo = this.bodyDataVoucher[0].voucherNo;
          this.VoucherDate = this.bodyDataVoucher[0].voucherDate;
          this.Narration = this.bodyDataVoucher[0].remarks;
          this.AmountInWord = this.bodyDataVoucher[0].amountInWord;
          this.voucherTypeName = this.bodyDataVoucher[0].voucherTypeName;
          this.CreatedBy = this.bodyDataVoucher[0].fullName;

          if (this.voucherTypeName == "PAYMENT") {
            this.showReceiptSignature = false;
            this.showJournalSignature = false;
            this.showPaymentSignature = true;
          }
          else if (this.voucherTypeName == "RECEIPT") {
            this.showJournalSignature = false;
            this.showPaymentSignature = false;
            this.showReceiptSignature = true;
          }
          else {
            this.showPaymentSignature = false;
            this.showReceiptSignature = false;
            this.showJournalSignature = true;
          }

          this.setParamVoucher();
          var fileName = this.pageNavigation + ".pdf";
          const content = document.getElementById("reportHeader");
          this.generatePdfVoucherReport("print", fileName, content, this.datalength);

          // this.showbody = true;

        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
  }

  public generatePdfVoucherReport(
    buttonAction: any,
    fileName: string,
    content: any,
    datalength: number
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional

    var legend = {
      height: 100,
      totalheight: 100 + datalength,
    };
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

    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table_top_voucher",
          startY: legend.height + 20,
          styles: { font: "Meta", fontSize: 14, halign: "center" },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
        });

        autoTable(doc, {
          html: "#header_table_voucher",
          startY: legend.height + 60,
          styles: { font: "Meta", fontSize: 11 },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
        });

        autoTable(doc, {
          html: "#body_table_Voucher",
          startY: legend.height + 100,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontSize: 11,
            halign: "center",
            valign: "middle",
            fontStyle: "bold",
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
            // halign:"right"
          },
          columnStyles: {
            4: { halign: "right" },
            3: { halign: "right" },
          },

          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#footer_table",
          //startY: legend.totalheight + 300,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [105, 105, 105],
            fontSize: 11,
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
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
