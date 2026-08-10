import { Component, OnInit } from '@angular/core';
import { NbDateService, NbToastrService } from '@nebular/theme';
import { CommonService } from 'app/@core/mock/common.service';
import { CommoncomboService } from 'app/services/commoncombo.service';
import { BillcollectionService } from 'app/services/sales/billcollection.service';
import { SalesinvoiceService } from 'app/services/sales/salesinvoice.service';
import { BtnCellRenderer } from '../settings/common/btn-cell-renderer.component';

@Component({
  selector: 'ngx-money-receipt-note-delete',
  templateUrl: './money-receipt-note-delete.component.html',
  styleUrls: ['./money-receipt-note-delete.component.scss']
})
export class MoneyReceiptNoteDeleteComponent implements OnInit {

  pageNavigation: any = "Money Receipt Note";
  show: boolean = true;
  disabled: boolean = false;
  private gridApi;
  private gridColumnApi;

  // public modules: Module[] = AllCommunityModules;
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
      }, /// Dont Change
      {
        headerName: "MR No.",
        field: "moneyReceiptNo",
        width: 180,
      },
      {
        headerName: "Date",
        field: "moneyReceiptDate",
        width: 160,
      },
      {
        headerName: "Amount",
        field: "amount",
        width: 160,
        // valueFormatter: (params) =>
        //   this.currencyFormatter(params.data.amount),
        type: "rightAligned",
      },
      {
        headerName: "MR Type",
        field: "mrTypeName",
        width: 180,
      },
      {
        headerName: "Payment Mode",
        field: "paymentMode",
        width: 180,
      },
      {
        headerName: "Territory Name",
        field: "TerritoryName",
        width: 200,
      },
      {
        headerName: "Remarks",
        field: "remarks",
        width: 220,
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
      this.disabled = true;

    } else if (this.commonService.buttonClicked == "reset") {
      //this.GetSalesInvoiceListfromDispatch();
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
      //this.getMaster();
      //this.agEdit(event);
      //this.show = false;
      this.toastrService.info("No Permission!", "Message");
      return;
    } else if (data == "view") {
      //this.agEdit(event);
      //this.show = false;
      this.toastrService.info("No Permission!", "Message");
      return;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      this.agDelete(event);
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
      return;
    }
  }

  minDate: Date = new Date();
  maxDate: Date = new Date();
  currentDate: Date = new Date();
  getServerDateTime() {
    let apiUrl = `menu/getServerDateTime`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        //console.log(returns);
        this.currentDate = new Date(returns.data[0].currentDate);
        // this.minDate = this.dateService.addDay(new Date(returns.data[0].minDate), 0);
        // this.minDate = this.dateService.addDay(new Date(returns.data[0].maxDate), -180);
        // this.maxDate = this.dateService.addDay(new Date(returns.data[0].maxDate), 0);

        this.minDate = this.dateService.addDay(new Date(returns.data[0].minMRNDate), 0);
        this.maxDate = this.dateService.addDay(new Date(returns.data[0].maxMRNDate), 0);
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
    this.billcollectionService.GetAllMoneyReceiptNote(0, this.commonService.DateFormat(this.grdFromDate), this.commonService.DateFormat(this.grdToDate)).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
        console.log(data.data);
      }
    });
  }

  master: {
    moneyReceiptId: number,
    moneyReceiptNo: string,
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
  };

  public getMaster() {
    this.master = {
      moneyReceiptId: 0,
      moneyReceiptNo: "",
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
    };

    this.depotSelected = null;
    this.territorySelected = null;
    this.mioSelected = null;
    this.mrTypeSelected = null;
    this.PaymentModeSelected = null;

    this.ChangeNumber();

    //this.getServerDateTime();
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

    // if (this.master.paymentModeId == 1) {
    if (this.master.paymentModeId >= 2 && this.master.paymentModeId <= 6) {
      this.showChk = true;
    } else {
      this.showChk = false;
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
  // depotCode: string = "";
  depotSelected = {};

  public GetAllDepo() {
    // this.depotSelected = {};
    this.depotList = [];
    this.apiUrl = `SalesInvoice/GetAllDepot`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.depotList = returns.data.map((val: any) => ({
          id: val.depotCode,
          name: val.depotName,
        }));

        // //if (this.depotList.length > 0) {
        // if (this.depotList.length == 1) {
        //   this.depotSelected = { id: this.depotList[0].id, name: this.depotList[0].name };
        //   this.depotCode = this.depotList[0].id;
        //   this.getAllTerritory(this.depotCode);
        // }
        // //}
      }
    });
  }

  territoryList = [];
  //territoryCode: string = '';
  territorySelected: any = {};
  getAllTerritory(depotCode: any = '') {
    this.territoryList = [];
    // this.master.territoryCode = "";
    // this.territorySelected = {};
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
  //mioCode = "";
  public GetAllMIOByTerritory() {
    this.mioList = [];
    // this.master.mioCode = "";
    // this.mioSelected = null;
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
    debugger;
    this.billcollectionService.GetMaxMoneyReceiptNo(this.commonService.DateFormat(this.master.moneyReceiptDate)).subscribe((retuns: any) => {
      if (retuns.success) {
        this.master.moneyReceiptNo = retuns.data[0].MaxNo;
      }
    });
  }


  checkedChildCount: number = 0;
  ValidationForSave(): boolean {

    if (this.depotSelected == undefined || this.depotSelected == null) {
      this.toastrService.warning(`Please select a depot !`, "Message");
      return false;
    }
    if (this.territorySelected == undefined || this.territorySelected == null) {
      this.toastrService.warning(`Please select a territory !`, "Message");
      return false;
    }
    if (this.mioSelected == undefined || this.mioSelected == null) {
      this.toastrService.warning(`Please select a mio !`, "Message");
      return false;
    }

    if (this.master.receivedFromPerson == undefined || this.master.receivedFromPerson == null || this.master.receivedFromPerson == '') {
      this.toastrService.warning(`Please select a Received Person !`, "Message");
      return false;
    }
    // if (this.master.moneyReceiptNo.trim() == "") {
    //   // debugger;
    //   this.toastrService.warning("Money Receipt No. is empty.", "Message");
    //   //return false;
    // }
    else if (this.PaymentModeSelected == undefined || this.PaymentModeSelected == null) {
      this.toastrService.warning("Please Select a Payment Mode!", "Message");
      return false;
    }
    else if ((this.master.amount ?? 0) <= 0) {
      this.toastrService.warning("Please input correct amount", "Message");
      return false;
    }

    // else if (this.checkedChildCount == 0) {
    //   this.toastrService.warning("Minimum one collection required!", "Message");
    //   return false;
    // }

    return true;
    //return false;
  }

  private save() {
    //console.log(this.master);
    this.master.moneyReceiptDate = this.commonService.DateFormat(this.master.moneyReceiptDate);

    var button = this.commonService.buttonClicked;
    this.show = true;
    this.billcollectionService
      .SaveMoneyReceiptNote(this.master)
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
        .GetAllMoneyReceiptNote(masterId)
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
              name: data.data[0].mioName,
            }

            this.mrTypeSelected = {
              id: data.data[0].mrTypeId,
              name: data.data[0].mrTypeName,
            }

            this.PaymentModeSelected = {
              id: data.data[0].paymentModeId,
              name: data.data[0].paymentMode,
            };


            this.master.moneyReceiptDate = new Date(this.master.moneyReceiptDate);
            this.master.chequeDate = new Date(this.master.chequeDate);

            console.log(this.master);
          }
        });
    }
  }

  private reset() {
    this.getMaster();
    // this.grdFromDate.setDate(new Date().getDate() - 0);
  }


  selectedRow: any;
  onRefesh() {
    this.selectedRow = "";
    this.ngOnInit();
    //this.onGridReady;
    this.toastrService.warning("warning", this.commonService.warningmsg);
  }


  agReport(event: any) {
    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `SalesInvoiceReport/GetMoneyReceiptNoteReportById?reportFormat=Pdf&userId=${userInfo[0].employeeid}&masterId=${event.node.data.moneyReceiptId}`;

    //console.log(this.apiUrl);
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      //console.log(res);
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
