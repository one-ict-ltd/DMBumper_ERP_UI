import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { RptCoaService } from "../../../../services/accounting/reports/rpt-coa.service";
import { MenuService } from "../../../../services/menu.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
//import { LedgerService } from "app/services/ledger.service";
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

@Component({
  selector: "ngx-rpt-coa",
  templateUrl: "./rpt-coa.component.html",
  styleUrls: ["./rpt-coa.component.scss"],
})
export class RptCoaComponent implements OnInit {
  public pageNavigation = "Chart of Accounts";
  public tableHeader = [
    "#",
    "Account Nature",
    "Group Code",
    "Group Name",
    "Account Code",
    "Account Head",
  ];
  public tableHeader0 = [
    // "#",
    // "Account Nature",
    // "Group Code",
    // "Group Name",
    "Code",
    "Account Name",
  ];
  public apiUrl = "";
  public bodyData: any = [];
  public bodyDatashow: any = [];
  public params = [];
  public companies = [];
  public companyId: number = 0;

  public showbody: boolean = false;
  public ddlSelected: any;
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
    //private ledgerService: LedgerService,
  ) {
    this.getDropdownData();
    this.getCompanyAddress();
  }

  ngOnInit(): void { }
  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      this.GeneratCrystalReport("Pdf"); //this.generateReport("pdf");
    } else if (clicked == "print") {
      this.GeneratCrystalReport("Pdf"); //this.generateReport("print");
    } else if (clicked == "csv") {
      this.GeneratCrystalReport("Excel"); //this.onExportCSV();
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
      leftLabel: "Company Name",
      leftValue: this.ddlSelected.name,
      rightLabel: "",
      rightValue: "",
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
    ////////// Call common service for dropdown data/////////
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companies = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
      this.ddlSelected = {
        id: returns.data[0].companyId,
        name: returns.data[0].companyName,
      };
    });

    this.getDdlGroupNatureData();
  }

  accountNatureId: 0;
  groupNatureItems = [];
  accountNatureSelected = {};
  public getDdlGroupNatureData() {
    this.comboService.getGroupNature().subscribe((returns: any) => {
      this.groupNatureItems = returns.data.map((val) => ({
        id: val.groupNatureId,
        name: val.natureName,
      }));
    });
  }

  accountGroupId: 0;
  accountGroupItems = [];
  accountGroupSelected = {};
  public getDdlAccountGroupData(accountNatureId) {
    this.accountGroupSelected = {};
    this.comboService.GetAccountGroupSubGroup(accountNatureId, 0).subscribe((returns: any) => {
      this.accountGroupItems = returns.data.map((val) => ({
        id: val.accountGroupId,
        name: val.groupName,
      }));
    });
  }

  accountSubGroupId: 0;
  accountSubGroupItems = [];
  accountSubGroupSelected = {};
  public getDdlAccountSubGroupData(accountGroupId) {
    this.accountSubGroupSelected = {};
    this.comboService.GetAccountGroupSubGroup(0, accountGroupId).subscribe((returns: any) => {
      this.accountSubGroupItems = returns.data.map((val) => ({
        id: val.accountGroupId,
        name: val.groupName,
      }));
    });
  }

  // public GetAutoLedgerCode(accountGroupId) {
  //   this.ledgerService.GetAutoLedgerCode(accountGroupId).subscribe((returns: any) => {
  //     if (returns.success) {
  //       //this.master.accountCode = returns.data[0].accountCode;
  //     }
  //   });
  // }

  private getReportData() {
    ////////// Call common service for report data/////////
    debugger;
    let companyId = this.ddlSelected["id"] == undefined ? 0 : this.ddlSelected["id"];
    let groupNatureId = this.accountNatureSelected["id"] == undefined ? 0 : this.accountNatureId;
    let accountGroupId = this.accountGroupSelected["id"] == undefined ? 0 : this.accountGroupId;
    let accountSubGroupId = this.accountSubGroupSelected["id"] == undefined ? 0 : this.accountSubGroupId;

    //this.apiUrl = `Ledgers/getCOA`;
    this.apiUrl = `Ledgers/getCOA?companyId=${companyId}&groupNatureId=${groupNatureId}&accountGroupId=${accountGroupId}&accountSubGroupId=${accountSubGroupId}`;
    //console.log('this.apiUrl', this.apiUrl);
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = [];
        this.bodyData = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  private getReportDataExcel() {
    this.apiUrl = `Ledgers/getCOA`;
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
        item.natureName,
        item.groupCode,
        item.groupName,
        item.accountCode,
        item.accountName,
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

    let headerPhone = this.worksheet.addRow([this.officeTelephone]);
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

  private onRefresh() {
    // this.ddlSelected = null;
    this.companyId = 0;
    this.accountNatureId = 0;
    this.accountGroupId = 0;
    this.accountSubGroupId = 0;
    this.bodyData = [];
    this.showbody = false;
  }

  private onPreview() {
    this.getReportData();
    this.showbody = true;
  }

  private onExportCSV() {
    this.getReportDataExcel();
    // var fileName = this.pageNavigation + ".xlsx";
    // this.commonService.generateExcel(this.bodyData, this.tableHeader, fileName);
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  GeneratCrystalReport(reportFormat: any) {
    debugger;
    let companyId = this.ddlSelected["id"] == undefined ? 0 : this.ddlSelected["id"];
    let groupNatureId = this.accountNatureSelected["id"] == undefined ? 0 : this.accountNatureId;
    let accountGroupId = this.accountGroupSelected["id"] == undefined ? 0 : this.accountGroupId;
    let accountSubGroupId = this.accountSubGroupSelected["id"] == undefined ? 0 : this.accountSubGroupId;

    this.apiUrl = `AccountsReport/GetCOAReport?reportFormat=${reportFormat}&companyId=${companyId}&groupNatureId=${groupNatureId}&accountGroupId=${accountGroupId}&accountSubGroupId=${accountSubGroupId}`;
    this.commonService
      .GetCrystalReportData(this.apiUrl)
      .subscribe((returns: any) => {
        this.commonService.GenerateBase64ToReport(returns);
      });
  }

  public generateReport(buttonAction: any) {
    this.setParam();
    var fileName = this.pageNavigation + ".pdf";
    this.getReportData();
    const content = document.getElementById("reportHeader");
    this.generatePdfLedgerBook(buttonAction, fileName, content);
  }

  public generatePdfLedgerBook(
    buttonAction: any,
    fileName: string,
    content: any
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5);
    doc.setTextColor(40);

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
          startY: legend.height + 15,
          styles: { font: "Meta", fontSize: 11 },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 65,
          theme: "grid",
          //tableLineColor: [0, 0, 0],
          //tableLineWidth: 0.75,
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
