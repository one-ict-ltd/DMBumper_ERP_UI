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

@Component({
  selector: 'ngx-bill-create',
  templateUrl: './bill-create.component.html',
  styleUrls: ['./bill-create.component.scss']
})
export class BillCreateComponent implements OnInit {

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

  public pageNavigation = "Bill";
  public buttons = this.commonService.btnList;

  public ButtonAction() {

    if (this.commonService.buttonClicked == "create") {

      this.getMaster();
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

    billMasterId: number;
    billNo: string;
    billDate: Date;
    // purchaseOrderId: number;
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
    purchaseOrderDate: string;
    POSelected: {};

    creditPeriod: number;
    maturityDate: string;

    isActive: number;
    isDelete: number;
    lstDetailsViewModel: any[];
    supplierName: string;
    advancePaidAmount: number;
  };


  public getMaster() {
    this.master = {
      billMasterId: 0,
      billNo: "",
      billDate: new Date(),
      //  purchaseOrderId: 0,
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
      purchaseOrderSelected: null,
      POSelected: null,

      purchaseOrderDate: "",


      creditPeriod: 1,
      maturityDate: "",

      isActive: 1,
      isDelete: 0,
      lstDetailsViewModel: [],
      supplierName: "",
      advancePaidAmount: 0
    };
    // this.getPurchaseFinalReqNo();
    //this.getPurchaseFinalReqNo();
    this.getBillNo()
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
      this.toastrService.danger("No selected items found!", "Message");
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
    if (this.master.supplierChallanNo == null || this.master.supplierChallanNo == undefined || this.master.supplierChallanNo.trim() == "") {
      this.toastrService.danger("Please input Supplier Challan No! ", "Message");
      this.commonService.valueSet("create");
      return;
    }
    if (this.master.supplierChallanDate == null || this.master.supplierChallanDate == undefined) {
      this.toastrService.danger("Please select Supplier Challan Date! ", "Message");
      this.commonService.valueSet("create");
      return;
    }
    if (this.master.supplierBillDate == null || this.master.supplierBillDate == undefined) {
      this.toastrService.danger("Please select Supplier Bill Date! ", "Message");
      this.commonService.valueSet("create");
      return;
    }
    if (this.master.supplierBillNo == null || this.master.supplierBillNo == undefined || this.master.supplierBillNo.trim() == "") {
      this.toastrService.danger("Please input Supplier Bill No! ", "Message");
      this.commonService.valueSet("create");
      return;
    }
    if (this.master.omrRmrNo == null || this.master.omrRmrNo == undefined || this.master.omrRmrNo.trim() == "") {
      this.toastrService.danger("Please input OMR/RMR No! ", "Message");
      this.commonService.valueSet("create");
      return;
    }
    if (this.master.omrRmrDate == null || this.master.omrRmrDate == undefined) {
      this.toastrService.danger("Please select OMR/RMR Date! ", "Message");
      this.commonService.valueSet("create");
      return;
    }
    

    // console.log(this.master)
    // return;
    this.show = true;
    //console.log(this.master);
    this.master.billDate = this.commonService.DateFormat(this.master.billDate);
    this.master.omrRmrDate = this.master.omrRmrDate == null ? null : this.commonService.DateFormat(this.master.omrRmrDate);
    this.master.supplierBillDate = this.master.supplierBillDate == null ? null : this.commonService.DateFormat(this.master.supplierBillDate);
    this.master.supplierChallanDate = this.master.supplierChallanDate == null ? null : this.commonService.DateFormat(this.master.supplierChallanDate);
    // this.master.maturityDate = this.master.maturityDate ==null?null: this.commonService.DateFormat(this.master.maturityDate);
    // this.commonService.ConsoleLog(this.master);
    let button = ""
    this.PurchaseorderService.SaveBill(this.master).subscribe((returns: any) => {
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
      //let res = returns.data.filter((it) => it.sbuId == sbuId);
      // console.log(returns.data);
      this.parties = returns.data.map((val) => ({
        id: val.partyId,
        name: val.partyName,
        creditDays: val.creditDays
      }));
    });
  }

  ValidateAdvancePaidAmount() {
    // debugger;
     if (this.master.advancePaidAmount > this.master.amountAfterDiscount) {
      this.master.advancePaidAmount = 0;
      this.toastrService.danger("Advance Paid Amount can't Exceeded Net Amount!", "Message");
      this.commonService.valueSet("create");
      return false;
    }
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

    // this.master.partySelected = {id:event.supplierId, name: event.supplierName};
    //this.master.partyId = event.id;
    //this.master.creditPeriod = event.creditDays == 0 ? 1 : event.creditDays;
    //this.calculateMaturityDate();
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
    this.calculateMaturityDateandsupplierChallanNo();
  }

  calculateMaturityDateandsupplierChallanNo() {
    debugger
    this.master.supplierChallanNo = "";
   this.master.supplierChallanDate = null;
   this.master.maturityDate = null;
    var count = 0;
    this.master.lstDetailsViewModel.forEach((element, i) => {
      if (element.isSelect) {
        count += 1;
        if (count == 1) {
          this.master.supplierChallanNo = element.supplierChallanNo;
          this.master.supplierChallanDate = element.grnDate;
          this.calculateMaturityDate();
        }else{
          this.master.supplierChallanNo = this.master.supplierChallanNo +", "+ element.supplierChallanNo;
          if(this.master.supplierChallanDate < element.grnDate){
            this.master.supplierChallanDate = element.grnDate;
            this.calculateMaturityDate();
          }
        }

      }
    });
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
    this.master.netAmount = this.commonService.roundWithDecimalPoint(this.master.amountAfterDiscount + _transportTotal - this.master.tdsAmount- this.master.advancePaidAmount, 2)

  }


  calculateMaturityDate() {
    debugger
    if (this.master.supplierChallanDate) {

      let _date = this.commonService.DateFormat(this.master.supplierChallanDate)
      const date: Date = new Date(_date);
      const result: Date = this.addDays(date, this.master.creditPeriod);
      console.log(result)
      let maturityDate = this.commonService.DateFormat(result, "MMM dd,yyyy")
      console.log(maturityDate)
      this.master.maturityDate = maturityDate;
      //  this.master.maturityDate.setDate(this.master.supplierBillDate.getDate() + this.master.creditPeriod);
    }
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
        headerName: "Bill No.",
        field: "billNo",
        width: 150,
      },
      {
        headerName: "Bill Date",
        field: "billDate",
        width: 140,
      },
      {
        headerName: "Supplier Challan No",
        field: "supplierChallanNo",
        width: 180,
      },
      {
        headerName: "PO No",
        field: "purOrderNo",
        width: 150,
      },
      {
        headerName: "Supplier",
        field: "supplierName",
        width: 300,
      },
      {
        headerName: "Supplier Bill No",
        field: "supplierBillNo",
        width: 150,
      },
      {
        headerName: "Gross Amount",
        field: "grandTotal",
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.grandTotal),
        type: "rightAligned",
        width: 150,
      },
      {
        headerName: "Net Amount",
        field: "netAmount",
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.netAmount),
        type: "rightAligned",
        width: 150
      },
      {
        headerName: "Advance Paid Amount",
        field: "advancePaidAmount",
        filter: "agNumberColumnFilter",
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.advancePaidAmount),
        type: "rightAligned",
        width: 150,
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
    this.getAllPOItemsForBill();
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

  initGrid(billMasterId: any) {

    this.PurchaseorderService.GetBill(billMasterId).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
        //console.log(this.rowData);
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

  ////////////////////////////////// Ag Grid Data Load/////////////////////////////////
  private selectedRows = [];
  public onRowClicked(event) {

    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    if (data == "edit") {
      if(event.node.data.paidAmount > 0){
        this.toastrService.danger("This Bill already has payment. You can not edit it.", "Message");
        return;
      }
      else{
          this.agEdit(event);
          this.show = false;
      }
      
    } else if (data == "view") {
      this.agEdit(event);
      this.show = false;
      this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
       if(event.node.data.paidAmount > 0){
        this.toastrService.danger("This Bill already has payment. You can not delete it.", "Message");
        return;
      }
      else{
          this.agDelete(event);
      }
      
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
      //debugger;
      //this.getStore();
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
      // this.GetPurchaseApprovedRequisition(1, requsitionFinalMasterId)
      this.ngOnInit();
    }
  }
  
  public currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  private agReport(event) {
    //this.generateReport(event.data.billMasterId);
    this.generateCrReport(event.data.billMasterId, 'pdf')
  }

  private agDelete(event) {
    var result = confirm("Are you sure you wants to delete it?");
    if (result) {
      this.master.billMasterId = event.node.data.billMasterId;
      this.PurchaseorderService.DeleteBillById(this.master.billMasterId)
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
    // this.master.supplierChallanNo = event.supplierChallanNo;
    // this.master.supplierChallanDate = event.supplierChallanDate;
    this.getSupplierWiseItemsForBill(event);
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