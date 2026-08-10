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


interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-chequebook',
  templateUrl: './chequebook.component.html',
  styleUrls: ['./chequebook.component.scss']
})
export class ChequebookComponent implements OnInit {

  master: {
    chequeBookMasterId: number;
    chequeBookId: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    chequeNumberCurrent: number;
    chequeNumberStarting: number;
    chequeDate: Date;
    chequeAmount: number;

    isAccountPayee: number;
    isBearer: number;
    isNonNegotiable: number;
    isPayableOndateOnly: number;
    isVoid: number;
    isPrinted: number;
    isCleared: number;
    isWithoutDate: number;
    isActive: number;

    companyId: number;
    sbuId: number;
    companiesSelected: {};
    sbusSelected: {};

    lstdetailVoucher: any[];
    lstdetailCheque: any[];
    index: number;
    index2: number;
  };
  details: any;
  disabled: boolean = false;
  config: NbToastrConfig;
  index = 1;
  index2 = 1;
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

  public pageNavigation = "Cheque Book";
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
      chequeBookMasterId: 0,
      chequeBookId: "",
      bankName: "",
      accountName: "",
      accountNumber: "",
      chequeNumberCurrent: 0,
      chequeNumberStarting: 0,
      chequeDate: new Date(),
      chequeAmount: 0,

      isAccountPayee: 0,
      isBearer: 0,
      isNonNegotiable: 0,
      isPayableOndateOnly: 0,
      isVoid: 0,
      isPrinted: 0,
      isCleared: 0,
      isWithoutDate: 0,
      isActive: 1,

      companyId: 0,
      sbuId: 0,
      companiesSelected: null,
      sbusSelected: null,

      lstdetailVoucher: [],
      lstdetailCheque: [],
      index: -1,
      index2: -1,
    };
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
  public companies = [];
  public sbus = [];

  public getDropdownData() {
    //debugger;
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companies = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  public getSBU(companyId) {
    //debugger;
    this.master.sbusSelected = null;
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.sbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${formatted}`;
  }

  private save() {
    //debugger;
    var button = this.commonService.buttonClicked;
    this.chequebookService.saveChequeBookMaster(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        //////////////Grid Refresh ///////////////////
        this.chequebookService.getChequeBookMaster().subscribe((data: any) => {
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

  private getVoucherForCreateCheque() {
    this.chequebookService.getVoucherForCreateCheque(this.master.companyId, this.master.sbuId).subscribe((data: any) => {
      if (data.success) {
        //debugger;
        this.master.lstdetailVoucher = data.data;

      }
    });
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
    private chequebookService: ChequebookService
  ) {

    this.getDropdownData();

    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 50,
      }, /// Dont Change
      {
        headerName: "Id",
        field: "chequeBookMasterId",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 80,
      },
      {
        headerName: "Cheque BookId",
        field: "chequeBookId",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Account Number",
        field: "accountNumber",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Account Name",
        field: "accountName",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Cheque Date",
        field: "chequeDate",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Amount",
        field: "chequeAmount",
        filter: "agNumberColumnFilter",
        valueFormatter: params => this.currencyFormatter(params.data.chequeAmount),
        type: 'rightAligned',
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
          clicked: function (field: any) {
            //localStorage.setItem("Token", user.auth_token);
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
    this.chequebookService.getChequeBookMaster().subscribe((data: any) => {
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

  private agReport(event) {
    this.toastrService.info("Print button clicked", "Message");
  }

  public refesh() {
    this.master.isNonNegotiable = 0;
    this.master.isBearer = 0;
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

      var chequeBookMasterId = event.node.data.chequeBookMasterId;
      this.getSBU(event.node.data.companyId);


      this.chequebookService.getChequeBookMasterById(chequeBookMasterId).subscribe((data: any) => {
        //debugger;
        if (data.success) {
          //debugger;
          this.master = data.data[0];
          this.master.companiesSelected = {
            id: data.data[0].companyId,
            name: data.data[0].companyName,
          };

          this.master.sbusSelected = {
            id: data.data[0].sbuId,
            name: data.data[0].sbuName,
          };

          this.getVoucherForCreateCheque();

          this.chequebookService.getChequeBookDetailsByMasterId(chequeBookMasterId).subscribe((data: any) => {
            //debugger;
            if (data.success) {
              //debugger;
              this.master.lstdetailCheque = data.data;
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
      this.master.chequeBookMasterId = event.node.data.chequeBookMasterId;
      this.chequebookService.deleteChequeBookMaster(this.master).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");
          //////////////Grid Refresh ///////////////////
          this.chequebookService.getChequeBookMaster().subscribe((data: any) => {
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

  onCheckboxChange(e, voucherDetailsId, voucherNo, voucherDate, accountName, amount) {

    if (e.target.checked) {

      //alert(voucherDetailsId + ', ' + voucherNo + ', ' + voucherDate + ', ' + accountName + ', ' + amount);

      let detail = {
        voucherDetailsId: voucherDetailsId,
        voucherNo: voucherNo,
        voucherDate: voucherDate,
        accountName: accountName,
        amount: amount,
      };

      this.master.lstdetailCheque.push(detail);

    } else {

      //alert(voucherDetailsId + ', ' + voucherNo + ', ' + voucherDate + ', ' + accountName + ', ' + amount + ' is ' + 'unchecked');
      this.deleteDetail(voucherDetailsId);
    }

  }

  public deleteDetail(voucherDetailsId) {
    //debugger;
    this.master.lstdetailCheque.splice(voucherDetailsId[0], 1);
    // const index: number = this.master.lstdetailCheque.indexOf(voucherDetailsId);
    // this.master.lstdetailCheque.splice(index, 1);

    //this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }


}
