import { Component, OnInit } from "@angular/core";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { RptCoaService } from "../../../../services/accounting/reports/rpt-coa.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { LeaveService } from "app/services/hrm/leave.service";

import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";

@Component({
  selector: 'ngx-employee-leave-report',
  templateUrl: './employee-leave-report.component.html',
  styleUrls: ['./employee-leave-report.component.scss']
})
export class EmployeeLeaveReportComponent implements OnInit {

  public reportTypeName = "Employee Leave Report";
  public company: {
    name: string;
    address: string;
    custom_footer: boolean;
    phone: string;
    fax: string;
    email: string;
    website: string;
    vat: string;
    tin: string;
  };

  public pageNavigation = "Employee Leave Report";
  public tableHeader = [
    "#",
    "Emp. ID",
    "Name",
    "Designation",
    "Joining Date",
    "Casual Leave",
    "Casual Leave Available",
    "Sick Leave",
    "Sick Leave Available",
    "Earn Leave",
    "Earn Leave Available",
    "Leave Without Pay",
    "Total Leave"
  ];

  public apiUrl = "";
  public bodyData: any = [];
  public params = [];

  public workbook: ExcelJS.Workbook;
  public worksheet: any;

  public toDateSelected = new Date();
  public fromDateSelected = new Date();

  public reportId: number = 0;
  public companyId: number = 0;
  public tradeId: number = 0;
  public visaPartyId: number = 0;
  public totalAmount: number = 0;

  public reportNamesItems = [];
  public companyItems = [];
  public tradeItems = [];
  public partyItems = [];

  public companyData: any = [];
  public companyName = "";
  public addressLine = "";
  public officeTelephone = "";
  public companyEmail = "";
  public website = "";

  public totalEmployee = 0;

  public ddlReportNameSelected: any;
  public ddlCompanySelected: any;
  public ddlTradeSelected: any;
  public ddlPartySelected: any;
  public employeeId: any;
  public leaveTypeId: any;
  public EmployeeSelected: {};
  //public yearId:any
  public Balance: any;

  showTrade: boolean = false;
  showCompany: boolean = false;
  showparty: boolean = false;
  searchText: string;

  public showbody: boolean = false;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private rptCoaService: RptCoaService,
    private leaveService: LeaveService,
    private employeeinformationService: EmployeeinformationService,
  ) {
    this.getReportList();
    this.getCompanyData();
    this.getLeaveYear();
    this.getCompanyAddress();
    this.getEmployee();
    //this.getTradeData();
    //this.getVisaParties();
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

    this.params.push({
      leftLabel: "Company Name",
      leftValue: "",
      rightLabel: "Leave Year",
      rightValue: "",
    });
  }

  private getReportList() {
    this.comboService
      .getReportByUserPermission(this.reportTypeName)
      .subscribe((returns: any) => {
        this.reportNamesItems = returns.data.map((val) => ({
          id: val.reportId,
          name: val.reportName,
        }));
      });
  }

  private getCompanyData() {
    this.comboService.getVisaCompany().subscribe((returns: any) => {
      this.companyItems = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  private getTradeData() {
    this.comboService.getVisaTrade().subscribe((returns: any) => {
      //debugger
      this.tradeItems = returns.data.map((val) => ({
        id: val.tradeId,
        name: val.trade,
      }));
    });
  }

  public EmployeeList = [];
  public getEmployee() {
    // this.master.substituteEmployeeSelected = null;
    this.employeeinformationService.GetEmployeeInfoLoadByIdOptimized(0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.EmployeeList = retuns.data.map((val: any) => ({
          id: val.employeeId,
          name: val.fullName,
        }));
        //console.log(this.LeaveTypeList);
      }
    })
  }
  GetLeaveBalance() {
    debugger
    if (this.leaveTypeId > 0 && this.yearId > 0 && this.employeeId > 0) {
      this.leaveService.GetManualLeaveBalance(this.employeeId, this.yearId, this.leaveTypeId).subscribe((data: any) => {
        if (data.success) {
          this.Balance = data.data[0].leaveBalance;
        }
      });
    }
  }

  private getCompanyAddress() {
    this.comboService.getCompanybyId().subscribe((returns: any) => {
      debugger
      this.companyData = returns.data;
      this.companyId = this.companyData[0].companyId;
      this.companyName = this.companyData[0].companyName;
      this.addressLine = this.companyData[0].addressLine;
      this.officeTelephone = this.companyData[0].officeTelephone;
      this.companyEmail = this.companyData[0].companyEmail;
      this.website = this.companyData[0].website;
    });
  }

  private getVisaParties() {
    this.comboService.getVisaParty().subscribe((returns: any) => {
      //debugger
      this.partyItems = returns.data.map((val) => ({
        id: val.visaPartyId,
        name: val.partyName,
      }));
    });
  }
  LeaveYearSelected = {};
  public LeaveYearList = [];
  yearId = 2023;
  public getLeaveYear() {
    this.LeaveYearSelected = null;
    this.leaveService.getLeaveYear().subscribe((retuns: any) => {
      if (retuns.success) {
        this.LeaveYearList = retuns.data.map((val: any) => ({
          id: val.leaveYearId,
          name: val.yearName,
        }));
        //console.log(this.LeaveTypeList);
      }
    })
  }

  public showHideDdl() {
    //this.ddlReportNameSelected = null;
    if (this.ddlReportNameSelected.name == "Sales Register") {
      this.showTrade = false;
      this.showCompany = false;
      this.showparty = false;
    } else if (this.ddlReportNameSelected.name == "Trade Wise Sales") {
      this.showTrade = true;
      this.showCompany = false;
      this.showparty = false;
    } else if (this.ddlReportNameSelected.name == "Company Wise Sales") {
      this.showCompany = true;
      this.showTrade = false;
      this.showparty = false;
    } else if (this.ddlReportNameSelected.name == "Agent Wise Sales") {
      this.showCompany = false;
      this.showTrade = false;
      this.showparty = true;
    } else {
      this.showTrade = false;
      this.showCompany = false;
      this.showparty = false;
      //this.partyId = 0;
    }
  }

  // private getReportData() {
  //   //debugger;
  //   var year = 0;
  //   if (this.LeaveYearSelected != null) {
  //     year = this.LeaveYearSelected["id"];

  //   }
  //   else{
  //     this.toastrService.danger("Message","Select Year");
  //   }
  //   var empId=this.employeeId;

  //  if(empId==0 || empId==null)
  //  {
  //   this.toastrService.danger("Message","Select Employee");
  //  }
  //   this.apiUrl = `Leave/GetEmployeeLeaveRptData?empId=${empId}&year=${year}&reportFormat=${reportFormat}`;
  //   this.commonService.getEmployeeWiseLeaveReportData(this.apiUrl).subscribe((returns: any) => {
  //     if (returns.success) {
  //       this.bodyData = returns.data;
  //       //this.bodyData.forEach(a => this.totalAmount += a.salesAmount);

  //     } else {
  //       this.toastrService.danger("Message", this.commonService.nodatafound);
  //     }
  //   });
  // }


  public generateReport(reportFormat: any) {
    debugger;
    // //this.GetRptSalarySheetPdf();
    // if (this.master.salaryPeriodId == 0 || this.master.salaryPeriodId == null) {
    //   this.toastrService.danger("Please select salary period", "Message");
    //   return false;
    // }
    // this.master.salaryPeriodTypeId = this.master.salaryPeriodSelected["salaryTypeId"];
    // let location = (this.master.salaryLocationSelected == undefined || null) ? '' : this.master.salaryLocationSelected["name"];
    // //alert(location);
    // if (location == null || '') {
    //   this.master.salaryLocation = ''
    // } else {
    //   this.master.salaryLocation = location
    // }
    // let param = '';
    // //let concernId = '';
    // this.UniqueIdentityList.forEach(element => {
    //   if (element.isSelect == true) {
    //     param += element.id + ','
    //   }
    // });
    // if (param.length > 0) {
    //   param = param.substring(0, param.length - 1);
    // }
    //console.log(param);
    //alert(this.master.salaryPeriodTypeId);
    // this.salaryreportService.RptWorkingReport(1, 1, this.master.salaryPeriodId, reportFormat, this.master.typeId, this.master.salaryPeriodTypeId, this.master.salaryLocationId, param).subscribe((returns: any) => {
    //   //this.commonService.GenerateBase64ToReport(returns);
    //   let res = JSON.parse(returns);
    //   if (res.status) {
    //     this.commonService.GenerateBase64ToReport(res.data[0].data);
    //   } else {
    //     this.toastrService.warning("Message", this.commonService.nodatafound);
    //   }
    // });

    var year = 0;
    if (this.LeaveYearSelected != null) {
      year = this.LeaveYearSelected["id"];

    }
    else {
      this.toastrService.danger("Message", "Select Year");
    }
    var empId = this.employeeId;

    if (empId == 0 || empId == null) {
      this.toastrService.danger("Message", "Select Employee");
    }
    this.apiUrl = `Leave/RptGetEmployeeLeaveInfo?empId=${empId}&year=${year}&reportFormat=${reportFormat}`;
    this.commonService.getEmployeeWiseLeaveReportData(this.apiUrl).subscribe((returns: any) => {
      debugger
      //  this.commonService.GenerateBase64ToReport(returns);
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });

  }
  private onRefresh() {
    this.ddlCompanySelected = null;
    this.ddlReportNameSelected = null;
    this.ddlTradeSelected = null;
    this.ddlPartySelected = null;
    this.companyId = 0;
    this.bodyData = [];
    this.showbody = false;
  }
  private onPreview() {
    //this.getReportData();
    this.showbody = true;
  }
  private onExportCSV() {
    // this.getReportData();
    var fileName = this.pageNavigation + ".xlsx";
    this.generateExcelPR(this.bodyData, this.tableHeader, fileName);
  }
  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  // public generateReport(buttonAction: any) {
  //   this.setParam();
  //   var fileName = this.pageNavigation + ".pdf";
  //   this.getReportData();
  //   const content = document.getElementById("reportHeader");
  //   this.generatePdfLedgerBook(buttonAction, fileName, content);
  // }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  public generatePdfLedgerBook(
    buttonAction: any,
    fileName: string,
    content: any
  ) {
    const doc = new jsPDF("l", "pt", "a4");
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
          startY: legend.height + 40,
          styles: { font: "Meta" },
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
            fillColor: [105, 105, 105],
            fontSize: 11,
            halign: "center",
          },
          bodyStyles: {
            fillColor: [216, 216, 216],
            textColor: 50,
            // halign:"right"
          },
          columnStyles: {
            7: { halign: "center" },
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

  public generateExcelPR(objArray: any, header: any, fileName: string) {
    let data = objArray.map((item, index) => {
      return [
        index + 1,
        item.employeeNo,
        item.fullName,
        item.currentDesignation,
        item.joiningDate,
        item.CasualLeave,
        item.CasualBalance,
        item.SickLeave,
        item.SickBalance,
        item.EarnLeave,
        item.EarnBalance,
        item.LWPLeave,
        item.TotalLeave
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
