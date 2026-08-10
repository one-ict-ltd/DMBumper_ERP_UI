import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { CommonService } from 'app/@core/mock/common.service';
import { CommoncomboService } from 'app/services/commoncombo.service';
import { SalaryperiodService } from 'app/services/salary/salarymaster/salaryperiod.service';
import { SalaryprocessService } from 'app/services/salary/salaryprocess/salaryprocess.service';
import { SalaryreportService } from 'app/services/salary/salaryprocess/salaryreport.service';

import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

@Component({
  selector: 'ngx-mobile-bill-report',
  templateUrl: './mobile-bill-report.component.html',
  styleUrls: ['./mobile-bill-report.component.scss']
})
export class MobileBillReportComponent implements OnInit {

  master: {
    salaryPeriodId: number;
    typeId: number;
    salaryTypeId: number;
    processComments: string;

    salaryPeriodSelected: {};
  };
  public getMaster() {
    this.master = {
      salaryPeriodId: 0,
      typeId: 0,
      salaryTypeId: null,
      processComments: '',

      salaryPeriodSelected: null,
    };
  }
  salaryTypeSelected: {};

  salaryTypeList: any[] = [
    { id: 1, name: 'Bank' },
    { id: 2, name: 'Cash' }
  ];

  public pageNavigation = "Mobile Bill Report";
  public tableHeader = [
    "#",
    "EMP ID",
    "EMP Name",
    "Designation",
    "Department",
    "Salary Location",
    "Joining Date",
    "Mobile Number",
    "Bill Limit",
    "Actual Bill",
    "Excess Bill",
    "Status"
  ];

  public apiUrl = "";
  public bodyData: any = [];
  public bodyDatashow: any = [];
  public params = [];
  public salaryPeriodItems = [];

  public showbody: boolean = false;
  public workbook: ExcelJS.Workbook;
  public worksheet: any;

  public companyData: any = [];
  public companyName = "";
  public addressLine = "";
  public officeTelephone = "";
  public companyEmail = "";
  public website = "";

  public totalEmployee = 0;
  public companyId = 0;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private salaryperiodService: SalaryperiodService,
    private salaryprocessService: SalaryprocessService,
    private salaryreportService: SalaryreportService,
  ) {

    this.LoadSalaryPeriod();
    this.getCompanyAddress();
    this.getMaster();
    this.loadApprovalStatusList();

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
      rightLabel: "",
      rightValue: "",
    });
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

  public LoadSalaryPeriod() {
    this.salaryperiodService.GetSalaryPeriodById(0).subscribe((returns: any) => {
      this.salaryPeriodItems = returns.data.map((val) => ({
        id: val.salaryPeriodId,
        name: val.periodName,
      }));
    });
  }

  public ProcessSalary() {
    if (this.master.salaryPeriodId == 0 || this.master.salaryPeriodId == null) {
      this.toastrService.danger("Please select salary period", "Message");
      return false;
    }
    this.salaryprocessService.ProcessEmployeesSalary(this.master)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.processmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.salaryprocessService.GetSalaryMasterByPeriodId(this.master.salaryPeriodId).subscribe((data: any) => {
            if (data.status) {
              this.bodyData = data.data;
              this.showbody = true;
              this.totalEmployee = data.data[0].totalEmployee;
            }
          });
          //////////////Grid Refresh ///////////////////
        }
      });

  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  private onRefresh() {
    this.bodyData = [];
    this.showbody = false;
  }

  private onPreview() {
    this.getGridData();
    this.showbody = true;
  }

  private getGridData() {
    if (this.master.salaryPeriodId == 0 || this.master.salaryPeriodId == null) {
      this.toastrService.danger("Please select salary period", "Message");
      return false;
    }
    // this.salaryprocessService.GetSalaryMasterByPeriodId(this.master.salaryPeriodId).subscribe((data: any) => {
    //   if (data.status) {
    //     this.bodyData = data.data;
    //     this.showbody = true;
    //     this.totalEmployee = data.data[0].totalEmployee;
    //   }
    // });
  }

  public GetRptPayslip(employeeId, salaryPeriodId) {
    this.salaryreportService.RptPayslip(1, 1, employeeId, salaryPeriodId, "Pdf").subscribe((returns: any) => {
      this.commonService.GenerateBase64ToReport(returns);
    });
  }

  public generateReport(buttonAction: any) {
    this.GetRptSalarySheetPdf();
  }

  private onExportCSV() {
    //this.GetRptSalarySheetExcel();
    this.getReportDataExcel();
  }

  public GetRptSalarySheetPdf() {
    if (this.master.salaryPeriodId == 0 || this.master.salaryPeriodId == null) {
      this.toastrService.danger("Please select salary period", "Message");
      return false;
    }
    // if (this.master.typeId == 0 || this.master.typeId == null) {
    //   this.toastrService.danger("Please select report type", "Message");
    //   return false;
    // }
    // if (this.master.salaryTypeId == 0 || this.master.salaryTypeId == null) {
    //   this.toastrService.danger("Please select salary type", "Message");
    //   return false;
    // }
    this.salaryreportService.RptMobileBillSheet(this.companyId, 1, this.master.salaryPeriodId, "Pdf").subscribe((returns: any) => {
      this.commonService.GenerateBase64ToReport(returns);
    });
  }

  public GetRptSalarySheetExcel() {
    this.salaryreportService.RptMobileBillSheet(this.companyId, 1, this.master.salaryPeriodId, "Excel").subscribe((returns: any) => {
      this.commonService.GenerateBase64ToReport(returns);
    });
  }

  ApprovalStatusList: {};
  ApprovalStatusSelected: {};
  loadApprovalStatusList() {
    this.ApprovalStatusList = [
      {
        id: "ALL Employee",
        name: "ALL Employee",
      },
      {
        id: "Top Management",
        name: "Top Management",
      },
      {
        id: "General Employee",
        name: "General Employee",
      },
      {
        id: "Department Wise Report",
        name: "Department Wise Report",
      },
      {
        id: "Location Wise Report",
        name: "Location Wise Report",
      },
    ];
  }



  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  // Excel
  private getReportDataExcel() {
    let param = '';


    ////////// Call common service for report data/////////
    this.apiUrl = `SalaryReport/RptMonthlySalaryMobileBill?salaryPeriodId=${this.master.salaryPeriodId}&salaryLocation=0`;

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
        item.employeeNo,
        item.fullName,
        item.designation,
        item.department,
        item.salaryLocation,
        item.joiningDate,
        item.walletNo,
        item.grossSalary,
        item.totalDeduction,
        item.netAmount,
        item.status,
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
