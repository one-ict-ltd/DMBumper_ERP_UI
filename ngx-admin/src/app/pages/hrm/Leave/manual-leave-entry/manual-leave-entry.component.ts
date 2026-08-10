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

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}


@Component({
  selector: 'ngx-manual-leave-entry',
  templateUrl: './manual-leave-entry.component.html',
  styleUrls: ['./manual-leave-entry.component.scss']
})
export class ManualLeaveEntryComponent implements OnInit {

  master: {
    leaveRegisterId: number;
    employeeId: number;
    employeeName: string;
    employeeCode: string;
    substituteEmployeeId: number;
    substituteEmployeeName: string;
    substituteEmployeeCode: string;
    leaveTypeId: number;
    typeName: string;
    yearId: number;
    yearName: string;
    leaveDay: number;
    leaveStatus: number;
    type: number;
    startDate: Date;
    endDate: Date;
    leaveLocation: string;
    remarks: string;
    isActive: number;
    countData: number;

    LeaveTypeSelected: {};
    LeaveYearSelected: {};
    TypeSelected: {};
    EmployeeSelected: {};
    substituteEmployeeSelected: {};
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

  public pageNavigation = "Manual Leave Entry";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
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
  public getMaster() {
    this.master = {
      leaveRegisterId: 0,
      employeeId: 0,
      employeeName: "",
      employeeCode: "",
      substituteEmployeeId: null,
      substituteEmployeeName: "",
      substituteEmployeeCode: "",
      leaveTypeId: 0,
      typeName: "",
      yearId: 0,
      yearName: "",
      leaveDay: 0,
      leaveStatus: 0,
      type: 0,
      startDate: null,
      endDate: null,
      leaveLocation: "",
      remarks: "",
      isActive: 1,
      countData: 0,

      LeaveTypeSelected: null,
      LeaveYearSelected: null,
      TypeSelected: null,
      EmployeeSelected: null,
      substituteEmployeeSelected: null,
    };
    this.getType();
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
  public getDuplicate() {
    //debugger;
    this.leaveService.getDuplicateLeaveOpeningBalance(this.master.leaveRegisterId, this.master.yearId, this.master.leaveTypeId, this.master.employeeId).subscribe((returns: any) => {
      //debugger;
      this.master.countData = returns.data[0].countData;
    });
  }

  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.leaveTypeId == 0 || this.master.leaveTypeId == null) {
      this.toastrService.danger("Please select leave type", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.yearId == 0 || this.master.yearId == null) {
      this.toastrService.danger("Please select leave year", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.employeeId == 0 || this.master.employeeId == null) {
      this.toastrService.danger("Please select employee", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.leaveDay == 0) {
      this.toastrService.danger("Please check Leave Days", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.leaveDay > this.Balance && this.master.leaveTypeId <= 3) {
      this.toastrService.danger("Your Leave Balance is over please check!!", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    this.master.startDate = this.commonService.DateFormat(this.master.startDate);
    this.master.endDate = this.commonService.DateFormat(this.master.endDate);

    //alert(this.master.yearlyMaxLeave);
    this.leaveService.SaveLeaveRegister(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.show = true;
        //////////////Grid Refresh ///////////////////
        this.leaveService.GetLeaveRegisterByemployeeIdJson().subscribe((data: any) => {
          if (data.success) {
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
        width: 70,
      }, /// Dont Change    
      {
        headerName: "Employee Code",
        field: "employeeCode",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Employee Name",
        field: "employeeName",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Leave Type",
        field: "typeName",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Leave Year",
        field: "yearName",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Start Date",
        field: "startDate",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "End Date",
        field: "endDate",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Leave Day",
        field: "leaveDay",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Leave Status",
        field: "leaveStatusText",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Substitute Employee",
        field: "substituteEmployeeName",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Leave Location",
        field: "leaveLocation",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Is Active?",
        field: "isActive",
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
    this.getLeaveType();
    this.getLeaveYear();
    this.getEmployee();
    //debugger;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.leaveService.GetManualLeaveRegisterByemployeeIdJson().subscribe((data: any) => {
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

  public LeaveTypeList = [];
  public getLeaveType() {
    this.master.LeaveTypeSelected = null;
    this.leaveService.getLeaveType().subscribe((retuns: any) => {
      if (retuns.success) {
        this.LeaveTypeList = retuns.data.map((val: any) => ({
          id: val.leaveTypeId,
          name: val.typeName,
        }));
        //console.log(this.LeaveTypeList);
      }
    })
  }

  public LeaveYearList = [];
  public getLeaveYear() {
    this.master.LeaveYearSelected = null;
    this.leaveService.getLeaveYear().subscribe((retuns: any) => {
      if (retuns.success) {
        this.LeaveYearList = retuns.data.map((val: any) => ({
          id: val.leaveYearId,
          name: val.yearName,
        }));
        //console.log(this.LeaveTypeList);
      }
    })
  }

  public EmployeeList = [];
  public getEmployee() {
    this.master.substituteEmployeeSelected = null;
    this.employeeinformationService.GetEmployeeInfoLoadByIdOptimized(0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.EmployeeList = retuns.data.map((val: any) => ({
          id: val.employeeId,
          name: val.fullName,
        }));
        //console.log(this.LeaveTypeList);
      }
    })
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
      var leaveRegisterId = event.node.data.leaveRegisterId;

      this.leaveService.GetLeaveRegisterByIdJson(leaveRegisterId).subscribe((data: any) => {
        if (data.success) {
          //debugger;
          this.master = data.data[0];


          this.master.startDate = new Date(data.data[0].startDate);
          this.master.endDate = new Date(data.data[0].endDate);

          this.master.LeaveTypeSelected = {
            id: this.master.leaveTypeId,
            name: this.master.typeName
          };
          this.master.LeaveYearSelected = {
            id: this.master.yearId,
            name: this.master.yearName
          };
          this.master.TypeSelected = {
            id: this.master.type,
            name: data.data[0].CategoryName
          };

          this.GetLeaveBalance();

          this.master.EmployeeSelected = {
            id: this.master.employeeId,
            name: this.master.employeeName + '-' + this.master.employeeCode
          };
          this.master.substituteEmployeeSelected = {
            id: this.master.substituteEmployeeId,
            name: this.master.substituteEmployeeName + '-' + this.master.substituteEmployeeCode
          };

          //this.getDuplicate();
        }
      });
      this.ngOnInit();
    }
  }
  private agReport(event) {
    //this.toastrService.info("Print button clicked", "Message");
    this.generateReport(event.node.data.leaveRegisterId);
  }

  public generateReport(leaveRegisterId) {

    this.getCrReport(leaveRegisterId);
  }
  apiUrl = '';
  private getCrReport(leaveRegisterId: any, reportFormat: any = 'pdf') {
    this.apiUrl = `Leave/RptGetEmployeeRegisterInfo?leaveRegisterId=${leaveRegisterId}&reportFormat=${reportFormat}`;
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      //console.log(returns);
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }


  private agDelete(event) {
    var result = confirm("Are you sure you want to delete that?");
    if (result) {
      this.master.leaveRegisterId = event.node.data.leaveOpeningBalanceId;
      this.leaveService.deleteleaveRegister(this.master).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.leaveService.GetManualLeaveRegisterByemployeeIdJson().subscribe((data: any) => {
            if (data.success) {
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

  public TypeList = [];
  public getType() {
    this.master.TypeSelected = null;
    this.TypeList = [
      {
        id: 1,
        name: "Pre Leave"
      }, {
        id: 2,
        name: "Post Leave"
      }
    ]
  }

  calculateDiff() {
    if (this.master.startDate == null || this.master.endDate == null) {
      return;
    }
    let date = new Date(this.master.startDate);
    let currentDate = new Date(this.master.endDate);

    let days = Math.floor((currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24) + 1;
    this.master.leaveDay = days;
  }

  GetLeaveBalance() {
    debugger
    if (this.master.leaveTypeId > 0 && this.master.yearId > 0 && this.master.employeeId > 0) {
      this.leaveService.GetManualLeaveBalance(this.master.employeeId, this.master.yearId, this.master.leaveTypeId).subscribe((data: any) => {
        if (data.success) {
          this.Balance = data.data[0].leaveBalance;
        }
      });
    }
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

  data: Country[] = [
    {
      name: "Russia",
      flag: "f/f3/Flag_of_Russia.svg",
      area: 17075200,
      population: 146989754,
    },
    {
      name: "Canada",
      flag: "c/cf/Flag_of_Canada.svg",
      area: 9976140,
      population: 36624199,
    },
    {
      name: "United States",
      flag: "a/a4/Flag_of_the_United_States.svg",
      area: 9629091,
      population: 324459463,
    },
    {
      name: "China",
      flag: "f/fa/Flag_of_the_People%27s_Republic_of_China.svg",
      area: 9596960,
      population: 1409517397,
    },
  ];

  names: any;
  openWithDataObjModel(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      context: this.data,
    });
  }
  openWithDataModel() {
    this.dialogService
      .open(DialogNamePromptComponent)
      .onClose.subscribe((name) => name && this.names.push(name));
  }
  /////////////////////////////
}
