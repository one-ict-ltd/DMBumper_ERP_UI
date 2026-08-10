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
import { LeaveService } from "app/services/hrm/leave.service";
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";

@Component({
  selector: 'ngx-late-attandance-clarify',
  templateUrl: './late-attandance-clarify.component.html',
  styleUrls: ['./late-attandance-clarify.component.scss']
})
export class LateAttandanceClarifyComponent implements OnInit {

  master: {
    attandanceClarificationId: number;
    attandanceClarificationDate: Date
    attandanceClarificationTime: string;
    narration: string
    attandanceClarificationTypeId: number
    isApproved: boolean;
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

  public pageNavigation = "Late Clarify Apply";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.toastrService.info('No action', 'Message');
      this.commonService.valueSet('showlist');
      return;
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");
      this.save();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      //this.edit();
      this.show = false;
    }
  }
  lateAttandanDate: any;
  lateTime: any;
  narration: string = null;
  public getMaster() {
    this.master = {
      attandanceClarificationDate: this.lateAttandanDate,
      attandanceClarificationId: 0,
      attandanceClarificationTime: this.lateTime,
      isApproved: false,
      attandanceClarificationTypeId: 1, //for late Attandance
      narration: this.narration
    };
    //this.getType();
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
  // public getDuplicate() {
  //   //debugger;
  //   this.master.startDate = this.commonService.DateFormat(this.master.startDate);
  //   this.master.endDate = this.commonService.DateFormat(this.master.endDate);

  //   this.leaveService.getDuplicateleaveRegister(this.master.leaveRegisterId, this.master.startDate, this.master.endDate, this.master.employeeId).subscribe((returns: any) => {
  //     //debugger;
  //     //this.master.countData = returns.data[0].countData;
  //     if (returns.data[0].countData > 0) {
  //       this.toastrService.danger("Already Had a leave on following day", "Message");
  //       this.master.startDate = null;
  //       this.master.endDate = null;
  //       this.master.leaveDay = 0;
  //       return;
  //     }
  //   });
  // }

  private save() {
    var button = this.commonService.buttonClicked;
    debugger
    this.master = {
      attandanceClarificationDate: this.lateAttandanDate,
      attandanceClarificationId: 0,
      attandanceClarificationTime: this.lateTime,
      isApproved: false,
      attandanceClarificationTypeId: 1, //for late Attandance
      narration: this.narration

    };
    let apiUrl = 'Attendance/SaveAttandanceClarification';
    this.commonService.postApiData(apiUrl, this.master).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success('Attandance Clarification Saved Successfully!', 'Message');
        this.leaveService.GetLateClarificationByemployeeIdJson().subscribe((data: any) => {
          //debugger;
          if (data.success) {
            this.rowData = data.data;
          }
        });

      }
      else {
        this.toastrService.danger('Attandance Clarification has not Saved Successfully!', 'Message');
      }
    })
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
  private Balance = 0;
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
    private leaveService: LeaveService,
    private employeeinformationService: EmployeeinformationService,
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
      }, /// Dont Change    
      {
        headerName: "Employee Code",
        field: "employeeCode",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Employee Name",
        field: "employeeName",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Late Date",
        field: "attandanceClarificationDate",
        filter: "agTextColumnFilter",
        width: 150,
      },

      {
        headerName: "Late Time",
        field: "attandanceClarificationTime",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Status",
        field: "approvalStatus",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        field: "action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) {
            //localStorage.setItem("Token", user.auth_token);
            localStorage.setItem("button", field);
          },
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
    //this.getLeaveType();
    //this.getLeaveYear();
    //this.getEmployee();
    //debugger;
  }

  onGridReady(params) {
    debugger
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.leaveService.GetLateClarificationByemployeeIdJson().subscribe((data: any) => {
      //debugger;
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
    this.toastrService.info("You Can't Edit items!!", "Message");
    return false;
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked; //localStorage.getItem("button");
    if (data == "edit") {
      if (event.node.data.leaveStatus != 0) {
        this.toastrService.danger("You Can't Edit Leave!!", "Message");
        return;
      } else {
        this.agEdit(event);
        this.show = false;
      }
    } else if (data == "view") {
      this.agEdit(event);
      this.show = false;
      this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      if (event.node.data.leaveStatus != 0) {
        this.toastrService.danger("You Can't Delete Leave!!", "Message");
        return;
      } else {
        this.agDelete(event);
      }
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  // public LeaveTypeList = [];
  // public getLeaveType() {
  //   this.master.LeaveTypeSelected = null;
  //   this.leaveService.getLeaveType().subscribe((retuns: any) => {
  //     if (retuns.success) {
  //       this.LeaveTypeList = retuns.data.map((val: any) => ({
  //         id: val.leaveTypeId,
  //         name: val.typeName,
  //       }));
  //       //console.log(this.LeaveTypeList);
  //     }
  //   })
  // }

  // public LeaveYearList = [];
  // public getLeaveYear() {
  //   this.master.LeaveYearSelected = null;
  //   this.leaveService.getLeaveYear().subscribe((retuns: any) => {
  //     if (retuns.success) {
  //       this.LeaveYearList = retuns.data.map((val: any) => ({
  //         id: val.leaveYearId,
  //         name: val.yearName,
  //       }));
  //       //console.log(this.LeaveTypeList);
  //     }
  //   })
  // }

  // public EmployeeList = [];
  // public getEmployee() {
  //   this.master.substituteEmployeeSelected = null;
  //   this.employeeinformationService.GetEmployeeInfoLoadByIdOptimized(0).subscribe((retuns: any) => {
  //     if (retuns.success) {
  //       this.EmployeeList = retuns.data.map((val: any) => ({
  //         id: val.employeeId,
  //         name: val.fullName,
  //       }));
  //       //console.log(this.LeaveTypeList);
  //     }
  //   })
  // }

  private agEdit(event) {
    // this.disabled = false;
    // let temp = 0;
    // for (let i = 0; i < this.selectedRows.length; i++) {
    //   if (this.selectedRows[i] == event.node.data) {
    //     this.selectedRows.splice(i, 1);
    //     this.selectedRow = event.node.data;
    //     temp = 1;
    //     this.ngOnInit();
    //   }
    // }
    // if (temp === 0) {
    //   this.selectedRows.push(event.node.data);
    //   this.selectedRow = event.node.data;
    //   var leaveRegisterId = event.node.data.leaveRegisterId;

    //   this.leaveService.GetLeaveRegisterByIdJson(leaveRegisterId).subscribe((data: any) => {
    //     if (data.success) {
    //       //debugger;
    //       this.master = data.data[0];

    //       this.master.startDate = new Date(data.data[0].startDate);
    //       this.master.endDate = new Date(data.data[0].endDate);

    //       this.master.LeaveTypeSelected = {
    //         id: this.master.leaveTypeId,
    //         name: this.master.typeName
    //       };
    //       this.master.LeaveYearSelected = {
    //         id: this.master.yearId,
    //         name: this.master.yearName
    //       };
    //       this.master.TypeSelected = {
    //         id: this.master.type,
    //         name: data.data[0].CategoryName
    //       };

    //       this.GetLeaveBalance();

    //       this.master.substituteEmployeeSelected = {
    //         id: this.master.substituteEmployeeId,
    //         name: this.master.substituteEmployeeName + '-' + this.master.substituteEmployeeCode
    //       };
    //       // this.getDuplicate();
    //     }
    //   });
    //   this.ngOnInit();
    // }
  }
  private agReport(event) {
    //this.toastrService.info("Print button clicked", "Message");
    this.generateReport(event.node.data.leaveRegisterId);
  }
  private agDelete(event) {
    // let leaveStatus = event.node.data.leaveStatus;

    // if (leaveStatus == 0) {
    //   var result = confirm("Are you sure you want to delete that?");
    //   if (result) {
    //     this.master.leaveRegisterId = event.node.data.leaveRegisterId;
    //     this.leaveService.deleteleaveRegister(this.master).subscribe((returns: any) => {
    //       if (returns.success) {
    //         this.toastrService.success(this.commonService.deletedmsg, "Message");

    //         //////////////Grid Refresh ///////////////////
    //         this.leaveService.GetLeaveRegisterByemployeeIdJson().subscribe((data: any) => {
    //           if (data.success) {
    //             this.rowData = data.data;
    //           }
    //         });
    //         //////////////Grid Refresh ///////////////////
    //       }
    //     });

    //   }
    // } else {
    //   this.toastrService.danger("You Can't Delete Leave", "Message");
    // }

  }
  //////////////////////////////////End of Ag Grid Data Load/////////////////////////////////

  @Output() myEvent = new EventEmitter();

  public deleteRow(state, action) {
    //debugger;
    const nodeIdToRemove = action.payload;
    const filteredData = state.rowData.filter(
      (node) => node.id !== nodeIdToRemove
    );
    return {
      ...state,
      rowData: [...filteredData],
    };
  }

  // public TypeList = [];
  // public getType() {
  //   this.master.TypeSelected = null;
  //   this.TypeList = [
  //     {
  //       id: 1,
  //       name: "Pre Leave"
  //     }, {
  //       id: 2,
  //       name: "Post Leave"
  //     }
  //   ]
  // }

  // calculateDiff() {
  //   if (this.master.startDate == null || this.master.endDate == null) {
  //     return;
  //   }
  //   let date = new Date(this.master.startDate);
  //   let currentDate = new Date(this.master.endDate);

  //   let days = Math.floor((currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24) + 1;
  //   this.getDuplicate();
  //   this.master.leaveDay = days;
  // }

  // GetLeaveBalance() {
  //   if (this.master.leaveTypeId > 0 && this.master.yearId > 0) {
  //     this.leaveService.GetLeaveBalance(this.master.yearId, this.master.leaveTypeId).subscribe((data: any) => {
  //       if (data.success) {
  //         this.Balance = data.data[0].leaveBalance;
  //       }
  //     });
  //   }
  // }

  public generateReport(leaveRegisterId) {

    this.getCrReport(leaveRegisterId);
  }
  apiUrl = '';
  private getCrReport(leaveRegisterId: any, reportFormat: any = 'pdf') {
    this.apiUrl = `Leave/RptGetEmployeeRegisterInfo?leaveRegisterId=${leaveRegisterId}&reportFormat=${reportFormat}`;
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
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





  /////////////////////////////

}
