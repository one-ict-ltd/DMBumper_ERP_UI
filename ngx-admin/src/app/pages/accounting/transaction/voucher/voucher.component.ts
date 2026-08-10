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
import { VoucherService } from "app/services/transaction/voucher.service";
import { LedgerService } from "app/services/ledger.service";
import { ModalService } from "app/services/transaction/modal.service";
import { Router } from "@angular/router";

import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { ElementRef } from "@angular/core";

//import { RptVoucherpreviewComponent } from "../../reports/rpt-voucherpreview/rpt-voucherpreview.component";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: "ngx-voucher",
  templateUrl: "./voucher.component.html",
  styleUrls: ["./voucher.component.scss"],
})
export class VoucherComponent implements OnInit {
  ///////////////////
  //@Output() myEvent = new EventEmitter();
  master: {
    voucherMasterId: number;
    voucherDate: Date;
    voucherNo: string;
    refNo: string;
    voucherTypeId: number;
    remarks: string;
    isPosted: number;
    amount: number;
    voucherAmount: number;
    fundSourceId: number;
    companyId: number;
    sbuId: number;
    isActive: number;
    accountId: number;
    accountName: string;
    particularId: number;
    particularName: string;
    partyId: number;
    partyName: string;
    transactionModeId: number;
    transactionModeName: string;
    ledgerBCBalance: string;
    ledgerOBCBalance: string;
    partyBalance: string;
    natureId: number;
    costCentreId: number;
    costCentreName: string;
    costforAmount: number;
    costAmount: number;
    costAmountBalance: number;
    costAccountId: number;
    costAccountName: string;
    costPartyId: number;
    lstcostfinalmodel: any[];
    lstdetailmodel: any[];
    lstcostmodel: any[];
    lstappmodel: any[];
    companiesSelected: {};
    sbusSelected: {};
    ledgerSelected: {};
    ledgerOBCSelected: {};
    fundSourceSelected: {};
    costCentreSelected: {};
    partySelected: {};
    voucherTypeSelected: {};
    accountSelected: {};
    particularSelected: {};
    transactionModeSelected: {};
    index: number;
    index2: number;
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
  //indexcost=1;
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

  public pageNavigation = "Voucher";
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
      voucherMasterId: 0,
      voucherDate: new Date(),
      voucherNo: "",
      refNo: "",
      voucherTypeId: 0,
      remarks: "",
      isPosted: 1,
      amount: 0,
      voucherAmount: 0,
      fundSourceId: 0,
      companyId: 0,
      sbuId: 0,
      isActive: 1,
      accountId: 0,
      accountName: "",
      particularId: 0,
      particularName: "",
      partyId: 0,
      natureId: 0,
      costCentreId: 0,
      costCentreName: "",
      costforAmount: 0,
      costAmount: 0,
      partyName: "",
      transactionModeId: 0,
      transactionModeName: "",
      ledgerBCBalance: "0",
      ledgerOBCBalance: "0",
      partyBalance: "0",
      costAmountBalance: 0,
      costAccountId: 0,
      costAccountName: "",
      costPartyId: 0,
      lstcostfinalmodel: [],
      lstdetailmodel: [],
      lstcostmodel: [],
      lstappmodel: [],
      companiesSelected: null,
      sbusSelected: null,
      ledgerSelected: null,
      ledgerOBCSelected: null,
      fundSourceSelected: null,
      costCentreSelected: null,
      partySelected: null,
      voucherTypeSelected: null,
      accountSelected: null,
      particularSelected: null,
      transactionModeSelected: null,
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
  public ledgers = [];
  public ledgersOBC = [];
  public fundsources = [];
  public parties = [];
  public costCentres = [];
  public voucherTypes = [];
  public transactionModes = [];
  public voucherNo = "";
  public indexcost = -1;
  public getDropdownData() {
    ////////// Call common service for dropdown data/////////
    //debugger;
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companies = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
      this.master.companiesSelected = {
        id: returns.data[0].companyId,
        name: returns.data[0].companyName,
      };
      //this.master.companyId=1;
      //this.master.companiesSelected="";
    });
    this.comboService.getVoucherType().subscribe((returns: any) => {
      this.voucherTypes = returns.data.map((val) => ({
        id: val.voucherTypeId,
        name: val.voucherTypeName,
      }));
    });
    this.comboService.getTransactionMode().subscribe((returns: any) => {
      console.log(returns);
      this.transactionModes = returns.data.map((val) => ({
        id: val.transactionModeId,
        name: val.modeName,
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
      this.master.sbusSelected = {
        id: returns.data[0].sbuId,
        name: returns.data[0].sbuName,
      };
      this.master.sbuId = returns.data[0].sbuId;
      this.getCostCentre(returns.data[0].sbuId);
    });
  }
  public getLedgerBC() {
    //debugger;
    this.master.accountSelected = null;
    this.ledgers = null;
    this.master.ledgerBCBalance = "0";
    this.master.ledgerOBCBalance = "0";
    this.master.partyBalance = "0";
    this.comboService
      .getLedgersForVoucher(this.master.companyId, this.master.sbuId)
      .subscribe((returns: any) => {
        console.log(returns);
        let res = null;
        if (this.master.voucherTypeId != 1 && this.master.voucherTypeId != 3) {
          this.showaccount = true;
          res = returns.data.filter(
            (it) => it.ledgerTypeId == 1 || it.ledgerTypeId == 2
          );
          console.log(res);
          this.ledgers = res.map((val) => ({
            id: val.ledgerId,
            name: val.accountName + "-(" + val.accountCode + ")",
          }));
        }
      });
  }
  public getLedgerOBC() {
    //debugger;
    this.master.particularSelected = null;
    this.ledgersOBC = null;
    this.master.ledgerBCBalance = "0";
    this.master.ledgerOBCBalance = "0";
    this.master.partyBalance = "0";
    this.comboService
      .getLedgersForVoucher(this.master.companyId, this.master.sbuId)
      .subscribe((returns: any) => {
        console.log(returns);
        let res = null;
        if (this.master.voucherTypeId != 1 && this.master.voucherTypeId != 3) {
          this.showaccount = true;
          res = returns.data.filter(
            (it) => it.ledgerTypeId != 1 && it.ledgerTypeId != 2
          );
          console.log(res);
          this.ledgersOBC = res.map((val) => ({
            id: val.ledgerId,
            name: val.accountName + "-(" + val.accountCode + ")",
          }));
          if (this.master.voucherTypeId == 2) {
            this.master.transactionModeSelected = "DR";
            this.master.transactionModeId = 1;
            this.master.transactionModeName = "DR";
          } else {
            this.master.transactionModeSelected = "CR";
            this.master.transactionModeId = 2;
            this.master.transactionModeName = "CR";
          }
        } else if (this.master.voucherTypeId == 1) {
          this.showaccount = false;
          this.master.transactionModeSelected = "";
          this.master.transactionModeId = 0;
          this.master.transactionModeName = "";
          res = returns.data.filter(
            (it) => it.ledgerTypeId == 1 || it.ledgerTypeId == 2
          );
          console.log(res);
          this.ledgersOBC = res.map((val) => ({
            id: val.ledgerId,
            name: val.accountName + "-(" + val.accountCode + ")",
          }));
        } else {
          this.showaccount = false;
          this.master.transactionModeSelected = "";
          this.master.transactionModeId = 0;
          this.master.transactionModeName = "";
          res = returns.data.filter(
            (it) => it.ledgerTypeId != 1 && it.ledgerTypeId != 2
          );
          console.log(res);
          this.ledgersOBC = res.map((val) => ({
            id: val.ledgerId,
            name: val.accountName + "-(" + val.accountCode + ")",
          }));
        }
      });
  }
  public getFundSource(sbuId) {
    //debugger;
    this.master.fundSourceSelected = null;
    this.fundsources = null;
    this.comboService.getFundSource().subscribe((returns: any) => {
      console.log(returns);
      let res = returns.data.filter((it) => it.sbuId == sbuId);
      console.log(res);
      this.fundsources = res.map((val) => ({
        id: val.fundSourceId,
        name: val.fundSourceName,
      }));
    });
  }
  public getCostCentre(sbuId) {
    //debugger;
    this.master.costCentreSelected = null;
    this.costCentres = null;
    this.comboService.getCostCentre(sbuId).subscribe((returns: any) => {
      this.costCentres = returns.data.map((val) => ({
        id: val.costCentreId,
        name: val.costCentreName,
      }));
    });
  }
  public getParty(sbuId) {
    //debugger;
    this.master.partySelected = null;
    this.parties = null;
    this.comboService.getParty().subscribe((returns: any) => {
      let res = returns.data.filter((it) => it.sbuId == sbuId);
      this.parties = res.map((val) => ({
        id: val.partyId,
        name: val.partyName,
      }));
    });
  }
  public getVoucherNo() {
    //debugger;
    console.log(this.master.voucherDate);
    this.voucherService
      .getVoucherNo(
        this.master.voucherTypeId,
        this.master.voucherDate.toDateString()
      )
      .subscribe((returns: any) => {
        console.log(returns);
        this.master.voucherNo = returns.data[0].voucherNo;
        console.log(this.master.voucherNo);
      });
    console.log(this.master.voucherNo);
  }
  public getLedgerBalance(ledgerId) {
    //debugger;

    this.voucherService
      .getBalanceById(ledgerId, 0)
      .subscribe((returns: any) => {
        console.log(returns);
        this.master.ledgerBCBalance = "0";
        this.master.ledgerBCBalance = this.currencyFormatter(
          returns.data[0].balanceAmount
        );
        console.log(this.master.ledgerBCBalance);
      });
    console.log(this.master.voucherNo);
  }
  public getLedgerBalanceOBC(ledgerId) {
    //debugger;
    this.master.ledgerOBCBalance = "0";
    this.voucherService
      .getBalanceById(ledgerId, 0)
      .subscribe((returns: any) => {
        this.master.ledgerOBCBalance = this.currencyFormatter(
          returns.data[0].balanceAmount
        );
      });
    //debugger;
    this.ledgerService.getLedgerById(ledgerId).subscribe((returns: any) => {
      this.master.natureId = returns.data[0].accountNatureId;
      if (returns.data[0].haveSubledger == 1) {
        this.showparty = true;
      } else {
        this.showparty = false;
        this.master.partyId = 0;
      }
    });
  }

  public getLedgerBalancePBC() {
    this.master.partyBalance = "0";
    if (this.master.particularId != 0 && this.master.partyId != 0) {
      this.voucherService
        .getBalanceById(this.master.particularId, this.master.partyId)
        .subscribe((returns: any) => {
          this.master.partyBalance = this.currencyFormatter(
            returns.data[0].balanceAmount
          );
        });
    }
  }
  public currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }
  private getClient() {
    this.voucherService.getVoucher(0, 0).subscribe((data: any) => {
      if (data.success) {
        //this.master.lstdetailmodel = data.lstdetailmodel
        this.master = data.master[0];
      }
    });
  }
  private save() {
    var totalDR: number = 0.0;
    var totalCR: number = 0.0;
    this.master.lstdetailmodel
      .filter((item) => item.transactionModeId === 1)
      .forEach((a) => (totalDR += parseFloat(a.amount)));
    this.master.lstdetailmodel
      .filter((item) => item.transactionModeId === 2)
      .forEach((a) => (totalCR += parseFloat(a.amount)));
    if (totalCR != totalDR) {
      this.toastrService.danger("DR & CR are not same", "Message");
      return;
    }
    var button = this.commonService.buttonClicked;
    this.voucherService.saveVoucher(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        //////////////Grid Refresh ///////////////////
        this.voucherService.getVoucher(0, 0).subscribe((data: any) => {
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
  public pageNavigationreport = "Voucher Preview";
  public tableHeader = [
    "#",
    "Account Name",
    "Party Name",
    "Cost Centre Name",
    "Debit (Tk)",
    "Credit (Tk)",
  ];
  private gridApi;
  private gridColumnApi;

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public params = [];
  public apiUrl = "";
  public bodyData: any = [];
  public TDR = 0;
  public TCR = 0;
  public AmountInWord = "";
  public Narration = "";
  public VoucherNo = "";
  public VoucherDate = "";
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  constructor(
    private router: Router,
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private voucherService: VoucherService,
    private modalService: ModalService,
    private comboService: CommoncomboService,
    private ledgerService: LedgerService
  ) {
    this.getDropdownData();
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
        headerName: "Voucher No",
        field: "voucherNo",
        filter: "agTextColumnFilter",
        width: 140,
      },
      {
        headerName: "Voucher Date",
        field: "voucherDate",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Amount",
        field: "voucherAmount",
        filter: "agNumberColumnFilter",
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.voucherAmount),
        type: "rightAligned",
        width: 130,
      },
      {
        headerName: "Created By",
        field: "fullName",
        filter: "agTextColumnFilter",
        width: 180,
      },
      {
        headerName: "Description",
        field: "remarks",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Ref. No",
        field: "refNo",
        filter: "agTextColumnFilter",
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
    this.voucherService.getVoucher(0, 0).subscribe((data: any) => {
      //debugger;
      if (data.success) {
        this.rowData = data.data;
        //this.master.lstdetailmodel = data.lstdetailmodel;
      }
    });

    //https://www.ag-grid.com/example-assets/olympic-winners.json
    // this.http.get(environment.baseUrl + "Currency/GetCurrency").subscribe((data: any) => {
    //     this.rowData = data;
    //     //debugger;
    //   });
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

  public openWithDataObjModel(dialog: TemplateRef<any>) {
    //debugger;
    this.dialogService.open(dialog, {
      context: this.data,
    });
  }
  public addCosts() {
    if (this.master.costCentreId == 0) {
      this.toastrService.danger("Please select cost centre", "Message");
      return;
    }
    if (this.master.costAmount == 0) {
      this.toastrService.danger("Please enter an amount", "Message");
      return;
    }

    if (this.master.costAmountBalance <= 0) {
      this.toastrService.danger("Amount excess", "Message");
      return;
    }
    var partyname = "";
    if (this.master.partyId != 0) {
      partyname = this.master.partySelected["name"];
    }
    let detailcost = {
      costCentreAllocationId: 0,
      costCentreId: this.master.costCentreId,
      ledgerId: this.master.costAccountId,
      costCentreName: this.master.costCentreSelected["name"],
      accountName: this.master.costAccountName,
      partyId: this.master.costPartyId,
      partyName: partyname,

      amount: this.master.costAmount,
      isPrinAcc: 0,
      isActive: 1,
    };
    //debugger;
    var indexu = this.master.lstcostmodel.findIndex(
      (item) =>
        item.costCentreId == detailcost.costCentreId &&
        item.ledgerId == detailcost.ledgerId &&
        item.partyId == detailcost.partyId
    );

    //debugger;
    console.log(detailcost);
    //this.master.lstdetailmodel.findIndex(x=>x.ledgerId==this.master.particularId&&x.partyId==this.master.partyId);
    if (indexu > -1) {
      // this.itemArray.items[index] = newItem;
      this.master.lstcostmodel[indexu] = detailcost;
    } else {
      //debugger;
      this.master.lstcostmodel.push(detailcost);
    }
    var totalamount = 0;

    this.master.lstcostmodel
      .filter(
        (item) =>
          item.ledgerId == detailcost.ledgerId &&
          item.partyId == detailcost.partyId
      )
      .forEach((a) => (totalamount += parseFloat(a.amount)));
    this.master.costAmountBalance = this.master.costforAmount - totalamount;
    this.master.lstcostfinalmodel = null;
    this.master.lstcostfinalmodel = this.master.lstcostmodel.filter(
      (item) =>
        item.ledgerId == this.master.costAccountId &&
        item.partyId == this.master.costPartyId
    );
    this.refeshcost();
  }
  public addDetails(dialog: TemplateRef<any>) {
    //debugger
    if (this.master.particularId == 0) {
      this.toastrService.danger("Please select particular", "Message");
      return;
    }
    if (this.master.voucherTypeId == 2 || this.master.voucherTypeId == 4) {
      if (this.master.accountId == 0) {
        this.toastrService.danger("Please select particular", "Message");
        return;
      }
    }

    if (this.master.amount == 0) {
      this.toastrService.danger("Please enter an amount", "Message");
      return;
    }
    if (this.master.transactionModeId == 0) {
      this.toastrService.danger("Please select transaction mode", "Message");
      return;
    }
    // if (this.master.fundSourceId == 0) {
    //   this.toastrService.danger("Please select fund source id", "Message");
    //   return;
    // }
    var drAmount = 0;
    var crAmount = 0;
    var tdrAmount = 0;
    var tcrAmount = 0;
    console.log(this.master);
    console.log(this.master.particularSelected["name"]);
    if (this.master.transactionModeId == 1) {
      drAmount = this.master.amount;
    } else {
      crAmount = this.master.amount;
    }
    var partyname = "";
    if (this.master.partyId != 0) {
      partyname = this.master.partySelected["name"];
    }

    let detail = {
      voucherDetailsId: 0,
      voucherMasterId: 0,
      ledgerId: this.master.particularId,
      accountName: this.master.particularSelected["name"],

      partyId: this.master.partyId,
      partyName: partyname,

      amount: this.master.amount,
      transactionModeId: this.master.transactionModeId,
      drAmount: drAmount,
      crAmount: crAmount,
      isPrinAcc: 0,
      isActive: 1,
      showtd: true,
    };

    // var indexu = this.master.index;//this.master.lstdetailmodel.findIndex(x=>x.ledgerId==this.master.particularId&&x.partyId==this.master.partyId);
    var indexu = this.master.lstdetailmodel.findIndex(
      (x) =>
        x.ledgerId == this.master.particularId &&
        x.partyId == this.master.partyId
    );
    if (indexu > -1) {
      // this.itemArray.items[index] = newItem;

      this.master.lstdetailmodel[indexu] = detail;
    } else {
      this.master.lstdetailmodel.push(detail);
    }

    if (this.master.natureId == 4) {
      this.openWithDataObjModel(dialog);
      this.master.costforAmount = this.master.amount;
      this.master.costAmountBalance = this.master.amount;
      this.master.costAccountId = this.master.particularId;
      this.master.costPartyId = this.master.partyId;
      this.master.costAccountName = this.master.particularSelected["name"];
      this.master.lstcostfinalmodel = null;
      this.master.lstcostfinalmodel = this.master.lstcostmodel.filter(
        (item) =>
          item.ledgerId == this.master.costAccountId &&
          item.partyId == this.master.costPartyId
      );
    }
    var totalDR: number = 0.0;
    var totalCR: number = 0.0;
    var index = this.master.lstdetailmodel.findIndex(
      (x) => x.ledgerId == this.master.accountId
    );
    if (index > -1) {
      this.master.lstdetailmodel.splice(index, 1);
    }

    this.master.lstdetailmodel
      .filter((item) => item.transactionModeId === 1)
      .forEach((a) => (totalDR += parseFloat(a.amount)));
    this.master.lstdetailmodel
      .filter((item) => item.transactionModeId === 2)
      .forEach((a) => (totalCR += parseFloat(a.amount)));
    var ttransactionModeId = 0;
    var tamount = 0;
    if (totalDR > totalCR) {
      // ttransactionModeId = 2;
      tcrAmount = totalDR - totalCR;
      tamount = totalDR - totalCR;
    } else {
      // ttransactionModeId = 1;
      tdrAmount = totalCR - totalDR;
      tamount = totalCR - totalDR;
    }
    if (this.master.voucherTypeId == 2 || this.master.voucherTypeId == 4) {
      if (this.master.voucherTypeId == 2) {
        ttransactionModeId = 2;
      } else {
        ttransactionModeId = 1;
      }
      let detailM = {
        voucherDetailsId: 0,
        voucherMasterId: 0,
        ledgerId: this.master.accountId,
        accountName: this.master.accountSelected["name"],

        partyId: 0,
        partyName: "",

        amount: tamount,
        transactionModeId: ttransactionModeId,
        drAmount: tdrAmount,
        crAmount: tcrAmount,
        isPrinAcc: 1,
        isActive: 1,
        showtd: false,
      };
      this.master.lstdetailmodel.push(detailM);
    }
    //debugger;
    var totalamount: any = 0;
    this.master.lstdetailmodel
      .filter((item) => item.transactionModeId === 1)
      .forEach((a) => (totalamount += parseFloat(a.amount)));
    this.master.voucherAmount = totalamount;
    this.refesh();
    //this.selectdetailRows.push(detail);

    // this.toastrService.success(this.commonService.successmsg, "Message");
  }
  public refesh() {
    // this.master.lstdetailmodel = [];
    // this.toastrService.warning(this.commonService.warningmsg, "Message");
    this.master.particularSelected = null;
    this.ledgersOBC = null;
    this.master.ledgerOBCBalance = "0";
    this.master.partyBalance = "0";
    this.master.amount = 0;
    this.master.partySelected = null;
    this.master.transactionModeSelected = null;
    this.master.partyId = 0;
    this.master.particularId = 0;
    this.getLedgerOBC();
  }
  public refeshcost() {
    // this.master.lstdetailmodel = [];
    // this.toastrService.warning(this.commonService.warningmsg, "Message");
    this.master.costCentreSelected = null;

    this.master.costCentreId = 0;

    this.master.costAmount = 0;

    this.getCostCentre(this.master.sbuId);
  }
  // Delete from detail
  public deleteDetail(index: any) {
    //debugger;
    this.selectedRow = this.master.lstdetailmodel[index];
    this.master.lstdetailmodel.splice(index, 1);
    var tdrAmount = 0;
    var tcrAmount = 0;
    var totalDR: number = 0.0;
    var totalCR: number = 0.0;
    var index1 = this.master.lstdetailmodel.findIndex(
      (x) => x.ledgerId == this.master.accountId
    );
    if (index1 > -1) {
      this.master.lstdetailmodel.splice(index1, 1);
    }

    this.master.lstdetailmodel
      .filter((item) => item.transactionModeId === 1)
      .forEach((a) => (totalDR += parseFloat(a.amount)));
    this.master.lstdetailmodel
      .filter((item) => item.transactionModeId === 2)
      .forEach((a) => (totalCR += parseFloat(a.amount)));
    var ttransactionModeId = 0;
    var tamount = 0;
    if (totalDR > totalCR) {
      ttransactionModeId = 2;
      tcrAmount = totalDR - totalCR;
      tamount = totalDR - totalCR;
    } else {
      ttransactionModeId = 1;
      tdrAmount = totalCR - totalDR;
      tamount = totalCR - totalDR;
    }
    let detailM = {
      voucherDetailsId: 0,
      voucherMasterId: 0,
      ledgerId: this.master.accountId,
      accountName: this.master.accountSelected["name"],

      partyId: 0,
      partyName: "",

      amount: tamount,
      transactionModeId: ttransactionModeId,
      drAmount: tdrAmount,
      crAmount: tcrAmount,
      isPrinAcc: 1,
      isActive: 1,
    };
    if (tdrAmount != 0 || tcrAmount != 0) {
      this.master.lstdetailmodel.push(detailM);
    }
    var totalamount: any = 0;
    this.master.lstdetailmodel
      .filter((item) => item.transactionModeId === 1)
      .forEach((a) => (totalamount += parseFloat(a.amount)));
    this.master.voucherAmount = totalamount;
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }
  public deleteCost(index: any) {
    //debugger;
    this.selectedRow = this.master.lstcostmodel[index];
    this.master.lstcostmodel.splice(index, 1);
    this.master.lstcostfinalmodel = this.master.lstcostmodel.filter(
      (item) =>
        item.ledgerId == this.selectedRow.ledgerId &&
        item.partyId == this.selectedRow.partyId
    );
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }

  public editDetail(index: any) {
    //debugger;
    this.master.index = index;
    this.selectedRow = this.master.lstdetailmodel[index];
    this.master.particularSelected = {
      id: this.selectedRow.ledgerId,
      name: this.selectedRow.accountName,
    };
    this.getLedgerBalanceOBC(this.selectedRow.ledgerId);
    this.master.particularId = this.selectedRow.ledgerId;
    if (this.selectedRow.haveSubledger == 1) {
      this.showparty = true;
    } else {
      this.showparty = false;
      this.master.partyId = 0;
    }
    this.master.partyId = this.selectedRow.partyId;
    if (this.selectedRow.partyId != 0) {
      this.master.partySelected = {
        id: this.selectedRow.partyId,
        name: this.selectedRow.partyName,
      };
      this.getLedgerBalancePBC();
    }
    if (this.selectedRow.transactionModeId == 1) {
      this.selectedRow.modeName = "DR";
    } else {
      this.selectedRow.modeName = "CR";
    }
    this.master.transactionModeSelected = {
      id: this.selectedRow.transactionModeId,
      name: this.selectedRow.modeName,
    };
    this.master.amount = this.selectedRow.amount;
    this.master.particularId = this.selectedRow.ledgerId;
    this.master.transactionModeId = this.selectedRow.transactionModeId;
  }

  public editCost(index: any) {
    //debugger;
    this.master.index = index;
    this.selectedRow = this.master.lstcostfinalmodel[index];
    this.master.costCentreSelected = {
      id: this.selectedRow.costCentreId,
      name: this.selectedRow.costCentreName,
    };
    this.master.costCentreId = this.selectedRow.costCentreId;
    var totalamount = 0;

    this.master.lstcostfinalmodel.forEach(
      (a) => (totalamount += parseFloat(a.amount))
    );
    this.master.costAmount = this.selectedRow.amount;
    this.master.costAmountBalance =
      this.master.costforAmount - totalamount + this.selectedRow.amount;
  }
  ///for test dont remove
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
      var voucherMasterId = event.node.data.voucherMasterId;
      this.getSBU(event.node.data.companyId);
      this.getFundSource(event.node.data.sbuId);
      this.getParty(event.node.data.sbuId);
      this.getCostCentre(event.node.data.sbuId);

      this.voucherService
        .getVoucherById(voucherMasterId)
        .subscribe((data: any) => {
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
            this.getLedgerBC();
            this.getLedgerOBC();
            this.master.fundSourceSelected = {
              id: data.data[0].fundSourceId,
              name: data.data[0].fundSourceName,
            };
            this.master.voucherTypeSelected = {
              id: data.data[0].voucherTypeId,
              name: data.data[0].voucherTypeName,
            };
            //debugger;
            this.master.accountSelected = {
              id: data.data[0].accountId,
              name: data.data[0].accountName,
            };

            this.getLedgerBalance(data.data[0].accountId);
          }
          this.master.isActive = 1;
          this.master.remarks = data.data[0].remarks;
          this.master.lstcostmodel = [];
        });

      this.voucherService
        .getVoucherDetailByMasterId(voucherMasterId)
        .subscribe((data: any) => {
          //debugger;
          if (data.success) {
            //debugger;
            this.master.lstdetailmodel = data.data;
          }
        });
      this.voucherService
        .getCostCentreAllocationByMasterId(voucherMasterId)
        .subscribe((data: any) => {
          //debugger;
          if (data.success) {
            //debugger;
            this.master.lstcostmodel = data.data;
          }
        });
      //getVoucherDetailByMasterId
      this.ngOnInit();
    }
  }
  private openModal(id: string) {
    //debugger;
    this.modalService.open(id);
  }

  private closeModal(id: string) {
    this.modalService.close(id);
  }
  private agReport(event) {
    // //debugger;
    // this.commonService.voucherMasterId = event.data.voucherMasterId
    // let rptvoucherpreView=new RptVoucherpreviewComponent(this.toastrService,this.commonService,this.comboService);
    // rptvoucherpreView.generateReport('print');
    //this.router.navigate([`pages/accounting/rpt-voucherpreview`]);

    //this.toastrService.info("Print button clicked", "Message");
    this.generateVoucherReport(event.data.voucherMasterId);
  }
  private agDelete(event) {
    var result = confirm("Are you sure you want to delete that?");
    if (result) {
      this.master.voucherMasterId = event.node.data.voucherMasterId;
      this.voucherService
        .deleteVoucher(this.master)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(
              this.commonService.deletedmsg,
              "Message"
            );

            //////////////Grid Refresh ///////////////////
            this.voucherService.getVoucher(0, 0).subscribe((data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            });
            //////////////Grid Refresh ///////////////////
          }
        });
    }
  }
  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Voucher No",
      leftValue: "",
      rightLabel: "Voucher Date",
      rightValue: "",
    });
  }
  public datalength: number;
  private getReportData(voucherMasterId) {
    //debugger;
    ////////// Call common service for report data/////////
    //var voucherMasterId = this.commonService.voucherMasterId
    // this.apiUrl = `AccountReport/getRptVoucherPreview?vmasterId=${voucherMasterId}`;

    this.voucherService
      .getVoucherReportById(voucherMasterId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.bodyData = returns.data;
          this.datalength = returns.data.length * 50;
          //debugger;
          this.TDR = 0;
          this.TCR = 0;
          this.bodyData.forEach((a) => (this.TDR += parseFloat(a.drAmount)));
          this.bodyData.forEach((a) => (this.TCR += parseFloat(a.crAmount)));
          this.VoucherNo = this.bodyData[0].voucherNo;
          this.VoucherDate = this.bodyData[0].voucherDate;
          this.Narration = this.bodyData[0].remarks;
          this.AmountInWord = this.bodyData[0].amountInWord;
          this.setParam();
          var fileName = this.pageNavigation + ".pdf";
          const content = document.getElementById("reportHeader");
          this.generateReport("print", fileName, content, this.datalength);
          // this.showbody = true;
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
  }
  public generateVoucherReport(voucherMasterId) {
    //debugger;

    this.getReportData(voucherMasterId);
  }

  //////////////////////////////////End of Ag Grid Data Load/////////////////////////////////

  @Output() myEvent = new EventEmitter();
  @ViewChild("body_table") targetElement: ElementRef;
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

  data: Country[] = [
    {
      name: "Russia",
      flag: "f/f3/Flag_of_Russia.svg",
      area: 17075200,
      population: 146989754,
    },
    {
      name: "Canada",
      flag: "c/cf/Flag_of_Canada.svg",
      area: 9976140,
      population: 36624199,
    },
    {
      name: "United States",
      flag: "a/a4/Flag_of_the_United_States.svg",
      area: 9629091,
      population: 324459463,
    },
    {
      name: "China",
      flag: "f/fa/Flag_of_the_People%27s_Republic_of_China.svg",
      area: 9596960,
      population: 1409517397,
    },
  ];

  names: any;

  openWithDataModel() {
    this.dialogService
      .open(DialogNamePromptComponent)
      .onClose.subscribe((name) => name && this.names.push(name));
  }
  /////////////////////////////report
  public generateReport(
    buttonAction: any,
    fileName: string,
    content: any,
    datalength: number
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional

    var legend = {
      height: 100,
      totalheight: 100 + datalength,
    };
    //debugger;
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      //var a = doc.internal.setFont("helvetica", "italic");
      doc.setFontSize(8);
      for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
          "Page " + String(i) + " of " + String(pageCount),
          doc.internal.pageSize.width / 1.2,
          doc.internal.pageSize.height - 20
        );
        doc.text(
          "Powered by : ONE ERP",
          doc.internal.pageSize.width / 2.3,
          doc.internal.pageSize.height - 20
        );
        doc.text(
          "Printed Date: " +
          new Date().toLocaleDateString() +
          " " +
          new Date().toLocaleTimeString(),
          20,
          doc.internal.pageSize.height - 20
        );
      }
    };

    //////////// TABLE DATA ////////////
    // legend.totalheight=legend.height+this.datalength;
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 20,
          styles: { font: "Meta" },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 50,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [105, 105, 105],
            fontSize: 11,
          },
          bodyStyles: {
            fillColor: [216, 216, 216],
            textColor: 50,
            // halign:"right"
          },
          columnStyles: {
            4: { halign: "right" },
            5: { halign: "right" },
          },

          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#footer_table",
          startY: legend.totalheight + 300,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [105, 105, 105],
            fontSize: 11,
          },
          bodyStyles: {
            fillColor: [216, 216, 216],
            textColor: 50,
            // halign:"right"
          },

          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });

        addFooters(doc);

        ////////////PRINT ////////////
        if (buttonAction == "pdf") {
          doc.save(fileName);
        } else {
          window.open(URL.createObjectURL(doc.output("blob")), "_blank"); //doc.output("dataurlnewwindow");
          doc.close();
        }
      },
    });
  }
}
