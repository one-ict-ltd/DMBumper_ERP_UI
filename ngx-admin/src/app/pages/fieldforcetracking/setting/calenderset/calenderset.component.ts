import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
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
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { CommoncomboService } from "app/services/commoncombo.service";
import { ModalService } from "app/services/transaction/modal.service";
import { Router } from "@angular/router";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { ElementRef } from "@angular/core";
import { CalenderService } from "app/services/attendance/calender.service";
import { FiscalyearService } from "app/services/budget/fiscalyear.service";
import { BtnCellWithoutPrint } from "app/pages/common/btn-cell-withoutPrint.component";

@Component({
  selector: 'ngx-calenderset',
  templateUrl: './calenderset.component.html',
  styleUrls: ['./calenderset.component.scss']
})
export class CalendersetComponent implements OnInit {

  master: {
    //isActive: boolean;
    Year: number;
    fiscalYearSelected: {};
    MonthNo: number;
    monthSelected: {};

    lstModel: any[];
    index: number;

  };
  details: any;
  disabled: boolean = false;
  config: NbToastrConfig;
  index = 1;
  isEdit: boolean = false;

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


  //////////////////

  show: boolean = true;
  showparty: boolean = false;
  showaccount: boolean = true;
  showtd: boolean = true;
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

  public pageNavigation = "Calender Settings";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
      this.isEdit = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");
      this.save();
      this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      this.show = true;
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
      //isActive: false,
      Year: 0,
      fiscalYearSelected: null,
      MonthNo: 0,
      monthSelected: null,

      lstModel: [],
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
  public fiscalYearItems = [];
  public monthItems = [];

  public LoadFiscalYear() {
    this.fiscalyearService.getFiscalYear().subscribe((returns: any) => {
      this.fiscalYearItems = returns.data.map((val) => ({
        id: val.fiscalYearId,
        name: val.yearName,
      }));
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

  public GetFullMonthCalender() {
    this.calenderService.GetFullMonthCalender(this.master.Year, this.master.MonthNo).subscribe((data: any) => {
      if (data.status) {
        this.master.lstModel = data.data;
      }
    });
  }

  public GetFormattedDate(vdate) {
    var formattedDate = new Date(vdate);
    var d = formattedDate.getDate();
    var m = formattedDate.getMonth();
    var y = formattedDate.getFullYear();
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
    var fullDate = d + "-" + monthNames[m] + "-" + y;
    return fullDate;
  }


  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.Year == null || this.master.Year == 0) {
      this.toastrService.danger("Please Enter Year", "Message");
      this.commonService.valueSet("create");
      return false;
    }else if(this.master.MonthNo == null || this.master.MonthNo == 0){
      this.toastrService.danger("Please Enter Month", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    this.calenderService.SaveCalender(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        //////////////Grid Refresh ///////////////////
        this.calenderService.GetCalender().subscribe((data: any) => {
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
  public params = [];
  public apiUrl = "";
  public bodyData: any = [];


  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellWithoutPrint;
  };

  constructor(
    private router: Router,
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private modalService: ModalService,
    private comboService: CommoncomboService,
    private calenderService: CalenderService,
    private fiscalyearService: FiscalyearService,
  ) {

    this.LoadFiscalYear();
    this.LoadMonthName();

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
        headerName: "Year",
        field: "Year",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 150,
      },
      {
        headerName: "Month",
        field: "MonthName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 150,
      },
      {
        headerName: "Is Active?",
        field: "IsActive",
        editable: false,
        width: 130,
      },
      {
        field: "action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) {
            localStorage.setItem("button", field);
          },
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
    //debugger;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.calenderService.GetCalender().subscribe((data: any) => {
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
      this.isEdit = true;
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

  private agReport(event) {
    this.toastrService.info("Print button clicked", "Message");
  }


  public addSelected(detail) { }
  private agEdit(event) {
    //debugger;
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

      var userPermissionGroupId = event.node.data.userPermissionGroupId;
      var Year = event.node.data.Year;
      var MonthNo = event.node.data.MonthNo;

      this.calenderService.GetCalenderByMonth(Year, MonthNo).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];

          this.master.fiscalYearSelected = {
            id: data.data[0].fiscalYearId,
            name: data.data[0].Year,
          };

          this.master.monthSelected = {
            id: data.data[0].MonthNo,
            name: data.data[0].MonthName,
          };

          this.calenderService.GetCalenderByMonth(Year, MonthNo).subscribe((data: any) => {
            if (data.success) {
              this.master.lstModel = data.data;
            }
          });

        }
      });
      this.ngOnInit();
    }
  }


  private agDelete(event) {
    var result = confirm("Are you sure you want to delete that?");
    if (result) {
      this.master.Year = event.node.data.Year;
      this.master.MonthNo = event.node.data.MonthNo;

      this.calenderService.DeleteCalender(this.master).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");
          //////////////Grid Refresh ///////////////////
          this.calenderService.GetCalender().subscribe((data: any) => {
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
  @ViewChild('body_table') targetElement: ElementRef;
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

}
