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
import { NotemasterblsheetService } from "app/services/notemasterblsheet.service";
import { NotedetailsblsheetService } from "app/services/notedetailsblsheet.service";

@Component({
  selector: 'ngx-notedetailsincomestment',
  templateUrl: './notedetailsincomestment.component.html',
  styleUrls: ['./notedetailsincomestment.component.scss']
})
export class NotedetailsincomestmentComponent implements OnInit {

  master: {
    noteDetailsId: number;
    noteType: string;
    sortOrder: number;
    isActive: number;

    companyId: number;
    companySelected: {};
    sbuId: number;
    sbuSelected: {};

    accountNatureId: number;
    accountNatureSelected: {};
    accountGroupId: number;
    accountGroupSelected: {};
    ledgerId: number;
    ledgerSelected: {};

    noteMasterId: number;
    noteMasterSelected: {};
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
      this.description = this.selectedRow.noteNo;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Income Statement Note Details";
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
      // this.show = true;
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
      noteDetailsId: 0,
      noteType: "IST",
      sortOrder: 0,
      isActive: 1,

      companyId: 0,
      companySelected: null,
      sbuId: 0,
      sbuSelected: null,

      accountNatureId: 0,
      accountNatureSelected: null,
      accountGroupId: 0,
      accountGroupSelected: null,
      ledgerId: 0,
      ledgerSelected: null,

      noteMasterId: 0,
      noteMasterSelected: null,
      countData: 0,
    };
  }


  public companyItems = [];
  public sbuItems = [];
  public groupNatureItems = [];
  public accountGroupItems = [];
  public ledgerItems = [];
  public noteMasterItems = [];

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
  public getDuplicate(ledgerId) {
    //debugger;
    this.notedetailsblsheetService.getDuplicateNoteDetail(this.master.noteDetailsId, ledgerId, 'IST').subscribe((returns: any) => {
      //debugger;
      this.master.countData = returns.data[0].countData;
    });
  }

  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.noteMasterId == 0 || this.master.noteMasterId == null) {
      this.toastrService.danger("Please select note master", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.ledgerId == 0 || this.master.ledgerId == null) {
      this.toastrService.danger("Please select ledger", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.countData != 0) {
      this.toastrService.danger("Duplicate ledger", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    this.notedetailsblsheetService.saveNoteDetails(this.master).subscribe((returns: any) => {
      //debugger;
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.show = true;
        //////////////Grid Refresh ///////////////////
        //let type = "IST";
        this.notedetailsblsheetService.getNoteDetails('IST').subscribe((data: any) => {
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
    private notemasterblsheetService: NotemasterblsheetService,
    private notedetailsblsheetService: NotedetailsblsheetService,
    private comboService: CommoncomboService
  ) {

    this.commonService.valueSet('showlist');

    this.getCompany();
    this.getDdlGroupNatureData();

    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 80,
      }, /// Dont Change
      {
        headerName: "Note Type",
        field: "parentNoteName",
        filter: "agTextColumnFilter",
        width: 200,
      },
      {
        headerName: "Note Name",
        field: "noteName",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Ledger Name",
        field: "accountName",
        filter: "agTextColumnFilter",
        width: 400,
      },
      {
        headerName: "Group Name",
        field: "groupName",
        filter: "agTextColumnFilter",
        width: 200,
      },
      // {
      //   headerName: "Sort Order",
      //   field: "sortOrder",
      //   width: 120,
      // },
      {
        headerName: "Is Active?",
        field: "isActive",
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
    //debugger;
  }

  onGridReady(params) {
    let type = "IST";
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.notedetailsblsheetService.getNoteDetails(type).subscribe((data: any) => {
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
      var noteDetailsId = event.node.data.noteDetailsId;

      this.notedetailsblsheetService.getNoteDetailsById(noteDetailsId).subscribe((data: any) => {
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

          this.master.accountNatureSelected = {
            id: data.data[0].groupNatureId,
            name: data.data[0].natureName,
          };

          this.getDdlAccountGroupData(data.data[0].groupNatureId)

          this.master.accountGroupSelected = {
            id: data.data[0].accountGroupId,
            name: data.data[0].groupName,
          };

          this.getDdlLedgers();

          this.master.ledgerSelected = {
            id: data.data[0].ledgerId,
            name: data.data[0].accountName,
          };

          this.getDdlNoteMaster();

          this.master.noteMasterSelected = {
            id: data.data[0].noteMasterId,
            name: data.data[0].noteName,
          };

          this.getDuplicate(data.data[0].ledgerId);

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
      this.master.noteDetailsId = event.node.data.noteDetailsId;

      this.notedetailsblsheetService.deleteNoteDetails(this.master).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.notedetailsblsheetService.getNoteDetails(this.master.noteType).subscribe((data: any) => {
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

  public getDdlLedgers() {
    //debugger;
    this.master.ledgerSelected = null;
    this.ledgerItems = null;
    this.comboService.getLedgersForNoteDetails(this.master.companyId, this.master.sbuId, this.master.accountNatureId, this.master.accountGroupId, 0).subscribe((returns: any) => {
      this.ledgerItems = returns.data.map((val) => ({
        id: val.ledgerId,
        name: val.accountName,
      }));
    });
  }

  public getDdlNoteMaster() {
    this.master.noteMasterSelected = null;
    this.noteMasterItems = null;
    this.comboService.getNoteMaster(this.master.companyId, this.master.sbuId, 0, 'IST').subscribe((returns: any) => {
      this.noteMasterItems = returns.data.map((val) => ({
        id: val.noteMasterId,
        name: val.noteName,
      }));
    });
  }

}
