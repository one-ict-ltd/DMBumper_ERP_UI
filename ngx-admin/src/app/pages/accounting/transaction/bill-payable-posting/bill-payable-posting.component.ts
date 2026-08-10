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
  selector: 'ngx-bill-payable-posting',
  templateUrl: './bill-payable-posting.component.html',
  styleUrls: ['./bill-payable-posting.component.scss']
})
export class BillPayablePostingComponent implements OnInit {

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

  public pageNavigation = "Bill Payable Posting";
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
    vdsPercent: number;
    tdsPercent: number;
    tdsAmount: number;
    netAmount: number;
    amountAfterDiscount: number;

    purchaseOrderSelected: {};
    partySelected: {};
    billSelected: {};
    purOrderNo: string;
    purchaseOrderDate: Date;
    productName: string;
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
    vdsPaymentAmount: number;
    tdsPaymentAmount: number;
    netPaymentAmount: number;
    voucherDateShow: Date;
    voucherDate: string;
    voucherNo: string;
    countData: number;
    voucherRemarks: string;

    lstdetailmodel: any[];
    totalDebitAmount: number;
    totalCreditAmount: number;
    advancePaidAmount: number;
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
      vdsPercent: 0,
      tdsPercent: 0,
      tdsAmount: 0,
      netAmount: 0,

      partySelected: null,
      billSelected: null,
      purchaseOrderSelected: null,
      POSelected: null,

      purOrderNo: "",
      purchaseOrderDate: null,
      productName: "",


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
      vdsPaymentAmount: 0,
      tdsPaymentAmount: 0,
      netPaymentAmount: 0,
      voucherDateShow: new Date(),
      voucherDate:
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
      voucherNo: "",
      countData: 0,
      voucherRemarks: "",

      lstdetailmodel: [],
      totalDebitAmount: 0,
      totalCreditAmount: 0,
      advancePaidAmount: 0
    };
    this.master.loadFromDateShow.setDate(this.master.loadFromDateShow.getDate() - 7);
    this.getParty();
    this.getBillInfoForPayment(0);
    
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
    debugger;
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
    if (this.master.totalDebitAmount != this.master.totalCreditAmount) {
      this.toastrService.danger("DR & CR amount are not same", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.lstdetailmodel.length == 0) {
      this.toastrService.danger("Please select a Bill No", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.discountAmount > this.master.paymentAmountWithVat) {
      this.toastrService.danger("Discount Amount can't Exceeded Net Payable Amount!", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.advancePaidAmount > this.master.netPaymentAmount) {
      this.toastrService.danger("Advance Paid Amount can't Exceeded Net Payable Amount!", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    let ledgerIdflag = 0;
    if (this.master.lstdetailmodel.length > 0) {
      this.master.lstdetailmodel.forEach(element => {
        if (element.ledgerId == 0 || element.ledgerId == null) {
          ledgerIdflag = 1;
          this.toastrService.danger("Please select Particular for " + element.categoryName, "Message");
          this.commonService.valueSet("create");
          return false;
        }
      });
    }
    if (ledgerIdflag == 1) {
      this.toastrService.danger("Please select Particular", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    else if (this.master.lstdetailmodel.length > 0) {
      this.master.lstdetailmodel.forEach(element => {
        element.accountName = element.accountName? element.accountName['name'] : '';
      });
    }
  


    var button = this.commonService.buttonClicked;
    

    this.PurchaseorderService.SaveBillPayableVoucherPosting(this.master).subscribe((returns: any) => {
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

  public getBillNo() {
    //debugger;
    if (this.master.billDate == null) {
      this.master.billDate = new Date();
    }
    //console.log("the finalrequsition date is:",this.master.billDate)
    this.PurchaseorderService
      .getBillNo(
        this.master.billDate.toDateString().substring(4, 15)
      )
      .subscribe((returns: any) => {
        //console.log(returns);
        if (returns.success) {
          this.master.billNo = returns.data[0].MaxNo;
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

  parties = [];
  public getParty() {
    //debugger;
    this.master.partySelected = null;
    this.parties = null;
    this.comboService.GetSupplierForDropdown().subscribe((returns: any) => {
      this.parties = returns.data.map((val) => ({
        id: val.partyId,
        name: val.partyName,
        creditDays: val.creditDays
      }));
    });
  }
  billList = [];
  public getBillInfoForPayment(billMasterId: any) {
    //debugger;
    this.master.billSelected = null;
    this.billList = null;
    this.PurchaseorderService.getBillInfoForPayment(billMasterId).subscribe((returns: any) => {
      this.billList = returns.data.map((val) => ({
        id: val.billMasterId,
        name: val.billNo
      }));
    });
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
          (it) => it.ledgerTypeId == 3
        );
        this.ledgers = res.map((val) => ({
          id: val.ledgerId,
          name: val.accountName + "-(" + val.accountCode + ")",
        }));
      });
  }

  getSupplierWiseItemsForBill(event: any) {
    debugger
    this.master.partyId = null
    this.master.creditPeriod = 1
    this.master.lstDetailsViewModel = []
    if (event) {
      // this.master.partySelected = {id:event.supplierId, name: event.supplierName};
      this.master.partyId = event.supplierId;
      let poId = event.id;
      this.master.creditPeriod = event.creditDays == 0 ? 1 : event.creditDays;
      this.calculateMaturityDate();
      this.PurchaseorderService.getSupplierWiseProductsForBill(0, this.master.partyId, poId).subscribe((returns: any) => {
        if (returns.success) {
          this.master.lstDetailsViewModel = returns.data;
        }
      });
    }
  }
  POList: any = [];
  getAllPOItemsForBill() {
    debugger
    this.POList = [];
    this.master.partyId = null;
    this.master.creditPeriod = 1;
    this.master.lstDetailsViewModel = [];

    let apiUrl = "PurchaseOrder/getAllPOForBill";
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.POList = returns.data;
      }
    });
  }



  CalculateLineTotal(rowIndex: number) {
    let lineReceivedQty: number = 0;
    let balanceQty: number = 0;
    let lineTotal: number = 0;
    let linePrice: number = 0;
    let lineVatPercent: number = 0;
    let lineVatAmount: number = 0;
    let lineActualAmount: number = 0;

    lineReceivedQty = this.master.lstDetailsViewModel[rowIndex].receivedQty == null ? 0 : this.master.lstDetailsViewModel[rowIndex].receivedQty;
    balanceQty = this.master.lstDetailsViewModel[rowIndex].balanceQty == null ? 0 : this.master.lstDetailsViewModel[rowIndex].balanceQty;
    if (lineReceivedQty > balanceQty) {
      //this.master.lstDetailsViewModel[rowIndex].receivedQty = null;
      //this.master.lstDetailsViewModel[rowIndex].receivedQty = balanceQty;
      this.toastrService.warning("Receive Qty is greater than Invoice Qty.", "Warning!")
    }
    linePrice = this.master.lstDetailsViewModel[rowIndex].price == null ? 0 : this.master.lstDetailsViewModel[rowIndex].price;
    lineTotal = Math.round(lineReceivedQty * linePrice);
    lineVatPercent = this.master.lstDetailsViewModel[rowIndex].vatPercent == null ? 0 : this.master.lstDetailsViewModel[rowIndex].vatPercent;

    lineVatAmount = Math.round((lineVatPercent * lineTotal) / 100);


    this.master.lstDetailsViewModel[rowIndex].totalAmount = lineTotal;
    this.master.lstDetailsViewModel[rowIndex].vatAmount = lineVatAmount;
    lineActualAmount = Math.round(lineVatAmount + lineTotal);
    this.master.lstDetailsViewModel[rowIndex].actualAmount = lineActualAmount
    // this.CalculateSummary();
  }

  CalculateLineTotalkeyFunc(e: any, rowIndex: number) {
    // const typedValue = e.keyCode;
    // if (typedValue < 48 ||  typedValue > 57) {
    //   return;
    // }

    let lineReceivedQty = this.master.lstDetailsViewModel[rowIndex].receivedQty == null ? 0 : this.master.lstDetailsViewModel[rowIndex].receivedQty;
    let balanceQty = this.master.lstDetailsViewModel[rowIndex].balanceQty == null ? 0 : this.master.lstDetailsViewModel[rowIndex].balanceQty;
    if (lineReceivedQty > balanceQty) {
      this.master.lstDetailsViewModel[rowIndex].receivedQty = null;
      this.master.lstDetailsViewModel[rowIndex].receivedQty = balanceQty;
      //this.toastrService.warning("Receive Qty is greater than Invoice Qty.", "Warning!")
    }
  }

  checkChange(e, rowIndex) {
    this.CalculateSummary();
    if (e.target.checked) {
      this.master.lstDetailsViewModel[rowIndex].isEnable = 1;
    } else {
      this.master.lstDetailsViewModel[rowIndex].isEnable = 0.00;
    }
  }

  CalculateSummary() {
    let _transportTotal = 0;
    this.master.grandTotal = 0;
    this.master.grandTotalWithoutVat = 0;
    this.master.lstDetailsViewModel.forEach((element, i) => {
      if (element.isSelect) {
        this.master.grandTotal += element.actualAmount
        this.master.grandTotalWithoutVat += element.total
      }
    });
    this.master.grandTotal = this.commonService.roundWithDecimalPoint(this.master.grandTotal, 0)
    this.master.grandTotalWithoutVat = this.commonService.roundWithDecimalPoint(this.master.grandTotalWithoutVat, 0)

    // this.master.discountPercent = this.master.discountPercent == null ? 0 : this.master.discountPercent;
    // this.master.discountAmount = (this.master.grandTotal * this.master.discountPercent * 0.01);
    this.master.amountAfterDiscount = this.commonService.roundWithDecimalPoint(this.master.grandTotal - this.master.discountAmount, 0)

    _transportTotal = (this.master.transportBill == null ? 0 : this.master.transportBill) - (this.master.truckFair == null ? 0 : this.master.truckFair);
    this.master.tdsPercent = this.master.tdsPercent == null ? 0 : this.master.tdsPercent;
    this.master.tdsAmount = this.commonService.roundWithDecimalPoint((this.master.grandTotalWithoutVat * this.master.tdsPercent * 0.01), 0);
    this.master.netAmount = this.commonService.roundWithDecimalPoint(this.master.amountAfterDiscount + _transportTotal - this.master.tdsAmount, 2)

  }
public tdsRemarks: string = '';
  CalculatePaymentTotal() {
    this.master.vdsPercent = this.master.vdsPercent == null ? 0 : this.master.vdsPercent;
    this.master.vdsPaymentAmount = this.commonService.roundWithDecimalPoint((this.master.paymentAmount * this.master.vdsPercent * 0.01), 0);
    this.master.tdsPercent = this.master.tdsPercent == null ? 0 : this.master.tdsPercent;
    this.master.tdsPaymentAmount = this.commonService.roundWithDecimalPoint((this.master.paymentAmount * this.master.tdsPercent * 0.01), 0);
    this.master.paymentAmountWithVat = this.commonService.roundWithDecimalPoint((this.master.paymentAmount + this.master.vatPaymentAmount), 0);
    this.master.netPaymentAmount = this.commonService.roundWithDecimalPoint((this.master.paymentAmountWithVat - this.master.vdsPaymentAmount- this.master.tdsPaymentAmount), 0)
    this.getPayableJournalVoucher();
    this.tdsRemarks = '';
    if(this.master.tdsPaymentAmount > 0){
      this.tdsRemarks = ', TDS Tk ' + this.master.tdsPaymentAmount;
    }
    this.master.voucherRemarks = 'Bill# ' +this.master.supplierBillNo + ' Date: ' + this.master.supplierBillDate+ ', Challan# ' + this.master.supplierChallanNo+ ' Date: ' + this.master.supplierChallanDate+ ', PO# ' + this.master.purOrderNo+ ' Date: ' + this.master.purchaseOrderDate+ ' MTD: ' + this.master.maturityDate+ ', Purchase of ' + this.master.productName +  this.tdsRemarks + ', Summary-';
  }

  getPayableJournalVoucher() {
      this.master.lstdetailmodel = [];
      this.PurchaseorderService.getBillPayableJV(this.master.billMasterId, this.master.partyId, this.master.paymentAmount, this.master.vatPaymentAmount, this.master.vdsPaymentAmount, this.master.tdsPaymentAmount, this.master.netPaymentAmount).subscribe((returns: any) => {
        if (returns.success) {
          this.master.lstdetailmodel = returns.data;
          this.calculateGrandTotal();
        }
      });
  }
  calculateGrandTotal() {
    let totalDebitAmount = 0;
    let totalCreditAmount = 0;
    this.master.lstdetailmodel.forEach((row) => {
      totalDebitAmount += row.drAmount == "" ? 0 : row.drAmount;
      totalCreditAmount += row.crAmount == "" ? 0 : row.crAmount;
    });
    this.master.totalDebitAmount = this.roundToDigit(totalDebitAmount, 2);
    this.master.totalCreditAmount = this.roundToDigit(totalCreditAmount, 2);
  }
   roundToDigit(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };
ValidateAdvancePaidAmount() {
    // debugger;
     if (this.master.advancePaidAmount > this.master.netPaymentAmount) {
      this.master.advancePaidAmount = 0;
      this.toastrService.danger("Advance Paid Amount can't Exceeded Net Payable Amount!", "Message");
      this.commonService.valueSet("create");
      return false;
    }
  }
  ValidateDiscountAmount() {
    // debugger;
     if (this.master.discountAmount > this.master.paymentAmountWithVat) {
      this.master.discountAmount = 0;
      this.toastrService.danger("Discount Amount can't Exceeded Net Payable Amount!", "Message");
      this.commonService.valueSet("create");
      return false;
    }
  }

  calculateMaturityDate() {
    debugger
    if (this.master.supplierBillDate) {

      let _date = this.commonService.DateFormat(this.master.supplierBillDate)
      const date: Date = new Date(_date);
      const result: Date = this.addDays(date, this.master.creditPeriod);
      console.log(result)
      let maturityDate = this.commonService.DateFormat(result, "MMM dd,yyyy")
      console.log(maturityDate)
      this.master.maturityDate = maturityDate;
      //  this.master.maturityDate.setDate(this.master.supplierBillDate.getDate() + this.master.creditPeriod);
    }
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
        headerName: "Bill No.",
        field: "billNo",
        width: 150,
      },
      {
        headerName: "Bill Date",
        field: "billDate",
        width: 150,
      },
      {
        headerName: "Supplier Bill No.",
        field: "supplierBillNo",
        width: 180,
      },
      {
        headerName: "Supplier Bill Date",
        field: "supplierBillDate",
        width: 180,
      },
      {
        headerName: "Supplier",
        field: "supplierName",
        filter: "agTextColumnFilter",
        width: 190,
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
        headerName: "Advance Paid Amount",
        field: "advancePaidAmount",
        filter: "agNumberColumnFilter",
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.advancePaidAmount),
        type: "rightAligned",
        width: 130,
      },
      {
        headerName: "Description",
        field: "voucherRemarks",
        filter: "agTextColumnFilter",
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
      this.PurchaseorderService.getBillPayableVoucher(0,this.commonService.DateFormat(this.master.loadFromDateShow), this.commonService.DateFormat(this.master.loadToDateShow)).subscribe((data: any) => {
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
    debugger;
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
      var billMasterId = event.node.data.billMasterId;
      this.PurchaseorderService.GetBill(billMasterId).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];

          this.master.billNo = data.data[0].billNo;
          this.master.billDate = data.data[0].billDate;
          this.master.partySelected = {
            id: data.data[0].supplierId,
            name: data.data[0].supplierName
          }
          this.master.partyId = data.data[0].supplierId;
          this.master.supplierBillDate = data.data[0].supplierBillDate;
          this.master.omrRmrDate = data.data[0].omrRmrDate;
          this.master.supplierChallanDate = data.data[0].supplierChallanDate;

          this.master.lstDetailsViewModel = [];
          this.PurchaseorderService.getSupplierWiseProductsForBill(billMasterId, this.master.partyId).subscribe((returns: any) => {
            if (returns.success) {
              this.master.lstDetailsViewModel = returns.data;
              this.CalculateSummary();
            }
          });

        }
      });
      this.ngOnInit();
    }
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


  public partyList = [];
  public GetAllPartysByTypeId(partyTypeId: any) {
    this.salesinvoiceService
      .GetAllPartysByTypeId(partyTypeId)
      .subscribe((returns: any) => {
        this.partyList = returns.data.map((val: any) => ({
          id: val.partyId,
          name: val.partyName,
        }));
      });
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

  //#region Report

  public salesReturnNo = "";
  public salesReturnDate = "";
  public salesInvoiceNo = "";
  public partyName = "";
  public contactNumber = "";
  public addressLine = "";

  public rtotalGross: number = 0;
  public rtotalVat: number = 0;
  public rtotalAit: number = 0;
  public rshippingCost: number = 0;
  public rtotalDiscountAmount: number = 0;
  public rgrandTotal: number = 0;

  public tableHeader = [
    "#",
    "Product Name",
    "Serial No",
    "Invoice Qty",
    "Return Qty",
    "Price",
    "Total",
  ];
  public apiUrl = "";
  public htmlBodyData: string = "";

  public params = [];
  public bodyData: any = [];
  public bodyDatashow: any = [];
  public datalength: number;
  public suppliarName: string = "";
  public suppliarAddress: string = "";
  public billNo: string = "";
  public billDate: Date = new Date();
  public maturityDate: Date = new Date();
  public chalanDate: Date = new Date();
  public supplierbillDate: Date = new Date();
  public supplierBillNo: string = "";
  public challanNo: string = "";
  public creadit: string = "";
  public orm: string = "";
  public ormDate: Date = new Date();

  public poNo: string = "";
  public poDate: Date = new Date();

  public tdsPercentforReport: number = 0;
  public generateReport(billMasterId) {


    this.PurchaseorderService.GetBillForPdfReport(billMasterId).subscribe((data: any) => {
      debugger
      if (data.success) {
        this.master = data.data[0];

        this.billNo = data.data[0].billNo;
        this.billDate = data.data[0].billDate;
        this.suppliarAddress = data.data[0].addressLine;
        this.suppliarName = data.data[0].supplierName;
        this.orm = data.data[0].omrRmrNo;
        this.ormDate = data.data[0].omrRmrDate;
        this.supplierbillDate = data.data[0].supplierBillDate;
        this.supplierBillNo = data.data[0].supplierBillNo;
        this.challanNo = data.data[0].supplierChallanNo;
        this.chalanDate = data.data[0].supplierChallanDate;
        this.maturityDate = data.data[0].maturityDate;

        this.tdsPercentforReport = data.data[0].tdsPercent;

        this.master.partyId = data.data[0].supplierId;
        this.master.supplierBillDate = data.data[0].supplierBillDate;
        this.master.omrRmrDate = data.data[0].omrRmrDate;
        this.master.supplierChallanDate = data.data[0].supplierChallanDate;

        this.master.lstDetailsViewModel = [];
        this.PurchaseorderService.getSupplierWiseProductsForBillForPdfReport(billMasterId, this.master.partyId).subscribe((returns: any) => {
          if (returns.success) {
            this.poNo = returns.data[0].purOrderNo;
            this.poDate = returns.data[0].purchaseOrderDate
            this.master.lstDetailsViewModel = returns.data;

            this.CalculateSummary();

            var fileName = this.pageNavigation + ".pdf";
            const content = document.getElementById("reportHeader");
            this.generateReportPdf("print", fileName, content, this.datalength);
          }
          else {
            this.toastrService.danger("Message", this.commonService.nodatafound);
          }
        });

      }
    });

  }

  generateCrReport(requisitionFinalizeMasterId: any, reportFormat: any) {
    debugger
    let apiUrl = `SalesInvoiceReport/GetBillDetailsById?billId=${requisitionFinalizeMasterId}&reportFormat=${reportFormat}`;
    //console.log(this.apiUrl);
    this.commonService.GetCrystalReportData(apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }
  setSupplierName(event: any) {
    debugger;
    this.master.supplierName = null;
    this.master.supplierName = event.partyName;
    this.getSupplierWiseItemsForBill(event);
  }
  setBillDetails(event: any) {
    this.master.billMasterId = event.id;
    var billMasterId = event.id;
    this.master.billNo = event.name;
    this.PurchaseorderService.GetBill(billMasterId).subscribe((data: any) => {
        if (data.success) {
          // this.master = data.data[0];

          this.master.billNo = data.data[0].billNo;
          this.master.billDate = data.data[0].billDate;
          this.master.partySelected = {
            id: data.data[0].supplierId,
            name: data.data[0].supplierName
          }
          this.master.billSelected = {
            id: data.data[0].billMasterId,
            name: data.data[0].billNo
          }
          this.master.partyId = data.data[0].supplierId;
          this.master.supplierName = data.data[0].supplierName;
          this.master.supplierBillDate = data.data[0].supplierBillDate;
          this.master.omrRmrDate = data.data[0].grnDate;
          this.master.omrRmrNo = data.data[0].grnNo;
          this.master.supplierChallanNo = data.data[0].supplierChallanNo;
          this.master.supplierChallanDate = data.data[0].supplierChallanDate;
          this.master.supplierBillNo = data.data[0].supplierBillNo;
          this.master.creditPeriod = data.data[0].creditPeriod;
          // this.master.maturityDate = data.data[0].maturityDate;
          this.master.particular = data.data[0].particular;
          this.master.remarks = data.data[0].remarks;
          this.master.voucherDateShow = data.data[0].grnDate;
          this.master.voucherDate = data.data[0].grnDate;
          if (this.master.omrRmrDate) {
              let _date = this.commonService.DateFormat(this.master.omrRmrDate)
              const date: Date = new Date(_date);
              const result: Date = this.addDays(date, this.master.creditPeriod);
              // console.log(result)
              let maturityDate = this.commonService.DateFormat(result, "MMM dd,yyyy")
              // console.log(maturityDate)
              this.master.maturityDate = maturityDate;
        }

          // this.master.paidAmount = data.data[0].paidAmount;
          // this.master.duesAmount = data.data[0].duesAmount;
          this.master.paymentAmount = this.commonService.roundWithDecimalPoint(data.data[0].materialAmount, 0);
          this.master.vatPaymentAmount = this.commonService.roundWithDecimalPoint(data.data[0].vatAmount, 0);

          this.master.grandTotal = data.data[0].grandTotal;
          this.master.discountPercent = data.data[0].discountPercent;
          this.master.discountAmount = data.data[0].discountAmount;
          this.master.amountAfterDiscount = data.data[0].amountAfterDiscount;
          this.master.transportBill = data.data[0].transportBill;
          this.master.truckFair = data.data[0].truckFair;
          // this.master.tdsPercent = data.data[0].tdsPercent;
          // this.master.tdsAmount = data.data[0].tdsAmount;
          this.master.netAmount = data.data[0].netAmount;
          this.master.advancePaidAmount = data.data[0].advancePaidAmount;
          this.master.purOrderNo = data.data[0].purOrderNo;
          this.master.purchaseOrderDate = data.data[0].purchaseOrderDate;
//   Date: , Challan#  Date:  , PO#  Date: , MTD:  , HHD/ AHD-PM/ RM/ PPM/ Reagent Purchase of (Item Name), Qty.  @ Tk (Rate), TDS Tk  , Summary-
          

          this.CalculatePaymentTotal();
          
          debugger;
          this.master.lstDetailsViewModel = [];
          this.PurchaseorderService.getSupplierWiseProductsForBill(billMasterId, this.master.partyId).subscribe((returns: any) => {
            if (returns.success) {
              this.master.lstDetailsViewModel = returns.data.filter((x) => x.isSelect == 1);
               this.master.productName = '';
                if (this.master.lstDetailsViewModel.length > 0) {
                    this.master.lstDetailsViewModel.forEach(element => {
                      if (element.isSelect == 1) {  
                      this.master.productName = element.categoryName;
                      }
                    });
                  }
                this.tdsRemarks = '';
                if(this.master.tdsPaymentAmount > 0){
                  this.tdsRemarks = ', TDS Tk ' + this.master.tdsPaymentAmount;
                }
                this.master.voucherRemarks = 'Bill# ' +this.master.supplierBillNo + ' Date: ' + this.master.supplierBillDate+ ', Challan# ' + this.master.supplierChallanNo+ ' Date: ' + this.master.supplierChallanDate+ ', PO# ' + this.master.purOrderNo+ ' Date: ' + this.master.purchaseOrderDate+ ' MTD: ' + this.master.maturityDate+ ', Purchase of ' + this.master.productName +  this.tdsRemarks + ', Summary-';
                
            }
          });

          
         
        }
      });
  }

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
