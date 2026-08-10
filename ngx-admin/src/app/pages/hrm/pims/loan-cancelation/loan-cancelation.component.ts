import {
  Component,
  OnInit,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
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
import { SalarygradeService } from "app/services/salary/salarymaster/salarygrade.service";
import { SalaryslabService } from "app/services/salary/salarymaster/salaryslab.service";
import { SalarystructureService } from "app/services/salary/salarymaster/salarystructure.service";
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";
import { HrmmasterService } from "app/services/hrm/hrmmaster.service";
import { SalarygradepercentService } from "app/services/salary/salarymaster/salarygradepercent.service";


@Component({
  selector: 'ngx-loan-cancelation',
  templateUrl: './loan-cancelation.component.html',
  styleUrls: ['./loan-cancelation.component.scss']
})
export class LoanCancelationComponent implements OnInit {

  public showbody: boolean = false;
  master: {

    employeePromotionId: number;
    loadId: number;
    employeeId: number;
    employeeSelected: {};


    joiningDate: string;
    previousDesignation: string;
    currentDesignation: string;
    previousDepartment: string;
    currentDepartment: string;
    PreviousGrossSalary: number;
    NewGrossSalary: number;
    incrementSalary: number;
    prevSalaryLocation: string;
    serviceLenth: string;
    TerritoryName: string;
    AreaName: string;
    RegionName: string;
    countData: number;

    LoanCategoryId: number;
    interestTypeId: number;
    interestRate: number;
    NumOfInstallment: number;
    AmountOfInstallment: number;
    salaryCalulationTypeId: number;
    loanAmount: number;
    purchaseAmount: number;
    applicationNo: string;
    registrationNo: string;
    engineNo: string;
    loanId: number;
    applicationDate: Date;
    issueDate: Date;
    purchaseDate: Date;

    lstAddtion: any[];
    lstDeduction: any[];
    lstDetails: any[];

    prevSlab: string;
    prevSalarySlabId: null;
    NewSalarySlabId: null;

    prevGrade: string;
    prevSalaryGradeId: null;
    NewGradeId: null;


    salaryGradeSelected: {};
    salarySlabSelected: {};
    DepartmentSelected: {}
    DesignationSelected: {}
    InterestTypeSelected: {}
    LoanCategorySelected: {}
    salaryCalulationTypeSelected: {}

    salaryLocation: string;
    salaryLocationSelected: {};
    HrmSalaryLocationId: null,
    HrmNewSalaryLocationId: null,
    remarks: string;
    promotionDate: Date;
  };

  element = { id: 0, name: "All" };
  disabled: boolean = false;
  config: NbToastrConfig;
  index = 1;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus = "primary";

  title = "HI there!";
  content = `I'm cool toaster!`;

  types: NbComponentStatus[] = [
    "primary",
    "success",
    "info",
    "warning",
    "danger",
  ];
  positions: string[] = [
    NbGlobalPhysicalPosition.TOP_RIGHT,
    NbGlobalPhysicalPosition.TOP_LEFT,
    NbGlobalPhysicalPosition.BOTTOM_LEFT,
    NbGlobalPhysicalPosition.BOTTOM_RIGHT,
    NbGlobalLogicalPosition.TOP_END,
    NbGlobalLogicalPosition.TOP_START,
    NbGlobalLogicalPosition.BOTTOM_END,
    NbGlobalLogicalPosition.BOTTOM_START,
  ];

  quotes = [
    { title: null, body: "We rock at Angular" },
    { title: null, body: "Titles are not always needed" },
    { title: null, body: "Toastr rock!" },
  ];

  show: boolean = false;
  vlucherForm: FormGroup;
  submitted: boolean;
  saveupdate: string = "Save";
  gridbutton: string = "";
  name: string;
  description: string;
  selectedRow: any;

  ngOnInit() {
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }

  public pageNavigation = "Loan Cancellation";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
      this.disabled = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = false;
      this.commonService.valueSet("create");
    } else if (this.commonService.buttonClicked == "save") {
      this.commonService.valueSet("create");
      this.save();
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }
  public getMaster() {
    this.master = {
      employeePromotionId: 0,
      loadId: 0,
      employeeId: 0,
      employeeSelected: null,

      joiningDate: '',
      previousDesignation: '',
      currentDesignation: '',
      previousDepartment: '',
      currentDepartment: '',
      PreviousGrossSalary: 0,
      NewGrossSalary: 0,
      incrementSalary: 0,
      loanId: 0,
      countData: 0,

      lstAddtion: [],
      lstDeduction: [],

      NewGradeId: null,
      prevGrade: '',
      prevSalaryGradeId: null,

      LoanCategoryId: 0,
      interestTypeId: 0,
      interestRate: 0,
      NumOfInstallment: 0,
      loanAmount: 0,
      AmountOfInstallment: 0,
      salaryCalulationTypeId: 0,
      purchaseAmount: 0,
      applicationNo: '',
      registrationNo: '',
      engineNo: '',
      applicationDate: new Date(),
      issueDate: new Date(),
      purchaseDate: new Date(),

      lstDetails: null,
      prevSlab: '',
      prevSalarySlabId: null,
      NewSalarySlabId: null,

      salaryGradeSelected: null,
      salarySlabSelected: null,
      DepartmentSelected: null,
      DesignationSelected: null,
      InterestTypeSelected: null,
      LoanCategorySelected: null,
      salaryCalulationTypeSelected: null,

      salaryLocation: '',
      serviceLenth: '',
      TerritoryName: '',
      AreaName: '',
      RegionName: '',
      salaryLocationSelected: null,
      prevSalaryLocation: '',
      HrmSalaryLocationId: null,

      HrmNewSalaryLocationId: null,
      remarks: '',
      promotionDate: new Date(),

    };
    this.commonService.valueSet("create");
  }

  public employeeItems: [];
  public salaryGradeItems: [];
  public salarySlabItems: [];


  public agButtonAction() {
    if (this.commonService.agButtonClicked == "pin") {
      this.commonService.onPin(this.gridColumnApi);
    } else if (this.commonService.agButtonClicked == "unpin") {
      this.commonService.onClear(this.gridColumnApi);
    } else if (this.commonService.agButtonClicked == "refresh") {
      window.location.reload();
    } else if (this.commonService.agButtonClicked == "csv") {
      this.commonService.onExportCSV(this.gridApi, this.pageNavigation);
    } else {
      console.log("Click action button");
    }
  }

  initEmployeeInfo(empId: any) {
    this.master.previousDesignation = ""
    this.master.previousDepartment = ""
    this.master.joiningDate = ""
    this.master.PreviousGrossSalary = 0
    this.master.NewGrossSalary = 0
    this.master.prevSalaryLocation = ""
    this.master.HrmSalaryLocationId = null
    this.master.prevGrade = ''
    this.master.prevSalaryGradeId = null
    this.master.prevSlab = ''
    this.master.prevSalarySlabId = null
    this.employeeinformationService.GetEmployeeInfoLoadById(empId).subscribe((returns: any) => {
      this.master.previousDesignation = returns.data[0].currentDesignation
      this.master.previousDepartment = returns.data[0].currentDepartment
      this.master.joiningDate = returns.data[0].joiningDate
      this.master.PreviousGrossSalary = returns.data[0].grossSalary
      this.master.NewGrossSalary = returns.data[0].grossSalary
      this.master.prevSalaryLocation = returns.data[0].salaryLocation
      this.master.HrmSalaryLocationId = returns.data[0].HrmSalaryLocationId
      this.master.prevGrade = returns.data[0].gradeName
      this.master.prevSalaryGradeId = returns.data[0].salaryGradeId
      this.master.prevSlab = returns.data[0].slabName
      this.master.prevSalarySlabId = returns.data[0].salarySlabId
      this.master.serviceLenth = returns.data[0].serviceLenth
      this.master.TerritoryName = returns.data[0].TerritoryName
      this.master.AreaName = returns.data[0].AreaName
      this.master.RegionName = returns.data[0].RegionName
    });
  }

  private save() {


  }

  private reset() {
    this.getMaster();
  }

  onRefesh() {
    this.selectedRow = "";
    this.ngOnInit();
    this.toastrService.warning("warning", this.commonService.warningmsg);
  }

  onEditGrid() {
    if (this.gridApi.getSelectedRows().length == 0) {
      this.toastrService.danger("error", this.commonService.selectdata);
      return;
    }
    var row = this.gridApi.getSelectedRows();
    this.selectedRow = row[0];
    this.ngOnInit();

    this.saveupdate = "Update";
  }


  private gridApi;
  private gridColumnApi;

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  constructor(
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private employeeinformationService: EmployeeinformationService,
    private hrmmasterService: HrmmasterService,
  ) {
    this.commonService.valueSet("showlist");
    this.GetLoanCategory();
    this.LoadEmployees(0);
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
        headerName: "Employee's Code",
        field: "employeeNo",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Employee's Name",
        field: "fullName",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Loan Category",
        field: "loanCategoryName",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Application No",
        field: "applicationNo",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Application Date",
        field: "applicationDate",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Issue Date",
        field: "issueDate",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Registration No",
        field: "registrationNo",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Engine No",
        field: "engineNo",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Loan Amount",
        field: "loanAmount",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        field: "action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function () { },
        },
        minWidth: 250,
        editable: false,
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
    this.getMaster();
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }
  GetEmployeeDetails(loanId: any) {
    this.master.loadId = loanId;
    this.employeeinformationService.GetEmployeeLoanDetails(loanId).subscribe((data: any) => {
      if (data.success) {
        this.master.lstDetails = data.data;
        this.showbody = true;
      }
    });
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = []
    this.employeeinformationService.GetLoanInformation(0, 0).subscribe((data: any) => {
      if (data.status) {
        this.rowData = data.data;
      }
    });
  }
  public employeeList = [];
  GetEmployee(loanCategoryId: any) {
    this.master.employeeSelected = null;
    this.hrmmasterService.GetEmployeeWithLoan(loanCategoryId).subscribe((returns: any) => {
      this.employeeList = returns.data.map((val: any) => ({
        id: val.loanId,
        name: val.fullName,
      }))
    })
  }

  confirmCancelLoan() {
    const confirmation = confirm("Are you sure you want to cancel the loan?");
    if (confirmation) {
      this.CancelLoan();
    }
  }

  CancelLoan() {
    this.hrmmasterService.CancelLoan(this.master.loadId).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success(this.commonService.updatedmsg, "Message");
        this.master.lstDetails = [];
        this.master.employeeSelected = null;
        this.GetEmployee(this.master.LoanCategoryId);
      }
      else {
        this.toastrService.warning(this.commonService.failedmsg, "Message");
      }
    })
  }
  getSelectedRowData() {
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map((node) => node.data);
    alert(`${JSON.stringify(selectedData)}`);
    this.name = selectedData[0].currencyName;
    return selectedData;
  }


  onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    if (data == "edit") {
      this.show = false;
    } else if (data == "view") {
      this.show = false;
      this.disabled = true;
    } else if (data == "transectionreport") {
    } else if (data == "delete") {
      this.agDelete(event);
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }


  private agDelete(event) {
  }

  public LoadEmployees(empId) {
    this.employeeinformationService.GetEmployeeInfoLoadById(empId).subscribe((returns: any) => {
      this.employeeItems = returns.data.map((val) => ({
        id: val.employeeId,
        name: val.fullName
      }));
    });
  }

  public LoanCategoryList = [];
  public GetLoanCategory() {
    this.hrmmasterService.GetLoanCategory().subscribe((returns: any) => {
      this.LoanCategoryList = returns.data.map((val: any) => ({
        id: val.loanCategoryId,
        name: val.loanCategoryName,
      }))
    })
  }
}
