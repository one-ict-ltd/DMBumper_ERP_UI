import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../../@core/mock/common.service";
import { ProcessattendanceService } from "app/services/attendance/processattendance.service";
import { HrmmasterService } from "app/services/hrm/hrmmaster.service";


@Component({
  selector: 'ngx-daily-attendance',
  templateUrl: './daily-attendance.component.html',
  styleUrls: ['./daily-attendance.component.scss']
})
export class DailyAttendanceComponent implements OnInit {
  master: {
    companyId: number;
    startDate: Date;
    endDate: Date;
    departmentId: number;
    sbuId: number;
  };
  SbuList = [];
  DepartmentList = [];
  element = { id: 0, name: "All" };
  companySelected = {};
  SbuSelected = {};
  DepartmentSelected = {};

  public getMaster() {
    this.master = {
      companyId: 0,
      startDate: new Date(),
      endDate: new Date(),
      departmentId: 0,
      sbuId: 0,
    };
    this.companySelected = { id: 0, name: "select one" };
    this.SbuSelected = this.element;
    this.DepartmentSelected = this.element;
  }
  public pageNavigation = "Daily Attendance Report";
  rReportHeader = "Daily Attendance Report";
  public tableHeader = [
    "#",
    "Emp. No",
    "Name",
    "Designation",
    "Department",
    "Att. Date",
    "Check In",
    "Check Out",
    "Working Time",
    //"workingTimeTest",
    "Late Time",
    //"latetimeTest",
    "Status",
  ];

  apiUrl = "";
  bodyData: any = [];
  showbody: boolean = false;
  totalEmployee = 0;
  ttlEmp = 0;
  ttlPresent = 0;
  ttlLeave = 0;
  ttlAbsent = 0;
  ttlLate = 0;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private processattendanceService: ProcessattendanceService,
    private hrmmasterService: HrmmasterService,
  ) {
    this.LoadCompany();
    this.getMaster();
    this.GetDepartment();
  }

  ngOnInit(): void { }
  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      this.generateReport("pdf");
    } else if (clicked == "print") {
      this.generateReport("pdf");//this.generateReport("print");
    } else if (clicked == "csv") {
      //this.generateReport("Excel");
      this.onExportCSV();
    } else if (clicked == "refresh") {
      this.onRefresh();
    } else if (clicked == "email") {
      this.onEmail();
    } else {
      this.toastrService.warning("Message", "please clicked any button");
    }
  }

  public companyItems = [];
  public LoadCompany() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyItems = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  public getSBU(companyId) {
    this.SbuSelected = null;
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.SbuList = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
      if (this.SbuList.length > 0)
        this.SbuList.splice(0, 0, this.element);
      this.SbuSelected = this.element;
    });
  }

  public GetDepartment() {
    this.hrmmasterService.getDepartment(0).subscribe((returns: any) => {
      this.DepartmentList = returns.data.map((val: any) => ({
        id: val.departmentId,
        name: val.deptName,
      }));
      if (this.DepartmentList.length > 0)
        this.DepartmentList.splice(0, 0, this.element);
    })
  }

  private onRefresh() {
    this.getMaster();
    this.bodyData = [];
    this.showbody = false;
  }

  private onPreview() {
    this.getGridData();
    this.showbody = true;
  }

  attendanceDate = "";
  summaryData = [];
  Branch = '';
  Department = '';

  private getCrReport(reportFormat: any = 'pdf') {
    let fDate = this.commonService.DateFormat(this.master.startDate);
    let tDate = this.commonService.DateFormat(this.master.endDate);

    this.processattendanceService
      .DailyAttendanceReportCR(
        this.master.companyId,
        this.master.sbuId,
        this.master.departmentId,
        fDate,
        tDate,
        reportFormat
      )
      .subscribe((returns: any) => {
        this.commonService.GenerateBase64ToReport(returns);
      });
  }
  private getGridData() {
    if (this.master.companyId == 0 || this.master.companyId == null) {
      this.toastrService.danger("Please select company", "Message");
      return false;
    }
    if (this.master.startDate == null) {
      this.toastrService.danger("Please select a date", "Message");
      return false;
    }
    this.attendanceDate = this.commonService.DateFormat(this.master.startDate);
    this.master.startDate = this.commonService.DateFormat(this.master.startDate);

    this.processattendanceService
      .DailyAttendanceReport(
        this.attendanceDate,
        this.master.companyId,
        this.master.sbuId,
        this.master.departmentId,
      )
      .subscribe((data: any) => {
        if (data.status) {
          this.bodyData = data.data;
          //console.log(this.bodyData);
          this.showbody = true;
          this.totalEmployee = this.bodyData.length;

          this.ttlEmp = this.totalEmployee;
          this.ttlLeave = this.GetCount('Leave');
          this.ttlAbsent = this.GetCount('Absent');
          this.ttlLate = this.GetCount('Late');
          this.ttlPresent = this.ttlEmp - this.ttlAbsent;//this.bodyData.filter(obj => obj.status != 'Absent').length; //this.GetCount('Present');

          this.summaryData.push(this.bodyData[0]);
          //console.log(this.SbuSelected);

          this.Branch = this.SbuSelected["name"] == null ? 'All' : this.SbuSelected["name"];
          this.Department = this.DepartmentSelected["name"] == null ? 'All' : this.DepartmentSelected["name"];
        }
      });
  }
  GetCount(character) {
    return this.bodyData.filter(obj => obj.status === character).length;
  }
  public generateReport(rptFormat: any) {
    // const content = document.getElementById("reportHeader");
    // this.commonService.GenerateReport(this.rReportHeader, rptFormat, "l", content);
    this.getCrReport(rptFormat);
  }

  private onExportCSV() {

    let cellDataArray = this.bodyData.map((item, index) => {
      return [
        index + 1
        , item.employeeNo
        , item.fullName
        , item.currentDesignation
        , item.currentDepartment
        , item.attendanceDate
        , item.startTime
        , item.endTime
        , item.workingTimeTest
        , item.latetimeTest
        , item.status
      ];
    });

    let summary = this.summaryData.map((item, index) => {
      return [
        'Total '
        , `Employee: ${this.ttlEmp}`
        , `Leave: ${this.ttlLeave}`
        , `Present: ${this.ttlPresent}`
        , `Absent: ${this.ttlAbsent}`
        , `Late: ${this.ttlLate}`
      ];
    });

    this.commonService.GenerateCSV(cellDataArray, this.tableHeader, this.rReportHeader, [], summary)
  }

  public GetRptSalarySheetPdf() {
    if (this.master.companyId == 0 || this.master.companyId == null) {
      this.toastrService.danger("PDF button click", "Message");
      return false;
    }
    // this.salaryreportService.RptSalarySheet(1, 1, this.master.companyId, "Pdf").subscribe((returns: any) => {
    //   this.commonService.GenerateBase64ToReport(returns);
    // });
  }

  public onExcel() {
    this.toastrService.warning("Message", "Excel button clicked");
  }

  private onEmail() {
    this.toastrService.warning("Message", "Email button clicked");
  }
}
