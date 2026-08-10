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
import { MenuService } from "app/services/erpsetting/menu.service";


@Component({
  selector: 'ngx-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  /////////////////////////////
  master: {
    menuId: number;
    menuName: string;
    menuShortName: string;
    menuPath: string;
    reportName: string;
    reportPath: string;
    isParent: number;
    parentId: number;
    parentSelected: {};
    sequence: number;
    menuIcon: string;
    isActive: number;

    menuTypeId: number;
    menuTypeSelected: {};
    moduleId: number;
    moduleSelected: {};
  };


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
  showParent: boolean = false;
  vlucherForm: FormGroup;
  submitted: boolean;
  saveupdate: string = "Save";
  gridbutton: string = "";
  name: string;
  description: string;
  selectedRow: any;
  MenuService: any;

  ngOnInit() {
    //debugger;
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;

    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Menu";
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

      menuId: 0,
      menuName: "",
      menuShortName: "",
      menuPath: "",
      reportName: "",
      reportPath: "",
      isParent: 1,
      parentId: 0,
      parentSelected: null,
      sequence: 0,
      menuIcon: "",
      isActive: 1,

      menuTypeId: 0,
      menuTypeSelected: null,
      moduleId: 0,
      moduleSelected: null,
    };
  }

  public moduleItems = [];
  public menuTypeItems = [];
  public parentItems = [];

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
    var button = this.commonService.buttonClicked;
    this.menuService
      .saveMenus(this.master)
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
          this.getMenus();
          this.getParentMenu(0);
        }
      });
  }
  private reset() {
    this.getMaster();
  }
  private getMenus() {
    this.menuService.getMenus().subscribe((returns: any) => {
      if (returns.success) {
        this.rowData = returns.data;
      }
    });
  }
  //////////////////////////////// End CRUD /////////////////////////////////////////


  // Hide Parent upon isParent click START 
  unCheckParent(e) {
    if (e.target.checked) {
      this.showParent = false;
    }
    else {
      this.showParent = true;
    }
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
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private menuService: MenuService,
    private comboService: CommoncomboService,
  ) {

    this.getModule();
    this.getMenuType();

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
        headerName: "Module",
        field: "moduleName",
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "Menu Type",
        field: "menuTypeName",
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "Is Parent?",
        field: "isParent",
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "Parent Name",
        field: "parentName",
        filter: "agTextColumnFilter",
        width: 180,
      },
      {
        headerName: "Menu Name",
        field: "menuName",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Menu Path",
        field: "menuPath",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Sort Order",
        field: "sequence",
        filter: "agNumberColumnFilter",
        width: 120,
      },
      {
        headerName: "Is Active",
        field: "isActive",
        width: 130,
      },
      {
        field: "Action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) { },
        },
        minWidth: 200,
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
    };
    this.getMaster();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.menuService.getMenus().subscribe((data: any) => {
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
      var menuId = event.node.data.menuId;

      this.menuService
        .getMenusById(menuId)
        .subscribe((data: any) => {
          if (data.success) {
            //debugger;
            this.master = data.data[0];

            this.master.moduleSelected = {
              id: data.data[0].moduleId,
              name: data.data[0].moduleName,
            };

            this.master.menuTypeSelected = {
              id: data.data[0].menuTypeId,
              name: data.data[0].menuTypeName,
            };

            this.getParentMenu(data.data[0].moduleId);
            this.master.parentSelected = {
              id: data.data[0].parentId,
              name: data.data[0].parentName,
            };

            if (data.data[0].isParent == 1) {
              this.showParent = false;
            }
            else {
              this.showParent = true;
            }

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
      this.master.menuId = event.node.data.menuId;
      this.menuService
        .deleteMenus(this.master)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(this.commonService.deletedmsg, "Message");
            this.getMenus();
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
  /////////////////////////////

  public getMenuType() {
    this.comboService.getMenuType().subscribe((returns: any) => {
      this.menuTypeItems = returns.data.map((val) => ({
        id: val.menuTypeId,
        name: val.menuTypeName,
      }));
    });
  }

  public getModule() {
    this.comboService.getModule().subscribe((returns: any) => {
      this.moduleItems = returns.data.map((val) => ({
        id: val.moduleId,
        name: val.moduleName,
      }));
    });
  }

  public getParentMenu(moduleId) {
    this.comboService.getParentMenu(moduleId).subscribe((returns: any) => {
      this.parentItems = returns.data.map((val) => ({
        id: val.menuId,
        name: val.menuName,
      }));
    });
  }


}
