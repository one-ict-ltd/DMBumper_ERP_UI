import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { VoucherService } from "app/services/transaction/voucher.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

@Component({
  selector: "ngx-rpt-voucherpreview",
  templateUrl: "./rpt-voucherpreview.component.html",
  styleUrls: ["./rpt-voucherpreview.component.scss"],
})
export class RptVoucherpreviewComponent implements OnInit {

  public pageNavigation = "Search Voucher";
  public tableHeader = [
    "SN",
    "Voucher No",
    "Date",
    "Amount",
    "Created By",
    "Description",
  ];

  public apiUrl = "";
  public bodyData: any = [];
  public params = [];
  public companies = [];
  public companyId: number = 0;
  public vouchertype = [];
  public ledgerTypeItems = [];
  public branch = [];

  public showPaymentSignature: boolean = false;
  public showReceiptSignature: boolean = false;
  public showJournalSignature: boolean = false;
  public showbody: boolean = false;
  public ddlSelected: any;
  public voucherTypeSelected: {};
  public ledgerTypeSelected: {};
  public branchSelected: any;

  public toDateSelected = new Date();
  public fromDateSelected = new Date();

  public workbook: ExcelJS.Workbook;
  public worksheet: any;

  public companyData: any = [];
  public companyName = "";
  public addressLine = "";
  public officeTelephone = "";
  public companyEmail = "";
  public website = "";

  public totalAmount = 0;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private voucherService: VoucherService
  ) {
    this.getDropdownData();
    this.getvouchertype();
    this.getLedgerType();
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
    var voucherType = "All Voucher Type";
    var ledgerType = "All Ledger Type";
    if (this.voucherTypeSelected != null) {
      voucherType = this.voucherTypeSelected["name"];
    }
    if (this.ledgerTypeSelected != null) {
      ledgerType = this.ledgerTypeSelected["name"];
    }
    this.params.push({
      leftLabel: "Date:",
      leftValue: this.fromDateSelected.toString().substring(3, 15) + ' to ' + this.toDateSelected.toString().substring(3, 15),
      rightLabel: "Voucher Type:",
      rightValue: voucherType,
    });
    this.params.push({
      leftLabel: "Ledger Type:",
      leftValue: ledgerType,
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
  public getDropdownData() {
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

  public getvouchertype() {
    this.comboService.getVoucherType().subscribe((returns: any) => {
      this.vouchertype = returns.data.map((val) => ({
        id: val.voucherTypeId,
        name: val.voucherTypeName,
      }));
    });
  }

  public getLedgerType() {
    this.comboService.getLedgertype().subscribe((returns: any) => {
      this.ledgerTypeItems = returns.data.map((val) => ({
        id: val.ledgerTypeId,
        name: val.ledgerTypeName,
      }));
    });
  }

  public getBranch(companyId) {
    this.comboService.getSbuForAccounting(companyId).subscribe((returns: any) => {
      this.branch = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
      this.branchSelected = {
        id: returns.data[0].sbuId,
        name: returns.data[0].sbuName,
      };
    });
  }

  private getReportData() {
    var typeId = 0;
    var ledgerTypeId = 0;
    if (this.voucherTypeSelected != null) {
      typeId = this.voucherTypeSelected["id"];
    }
    if (this.ledgerTypeSelected != null) {
      ledgerTypeId = this.ledgerTypeSelected["id"];
    }

    this.apiUrl = `AccountReport/getRptVoucherListByDate?companyId=${this.ddlSelected.id}&sbuId=${this.branchSelected.id
      }&vouchertypeId=${typeId}&ledgerTypeId=${ledgerTypeId}&fromDate=${this.fromDateSelected.toString().substring(3, 15)}&toDate=${this.toDateSelected
        .toString().substring(3, 15)}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;

        this.totalAmount = 0;
        this.bodyData.forEach(
          (a) => (this.totalAmount += parseFloat(a.voucherAmount)),
        );

      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }
  private onRefresh() {
    this.ddlSelected = null;
    this.companyId = 0;
    this.bodyData = [];
    this.showbody = false;
    this.showPaymentSignature = false;
    this.showReceiptSignature = false;
    this.showJournalSignature = false;
  }
  private onPreview() {
    const fromDate = this.fromDateSelected;
    const toDate = this.toDateSelected;
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
    const fromDate = this.fromDateSelected;
    const toDate = this.toDateSelected;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.getReportDataExcel();
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }
  private onEmail() {
    const fromDate = this.fromDateSelected;
    const toDate = this.toDateSelected;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.toastrService.warning("Message", "email button clicked");
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }

  public generateReport(buttonAction: any) {
    const fromDate = this.fromDateSelected;
    const toDate = this.toDateSelected;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.setParam();
      var fileName = this.pageNavigation + ".pdf";
      this.getReportData();
      const content = document.getElementById("reportHeader");
      this.generatePdfDayBook(buttonAction, fileName, content);
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

  public generatePdfDayBook(buttonAction: any, fileName: string, content: any) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5);
    doc.setTextColor(40);
    var legend = {
      height: 100,
    };

    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
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
            0: { halign: "left", cellWidth: 70, },
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
          startY: legend.height + 75,
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
          },
          columnStyles: {
            0: { halign: "center", cellWidth: 25, },
            1: { cellWidth: 65, },
            2: { cellWidth: 65, },
            3: { halign: "right", cellWidth: 70 },
            4: { cellWidth: 70, },
            5: { cellWidth: 230, },
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
    var typeId = 0;
    if (this.voucherTypeSelected != null) {
      typeId = this.voucherTypeSelected["id"];
    }
    this.apiUrl = `AccountReport/getRptDayBook?companyId=${this.ddlSelected.id}&sbuId=${this.branchSelected.id
      }&vouchertypeId=${typeId}&fromDate=${this.fromDateSelected.toString().substring(3, 15)}&toDate=${this.toDateSelected.toString().substring(3, 15)}`;

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
    let data = objArray.map((item, index) => {
      return [
        index + 1,
        item.voucherNo,
        item.voucherDate,
        item.voucherAmount,
        item.accountName,
        item.fullName,
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

  ////voucherReport

  public vouchertableHeader = [
    "Account Code",
    "Account Name",
    "Sub Ledger",
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
    this.getVoucherReportData(voucherMasterId);
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
            4: { halign: "right" },
            5: { halign: "right" },
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
