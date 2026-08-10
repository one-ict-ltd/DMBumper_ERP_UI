import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommonService } from "app/@core/mock/common.service";
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";
import { SalaryheadService } from "app/services/salary/salarymaster/salaryhead.service";
import { take } from "rxjs/operators";
import * as XLSX from "xlsx-js-style";
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

@Component({
  selector: 'ngx-salary-sheet',
  templateUrl: './salary-sheet.component.html',
  styleUrls: ['./salary-sheet.component.scss']
})
export class SalarySheetComponent implements OnInit {
  master: {
    salaryHeadId: number;
    empId: number;
    salaryHeadSelected: {};
    empSelected: {};
  };


  companyName: string;
  fullName: string;
  headName: string;
  employeeNo: string;
  currentDesignation: string;
  currentDepartment: string;
  joiningDate: string;
  salary_Location: string;
  empSelected = {};
  userProfile: any[];
  companyAlias: string;
  reportTitleName: string = "Individual Salary Report";
  dateRange: string;
  public tableHeaderP = [];
  public tableHeaderPP = [];
  showbody = false;
  showbody1 = false;
  bodyData: any = [];
  noDataAvailable: boolean = false;


  private basicTotal: number = 0;
  private houseRentTotal: number = 0;
  private medicalTotal: number = 0;
  private transportTotal: number = 0;
  private utilityTotal: number = 0;
  private upkeepAllowTotal: number = 0;
  private otherAllowTotal: number = 0;
  private arrearTotal: number = 0;
  private bonusTotal: number = 0;
  private incArrearTotal: number = 0;
  private grossPayTotal: number = 0;
  private providentFundTotal: number = 0;
  private itTotal: number = 0;
  private mobileBillTotal: number = 0;
  private foodDedTotal: number = 0;
  private motorCycleTotal: number = 0;
  private advanceLoanTotal: number = 0;
  private revenueStampTotal: number = 0;
  private lwpTotal: number = 0;
  private otherDeductionTotal: number = 0;
  private totalDeductionTotal: number = 0;
  private netAmountTotal: number = 0;
  private Amountsum: number = 0;


  public getMaster() {
    this.master = {
      salaryHeadId: 0,
      empId: 0,
      salaryHeadSelected: null,
      empSelected: null
    };
  }
  public pageNavigation = "Individual Salary Report";
  public apiUrl = "";
  public salaryHeadItems = [];
  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private employeeinformationService: EmployeeinformationService,
    private salaryheadService: SalaryheadService,
  ) {
    this.LoadSalaryHead();
    this.getMaster();
    this.LoadEmployee();
    this.userProfile = commonService.GetUserProfileJson();
    this.companyName = this.userProfile[0].uc[0].companyName;
    this.companyAlias = this.userProfile[0].uc[0].aliasName;
  }

  onSalaryHeadChange(event) {
    if (!event) {
      this.master.salaryHeadId = 0;
    } else {
      this.master.salaryHeadId = event.id;
    }
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
      this.ExportTOExcel(this.reportTitleName);
    } else if (clicked == "refresh") {
      this.onRefresh();
    } else if (clicked == "email") {
      this.onEmail();
    } else {
      this.toastrService.warning("Message", "please clicked any button");
    }
  }
  empItems = [];
  LoadEmployee(): void {
    this.employeeinformationService
      .GetEmployeeInfoLoadById(0)
      .subscribe((returns: any) => {
        this.empItems = returns.data.map((val) => ({
          id: val.employeeId,
          name: val.fullName,
          joiningDate: val.joiningDate,
          currentDesignation: val.currentDesignation,
          currentDepartment: val.currentDepartment,
          serviceLenth: val.serviceLenth,
        }));
      });
  }

  public LoadSalaryHead() {
    debugger;
    this.salaryheadService.GetSalaryHeadById(0)
      .subscribe((returns: any) => {
        this.salaryHeadItems = returns.data
          .map((val) => ({
            id: val.salaryHeadId,
            name: val.salaryHeadName
          }));
      });
  }

  private onRefresh() {
     this.bodyData = [];
     this.showbody = false;
     this.showbody1 = false;
  }

  private onPreview() {
    this.getReportData(this.master.empId, this.master.salaryHeadId);
  }


  public GetSalarySheet(employeeId, salaryHeadId) {
    let userInfo = this.commonService.GetUserProfileJson();
    if (salaryHeadId === 0) {
      const apiUrl = `SalaryReport/GetSalarySheetById?reportFormat=Pdf&userId=${userInfo[0].employeeid}&employeeId=${employeeId}&salaryHeadId=${salaryHeadId}`;
      this.commonService
        .GetCrystalReportData(apiUrl)
        .pipe(take(1))
        .subscribe((returns: any) => {
          let res = JSON.parse(returns);
          if (res.status) {
            this.commonService.GenerateBase64ToReport(res.data[0].data);
          } else {
            this.toastrService.warning("Message", this.commonService.nodatafound);
          }
        });
    } else {
      const apiUrl = `SalaryReport/GetSalarySheetHeadWise?reportFormat=Pdf&userId=${userInfo[0].employeeid}&employeeId=${employeeId}&salaryHeadId=${salaryHeadId}`;
      this.commonService
        .GetCrystalReportData(apiUrl)
        .pipe(take(1))
        .subscribe((returns: any) => {
          let res = JSON.parse(returns);
          if (res.status) {
            this.commonService.GenerateBase64ToReport(res.data[0].data);
          } else {
            this.toastrService.warning("Message", this.commonService.nodatafound);
          }
        });
    }
  }

  public generateReport(_buttonAction: any) {
    this.GetSalarySheet(this.master.empId, this.master.salaryHeadId);
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  @ViewChild("simple_table", { static: false }) TABLE: ElementRef;

  private ExportTOExcel(fileName: string) {
    console.log(fileName);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.TABLE.nativeElement
    );

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    fileName = fileName + ".xlsx";
    console.log(fileName);
    XLSX.writeFile(wb, fileName);
  }

  private getReportData(employeeId, salaryHeadId) {
    let userInfo = this.commonService.GetUserProfileJson();
    if (salaryHeadId == 0) {
      this.apiUrl = "";
      this.apiUrl = `SalaryReport/GetSalarySheetHeadWise?userId=${userInfo[0].employeeid}&employeeId=${employeeId}&salaryHeadId=${salaryHeadId}`;

      this.tableHeaderP = ["Sl. No.", "Period", "Basic", "House Rent", "Medical", "Transport", "Utility", "Upkeep Allow", "Other Allow", "Arrear", "Bonus", "Incr. Arrear", "Gross Pay", "PF", "Tax", "Mobile", "Food", "Motor Cycle", "Adv. Loan", "Revenue Stamp", "LWP", "Other Deduction", "Total Deduction", "Net"];
      this.showbody1 = false;
      this.showbody = true;

      this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
        this.bodyData = [];
        if (returns.success) {
          this.bodyData = returns.data.map((item, index) => {
            item.sl = index + 1;
            return item;
          });
          this.bodyData.forEach((item) => {
            this.basicTotal += item.Basic;
            this.houseRentTotal += item.HouseRent;
            this.medicalTotal += item.Medical;
            this.transportTotal += item.Transport;
            this.utilityTotal += item.Utility;
            this.upkeepAllowTotal += item.UpkeepAllow;
            this.otherAllowTotal += item.OtherAllow;
            this.arrearTotal += item.Arrear;
            this.bonusTotal += item.Bonus;
            this.incArrearTotal += item.IncArrear;
            this.grossPayTotal += item.GrossPay;
            this.providentFundTotal += item.ProvidentFund;
            this.itTotal += item.IT;
            this.mobileBillTotal += item.MobileBill;
            this.foodDedTotal += item.FoodDed;
            this.motorCycleTotal += item.MotorCycle;
            this.advanceLoanTotal += item.AdvanceLoan;
            this.revenueStampTotal += item.RevenueStamp;
            this.lwpTotal += item.LWP;
            this.otherDeductionTotal += item.OtherDeduction;
            this.totalDeductionTotal += item.TotalDeduction;
            this.netAmountTotal += item.NetAmount;
          });
          if (returns.data[0].fullName) {
            this.fullName = returns.data[0].fullName;
          }

          if (returns.data[0].employeeNo) {
            this.employeeNo = returns.data[0].employeeNo;
          }

          if (returns.data[0].currentDesignation) {
            this.currentDesignation = returns.data[0].currentDesignation;
          }

          if (returns.data[0].currentDepartment) {
            this.currentDepartment = returns.data[0].currentDepartment;
          }

          if (returns.data[0].joiningDate) {
            this.joiningDate = returns.data[0].joiningDate;
          }

          if (returns.data[0].salary_Location) {
            this.salary_Location = returns.data[0].salary_Location;
          }

        } else {
          this.noDataAvailable = true;
        }
      });
    }
    else {
      this.apiUrl = "";
      this.apiUrl = `SalaryReport/GetSalarySheetHeadWise?userId=${userInfo[0].employeeid}&employeeId=${employeeId}&salaryHeadId=${salaryHeadId}`;
      this.Amountsum = 0;

      this.showbody = false;
      this.showbody1 = true;
      this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
        this.bodyData = [];
        if (returns.success) {
          this.bodyData = returns.data.map((item, index) => {
            item.sl = index + 1;
            return item;
          });
          this.bodyData.forEach((item) => {
            this.Amountsum += item.Amount
          });
          if (returns.data[0].fullName) {
            this.fullName = returns.data[0].fullName;
          }

          if (returns.data[0].employeeNo) {
            this.employeeNo = returns.data[0].employeeNo;
          }

          if (returns.data[0].currentDesignation) {
            this.currentDesignation = returns.data[0].currentDesignation;
          }

          if (returns.data[0].currentDepartment) {
            this.currentDepartment = returns.data[0].currentDepartment;
          }

          if (returns.data[0].joiningDate) {
            this.joiningDate = returns.data[0].joiningDate;
          }

          if (returns.data[0].salary_Location) {
            this.salary_Location = returns.data[0].salary_Location;
          }
          if (returns.data[0].headName) {
            this.headName = returns.data[0].headName;
          }
          this.tableHeaderP = ["Sl. No.", "Period", this.headName];
        } else {
          this.noDataAvailable = true;
        }
      });
    }
  }
}
