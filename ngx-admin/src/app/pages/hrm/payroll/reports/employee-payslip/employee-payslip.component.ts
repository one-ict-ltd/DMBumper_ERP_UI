import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
import { SalaryperiodService } from "app/services/salary/salarymaster/salaryperiod.service";
import { SalaryprocessService } from "app/services/salary/salaryprocess/salaryprocess.service";
import { SalaryreportService } from "app/services/salary/salaryprocess/salaryreport.service";
import { CommonService } from "app/@core/mock/common.service";
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
@Component({
  selector: "ngx-employee-payslip",
  templateUrl: "./employee-payslip.component.html",
  styleUrls: ["./employee-payslip.component.scss"],
})
export class EmployeePayslipComponent implements OnInit {
  master: {
    salaryPeriodId: number;
    typeId: number;
    salaryLocation: number;
    processComments: string;
    empId: number;
    salaryPeriodSelected: {};
    empSelected: {};
    salaryLocationSelected: {};
  };

  empSelected = {};
  public getMaster() {
    this.master = {
      salaryPeriodId: 0,
      typeId: 0,
      salaryLocation: 0,
      processComments: "",
      empId: 0,
      salaryPeriodSelected: null,
      empSelected: null,
      salaryLocationSelected: null,
    };
  }
  public pageNavigation = "Employee Payslip";
  public tableHeader = [
    "#",
    "Emp ID",
    "Emp Name",
    "Designation",
    "Designation Sales",
    "Department",
    "Joining Date",
    "Salary Location",
    "Basic",
    "House Rent",
    "Medical",
    "Transport",
    "Utility",
    "Upkeep Allow",
    "Other Allow",
    "Arear",
    "Bonus",
    "Incr. Arrear",
    "Gross Pay",
    "PF",
    "Tax",
    "Mobile",
    "Food",
    "Motor Cycle",
    "Adv Loan",
    "Revenue Stamp",
    "LWP",
    "Other Deduct",
    "Total Deduct",
    "Net Amount",
    "Remarks",
  ];

  public apiUrl = "";
  public bodyData: any = [];
  public bodyDatashow: any = [];
  public params = [];
  public salaryPeriodItems = [];
  public bodyDataExcel: any = [];

  public showbody: boolean = false;
  public workbook: ExcelJS.Workbook;
  public worksheet: any;

  public companyData: any = [];
  public companyName = "";
  public addressLine = "";
  public searchText = "";
  public officeTelephone = "";
  public companyEmail = "";
  public website = "";

  public typeload: boolean = true;

  public totalEmployee = 0;
  public companyId = 0;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private salaryperiodService: SalaryperiodService,
    private salaryprocessService: SalaryprocessService,
    private employeeinformationService: EmployeeinformationService,
    private salaryreportService: SalaryreportService
  ) {
    this.LoadSalaryPeriod();
    this.getCompanyAddress();
    this.getMaster();
    this.loadApprovalStatusList();
    this.loadApprovalStatusBonusList();
    this.GetSalaryLocationJson();
    this.LoadEmployee();
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
  // public setParam() {
  //   this.params = [];
  //   this.params.push({
  //     leftLabel: "Company Name",
  //     leftValue: "",
  //     rightLabel: "",
  //     rightValue: "",
  //   });
  // }

  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Employee No",
      leftValue: this.empSelected["id"],
      rightLabel: "Employee Name",
      rightValue: this.empSelected["name"],
    });
    this.params.push({
      leftLabel: "Designation",
      leftValue: this.empSelected["currentDesignation"],
      rightLabel: "Department",
      rightValue: this.empSelected["currentDepartment"],
    });
    this.params.push({
      leftLabel: "Joining Date",
      leftValue: this.empSelected["joiningDate"],
      rightLabel: "Service Length",
      rightValue: this.empSelected["serviceLenth"],
    });
  }

  private getCompanyAddress() {
    this.comboService.getCompanybyId().subscribe((returns: any) => {
      debugger;
      this.companyData = returns.data;
      this.companyId = this.companyData[0].companyId;
      this.companyName = this.companyData[0].companyName;
      this.addressLine = this.companyData[0].addressLine;
      this.officeTelephone = this.companyData[0].officeTelephone;
      this.companyEmail = this.companyData[0].companyEmail;
      this.website = this.companyData[0].website;
    });
  }
  empItems = [];
  LoadEmployee(): void {
    console.log("select");
    this.employeeinformationService
      .GetEmployeeInfoLoadByIdOptimizedForPaySlip(0)
      .subscribe((returns: any) => {
        debugger;
        this.empItems = returns.data.map((val) => ({
          id: val.employeeId,
          name: val.fullName,
          joiningDate: val.joiningDate,
          currentDesignation: val.currentDesignation,
          currentDepartment: val.currentDepartment,
          serviceLenth: val.serviceLenth,
        }));
        console.log(this.empItems);
      });
  }

  public LoadSalaryPeriod() {
    this.salaryperiodService
      .GetSalaryPeriodById(0)
      .subscribe((returns: any) => {
        this.salaryPeriodItems = returns.data
          .filter((x) => x.salaryTypeId == 1)
          .map((val) => ({
            id: val.salaryPeriodId,
            name: val.periodName,
            typeId: val.salaryTypeId,
          }));
      });
  }

  public SalaryLocationList = [];
  public GetSalaryLocationJson() {
    this.master.salaryLocationSelected = null;
    this.comboService.GetSalaryLocationJson().subscribe((returns: any) => {
      this.SalaryLocationList = returns.data.map((val) => ({
        id: val.salaryLocationId,
        name: val.Name,
      }));
    });
  }

  public ProcessSalary() {
    if (this.master.salaryPeriodId == 0 || this.master.salaryPeriodId == null) {
      this.toastrService.danger("Please select salary period", "Message");
      return false;
    }
    this.salaryprocessService
      .ProcessEmployeesSalary(this.master)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.processmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.salaryprocessService
            .GetSalaryMasterByPeriodId(this.master.salaryPeriodId)
            .subscribe((data: any) => {
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
    this.GetRptPayslip(this.master.empId, this.master.salaryPeriodId);
    //this.getGridData();
    this.showbody = true;
  }

  private getGridData() {
    if (this.master.salaryPeriodId == 0 || this.master.salaryPeriodId == null) {
      this.toastrService.danger("Please select salary period", "Message");
      return false;
    }
    this.salaryprocessService
      .GetSalaryMasterByPeriodId(this.master.salaryPeriodId)
      .subscribe((data: any) => {
        if (data.status) {
          this.bodyData = data.data;
          this.showbody = false;
          this.totalEmployee = data.data[0].totalEmployee;
        }
      });
  }

  public GetRptPayslip(employeeId, salaryPeriodId) {
    this.salaryreportService
      .RptPayslip(1, 1, employeeId, salaryPeriodId, "Pdf")
      .subscribe((returns: any) => {
        this.commonService.GenerateBase64ToReport(returns);
      });
  }

  public generateReport(buttonAction: any) {
    this.GetRptPayslip(this.master.empId, this.master.salaryPeriodId);
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
    let salaryTypeId = this.master.salaryPeriodSelected["typeId"];
    let Location = 0;
    if (this.master.salaryLocationSelected != null) {
      Location = this.master.salaryLocationSelected["id"];
    }
    //alert(salaryTypeId);
    this.salaryreportService
      .RptSalarySheet(
        this.companyId,
        1,
        this.master.salaryPeriodId,
        "Pdf",
        this.master.typeId,
        salaryTypeId,
        Location
      )
      .subscribe((returns: any) => {
        this.commonService.GenerateBase64ToReport(returns);
      });
  }

  public GetRptSalarySheetExcel() {
    let Location = 0;
    if (this.master.salaryLocationSelected != null) {
      Location = this.master.salaryLocationSelected["id"];
    }
    let salaryTypeId = this.master.salaryPeriodSelected["typeId"];
    this.salaryreportService
      .RptSalarySheet(
        this.companyId,
        1,
        this.master.salaryPeriodId,
        "Excel",
        this.master.typeId,
        salaryTypeId,
        Location
      )
      .subscribe((returns: any) => {
        this.commonService.GenerateBase64ToReport(returns);
      });
  }

  // Excel
  private getReportDataExcel() {
    let salaryTypeId = this.master.salaryPeriodSelected["typeId"];

    let Location = 0;
    if (this.master.salaryLocationSelected != null) {
      Location = this.master.salaryLocationSelected["id"];
    }

    ////////// Call common service for report data/////////
    this.apiUrl = `SalaryReport/RptMonthlySalarySheetJson?reportFormat=Excel&companyId=${this.companyId}&sbuId=1&salaryPeriodId=${this.master.salaryPeriodId}&reportType=${this.master.typeId}&salaryLocation=${Location}`;

    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyDataExcel = returns.data;
        var fileName = this.pageNavigation + ".xlsx";
        this.generateExcelPR(this.bodyDataExcel, this.tableHeader, fileName);
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
        item.designationSales,
        item.department,
        item.joiningDate,
        item.salaryLocation,
        item.basic,
        item.houseRent,
        item.medical,
        item.transport,
        item.Utility,
        item.upkeepAllow,
        item.otherAllowance,
        item.arrear,
        item.bonus,
        item.increamentArrear,
        item.grossPay,
        item.pf,
        item.tax,
        item.mobile,
        item.food,
        item.mcLoan,
        item.advLoan,
        item.revenueStamp,
        item.lwp,
        item.otherDeduction,
        item.totalDeduction,
        item.netAmount,
        item.remarks,
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
    // let headerName = this.worksheet.addRow([this.companyName]);
    // headerName.font = { size: 16, underline: "double", bold: true };
    // headerName.alignment = {
    //   vertical: "middle",
    //   horizontal: "center",
    //   wrapText: true,
    // };
    // this.worksheet.mergeCells(
    //   `A${headerName.number}:${endColumn + headerName.number}`
    // );

    // let headerAddress = this.worksheet.addRow([this.addressLine]);
    // headerAddress.font = { size: 10 };
    // headerAddress.alignment = {
    //   vertical: "middle",
    //   horizontal: "center",
    //   wrapText: true,
    // };
    // this.worksheet.mergeCells(
    //   `A${headerAddress.number}:${endColumn + headerAddress.number}`
    // );

    // let headerPhone = this.worksheet.addRow([
    //   this.officeTelephone,
    // ]);
    // headerPhone.font = { size: 10 };
    // headerPhone.alignment = {
    //   vertical: "middle",
    //   horizontal: "center",
    //   wrapText: true,
    // };
    // this.worksheet.mergeCells(
    //   `A${headerPhone.number}:${endColumn + headerPhone.number}`
    // );

    // let headerWebsite = this.worksheet.addRow([
    //   this.companyEmail + "; " + this.website,
    // ]);
    // headerWebsite.font = { size: 10 };
    // headerWebsite.alignment = {
    //   vertical: "middle",
    //   horizontal: "center",
    //   wrapText: true,
    // };
    // this.worksheet.mergeCells(
    //   `A${headerWebsite.number}:${endColumn + headerWebsite.number}`
    // );

    // headerName.getCell(1).fill = {
    //   type: "pattern",
    //   pattern: "solid",
    //   fgColor: { argb: "FFCCFFE5" },
    // };
    // headerName.getCell(1).border = {
    //   top: { style: "thin" },
    //   left: { style: "thin" },
    //   bottom: { style: "thin" },
    //   right: { style: "thin" },
    // };

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
    // //Footer Row
    // let footerRow = this.worksheet.addRow([
    //   "This excel sheet is generated by ONE ERP.",
    // ]);
    // footerRow.getCell(1).fill = {
    //   type: "pattern",
    //   pattern: "solid",
    //   fgColor: { argb: "FFCCFFE5" },
    // };
    // footerRow.getCell(1).border = {
    //   top: { style: "thin" },
    //   left: { style: "thin" },
    //   bottom: { style: "thin" },
    //   right: { style: "thin" },
    // };
    // //Merge Cells
    // footerRow.alignment = {
    //   vertical: "middle",
    //   horizontal: "center",
    //   wrapText: true,
    // };
    // this.worksheet.mergeCells(
    //   `A${footerRow.number}:${endColumn + footerRow.number}`
    // );
    // Generate Excel File
    this.workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      // Given name
      FileSaver.saveAs(blob, fileName);
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

  LoadType() {
    if (this.master.salaryPeriodSelected["typeId"] == 2) {
      this.typeload = false;
    } else {
      this.typeload = true;
    }
  }

  ApprovalStatusBonusList: {};
  ApprovalStatusBonusSelected: {};
  loadApprovalStatusBonusList() {
    this.ApprovalStatusBonusList = [
      {
        id: "Bonus Sheet",
        name: "Bonus Sheet",
      },
      {
        id: "Bonus Summary Sheet",
        name: "Bonus Summary Sheet",
      },
    ];
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }
}
