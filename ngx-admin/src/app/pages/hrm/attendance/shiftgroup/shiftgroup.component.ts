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

@Component({
  selector: 'ngx-shiftgroup',
  templateUrl: './shiftgroup.component.html',
  styleUrls: ['./shiftgroup.component.scss']
})
export class ShiftgroupComponent implements OnInit {

  master: {
    shiftMasterId: number;
    shiftName: string;
    isActive: boolean;
    isDetailsUpdated: number;

    shiftDetailId: number;
    weekDay: string;
    weekDaySelected: {};
    startTime: string;
    endTime: string;
    isHoliday: boolean;

    countData: number;
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

  public pageNavigation = "Shift Group";
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
      shiftMasterId: 0,
      shiftName: "",
      isActive: true,
      isDetailsUpdated: 0,

      shiftDetailId: 0,
      weekDay: "",
      weekDaySelected: null,
      startTime: "",
      endTime: "",
      isHoliday: false,

      countData: 0,
      lstDetails: [],
      index: -1,
    };
  }

  public weekDayItems = [];

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
    if (this.master.weekDay == "" || this.master.weekDay == null) {
      this.toastrService.danger("Please select day", "Message");
      return false;
    } else if (this.master.startTime == "") {
      this.toastrService.danger("Please input start time", "Message");
      return false;
    }
    else if (this.master.endTime == "") {
      this.toastrService.danger("Please input end time", "Message");
      return false;
    }

    var RowCount = this.master.lstDetails.length;
    for (let i = 0; i < RowCount; i++) {
      var _weekDay = this.master.lstDetails[i].weekDay;
      if (_weekDay == this.master.weekDay) {
        this.toastrService.danger("You have already added this day", "Message");
        return false;
      }
    }

    var weekDay = '';
    if (this.master.weekDaySelected != null) {
      weekDay = this.master.weekDaySelected['name']
    }

    let detail = {
      weekDay: weekDay,
      startTime: this.master.startTime,
      endTime: this.master.endTime,
      isHoliday: this.master.isHoliday,
    };

    var indexu = this.master.lstDetails.findIndex(
      (x) =>
        x.shiftDetailId == this.master.shiftDetailId
    );
    if (indexu > -1) {
      this.master.lstDetails[indexu] = detail;
    } else {
      this.master.lstDetails.push(detail);
    }

    this.master.isDetailsUpdated = 1;
    this.ClearDetail();
  }

  public ClearDetail() {
    // this.master.addressTypeSelected = null;
    // this.master.division = null;
    // this.master.district = null;
    // this.master.thana = null;   
  }



  public deleteDetail(index: any) {
  debugger;
    this.selectedRow = this.master.lstDetails[index];
    this.master.lstDetails.splice(index, 1);

    // var index1 = this.master.lstDetails.findIndex(x => x.weekDay == this.master.weekDay);
    // if (index1 > -1) {
    //   this.master.lstDetails.splice(index1, 1);
    // }
    this.master.isDetailsUpdated = 1;
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }

  public editDetail(index: any) {
    debugger;
    this.master.index = index;
    this.selectedRow = this.master.lstDetails[index];

    this.master.shiftDetailId = this.selectedRow.shiftDetailId;
    this.master.startTime = this.selectedRow.startTime;
    this.master.endTime = this.selectedRow.endTime;
    this.master.isHoliday = this.selectedRow.isHoliday;

    this.master.weekDaySelected = {
      id: this.selectedRow.weekDay,
      name: this.selectedRow.weekDay,
    };
    this.master.isDetailsUpdated = 1;
  }

  public isDetailsUpdated(index: any) {
    this.master.isDetailsUpdated = 1;
  }

  public getDuplicate() {
    this.shiftgroupService.GetDuplicateShiftGroupMaster(this.master.shiftMasterId, this.master.shiftName)
      .subscribe((returns: any) => {
        this.master.countData = returns.data[0].countData;
      });
  }

  private save() {
    var button = this.commonService.buttonClicked;
    debugger;
    if (this.master.shiftName == '' || this.master.shiftName == null) {
      this.toastrService.danger("Please insert shift name", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if(this.master.weekDay == null || this.master.weekDay == ''){
      this.toastrService.danger("Select a WeekDay", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.countData != 0) {
      this.toastrService.danger("Duplicate shift name", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.lstDetails.length == 0 || this.master.lstDetails == null) {
      this.toastrService.danger("Please insert day", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    this.shiftgroupService.SaveShiftGroupMaster(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.show = true;
        //////////////Grid Refresh ///////////////////
        this.shiftgroupService.GetShiftGroupMasterById(0).subscribe((data: any) => {
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
    private comboService: CommoncomboService
  ) {
    this.commonService.valueSet("showlist");

    this.getWeekDay();

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
        headerName: "Shift Name",
        field: "shiftName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 400,
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
    this.shiftgroupService.GetShiftGroupMasterById(0).subscribe((data: any) => {
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
      var shiftMasterId = event.node.data.shiftMasterId;

      this.shiftgroupService.GetShiftGroupMasterById(shiftMasterId).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];

          this.master.weekDaySelected = {
            id: data.data[0].weekDay,
            name: data.data[0].weekDay,
          };

          this.getDuplicate();

          this.shiftgroupService.GetShiftGroupDetailByMasterId(shiftMasterId).subscribe((data: any) => {
            if (data.success) {
              this.master.lstDetails = data.data;
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
      this.master.shiftMasterId = event.node.data.shiftMasterId;
      this.shiftgroupService.DeleteShiftGroupMasterById(this.master.shiftMasterId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(
              this.commonService.deletedmsg,
              "Message"
            );

            //////////////Grid Refresh ///////////////////
            this.shiftgroupService.GetShiftGroupMasterById(0).subscribe((data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            });
            //////////////Grid Refresh ///////////////////
          }
        });
    }
  }

  public getWeekDay() {
    this.comboService.getCmnDropDown(0, "WeeklyDay").subscribe((returns: any) => {
      this.weekDayItems = returns.data.map((val: any) => ({
        id: val.dropDownValue,
        name: val.dropDownText,
      }))
    })
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
