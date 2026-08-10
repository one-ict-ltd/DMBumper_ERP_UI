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
import { ShiftgroupService } from "app/services/attendance/shiftgroup.service";
import { ShiftassignService } from "app/services/attendance/shiftassign.service";
import { HrmmasterService } from "app/services/hrm/hrmmaster.service";
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";

@Component({
  selector: 'ngx-shiftassign',
  templateUrl: './shiftassign.component.html',
  styleUrls: ['./shiftassign.component.scss']
})
export class ShiftassignComponent implements OnInit {

  master: {
    punchCardId: number;
    employeeId: number;
    shiftMasterId: number;
    punchCardNo: string;
    isActive: boolean;
    callName: string;
    companyId: number;
    sbuId: number;
    department: string;

    callNameSelected: {};
    employeeSelected: {};
    shiftMasterSelected: {};
    companySelected: {};
    sbuSelected: {};
    departmentSelected: {};

    lstDetails: any[];
    index: number;
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
  showCompany: boolean = false;
  showSbu: boolean = false;
  showDepartment: boolean = false;
  showEmployee: boolean = false;

  show: boolean = true;
  vlucherForm: FormGroup;
  submitted: boolean;
  saveupdate: string = "Save";
  gridbutton: string = "";
  name: string;
  description: string;
  selectedRow: any;
  public showbody: boolean = false;

  ngOnInit() {
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Shift Group Assign";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
      this.showbody = true;
      this.disabled = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
      this.showbody = false;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
      this.showbody = true;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
      this.showbody = true;
    }
  }
  public getMaster() {
    this.master = {
      punchCardId: 0,
      employeeId: 0,
      shiftMasterId: 0,
      punchCardNo: "",
      isActive: true,
      callName: "",
      companyId: 0,
      sbuId: 0,
      department: "",

      callNameSelected: null,
      employeeSelected: null,
      shiftMasterSelected: null,
      companySelected: null,
      sbuSelected: null,
      departmentSelected: null,

      lstDetails: [],
      index: -1,
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


  private save() {
    var button = this.commonService.buttonClicked;

    this.toastrService.success(this.commonService.updatedmsg, "Message");

    this.show = true;
    this.showbody = false;



    //////////////Grid Refresh ///////////////////
    this.shiftassignService.GetPunchCardById(0).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    });
    //////////////Grid Refresh ///////////////////


  }

  public SaveShiftAssign() {
    if (this.master.callName == '' || this.master.callName == null) {
      this.toastrService.danger("Please select assign by", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.shiftMasterId == 0 || this.master.shiftMasterId == null) {
      this.toastrService.danger("Please select shift name", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    this.shiftassignService.AssignShiftGroup(this.master).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success(this.commonService.processmsg, "Message");

        //////////////Grid Refresh ///////////////////
        this.shiftassignService.GetShiftAssignById(this.master.punchCardId, this.master.companyId, this.master.sbuId, this.master.employeeId, this.master.department).subscribe((data: any) => {
          if (data.success) {
            this.master.lstDetails = data.data;
            this.showbody = true;
          }
        });
        //////////////Grid Refresh ///////////////////
      }
    });

  }

  public UpdatePunchCard(index, punchCardId) {
    debugger;
    this.master.punchCardId = punchCardId;
    this.master.punchCardNo = this.master.lstDetails[index].punchCardNo;
    //this.master = this.master.lstDetails[index];
    if (this.master.punchCardNo != '') {
      this.shiftassignService.UpdatePunchCardNo(this.master).subscribe((returns: any) => {
        if (returns.success) {
          //this.toastrService.success(this.commonService.updatedmsg, "Message");
        }
      });
    }
    else {
      this.toastrService.warning("Please insert punch card no", "Warning!");
    }
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
    private shiftgroupService: ShiftgroupService,
    private shiftassignService: ShiftassignService,
    private hrmmasterService: HrmmasterService,
    private employeeinformationService: EmployeeinformationService,
    private comboService: CommoncomboService
  ) {
    this.commonService.valueSet("showlist");

    this.GetCallName();
    this.GetShiftGroup();
    this.GetEmployees();
    this.GetDepartment();
    this.GetCompany();

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
        headerName: "Employee's Name",
        field: "fullName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Designation",
        field: "currentDesignation",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Department",
        field: "currentDepartment",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Shift Name",
        field: "shiftName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Punch Card No",
        field: "punchCardNo",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Is Active?",
        field: "isActive",
        editable: false,
        width: 130,
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
    this.shiftassignService.GetPunchCardById(0).subscribe((data: any) => {
      if (data.success) {
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
      this.showbody = true;
    } else if (data == "view") {
      this.agEdit(event);
      this.show = false;
      this.showbody = true;
      this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      this.agDelete(event);
    } else {
      //this.toastrService.info("Please insert punch card no.", "Message");     
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
      var punchCardId = event.node.data.punchCardId;

      this.shiftassignService.GetPunchCardById(punchCardId).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];

          this.master.employeeSelected = {
            id: data.data[0].employeeId,
            name: data.data[0].fullName,
          };

          this.shiftassignService.GetShiftAssignById(punchCardId, data.data[0].companyId, data.data[0].sbuId, data.data[0].employeeId, data.data[0].currentDepartment).subscribe((datas: any) => {
            if (datas.success) {
              this.master.lstDetails = datas.data;
              //this.showbody = true;
            }
          });


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
      this.master.punchCardId = event.node.data.punchCardId;
      this.shiftassignService.DeletePunchCardById(this.master.punchCardId).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.shiftassignService.GetPunchCardById(0).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
          //////////////Grid Refresh ///////////////////
        }
      });
    }
  }

  public shiftGroupItems = [];
  public GetShiftGroup() {
    this.shiftgroupService.GetShiftGroupMasterById(0).subscribe((returns: any) => {
      this.shiftGroupItems = returns.data.map((val: any) => ({
        id: val.shiftMasterId,
        name: val.shiftName,
      }))
    })
  }

  public employeeItems = [];
  public GetEmployees() {
    this.employeeinformationService.GetEmployeeInfoLoadByIdOptimized(0).subscribe((returns: any) => {
      this.employeeItems = returns.data.map((val: any) => ({
        id: val.employeeId,
        name: val.fullName,
      }))
    })
  }

  public departmentItems = [];
  public GetDepartment() {
    this.hrmmasterService.getDepartment(0).subscribe((returns: any) => {
      this.departmentItems = returns.data.map((val: any) => ({
        id: val.deptName,
        name: val.deptName,
      }))
    })
  }

  public companyItems = [];
  public GetCompany() {
    this.comboService.getCompany().subscribe((retuns: any) => {
      if (retuns.success) {
        this.companyItems = retuns.data.map((val: any) => ({
          id: val.companyId,
          name: val.companyName,
        }))
      }
    })
  }

  public sbuItems = [];
  public getSBU(companyId) {
    this.master.sbuSelected = null;
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.sbuItems = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }

  public callNameItems: {};
  public GetCallName() {
    this.callNameItems = [
      {
        id: "Company",
        name: "By Company",
      },
      {
        id: "Sbu",
        name: "By Branch",
      },
      {
        id: "Department",
        name: "By Department",
      },
      {
        id: "Employee",
        name: "By Employee",
      },
    ];
  }

  public showHideDdl() {
    //this.ddlReportNameSelected = null;
    if (this.master.callNameSelected['id'] == "Company") {
      this.showCompany = true;
      this.showSbu = false;
      this.showDepartment = false;
      this.showEmployee = false;
      this.master.sbuSelected = null;
      this.master.departmentSelected = null;
      this.master.employeeSelected = null;
    } else if (this.master.callNameSelected['id'] == "Sbu") {
      this.showCompany = true;
      this.showSbu = true;
      this.showDepartment = false;
      this.showEmployee = false;
      this.master.departmentSelected = null;
      this.master.employeeSelected = null;
    } else if (this.master.callNameSelected['id'] == "Department") {
      this.showCompany = false;
      this.showSbu = false;
      this.showDepartment = true;
      this.showEmployee = false;
      this.master.companySelected = null;
      this.master.sbuSelected = null;
      this.master.employeeSelected = null;
    } else {
      this.showCompany = false;
      this.showSbu = false;
      this.showDepartment = false;
      this.showEmployee = true;
      this.master.companySelected = null;
      this.master.sbuSelected = null;
      this.master.departmentSelected = null;
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
