import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { Router } from '@angular/router';
import { DatePipe } from "@angular/common";
import { HrmmasterService } from "app/services/hrm/hrmmaster.service";
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";

@Component({
  selector: 'ngx-final-settlement',
  templateUrl: './final-settlement.component.html',
  styleUrls: ['./final-settlement.component.scss']
})
export class FinalSettlementComponent implements OnInit {
  master: {
    finalSettlementMasterId: number;
    employeeId: number;
    grossSalary: number;
    basicSalary: number;
    lastMonthSalary: number;
    lMSalaryStatus: string;
    mcInstallmentNo: string;
    mcInstallmentAmmount: number;
    employmentType: string;
    pFEligibility: string;
    resignationDate: Date;
    pFContributionDuration: string;
    noticeProvided: string;
    pFAmount: number;
    LWD: Date;
    aLBalance: string;
    noticeShortfall: string;
    lengthOfService: string;
    resignationEffectiveDate: Date;
    serviceBenefitDuration: string;
    signatoryType: string;
    approvalemployeeName: string;
    approvalEmployeeId: number;
    SignatoryList: any[];
    employeeSelected: {};
    sortOrder: number;

    finalSettlementDetails: any[];
    currentDesignation: string;
    currentDepartment: string;
    employeeNo: string;
    employeeTypeId: number;
    fullName: string;
    salaryLocation: string;
    joiningDate: Date;
    totalPayable: number;
    totalReceivable: number;
  };
  show: boolean = true;
  payableList: any = [];
  receivableList: any = [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };
  constructor(private http: HttpClient,
    //private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private comboService: CommoncomboService,
    private hrmmasterService: HrmmasterService,
    private router: Router,
    private employeeinformationService: EmployeeinformationService) {
    this.commonService.valueSet('showlist');
    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 70,
      },
      {
        headerName: "Employee's Name",
        field: "fullName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 250,
      },
      {
        headerName: "Resignation Date",
        field: "resignationDate",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Resignation Effective Date",
        field: "resignationEffectiveDate",
        filter: "agTextColumnFilter",
        editable: false,
        width: 140,
      },
      {
        headerName: "Length Of Service",
        field: "lengthOfService",
        filter: "agTextColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Last Month Salary",
        field: "lastMonthSalary",
        editable: false,
        width: 180,
      },
      {
        field: "Action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) { },
        },
        minWidth: 250,
        editable: false,
        //filter: false,
        //shorable: false,
        pinned: "right",
      },
    ];
    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderer,
    };
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
    };
    this.loadReceivableList();
    this.loadPayableList();
    this.getMaster();
    this.LoadEmployees(0);
    this.LoadSignatoryTypelist();
    this.LoademployeeNamelist(0);
  }
  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
      this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      this.show = true;
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      //this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

  ngOnInit(): void {
  }
  public pageNavigation = "Employee's Final Settlement";
  public getMaster() {
    this.master = {
      finalSettlementMasterId: 0,
      employeeId: 0,
      grossSalary: 0,
      basicSalary: 0,
      lastMonthSalary: 0,
      lMSalaryStatus: 'Unpaid',
      mcInstallmentNo: '',
      mcInstallmentAmmount: 0,
      employmentType: '',
      pFEligibility: '',
      resignationDate: null,
      pFContributionDuration: '',
      noticeProvided: '',
      pFAmount: 0,
      LWD: null,
      aLBalance: '',
      noticeShortfall: '',
      lengthOfService: '',
      resignationEffectiveDate: null,
      serviceBenefitDuration: '',

      employeeNo: '',
      employeeTypeId: null,
      currentDepartment: '',
      fullName: '',
      currentDesignation: '',
      salaryLocation: '',
      joiningDate: null,

      signatoryType: '',
      approvalemployeeName: '',
      approvalEmployeeId: 0,
      SignatoryList: [],
      employeeSelected: null,
      sortOrder: 0,
      finalSettlementDetails: [],
      totalPayable: 0,
      totalReceivable: 0
    };

  }
  SelectedProcesslist = {};
  public addToDetailsGrid() {
    debugger;
    if (!this.master.signatoryType && this.master.signatoryType == null) {
      this.toastrService.warning('Please select a signatory type', 'Warnig');
      return;
    }
    if (!this.master.approvalemployeeName && this.master.approvalemployeeName == null) {
      this.toastrService.warning('Please select a Approval Employee Name', 'Warnig');
      return;
    }
    if (!this.master.sortOrder && this.master.sortOrder == null) {
      this.toastrService.warning('Please select a Sort Order', 'Warnig');
      return;
    }
    let elements = {
      signatoryType: this.master.signatoryType,
      approvalemployeeName: this.master.approvalemployeeName,
      sortOrder: this.master.sortOrder,
      employeeId: this.master.approvalEmployeeId,

    };
    this.master.SignatoryList.push(elements);
  }
  loadPayableList() {
    this.hrmmasterService
      .GetPayableList()
      .subscribe((returns: any) => {
        this.payableList = returns.data.map((val: any) => ({
          id: val.finalSettlementHeadId,
          name: val.finalSettlementHeadName,
        }));
      });
  }
  loadReceivableList() {
    this.hrmmasterService
      .GetReceivableList()
      .subscribe((returns: any) => {
        this.receivableList = returns.data.map((val: any) => ({
          id: val.finalSettlementHeadId,
          name: val.finalSettlementHeadName,
        }));
      });
  }
  public employeeItems: [];
  public LoadEmployees(empId) {
    debugger
    this.hrmmasterService.GetEmployeeInfoForFinalSettlement(empId).subscribe((returns: any) => {
      this.employeeItems = returns.data.map((val) => ({
        id: val.employeeId,
        name: val.fullName,
        joiningDate: val.joiningDate,
        resignationDate: val.heldupDate,
        currentDesignation: val.currentDesignation,
        currentDepartment: val.currentDepartment,
        salaryLocation: val.salaryLocation,
        lengthOfService: val.serviceLength,
        serviceBenefitDuration: val.serviceBenefitDuration,
        employmentType: val.empType,
        grossSalary: val.grossSalary,
        basicSalary: val.basicSalary,
        lastMonthSalary: val.lastMonthSalary,
        aLBalance: val.aLBalance,
        mcInstallmentNo: val.mcInstallmentNo,
        mcInstallmentAmmount: val.mcInstallmentAmmount,
        pFEligibility: val.pFEligibility,
        pFContributionDuration: val.pFContributionDuration,
        pFAmount: val.pFAmount,
        loanAmount: val.loanAmount,
        mcLoanAmount: val.mcLoanAmount,
        employeeNo: val.employeeNo,
        lastMonthName: val.lastMonthName
      }));
    });
  }
  signatoryTypelist: any = [];
  public LoadSignatoryTypelist() {
    this.signatoryTypelist = [
      {
        id: 1,
        name: "Prepared By",
      },
      {
        id: 2,
        name: "Checked By",
      },
      {
        id: 3,
        name: "Checked & Reviewed By",
      },
      {
        id: 4,
        name: "Recommended  By",
      }

    ];
  }
  public employeeNamelist: [];
  public LoademployeeNamelist(empId) {
    debugger
    this.employeeinformationService.GetEmployeeInfoLoadById(empId).subscribe((returns: any) => {
      this.employeeNamelist = returns.data.map((val) => ({
        id: val.employeeId,
        name: val.fullName
      }));
    });
  }
  GetEmployeeInfoDetails(data: any) {
    debugger
    this.master.joiningDate = data.joiningDate,
      this.master.currentDepartment = data.currentDepartment,
      this.master.currentDesignation = data.currentDesignation,
      this.master.resignationDate = data.resignationDate,
      this.master.salaryLocation = data.salaryLocation,
      this.master.lengthOfService = data.lengthOfService,
      this.master.serviceBenefitDuration = data.serviceBenefitDuration,
      this.master.employmentType = data.employmentType,
      this.master.grossSalary = data.grossSalary,
      this.master.basicSalary = data.basicSalary,
      this.master.lastMonthSalary = data.lastMonthSalary,
      this.master.aLBalance = data.aLBalance,
      this.master.mcInstallmentAmmount = data.mcInstallmentAmmount,
      this.master.mcInstallmentNo = data.mcInstallmentNo,
      this.master.pFEligibility = data.pFEligibility,
      this.master.pFContributionDuration = data.pFContributionDuration,
      this.master.pFAmount = data.pFAmount,
      this.payableList[0].Particulars = data.lastMonthName
    this.payableList[0].Amount = data.grossSalary,
      this.payableList[2].Particulars = data.pFContributionDuration,
      this.payableList[2].Amount = data.pFAmount,
      this.payableList[3].Days = data.aLBalance,
      this.receivableList[1].Amount = data.loanAmount,
      this.receivableList[2].Amount = data.mcLoanAmount,

      this.hrmmasterService.GetMarketOutstanding(data.joiningDate, data.heldupDate, data.employeeNo).subscribe((val: any) => {
        debugger
        if (val.success) {
          if (val.data.length > 0) {
            this.receivableList[4].Amount = val.data[0].closingBalance;
          }
          else {
            this.receivableList[4].Amount = 0;
          }
        }
      });
    this.master.totalReceivable = Number(this.receivableList[1].Amount) + Number(this.receivableList[2].Amount);
    this.master.totalPayable = Number(this.payableList[0].Amount) + Number(this.payableList[2].Amount);
  }
  prepareSavableList() {
    this.payableList.forEach((item: any) => {
      if (item.Amount && item.Amount !== 0 || item.Particulars || item.Days) {
        let elements = {
          amount: item.Amount && item.Amount !== 0 ? item.Amount : 0,
          monthOrParticulars: item.Particulars ? item.Particulars : null,
          days: item.Days ? item.Days : null,
          finalSettlementHeadId: item.id,
          finalSettlementDetailsId: item.finalSettlementDetailsId ? item.finalSettlementDetailsId : 0
        };
        this.master.finalSettlementDetails.push(elements);
      }
    });
    this.receivableList.forEach((item: any) => {
      if (item.Amount && item.Amount !== 0 || item.Particulars || item.Days) {
        let elements = {
          amount: item.Amount && item.Amount !== 0 ? item.Amount : 0,
          monthOrParticulars: item.Particulars ? item.Particulars : null,
          days: item.Days ? item.Days : null,
          finalSettlementHeadId: item.id,
          finalSettlementDetailsId: item.finalSettlementDetailsId ? item.finalSettlementDetailsId : 0
        };
        this.master.finalSettlementDetails.push(elements);
      }
    });
  }
  private save() {
    // if (this.master.employeeNo == "" || this.master.fullName == ""
    //   || this.master.genderId == null || this.master.companyId == 0 || this.master.employeeStatusId == 0 || this.master.currentDesignation == '' || this.master.currentDepartment == '') {
    //   this.toastrService.danger("Pleae fill up required field", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }
    // else if (this.master.countData != 0) {
    //   this.toastrService.danger("Duplicate employee no", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // } else if (this.master.joiningDate == null) {
    //   this.toastrService.danger("Please entry joining Date", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }
    //else {
    this.show = true;
    var button = this.commonService.buttonClicked;

    //debugger;
    this.master.joiningDate = this.commonService.DateFormat(this.master.joiningDate);
    //this.master.DOB = this.commonService.DateFormat(this.master.DOB);
    debugger
    this.prepareSavableList();
    this.hrmmasterService.SaveEmployeeFinalSettlement(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        }
        else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.getMaster();
        this.hrmmasterService.GetEmployeeFinalSettlementbyId(0).subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
        });

      }
    });
    //}
  }
  public selectdetailRows = [];
  private gridApi;
  private gridColumnApi;
  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.hrmmasterService.GetEmployeeFinalSettlementbyId(0).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }
  selectedRow: any;
  private selectedRows = [];
  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    if (data == "edit") {
      this.agEdit(event);
      this.show = false;
    } else if (data == "view") {
      this.agEdit(event);
      this.show = false;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      this.agDelete(event);
    } else {
      //this.toastrService.info("Please Click Any Button", "Message");
    }
  }
  private agEdit(event) {
    let temp = 0;
    for (let i = 0; i < this.selectedRows.length; i++) {
      if (this.selectedRows[i] == event.node.data) {
        this.selectedRows.splice(i, 1);
        this.selectedRow = event.node.data;
        temp = 1;
        this.ngOnInit();
      }
    }
    if (temp === 0) {
      this.selectedRows.push(event.node.data);
      this.selectedRow = event.node.data;
      this.master.finalSettlementMasterId = event.node.data.finalSettlementMasterId;

      this.hrmmasterService.GetEmployeeFinalSettlementbyId(this.master.finalSettlementMasterId).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0],
            this.master.joiningDate = data.data[0].joiningDate,
            this.master.resignationDate = data.data[0].resignationDate,
            this.master.currentDesignation = data.data[0].currentDesignation,
            this.master.currentDepartment = data.data[0].currentDepartment,
            this.master.salaryLocation = data.data[0].salaryLocation,
            this.master.lengthOfService = data.data[0].lengthOfService,
            this.master.serviceBenefitDuration = data.data[0].serviceBenefitDuration,
            this.master.employmentType = data.data[0].empType,
            this.master.grossSalary = data.data[0].grossSalary,
            this.master.basicSalary = data.data[0].basicSalary,
            this.master.lastMonthSalary = data.data[0].lastMonthSalary,
            this.master.aLBalance = data.data[0].aLBalance,
            this.master.mcInstallmentNo = data.data[0].mcInstallmentNo,
            this.master.mcInstallmentAmmount = data.data[0].mcInstallmentAmmount,
            this.master.pFEligibility = data.data[0].pFEligibility,
            this.master.pFContributionDuration = data.data[0].pFContributionDuration,
            this.master.pFAmount = data.data[0].pFAmount,
            this.master.employeeSelected = data.data[0].fullName,
            this.master.serviceBenefitDuration = data.data[0].serviceBenefitDuration,
            this.master.finalSettlementDetails = []
          this.hrmmasterService.GetEmployeeFinalSettlementDetailsById(this.master.finalSettlementMasterId).subscribe((data1: any) => {
            debugger
            if (data1.success) {
              data1.data.forEach((item: any) => {
                if (item.finalSettlementHeadId > 7) {
                  this.receivableList[item.finalSettlementHeadId - 8].Amount = item.amount,
                    this.receivableList[item.finalSettlementHeadId - 8].Days = item.days,
                    this.receivableList[item.finalSettlementHeadId - 8].Particulars = item.monthOrParticulars,
                    this.receivableList[item.finalSettlementHeadId - 8].finalSettlementDetailsId = item.finalSettlementDetailsId
                }
                else {
                  this.payableList[item.finalSettlementHeadId - 1].Amount = item.amount,
                    this.payableList[item.finalSettlementHeadId - 1].Days = item.days,
                    this.payableList[item.finalSettlementHeadId - 1].Particulars = item.monthOrParticulars,
                    this.payableList[item.finalSettlementHeadId - 1].finalSettlementDetailsId = item.finalSettlementDetailsId
                }

              });
            }
          })
          this.hrmmasterService.GetEmployeeFinalSettlementSignatoryById(this.master.finalSettlementMasterId).subscribe((data2: any) => {
            debugger
            if (data2.success) {
              this.master.SignatoryList = data2.data;
            }
          })
        }
      })
      this.ngOnInit();


    }
  }
  private agReport(event) {
    this.generateCrReport(event, 'pdf');

  }
  private agDelete(event) {
    var result = confirm("Are you sure you want to delete that?");
    if (result) {
      this.master.finalSettlementMasterId = event.node.data.finalSettlementMasterId;
      this.hrmmasterService.DeleteEmployeeFinalSettlement(this.master.finalSettlementMasterId).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.hrmmasterService.GetEmployeeFinalSettlementbyId(0).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
          //////////////Grid Refresh ///////////////////
        }
      });
    }
  }
  generateCrReport(event: any, reportFormat: any) {
    var finalSettlementMasterId = event.node.data.finalSettlementMasterId;
    let apiUrl = `Pims/GetEmployeeFinalSettlementById?finalSettlementMasterId=${finalSettlementMasterId}&reportFormat=${reportFormat}`;
    this.commonService.GetCrystalReportData(apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }

  public deleteDetails(index: any) {
    let signatoryId = this.master.SignatoryList[index].signatoryId;
    this.selectedRow = this.master.SignatoryList[index];

    if (signatoryId > 0) {
      this.hrmmasterService
        .DeleteSignatoryListById(signatoryId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.master.SignatoryList.splice(index, 1);
            this.toastrService.success(
              this.commonService.deletedmsg,
              "Message"
            );
          } else {
            this.toastrService.danger("Data not Delete!", "Message");
          }
        });
    } else {
      this.master.SignatoryList.splice(index, 1);
      this.toastrService.success(this.commonService.deletedmsg, "Message");
    }
  }
  totalPayable(event: any) {
    this.master.totalPayable += Number(event.Amount);
  }
  totalReceivable(event: any) {
    this.master.totalReceivable += Number(event.Amount);
  }

}
