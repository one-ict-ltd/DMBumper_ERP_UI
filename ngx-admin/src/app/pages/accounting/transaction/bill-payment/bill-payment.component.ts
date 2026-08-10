import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
  NbDateService
} from "@nebular/theme";
import { NavigationStart, Router } from "@angular/router";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { ProductService } from "app/services/inventory/product.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { StockinService } from "app/services/inventory/stockin.service";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { SalesreturnService } from "app/services/sales/salesreturn.service";
import { isJSDocThisTag } from "typescript";
import { PurchaserequisitionService } from "app/pages/purchase/settings/purchaserequisition.service";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";
import { VoucherService } from "app/services/transaction/voucher.service";

@Component({
  selector: 'ngx-bill-payment',
  templateUrl: './bill-payment.component.html',
  styleUrls: ['./bill-payment.component.scss']
})
export class BillPaymentComponent implements OnInit {

  protected options: {};
  protected cd: ChangeDetectorRef;
  showMessages: any = {};
  errors: string[];

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
    //debugger;
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Bill Payment";
  public buttons = this.commonService.btnList;

  public ButtonAction() {

    if (this.commonService.buttonClicked == "create") {

      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.getVoucher();
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");
      this.save();
      // this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      // this.save();
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

  master: {
    voucherMasterId: number;
    billMasterId: number;
    billNo: string;
    billDate: Date;
    omrRmrNo: string;
    particular: string;
    remarks: string;
    supplierChallanNo: string;
    partyId: number;
    supplierBillNo: string;
    supplierBillDate: Date;
    omrRmrDate: Date;
    supplierChallanDate: Date;

    grandTotal: number;
    grandTotalWithoutVat: number;
    discountPercent: number;
    discountAmount: number;
    truckFair: number;
    transportBill: number;
    tdsPercent: number;
    tdsAmount: number;
    netAmount: number;
    amountAfterDiscount: number;

    purchaseOrderSelected: {};
    partySelected: {};
    billSelected: {};
    purchaseOrderDate: string;
    POSelected: {};

    creditPeriod: number;
    maturityDate: string;

    isActive: number;
    isDelete: number;
    lstDetailsViewModel: any[];
    supplierName: string;

    loadFromDateShow: Date;
    loadToDateShow: Date;
    accountId: number;
    accountName: string;
    accountSelected: {};
    ledgerBCBalance: string;
    paidAmount: number;
    duesAmount: number;
    paymentAmount: number;
    vatPaymentAmount: number;
    paymentAmountWithVat: number;
    tdsPaymentAmount: number;
    netPaymentAmount: number;
    voucherDateShow: Date;
    voucherDate: string;
    voucherNo: string;
    countData: number;
    voucherRemarks: string;
  };


  public getMaster() {
    this.master = {
      voucherMasterId: 0,
      billMasterId: 0,
      billNo: "",
      billDate: new Date(),
      partyId: 0,
      omrRmrNo: "",
      remarks: "",
      particular: "",
      supplierChallanNo: "",
      supplierBillNo: "",
      supplierBillDate: null,
      omrRmrDate: null,
      supplierChallanDate: null,
      grandTotal: 0,
      grandTotalWithoutVat: 0,
      discountPercent: 0,
      discountAmount: 0,
      amountAfterDiscount: 0,
      truckFair: 0,
      transportBill: 0,
      tdsPercent: 0,
      tdsAmount: 0,
      netAmount: 0,

      partySelected: null,
      billSelected: null,
      purchaseOrderSelected: null,
      POSelected: null,

      purchaseOrderDate: "",


      creditPeriod: 1,
      maturityDate: "",

      isActive: 1,
      isDelete: 0,
      lstDetailsViewModel: [],
      supplierName: "",

      loadFromDateShow: new Date(),
      loadToDateShow: new Date(),
      accountId: 0,
      accountName: "",
      accountSelected: null,
      ledgerBCBalance: "",
      paidAmount: 0,
      duesAmount: 0,
      paymentAmount: 0,
      vatPaymentAmount: 0,
      paymentAmountWithVat: 0,
      tdsPaymentAmount: 0,
      netPaymentAmount: 0,
      voucherDateShow: new Date(),
      voucherDate:
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
      voucherNo: "",
      countData: 0,
      voucherRemarks: "",
    };
    this.master.loadFromDateShow.setDate(this.master.loadFromDateShow.getDate() - 7);
    this.getParty();
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

  /////////////////////////////// CRUD ///////////////////////////////////////////

  private save() {
    //debugger;
    if (!this.master.lstDetailsViewModel || this.master.lstDetailsViewModel.length == 0) {
      this.toastrService.danger("Please select a Bill No!", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    let flag = false;
    if (this.master.lstDetailsViewModel.length > 0) {
      this.master.lstDetailsViewModel.forEach(element => {
        if (element.isSelect == 1) {  // 1 is YES
          flag = true;
        }
      });
    }

    if (!flag) {
      this.toastrService.danger("No selected items found! ", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    
    if (this.master.countData != 0) {
      this.toastrService.danger("This voucher date year has locked", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.lstDetailsViewModel.length > 0) {
      this.master.lstDetailsViewModel.forEach(element => {
        if (element.isSelect == 1) {  
          if (element.paymentAmount > element.duesAmount) {
            this.toastrService.danger("Payment Amount cannot be greater than Dues Amount", "Message");
            this.commonService.valueSet("create");
            return false;
          }
        }
      });
    }
    else if (this.master.paymentAmount == 0 || this.master.paymentAmount == null) {
      this.toastrService.danger("Total Payment Amount cannot be zero", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.accountId == 0 || this.master.accountId == null) {
      this.toastrService.danger("Please select Payment Account Name(CR)", "Message");
      this.commonService.valueSet("create");
      return false;
    }


    var button = this.commonService.buttonClicked;

    this.PurchaseorderService.SaveBillPayment(this.master).subscribe((returns: any) => {
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
        this.getVoucher();
        this.getMaster();

      }
      else {
        this.toastrService.warning(
          this.commonService.successmsg,
          "Message"
        );
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

  parties = [];
  public getParty() {
    //debugger;
    this.master.partySelected = null;
    this.parties = null;
    this.PurchaseorderService.getSupplierInfoForBillPayment().subscribe((returns: any) => {
      this.parties = returns.data.map((val) => ({
        id: val.partyId,
        name: val.partyName
      }));
    });
  }

  public totalnetAmount=0;
  public totalpaidAmount=0;
  public totalduesAmount=0;
  getSupplierWiseBillsForPayment(event: any) {
    this.master.lstDetailsViewModel = [];
    if (event) {
      this.master.partyId = event.id;
      this.PurchaseorderService.getSupplierWiseBillsForPayment(0, this.master.partyId).subscribe((returns: any) => {
        if (returns.success) {
          this.master.lstDetailsViewModel = returns.data; 
          this.totalnetAmount=0;
          this.totalpaidAmount=0;
          this.totalduesAmount=0; 
          this.master.lstDetailsViewModel.forEach(element => {
            this.totalnetAmount += element.netAmount;
            this.totalpaidAmount += element.paidAmount;
            this.totalduesAmount += element.duesAmount;
          });
        }
      });
    }
  }

   public getVoucherNo() {
    this.voucherService
      .getVoucherNo(2, this.master.voucherDateShow.toDateString())
      .subscribe((returns: any) => {
        this.master.voucherNo = returns.data[0].voucherNo;
      });
  }
  public getLedgerBalance(ledgerId) {
    this.voucherService
      .getBalanceById(ledgerId, 0)
      .subscribe((returns: any) => {
        this.master.ledgerBCBalance = "0";
        this.master.ledgerBCBalance = this.currencyFormatter(
          returns.data[0].balanceAmount
        );
      });
  }
  public currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  public checkYearLock() {
    this.voucherService.checkLockFiscalYear(this.master.voucherDate)
      .subscribe((returns: any) => {
        this.master.countData = returns.data[0].countData;
      });
  }
  public getActualDate(event: any) {
    //debugger;
    let dateCon = event.toLocaleDateString() + " " + event.toLocaleTimeString();
    if (dateCon != "") {
      this.master.voucherDate = dateCon;
    }
  }
  public ledgers = [];
  public getLedgerBC() {
    this.master.accountSelected = null;
    this.ledgers = null;
    this.master.ledgerBCBalance = "0";
    this.comboService
      .getLedgersForVoucher(1, 1)
      .subscribe((returns: any) => {
        let res = null;
        res = returns.data.filter(
          (it) => it.ledgerTypeId == 1 || it.ledgerTypeId == 2 || it.accountCode == 23600100
        );
        this.ledgers = res.map((val) => ({
          id: val.ledgerId,
          name: val.accountName + "-(" + val.accountCode + ")",
        }));
      });
  }

  
  checkChange(e, rowIndex) {
    // debugger;
    if (e.target.checked) {
      this.master.lstDetailsViewModel[rowIndex].isSelect = 1;
      this.master.lstDetailsViewModel[rowIndex].paymentAmount = this.master.lstDetailsViewModel[rowIndex].duesAmount;
    } else {
      this.master.lstDetailsViewModel[rowIndex].isSelect = 0;
      this.master.lstDetailsViewModel[rowIndex].paymentAmount = 0;
    }
    this.CalculateSummary();
  }

  CalculateSummary() {
    this.master.paymentAmount = 0;
    this.master.lstDetailsViewModel.forEach((element, i) => {
      if (element.isSelect) {
        this.master.paymentAmount += element.paymentAmount
      }
    });
    this.master.paymentAmount = this.commonService.roundWithDecimalPoint(this.master.paymentAmount, 0);
  }

  ValidatePaymentAmounts(rowIndex) {
    // debugger;
     if (this.master.lstDetailsViewModel[rowIndex].paymentAmount > this.master.lstDetailsViewModel[rowIndex].duesAmount) {
      this.master.lstDetailsViewModel[rowIndex].paymentAmount = this.master.lstDetailsViewModel[rowIndex].duesAmount;
      this.toastrService.danger("Payment Amount can't Exceeded Due Amount!", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    this.CalculateSummary(); 
  }
  
  minDate: Date = new Date();
  maxDate: Date = new Date();
  currentDate: Date = new Date();
  getServerDateTime() {
    let apiUrl = `menu/getServerDateTime`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        debugger;
        this.currentDate = new Date(returns.data[0].currentDate);
        this.minDate = this.dateService.addDay(new Date(returns.data[0].minVoucherDatePV), 0);
        this.maxDate = this.dateService.addDay(new Date(returns.data[0].maxVoucherDatePV), 0);

      } else {
        this.currentDate = new Date();
        this.minDate = this.dateService.addDay(new Date(), -0);
        this.maxDate = this.dateService.addDay(new Date(), 0);
      }
    });
  }

  addDays = (date: Date, days: number): Date => {
    let result = new Date(date);
    console.log(result);
    result.setDate(result.getDate() + days);
    return result;
  };


  // Usage example:

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
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private ProducttransferService: ProducttransferService,
    private productrequisitionService: ProductrequisitionService,
    private productService: ProductService,
    private comboService: CommoncomboService,
    private stockinService: StockinService,
    private salesinvoiceService: SalesinvoiceService,
    private salesreturnService: SalesreturnService,
    private purchaserequisitionService: PurchaserequisitionService,
    private PurchaseorderService: PurchaseorderService,
    private datePipe: DatePipe,
    private voucherService: VoucherService,
    protected dateService: NbDateService<Date>,
  ) {
    this.commonService.valueSet("showlist");

    // this.commonService.valueSet("showlist");
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
        headerName: "Supplier",
        field: "supplierName",
        filter: "agTextColumnFilter",
        width: 290,
      },
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
        headerName: "Description",
        field: "voucherRemarks",
        filter: "agTextColumnFilter",
         width: 290,
      },
      {
        headerName: "Status",
        field: "currentStatus",
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
    };
    //debugger;
    this.getMaster();
    this.getServerDateTime();
    this.getLedgerBC();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getVoucher();
  }
public getVoucher() {
    const fromDate = this.master.loadFromDateShow;
    const toDate = this.master.loadToDateShow;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.PurchaseorderService.getBillPaymentById(0,this.commonService.DateFormat(this.master.loadFromDateShow), this.commonService.DateFormat(this.master.loadToDateShow)).subscribe((data: any) => {
        ////debugger;
        if (data.success) {
          this.rowData = data.data; 
        }
      });
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }
  
  getSelectedRowData() {
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map((node) => node.data);
    alert(`${JSON.stringify(selectedData)}`);
    this.name = selectedData[0].currencyName;
    return selectedData;
  }

  ////////////////////////////////// Ag Grid Data Load/////////////////////////////////
  private selectedRows = [];
  public onRowClicked(event) {

    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    if (data == "edit") {
      this.commonService.valueSet("showlist");
      this.toastrService.info('Not Allowed', 'Info')
      // this.agEdit(event);
      // this.show = false;
    } else if (data == "view") {
      this.commonService.valueSet("showlist");
      this.toastrService.info('Not Allowed', 'Info')
      // this.agEdit(event);
      // this.show = false;
      // this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event, 1);
    } else if (data == "print") {
      this.agReport(event, 2);
    } else if (data == "delete") {
      this.commonService.valueSet("showlist");
      this.toastrService.info('Not Allowed', 'Info')
      // this.VoucherEditDeleteCheck(event, 2)
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  private agEdit(event) {
    // debugger;
    
  }

  private agReport(event, halfFull) {
    this.generateVoucherReport(event.data.voucherMasterId, halfFull);
  }
  public generateVoucherReport(voucherMasterId, halfFull) {
    this.getCrReport(voucherMasterId);
  }

  private getCrReport(voucherMasterId: any, reportFormat: any = 'pdf') {
    this.apiUrl = `AccountsReport/GetVoucherReportById?voucherMasterId=${voucherMasterId}&reportFormat=${reportFormat}`;
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      this.commonService.GenerateBase64ToReport(returns);
    });
  }

  public VoucherEditDeleteCheck(event, check) {
    let voucherMasterId = event.node.data.voucherMasterId;
    this.voucherService.VoucherEditDeleteCheck(voucherMasterId).subscribe((data: any) => {
      ////debugger;
      if (data.success) {
        let access = data.data[0].access;
        if (access == 1 && check == 1) {
          // this.agEdit(event);
          this.show = false;
        } else if (check == 2) {
          this.agDelete(event);
        } else {
          this.toastrService.danger("Voucher already posted and you are not eligible edit or delete", "Message");
          return;
        }
      }
    });
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
            this.getVoucher();
            //////////////Grid Refresh ///////////////////
          }
        });
    }
  }


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

  public apiUrl = "";

  
  public generateReportPdf(
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
          html: "#header_table_top",
          startY: legend.height + 20,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 50,
          styles: { font: "Meta" },
        });


        autoTable(doc, {
          html: "#body_table1",
          startY: legend.height + 230,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontSize: 11,
            halign: "center",
            valign: "middle",
            fontStyle: "bold",
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          columnStyles: {
            3: { halign: "right" },
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#footer_table",
          //startY: legend.totalheight + 300,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
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
            fillColor: [255, 255, 255],
            textColor: 50,
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

  //#endregion Report
}