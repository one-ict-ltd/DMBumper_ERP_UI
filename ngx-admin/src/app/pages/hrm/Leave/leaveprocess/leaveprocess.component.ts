import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
import { SalaryperiodService } from "app/services/salary/salarymaster/salaryperiod.service";
import { SalaryprocessService } from "app/services/salary/salaryprocess/salaryprocess.service";
import { SalaryreportService } from "app/services/salary/salaryprocess/salaryreport.service";
import { LeaveService } from "app/services/hrm/leave.service";
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

@Component({
  selector: 'ngx-leaveprocess',
  templateUrl: './leaveprocess.component.html',
  styleUrls: ['./leaveprocess.component.scss']
})
export class LeaveprocessComponent implements OnInit {

  master: {
    leaveYearId: number;
    leavePolicyId: number;

    leaveYearSelected: {};
    leavePolicySelected: {};
  };
  public getMaster() {
    this.master = {
      leaveYearId: 0,
      leavePolicyId: 0,

      leaveYearSelected: null,
      leavePolicySelected: null,
    };
  }
  public pageNavigation = "Employee Leave Process";
  public tableHeader = [
    "#",
    "Full Name",
    "Designation",
    "Bank Payable",
    "Cash Payable",
    "Net Payable",
  ];

  public apiUrl = "";
  public bodyData: any = [];
  public bodyDatashow: any = [];
  public params = [];
  public leaveYearItems = [];
  public leavePolicyItems = [];

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

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private salaryperiodService: SalaryperiodService,
    private salaryprocessService: SalaryprocessService,
    private salaryreportService: SalaryreportService,
    private leaveService: LeaveService,
  ) {

    this.LoadLeaveYear();
    this.getCompanyAddress();
    this.getMaster();

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
      this.companyData = returns.data;
      this.companyName = this.companyData[0].companyName;
      this.addressLine = this.companyData[0].addressLine;
      this.officeTelephone = this.companyData[0].officeTelephone;
      this.companyEmail = this.companyData[0].companyEmail;
      this.website = this.companyData[0].website;
    });
  }

  public LoadLeaveYear() {
    this.leaveService.getLeaveYear().subscribe((returns: any) => {
      this.leaveYearItems = returns.data.map((val) => ({
        id: val.leaveYearId,
        name: val.yearName,
      }));
    });
  }

  public LoadLeavePolicy() {
    this.leaveService.getleavePolicyByYearId(this.master.leaveYearId).subscribe((returns: any) => {
      this.leavePolicyItems = returns.data.map((val) => ({
        id: val.leavePolicyId,
        name: val.typeName,
      }));
    });
  }

  public ProcessSalary() {
    var result = confirm("Are you sure you want to Process this Leave policy?");
    if (result) {
      if (this.master.leaveYearId == 0 || this.master.leaveYearId == null) {
        this.toastrService.danger("Please select Leave year", "Message");
        return false;
      }
      this.leaveService.processLeavePolicy(this.master)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(this.commonService.processmsg, "Message");

            //////////////Grid Refresh ///////////////////
            this.leaveService.getleaveOpeningBalanceByYearId(this.master.leaveYearId).subscribe((data: any) => {
              if (data.status) {
                this.bodyData = data.data;
                this.showbody = true;
              }
            });
            //////////////Grid Refresh ///////////////////
          }
        });
    }

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
    if (this.master.leaveYearId == 0 || this.master.leaveYearId == null) {
      this.toastrService.danger("Please select leave year", "Message");
      return false;
    }

    this.leaveService.getleaveOpeningBalanceByYearId(this.master.leaveYearId).subscribe((data: any) => {
      if (data.status) {
        //console.log(data.data);
        this.bodyData = data.data;
        this.showbody = true;
      }
    });
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
    this.GetRptSalarySheetExcel();
  }

  public GetRptSalarySheetPdf() {
    if (this.master.leaveYearId == 0 || this.master.leaveYearId == null) {
      this.toastrService.danger("Please select salary period", "Message");
      return false;
    }
    this.salaryreportService.RptSalarySheet(1, 1, this.master.leaveYearId, "Pdf").subscribe((returns: any) => {
      this.commonService.GenerateBase64ToReport(returns);
    });
  }

  public GetRptSalarySheetExcel() {
    this.salaryreportService.RptSalarySheet(1, 1, this.master.leaveYearId, "Excel").subscribe((returns: any) => {
      this.commonService.GenerateBase64ToReport(returns);
    });
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

}
