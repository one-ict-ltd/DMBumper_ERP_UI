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
import { EmployeeotherinfoService } from "app/services/hrm/employeeotherinfo.service";
import { ActivatedRoute } from "@angular/router";
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";
import { BtnCellWithoutPrint } from "app/pages/common/btn-cell-withoutPrint.component";
import { TaskManagementService } from "app/services/taskmanagement/task-management.service";

@Component({
  selector: 'ngx-monthly-task-assign',
  templateUrl: './monthly-task-assign.component.html',
  styleUrls: ['./monthly-task-assign.component.scss']
})
export class MonthlyTaskAssignComponent implements OnInit {

  master: {
    employeeMonthlyTaskAssignId: number; 
    teamLeadEmployeeId: number; 
    teamMemberEmployeeId: number;
    departmentId: number;
    designationId: number; 
    year: number;
    month: string;
    coreFunctionId: number;
    taskQty: number; 
    description: string;

    isActive: boolean;
    lstDetails: any[];
    teamMemberEmployeeSelected: {};
    coreFunctionSelected: {};
    yearSelected: {};
    monthSelected: {};
  };

  readonly currentYear = new Date().getFullYear() + 5;
  yearItems = Array.from({ length: 6 }, (_, i) => {
    const year = this.currentYear - i;
    return { name: year, id: year };
  });

monthList = [
    { id: 'January', name: 'January' },
    { id: 'February', name: 'February' },
    { id: 'March', name: 'March' },
    { id: 'April', name: 'April' },
    { id: 'May', name: 'May' },
    { id: 'June', name: 'June' },
    { id: 'July', name: 'July' },
    { id: 'August', name: 'August' },
    { id: 'September', name: 'September' },
    { id: 'October', name: 'October' },
    { id: 'November', name: 'November' },
    { id: 'December', name: 'December' }
  ];

  employeeId = 0;
  employeeName = '';
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

  public pageNavigation = "Monthly Task Assign";
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

    let userInfo = this.commonService.GetUserProfileJson();
    this.employeeId = userInfo[0].employeeid;

    this.master = {
      employeeMonthlyTaskAssignId: 0,
      teamLeadEmployeeId: this.employeeId, 
      teamMemberEmployeeId: 0,
      departmentId: 0,
      designationId: 0, 
      year: 0,
      month: "",
      coreFunctionId: 0,
      taskQty: 0, 
      description: "",

      isActive: true,
      lstDetails: [],
      teamMemberEmployeeSelected: null,
      coreFunctionSelected: null,
      yearSelected: null,
      monthSelected: null,
    };
  }

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

  
public addDetails(dialog: TemplateRef<any>) {
    // debugger;
    if (this.master.month == "" || this.master.month == null) {
      this.toastrService.danger("Please enter month", "Message");
      return;
    }
    if (this.master.taskQty == 0 || this.master.taskQty == null) {
      this.toastrService.danger("Please enter task quantity", "Message");
      return;
    }

    var RowCount = this.master.lstDetails.length;
    for (let i = 0; i < RowCount; i++) {
      // debugger;
      var _coreFunctionId = this.master.lstDetails[i].coreFunctionId;
      var _teamMemberEmployeeId = this.master.lstDetails[i].teamMemberEmployeeId;
      
      if (_coreFunctionId == this.master.coreFunctionId && _teamMemberEmployeeId == this.master.teamMemberEmployeeId) {
        this.toastrService.danger("You have already added this Core Function for the selected Team Member!", "Message");
        return;
      }
      
    }

    let detail = {
      employeeMonthlyTaskAssignId: this.master.employeeMonthlyTaskAssignId,
      teamLeadEmployeeId: this.employeeId, 
      teamMemberEmployeeId: this.master.teamMemberEmployeeId,
      teamMemberEmployeeName: this.master.teamMemberEmployeeSelected["name"],
      departmentId: this.master.departmentId,
      designationId: this.master.designationId, 
      year: this.master.year,
      month: this.master.month,
      coreFunctionId: this.master.coreFunctionId,
      functionName: this.master.coreFunctionSelected["name"],
      taskQty: this.master.taskQty, 
      description: this.master.description,
      isActive: this.master.isActive,
      
    };
      this.master.lstDetails.push(detail);
      this.master.description = '';
      this.master.taskQty = 0;
  }
  //(click)="deleteDetail(rowIndex)"
  public deleteDetail(index: any) {
    debugger;
    this.selectedRow = this.master.lstDetails[index];
    this.master.lstDetails.splice(index, 1);
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }
  private save() {
    debugger;
    var button = this.commonService.buttonClicked;
    if (this.master.lstDetails.length == 0 ) {
      this.toastrService.danger("Please add Task Details", "Message");
      this.commonService.valueSet("create");
      return false;
    } 

    this.taskManagementService.SaveEmployeeMonthlyTaskAssign(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.show = true;
        //////////////Grid Refresh ///////////////////
        this.taskManagementService.GetEmployeeMonthlyTaskAssignById(0, this.employeeId).subscribe((data: any) => {
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
    btnCellRenderer: typeof BtnCellWithoutPrint;
  };

  constructor(
    private http: HttpClient,
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private employeeotherinfoService: EmployeeotherinfoService,
    private employeeinformationService: EmployeeinformationService,
    private comboService: CommoncomboService,
    private activatedRoute: ActivatedRoute,
    private taskManagementService: TaskManagementService,
  ) {
    this.commonService.valueSet("showlist");

    


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
        headerName: "Team Member",
        field: "teamMemberEmployeeName",
        filter: "agTextColumnFilter",
        width: 220,
      },
      {
        headerName: "Year",
        field: "year",
        filter: "agTextColumnFilter",
        width: 130,
      },
      {
        headerName: "Month",
        field: "month",
        filter: "agTextColumnFilter",
        width: 130,
      },
      {
        headerName: "Core Function",
        field: "functionName",
        filter: "agTextColumnFilter",
        width: 330,
      },
      {
        headerName: "Qty",
        field: "taskQty",
        filter: "agTextColumnFilter",
        width: 130,
      },
      {
        headerName: "Description",
        field: "description",
        filter: "agTextColumnFilter",
        width: 230,
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
      btnCellRenderer: BtnCellWithoutPrint,
    };
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
    };
    this.getMaster();
    this.getEmployeeTeamByTeamLeadEmployeeId();
  }

  
  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  onGridReady(params) {
    debugger
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.taskManagementService.GetEmployeeMonthlyTaskAssignById(0, this.employeeId).subscribe((data: any) => {
      if (data.status) {
        this.rowData = data.data;
      }
    });
  }
  public EmployeeTeamList = [];
  public getEmployeeTeamByTeamLeadEmployeeId() {
    this.taskManagementService.GetEmployeeTeamByTeamLeadEmployeeId(this.employeeId).subscribe((retuns: any) => {
      if (retuns.success) {
        this.EmployeeTeamList = retuns.data.map((val: any) => ({
          id: val.teamMemberEmployeeId,
          name: val.teamMemberEmployeeName,
          departmentId: val.departmentId,
          designationId: val.designationId,
        }))
      }
    })
  }

  public CoreFunctionList = [];
  public getCoreFunctionByDepartmentId(departmentId) {
    this.taskManagementService.GetCoreFunctionByDepartmentId(departmentId).subscribe((retuns: any) => {
      if (retuns.success) {
        this.CoreFunctionList = retuns.data.map((val: any) => ({
          id: val.coreFunctionId,
          name: val.functionName,
        }))
      }
    })
  }
  public JobDescriptionList = [];
  public getEmployeeJobDescriptionById(employeeId) {
    this.employeeotherinfoService.GetEmployeeJobDescriptionById(0, employeeId).subscribe((data: any) => {
      if (data.status) {
        this.JobDescriptionList = data.data;
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
      var employeeId = event.node.data.teamLeadEmployeeId;
      var year = event.node.data.year;
      var month = event.node.data.month;

      this.taskManagementService.GetEmployeeMonthlyTaskAssignByYearMonth(0, employeeId, year, month).subscribe((data: any) => {
        if (data.status) {
          this.master.lstDetails = data.data;
          
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
      this.master.employeeMonthlyTaskAssignId = event.node.data.employeeMonthlyTaskAssignId;
      this.taskManagementService.DeleteEmployeeMonthlyTaskAssignById(this.master.employeeMonthlyTaskAssignId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(
              this.commonService.deletedmsg,
              "Message"
            );

            //////////////Grid Refresh ///////////////////
            this.taskManagementService.GetEmployeeMonthlyTaskAssignById(0, this.employeeId).subscribe((data: any) => {
              if (data.status) {
                this.rowData = data.data;
              }
            });
            //////////////Grid Refresh ///////////////////
          }
        });
    }
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
