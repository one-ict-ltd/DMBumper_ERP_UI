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
import { SalarygradeService } from "app/services/salary/salarymaster/salarygrade.service";
import { SalarygradepercentService } from "app/services/salary/salarymaster/salarygradepercent.service";
import { SalaryheadService } from "app/services/salary/salarymaster/salaryhead.service";

@Component({
  selector: 'ngx-salarygradepercent',
  templateUrl: './salarygradepercent.component.html',
  styleUrls: ['./salarygradepercent.component.scss']
})
export class SalarygradepercentComponent implements OnInit {

  master: {
    salaryGradePercentId: number;
    salaryGradeId: number;
    salaryHeadId: number;
    salaryCalulationTypeId: number;
    percentAmount: number;
    isActive: boolean;

    salaryGradeSelected: {};
    salaryHeadSelected: {};
    salaryCalulationTypeSelected: {};
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

  public pageNavigation = "Salary Grade Percent";
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
      salaryGradePercentId: 0,
      salaryGradeId: 0,
      salaryHeadId: 0,
      salaryCalulationTypeId: 0,
      percentAmount: 0,
      isActive: true,

      salaryGradeSelected: null,
      salaryHeadSelected: null,
      salaryCalulationTypeSelected: null,
      countData: 0,
    };
  }

  public salaryGradeItems: [];
  public salaryHeadItems: [];
  public salaryCalculationTypeItems: [];

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
    this.salarygradepercentService.GetDuplicateSalaryGradePercent(this.master.salaryGradePercentId, this.master.salaryGradeId, this.master.salaryHeadId)
      .subscribe((returns: any) => {
        this.master.countData = returns.data[0].countData;
      });
  }

  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.salaryHeadId == 0 || this.master.salaryHeadId == null) {
      this.toastrService.danger("Please select head name", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.salaryGradeId == 0 || this.master.salaryGradeId == null) {
      this.toastrService.danger("Please select grade name", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.salaryCalulationTypeId == 0 || this.master.salaryCalulationTypeId == null) {
      this.toastrService.danger("Please select calulation type name", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.countData != 0) {
      this.toastrService.danger("Duplicate grade & head name selected", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    this.salarygradepercentService.SaveSalaryGradePercent(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.show = true;
        //////////////Grid Refresh ///////////////////
        this.salarygradepercentService.GetSalaryGradePercentById(0, 0, 0).subscribe((data: any) => {
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
    private salarygradeService: SalarygradeService,
    private salarygradepercentService: SalarygradepercentService,
    private salaryheadService: SalaryheadService,
    private comboService: CommoncomboService
  ) {
    this.commonService.valueSet("showlist");

    this.getSalaryGrade();
    this.getSalaryHead();
    this.getCalculationType();

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
        headerName: "Grade Name",
        field: "gradeName",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Head Name",
        field: "salaryHeadName",
        filter: "agTextColumnFilter",
        width: 300,
      },
      {
        headerName: "Calulation Type",
        field: "salaryCalulationTypeName",
        filter: "agTextColumnFilter",
        width: 180,
      },
      {
        headerName: "Percentage/Amount",
        field: "percentAmount",
        filter: "agNumberColumnFilter",
        valueFormatter: (params) => this.currencyFormatter(params.data.percentAmount),
        type: "rightAligned",
        width: 180,
      },
      {
        headerName: "Is Active?",
        field: "isActive",
        width: 120,
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
    this.salarygradepercentService.GetSalaryGradePercentById(0, 0, 0).subscribe((data: any) => {
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
      var salaryGradePercentId = event.node.data.salaryGradePercentId;

      this.salarygradepercentService.GetSalaryGradePercentById(salaryGradePercentId, 0, 0).subscribe((data: any) => {
        if (data.status) {
          this.master = data.data[0];

          this.master.salaryGradeSelected = {
            id: data.data[0].salaryGradeId,
            name: data.data[0].gradeName,
          };
          this.master.salaryHeadSelected = {
            id: data.data[0].salaryHeadId,
            name: data.data[0].salaryHeadName,
          };
          this.master.salaryCalulationTypeSelected = {
            id: data.data[0].salaryCalulationTypeId,
            name: data.data[0].salaryCalulationTypeName,
          };

          this.getDuplicate();
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
      this.master.salaryGradePercentId = event.node.data.salaryGradePercentId;
      this.salarygradepercentService.DeleteSalaryGradePercentById(this.master.salaryGradePercentId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(
              this.commonService.deletedmsg,
              "Message"
            );

            //////////////Grid Refresh ///////////////////
            this.salarygradepercentService.GetSalaryGradePercentById(0, 0, 0).subscribe((data: any) => {
              if (data.status) {
                this.rowData = data.data;
              }
            });
            //////////////Grid Refresh ///////////////////
          }
        });
    }
  }

  public getSalaryGrade() {
    this.salarygradeService.GetSalaryGradeById(0).subscribe((returns: any) => {
      this.salaryGradeItems = returns.data.map((val) => ({
        id: val.salaryGradeId,
        name: val.gradeName,
      }));
    });
  }

  public getSalaryHead() {
    this.salaryheadService.GetSalaryHeadById(0).subscribe((returns: any) => {
      this.salaryHeadItems = returns.data.map((val) => ({
        id: val.salaryHeadId,
        name: val.salaryHeadName,
      }));
    });
  }

  public getCalculationType() {
    this.salarygradepercentService.GetSalaryCalulationTypeById(0).subscribe((returns: any) => {
      this.salaryCalculationTypeItems = returns.data.map((val) => ({
        id: val.salaryCalulationTypeId,
        name: val.salaryCalulationTypeName,
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
