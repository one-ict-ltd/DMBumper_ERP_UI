import { Component, OnInit } from "@angular/core";
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
import { CommoncomboService } from "app/services/commoncombo.service";
import { HrmmasterService } from "app/services/hrm/hrmmaster.service";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: "ngx-degree",
  templateUrl: "./degree.component.html",
  styleUrls: ["./degree.component.scss"],
})
export class DegreeComponent implements OnInit {
  public pageNavigation = "Degree";

  master: {
    degreeId: number;
    name: string;
    shortName: string;
    levelOfEducationId: number;
    isActive: boolean;
  };

  LevelOfEducationList: any = [];
  levelOfEducationSelected: {};

  protected options: {};
  showMessages: any = {};
  errors: string[];

  disabled: boolean = false;
  config: NbToastrConfig;
  index = 1;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus = "primary";

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

  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
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
      degreeId: 0,
      name: "",
      shortName: "",
      levelOfEducationId: 0,
      isActive: true,
    };
    this.LoadLevelOfEducation();
  }
  LoadLevelOfEducation() {
    this.levelOfEducationSelected = {};
    this.hrmmasterService
      .GetLevelOfEducationById(0)
      .subscribe((returns: any) => {
        this.LevelOfEducationList = returns.data.map((val: any) => ({
          id: val.levelOfEducationId,
          name: val.levelOfEducationName,
        }));
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
  /////End of Dynamic Button section (Do Not Edit)///////

  /////////////////////////////// CRUD ///////////////////////////////////////////

  private save() {
    if (this.master.name == "") {
      this.toastrService.danger("Pleae fill up Degree Name", "Message");
      this.commonService.valueSet("create");
    } else if (this.master.levelOfEducationId < 1) {
      this.toastrService.danger("Pleae select a Level", "Message");
      this.commonService.valueSet("create");
    } else {
      this.show = true;
      var button = this.commonService.buttonClicked;
      this.hrmmasterService
        .SaveDegree(this.master)
        .subscribe((returns: any) => {
          if (returns.success) {
            if (button == "update") {
              this.toastrService.success(
                this.commonService.updatedmsg,
                "Message"
              );
            } else {
              this.toastrService.success(
                this.commonService.successmsg,
                "Message"
              );
            }
            //////////////Grid Refresh ///////////////////
            this.getMaster();
            this.hrmmasterService.GetDegreeById(0).subscribe((data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            });
            //////////////Grid Refresh ///////////////////
            //
          }
        });
    }
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

  public selectdetailRows = [];
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
    private hrmmasterService: HrmmasterService,
    private comboService: CommoncomboService,
    private formBuilder: FormBuilder
  ) {
    this.commonService.valueSet("showlist");
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
        headerName: "Level of Education Name",
        field: "levelOfEducationName",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 220,
      },
      {
        headerName: "Degree Name",
        field: "name",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 280,
      },
      {
        headerName: "Short Name",
        field: "shortName",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 160,
      },
      {
        headerName: "Is Active",
        field: "isActive",
        width: 160,
      },
      {
        field: "Action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) {},
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
    this.getMaster();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.hrmmasterService.GetDegreeById(0).subscribe((data: any) => {
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

  private agDelete(event) {
    this.master.degreeId = event.node.data.degreeId;
    this.hrmmasterService
      .DeleteDegreeById(this.master.degreeId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");
          this.hrmmasterService.GetDegreeById(0).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
        }
      });
  }

  private agReport(event) {
    this.toastrService.success(
      this.commonService.successmsg,
      "Report button click!"
    );
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
      this.master.degreeId = event.node.data.degreeId;

      this.hrmmasterService
        .GetDegreeById(this.master.degreeId)
        .subscribe((data: any) => {
          if (data.success) {
            this.master = data.data[0];

            this.levelOfEducationSelected = {
              id: data.data[0].levelOfEducationId,
              name: data.data[0].levelOfEducationName,
            };
          }
        });
      this.ngOnInit();
    }
  }
}
