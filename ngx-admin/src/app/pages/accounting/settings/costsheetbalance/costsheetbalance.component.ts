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
import { CostsheetheadService } from "app/services/accounting/costsheethead.service";
import { CostsheetAmountService } from "app/services/accounting/costsheet-amount.service";

@Component({
  selector: 'ngx-costsheetbalance',
  templateUrl: './costsheetbalance.component.html',
  styleUrls: ['./costsheetbalance.component.scss']
})
export class CostsheetbalanceComponent implements OnInit {

  master: {
    costSheetHeadId: number;
    costHeadName: string;
    description: string;
    sortOrder: number;
    isActive: number;
    parentHeadId: number;
    parentHeadSelected: {};

    costSheetHeadAmountId: number;
    formulaTypeId: number;
    formulaTypeSelected: {};
    ledgerId: number;
    ledgerSelected: {};

    isDetailsUpdated: number;

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

  public pageNavigation = "Cost Head Set";
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
      costSheetHeadId: 0,
      costHeadName: "",
      description: "",
      sortOrder: 0,
      isActive: 1,
      parentHeadId: 0,
      parentHeadSelected: null,

      costSheetHeadAmountId: 0,
      formulaTypeId: 0,
      formulaTypeSelected: null,
      ledgerId: 0,
      ledgerSelected: null,

      isDetailsUpdated: 0,

      countData: 0,
      lstDetails: [],
      index: -1,
    };
  }

  public parentHeadItems = [];
  public costHeadItems = [];
  public formulaTypeItems = [];
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
    if (this.master.ledgerId == 0) {
      this.toastrService.danger("Please select ledger", "Message");
      return;
    }

    var RowCount = this.master.lstDetails.length;
    for (let i = 0; i < RowCount; i++) {
      var _ledgerId = this.master.lstDetails[i].ledgerId;
      if (_ledgerId == this.master.ledgerId) {
        this.toastrService.danger("You have already added this ledger", "Message");
        return;
      }
    }

    var ledgerId = null;
    var accountName = '';
    var formulaTypeId = null;
    var formulaName = '';

    if (this.master.ledgerSelected != null) {
      ledgerId = this.master.ledgerSelected['id'];
      accountName = this.master.ledgerSelected['name']
    }
    if (this.master.formulaTypeSelected != null) {
      formulaTypeId = this.master.formulaTypeSelected['id'];
      formulaName = this.master.formulaTypeSelected['name'];
    }

    let detail = {
      ledgerId: ledgerId,//this.master.ledgerId,
      accountName: accountName, //this.master.ledgerSelected['name'],
      formulaTypeId: formulaTypeId,//this.master.formulaTypeId,
      formulaName: formulaName//this.master.formulaTypeSelected['name'],
    };
    //this.master.lstDetails.push(detail);
    var indexu = this.master.lstDetails.findIndex(
      (x) =>
        x.costSheetHeadAmountId == this.master.costSheetHeadAmountId
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

    this.selectedRow = this.master.lstDetails[index];
    this.master.lstDetails.splice(index, 1);

    var index1 = this.master.lstDetails.findIndex(x => x.ledgerId == this.master.ledgerId);
    if (index1 > -1) {
      this.master.lstDetails.splice(index1, 1);
    }
    this.master.isDetailsUpdated = 1;
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }

  public editDetail(index: any) {
    debugger;
    this.master.index = index;
    this.selectedRow = this.master.lstDetails[index];

    this.master.costSheetHeadAmountId = this.selectedRow.costSheetHeadAmountId;

    this.master.formulaTypeSelected = {
      id: this.selectedRow.formulaTypeId,
      name: this.selectedRow.formulaName,
    };

    this.master.ledgerSelected = {
      id: this.selectedRow.ledgerId,
      name: this.selectedRow.accountName,
    };
    this.master.isDetailsUpdated = 1;
  }

  public isDetailsUpdated(index: any) {
    this.master.isDetailsUpdated = 1;
  }

  public getDuplicate() {
    this.costsheetAmountService.GetDuplicateCostSheetHeadAmount(this.master.costSheetHeadAmountId, this.master.costSheetHeadId, this.master.ledgerId)
      .subscribe((returns: any) => {
        this.master.countData = returns.data[0].countData;
      });
  }

  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.parentHeadId == 0 || this.master.parentHeadId == null) {
      this.toastrService.danger("Please select parent head", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.costHeadName == '' || this.master.costHeadName == null) {
      this.toastrService.danger("Please insert cost head name", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    // else if (this.master.countData != 0) {
    //   this.toastrService.danger("Duplicate head", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // } 
    else if (this.master.lstDetails.length == 0 || this.master.lstDetails == null) {
      this.toastrService.danger("Please select ledger", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    this.costsheetAmountService.SaveCostSheetHead(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.show = true;
        //////////////Grid Refresh ///////////////////
        this.costsheetAmountService.GetCostSheetHeadAmountById(0, 0).subscribe((data: any) => {
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
    private costsheetheadService: CostsheetheadService,
    private costsheetAmountService: CostsheetAmountService,
    private comboService: CommoncomboService
  ) {
    this.commonService.valueSet("showlist");

    this.getDdlParentHead();
    this.getDdlFormulaType();
    this.getLedger();

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
        headerName: "Parent Head",
        field: "parentHeadName",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Cost Head",
        field: "costHeadName",
        filter: "agTextColumnFilter",
        width: 300,
      },
      {
        headerName: "Description",
        field: "description",
        filter: "agTextColumnFilter",
        width: 135,
      },
      {
        headerName: "Sorting",
        field: "sortOrder",
        filter: "agNumberColumnFilter",
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
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.costsheetAmountService.GetCostSheetHeadById(0, 0).subscribe((data: any) => {
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
      var costSheetHeadId = event.node.data.costSheetHeadId;

      this.costsheetAmountService.GetCostSheetHeadById(costSheetHeadId, 0).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];

          this.master.parentHeadSelected = {
            id: data.data[0].parentHeadId,
            name: data.data[0].parentHeadName,
          };

          this.getDuplicate();

          this.costsheetAmountService.GetCostSheetHeadAmountById(0, costSheetHeadId).subscribe((data: any) => {
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
      this.master.costSheetHeadId = event.node.data.costSheetHeadId;
      this.costsheetAmountService.DeleteCostSheetHeadById(this.master.costSheetHeadId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(
              this.commonService.deletedmsg,
              "Message"
            );

            //////////////Grid Refresh ///////////////////
            this.costsheetAmountService.GetCostSheetHeadById(0, 0).subscribe((data: any) => {
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

  public getDdlParentHead() {
    this.costsheetheadService.GetCostSheetParentHead().subscribe((returns: any) => {
      this.parentHeadItems = returns.data.map((val) => ({
        id: val.parentHeadId,
        name: val.parentHeadName,
      }));
    });
  }

  public getDdlCostHeadByParent() {
    this.costsheetAmountService.GetCostSheetHeadByParentId(this.master.parentHeadId).subscribe((returns: any) => {
      this.costHeadItems = returns.data.map((val) => ({
        id: val.costSheetHeadId,
        name: val.costHeadName,
      }));
    });
  }

  public getDdlFormulaType() {
    this.costsheetAmountService.GetFormulaType().subscribe((returns: any) => {
      this.formulaTypeItems = returns.data.map((val) => ({
        id: val.formulaTypeId,
        name: val.formulaName,
      }));
    });
  }

  public getLedger() {
    this.comboService.getLedgersForNoteDetails(1, 1, 0, 0, 0).subscribe((returns: any) => {
      this.ledgerItems = returns.data.map((val) => ({
        id: val.ledgerId,
        name: val.accountName,
      }));
    });
  }

}
