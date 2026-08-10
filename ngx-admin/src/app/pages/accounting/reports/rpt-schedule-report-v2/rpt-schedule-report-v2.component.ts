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

import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'ngx-rpt-schedule-report-v2',
  templateUrl: './rpt-schedule-report-v2.component.html',
  styleUrls: ['./rpt-schedule-report-v2.component.scss']
})
export class RptScheduleReportV2Component implements OnInit {
  public pageNavigation = "Schedule Report";
  public tableHeader = [
    "#",
    "Date",
    "Voucher No",
    "Group Name",
    "Particulars",
    "Remarks",
    "Party Name",
    "Debit Amount",
    "Credit Amount",
  ];

  public apiUrl = "";
  public bodyData: any = [];
  public params = [];

  public companies = [];
  public groupItems = [];
  public branchs = [];
  public reportTypeItems = [];
  public isOBlist = [];
  public typelist = [];

  public companyId: number = 0;
  public ledgerId: number = 0;

  public showPaymentSignature: boolean = false;
  public showReceiptSignature: boolean = false;
  public showJournalSignature: boolean = false;
  public showbody: boolean = false;
  public ddlSelected: any;
  public groupSelected: any;
  public branchSelected: any;
  public reportTypeSelected: any;
  public isOBSelected: any;
  public typeSelected: any;
  public typeId: any;
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

  public dateRange: string = "Period- ";
  isPreview: boolean = false;
  public tableHeaderP = [];
  public tableHeaderPP = [];
  public reportTitleName: string = "Schedule";

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private rptCoaService: RptCoaService,
    private voucherService: VoucherService,
    private sanitizer: DomSanitizer,
  ) {
    this.getDropdownData();
    this.getDdlRptReportType();
    this.getMaster();
    this.getDdlGroupNatureData();
    // this.getAccountGroup();
    this.getCompanyAddress();
    this.isOBSelected = {}
    // this.typelist = [
    //   {
    //     id:1,
    //     name:"Yearly"
    //   },
    //   {
    //     id:2,
    //     name:"Half Yearly"
    //   },
    //   {
    //     id:3,
    //     name:"Quarterly"
    //   }
    // ]
    this.isOBlist = [
      {
        id: 1,
        name: "Yes"
      },
      {
        id: 2,
        name: "No"
      }
    ]
  }

  ngOnInit(): void { }
  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      this.getCrReport("pdf");
    } else if (clicked == "print") {
      this.getCrReport("pdf");
    } else if (clicked == "csv") {
      //this.getCrReport("Excel");
      this.getExcelFile();
      //this.getExcelFile();
      //this.onExportCSV();
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
    var groupName = "All Ledger";
    if (this.groupSelected != null) {
      groupName = this.groupSelected["name"];
    }
    this.params.push({
      leftLabel: "Date:",
      leftValue: this.fromdateSelected.toString().substring(3, 15) + ' to ' + this.todateSelected.toString().substring(3, 15),
      rightLabel: "Group Name:",
      rightValue: groupName,
    });
  }


  master: {

    ClassId: number;
    ClassSelected: {};
    groupId: number;
    groupSelected: {};
    employeeId: number;
    employeeSelected: {};
    subGroupId: number;
    subGroupSelected: {};
    subSubGroupId: number;
    subSubGroupSelected: {};

    lstModel: any[];
    index: number;

  };

  public getMaster() {
    this.master = {
      ClassId: 0,
      ClassSelected: null,
      groupId: 0,
      groupSelected: null,
      employeeId: 0,
      employeeSelected: null,
      subGroupId: 0,
      subGroupSelected: null,
      subSubGroupId: 0,
      subSubGroupSelected: null,

      lstModel: [],
      index: -1,

    };
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
  public getDdlRptReportType() {
    this.comboService.getDdlRptReportType().subscribe((returns: any) => {
      this.reportTypeItems = returns.data.map((val) => ({
        id: val.id,
        name: val.name,
      }));
    });
  }
  public getAccountGroup() {
    this.comboService.GetParentChildAccountGroup(0).subscribe((returns: any) => {
      this.groupItems = returns.data.map((val) => ({
        id: val.accountGroupId,
        name: val.groupName,
      }));
    });
  }

  accountNatureId: 0;
  groupNatureItems = [];
  accountNatureSelected = {};
  public getDdlGroupNatureData() {
    this.comboService.getGroupNature().subscribe((returns: any) => {
      //console.log(returns.data);
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
  public getDdlAccountSubGroupData(accountGroupIds) {
    this.accountSubGroupSelected = {};
    /*
    this.comboService.GetAccountGroupSubGroup(0, accountGroupId).subscribe((returns: any) => {
      this.accountSubGroupItems = returns.data.map((val) => ({
        id: val.accountGroupId,
        name: val.groupName,
      }));
    });
    */
    accountGroupIds = this.GetIds(this.master.groupSelected);
    this.comboService.GetSubGroupByAccountGroupIds(0, accountGroupIds).subscribe((returns: any) => {
      this.accountSubGroupItems = returns.data.map((val) => ({
        id: val.accountGroupId,
        name: val.groupName,
      }));
    });
  }

  accountSubSubGroupId: 0;
  accountSubSubGroupItems = [];
  accountSubSubGroupSelected = {};
  public getDdlAccountSubSubGroupData(accountGroupIds) {
    this.accountSubSubGroupSelected = {};
    /*
    this.comboService.GetAccountGroupSubGroup(0, accountGroupId).subscribe((returns: any) => {
      this.accountSubSubGroupItems = returns.data.map((val) => ({
        id: val.accountGroupId,
        name: val.groupName,
      }));
    });
    */
    accountGroupIds = this.GetIds(this.master.subGroupSelected);
    this.comboService.GetSubGroupByAccountGroupIds(0, accountGroupIds).subscribe((returns: any) => {
      this.accountSubSubGroupItems = returns.data.map((val) => ({
        id: val.accountGroupId,
        name: val.groupName,
      }));
    });
  }

  accountGroupIdLast: any = 0;
  public getUserGroupWiseLedger(accountGroupId: any) {
    //this.accountGroupIdLast = accountGroupId;

    let ids = '0_';

    accountGroupId.forEach(element => {
      ids = ids + element.id + '_';
    });

    this.accountGroupIdLast = ids;
    //console.log(this.accountGroupIdLast);
  }

  accountClassId: 0;
  public getUserClassWiseLedger(classID) {
    this.accountClassId = classID;
    this.master.groupSelected = {};
    this.master.subGroupSelected = {};
    this.master.subSubGroupSelected = {};
    //alert(this.accountClassId);
    this.accountGroupItems = [];
    this.accountSubGroupItems = null;
    this.accountSubSubGroupItems = null;
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
    });
  }

  private getCrReport(reportFormat: any = 'pdf') {
    const fromDate = this.fromdateSelected;
    const toDate = this.todateSelected;
    if (this.commonService.validateDates(fromDate, toDate)) {
      var accountGroupId = 0;
      if (this.groupSelected != null) {
        accountGroupId = this.groupSelected["id"];
      }
      // if (this.reportTypeSelected == "" || this.reportTypeSelected == null) {
      //   this.toastrService.danger("Please select report type", "Message");
      //   return;
      // }
      if (this.accountClassId == 0) {
        this.toastrService.danger("Please select account Class", "Message");
        return;
      }
      if (!this.isOBSelected) this.isOBSelected = {};
      ////////// Call common service for report data/////////
      this.apiUrl = `AccountsReport/GetRptAccountScheduleReportByAccountGroupIds?companyId=${this.ddlSelected.id
        }&sbuId=${this.branchSelected.id
        }&accountGroupId=${this.accountGroupIdLast}&fromDate=${this.fromdateSelected
          .toString()
          .substring(3, 15)}&toDate=${this.todateSelected
            .toString()
            .substring(3, 15)}&reportType=&natureId=${this.accountClassId}&isOb=${this.isOBSelected.id}&reportFormat=${reportFormat}`;


      this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
        this.commonService.GenerateBase64ToReport(returns);
      });
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }


  base64Pdf: any;
  private getReportDataIframe() {
    var accountGroupId = 0;
    if (this.groupSelected != null) {
      accountGroupId = this.groupSelected["id"];
    }
    // if (this.reportTypeSelected == "" || this.reportTypeSelected == null) {
    //   this.toastrService.danger("Please select report type", "Message");
    //   return;
    // }
    if (this.accountClassId == 0) {
      this.toastrService.danger("Please select account Class", "Message");
      return;
    }
    ////////// Call common service for report data/////////
    if (!this.isOBSelected) this.isOBSelected = {};
    ////////// Call common service for report data/////////
    this.apiUrl = `AccountsReport/GetRptAccountScheduleReportByAccountGroupIds?companyId=${this.ddlSelected.id
      }&sbuId=${this.branchSelected.id
      }&accountGroupId=${this.accountGroupIdLast}&fromDate=${this.fromdateSelected
        .toString()
        .substring(3, 15)}&toDate=${this.todateSelected
          .toString()
          .substring(3, 15)}&reportType=&natureId=${this.accountClassId}&isOb=${this.isOBSelected.id}&reportFormat=pdf`;


    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      debugger
      // this.commonService.GenerateBase64ToReport(returns);
      this.base64Pdf = this.sanitizer.bypassSecurityTrustResourceUrl(returns);
    });
  }

  private getReportData() {
    var accountGroupId = 0;
    if (this.groupSelected != null) {
      accountGroupId = this.groupSelected["id"];
    }
    if (this.reportTypeSelected == "" || this.reportTypeSelected == null) {
      this.toastrService.danger("Please select report type", "Message");
      return;
    }
    if (this.accountClassId == 0) {
      this.toastrService.danger("Please select account Class", "Message");
      return;
    }
    ////////// Call common service for report data/////////
    this.apiUrl = `AccountReport/getRptAccountGroupBookScheduleReport?companyId=${this.ddlSelected.id
      }&sbuId=${this.branchSelected.id
      }&accountGroupId=${this.accountGroupIdLast}&fromDate=${this.fromdateSelected
        .toString()
        .substring(3, 15)}&toDate=${this.todateSelected
          .toString()
          .substring(3, 15)}&reportType=${this.reportTypeSelected.id}&natureId=${this.accountClassId}&isOb=${this.isOBSelected.id}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }


  private getReportDataPrev() {
    var accountGroupId = 0;
    if (this.groupSelected != null) {
      accountGroupId = this.groupSelected["id"];
    }
    if (this.reportTypeSelected == "" || this.reportTypeSelected == null) {
      this.toastrService.danger("Please select report type", "Message");
      return;
    }
    if (this.reportTypeSelected.id == "Detail" && accountGroupId == 0) {
      this.toastrService.danger("Please select account group", "Message");
      return;
    }
    ////////// Call common service for report data/////////
    this.apiUrl = `AccountReport/getRptAccountGroupBook?companyId=${this.ddlSelected.id
      }&sbuId=${this.branchSelected.id
      }&accountGroupId=${accountGroupId}&fromDate=${this.fromdateSelected
        .toString()
        .substring(3, 15)}&toDate=${this.todateSelected
          .toString()
          .substring(3, 15)}&reportType=${this.reportTypeSelected.id}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  private onRefresh() {
    this.ddlSelected = null;
    this.groupSelected = null;
    this.branchSelected = null;
    this.fromdateSelected = new Date();
    this.todateSelected = new Date();
    this.companyId = 0;
    this.bodyData = [];
    this.showbody = false;
    this.showPaymentSignature = false;
    this.showReceiptSignature = false;
    this.showJournalSignature = false;
    this.isPreview = false;
    this.tableHeaderP = [];
    this.tableHeaderPP = [];
  }
  private onPreview() {
    const fromDate = this.fromdateSelected;
    const toDate = this.todateSelected;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.getReportDataIframe()
      //this.getReportData();
      // this.showbody = true;
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }
  private onExportCSV() {
    this.getReportDataExcel();
  }
  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  public generateReport(buttonAction: any) {
    this.setParam();
    var fileName = this.pageNavigation + ".pdf";
    this.getReportData();
    const content = document.getElementById("reportHeader");
    this.generatePdfLedgerBook(buttonAction, fileName, content);
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  public generatePdfLedgerBook(buttonAction: any, fileName: string, content: any) {
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
          startY: legend.height + 35,
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
            // halign:"right"
          },
          columnStyles: {
            6: { halign: "right" },
            7: { halign: "right" },
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
    this.voucherService.getVoucherReportById(voucherMasterId).subscribe((returns: any) => {
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
    doc.setFontSize(5);
    doc.setTextColor(40);

    var legend = {
      height: 100,
      totalheight: 100 + datalength,
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
  async getExcelFile() {
      await this.getReportDataForExcel();
  }
  
 getReportDataForExcel(): Promise<void> {
    debugger
    return new Promise((resolve, reject) => {
      this.dateRange = "";

      this.showbody = false;
      this.isPreview = true;
      this.bodyData = [];
      this.tableHeaderP = [];
      this.tableHeaderPP = [];

      // this.reportName = "";
      // this.reportType = "ALL";

      // this.zoneCode = "";
      // this.regionCode = "";
      // this.areaCode = "";
      // this.territoryCode = "";
      // this.productWiseSpecificationId = 0;

      // if (!this.isEmpty(this.reportNameSelected)) {
      //   this.reportName = this.reportNameSelected["id"];
      // }
      // if (!this.isEmpty(this.reportTypeSelected)) {
      //   this.reportType = this.reportTypeSelected["id"];
      // }
      // if (!this.isEmpty(this.reportTypeSelected)) {
      //   this.reportTypeName = this.reportTypeSelected["name"];
      // }
      // if (!this.isEmpty(this.reportPeriodSelected)) {
      //   this.reportPeriod = this.reportPeriodSelected["id"];
      // }
      // if (!this.isEmpty(this.zoneSelected)) {
      //   this.zoneCode = this.zoneSelected["id"];

      // }
      // if (!this.isEmpty(this.regionSelected)) {
      //   this.regionCode = this.regionSelected["id"];

      // }
      // if (!this.isEmpty(this.areaSelected)) {
      //   this.areaCode = this.areaSelected["id"];
      // }
      // if (!this.isEmpty(this.territorySelected)) {
      //   this.territoryCode = this.territorySelected["id"];

      // }
      // if (!this.isEmpty(this.masterReportSelected)) {
      //   this.reportMasterId = this.masterReportSelected["id"];
      // }
      // if (!this.isEmpty(this.productSelected)) {
      //   this.productWiseSpecificationId = this.productSelected["id"];
      //   //this.productName = this.productSelected == (undefined || null) ? '' : this.productSelected["name"];
      // }

      this.dateRange =
        "Period- " +
        this.commonService.GetMonthAndYear(this.fromdateSelected) +
        " To " +
        this.commonService.GetMonthAndYear(this.todateSelected);

      
      // this.apiUrl = "";
    //   this.apiUrl = `SalesInvoice/GetSalesReportNationallyExcelOnly?reportName=${this.reportName
    //     }&reportType=${this.reportType}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode
    //     }&areaCode=${this.areaCode}&territoryCode=${this.territoryCode
    //     }&fDate=${this.commonService.DateFormat(
    //       this.fDate
    //     )}&tDate=${this.commonService.DateFormat(
    //       this.tDate
    //     )}&productWiseSpecificationId=${this.productWiseSpecificationId}
    // &reportPeriod=${this.reportPeriod}&reportTypeName=${this.reportTitleName}&zoneName=${this.zone}&regionName=${this.region}&territoryName=${this.territory}&area=${this.areaName}&productName=${this.productName}`;
      var accountGroupId = 0;
    if (this.groupSelected != null) {
      accountGroupId = this.groupSelected["id"];
    }
    
    if (this.accountClassId == 0) {
      this.toastrService.danger("Please select account Class", "Message");
      return;
    }
    ////////// Call common service for report data/////////
    if (!this.isOBSelected) this.isOBSelected = {};
    ////////// Call common service for report data/////////
//  this.apiUrl = "";
//       this.apiUrl = `SalesInvoice/GetSalesReportNationally?reportName=${this.reportName
//         }&reportType=${this.reportType}&zoneCode=${this.zoneCode}&regionCode=${this.regionCode
//         }&areaCode=${this.areaCode}&territoryCode=${this.territoryCode
//         }&fDate=${this.commonService.DateFormat(
//           this.fDate
//         )}&tDate=${this.commonService.DateFormat(
//           this.tDate
//         )}&productWiseSpecificationId=${this.productWiseSpecificationId}
//     &reportPeriod=${this.reportPeriod}`;
const fromDate = this.fromdateSelected;
const toDate = this.todateSelected;
    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetRptAccountScheduleReportByAccountGroupIdsExcelOnly?companyId=${this.ddlSelected.id
      }&sbuId=${this.branchSelected.id
      }&accountGroupId=${this.accountGroupIdLast}&fromDate=${this.commonService.DateFormat(fromDate) }&toDate=${this.commonService.DateFormat(toDate)}&reportType=&natureId=${this.accountClassId}&isOb=${this.isOBSelected.id}&reportFormat=pdf`;

      this.commonService.getReportDataForDirectFile(this.apiUrl).subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
       
        a.href = url;
        a.download = `${this.reportTitleName}_report.xlsx`; // Adjust the filename as needed
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, error => {
        console.error('Error downloading the file', error);
      });
    });
  }

  private getReportDataExcel() {
    var accountGroupId = 0;
    if (this.groupSelected != null) {
      accountGroupId = this.groupSelected["id"];
    }
    if (this.reportTypeSelected == "" || this.reportTypeSelected == null) {
      this.toastrService.danger("Please select report type", "Message");
      return;
    }
    if (this.reportTypeSelected.id == "Detail" && accountGroupId == 0) {
      this.toastrService.danger("Please select account group", "Message");
      return;
    }
    ////////// Call common service for report data/////////
    this.apiUrl = `AccountReport/getRptAccountGroupBook?companyId=${this.ddlSelected.id}&sbuId=${this.branchSelected.id}&accountGroupId=${accountGroupId}&fromDate=${this.fromdateSelected.toString().substring(3, 15)}&toDate=${this.todateSelected.toString().substring(3, 15)}&reportType=${this.reportTypeSelected.id}`;

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
        item.voucherDate,
        item.voucherNo,
        item.groupName,
        item.accountName,
        item.remarks,
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


  //#region Multi-CheckBox
  GetIds(accountGroup: any): string {
    let ids = '0_';
    accountGroup.forEach(element => {
      ids = ids + element.id + '_';
    });

    return ids;
  }


  //#endregion Multi-CheckBox
}
