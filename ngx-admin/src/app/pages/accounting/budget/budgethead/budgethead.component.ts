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
import { BudgetheadService } from "app/services/budget/budgethead.service";

@Component({
  selector: 'ngx-budgethead',
  templateUrl: './budgethead.component.html',
  styleUrls: ['./budgethead.component.scss']
})
export class BudgetheadComponent implements OnInit {

  master: {
    budgetHeadMasterId: number;
    headCode: string;
    headName: string;
    sortOrder: number;
    isActive: number;

    budgetSubHeadId: number;
    budgetSubHeadSelected: {};
    budgetMainHeadId: number;
    budgetMainHeadSelected: any;
    ledgerId: number;
    ledgerSelected: any;
    companyId: number;
    companySelected: any;
    sbuId: number;
    sbuSelected: any;

    lstdetailBudgetHead: any[];
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
  showtd: boolean = true;

  ngOnInit() {
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Budget Head";
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
      budgetHeadMasterId: 0,
      headCode: "",
      headName: "",
      sortOrder: 0,
      isActive: 1,

      budgetSubHeadId: 0,
      budgetSubHeadSelected: null,
      budgetMainHeadId: 0,
      budgetMainHeadSelected: null,
      ledgerId: 0,
      ledgerSelected: null,
      companyId: 0,
      companySelected: null,
      sbuId: 0,
      sbuSelected: null,

      lstdetailBudgetHead: [],
      index: -1,
    };
  }

  public companyItems = [];
  public sbuItems = [];
  public budgetMainHeadItems = [];
  public budgetSubHeadItems = [];
  public ledgerItems = [];

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
    //debugger;
    if (this.master.ledgerId == 0) {
      this.toastrService.danger("Please select ledger", "Message");
      return;
    }

    var RowCount = this.master.lstdetailBudgetHead.length;
    for (let i = 0; i < RowCount; i++) {
      //debugger;
      var _ledgerId = this.master.lstdetailBudgetHead[i].ledgerId;
      if (_ledgerId == this.master.ledgerId) {
        this.toastrService.danger("You have already added this ledger", "Message");
        return;
      }
    }

    let detail = {
      ledgerId: this.master.ledgerId,
      accountName: this.master.ledgerSelected['name'],
      showtd: true
    };
    this.master.lstdetailBudgetHead.push(detail);
  }

  public deleteDetail(index: any) {
    //debugger;
    this.selectedRow = this.master.lstdetailBudgetHead[index];
    this.master.lstdetailBudgetHead.splice(index, 1);

    var index1 = this.master.lstdetailBudgetHead.findIndex(x => x.ledgerId == this.master.ledgerId);
    if (index1 > -1) {
      this.master.lstdetailBudgetHead.splice(index1, 1);
    }

    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }

  public editDetail(index: any) {
    //debugger;
    this.master.index = index;
    this.selectedRow = this.master.lstdetailBudgetHead[index];
    this.master.ledgerSelected = {
      id: this.selectedRow.ledgerId,
      name: this.selectedRow.accountName,
    };
    this.master.ledgerId = this.selectedRow.ledgerId;
  }

  private save() {
    var button = this.commonService.buttonClicked;
    this.budgetheadService.saveBudgetHead(this.master).subscribe((returns: any) => {
      //debugger;
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        //////////////Grid Refresh ///////////////////
        this.budgetheadService.getBudgetHead().subscribe((data: any) => {
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
    private comboService: CommoncomboService,
    private budgetheadService: BudgetheadService,
  ) {
    this.commonService.valueSet('showlist');
    this.getCompany();


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
        headerName: "Id",
        field: "budgetHeadMasterId",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 100,
      },
      {
        headerName: "Main Head Name",
        field: "mainHeadName",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Sub Head Name",
        field: "subHeadName",
        filter: 'agDateColumnFilter',
        width: 250,
      },
      {
        headerName: "Head Code",
        field: "headCode",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Head Name",
        field: "headName",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Sort Order",
        field: "sortOrder",
        filter: 'agDateColumnFilter',
        width: 120,
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
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${formatted}`;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.budgetheadService.getBudgetHead().subscribe((data: any) => {
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
      var budgetHeadMasterId = event.node.data.budgetHeadMasterId;

      this.budgetheadService.getBudgetHeadById(budgetHeadMasterId).subscribe((data: any) => {
        if (data.success) {
          //debugger;
          this.master = data.data[0];

          this.master.companySelected = {
            id: data.data[0].companyId,
            name: data.data[0].companyName,
          };

          this.getSBU(data.data[0].companyId);

          this.master.sbuSelected = {
            id: data.data[0].sbuId,
            name: data.data[0].sbuName,
          };

          this.getBudgetMainHead();

          this.master.budgetMainHeadSelected = {
            id: data.data[0].budgetMainHeadId,
            name: data.data[0].mainHeadName,
          };

          this.getBudgetSubHead();

          this.master.budgetSubHeadSelected = {
            id: data.data[0].budgetSubHeadId,
            name: data.data[0].subHeadName,
          };

          this.getLedger();

          this.budgetheadService.getBudgetHeadDetailsByMasterId(budgetHeadMasterId).subscribe((data: any) => {
            //debugger;
            if (data.success) {
              this.master.lstdetailBudgetHead = data.data;
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
      //debugger;
      this.master.budgetHeadMasterId = event.node.data.budgetHeadMasterId;

      this.budgetheadService.deleteBudgetHead(this.master).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.budgetheadService.getBudgetHead().subscribe((data: any) => {
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

  public getBudgetMainHead() {
    this.comboService.getBudgetMainHead(this.master.companyId, this.master.sbuId, 0).subscribe((returns: any) => {
      this.budgetMainHeadItems = returns.data.map((val) => ({
        id: val.budgetMainHeadId,
        name: val.mainHeadName,
      }));
    });
  }

  public getBudgetSubHead() {
    this.comboService.getBudgetSubHead(this.master.budgetMainHeadSelected.id, 0).subscribe((returns: any) => {
      this.budgetSubHeadItems = returns.data.map((val) => ({
        id: val.budgetSubHeadId,
        name: val.subHeadName,
      }));
    });
  }

  public getLedger() {
    this.comboService.getLedgersForNoteDetails(this.master.companySelected.id, this.master.sbuSelected.id, 0, 0, 0).subscribe((returns: any) => {
      this.ledgerItems = returns.data.map((val) => ({
        id: val.ledgerId,
        name: val.accountName,
      }));
    });
  }

}
