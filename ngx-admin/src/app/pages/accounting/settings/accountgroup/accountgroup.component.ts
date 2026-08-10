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
import { AccountgroupService } from "app/services/accountgroup.service";
import { CommoncomboService } from "app/services/commoncombo.service";


@Component({
  selector: 'ngx-accountgroup',
  templateUrl: './accountgroup.component.html',
  styleUrls: ['./accountgroup.component.scss']
})
export class AccountgroupComponent implements OnInit {

  master: {
    accountGroupId: number;
    groupCode: string;
    groupName: string;
    isActive: number;

    parentId: number;
    parentSelected: {};
    groupNatureId: number;
    groupNatureSelected: {};
    countData: number;
    sortOrder: number;
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

  public pageNavigation = "Account Group";
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
      accountGroupId: 0,
      groupCode: "",
      groupName: "",
      isActive: 1,
      groupNatureId: 0,
      groupNatureSelected: null,
      parentId: 0,
      parentSelected: null,
      countData: 0,
      sortOrder: 0,
    };
  }

  public groupNature = [];
  public parentGroup = [];

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
    this.accountgroupService.getDuplicateAccountGroup(this.master.accountGroupId, this.master.groupName).subscribe((returns: any) => {
      this.master.countData = returns.data[0].countData;
    });
  }

  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.groupNatureId == 0 || this.master.groupNatureId == null) {
      this.toastrService.danger("Please select group nature", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.groupName == '' || this.master.groupName == null) {
      this.toastrService.danger("Please insert group name", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.countData != 0) {
      this.toastrService.danger("Duplicate group name", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    this.accountgroupService.saveAccountGroup(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.show = true;
        //////////////Grid Refresh ///////////////////
        this.accountgroupService.getAccountGroup().subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
        });
        this.getParentGroup();
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
    private accountgroupService: AccountgroupService,
    private comboService: CommoncomboService
  ) {
    this.commonService.valueSet('showlist');
    this.getDropdownData();
    this.getParentGroup();

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
        headerName: "Group Nature",
        field: "natureName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 150,
      },
      {
        headerName: "Parent Group Name",
        field: "parentName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Parent Group Code",
        field: "parentCode",
        filter: "agTextColumnFilter",
        editable: false,
        width: 130,
      },
      {
        headerName: "Sub Group Name",
        field: "groupName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 250,
      },
      {
        headerName: "Sub Group Code",
        field: "groupCode",
        filter: "agTextColumnFilter",
        editable: false,
        width: 130,
      },
      {
        headerName: "Sort Order",
        field: "sortOrder",
        filter: "agTextColumnFilter",
        editable: false,
        width: 120,
      },
      {
        headerName: "Is Active?",
        field: "isActive",
        editable: false,
        width: 120,
      },
      {
        field: "action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) {

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
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.accountgroupService.getAccountGroup().subscribe((data: any) => {
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
      var accountGroupId = event.node.data.accountGroupId;
      var groupNatureId = event.node.data.groupNatureId;

      this.accountgroupService.getAccountGroupById(accountGroupId, groupNatureId).subscribe((data: any) => {
        if (data.success) {
          //this.master = data.data[0];
          var item = data.data[0];
          this.master = item;

          this.master.groupNatureSelected = {
            id: item.groupNatureId,
            name: item.natureName,
          };

          this.master.parentSelected = {
            id: item.parentId,
            name: item.parentName,
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
      this.master.accountGroupId = event.node.data.accountGroupId;
      this.accountgroupService.deleteAccountGroup(this.master).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.accountgroupService.getAccountGroup().subscribe((data: any) => {
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

  public getDropdownData() {
    this.comboService.getGroupNature().subscribe((returns: any) => {
      this.groupNature = returns.data.map((val) => ({
        id: val.groupNatureId,
        name: val.natureName,
      }));
    });
  }

  public getParentGroup() {
    this.comboService.getAccountGroupByNature(0).subscribe((returns: any) => {
      this.parentGroup = returns.data.map((val) => ({
        id: val.accountGroupId,
        name: val.groupName,
      }));
    });
  }

}
