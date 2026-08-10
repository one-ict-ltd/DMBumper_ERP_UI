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
import { ChequebookService } from "app/services/transaction/chequebook.service";
import { ModulepermissionService } from "app/services/erpsetting/modulepermission.service";
import { ModuleService } from "app/services/erpsetting/module.service";
import { MenupermissionService } from "app/services/erpsetting/menupermission.service";
import { UsergroupService } from "app/services/erpsetting/usergroup.service";

@Component({
  selector: 'ngx-userwiseledger',
  templateUrl: './userwiseledger.component.html',
  styleUrls: ['./userwiseledger.component.scss']
})
export class UserwiseledgerComponent implements OnInit {

  master: {
    menuPermissionId: number;
    menuId: number;
    effectiveDate: Date;
    enableView: number;
    enableInsert: number;
    enableUpdate: number;
    enableDelete: number;
    isActive: number;

    ClassId: number;
    ClassSelected: {};
    groupId: number;
    groupSelected: {};
    employeeId: number;
    employeeSelected: {};
    subGroupId: number;
    subGroupSelected: {};
    subSubGroupId: number;
    subSubGroupSelected: {};

    lstModel: any[];
    index: number;

  };
  details: any;
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

  public pageNavigation = "User Wise Ledger Access";
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
      menuPermissionId: 0,
      menuId: 0,
      effectiveDate: new Date(),
      enableView: 0,
      enableInsert: 0,
      enableUpdate: 0,
      enableDelete: 0,
      isActive: 1,

      ClassId: 0,
      ClassSelected: null,
      groupId: 0,
      groupSelected: null,
      employeeId: 0,
      employeeSelected: null,
      subGroupId: 0,
      subGroupSelected: null,
      subSubGroupId: 0,
      subSubGroupSelected: null,

      lstModel: [],
      index: -1,

    };
    this.getDdlGroupNatureData();
    this.getEmployees();
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
  public companiesItems = [];
  public moduleItems = [];
  public userGroupItems = [];
  public employeeItems = [];

  public getCompany() {
    //debugger;
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companiesItems = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  accountNatureId: 0;
  groupNatureItems = [];
  accountNatureSelected = {};
  public getDdlGroupNatureData() {
    this.comboService.getGroupNature().subscribe((returns: any) => {
      //console.log(returns.data);
      this.groupNatureItems = returns.data.map((val) => ({
        id: val.groupNatureId,
        name: val.natureName,
      }));
    });
  }

  accountGroupId: 0;
  accountGroupItems = [];
  accountGroupSelected = {};
  public getDdlAccountGroupData(accountNatureId) {
    this.accountGroupSelected = {};
    this.comboService.GetAccountGroupSubGroup(accountNatureId, 0).subscribe((returns: any) => {
      this.accountGroupItems = returns.data.map((val) => ({
        id: val.accountGroupId,
        name: val.groupName,
      }));
    });
  }

  accountSubGroupId: 0;
  accountSubGroupItems = [];
  accountSubGroupSelected = {};
  public getDdlAccountSubGroupData(accountGroupId) {
    this.accountSubGroupSelected = {};
    this.comboService.GetAccountGroupSubGroup(0, accountGroupId).subscribe((returns: any) => {
      this.accountSubGroupItems = returns.data.map((val) => ({
        id: val.accountGroupId,
        name: val.groupName,
      }));
    });
  }

  accountSubSubGroupId: 0;
  accountSubSubGroupItems = [];
  accountSubSubGroupSelected = {};
  public getDdlAccountSubSubGroupData(accountGroupId) {
    this.accountSubSubGroupSelected = {};
    this.comboService.GetAccountGroupSubGroup(0, accountGroupId).subscribe((returns: any) => {
      this.accountSubSubGroupItems = returns.data.map((val) => ({
        id: val.accountGroupId,
        name: val.groupName,
      }));
    });
  }

  public getEmployees() {
    this.master.employeeSelected = null;
    this.employeeItems = null;
    this.comboService.getEmployee(1, 0).subscribe((returns: any) => {
      this.employeeItems = returns.data.map((val) => ({
        id: val.employeeId,
        name: val.fullName,
      }));
    });
  }

  public getUserGroupWiseLedger(accountGroupId) {
    //debugger;
    this.master.lstModel = null;
    this.accountSubGroupId = accountGroupId;
    this.comboService.AccSpGetAccountLedgerAccessByUser(0, accountGroupId, this.master.employeeId).subscribe((returns: any) => {
      this.master.lstModel = returns.data;
    });
  }
  accountClassId: 0;
  public getUserClassWiseLedger(classID) {
    //debugger;
    this.master.lstModel = null;
    this.accountClassId = classID;
    this.comboService.AccSpGetAccountLedgerAccessByUser(this.accountClassId, this.accountSubGroupId, this.master.employeeId).subscribe((returns: any) => {
      this.master.lstModel = returns.data;
    });
  }

  public getUserEmployeeWiseLedger() {
    //debugger;
    this.master.lstModel = null;
    this.comboService.AccSpGetAccountLedgerAccessByUser(0, 0, this.master.employeeId).subscribe((returns: any) => {
      this.master.lstModel = returns.data;
    });
  }

  private save() {
    //debugger;
    var button = this.commonService.buttonClicked;
    this.usergroupService.saveUserWiseLedger(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        //////////////Grid Refresh ///////////////////
        this.comboService.AccSpGetAccountUserWiseLedger(0).subscribe((data: any) => {
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
  public accountNumber = "";
  public chequeDate = "";
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  constructor(
    private router: Router,
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private modalService: ModalService,
    private comboService: CommoncomboService,
    private menupermissionService: MenupermissionService,
    private modulepermissionService: ModulepermissionService,
    private moduleService: ModuleService,
    private usergroupService: UsergroupService
  ) {

    this.getCompany();

    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 70,
      }, /// Dont Change
      // {
      //   headerName: "Id",
      //   field: "menuPermissionId",
      //   filter: "agNumberColumnFilter",
      //   editable: false,
      //   width: 80,
      // },
      {
        headerName: "Employee Name",
        field: "fullName",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Employee Code",
        field: "employeeNo",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Ledger Name",
        field: "accountName",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Ledger Code",
        field: "accountCode",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Group Name",
        field: "groupName",
        filter: "agTextColumnFilter",
        width: 250,
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
      btnCellRenderer: BtnCellRenderer,
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
    this.comboService.AccSpGetAccountUserWiseLedger(0).subscribe((data: any) => {
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


  isCheckedAll: boolean = true;
  ToggleSelectUnSelect() {
    this.master.lstModel.forEach(element => {
      element.isActive = this.isCheckedAll;
    });
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

      var companyId = event.node.data.companyId;
      var moduleId = event.node.data.moduleId;
      var userGroupId = event.node.data.userGroupId;
      var employeeId = event.node.data.employeeId;

      this.menupermissionService.getMenuPermissionById(companyId, moduleId, userGroupId, employeeId, 0).subscribe((data: any) => {
        //debugger;
        if (data.success) {
          //debugger;
          this.master = data.data[0];

          this.getEmployees();

          this.master.employeeSelected = {
            id: data.data[0].employeeId,
            name: data.data[0].fullName,
          };

          this.menupermissionService.getMenuPermissionById(companyId, moduleId, userGroupId, employeeId, 0).subscribe((data: any) => {
            //debugger;
            if (data.success) {
              this.master.lstModel = data.data;
              console.log(this.master.lstModel);
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
      this.master.menuPermissionId = event.node.data.menuPermissionId;
      this.menupermissionService.deleteMenuPermission(this.master).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");
          //////////////Grid Refresh ///////////////////
          this.menupermissionService.getMenuPermission().subscribe((data: any) => {
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