import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup, NgForm } from "@angular/forms";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { CommoncomboService } from "app/services/commoncombo.service";
import { SalaryperiodService } from "app/services/salary/salarymaster/salaryperiod.service";
import { FiscalyearService } from "app/services/budget/fiscalyear.service";
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";

@Component({
  selector: 'ngx-other-expense',
  templateUrl: './other-expense.component.html',
  styleUrls: ['./other-expense.component.scss']
})
export class OtherExpenseComponent implements OnInit {

  master: {
    otherExpenseId: number;
    fiscalYearId: number;
    salaryTypeId: number;
    employeeId: number;
    bonusTypeId: number;
    periodName: string;
    monthName: string;
    lockStatus: number;
    amount: number;
    isActive: boolean;

    fiscalYearSelected: {};
    employeeSelected: {};
    bonusTypeSelected: {};
    monthSelected: {};
    countData: number;
  };

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
  //////////////////

  show: boolean = true;
  bonusTypeShow: boolean = false;
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
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Others Expense";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
      this.disabled = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
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
      otherExpenseId: 0,
      fiscalYearId: 0,
      salaryTypeId: 0,
      employeeId: 0,
      bonusTypeId: null,
      periodName: '',
      monthName: '',
      lockStatus: 1,
      amount: 0,
      isActive: true,

      fiscalYearSelected: null,
      employeeSelected: null,
      bonusTypeSelected: null,
      monthSelected: null,
      countData: 0,
    };
  }

  public fiscalYearItems: [];
  public salaryTypeItems: [];
  public bonusTypeItems: [];
  public monthItems: [];

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
  /////End of Dynamic Button section (Do Not Edit)///////

  //////////////////////////////////////////////CRUD////////////////////////////  

  public getDuplicate() {
    this.salaryperiodService.GetDuplicateSalaryPeriod(this.master.otherExpenseId, this.master.fiscalYearId, this.master.salaryTypeId, this.master.monthName, this.master.periodName)
      .subscribe((returns: any) => {
        this.master.countData = returns.data[0].countData;
      });
  }

  public ShowBonusType() {
    if (this.master.salaryTypeId == 2) {
      this.bonusTypeShow = true;
    } else {
      this.bonusTypeShow = false;
      this.master.bonusTypeId = null;
    }
  }


  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.fiscalYearId == 0 || this.master.fiscalYearId == null) {
      this.toastrService.danger("Please select fiscal year", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.monthName == '' || this.master.monthName == null) {
      this.toastrService.danger("Please select month name", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.employeeId == 0) {
      this.toastrService.danger("Please select Employee", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    this.salaryperiodService.SaveEmployeeOtherExpense(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.show = true;
        //////////////Grid Refresh ///////////////////
        this.salaryperiodService.GetEmployeeOtherExpense(0).subscribe((data: any) => {
          if (data.status) {
            this.rowData = data.data;
          }
        });

        //////////////Grid Refresh ///////////////////
      }
    });
  }

  private reset() {
    this.getMaster();
  }

  //////////////////////////////// End CRUD /////////////////////////////////////////

  onRefesh() {
    this.selectedRow = "";
    this.ngOnInit();
    //this.onGridReady;
    this.toastrService.warning("warning", this.commonService.warningmsg);
  }

  onEditGrid() {
    const d = this.gridApi.getEditingCells();
    if (this.gridApi.getSelectedRows().length == 0) {
      this.toastrService.danger("error", this.commonService.selectdata);
      return;
    }
    var row = this.gridApi.getSelectedRows();
    this.selectedRow = row[0];
    this.ngOnInit();

    this.saveupdate = "Update";
  }

  //////// grid data load from api////////

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
    private http: HttpClient,
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private salaryperiodService: SalaryperiodService,
    private fiscalyearService: FiscalyearService,
    private employeeinformationService: EmployeeinformationService,
    private comboService: CommoncomboService
  ) {
    this.commonService.valueSet("showlist");

    this.LoadFiscalYear();
    this.LoadMonthName();
    this.LoadSalaryType();
    this.LoadBonusType();
    this.LoadEmployees(0)

    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 70,
      }, /// Dont Change      
      {
        headerName: "Year Name",
        field: "fiscalYearId",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Month Name",
        field: "monthName",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Employee Code",
        field: "employeeNo",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Employee Name",
        field: "fullName",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Designation",
        field: "currentDesignation",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Amount",
        field: "amount",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Region Code",
        field: "REGION_CODE",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Area Code",
        field: "AREA_CODE",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Territory Code",
        field: "TERRITORY_CODE",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        field: "action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) { },
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.salaryperiodService.GetEmployeeOtherExpense(0).subscribe((data: any) => {
      if (data.status) {
        this.rowData = data.data;
      }
    });
  }

  getSelectedRowData() {
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map((node) => node.data);
    alert(`${JSON.stringify(selectedData)}`);
    this.name = selectedData[0].currencyName;
    return selectedData;
  }

  private selectedRows = [];

  onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked; //localStorage.getItem("button");
    if (data == "edit") {
      this.agEdit(event);
      this.show = false;
    } else if (data == "view") {
      this.agEdit(event);
      this.show = false;
      this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      this.agDelete(event);
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  private agEdit(event) {
    this.disabled = false;
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
      var otherExpenseId = event.node.data.otherExpenseId;

      this.salaryperiodService.GetEmployeeOtherExpense(otherExpenseId).subscribe((data: any) => {
        if (data.status) {
          this.master = data.data[0];

          this.master.fiscalYearSelected = {
            id: data.data[0].fiscalYearId,
            name: data.data[0].fiscalYearId,
          };
          this.master.monthSelected = {
            id: data.data[0].monthName,
            name: data.data[0].monthName,
          };
          this.master.employeeSelected = {
            id: data.data[0].employeeId,
            name: data.data[0].fullName + ' - ' + data.data[0].employeeNo,
          };
          this.initEmployeeInfo(data.data[0].employeeId);
          //this.getDuplicate();
          //this.ShowBonusType();
        }
      });
      this.ngOnInit();
    }
  }
  private agReport(event) {
    this.toastrService.info("Print button clicked", "Message");
  }
  private agDelete(event) {
    var result = confirm("Are you sure you want to delete that?");
    if (result) {
      this.master.otherExpenseId = event.node.data.otherExpenseId;
      this.salaryperiodService.DeleteEmployeeOtherExpense(this.master.otherExpenseId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(
              this.commonService.deletedmsg,
              "Message"
            );

            //////////////Grid Refresh ///////////////////
            this.salaryperiodService.GetEmployeeOtherExpense(0).subscribe((data: any) => {
              if (data.status) {
                this.rowData = data.data;
              }
            });
            //////////////Grid Refresh ///////////////////
          }
        });
    }
  }

  public LoadFiscalYear() {
    this.fiscalyearService.getFiscalYear().subscribe((returns: any) => {
      this.fiscalYearItems = returns.data.map((val) => ({
        id: val.yearName,
        name: val.yearName,
      }));
    });
  }

  public LoadSalaryType() {
    this.salaryperiodService.GetSalaryTypeById(0).subscribe((returns: any) => {
      this.salaryTypeItems = returns.data.map((val) => ({
        id: val.salaryTypeId,
        name: val.salaryTypeName,
      }));
    });
  }

  public LoadBonusType() {
    this.salaryperiodService.GetBonusTypeById(0).subscribe((returns: any) => {
      this.bonusTypeItems = returns.data.map((val) => ({
        id: val.bonusTypeId,
        name: val.bonusTypeName,
      }));
    });
  }

  public employeeItems: [];
  public LoadEmployees(empId) {
    this.employeeinformationService.GetEmployeeInfoLoadById(empId).subscribe((returns: any) => {
      this.employeeItems = returns.data.filter(x => x.POSTING_LOCATION != '').map((val) => ({
        id: val.employeeId,
        name: val.fullName
      }));
    });
  }

  currentDesignation = '';
  currentDepartment = '';
  TerritoryName = '';
  AreaName = '';
  RegionName = '';
  TerritoryDetails = '';

  initEmployeeInfo(empId: any) {
    this.employeeinformationService.GetEmployeeInfoLoadById(empId).subscribe((returns: any) => {
      this.currentDesignation = returns.data[0].currentDesignation
      this.currentDepartment = returns.data[0].currentDepartment
      this.TerritoryName = returns.data[0].TerritoryName
      this.AreaName = returns.data[0].AreaName
      this.RegionName = returns.data[0].RegionName
      this.TerritoryDetails = 'Designation : ' + returns.data[0].currentDesignation + '|| Region Code : ' + returns.data[0].RegionName + '|| Area Code : ' + returns.data[0].AreaName + '|| Territory Code : ' + returns.data[0].TerritoryName
    });
  }

  public LoadMonthName() {
    this.comboService.getCmnDropDown(0, "Month Name").subscribe((returns: any) => {
      this.monthItems = returns.data.map((val) => ({
        id: val.dropDownValue,
        name: val.dropDownText,
      }));
    });
  }

  //////////////////////////////////End of Ag Grid Data Load/////////////////////////////////

  @Output() myEvent = new EventEmitter();

  public deleteRow(state, action) {
    const nodeIdToRemove = action.payload;
    const filteredData = state.rowData.filter(
      (node) => node.id !== nodeIdToRemove
    );
    return {
      ...state,
      rowData: [...filteredData],
    };
  }

  private showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
    };
    const titleContent = title ? `. ${title}` : "";

    this.index += 1;
    this.toastrService.show(body, `Toast ${this.index}${titleContent}`, config);
  }

  //////////// Open Modal ////////////////

  names: any;
  openWithDataObjModel(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      context: this.master,
    });
  }
  openWithDataModel() {
    this.dialogService
      .open(DialogNamePromptComponent)
      .onClose.subscribe((name) => name && this.names.push(name));
  }

}