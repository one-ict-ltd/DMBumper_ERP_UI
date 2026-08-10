import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { DomSanitizer } from "@angular/platform-browser";
import { CommonService } from "app/@core/mock/common.service";
import { FiscalyearService } from "app/services/budget/fiscalyear.service";
import { HrmmasterService } from "app/services/hrm/hrmmaster.service";
import { ProcessattendanceService } from "app/services/attendance/processattendance.service";

@Component({
  selector: 'ngx-joining-report',
  templateUrl: './joining-report.component.html',
  styleUrls: ['./joining-report.component.scss']
})
export class JoiningReportComponent implements OnInit {

  pageNavigation = "Employee Joning Report";
  rReportHeader = "Employee Joning Report";
  fiscalYearId: number;
  monthName: string;

  fiscalYearSelected: {};
  salaryTypeSelected: {};
  bonusTypeSelected: {};
  monthSelected: {};

  apiUrl = "";
  showbody: boolean = false;

  base64Pdf: any;
  showDateRange: boolean = false;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private fiscalyearService: FiscalyearService,
    private sanitizer: DomSanitizer,
    private hrmmasterService: HrmmasterService,
    private processattendanceService: ProcessattendanceService,
  ) {
    this.getAllDropdown();
  }

  fiscalYearItems: [];
  public LoadFiscalYear() {
    this.fiscalyearService.getFiscalYear().subscribe((returns: any) => {
      this.fiscalYearItems = returns.data.map((val) => ({
        id: val.fiscalYearId,
        name: val.yearName,
      }));
    });
  }

  monthItems: [];
  public LoadMonthName() {
    this.comboService.getCmnDropDown(0, "Month Name").subscribe((returns: any) => {
      this.monthItems = returns.data.map((val) => ({
        id: val.dropDownValue,
        name: val.dropDownText,
      }));
    });
  }

  ngOnInit(): void { }
  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      this.generateCrReport("pdf");
    } else if (clicked == "print") {
      this.generateCrReport("pdf");
    } else if (clicked == "csv") {
      //this.generateCrReport("Excel");
      this.getGridData()
    } else if (clicked == "refresh") {
      this.onRefresh();
    } else if (clicked == "email") {
      this.onEmail();
    } else {
      this.toastrService.warning("Message", "please clicked any button");
    }
  }

  generateCrReport(reportFormat: any) {
    //debugger;
    if (this.fiscalYearSelected == undefined || this.fiscalYearSelected == null) {
      this.toastrService.warning('please select a year', 'Warning');
      return;
    }
    if (this.monthSelected == undefined || this.monthSelected == null) {
      this.toastrService.warning('please select a month', 'Warning');
      return;
    }

    let heldupMonth = new Date(`${this.fiscalYearSelected['name']}-${this.monthSelected['id']}-01`);

    console.log('param :', `${this.fiscalYearSelected['name']}-${this.monthSelected['id']}-01`);
    console.log('heldupMonth : ', heldupMonth);


    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `SalaryReport/RptJoiningReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&heldupMonth=${this.commonService.DateFormat(heldupMonth)}&salaryPeriodId=${null}&departmentId=${this.departmentId}&salaryLocationId=${this.salaryLocation}`;

    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        console.log(res.message);
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }


  public getAllDropdown() {
    this.LoadFiscalYear();
    this.LoadMonthName();
    this.GetSalaryLocationJson();
    this.GetDepartment();
  }


  private getReportData() {
    if (this.fiscalYearSelected == undefined || this.fiscalYearSelected == null) {
      this.toastrService.warning('please select a year', 'Warning');
      return;
    }
    if (this.monthSelected == undefined || this.monthSelected == null) {
      this.toastrService.warning('please select a month', 'Warning');
      return;
    }

    let heldupMonth = new Date(`${this.fiscalYearSelected['name']}-${this.monthSelected['id']}-01`);

    console.log('param :', `${this.fiscalYearSelected['name']}-${this.monthSelected['id']}-01`);
    console.log('heldupMonth : ', heldupMonth);

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `SalaryReport/RptJoiningReport?reportFormat=Pdf&userId=${userInfo[0].employeeid}&heldupMonth=${this.commonService.DateFormat(heldupMonth)}&salaryPeriodId=${null}`;

    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.base64Pdf = this.sanitizer.bypassSecurityTrustResourceUrl(res.data[0].data);
      }
      else {
        console.log(res.message);
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }
  totalInvoice = 0;

  private onRefresh() {
    window.location.reload();
  }

  private onPreview() {
    this.getReportData();
    //this.showbody = true;
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  currencyFormatter(currency) {
    return this.commonService.roundWithDecimalPoint(currency, 0);
  }

  public DepartmentList = [];
  public DepartmentSelected = [];
  public departmentId = 0;
  public GetDepartment() {
    this.DepartmentSelected = null;
    this.hrmmasterService.getDepartment(0).subscribe((returns: any) => {
      console.log(returns.data);
      this.DepartmentList = returns.data.map((val: any) => ({
        id: val.departmentId,
        name: val.deptName,
      }));
    })
  }

  public SalaryLocationList = [];
  public salaryLocationSelected = [];
  public salaryLocation = 0;
  public GetSalaryLocationJson() {
    this.salaryLocationSelected = null;
    this.comboService.GetSalaryLocationJson().subscribe((returns: any) => {
      this.SalaryLocationList = returns.data.map((val) => ({
        id: val.salaryLocationId,
        name: val.Name,
      }));
    });
  }

  public tableHeader = [
    "#",
    "ID",
    "Name",
    "Designation",
    "Grade",
    "Department",
    "Salary Location",
    "Joining Date",
    "Gross Salary",
  ];

  bodyData = [];
  params = [];
  private getGridData() {
    if (this.fiscalYearSelected == undefined || this.fiscalYearSelected == null) {
      this.toastrService.warning('please select a year', 'Warning');
      return;
    }
    if (this.monthSelected == undefined || this.monthSelected == null) {
      this.toastrService.warning('please select a month', 'Warning');
      return;
    }

    let heldupMonth = new Date(`${this.fiscalYearSelected['name']}-${this.monthSelected['id']}-01`);
    let JoinDate = this.commonService.DateFormat(heldupMonth);
    // console.log('param :', `${this.fiscalYearSelected['name']}-${this.monthSelected['id']}-01`);
    // console.log('heldupMonth : ', heldupMonth);
    let dept = "ALL";
    let location = "ALL";

    if (this.salaryLocationSelected != null) {
      location = this.salaryLocationSelected['name']
    } else {
      location = "ALL";
    }

    if (this.DepartmentSelected != null) {
      dept = this.DepartmentSelected['name']
    } else {
      dept = "ALL";
    }

    this.processattendanceService
      .HrmJoiningReportJson(JoinDate,
        this.salaryLocation,
        this.departmentId
      )
      .subscribe((data: any) => {
        if (data.status) {
          this.bodyData = data.data;

          this.params = [];
          this.params.push({
            leftLabel: "Year",
            leftValue: this.fiscalYearSelected['name'],
            rightLabel: "Month",
            rightValue: this.monthSelected['name'],
          });

          this.params.push({
            leftLabel: "Salary Location",
            leftValue: location,
            rightLabel: "Department",
            rightValue: dept,
          });

          this.onExportCSV()
        }
      });
  }


  private onExportCSV() {
    let cellDataArray = this.bodyData.map((item, index) => {
      return [
        index + 1
        , item.employeeNo
        , item.empName
        , item.currentDesignation
        , item.grade
        , item.workLocation
        , item.salaryLocation
        , item.joiningDate
        , item.grossSalary
      ];
    });

    let headerParams = this.params.map((item, index) => {
      return [
        , `${item.leftLabel}`
        , `: ${item.leftValue}`
        , `${item.rightLabel}`
        , `: ${item.rightValue}`
      ];
    });

    //console.log(summary);
    this.commonService.GenerateCSV(cellDataArray, this.tableHeader, this.rReportHeader, headerParams, "")
  }




}