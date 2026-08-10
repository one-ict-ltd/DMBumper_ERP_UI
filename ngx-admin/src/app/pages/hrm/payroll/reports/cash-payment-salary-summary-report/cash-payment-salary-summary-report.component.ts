import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { CommonService } from 'app/@core/mock/common.service';
import { CommoncomboService } from 'app/services/commoncombo.service';
import { SalaryperiodService } from 'app/services/salary/salarymaster/salaryperiod.service';
import { SalaryprocessService } from 'app/services/salary/salaryprocess/salaryprocess.service';
import { SalaryreportService } from 'app/services/salary/salaryprocess/salaryreport.service';
import { HrmmasterService } from "app/services/hrm/hrmmaster.service";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";

@Component({
  selector: 'ngx-cash-payment-salary-summary-report',
  templateUrl: './cash-payment-salary-summary-report.component.html',
  styleUrls: ['./cash-payment-salary-summary-report.component.scss']
})
export class CashPaymentSalarySummaryReportComponent implements OnInit {

  master: {
    salaryDepotName: string;
    salaryPeriodId: number;
    typeId: number;
    salaryTypeId: number;
    processComments: string;
    empTypeName: string;

    salaryPeriodSelected: {};
    salaryDepotSelected: {};
    salaryTypeSelected: {};
    empTypeSelected: {}
  };
  public getMaster() {
    this.master = {
      salaryDepotName: '',
      salaryPeriodId: 0,
      typeId: 0,
      salaryTypeId: 2,
      processComments: '',
      empTypeName: '',

      salaryPeriodSelected: null,
      salaryDepotSelected: null,
      salaryTypeSelected: { id: 2, name: 'Cash Payment' },
      empTypeSelected: null
    };
  }
  empTypeList = [{ 'id': '0', 'name': 'Top Management' }, { 'id': '1', 'name': 'General Employee' }];

  salaryTypeList: any[] = [
    // { id: 1, name: 'Bank' },
    { id: 2, name: 'Cash Payment' }
  ];

  public pageNavigation = "Salary Summary Report (Cash Payment)";
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
    private hrmmasterService: HrmmasterService
  ) {

    this.LoadSalaryPeriod();
    this.getCompanyAddress();
    this.getMaster();
    this.loadApprovalStatusList();
    this.getAllSalaryDepot();
    this.GetDepartment();

  }

  ngOnInit(): void { }
  public RptButtonAction() {
    debugger
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
          this.salaryprocessService.GetSalaryMasterByPeriodId(this.master.salaryPeriodId, this.master.salaryDepotName).subscribe((data: any) => {
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
    let salaryDepotName = this.master.salaryDepotSelected == undefined || null ? '' : this.master.salaryDepotSelected['name'];
    if (this.master.salaryPeriodId == 0 || this.master.salaryPeriodId == null) {
      this.toastrService.danger("Please select salary period", "Message");
      return false;
    }
    this.salaryprocessService.GetSalaryMasterByPeriodId(this.master.salaryPeriodId, salaryDepotName).subscribe((data: any) => {
      if (data.status) {
        this.bodyData = data.data;
        this.showbody = true;
        this.totalEmployee = data.data[0].totalEmployee;
      }
    });
  }

  public DepartmentList = [];
  public DepartmentSelected = [];
  public departmentIds = "";
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
    debugger
    // if (this.master.salaryDepotName == (undefined || null || '')) {
    //   this.toastrService.danger("Please select salary depot", "Message");
    //   return false;
    // }
    if (this.master.salaryDepotName == undefined || null || '') {
      this.master.salaryDepotName = '';
    }
    if (this.master.salaryPeriodId == 0 || this.master.salaryPeriodId == null) {
      this.toastrService.danger("Please select salary period", "Message");
      return false;
    }
    // if (this.master.empTypeName == (undefined || null || '')) {
    //   this.toastrService.danger("Please select employee type", "Message");
    //   return false;
    // }
    let salaryDepotName = this.master.salaryDepotSelected == undefined || null ? '' : this.master.salaryDepotSelected['name'];
    let empTypeName = this.master.empTypeSelected == undefined || null ? '' : this.master.empTypeSelected['name'];

    // if (this.master.typeId == 0 || this.master.typeId == null) {
    //   this.toastrService.danger("Please select report type", "Message");
    //   return false;
    // }
    if (this.master.salaryTypeId == 0 || this.master.salaryTypeId == null) {
      this.toastrService.danger("Please select salary type", "Message");
      return false;
    }


    if (this.DepartmentSelected && Object.keys(this.DepartmentSelected).length > 0) {
      const deptArray = Object.values(this.DepartmentSelected) as { id: string; name: string }[];

      const deptCodes = deptArray.map((deparments) => deparments.id).join(',');
      this.departmentIds = deptCodes;

    }
    this.salaryreportService.RptSalarySummarySheet(this.companyId, 1, this.master.salaryPeriodId, "Pdf", this.master.salaryTypeId, this.master.typeId, salaryDepotName, true, empTypeName, this.departmentIds).subscribe((returns: any) => {
      this.commonService.GenerateBase64ToReport(returns);
    });
  }

  public GetRptSalarySheetExcel() {
    let salaryDepotName = this.master.salaryDepotSelected == undefined || null ? '' : this.master.salaryDepotSelected['name'];
    let empTypeName = this.master.empTypeSelected == undefined || null ? '' : this.master.empTypeSelected['name'];
    if (this.DepartmentSelected && Object.keys(this.DepartmentSelected).length > 0) {
      const deptArray = Object.values(this.DepartmentSelected) as { id: string; name: string }[];

      const deptCodes = deptArray.map((deparments) => deparments.id).join(',');
      this.departmentIds = deptCodes;

    }
    this.salaryreportService.RptSalarySummarySheet(this.companyId, 1, this.master.salaryPeriodId, "Excel", this.master.salaryTypeId, this.master.typeId, salaryDepotName, true, empTypeName, this.departmentIds).subscribe((returns: any) => {
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
  salaryDepotList: any[];
  getAllSalaryDepot() {
    debugger
    this.salaryDepotList = [];
    this.salaryperiodService.GetAllSalaryDepot().subscribe((response: any) => {
      this.salaryDepotList = response.data;
    })
  }

}
