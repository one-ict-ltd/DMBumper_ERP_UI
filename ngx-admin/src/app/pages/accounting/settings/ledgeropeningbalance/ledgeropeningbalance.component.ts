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
import { LedgeropeningbalanceService } from "app/services/ledgeropeningbalance.service";

@Component({
  selector: "ngx-ledgeropeningbalance",
  templateUrl: "./ledgeropeningbalance.component.html",
  styleUrls: ["./ledgeropeningbalance.component.scss"],
})
export class LedgeropeningbalanceComponent implements OnInit {
  master: {
    openingBalanceId: number;
    balanceUpToShow: Date;
    balanceUpTo: string;
    amount: number;
    isActive: number;
    description: string;

    ledgerId: number;
    ledgerSelected: {};
    partyId: number;
    partySelected: {};
    transactionModeId: number;
    transactionModeSelected: {};
    companyId: number;
    companySelected: {};
    sbuId: number;
    sbuSelected: {};
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

  public pageNavigation = "Ledger Closing Balance";
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
      openingBalanceId: 0,
      balanceUpToShow: new Date(),
      balanceUpTo:
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
      amount: 0,
      isActive: 1,
      description: "",

      ledgerId: 0,
      ledgerSelected: null,
      partyId: 0,
      partySelected: null,
      transactionModeId: 0,
      transactionModeSelected: null,
      companyId: 0,
      companySelected: null,
      sbuId: 0,
      sbuSelected: null,
      countData: 0,
    };
  }

  public ledgerItems = [];
  public partyItems = [];
  public transactionModeItems = [];
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

  public getActualDate(event: any) {
    //debugger;
    var dateCon = event.toLocaleDateString() + " " + event.toLocaleTimeString();
    if (dateCon != "") {
      this.master.balanceUpTo = dateCon;
    }
  }

  public getDuplicate() {
    this.ledgeropeningbalanceService
      .getDuplicateOpeningBalance(this.master.openingBalanceId, this.master.ledgerId, this.master.partyId)
      .subscribe((returns: any) => {
        this.master.countData = returns.data[0].countData;
      });
  }

  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.companyId == 0 || this.master.companyId == null) {
      this.toastrService.danger("Please select company", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.sbuId == 0 || this.master.sbuId == null) {
      this.toastrService.danger("Please select sbu", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.ledgerId == 0 || this.master.ledgerId == null) {
      this.toastrService.danger("Please select ledger", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.balanceUpTo == null) {
      this.toastrService.danger("Please insert date", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.amount == 0 || this.master.amount == null) {
      this.toastrService.danger("Please insert amount", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (
      this.master.transactionModeId == 0 ||
      this.master.transactionModeId == null
    ) {
      this.toastrService.danger("Please select transaction mode", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.countData != 0) {
      this.toastrService.danger("Duplicate ledger", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    this.ledgeropeningbalanceService
      .saveOpeningBalance(this.master)
      .subscribe((returns: any) => {
        //debugger;
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
          this.show = true;
          //////////////Grid Refresh ///////////////////
          this.ledgeropeningbalanceService
            .getOpeningBalance()
            .subscribe((data: any) => {
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
    private ledgeropeningbalanceService: LedgeropeningbalanceService,
    private comboService: CommoncomboService
  ) {
    this.commonService.valueSet("showlist");
    this.getCompany();
    this.getDdlParty();
    this.getDdlTransactionMode();
    // this.master.balanceUpToShow.datepicker({ dateFormat: "dd-M-yy", showAnim: "scale", changeMonth: true, changeYear: true, yearRange: "2010:2050" }).datepicker("setDate", new Date());

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
        headerName: "Group Name",
        field: "groupName",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Ledger Name",
        field: "accountName",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Amount",
        field: "amount",
        filter: "agNumberColumnFilter",
        valueFormatter: (params) => this.currencyFormatter(params.data.amount),
        type: "rightAligned",
        width: 130,
      },
      {
        headerName: "Trn. Mode",
        field: "modeName",
        filter: "agTextColumnFilter",
        width: 120,
      },
      {
        headerName: "Balance UpTo",
        field: "balanceUpTo",
        filter: "agTextColumnFilter",
        width: 135,
        // filter: 'agDateColumnFilter',
        // editable: true,
        // cellRenderer: (data) => {
        //   return data ? (new Date(data.value)).toLocaleDateString('en-GB') : '';
        // },
      },
      {
        headerName: "Party Name",
        field: "partyName",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Description",
        field: "description",
        filter: "agTextColumnFilter",
        width: 200,
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
    this.ledgeropeningbalanceService
      .getOpeningBalance()
      .subscribe((data: any) => {
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
      var openingBalanceId = event.node.data.openingBalanceId;

      this.ledgeropeningbalanceService
        .getOpeningBalanceById(openingBalanceId)
        .subscribe((data: any) => {
          if (data.success) {
            //debugger;
            this.master = data.data[0];

            this.master.partySelected = {
              id: data.data[0].partyId,
              name: data.data[0].partyName,
            };

            this.master.transactionModeSelected = {
              id: data.data[0].transactionModeId,
              name: data.data[0].modeName,
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

            this.getDdlLedgers();

            this.master.ledgerSelected = {
              id: data.data[0].ledgerId,
              name: data.data[0].accountName,
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
      this.master.openingBalanceId = event.node.data.openingBalanceId;

      this.ledgeropeningbalanceService
        .deleteOpeningBalance(this.master)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(
              this.commonService.deletedmsg,
              "Message"
            );

            //////////////Grid Refresh ///////////////////
            this.ledgeropeningbalanceService
              .getOpeningBalance()
              .subscribe((data: any) => {
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

  public getDdlLedgers() {
    this.master.ledgerSelected = null;
    this.ledgerItems = null;
    this.comboService
      .getLedgersForNoteDetails(
        this.master.companyId,
        this.master.sbuId,
        0,
        0,
        0
      )
      .subscribe((returns: any) => {
        this.ledgerItems = returns.data.map((val) => ({
          id: val.ledgerId,
          name: val.accountName,
        }));
      });
  }

  public getDdlParty() {
    this.comboService.getParty().subscribe((returns: any) => {
      this.partyItems = returns.data.map((val) => ({
        id: val.partyId,
        name: val.partyName,
      }));
    });
  }

  public getDdlTransactionMode() {
    this.comboService.getTransactionMode().subscribe((returns: any) => {
      this.transactionModeItems = returns.data.map((val) => ({
        id: val.transactionModeId,
        name: val.modeName,
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
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.sbuItems = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }
}
