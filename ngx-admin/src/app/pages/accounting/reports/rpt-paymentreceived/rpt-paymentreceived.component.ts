import { Component, OnInit, TemplateRef } from "@angular/core";
import {
  NbDialogService,
  NbToastrService,
  NbDatepickerModule,
} from "@nebular/theme";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { CommoncomboService } from "app/services/commoncombo.service";
import { VoucherService } from "app/services/transaction/voucher.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { from } from "rxjs";
import { CommonService } from "../../../../@core/mock/common.service";
import { RptCoaService } from "../../../../services/accounting/reports/rpt-coa.service";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: "ngx-rpt-paymentreceived",
  templateUrl: "./rpt-paymentreceived.component.html",
  styleUrls: ["./rpt-paymentreceived.component.scss"],
})
export class RptPaymentreceivedComponent implements OnInit {
  public date = new Date().getFullYear();
  public fromdateSelected = new Date();
  public todateSelected = new Date();

  public yearName = this.date;
  public prevYearName = this.date - 1;

  public pageNavigation = "Payment Received";
  public tableHeader = [
    "#",
    "Account Name",
    "Account Code",
    "Opening Balance (Tk.)",
    "Payment (Tk.)",
    "Receive (Tk.)",
    "Closing Balance (Tk.)",
  ];
  public tableHeaderL = [
    "#",
    "Date",
    "Voucher No",
    "Voucher Type",
    "Account Code",
    "Account Name",
    "Party Name",
    "Debit Amount",
    "Credit Amount",
    "Action",
  ];
  public tableHeaderLL = [
    "#",
    "Date",
    "Voucher No",
    "Voucher Type",
    "Account Code",
    "Account Name",
    "Party Name",
    "Debit Amount",
    "Credit Amount",
  ];
  public tableHeaderV = [
    "#",
    "Account Name",
    "Party Name",
    "Cost Centre Name",
    "Dr Amount tk",
    "Cr Amount tk",
  ];
  public apiUrl = "";
  public bodyData: any = [];
  public bodyDataL: any = [];
  public bodyDataLL: any = [];
  public bodyDataV: any = [];
  public bodyDataExpense: any = [];
  public params = [];

  public companies = [];
  public branchs = [];
  public companyId: number = 0;

  public showbody: boolean = false;
  public companySelected: any;
  public branchSelected: any;

  public TotalIncome = 0;
  public TotalExpense = 0;
  public NetProfit = 0;

  public TotalIncomePrevYear = 0;
  public TotalExpensePrevYear = 0;
  public NetProfitPrevYear = 0;
  public TotalOpening = 0;
  public TotalPayment = 0;
  public TotalReceived = 0;
  public TotalClosing = 0;
  public workbook: ExcelJS.Workbook;
  public worksheet: any;
  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private rptCoaService: RptCoaService,
    private voucherService: VoucherService,
    private dialogService: NbDialogService
  ) {
    this.getCompanyData();
  }

  ngOnInit(): void {
    // this.commonService.valueSet("rpt");
  }

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
    this.params.push({
      leftLabel: "Company",
      leftValue: this.companySelected.name,
      rightLabel: "Branch",
      rightValue: this.branchSelected.name,
    });
    this.params.push({
      leftLabel: "From Date",
      leftValue: this.fromdateSelected.toString().substring(3, 15),
      rightLabel: "To Date",
      rightValue: this.todateSelected.toString().substring(3, 15),
    });
  }

  public getCompanyData() {
    this.comboService.getCompany().subscribe((returns: any) => {
      //debugger;
      this.companies = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  public getBranch(companyId) {
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      //debugger;
      this.branchs = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }

  private getReportData() {
    //debugger;
    this.apiUrl = `AccountReport/getRptPaymentReceived?companyId=${this.companySelected.id
      }&sbuId=${this.branchSelected.id}&fromDate=${this.fromdateSelected
        .toString()
        .substring(3, 15)}&toDate=${this.todateSelected
          .toString()
          .substring(3, 15)}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        //debugger;
        this.bodyData = returns.data;
        this.TotalOpening = 0;
        this.TotalClosing = 0;
        this.TotalPayment = 0;
        this.TotalReceived = 0;
        this.bodyData.forEach(
          (a) => (this.TotalOpening += parseFloat(a.OpeningBalance))
        );
        this.bodyData.forEach(
          (a) => (this.TotalClosing += parseFloat(a.ClosingBalance))
        );
        this.bodyData.forEach(
          (a) => (this.TotalPayment += parseFloat(a.Payment))
        );
        this.bodyData.forEach(
          (a) => (this.TotalReceived += parseFloat(a.Received))
        );
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }
  private getReportDataPR() {
    //debugger;
    this.apiUrl = `AccountReport/getRptPaymentReceived?companyId=${this.companySelected.id
      }&sbuId=${this.branchSelected.id}&fromDate=${this.fromdateSelected
        .toString()
        .substring(3, 15)}&toDate=${this.todateSelected
          .toString()
          .substring(3, 15)}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        //debugger;
        this.bodyData = returns.data;
        this.TotalOpening = 0;
        this.TotalClosing = 0;
        this.TotalPayment = 0;
        this.TotalReceived;
        this.bodyData.forEach(
          (a) => (this.TotalOpening += parseFloat(a.OpeningBalance))
        );
        this.bodyData.forEach(
          (a) => (this.TotalClosing += parseFloat(a.ClosingBalance))
        );
        this.bodyData.forEach(
          (a) => (this.TotalPayment += parseFloat(a.Payment))
        );
        this.bodyData.forEach(
          (a) => (this.TotalReceived += parseFloat(a.Received))
        );
        var fileName = this.pageNavigation + ".xlsx";
        this.generateExcelPR(this.bodyData, this.tableHeader, fileName);
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  private onRefresh() {
    this.companySelected = null;
    this.branchSelected = null;
    this.fromdateSelected = new Date();
    this.todateSelected = new Date();
    this.companyId = 0;
    this.bodyData = [];

    this.bodyDataExpense = [];
    this.showbody = false;
  }

  private onPreview() {
    this.getReportData();
    this.showbody = true;
  }

  private onExportCSV() {
    this.getReportDataPR();
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  public generateReport(buttonAction: any) {
    this.setParam();
    //debugger;
    var fileName = this.pageNavigation + ".pdf";
    this.getReportData();
    const content = document.getElementById("reportHeader");
    this.generateReportPR(buttonAction, fileName, content);
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
  public generateReportPR(buttonAction: any, fileName: string, content: any) {
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
          startY: legend.height + 20,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 60,
          styles: { font: "Meta" },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 140,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
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
            fillColor: [216, 216, 216],
            textColor: 50,
            // halign:"right"
          },
          columnStyles: {
            2: { halign: "right" },
            3: { halign: "right" },
            4: { halign: "right" },
            5: { halign: "right" },
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
  data: Country[] = [
    {
      name: "Russia",
      flag: "f/f3/Flag_of_Russia.svg",
      area: 17075200,
      population: 146989754,
    },
    {
      name: "Canada",
      flag: "c/cf/Flag_of_Canada.svg",
      area: 9976140,
      population: 36624199,
    },
    {
      name: "United States",
      flag: "a/a4/Flag_of_the_United_States.svg",
      area: 9629091,
      population: 324459463,
    },
    {
      name: "China",
      flag: "f/fa/Flag_of_the_People%27s_Republic_of_China.svg",
      area: 9596960,
      population: 1409517397,
    },
  ];
  names: any;
  selectedRow: any;
  selectedRowL: any;
  openWithDataModel() {
    this.dialogService
      .open(DialogNamePromptComponent)
      .onClose.subscribe((name) => name && this.names.push(name));
  }
  public openWithDataObjModel(dialog: TemplateRef<any>) {
    //debugger;
    this.dialogService.open(dialog, {
      context: this.data,
    });
  }
  private showLedgerBook(dialog: TemplateRef<any>, rowIndex) {
    //debugger;
    //  this.commonService.valueSet('modalrpt');
    this.bodyDataL = [];
    this.selectedRow = this.bodyData[rowIndex];
    this.openWithDataObjModel(dialog);
    this.apiUrl = `AccountReport/getRptLedgerBook?companyId=${this.selectedRow.CompanyId}&sbuId=${this.selectedRow.SbuId}&ledgerId=${this.selectedRow.LedgerId}&partyId=0&fromDate=${this.selectedRow.FromDate}&toDate=${this.selectedRow.ToDate}`;
    //debugger;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      //debugger;
      if (returns.success) {
        this.bodyDataL = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  public showvoucher(voucherMasterId) {
    //debugger;

    this.selectedRowL = this.bodyDataL[voucherMasterId];
    this.getReportDataV(this.selectedRowL.voucherMasterId);
  }
  public setParamV() {
    this.params = [];
    this.params.push({
      leftLabel: "Voucher No",
      leftValue: "",
      rightLabel: "Voucher Date",
      rightValue: "",
    });
  }
  public TDR = 0;
  public TCR = 0;
  public AmountInWord = "";
  public Narration = "";
  public VoucherNo = "";
  public VoucherDate = "";
  public datalength: number;
  private getReportDataV(voucherMasterId) {
    //debugger;

    this.voucherService
      .getVoucherReportById(voucherMasterId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.bodyDataV = returns.data;
          this.datalength = returns.data.length * 50;
          //debugger;
          this.TDR = 0;
          this.TCR = 0;
          returns.data.forEach((a) => (this.TDR += parseFloat(a.drAmount)));
          returns.data.forEach((a) => (this.TCR += parseFloat(a.crAmount)));
          this.VoucherNo = returns.data[0].voucherNo;
          this.VoucherDate = returns.data[0].voucherDate;
          this.Narration = returns.data[0].remarks;
          this.AmountInWord = returns.data[0].amountInWord;
          this.setParamV();
          var fileName = this.pageNavigation + ".pdf";
          const content = document.getElementById("reportHeader");
          this.generateReportV("print", fileName, content, this.datalength);
          // this.showbody = true;
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
  }
  public generateReportV(
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
    // legend.totalheight=legend.height+this.datalength;
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_tableV",
          startY: legend.height + 20,
          styles: { font: "Meta" },
        });

        autoTable(doc, {
          html: "#body_tableV",
          startY: legend.height + 50,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
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
            fillColor: [216, 216, 216],
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
          startY: legend.totalheight + 300,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
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
            fillColor: [216, 216, 216],
            textColor: 50,
            // halign:"right"
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

  public generateReportL(buttonAction: any) {
    //debugger;

    if (buttonAction == "csv") {
      this.onExportCSVL();
    } else {
      var fileName = this.pageNavigation + ".pdf";
      this.setParamL();
      this.getReportDataL(
        this.selectedRow.CompanyId,
        this.selectedRow.SbuId,
        this.selectedRow.LedgerId,
        this.selectedRow.PartyId,
        this.selectedRow.FromDate,
        this.selectedRow.ToDate
      );
      const content = document.getElementById("reportHeader");
      this.generateReportLL(buttonAction, fileName, content);
    }
  }
  private onExportCSVL() {
    //debugger;
    this.getReportDataLX(
      this.selectedRow.CompanyId,
      this.selectedRow.SbuId,
      this.selectedRow.LedgerId,
      this.selectedRow.PartyId,
      this.selectedRow.FromDate,
      this.selectedRow.ToDate
    );
  }
  public company = {
    name: "One Information And Communications Technology Ltd",
    address: "14/A, Center Point Concord Unit-10A & B Tejgaon, Dhaka - 1215",
    custom_footer: true,
    phone: "01704-055668",
    fax: "02-98765432",
    email: "info@one-ict.com",
    website: "www.one-ict.com",
    vat: "13145664564",
    tin: "00000000000",
  };
  public generateExcel(objArray: any, header: any, fileName: string) {
    //debugger;
    let data = objArray.map((item, index) => {
      return [
        index + 1,
        item.voucherDate,
        item.voucherNo,
        item.voucherTypeName,
        item.accountCode,
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
    let headerName = this.worksheet.addRow([this.company.name]);
    headerName.font = { size: 16, underline: "double", bold: true };
    headerName.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${headerName.number}:${endColumn + headerName.number}`
    );

    let headerAddress = this.worksheet.addRow([this.company.address]);
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
      this.company.phone + "; " + this.company.fax,
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
      this.company.email + "; " + this.company.website,
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
  public generateExcelPR(objArray: any, header: any, fileName: string) {
    //debugger;
    let data = objArray.map((item, index) => {
      return [
        index + 1,
        item.accountName,
        item.accountCode,
        item.OpeningBalance,
        item.Payment,
        item.Received,
        item.ClosingBalance,
      ];
    });
    let datat = [
      data.length + 1,
      "Total",
      "",
      this.TotalOpening,
      this.TotalPayment,
      this.TotalReceived,
      this.TotalClosing,
    ];
    data.push(datat);
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
    let headerName = this.worksheet.addRow([this.company.name]);
    headerName.font = { size: 16, underline: "double", bold: true };
    headerName.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    this.worksheet.mergeCells(
      `A${headerName.number}:${endColumn + headerName.number}`
    );

    let headerAddress = this.worksheet.addRow([this.company.address]);
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
      this.company.phone + "; " + this.company.fax,
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
      this.company.email + "; " + this.company.website,
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
  // public companyName = "";
  // public sbuName = "";
  // public ledgerName = "";
  // public partyName = "";

  // public fromDate:any;
  // public toDate:any;
  public paramsL = [];
  public setParamL() {
    this.paramsL = [];

    this.paramsL.push({
      leftLabel: "Company Name",
      leftValue: this.selectedRow.companyName,
      rightLabel: "Branch Name",
      rightValue: this.selectedRow.sbuName,
    });
    this.paramsL.push({
      leftLabel: "Ledger Name",
      leftValue: this.selectedRow.accountName,
      rightLabel: "Party Name",
      rightValue: "",
    });
    this.paramsL.push({
      leftLabel: "From Date",
      leftValue: this.selectedRow.FromDate,
      rightLabel: "To Date",
      rightValue: this.selectedRow.ToDate,
    });
  }
  private getReportDataL(
    companyId,
    sbuId,
    ledgerId,
    partyId,
    fromDate,
    toDate
  ) {
    //debugger;

    ////////// Call common service for report data/////////
    this.apiUrl = `AccountReport/getRptLedgerBook?companyId=${companyId}&sbuId=${sbuId}&ledgerId=${ledgerId}&partyId=${partyId}&fromDate=${fromDate}&toDate=${toDate}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      this.bodyDataLL = [];
      if (returns.success) {
        this.bodyDataLL = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }
  private getReportDataLX(
    companyId,
    sbuId,
    ledgerId,
    partyId,
    fromDate,
    toDate
  ) {
    //debugger;

    ////////// Call common service for report data/////////
    this.apiUrl = `AccountReport/getRptLedgerBook?companyId=${companyId}&sbuId=${sbuId}&ledgerId=${ledgerId}&partyId=${partyId}&fromDate=${fromDate}&toDate=${toDate}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      this.bodyDataLL = [];
      if (returns.success) {
        this.bodyDataLL = returns.data;
        var fileName = "Ledgerbook" + ".xlsx";
        this.generateExcel(this.bodyDataLL, this.tableHeaderLL, fileName);
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  public generateReportLL(buttonAction: any, fileName: string, content: any) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional
    const legend = {
      height: 100,
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
    //debugger;
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_tableL",
          startY: legend.height + 20,
          styles: { font: "Meta" },
        });

        autoTable(doc, {
          html: "#body_tableL",
          startY: legend.height + 150,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
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
            fillColor: [216, 216, 216],
            textColor: 50,
          },
          columnStyles: {
            7: { halign: "right" },
            8: { halign: "right" },
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });
        //debugger;
        autoTable(doc, {
          html: "#bodyvoucher_table",
          startY: legend.height + 50,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
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
            fillColor: [216, 216, 216],
            textColor: 50,
          },
          columnStyles: {
            7: { halign: "right" },
            8: { halign: "right" },
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
