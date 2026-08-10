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
import { BillcollectionService } from "app/services/sales/billcollection.service";

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
  showChk: boolean = false;

  vlucherForm: FormGroup;
  submitted: boolean;
  saveupdate: string = "Save";
  gridbutton: string = "";
  name: string;
  description: string;
  selectedRow: any;
  lastPaymentAmount = 0;

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
      if (this.PaymentModeList.length > 0) {
        this.master.paymentModeId = this.PaymentModeList[0].id;
        this.master.PaymentModeSelected = { id: this.PaymentModeList[0].id, name: this.PaymentModeList[0].name }
        this.ChangePaymentMode();
      }
      this.show = false;
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      //this.GetPurchaseApprovedRequisition();
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");
      this.save();
      // this.show = true;
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

  master: {
    paymentMasterId: number;
    billMasterId: number;
    paymentNumber: string;
    paymentDate: Date;
    // purchaseOrderId: number;
    bankName: string;
    branchName: string;
    chequeNo: string;
    chequeDate: Date;
    partyId: number;
    paymentModeId: number;
    paymentAmount: number;


    billNo: string;
    billDate: string;
    paidAmount: number;
    duesAmount: number;
    netAmount: number;

    PaymentModeSelected: {};
    partySelected: {};
    billSelected: {};

    isActive: number;
    isDelete: number;
  };

  public ChangePaymentMode() {
    this.master.bankName = "";
    this.master.branchName = "";
    this.master.chequeNo = "";
    this.master.chequeDate = null;

    // if (this.master.paymentModeId == 1) {
    if (this.master.paymentModeId != 2) {
      this.showChk = false;
    } else {
      this.showChk = true;
    }
  }


  public PaymentModeList = [];
  public getPaymentMode() {
    this.master.paymentModeId = 0;
    this.master.PaymentModeSelected = null;
    this.billcollectionService.getpaymentMode().subscribe((retuns: any) => {
      if (retuns.success) {
        this.PaymentModeList = retuns.data.map((val: any) => ({
          id: val.paymentModeId,
          name: val.paymentMode,
        }));
      }
    })
  }

  public getMaster() {
    this.master = {
      paymentMasterId: 0,
      billMasterId: 0,
      paymentNumber: "",
      paymentDate: new Date(),
      //  purchaseOrderId: 0,
      partyId: 0,
      bankName: "",
      branchName: "",
      chequeNo: "",
      chequeDate: null,
      paymentAmount: 0,
      partySelected: null,

      billNo: "",
      billDate: "",
      paidAmount: 0,
      duesAmount: 0,
      netAmount: 0,

      paymentModeId: 0,
      isActive: 1,
      isDelete: 0,
      PaymentModeSelected: null,
      billSelected: null
    };
    // this.getPurchaseFinalReqNo();
    //this.getPurchaseFinalReqNo();
    this.getBillPaymentNo();
    this.getParty();
    this.getPaymentMode();
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
    if (this.master.paymentAmount == null || this.master.paymentAmount < 0) {
      this.toastrService.danger("Payment Amount can not be zero! ", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    let paymentAmount = 0;

    if (this.master.paymentMasterId == 0) {
      if ((this.master.paidAmount + this.master.paymentAmount) > this.master.netAmount) {
        this.toastrService.danger("Payment amount is more than Bill Amount! ", "Message");
        this.commonService.valueSet("create");
        return false;
      }
    } else if (this.master.paymentMasterId > 0) {
      if ((this.master.paidAmount - this.lastPaymentAmount + this.master.paymentAmount) > this.master.netAmount) {
        this.toastrService.danger("Payment amount is more than Bill Amount! ", "Message");
        this.commonService.valueSet("create");
        return false;
      }
    }

    // console.log(this.master)
    // return;
    this.show = true;
    //console.log(this.master);
    this.master.paymentDate = this.commonService.DateFormat(this.master.paymentDate);

    // this.commonService.ConsoleLog(this.master);
    let button = ""
    this.PurchaseorderService
      .SaveBillPayment(this.master)
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
          this.initGrid(0);
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

  public getBillPaymentNo() {
    //debugger;
    if (this.master.paymentDate == null) {
      this.master.paymentDate = new Date();
    }
    //console.log("the finalrequsition date is:",this.master.paymentDate)
    this.PurchaseorderService
      .getBillPaymentNo(
        this.master.paymentDate.toDateString().substring(4, 15)
      )
      .subscribe((returns: any) => {
        console.log(returns);
        if (returns.success) {
          this.master.paymentNumber = returns.data[0].MaxNo;
        }
      });
  }

  billList = []
  getSupplierWiseBillsForPayment(event: any) {
    this.master.billMasterId = 0;
    this.billList = [];
    this.master.billSelected = {};
    this.clearBillDeails();
    if (event) {
      this.master.partyId = event.id;
      this.PurchaseorderService.getSupplierWiseBillsForPayment(0, this.master.partyId).subscribe((returns: any) => {
        if (returns.success) {
          //this.billList = returns.data;
          this.billList = returns.data.map((val) => ({
            id: val.billMasterId,
            name: val.billNo,
          }));
        }
      });
    }
  }

  clearBillDeails() {
    this.master.billNo = "";
    this.master.billDate = "";
    this.master.netAmount = 0;
    this.master.paidAmount = 0;
    this.master.duesAmount = 0;
    this.master.paymentAmount = 0;
    this.lstDetailsViewModel = [];
    this.grandTotal = 0;
    this.discountPercent = 0;
    this.discountAmount = 0;
    this.amountAfterDiscount = 0;
    this.truckFair = 0;
    this.transportBill = 0;
    this.tdsPercent = 0;
    this.tdsAmount = 0;
    this.netAmount = 0;
  }

  getBillDetailsForPayment(event: any) {
    debugger
    this.clearBillDeails();
    if (event) {
      //this.master.billMasterId = event.id;
      this.PurchaseorderService.getSupplierWiseBillsForPayment(event.id, this.master.partyId).subscribe((returns: any) => {
        if (returns.success) {
          let billDitails = returns.data[0];
          this.master.billNo = billDitails.billNo;
          this.master.billDate = billDitails.billDate;
          this.master.netAmount = billDitails.netAmount;
          this.master.paidAmount = billDitails.paidAmount;
          this.master.duesAmount = billDitails.duesAmount;
          this.master.paymentAmount = billDitails.paymentAmount;
          this.getBillDetailsbyId(this.master.billMasterId)
        }
      });
    }
  }


  lstDetailsViewModel: any = [];
  grandTotal = 0;
  discountPercent = 0;
  discountAmount = 0;
  amountAfterDiscount = 0;
  truckFair = 0;
  transportBill = 0;
  tdsPercent = 0;
  tdsAmount = 0;
  netAmount = 0;

  getBillDetailsbyId(billId: any) {
    this.PurchaseorderService.GetBillDetailsById(this.master.billMasterId).subscribe((returns: any) => {
      if (returns.success) {
        this.lstDetailsViewModel = returns.data;
        this.grandTotal = returns.data[0].grandTotal;
        this.discountPercent = returns.data[0].discountPercent;
        this.discountAmount = returns.data[0].discountAmount;
        this.amountAfterDiscount = returns.data[0].amountAfterDiscount;
        this.truckFair = returns.data[0].truckFair;
        this.transportBill = returns.data[0].transportBill;
        this.tdsPercent = returns.data[0].tdsPercent;
        this.tdsAmount = returns.data[0].tdsAmount;
        this.netAmount = returns.data[0].netAmount;
        //this.getBillDetailsbyId(this.master.billMasterId)
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
      //let res = returns.data.filter((it) => it.sbuId == sbuId);
      console.log(returns.data);
      this.parties = returns.data.map((val) => ({
        id: val.partyId,
        name: val.partyName,
      }));
    });
  }

  CalculateLineTotalkeyFunc(e: any, rowIndex: number) {
    // let lineReceivedQty = this.master.lstDetailsViewModel[rowIndex].receivedQty == null ? 0 : this.master.lstDetailsViewModel[rowIndex].receivedQty;
    // let balanceQty = this.master.lstDetailsViewModel[rowIndex].balanceQty == null ? 0 : this.master.lstDetailsViewModel[rowIndex].balanceQty;
    // if(lineReceivedQty>balanceQty){
    //   this.master.lstDetailsViewModel[rowIndex].receivedQty = null;
    //   this.master.lstDetailsViewModel[rowIndex].receivedQty = balanceQty;
    // }
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
    private billcollectionService: BillcollectionService,
    private datePipe: DatePipe
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
        headerName: "Bill Payment No.",
        field: "paymentNumber",
        width: 250,
      },
      {
        headerName: "Payment Date",
        field: "paymentDate",
        width: 200,
      },
      {
        headerName: "Party",
        field: "supplierName",
        width: 200,
      },
      {
        headerName: "Bill No",
        field: "billNo",
        width: 250
      },
      {
        headerName: "Payment Amount",
        field: "paymentAmount",
        width: 250
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
    // this.getParty();
    // this.getAllPurchaseOrdersForGRN();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.initGrid(0);
    // this.PurchaseorderService.GetGRN(0).subscribe((data: any) => {
    //     if (data.success) {
    //       this.rowData = data.data;
    //       //console.log(this.rowData);
    //     }
    //   });
  }

  initGrid(paymentMasterId: any) {

    // this.PurchaseorderService.GetBillPaymentById(paymentMasterId).subscribe((data: any) => {
    //   if (data.success) {
    //     this.rowData = data.data;
    //     //console.log(this.rowData);
    //   }
    // });
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
      var paymentMasterId = event.node.data.paymentMasterId;
      this.lastPaymentAmount = 0;
      // this.PurchaseorderService.GetBillPaymentById(paymentMasterId).subscribe((data: any) => {
      //   if (data.success) {
      //     this.master = data.data[0];
      //     this.lastPaymentAmount = data.data[0].paymentAmount;
      //     //this.master.paidAmount = this.master.paidAmount
      //     this.master.paymentNumber = data.data[0].paymentNumber;
      //     this.master.paymentDate = data.data[0].paymentDate;
      //     this.master.partySelected = {
      //       id: data.data[0].supplierId,
      //       name: data.data[0].supplierName
      //     }
      //     this.master.partyId = data.data[0].supplierId;

      //     this.master.billSelected = {
      //       id: data.data[0].billMasterId,
      //       name: data.data[0].billNo
      //     }
      //     this.master.billMasterId = data.data[0].billMasterId;

      //     this.master.PaymentModeSelected = { id: data.data[0].paymentModeId, name: data.data[0].paymentMode };
      //     if (this.master.paymentModeId != 2) {
      //       this.showChk = false;
      //     } else {
      //       this.showChk = true;
      //     }


      //     //this.getBillDetailsForPayment(data.data[0]);
      //   }
      // });
      // this.GetPurchaseApprovedRequisition(1, requsitionFinalMasterId)
      this.ngOnInit();
    }
  }

  private agReport(event) {
    this.generateReport(event.data.salesReturnMasterId);
  }

  private agDelete(event) {
    var result = confirm("Are you sure you wants to delete it?");
    if (result) {
      this.master.paymentMasterId = event.node.data.paymentMasterId;
      this.PurchaseorderService.DeleteBillPaymentById(this.master.paymentMasterId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(this.commonService.deletedmsg, "Message");
            this.initGrid(0)
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

  public generateReport(salesReturnMasterId) {

    this.salesreturnService
      .GetSalesGrossReturnById(salesReturnMasterId)
      .subscribe((data: any) => {
        if (data.success) {

          //this.master.salesReturnDate = new Date(this.master.salesReturnDate);
          var fileName = this.pageNavigation + ".pdf";
          const content = document.getElementById("reportHeader");
          this.generateReportPdf("print", fileName, content, this.datalength);
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
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
      height: 60,
      totalheight: 60 + datalength,
    };
    debugger;
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
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table_top",
          startY: legend.height + 20,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });
        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 60,
          styles: { font: "Meta" },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });
        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 120,
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
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#body_table1",
          startY: legend.height + 350,
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