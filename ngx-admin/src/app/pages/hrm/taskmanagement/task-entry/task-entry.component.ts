import {
  Component,
  OnInit,
} from "@angular/core";
import {
  NbComponentStatus,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { CommonService } from "app/@core/mock/common.service";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { TaskManagementService } from "app/services/taskmanagement/task-management.service";

@Component({
  selector: 'ngx-task-entry',
  templateUrl: './task-entry.component.html',
  styleUrls: ['./task-entry.component.scss']
})
export class TaskEntryComponent implements OnInit {

  public pageNavigation = "Task Information Entry";
  show: boolean = true;
  disabled: boolean = false;
  fDate: Date;
  tDate: Date;

  name: string;
  description: string;
  selectedRow: any;

  public selectdetailRows = [];
  private gridApi;
  private gridColumnApi;
  public columnDefs;
  public defaultColDef;
  public rowData: [];

  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };


  master: {
    taskInfoId: number;
    taskName: string;
    taskCode: string;
    description: string;
    taskTypeId: number;
    employeeId: number;
    assignToId: number;
    taskPriorityId: number;
    date: Date;
    atime: string;
    expectedEndDate: Date;
    etime: string;
    isParent: number;
    parentTaskId: number;
    isActive: number;
  };

  constructor(
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private Service: TaskManagementService,
  ) {
    this.commonService.valueSet('showlist');
    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 50,
      },
      {
        headerName: "Task Code",
        field: "taskCode",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 120,
      },
      {
        headerName: "Task Name",
        field: "taskName",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 220,
      },
      {
        headerName: "Task Type",
        field: "taskTypeName",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 120,
      },
      {
        headerName: "Assign By",
        field: "teamLeaderName",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 150,
      },
      {
        headerName: "Assign To",
        field: "teamMemberName",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 150,
      },
      {
        headerName: "Expected End Date",
        field: "expectedEndDate",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 150,
      },
      {
        headerName: "Priority Name",
        field: "priorityName",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 120,
      },

      {
        headerName: "Is Active",
        field: "isActive",
        width: 120,
      },
      {
        field: "Action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) { },
        },
        minWidth: 250,
        editable: false,
        filter: false,
        shorable: false,
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


    this.fDate = this.commonService.GetAnyMonthAndDateOfYear(-6);
    this.tDate = new Date();
    this.lstMaster = [];

    // let lstType = [{ id: 'Amount', name: 'Amount' }, { id: 'Percent', name: 'Percent' }];    
    // this.incentiveTypeList = lstType.map((val) => ({
    //   id: val.id,
    //   name: val.name,
    // }));

    //this.GetAllProducts();
    this.loadDropdown();
    this.getMaster();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadData();
  }

  ngOnInit() {
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }


  // protected options: {};
  // protected cd: ChangeDetectorRef;
  // showMessages: any = {};
  // errors: string[];

  // types: NbComponentStatus[] = [
  //   "primary",
  //   "success",
  //   "info",
  //   "warning",
  //   "danger",
  // ];
  // positions: string[] = [
  //   NbGlobalPhysicalPosition.TOP_RIGHT,
  //   NbGlobalPhysicalPosition.TOP_LEFT,
  //   NbGlobalPhysicalPosition.BOTTOM_LEFT,
  //   NbGlobalPhysicalPosition.BOTTOM_RIGHT,
  //   NbGlobalLogicalPosition.TOP_END,
  //   NbGlobalLogicalPosition.TOP_START,
  //   NbGlobalLogicalPosition.BOTTOM_END,
  //   NbGlobalLogicalPosition.BOTTOM_START,
  // ];

  // //vlucherForm: FormGroup;
  // submitted: boolean;
  // saveupdate: string = "Save";
  // gridbutton: string = "";


  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      this.show = true;
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
      taskInfoId: 0,
      taskName: '',
      taskCode: '',
      description: '',
      taskTypeId: 0,
      employeeId: 0,
      assignToId: 0,
      taskPriorityId: 0,
      date: new Date(),
      atime: '',
      expectedEndDate: new Date(),
      etime: '',
      isParent: 1,
      parentTaskId: 0,
      isActive: 1,
    };

    this.taskTypeSelected = null;
    this.taskPrioritySelected = null;
    this.assignToIdSelected = null;
    this.parentTaskSelected = null;

    this.GetMaxTaskCode();
  }

  lstMaster: any[];

  taskTypeList = [];
  taskTypeSelected = {};

  taskPriorityList = [];
  taskPrioritySelected = {};

  assignToList = [];
  assignToIdSelected = {};

  parentTaskList = [];
  parentTaskSelected = {};

  // GetAllMonths() {
  //   this.monthList = this.commonService.GetAllMonths();
  // }

  productList = [];
  GetAllProducts() {
    // this.productrequisitionService
    //   .getAllProductForRequisition()
    //   .subscribe((returns: any) => {
    //     this.productList = returns.data
    //   });
  }
  LoadData() {
    this.Service.GetTaskInfoById(0, this.commonService.DateFormat(this.fDate), this.commonService.DateFormat(this.tDate)).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }
  loadDropdown() {
    this.GetTaskTypeList();
    this.GetTaskPriorityList();
    this.TaskStatusList();
    this.GetTaskTeamMember();
    this.GetParentTaskList();
  }
  GetTaskTypeList() {
    this.Service.GetTaskTypeList(0).subscribe((data: any) => {
      if (data.success) {
        this.taskTypeList = data.data.map((val: any) => ({
          id: val.taskTypeId,
          name: val.taskTypeName,
        }));
      }
    });
  }
  GetTaskPriorityList() {
    this.Service.GetTaskPriorityList(0).subscribe((data: any) => {
      if (data.success) {
        this.taskPriorityList = data.data.map((val: any) => ({
          id: val.taskPriorityId,
          name: val.priorityName,
        }));
      }
    });
  }
  TaskStatusList() {
    this.Service.TaskStatusList(0).subscribe((data: any) => {
      if (data.success) {
        this.TaskStatusList = data.data.map((val: any) => ({
          id: val.taskStatusId,
          name: val.taskStatusName,
        }));
      }
    });
  }
  GetTaskTeamMember() {
    this.Service.GetTaskTeamMember(0).subscribe((data: any) => {
      if (data.success) {
        this.assignToList = data.data.map((val: any) => ({
          id: val.teamMemberId,
          name: val.teamMemberName,
        }));
      }
    });
  }
  GetParentTaskList() {
    this.Service.GetParentTaskList(0).subscribe((data: any) => {
      if (data.success) {
        this.parentTaskList = data.data.map((val: any) => ({
          id: val.taskInfoId,
          name: val.taskName,
        }));
      }
    });
  }
  GetMaxTaskCode() {
    this.Service.GetMaxTaskCode(0).subscribe((data: any) => {
      debugger;
      if (data.success) {
        this.master.taskCode = data.data[0].MaxNo;
        console.log('taskCode : ', this.master.taskCode)
      }
    });
  }


  //public employeeItems = [];
  //public companyItems = [];

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

  /////////////////////////////// CRUD ///////////////////////////////////////////


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
    //this.saveupdate = "Update";
  }

  getSelectedRowData() {
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map((node) => node.data);
    alert(`${JSON.stringify(selectedData)}`);
    this.name = selectedData[0].currencyName;
    return selectedData;
  }

  ////////////////////////////////// Ag Grid Data Load/////////////////////////////////
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
      this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      this.agDelete(event);
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  SetIsParent() {
    if (this.parentTaskSelected == null) {
      this.master.isParent = 1;
      this.master.parentTaskId = 0;
    }
    else {
      this.master.isParent = 0;
    }
  }

  private save() {
    debugger;
    console.log('save()', this.lstMaster);

    if (this.lstMaster.length > 0) {
      this.show = true;
      var button = this.commonService.buttonClicked;

      this.Service.SaveTaskInfo(this.lstMaster).subscribe((returns: any) => {
        if (returns.success) {
          if (button == "update") {
            this.toastrService.success(this.commonService.updatedmsg, "Message");
          }
          else {
            this.toastrService.success(this.commonService.successmsg, "Message");
          }
          //////////////Grid Refresh ///////////////////
          this.Service.GetTaskInfoById(0, this.commonService.DateFormat(this.fDate), this.commonService.DateFormat(this.tDate)).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
          //this.GetParentTaskList();
          this.getMaster();
          this.lstMaster = [];
          //////////////Grid Refresh ///////////////////
          //
        }
      });
    }
    else {
      this.commonService.valueSet("create");
      this.toastrService.danger("Please add at least one Task!", "Message");
      return false;
    }
  }


  private agEdit(event) {
    debugger;
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
      let taskInfoId = event.node.data.taskInfoId;

      this.Service.GetTaskInfoById(taskInfoId, this.commonService.DateFormat(this.fDate), this.commonService.DateFormat(this.tDate)).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];

          this.taskTypeSelected = {
            id: data.data[0].taskTypeId, name: data.data[0].taskTypeName
          }
          this.taskPrioritySelected = {
            id: data.data[0].taskPriorityId, name: data.data[0].priorityName
          }
          this.assignToIdSelected = {
            id: data.data[0].assignToId, name: data.data[0].teamMemberName
          }
          this.parentTaskSelected = {
            id: data.data[0].taskInfoId, name: data.data[0].taskName
          }

          this.master.date = new Date(this.master.date);
          this.master.expectedEndDate = new Date(this.master.expectedEndDate);
        }
      });
      this.ngOnInit();
    }
  }


  private agDelete(event) {
    if (confirm("Are you sure to delete?")) {
      let taskInfoId = event.node.data.taskInfoId;
      this.Service.DeleteTaskInfoById(taskInfoId).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.Service.GetTaskInfoById(0, this.commonService.DateFormat(this.fDate), this.commonService.DateFormat(this.tDate)).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
          //////////////Grid Refresh ///////////////////
        }
      });
    }
  }
  validation(): boolean {
    //debugger;
    if (this.taskTypeSelected == null) {
      this.commonService.valueSet("create");
      this.toastrService.danger("Please select a taskType", "Message");
      return false;
    }
    else if (this.taskPrioritySelected == null) {
      this.commonService.valueSet("create");
      this.toastrService.danger("Please select a taskPriority", "Message");
      return false;
    }
    else if (this.master.taskName == '') {
      this.commonService.valueSet("create");
      this.toastrService.danger("Please input taskName", "Message");
      return false;
    }
    else if (this.assignToIdSelected == null) {
      this.commonService.valueSet("create");
      this.toastrService.danger("Please select a assignTo", "Message");
      return false;
    }
    else if (this.master.date == null || this.master.date == undefined) {
      this.commonService.valueSet("create");
      this.toastrService.danger("Please select assign date", "Message");
      return false;
    }
    else if (this.master.expectedEndDate == null || this.master.expectedEndDate == undefined) {
      this.commonService.valueSet("create");
      this.toastrService.danger("Please select expected end date", "Message");
      return false;
    }
    else if (this.master.atime == '' || this.master.atime == null) {
      this.commonService.valueSet("create");
      this.toastrService.danger("Please select assign time", "Message");
      return false;
    }
    else if (this.master.etime == '' || this.master.etime == null) {
      this.commonService.valueSet("create");
      this.toastrService.danger("Please select expected end time", "Message");
      return false;
    }

    return true;
  }



  addRow() {
    //debugger;
    this.SetIsParent();
    if (this.validation()) {

      let row = {
        taskInfoId: this.master.taskInfoId,
        taskName: this.master.taskName,
        taskCode: this.master.taskCode,

        description: this.master.description,
        taskTypeId: this.master.taskTypeId,
        employeeId: this.master.employeeId,

        assignToId: this.master.assignToId,
        assignTo: this.assignToIdSelected["name"],
        taskPriorityId: this.master.taskPriorityId,

        priorityName: this.taskPrioritySelected["name"],
        date: `${this.commonService.DateFormat(this.master.date).toString()} ${this.master.atime}`,
        expectedEndDate: `${this.commonService.DateFormat(this.master.expectedEndDate).toString()} ${this.master.etime}`,

        isParent: this.master.isParent,
        parentTaskId: this.master.parentTaskId,
        isActive: this.master.isActive,
      }

      //console.log('row :', row);

      this.lstMaster.push(row);

      this.master.taskName = "";
      this.master.assignToId = 0;
      this.assignToIdSelected = null;
      this.master.taskPriorityId = 0;
      this.taskPrioritySelected = null;
      this.master.description = "";
    }
  }




  removeRow(index) {
    debugger;
    if (confirm("Are you sure to remove?")) {
      this.commonService.valueSet("create");
      this.selectedRow = this.lstMaster[index];
      this.lstMaster.splice(index, 1);
      if (this.selectedRow.helpDetailId > 0) {
      }
      this.toastrService.danger(this.commonService.deletedmsg, "Message");
    }
  }

  private agReport(event) {
    //this.generateStockInReport(event.data.stockMasterId);
  }


  // @Output() myEvent = new EventEmitter();

  // public deleteRow(state, action) {
  //   const nodeIdToRemove = action.payload;
  //   const filteredData = state.rowData.filter(
  //     (node) => node.id !== nodeIdToRemove
  //   );
  //   return {
  //     ...state,
  //     rowData: [...filteredData],
  //   };
  // }




  config: NbToastrConfig;
  index = 1;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus = "primary";

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

}
