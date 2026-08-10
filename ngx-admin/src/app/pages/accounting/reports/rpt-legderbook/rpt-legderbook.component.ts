import { Component, OnInit } from "@angular/core";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { RptCoaService } from "../../../../services/accounting/reports/rpt-coa.service";
import { VoucherService } from "app/services/transaction/voucher.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

@Component({
  selector: "ngx-rpt-legderbook",
  templateUrl: "./rpt-legderbook.component.html",
  styleUrls: ["./rpt-legderbook.component.scss"],
})
export class RptLegderbookComponent implements OnInit {
  public pageNavigation = "Ledger Book";
  public tableHeader = [
    // "#",
    "Date",
    "Voucher No",
    // "Voucher Type",
    // "Account Code",
    "Particulars",
    "Party Name",
    "Debit Amount",
    "Credit Amount",
  ];

  public apiUrl = "";
  public bodyData: any = [];
  public params = [];

  public companies = [];
  public ledgers = [];
  public parties = [];
  public branchs = [];
  public reportTypeItems = [];

  public companyId: number = 0;
  public ledgerId: number = 0;
  public isRange: number = 0;
  public ledgerFrom: number = null;
  public ledgerTo: number = null;
  public showRange: boolean = false;
  public showLedger: boolean = true;

  fledgerSelected = {};
  tledgerSelected = {};

  public onCheckboxChange(e) {
    if (e.target.checked) {
      this.showRange = true;
      this.showLedger = false;
      this.ledgerId = 0;
      this.ledgerSelected = null;
    } else {
      this.showRange = false;
      this.showLedger = true;
      this.ledgerFrom = 0;
      this.ledgerTo = 0;
      this.fledgerSelected = null;
      this.tledgerSelected = null;
    }
  }

  public showPaymentSignature: boolean = false;
  public showReceiptSignature: boolean = false;
  public showJournalSignature: boolean = false;
  public showbody: boolean = false;
  public ddlSelected: any;
  public ledgerSelected: any;
  public partySelected: {};
  public branchSelected: any;
  public reportTypeSelected: any;

  public fromdateSelected = new Date();
  public todateSelected = new Date();

  public workbook: ExcelJS.Workbook;
  public worksheet: any;

  public companyData: any = [];
  public companyName = "";
  public addressLine = "";
  public officeTelephone = "";
  public companyEmail = "";
  public website = "";

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private rptCoaService: RptCoaService,
    private voucherService: VoucherService
  ) {
    this.getDropdownData();
    this.getParties();
    this.getDdlRptReportType();
    this.getCompanyAddress();
  }

  ngOnInit(): void { }
  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      this.generateReport("pdf");
    } else if (clicked == "print") {
      this.generateReport("pdf");
    } else if (clicked == "csv") {
      this.generateReport("Excel");//this.onExportCSV();
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
    var partyName = "";
    var partyNameHeader = "";
    var ledgerName = "All Ledger";
    if (this.partySelected != null) {
      partyName = this.partySelected["name"];
      partyNameHeader = "Party Name:"
    }
    if (this.ledgerSelected != null) {
      ledgerName = this.ledgerSelected["name"];
    }
    // this.params.push({
    //   leftLabel: "Company Name",
    //   leftValue: this.ddlSelected.name,
    //   rightLabel: "Branch Name",
    //   rightValue: this.branchSelected.name,
    // });
    this.params.push({
      leftLabel: "Ledger Name:",
      leftValue: ledgerName,
      rightLabel: "Date:",
      rightValue: this.fromdateSelected.toString().substring(3, 15) + ' to ' + this.todateSelected.toString().substring(3, 15),
    });
  }
  private getCompanyAddress() {
    this.comboService.getCompanybyId().subscribe((returns: any) => {
      this.companyData = returns.data;
      this.companyName = this.companyData[0].companyName;
      this.addressLine = this.companyData[0].addressLine;
      this.officeTelephone = this.companyData[0].officeTelephone;
      this.companyEmail = this.companyData[0].companyEmail;
      this.website = this.companyData[0].website;
    });
  }
  private getDropdownData() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companies = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
      this.ddlSelected = {
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

  public getDdlRptReportType() {
    this.comboService.getDdlRptReportType().subscribe((returns: any) => {
      returns.data.push({
        id: "Details with Narration",
        name: "Details with Narration",
      });

      this.reportTypeItems = returns.data.map((val) => ({
        id: val.id,
        name: val.name,
      }));
      // this.reportTypeItems.push({
      //   id: "Details with Narration",
      //   name: "Details with Narration",
      // });
    });

  }
  public getLedgerIdData() {
    this.comboService.getLedgersForVoucher(this.ddlSelected.id, this.branchSelected.id).subscribe((returns: any) => {
      //console.log('ledgers', returns.data)
      this.ledgers = returns.data.map((val) => ({
        id: val.ledgerId,
        name: val.accountCode + " - " + val.accountName + "",
        code: val.accountCode,
      }));
    });
  }
  private getParties() {
    this.comboService.GetPartyForAccountingByIdJson().subscribe((returns: any) => {
      //debugger
      //console.log("party count", returns.data.length)
      this.parties = returns.data.map((val) => ({
        id: val.partyId,
        name: val.partyName,
      }));
      console.log("party count done")
    });
  }

  private getReportData() {
    debugger;
    const fromDate = this.fromdateSelected;
    const toDate = this.todateSelected;
    if (this.commonService.validateDates(fromDate, toDate)) {
      //console.log('this.ledgerFrom, this.ledgerTo', this.ledgerFrom, this.ledgerTo, this.fledgerSelected, this.tledgerSelected);
      var partyId = 0;
      if (this.partySelected != null) {
        partyId = this.partySelected["id"];
      }
      //var ledgerId = 0;
      // if (this.ledgerSelected != null) {
      //   ledgerId = this.ledgerSelected["id"];
      // }
      if (this.reportTypeSelected == "" || this.reportTypeSelected == null) {
        this.toastrService.danger("Please select report type", "Message");
        return;
      }
      // if (this.reportTypeSelected.id == "Detail" && ledgerId == 0) {
      //   this.toastrService.danger("Please select ledger", "Message");
      //   return;
      // }
      ////////// Call common service for report data/////////
      this.apiUrl = `AccountReport/getRptLedgerBook?companyId=${this.ddlSelected.id
        }&sbuId=${this.branchSelected.id
        }&ledgerId=${this.ledgerId}&partyId=${partyId}&fromDate=${this.fromdateSelected
          .toString()
          .substring(3, 15)}&toDate=${this.todateSelected
            .toString()
            .substring(3, 15)}&reportType=${this.reportTypeSelected.id}&LedgerFrom=${this.ledgerFrom}&LedgerTo=${this.ledgerTo}`;
      this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
        if (returns.success) {
          //console.log('returns', returns.data);
          this.bodyData = returns.data;
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }
  private onRefresh() {
    this.ddlSelected = null;
    this.ledgerSelected = null;
    this.partySelected = null;
    this.branchSelected = null;
    this.fromdateSelected = new Date();
    this.todateSelected = new Date();
    this.companyId = 0;
    this.bodyData = [];
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
      this.getReportDataExcel();
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }
  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  public generateReport(reportFormat: any) {
    const fromDate = this.fromdateSelected;
    const toDate = this.todateSelected;
    if (this.commonService.validateDates(fromDate, toDate)) {
      /*
      this.setParam();
      var fileName = this.pageNavigation + ".pdf";
      this.getReportData();
      const content = document.getElementById("reportHeader");
      this.generatePdfLedgerBook(buttonAction, fileName, content);
      */

      this.getCrReport(reportFormat);
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }

  }

  private getCrReport(reportFormat: any = 'pdf') {

    var partyId = 0;
    var ledgerId = 0;
    if (this.partySelected != null) {
      partyId = this.partySelected["id"];
    }
    if (this.ledgerSelected != null) {
      ledgerId = this.ledgerSelected["id"];
    }
    if (this.reportTypeSelected == "" || this.reportTypeSelected == null) {
      this.toastrService.danger("Please select report type", "Message");
      return;
    }
    // if (this.reportTypeSelected.id == "Detail" && ledgerId == 0) {
    //   this.toastrService.danger("Please select ledger", "Message");
    //   return;
    // }


    this.apiUrl = `AccountsReport/GetRptLedgerBook?companyId=${this.ddlSelected.id}&sbuId=${this.branchSelected.id}&ledgerId=${ledgerId}&partyId=${partyId}&fromDate=${this.commonService.DateFormat(this.fromdateSelected)}&toDate=${this.commonService.DateFormat(this.todateSelected)}&reportType=${this.reportTypeSelected.id}&LedgerFrom=${this.ledgerFrom}&LedgerTo=${this.ledgerTo}&reportFormat=${reportFormat}`;


    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      this.commonService.GenerateBase64ToReport(returns);
    });
  }

  currencyFormatter(currency: number = 0) {
    //debugger;
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  public generatePdfLedgerBook(
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
            0: { halign: "left", },
            1: { halign: "left", fontStyle: "bold", textColor: [0, 0, 0], },
            2: { halign: "left", },
            3: { halign: "left", fontStyle: "bold", textColor: [0, 0, 0], },
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 50,
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
            3: { halign: "right" },
            4: { halign: "right" },
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
    //debugger;
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
    //debugger;
    this.voucherService
      .getVoucherReportById(voucherMasterId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.bodyDataVoucher = returns.data;
          this.datalength = returns.data.length * 50;
          //debugger;
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
            3: { halign: "right" },
            4: { halign: "right" },
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

  // Excel
  private getReportDataExcel() {
    var partyId = 0;
    var ledgerId = 0;
    if (this.partySelected != null) {
      partyId = this.partySelected["id"];
    }
    if (this.ledgerSelected != null) {
      ledgerId = this.ledgerSelected["id"];
    }
    if (this.reportTypeSelected == "" || this.reportTypeSelected == null) {
      this.toastrService.danger("Please select report type", "Message");
      return;
    }
    // if (this.reportTypeSelected.id == "Detail" && ledgerId == 0) {
    //   this.toastrService.danger("Please select ledger", "Message");
    //   return;
    // }
    ////////// Call common service for report data/////////
    this.apiUrl = `AccountReport/getRptLedgerBook?companyId=${this.ddlSelected.id}&sbuId=${this.branchSelected.id
      }&ledgerId=${ledgerId}&partyId=${partyId}&fromDate=${this.fromdateSelected.toString().substring(3, 15)}&toDate=${this.todateSelected.toString().substring(3, 15)}&reportType=${this.reportTypeSelected.id}&LedgerFrom=${this.ledgerFrom}&LedgerTo=${this.ledgerTo}`;

    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
        var fileName = this.pageNavigation + ".xlsx";
        this.generateExcelPR(this.bodyData, this.tableHeader, fileName);
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  public generateExcelPR(objArray: any, header: any, fileName: string) {
    //debugger;
    let data = objArray.map((item, index) => {
      return [
        // index + 1,
        item.voucherDate,
        item.voucherNo,
        // item.voucherTypeName,
        // item.accountCode,
        item.accountName,
        item.partyName,
        item.drAmount,
        item.crAmount,
      ];
    });

    var alphabet = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];
    var count = header.length;
    var endColumn = alphabet[count - 1];
    this.workbook = new ExcelJS.Workbook();

    // Set Workbook Properties
    this.workbook.creator = "Web";
    this.workbook.lastModifiedBy = "Web";
    this.workbook.created = new Date();
    this.workbook.modified = new Date();
    this.workbook.lastPrinted = new Date();

    // Add a Worksheet
    this.worksheet = this.workbook.addWorksheet(fileName);

    //Add Header Row
    let headerName = this.worksheet.addRow([this.companyName]);
    headerName.font = { size: 16, underline: "double", bold: true };
    headerName.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${headerName.number}:${endColumn + headerName.number}`
    );

    let headerAddress = this.worksheet.addRow([this.addressLine]);
    headerAddress.font = { size: 10 };
    headerAddress.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${headerAddress.number}:${endColumn + headerAddress.number}`
    );

    let headerPhone = this.worksheet.addRow([
      this.officeTelephone,
    ]);
    headerPhone.font = { size: 10 };
    headerPhone.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${headerPhone.number}:${endColumn + headerPhone.number}`
    );

    let headerWebsite = this.worksheet.addRow([
      this.companyEmail + "; " + this.website,
    ]);
    headerWebsite.font = { size: 10 };
    headerWebsite.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${headerWebsite.number}:${endColumn + headerWebsite.number}`
    );

    headerName.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCCFFE5" },
    };
    headerName.getCell(1).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    this.worksheet.addRow([]);
    var tableHeaderRow = this.worksheet.addRow(header);
    header.map((item, index) => {
      tableHeaderRow.getCell(index + 1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "696969" },
      };
      tableHeaderRow.getCell(index + 1).font = {
        bold: true,
        size: 12,
        family: 4,
        color: { argb: "FFFFFF" },
      };
    });

    this.worksheet.addRows(data);

    this.worksheet.addRow([]);
    //Footer Row
    let footerRow = this.worksheet.addRow([
      "This excel sheet is generated by ONE ERP.",
    ]);
    footerRow.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCCFFE5" },
    };
    footerRow.getCell(1).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    //Merge Cells
    footerRow.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${footerRow.number}:${endColumn + footerRow.number}`
    );
    // Generate Excel File
    this.workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      // Given name
      FileSaver.saveAs(blob, fileName);
    });
  }
}
