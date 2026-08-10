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
import { BtnCellRenderer2 } from "app/pages/common/btn-cell-renderer2.component";
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
import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { ProductService } from "app/services/inventory/product.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { StockinService } from "app/services/inventory/stockin.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { PartyService } from "app/services/party.service";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";

@Component({
  selector: "ngx-salesinvoiceserial",
  templateUrl: "./salesinvoiceserial.component.html",
  styleUrls: ["./salesinvoiceserial.component.scss"],
})
export class SalesinvoiceserialComponent implements OnInit {
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
  isReadOnly: boolean;

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
    private datePipe: DatePipe,
    private partyService: PartyService,
    private PurchaseorderService: PurchaseorderService,
  ) {
    this.commonService.valueSet("showlist");
    this.GetAllPartysByTypeId(0);
    this.getAllProductForRequisition();
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
        headerName: "Invoice No.",
        field: "salesInvoiceNo",
        width: 150,
      },
      {
        headerName: "Invoice Date",
        field: "salesInvoiceDate",
        width: 150,
      },
      {
        headerName: "Gross Total",
        field: "totalGross",
        width: 120,
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.totalGross),
        type: "rightAligned",
      },
      {
        headerName: "Net Total",
        field: "grandTotal",
        width: 120,
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.grandTotal),
        type: "rightAligned",
      },
      {
        headerName: "Customer Name",
        field: "partyName",
        width: 180,
      },
      {
        headerName: "Mobile No.",
        field: "mobileNo",
        width: 140,
      },
      {
        headerName: "Address",
        field: "address",
        width: 260,
      },
      {
        field: "Action",
        cellRenderer: "btnCellRenderer2",
        cellRendererParams: {
          clicked: function (field: any) { },
        },
        minWidth: 300,
        editable: false,
        filter: false,
        shorable: false,
        pinned: "right",
      },
    ];
    this.frameworkComponents = {
      btnCellRenderer2: BtnCellRenderer2,
    };
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
    };
    //debugger;
    this.getMaster();
    this.getMaxNo();
    this.getStore();
  }

  ngOnInit() {
    //debugger;
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Sales Invoice (Serial No.)";
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

  //salesInvoiceId, salesInvoiceNo, salesInvoiceDate, paymentDate, partyId, mobileNo, alternateMobileNo, address, totalGross, totalVat, totalAit, shippingCost, totalDiscountAmount, grandTotal, approvalStatus, isActive, isDelete, createdBy, createdAt, updateBy, updateAt

  master: {
    salesInvoiceId: number;
    salesInvoiceNo: string;
    salesInvoiceDate: Date;
    paymentDate: Date;

    storeId: number;
    partyId: number;
    partyName: string;
    partySelected: {};

    mobileNo: string;
    alternateMobileNo: string;
    address: string;

    totalGross: number;
    totalVat: number;
    totalAit: number;
    shippingCost: number;
    totalDiscountAmount: number;
    grandTotal: number;
    approvalStatus: number;

    isActive: number;
    isDelete: number;

    serialNo: string;
    flyingCustomer: string;
    isFlyingCustomer: boolean;

    uomName: string;
    uomId: number;
    productId: number;
    productWiseSpecificationId: number;
    productName: string;
    productSpecSelected: {};
    productSerialSelected: {};
    transactionTypeSelected: {};

    price: number;
    invoiceQty: number;
    vat: number;
    ait: number;
    discountAmount: number;
    total: number;
    costPrice: number;
    termsAndCondition: string;

    currentStock: number;
    storeSlected: {};

    isAutoStock: number;
    transactionTypeId: number;

    lstDetailsViewModel: any[];
    tcLstDetailsViewModel: any[];
  };

  public getMaster() {
    this.master = {
      salesInvoiceId: 0,
      salesInvoiceNo: "",
      salesInvoiceDate: new Date(),
      paymentDate: new Date(),

      storeId: 0,
      partyId: 0,
      partyName: "",
      partySelected: null,

      mobileNo: "",
      alternateMobileNo: "",
      address: "",

      totalGross: 0,
      totalVat: 0,
      totalAit: 0,
      totalDiscountAmount: 0,
      grandTotal: 0,
      shippingCost: 0,

      approvalStatus: 0,
      isActive: 1,
      isDelete: 0,

      serialNo: "",
      flyingCustomer: "",
      isFlyingCustomer: false,

      uomName: "",
      uomId: 0,
      productId: 0,
      productWiseSpecificationId: 0,
      productName: "",
      productSpecSelected: null,
      productSerialSelected: null,
      transactionTypeSelected: null,

      price: 0,
      invoiceQty: 0,
      vat: 0,
      ait: 0,
      discountAmount: 0,
      total: 0,
      costPrice: 0,

      termsAndCondition: "",

      currentStock: 0,
      storeSlected: null,

      isAutoStock: 0,
      transactionTypeId: 0,
      lstDetailsViewModel: [],
      tcLstDetailsViewModel: [],
    };
    this.getMaxNo();
    this.GetAutoStockInOutStatus();
    this.getCompanyAndPType();
    this.GetTransactionType();
  }
  public GetAutoStockInOutStatus() {
    this.PurchaseorderService.GetAutoStockInOutSettingStatusById(2).subscribe(
      (returns: any) => {
        if (returns.success) {
          this.master.isAutoStock = returns.data[0].isAutoStock;
        }
      }
    );
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
    var button = this.commonService.buttonClicked;

    if (this.master.salesInvoiceDate == null) {
      this.toastrService.danger("Please select invoice date.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    ////debugger;
    if (this.master.isFlyingCustomer && this.master.flyingCustomer == "") {
      this.master.partySelected = null;
      this.master.partyId = 0;
      this.toastrService.danger(
        "Please input Flying Customer Name.",
        "Message"
      );
      this.commonService.valueSet("create");
      return false;
    } else {
      if (this.master.partySelected == null) {
        this.master.isFlyingCustomer = false;
        this.master.flyingCustomer = "";
        this.toastrService.danger("Please select party.", "Message");
        this.commonService.valueSet("create");
        return false;
      }
    }
    if (this.master.storeSlected == null) {
      this.toastrService.danger("Please select store.", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    if (
      this.master.lstDetailsViewModel.length == 0 ||
      this.master.lstDetailsViewModel == null
    ) {
      this.toastrService.danger("Please entry product.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    this.show = true;
    // console.log(this.master);

    this.master.salesInvoiceDate = this.commonService.DateFormat(this.master.salesInvoiceDate);
    this.master.paymentDate = this.commonService.DateFormat(this.master.paymentDate);

    this.salesinvoiceService
      .SaveSalesInvoice(this.master)
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

          this.getMaster(); //////////////Grid Refresh ///////////////////
          //debugger;
          this.salesinvoiceService
            .GetSalesInvoiceById(0)
            .subscribe((data: any) => {
              //debugger;
              if (data.success) {
                this.rowData = data.data;
              }
            });
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
    this.getCompanyAndPType();
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
    btnCellRenderer2: typeof BtnCellRenderer2;
  };

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.salesinvoiceService.GetSalesInvoiceById(0).subscribe((data: any) => {
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
    } else if (data == "print") {
      this.agPadReport(event);
    } else if (data == "report") {
      this.agChallanReport(event);
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
      var salesInvoiceId = event.node.data.salesInvoiceId;
      //debugger;
      this.getStore();
      this.salesinvoiceService
        .GetSalesInvoiceById(salesInvoiceId)
        .subscribe((data: any) => {
          if (data.success) {
            this.master = data.data[0];

            this.master.partySelected = {
              id: this.master.partyId,
              name: this.master.partyName,
              address: this.master.address,
              mobileNo: this.master.mobileNo,
            };

            this.master.storeSlected = {
              id: data.data[0].storeId,
              name: data.data[0].storeName,
            };

            this.master.transactionTypeSelected = {
              id: (data.data[0].transactionTypeId = null
                ? 0
                : data.data[0].transactionTypeId),
              name: (data.data[0].transactionTypeName = null
                ? ""
                : data.data[0].transactionTypeName),
            };

            this.salesinvoiceService
              .GetSalesInvoiceDetailsByMasterId(salesInvoiceId)
              .subscribe((data: any) => {
                if (data.status) {
                  this.master.lstDetailsViewModel = data.data;
                  console.log(this.master);
                }

                this.salesinvoiceService
                  .GetSalesInvoiceTCByMasterId(salesInvoiceId)
                  .subscribe((data: any) => {
                    if (data.success) {
                      this.master.tcLstDetailsViewModel = data.data;
                      console.log(this.master);
                    }
                  });
                this.master.productSpecSelected = {
                  id: this.master.productWiseSpecificationId,
                  name: this.master.productName,
                };

                this.master.productSerialSelected = {
                  id: this.master.serialNo,
                  name: this.master.serialNo,
                };

                this.master.vat = 0;
                this.master.ait = 0;
                this.master.invoiceQty = 0;
                this.master.discountAmount = 0;
                this.calculateGrandTotal();
              });
            //console.log(this.master);

            this.master.salesInvoiceDate = new Date(this.master.salesInvoiceDate);
            this.master.paymentDate = new Date(this.master.paymentDate);

          }
        });
      this.ngOnInit();
    }
  }

  public currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  private agReport(event) {
    //this.toastrService.info("Print button clicked", "Message");
    this.generateReport("print", event.data.salesInvoiceId);
  }

  private agChallanReport(event) {
    this.generateChallanReport("print", event.data.salesInvoiceId);
  }

  private agPadReport(event) {
    this.generatePadReport("print", event.data.salesInvoiceId);
  }

  private agDelete(event) {
    var result = confirm("Are you sure you want to delete that?");
    if (result) {
      this.master.salesInvoiceId = event.node.data.salesInvoiceId;
      this.salesinvoiceService
        .DeleteSalesInvoiceById(this.master.salesInvoiceId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(
              this.commonService.deletedmsg,
              "Message"
            );

            this.salesinvoiceService
              .GetSalesInvoiceById(0)
              .subscribe((data: any) => {
                if (data.success) {
                  this.rowData = data.data;
                }
              });
          }
        });
    }
  }

  public StoreList = [];
  public getStore() {
    this.stockinService.getStore(0, 0).subscribe((returns: any) => {
      this.StoreList = returns.data.map((val) => ({
        id: val.storeId,
        name: val.storeName,
      }));
    });
  }

  public getCurrentStock() {
    //this.master.currentStock = 0;
    if (this.master.productWiseSpecificationId > 0) {
      this.salesinvoiceService
        .GetCurrentStock(
          this.master.storeId,
          this.master.productWiseSpecificationId, ''
        )
        .subscribe((returns: any) => {
          if (returns.success) {
            this.master.currentStock = returns.data[0].currentStock;
          }
        });
      this.validateInvoiceQty();
    }
  }

  public validateInvoiceQty() {
    debugger;
    // console.log(this.master);
    // if (this.master.serialNo != "") {
    //   this.master.invoiceQty = 1;
    // }
    // console.log(this.master);
    if (
      (this.master.invoiceQty == null ? 0 : this.master.invoiceQty) >
      this.master.currentStock
    ) {
      this.master.invoiceQty = 0;
    }
    //console.log(this.master);
  }

  public getMaxNo() {
    this.salesinvoiceService
      .GetMaxSalesInvoiceNumber(
        this.datePipe.transform(this.master.salesInvoiceDate, "yyyy-MM-dd")
      )
      .subscribe((returns: any) => {
        //debugger;
        if (returns.success) {
          this.master.salesInvoiceNo = returns.data[0].MaxNo;
        }
      });
  }
  transactionTypeList = [];
  public GetTransactionType() {
    this.PurchaseorderService.GetTransactionType(0).subscribe(
      (returns: any) => {
        if (returns.success) {
          this.transactionTypeList = returns.data.map((val) => ({
            id: val.transactionTypeId,
            name: val.transactionTypeName,
          }));
        }
      }
    );
  }
  public partyList = [];
  public GetAllPartysByTypeId(partyTypeId: any) {
    this.salesinvoiceService
      .GetAllPartysByTypeId(partyTypeId)
      .subscribe((returns: any) => {
        this.partyList = returns.data.map((val: any) => ({
          id: val.partyId,
          name: val.partyName,
          address: val.address,
          mobileNo: val.mobileNo,
        }));
      });
  }

  public GetPartyDetails() {
    this.master.mobileNo = this.master.partySelected["mobileNo"];
    this.master.address = this.master.partySelected["address"];
  }

  public getProductSpecDetails() {
    //debugger;
    this.master.productId = this.master.productSpecSelected["productId"];
    this.master.price = this.master.productSpecSelected["price"];
    this.master.uomName = this.master.productSpecSelected["uomName"];
    this.master.productName = this.master.productSpecSelected["name"];
    this.master.productWiseSpecificationId =
      this.master.productSpecSelected["id"];
    this.master.costPrice = this.master.productSpecSelected["costPrice"];

    this.getCurrentStock();
  }

  public productSpecList = [];
  public getAllProductForRequisition() {
    this.productrequisitionService
      .getAllProductForRequisition()
      .subscribe((returns: any) => {
        this.productSpecList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uomId: val.uomId,
          uomName: val.uomName,
          productId: val.productId,
          price: val.price,
          costPrice: val.costPrice,
        }));
      });
  }

  public productSerialList = [];
  public getProductSerialNo(specId) {
    //debugger;
    //this.master.productSerialSelected = null;
    this.master.serialNo = "";
    this.productSerialList = [];
    this.master.productSerialSelected = {};
    this.salesinvoiceService
      .getProductSerialNoByProductSpec(specId)
      .subscribe((returns: any) => {
        this.productSerialList = returns.data.map((val) => ({
          id: val.serialNo,
          name: val.serialNo,
        }));
      });
  }

  public SetDefaultInvQtyForSerialNo() {
    debugger;
    //console.log(this.productSerialList.length);
    //this.isReadOnly = false;
    //console.log(this.isReadOnly);

    if (this.productSerialList.length > 0) {
      this.master.invoiceQty = 1;
      //this.isReadOnly = true;
    }
  }

  public calculateTotal(index: any) {
    let totalPrice = 0;
    let invoiceQty =
      this.master.lstDetailsViewModel[index].invoiceQty == ""
        ? 0
        : this.master.lstDetailsViewModel[index].invoiceQty;
    let price =
      this.master.lstDetailsViewModel[index].price == ""
        ? 0
        : this.master.lstDetailsViewModel[index].price;
    let vat =
      this.master.lstDetailsViewModel[index].vat == ""
        ? 0
        : this.master.lstDetailsViewModel[index].vat;
    let ait =
      this.master.lstDetailsViewModel[index].ait == ""
        ? 0
        : this.master.lstDetailsViewModel[index].ait;
    let discountAmount =
      this.master.lstDetailsViewModel[index].discountAmount == ""
        ? 0
        : this.master.lstDetailsViewModel[index].discountAmount;

    totalPrice = invoiceQty * price;
    vat = totalPrice * (vat / 100);
    ait = totalPrice * (ait / 100);
    discountAmount = totalPrice * (discountAmount / 100);

    this.master.lstDetailsViewModel[index].total =
      totalPrice + vat + ait - discountAmount;
    this.calculateGrandTotal();
  }

  calculateGrandTotal() {
    let totalGross = 0;
    this.master.lstDetailsViewModel.forEach((row) => {
      totalGross += row.total == "" ? 0 : row.total;
    });
    let totalVat = this.master.totalVat == null ? 0 : this.master.totalVat;
    let totalDiscountAmount =
      this.master.totalDiscountAmount == null
        ? 0
        : this.master.totalDiscountAmount;
    totalVat = totalVat - totalDiscountAmount;
    let totalAit = this.master.totalAit == null ? 0 : this.master.totalAit;
    let shippingCost =
      this.master.shippingCost == null ? 0 : this.master.shippingCost;

    this.master.totalGross = totalGross;
    this.master.grandTotal = totalGross + totalVat + totalAit + shippingCost;
  }

  public addToDetailsGrid() {
    //debugger;
    if (this.master.productSpecSelected == null) {
      this.toastrService.danger("Please select product.", "Message");
      return false;
    } else if (this.master.invoiceQty == 0) {
      this.toastrService.danger("Quantity is zero.", "Message");
      return false;
    } else if (
      this.productSerialList.length > 0 &&
      this.master.serialNo == ""
    ) {
      this.toastrService.danger("Select A Product Serial.", "Message");
      return false;
    } else if (this.master.serialNo != "" && this.master.invoiceQty > 1) {
      this.toastrService.danger(
        "Maximum 1 quantity is allowed with Product Serial.",
        "Message"
      );
      return false;
    } else if (this.master.price == 0) {
      this.toastrService.danger("Price is zero.", "Message");
      return false;
    } else if (this.master.costPrice > this.master.price) {
      this.toastrService.danger(
        "Sales price is lower than cost price.",
        "Message"
      );
      return false;
    }

    let totalPrice =
      (this.master.invoiceQty == null ? 0 : this.master.invoiceQty) *
      (this.master.price == null ? 0 : this.master.price);
    totalPrice =
      totalPrice -
      totalPrice *
      ((this.master.discountAmount == null ? 0 : this.master.discountAmount) /
        100);
    let vat =
      totalPrice * (this.master.vat == null ? 0 : this.master.vat / 100);
    let ait =
      totalPrice * (this.master.ait == null ? 0 : this.master.ait / 100);
    //let discountAmount = (totalPrice * (this.master.discountAmount / 100));

    this.master.total = totalPrice + vat + ait;

    let elements = {
      salesInvDetailsId: 0,
      salesInvoiceId: this.master.salesInvoiceId,
      productWiseSpecificationId: this.master.productWiseSpecificationId,
      productId: this.master.productId,
      productName: this.master.productName,
      uomId: this.master.uomId,
      uomName: this.master.uomName,
      invoiceQty: this.master.invoiceQty,
      serialNo: this.master.serialNo,

      price: this.master.price,
      vat: this.master.vat,
      ait: this.master.ait,
      discountAmount: this.master.discountAmount,
      total: this.master.total,
      isActive: 1,
      isSelect: 1,
    };
    this.master.lstDetailsViewModel.push(elements);
    this.calculateGrandTotal();
  }

  public addTC() {
    //debugger;
    let elements: any = [];
    if (this.master.termsAndCondition == "") {
      this.toastrService.danger("Terms And Condition is empty !", "Message");
      return;
    }
    elements = {
      salesInvoiceTCId: 0,
      salesInvoiceId: this.master.salesInvoiceId,
      termsAndCondition: this.master.termsAndCondition,
      isActive: 1,
      isSelect: 1,
    };
    this.master.tcLstDetailsViewModel.push(elements);
  }

  public refeshDetails() {
    this.master.lstDetailsViewModel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
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

  public deleteDetails(index: any) {
    this.salesinvoiceService
      .DeleteSalesInvoiceDetailsById(
        this.master.lstDetailsViewModel[index].salesInvDetailsId
      )
      .subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");
        }
      });

    this.selectedRow = this.master.lstDetailsViewModel[index];
    this.master.lstDetailsViewModel.splice(index, 1);
    if (this.selectedRow.helpDetailId > 0) {
    }
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }

  public deleteTC(index: any) {
    this.salesinvoiceService
      .DeleteSalesInvoiceTCById(
        this.master.tcLstDetailsViewModel[index].salesInvoiceTCId
      )
      .subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");
        }
      });

    this.selectedRow = this.master.tcLstDetailsViewModel[index];
    this.master.tcLstDetailsViewModel.splice(index, 1);
    if (this.selectedRow.helpDetailId > 0) {
    }
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
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

  //#region Modal
  companies = [];
  companyId = 0;
  companySelected = {};
  partyTypes = [];
  partyTypeId = 0;
  pName = "";
  pMobile = "";
  pAddress = "";
  sbus = [];
  sbuId = 0;
  sbusSelected = {};

  getCompanyAndPType() {
    this.companies = [];
    this.companySelected = {};
    this.partyTypes = [];
    this.partyTypeId = 0;
    this.pName = "";
    this.pMobile = "";
    this.pAddress = "";
    this.sbus = [];
    this.sbusSelected = {};

    this.comboService.getCompany().subscribe((returns: any) => {
      this.companies = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
    this.comboService.getPartyType().subscribe((returns: any) => {
      this.partyTypes = returns.data.map((val) => ({
        id: val.partyTypeId,
        name: val.partyTypeName,
      }));
    });
  }

  public getSBU(companyId) {
    this.sbusSelected = null;
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.sbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }
  msg = "";
  public getDuplicate() {
    this.msg = "";
    this.salesinvoiceService
      .GetDuplicatePartyInfo(this.pName, this.pMobile)
      .subscribe((returns: any) => {
        if (returns.success) {
          debugger;
          this.msg = returns.data[0].partyName;
          //if (returns.data.length > 0) alert("Duplicate Party Found");
        }
      });
  }

  public OpenModal(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      context: [], //this.data,
    });
  }

  SaveCustomer() {
    if (this.companyId == 0 || this.companyId == null) {
      this.toastrService.danger("Please select company", "Message");
      return false;
    } else if (this.sbuId == 0 || this.sbuId == null) {
      this.toastrService.danger("Please select branch", "Message");
      return false;
    } else if (this.partyTypeId == 0 || this.partyTypeId == null) {
      this.toastrService.danger("Please select party type", "Message");
      return false;
    } else if (this.pName == "" || this.pName == null) {
      this.toastrService.danger("Please input party name", "Message");
      return false;
    } else if (this.pMobile == "" || this.pMobile == null) {
      this.toastrService.danger("Please input party mobile number", "Message");
      return false;
    } else if (this.pAddress == "" || this.pAddress == null) {
      this.toastrService.danger("Please input party address", "Message");
      return false;
    }

    let model = {
      partyId: 0,
      companyId: this.companyId,
      sbuId: this.sbuId,
      partyTypeId: this.partyTypeId,
      partyName: this.pName,
      partyMobile: this.pMobile,
      partyAddress: this.pAddress,
    };

    this.salesinvoiceService
      .SaveParty(
        model
        // this.companyId,
        // this.sbuId,
        // this.partyTypeId,
        // this.pName,
        // this.pMobile,
        // this.pAddress
      )
      .subscribe((returns: any) => {
        if (returns.success) {
          this.pName = "";
          this.pMobile = "";
          this.pAddress = "";
          this.GetAllPartysByTypeId(0);
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
      });
  }

  //#endregion Modal

  //#region Report

  public rPartyName: string = "";
  public rSalesInvoiceNo: string = "";
  public rInvoiceDate: string = "";
  public rPaymentDate: string = "";

  public rtotalQuantity: number = 0;
  public rtotalGross: number = 0;
  public rtotalVat: number = 0;
  public rtotalAit: number = 0;
  public rshippingCost: number = 0;
  public rtotalDiscountAmount: number = 0;
  public rgrandTotal: number = 0;

  public rReportHeader = "Sales Invoice Report";
  public tableHeader = [
    "#",
    "Product Name",
    "Serial No",
    "Warranty",
    "Qty.",
    "UOM",
    "Price",
    "AIT (TK)",
    "VAT(TK)",
    "Discount (TK)",
    "Gross (TK)",
  ];
  public tableHeaderChallan = [
    "#",
    "Product Name",
    "Serial No",
    "Warranty",
    "UOM",
    "Quantity",
  ];
  public apiUrl = "";
  public htmlBodyData: string = "";

  public params = [];
  public bodyData: any = [];
  public bodyDatashow: any = [];

  private getReportData(salesInvoiceId: number) {
    try {
      this.apiUrl = `SalesInvoice/GetSalesReportByInvId?salesInvoiceId=${salesInvoiceId}`;
      this.commonService
        .getReportData(this.apiUrl)
        .subscribe((returns: any) => {
          if (returns.success && returns.data.length > 0) {
            this.bodyData = [];
            this.bodyData = returns.data;

            this.rtotalQuantity = 0;
            this.bodyData.forEach(
              (a) => (this.rtotalQuantity += parseFloat(a.invoiceQty))
            );

            this.rtotalGross = this.bodyData[0]["totalGross"];
            this.rtotalVat = this.bodyData[0]["totalVat"];
            this.rtotalAit = this.bodyData[0]["totalAit"];
            this.rshippingCost = this.bodyData[0]["shippingCost"];
            this.rtotalDiscountAmount = this.bodyData[0]["totalDiscountAmount"];
            this.rgrandTotal = this.bodyData[0]["grandTotal"];

            this.rPartyName = this.bodyData[0]["partyName"];
            this.rSalesInvoiceNo = this.bodyData[0]["salesInvoiceNo"];
            this.rInvoiceDate = this.bodyData[0]["salesInvoiceDate"];
            this.rPaymentDate = this.bodyData[0]["paymentDate"];

            this.setParam();
          } else {
            this.toastrService.danger(
              "Message",
              this.commonService.nodatafound
            );
          }
        });
    } catch (error) {
      this.toastrService.danger("Message", error);
    }
  }
  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Customer Name:",
      leftValue: this.rPartyName,
      rightLabel: "Invoice Date:",
      rightValue: this.rInvoiceDate,
    });
    this.params.push({
      leftLabel: "Invoice No.:",
      leftValue: this.rSalesInvoiceNo,
      rightLabel: "Payment Date:",
      rightValue: this.rPaymentDate,
    });
  }

  public generateReport(buttonAction: any, salesInvoiceId: number = 0) {
    //debugger;
    var fileName = this.pageNavigation + "." + buttonAction;
    this.getReportData(salesInvoiceId);
    const content = document.getElementById("reportHeader");
    this.commonService.generateSalesSerialNoReport(
      buttonAction,
      fileName,
      content
    );
  }

  public generateChallanReport(buttonAction: any, salesInvoiceId: number = 0) {
    //debugger;
    var fileName = this.pageNavigation + "." + buttonAction;
    this.getReportData(salesInvoiceId);
    const content = document.getElementById("reportHeaderChallan");
    this.commonService.generateChallanReport(buttonAction, fileName, content);
  }

  public generatePadReport(buttonAction: any, salesInvoiceId: number = 0) {
    //debugger;
    var fileName = this.pageNavigation + "." + buttonAction;
    this.getReportData(salesInvoiceId);
    const content = document.getElementById("reportHeaderPad");
    this.commonService.generatePadSalesReport(buttonAction, fileName, content);
  }

  //#endregion Report
}
