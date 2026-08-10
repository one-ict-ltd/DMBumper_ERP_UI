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
import { LedgerService } from "app/services/ledger.service";

@Component({
  selector: 'ngx-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit {

  master: {
    ledgerId: number;
    accountCode: string;
    accountName: string;
    aliasName: string;
    haveSubledger: number;
    isActive: number;
    haveCostCentre: number;
    accountNatureId: number;
    accountNatureSelected: {};
    accountGroupId: number;
    accountGroupSelected: {};
    ledgerTypeId: number;
    ledgerTypeSelected: {};
    currencyId: number;
    currencySelected: {};
    companyId: number;
    companySelected: {};
    sbuId: number;
    sbuSelected: {};
    countData: number;
    noteId: number;
    noteSelected: {};
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

  public pageNavigation = "Ledger";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
      this.disabled = false;
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
      ledgerId: 0,
      accountCode: "",
      accountName: "",
      aliasName: "",
      haveSubledger: 0,
      isActive: 1,
      haveCostCentre: 0,
      accountNatureId: null,
      accountNatureSelected: null,
      accountGroupId: null,
      accountGroupSelected: null,
      ledgerTypeId: null,
      ledgerTypeSelected: null,
      currencyId: null,
      currencySelected: null,
      companyId: null,
      companySelected: null,
      sbuId: null,
      sbuSelected: null,
      countData: 0,
      noteId: null,
      noteSelected: null
    };
  }

  public groupNatureItems = [];
  public accountGroupItems = [];
  public ledgerTypeItems = [];
  public currencyItems = [];
  public companyItems = [];
  public sbuItems = [];

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
    this.ledgerService.getDuplicateLedger(this.master.ledgerId, this.master.accountName).subscribe((returns: any) => {
      //debugger;
      this.master.countData = returns.data[0].countData;
    });
  }

  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.accountGroupId == 0 || this.master.accountGroupId == null) {
      this.toastrService.danger("Please select account group", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.accountName == '' || this.master.accountName == null) {
      this.toastrService.danger("Please insert ledger name", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.ledgerTypeId == 0 || this.master.ledgerTypeId == null) {
      this.toastrService.danger("Please select ledger type", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.countData != 0) {
      this.toastrService.danger("Duplicate ledger name", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.noteId == 0 || this.master.noteId == null) {
      this.toastrService.danger("Please select Note Master", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    this.ledgerService.saveLedgers(this.master).subscribe((returns: any) => {
      //debugger;
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.show = true;
        //////////////Grid Refresh ///////////////////
        this.ledgerService.getLedger().subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
        });
        //////////////Grid Refresh ///////////////////
      }
      else {
        this.show = false;
        this.commonService.valueSet("create");
        this.toastrService.danger(this.commonService.failedmsg, "Message");
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
    private ledgerService: LedgerService,
    private comboService: CommoncomboService
  ) {
    this.commonService.valueSet('showlist');
    this.getCompany();
    this.getDdlGroupNatureData();
    this.getDdlLedgertypeData();
    this.getDdlCurrencyData();


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
        headerName: "Ledger Code",
        field: "accountCode",
        filter: "agTextColumnFilter",
        width: 130,
      },
      {
        headerName: "Ledger Name",
        field: "accountName",
        filter: "agTextColumnFilter",
        width: 350,
      },
      {
        headerName: "Ledger Type",
        field: "ledgerTypeName",
        filter: "agTextColumnFilter",
        width: 140,
      },
      {
        headerName: "Account Group",
        field: "groupName",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Group Nature",
        field: "natureName",
        filter: "agTextColumnFilter",
        width: 140,
      },
      {
        headerName: "Closing Balance",
        field: "amount",
        filter: "agNumberColumnFilter",
        valueFormatter: (params) => this.currencyFormatter(params.data.amount),
        type: "rightAligned",
        width: 150,
      },
      {
        headerName: "Is Active?",
        field: "isActive",
        width: 150,
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
    //debugger;
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.ledgerService.getLedger().subscribe((data: any) => {
      //debugger;
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }

  onCheckboxChange(e) {

    if (e.target.checked) {

      //alert('1 value checked');
      this.master.haveSubledger = 1;

    } else {

      //alert('0 value un-checked');
      this.master.haveSubledger = 0;
    }

  }
  onCheckboxChangeC(e) {

    if (e.target.checked) {

      //alert('1 value checked');
      this.master.haveCostCentre = 1;

    } else {

      //alert('0 value un-checked');
      this.master.haveCostCentre = 0;
    }

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
      var ledgerId = event.node.data.ledgerId;

      this.ledgerService.getLedgerById(ledgerId).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];
          this.getDdlAccountGroupData(data.data[0].accountNatureId);
          this.getNoteItems();

          this.master.accountNatureSelected = {
            id: data.data[0].accountNatureId,
            name: data.data[0].natureName,
          };

          //this.getDdlAccountGroupData(data.data[0].accountNatureId);
          this.master.accountGroupSelected = {
            id: data.data[0].accountGroupId,
            name: data.data[0].groupName,
          };

          this.master.companySelected = {
            id: data.data[0].companyId,
            name: data.data[0].companyName,
          };

          this.getSBU(data.data[0].companyId);
          this.master.sbuSelected = {
            id: data.data[0].sbuId,
            name: data.data[0].sbuName,
          };

          this.master.currencySelected = {
            id: data.data[0].currencyId,
            name: data.data[0].currencyName,
          };

          this.master.ledgerTypeSelected = {
            id: data.data[0].ledgerTypeId,
            name: data.data[0].ledgerTypeName,
          };

          this.master.noteId = data.data[0].noteMasterId;
          this.master.noteSelected = {
            id: data.data[0].noteMasterId,
            name: data.data[0].noteName,
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
      //debugger;
      this.master.ledgerId = event.node.data.ledgerId;

      this.ledgerService.deleteLedgers(this.master).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.ledgerService.getLedger().subscribe((data: any) => {
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

  public getDdlGroupNatureData() {
    this.comboService.getGroupNature().subscribe((returns: any) => {
      this.groupNatureItems = returns.data.map((val) => ({
        id: val.groupNatureId,
        name: val.natureName,
      }));
    });
  }

  public getDdlAccountGroupData(groupNatureId) {
    this.master.accountGroupSelected = null;
    this.comboService.getAccountGroupByNature(groupNatureId).subscribe((returns: any) => {
      this.accountGroupItems = returns.data.map((val) => ({
        id: val.accountGroupId,
        name: val.groupName,
      }));
    });
  }

  public getDdlLedgertypeData() {
    this.comboService.getLedgertype().subscribe((returns: any) => {
      this.ledgerTypeItems = returns.data.map((val) => ({
        id: val.ledgerTypeId,
        name: val.ledgerTypeName,
      }));
    });
  }

  public getDdlCurrencyData() {
    this.comboService.getCurrency().subscribe((returns: any) => {
      this.currencyItems = returns.data.map((val) => ({
        id: val.currencyId,
        name: val.currencyName,
      }));
    });
  }

  public getCompany() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyItems = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  public getSBU(companyId) {
    this.master.sbuSelected = null;
    this.comboService.getSbuForAccounting(companyId).subscribe((returns: any) => {
      this.sbuItems = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }

  public GetAutoLedgerCode(accountGroupId) {
    this.ledgerService.GetAutoLedgerCode(accountGroupId).subscribe((returns: any) => {
      if (returns.success) {
        this.master.accountCode = returns.data[0].accountCode;
      }
    });
  }
  noteItems = []
  public getNoteItems() {
    debugger
    console.log(this.master.accountNatureId);
    if (this.master.accountNatureId == 1 || this.master.accountNatureId == 2) {
      this.comboService.getNoteMasterNew("BS").subscribe((returns: any) => {
        this.noteItems = returns.data.map((val) => ({
          id: val.id,
          name: val.name,
        }));
      });
    }
    else {
      this.comboService.getNoteMasterNew("IST").subscribe((returns: any) => {
        this.noteItems = returns.data.map((val) => ({
          id: val.id,
          name: val.name,
        }));
      });
    }
    console.log(this.noteItems);
  }

}
