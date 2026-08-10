import { Component, OnInit } from '@angular/core';
import { NbDateService, NbToastrService } from '@nebular/theme';
import { CommonService } from 'app/@core/mock/common.service';
import { CommoncomboService } from 'app/services/commoncombo.service';
import { BillcollectionService } from 'app/services/sales/billcollection.service';
import { SalesinvoiceService } from 'app/services/sales/salesinvoice.service';
import { BtnCellRenderer } from '../settings/common/btn-cell-renderer.component';

@Component({
  selector: 'ngx-money-receipt',
  templateUrl: './money-receipt.component.html',
  styleUrls: ['./money-receipt.component.scss']
})
export class MoneyReceiptComponent implements OnInit {

  pageNavigation: any = "Money Receipt";
  show: boolean = true;
  private gridApi;
  private gridColumnApi;

  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    protected dateService: NbDateService<Date>,
    private salesinvoiceService: SalesinvoiceService,
    private billcollectionService: BillcollectionService,
  ) {
    this.commonService.valueSet("showlist");
    this.grdFromDate = new Date();
    this.grdToDate = new Date();
    this.getServerDateTime();
    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 70,
      },
      {
        headerName: "MR No.",
        field: "receiptNo",
        width: 180,
      },
      {
        headerName: "Date",
        field: "moneyReceiptDate",
        width: 160,
      },
      {
        headerName: "Money Receipt Book",
        field: "moneyBook",
        width: 180,
        type: "rightAligned",
      },
      {
        headerName: "MR Type",
        field: "mrTypeName",
        width: 180,
      },
      {
        headerName: "Depot Name",
        field: "DepotName",
        width: 200,
      },
      {
        headerName: "Territory Name",
        field: "TerritoryName",
        width: 200,
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
    this.GetAllDepo();
    this.getPaymentMode();
    this.GetMoneyReceiptType();
  }

  ngOnInit(): void {
    localStorage.setItem("button", "");
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.GetGridData();
  }
  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      debugger;
      if (this.depotList.length == 1) {
        this.depotSelected = { id: this.depotList[0].id, name: this.depotList[0].name };
        this.master.depotCode = this.depotList[0].id;
        this.getAllTerritory(this.master.depotCode);
      }
      if (this.PaymentModeList.length > 0) {
        this.master.paymentModeId = this.PaymentModeList[1].id;
        this.PaymentModeSelected = { id: this.PaymentModeList[1].id, name: this.PaymentModeList[1].name }
        this.ChangePaymentMode();
      }
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      if (this.ValidationForSave() == false) {
        this.commonService.valueSet("create");
        return;
      };
      this.save();
    } else if (this.commonService.buttonClicked == "update") {
      if (this.ValidationForSave() == false) {
        this.commonService.valueSet("create");
        return;
      };
      this.save();
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
      this.toastrService.info("Edit Button Click.", "Message")
    }
  }
  private selectedRows = [];
  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    this.commonService.agButtonClicked = "";
    if (data == "edit") {
      this.getMaster();
      this.agEdit(event);
      this.show = false;
    } else if (data == "view") {
      this.agEdit(event);
      this.show = false;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      this.agDelete(event);
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  minDate: Date = new Date();
  maxDate: Date = new Date();
  currentDate: Date = new Date();
  getServerDateTime() {
    let apiUrl = `menu/getServerDateTime`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.currentDate = new Date(returns.data[0].currentDate);
        this.minDate = this.dateService.addDay(new Date(returns.data[0].maxDate), -180);
        this.maxDate = this.dateService.addDay(new Date(returns.data[0].maxDate), 0);
      } else {
        this.currentDate = new Date();
        this.minDate = new Date();
        this.maxDate = new Date();
      }
    });
  }

  grdFromDate: Date = new Date();
  grdToDate: Date = new Date();
  GetGridData() {
    this.billcollectionService.GetAllMoneyReceipt(0, this.commonService.DateFormat(this.grdFromDate), this.commonService.DateFormat(this.grdToDate)).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
        console.log(data.data);
      }
    });
  }

  master: {
    moneyReceiptId: number,
    receiptNo: string,
    moneyReceiptDate: Date,
    depotCode: string,
    territoryCode: string,
    mioCode: string,
    receivedFromPerson: string,
    remarks: string,
    mrTypeId: number,
    amount: number,
    paymentModeId: number,
    paymentMode: string,
    chequeNo: string,
    chequeDate: Date,
    trxNo: string,
    bankName: string,
    branchName: string,
    moneyBook: string,
    lstDetailsViewModel: any[];
    fromNumber: number,
    toNumber: number
  };

  public getMaster() {
    this.master = {
      moneyReceiptId: 0,
      receiptNo: "",
      moneyReceiptDate: new Date,
      depotCode: "",
      territoryCode: "",
      mioCode: "",
      receivedFromPerson: "",
      remarks: "",
      mrTypeId: 0,
      amount: null,
      paymentModeId: 0,
      paymentMode: "",
      chequeNo: "",
      chequeDate: new Date,
      trxNo: "",
      bankName: "",
      branchName: "",
      moneyBook: "",
      lstDetailsViewModel: null,
      fromNumber: 0,
      toNumber: 0
    };

    this.depotSelected = null;
    this.territorySelected = null;
    this.mioSelected = null;
    this.mrTypeSelected = null;
    this.PaymentModeSelected = null;
    this.ChangeNumber();
  }

  PaymentModeList = [];
  paymentModeId: number = 0;
  PaymentModeSelected: any = {};

  public getPaymentMode() {
    this.PaymentModeList = [];
    this.paymentModeId = 0;
    this.PaymentModeSelected = null;
    this.billcollectionService.getpaymentMode().subscribe((retuns: any) => {
      if (retuns.success) {
        this.PaymentModeList = retuns.data.map((val: any) => ({
          id: val.paymentModeId,
          name: val.paymentMode,
        }));
      }
    })
  }

  showChk: boolean = true;
  public ChangePaymentMode() {
    this.master.bankName = "";
    this.master.branchName = "";
    this.master.chequeNo = "";
    this.master.chequeDate = null;

    if (this.master.paymentModeId != 2) {
      this.showChk = false;
    } else {
      this.showChk = true;
    }
  }

  apiUrl: string = "";
  mrTypeList: any = [];
  mrTypeSelected: any = {};
  GetMoneyReceiptType() {
    this.mrTypeList = [];
    this.mrTypeSelected = {};
    this.apiUrl = `SalesInvoice/GetMoneyReceiptType`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.mrTypeList = returns.data.map((val: any) => ({
          id: val.mrTypeId,
          name: val.mrTypeName,
        }));
      }
    });
  }

  depotList: any[];
  depotSelected = {};

  public GetAllDepo() {
    this.depotList = [];
    this.apiUrl = `SalesInvoice/GetAllDepot`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.depotList = returns.data.map((val: any) => ({
          id: val.depotCode,
          name: val.depotName,
        }));
      }
    });
  }

  territoryList = [];
  territorySelected: any = {};
  getAllTerritory(depotCode: any = '') {
    this.territoryList = [];
    this.salesinvoiceService.GetAllTerritoryForDepot(depotCode).subscribe((returns: any) => {
      if (returns.success) {
        this.territoryList = returns.data.map((val: any) => ({
          id: val.TerritoryCode,
          name: val.TerritoryName,
        }));
      }
    });
  }

  mioList: any = [];
  mioSelected: any = {};
  public GetAllMIOByTerritory() {
    this.mioList = [];
    this.comboService
      .GetAllMIOByTerritory(this.master.territoryCode)
      .subscribe((returns: any) => {
        if (returns.status) {
          debugger;
          console.log(returns);
          this.mioList = returns.data.map((val: any) => ({
            id: val.employeeNo,
            name: val.mioName,
          }));
        }
      });
  }

  ChangeNumber() {
    this.billcollectionService.GetMaxMoneyReceiptNo(this.commonService.DateFormat(this.master.moneyReceiptDate)).subscribe((retuns: any) => {
      if (retuns.success) {
        this.master.receiptNo = retuns.data[0].MaxNo;
      }
    });
  }

  addToDetailsGrid(dialog: any): void {
    this.master.lstDetailsViewModel = [];
    for (let i = this.master.fromNumber; i <= this.master.toNumber; i++) {
      this.master.lstDetailsViewModel.push({ number: i });
    }
    this.show = false;
  }

  checkedChildCount: number = 0;
  ValidationForSave(): boolean {

    if (this.depotSelected == (undefined || null)) {
      this.toastrService.warning(`Please select a depot !`, "Message");
      return false;
    }
    if (this.territorySelected == (undefined || null)) {
      this.toastrService.warning(`Please select a territory !`, "Message");
      return false;
    }
    if (this.mioSelected == (undefined || null)) {
      this.toastrService.warning(`Please select a mio !`, "Message");
      return false;
    }
    return true;
  }

  private save() {
    this.master.moneyReceiptDate = this.commonService.DateFormat(this.master.moneyReceiptDate);

    var button = this.commonService.buttonClicked;
    this.show = true;
    this.billcollectionService
      .SaveMoneyReceipt(this.master)
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
          this.GetGridData();
        }
        else {
          this.toastrService.danger(this.commonService.failedmsg, "Message");
        }
      });
    this.getMaster();
  }

  private agEdit(event) {
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
      var masterId = event.node.data.moneyReceiptId;
      debugger;
      this.billcollectionService
        .GetAllMoneyReceipt(masterId)
        .subscribe((data: any) => {
          if (data.success) {
            this.master = data.data[0];
            console.log(data.data[0]);

            this.getAllTerritory(this.master.depotCode)
            this.GetAllMIOByTerritory()

            this.depotSelected = {
              id: data.data[0].depotCode,
              name: data.data[0].DepotName,
            }


            this.territorySelected = {
              id: data.data[0].territoryCode,
              name: data.data[0].TerritoryName,
            }

            this.mioSelected = {
              id: data.data[0].mioCode,
              name: data.data[0].mioCode,
            }

            this.mrTypeSelected = {
              id: data.data[0].mrTypeId,
              name: data.data[0].mrTypeName,
            }
            this.master.moneyReceiptDate = new Date(this.master.moneyReceiptDate);
            console.log(this.master);
          }
          this.billcollectionService
            .GetAllMoneyReceiptDetails(masterId)
            .subscribe((data: any) => {
              if (data.success) {
                debugger;
                this.master.lstDetailsViewModel = data.data;
                if (data.data.length > 0) {
                  this.master.fromNumber = data.data[0].number;
                }
                if (data.data.length > 0) {
                  this.master.toNumber = data.data[data.data.length - 1].number;
                }
              }
            });
        });
    }
  }

  private reset() {
    this.getMaster();
  }

  selectedRow: any;
  onRefesh() {
    this.selectedRow = "";
    this.ngOnInit();
    this.toastrService.warning("warning", this.commonService.warningmsg);
  }
  agReport(event: any) {
    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `SalesInvoiceReport/GetMoneyReceiptNoteReportById?reportFormat=Pdf&userId=${userInfo[0].employeeid}&masterId=${event.node.data.moneyReceiptId}`;
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        console.log(res.message);
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }

  agDelete(event: any) {
    if (confirm('Are you sure to delete?')) {
      let masterId = event.node.data.moneyReceiptId;
      this.billcollectionService
        .DeleteMoneyReceiptNoteById(masterId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(this.commonService.deletedmsg, "Message");
            this.GetGridData();
          }
        });
    }
  }

}
