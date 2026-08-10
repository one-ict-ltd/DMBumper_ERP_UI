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
  selector: 'ngx-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  public pageNavigation = "Task Team";
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
    taskTeamMasterId: number;
    teamLeaderId: number;
    teamName: string;
    teamCode: string;
    description: string;
    teamLeaderName: string;
    isActive: number;
    lstTaskTeamDetails: any;
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
        headerName: "Team Leader Name",
        field: "teamLeaderName",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 220,
      },
      {
        headerName: "Team Name",
        field: "teamName",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 220,
      },
      {
        headerName: "Team Code",
        field: "teamCode",
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
        headerName: "Description",
        field: "description",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 350,
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

    this.GetEmployee();
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
      taskTeamMasterId: 0,
      teamName: '',
      teamCode: '',
      description: '',
      teamLeaderId: 0,
      teamLeaderName: '',
      isActive: 1,
      lstTaskTeamDetails: [],
    };

    this.teamLeaderSelected = null;
    this.memberSelected = null;
    this.isMemberActive = 1;
    this.employeeId = 0;
  }

  isMemberActive: number = 1;
  employeeId: number = 0;
  memberSelected = {};

  // lstMaster: any[];

  // taskTypeList = [];
  // taskTypeSelected = {};

  // taskPriorityList = [];
  // taskPrioritySelected = {};

  assignToList = [];
  teamLeaderSelected = {};
  GetEmployee() {
    this.Service.GetTaskTeamMember(0).subscribe((data: any) => {
      if (data.success) {
        this.assignToList = data.data.map((val: any) => ({
          id: val.teamMemberId,
          name: val.teamMemberName,
        }));
      }
    });
  }

  LoadData() {
    this.Service.GetTaskTeamById(0, 0, this.commonService.DateFormat(this.fDate), this.commonService.DateFormat(this.tDate)).subscribe((data: any) => {
      if (data.success) {
        //console.log("GetTaskTeamById", data.data)
        this.rowData = data.data;
      }
    });
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

  private reset() {
    this.getMaster();
  }


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


  private save() {
    debugger;
    console.log('save()', this.master);

    if (this.master.lstTaskTeamDetails.length > 0) {
      this.show = true;
      var button = this.commonService.buttonClicked;

      this.Service.SaveTaskTeam(this.master).subscribe((returns: any) => {
        if (returns.success) {
          if (button == "update") {
            this.toastrService.success(this.commonService.updatedmsg, "Message");
          }
          else {
            this.toastrService.success(this.commonService.successmsg, "Message");
          }
          //////////////Grid Refresh ///////////////////
          this.Service.GetTaskTeamById(0, 0, this.commonService.DateFormat(this.fDate), this.commonService.DateFormat(this.tDate)).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
          this.getMaster();
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
      let taskTeamMasterId = event.node.data.taskTeamMasterId;

      this.Service.GetTaskTeamById(taskTeamMasterId, 0, this.commonService.DateFormat(this.fDate), this.commonService.DateFormat(this.tDate)).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];

          this.teamLeaderSelected = {
            id: data.data[0].teamLeaderId, name: data.data[0].teamLeaderName
          }

        }
      });
      this.ngOnInit();
    }
  }


  private agDelete(event) {
    if (confirm("Are you sure to delete?")) {
      let taskTeamMasterId = event.node.data.taskTeamMasterId;
      this.Service.DeleteTaskTeamById(taskTeamMasterId).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.Service.GetTaskTeamById(0, 0, this.commonService.DateFormat(this.fDate), this.commonService.DateFormat(this.tDate)).subscribe((data: any) => {
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

    if (this.teamLeaderSelected == undefined || this.teamLeaderSelected == null) {
      this.commonService.valueSet("create");
      this.toastrService.danger("Please input Team Leader", "Message");
      return false;
    }
    else if (this.master.teamName == "") {
      this.commonService.valueSet("create");
      this.toastrService.danger("Please enter a team name", "Message");
      return false;
    }
    else if (this.master.teamCode == "") {
      this.commonService.valueSet("create");
      this.toastrService.danger("Please enter a team code", "Message");
      return false;
    }
    else if (this.memberSelected == undefined || this.memberSelected == null) {
      this.commonService.valueSet("create");
      this.toastrService.danger("Please select Team Leader", "Message");
      return false;
    }


    return true;
  }



  addRow() {
    //debugger;
    if (this.validation()) {

      let row = {
        taskTeamMasterId: this.master.taskTeamMasterId,
        taskTeamDetailId: 0,
        employeeId: this.employeeId,
        teamMemberName: this.memberSelected["name"],
        isActive: this.isMemberActive,
      }

      //console.log('row :', row);

      this.master.lstTaskTeamDetails.push(row);
      this.memberSelected = null;
      this.isMemberActive = 1;
      this.employeeId = 0;
    }
  }




  removeRow(index: number, teamMemberName: any) {
    debugger;
    if (confirm(`Are you sure to remove "${teamMemberName}"?`)) {
      this.commonService.valueSet("create");
      this.selectedRow = this.master.lstTaskTeamDetails[index];
      this.master.lstTaskTeamDetails.splice(index, 1);
      if (this.selectedRow.helpDetailId > 0) {
      }
      this.toastrService.danger(this.commonService.deletedmsg, "Message");
    }
  }

  private agReport(event) {
    //this.generateStockInReport(event.data.stockMasterId);
  }




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
