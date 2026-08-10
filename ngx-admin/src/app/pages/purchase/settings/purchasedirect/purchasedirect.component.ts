import {
  ChangeDetectorRef,
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
import { NavigationStart, Router } from "@angular/router";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { ElementRef } from "@angular/core";
import { StockinService } from "app/services/inventory/stockin.service";
import { NumberWithCommasPipe } from "../../../../@theme/pipes/number-with-commas.pipe";
import { ProductService } from "app/services/inventory/product.service";

@Component({
  selector: "ngx-purchasedirect",
  templateUrl: "./purchasedirect.component.html",
  styleUrls: ["./purchasedirect.component.scss"],
})
export class PurchasedirectComponent implements OnInit {
  public company: {
    name: string;
    address: string;
    custom_footer: boolean;
    phone: string;
    fax: string;
    email: string;
    website: string;
    vat: string;
    tin: string;
  };

  public purchaseFromList = [{id:3,name:"Direct"}]

  /////////////////////////////
  master: {
    purchaseOrderId: number;
    purchaseFromId: number;
    purOrderNo: string;
    purchaseOrderDate: Date;
    fromWarehouseId: number;
    supplierId: number;
    purpose: string;
    grossAmount: number;
    totalVat: number;
    totalAit: number;
    totalDiscount: number;
    freightCharge: number;
    netAmount: number;
    isActive:number;

    uomName: string;
    uomId: number;
    productId: number;
    productWiseSpecificationId: number;
    productName: string;
    productSpecSelected: {};

    price: number;
    invoiceQty: number;
    vat: number;
    ait: number;
    discountPercent: number;
    total: number;

    termsAndConditions: string;
    supplierName: string;

    addressLine: string;
    contactPerson: string;
    contactNumber: string;
    email: string;
    sbuId: number;

    lcNo: string;
    refNo: string;
    transactionTypeId: number;

    transactionTypeSelected: {};
    FromWarehouseSelected: {};

    purchasereqselected: {};
    supplierSelected: {};
    purchaseFromSelected:{}

    lstPurOrderDetailsViewModel: any[];
    poWiseTermsAndConditions: any[];
    isAutoStock: number;
    productTypeId: number;
  };

  public sbus = [];

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
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Direct Purchase";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.getMaxPurchaseorderno(new Date());
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");
      this.save();
      // this.show = true;
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
      purchaseOrderId: 0,
      purchaseFromId: 0,
      purOrderNo: "",
      purchaseOrderDate: new Date(),
      fromWarehouseId: 0,
      supplierId: 0,
      purpose: "",
      grossAmount: 0,
      totalVat: 0,
      totalAit: 0,
      totalDiscount: 0,
      freightCharge: 0,
      netAmount: 0,
      isActive:1,
      uomName: "",
      uomId: 0,
      productId: 0,

      lcNo: "",
      refNo: "",
      transactionTypeId: 0,

      transactionTypeSelected: null,
      productWiseSpecificationId: 0,
      productName: "",
      productSpecSelected: null,

      price: 0,
      invoiceQty: 0,
      vat: 0,
      ait: 0,
      discountPercent: 0,
      total: 0,

      termsAndConditions: "",
      FromWarehouseSelected: null,

      supplierSelected: null,
      supplierName: null,
      purchasereqselected: null,
      addressLine: "",
      contactPerson: "",
      contactNumber: "",
      email: "",
      sbuId: 0,
      lstPurOrderDetailsViewModel: [],
      poWiseTermsAndConditions: [],
      isAutoStock: 0,


      purchaseFromSelected: null,
      productTypeId:0
    };

    this.sbuIdSelected = {};
    this.storeSlected = {};
    this.master.transactionTypeSelected = {};
    this.GetAutoStockInOutStatus();
    this.master.purchaseFromSelected = {id:3,name:"Direct"}
    this.master.purchaseFromId = 3
  }

  public companyItems = [];

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
    var button = this.commonService.buttonClicked;
    if (this.master.purchaseOrderDate == null) {
      this.toastrService.danger("Please enter purchase order date.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.purOrderNo == "" || this.master.purOrderNo == null) {
      this.toastrService.danger("Please enter purchase order no.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }
    // if (
    //   this.master.fromWarehouseId == 0 ||
    //   this.master.fromWarehouseId == null
    // ) {
    //   this.toastrService.danger("Please select store name.", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }
    if (this.master.supplierId == 0 || this.master.supplierId == null) {
      this.toastrService.danger("Please select supplier name.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (
      this.master.lstPurOrderDetailsViewModel.length == 0 ||
      this.master.lstPurOrderDetailsViewModel == null
    ) {
      this.toastrService.danger("Please add product.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (
      this.master.transactionTypeId == 0 ||
      this.master.transactionTypeId == null
    ) {
      this.toastrService.danger("Please select a Transaction Type", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    this.show = true;
    // this.PurchaseorderService.savePurchaseMaster(this.master).subscribe(
    this.PurchaseorderService.savePurchaseOrder(this.master).subscribe(
      (returns: any) => {
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
          //////////////Grid Refresh ///////////////////

          this.getMaster();
          this.PurchaseorderService.getPurchaseOrder(0,3).subscribe(
            (data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            }
          );

          
          //////////////Grid Refresh ///////////////////
        }
      }
    );
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
  public tableHeader = ["#", "Req. Qty", "Price", "Ship To", "Bill To"];
  public termsandcondition = ["Terms And Conditions"];
  public selectdetailRows = [];
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
    private PurchaseorderService: PurchaseorderService,
    private productrequisitionService: ProductrequisitionService,
    private comboService: CommoncomboService,
    private productService: ProductService,
    private stockinService: StockinService
  ) {
    this.getSBU(0);
    this.commonService.valueSet("showlist");
    this.getAllProductForRequisition();
    this.getSupplier();
    this.getMaxPurchaseorderno(new Date());
    this.GetTransactionType();
    this.getProductType();
    // this information is get from DB for next time
    this.company = {
      name: "One Information And Communications Technology Ltd",
      address: "14/A, Center Point Concord Unit-10A & B Tejgaon, Dhaka - 1215",
      custom_footer: true,
      phone: "01704-055668",
      fax: "02-98765432",
      email: "info@one-ict.com",
      website: "www.one-ict.com",
      vat: "13145664564",
      tin: "00000000000",
    };

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
        headerName: "Order No.",
        field: "purOrderNo",
        width: 160,
      },
      {
        headerName: "Purchase Date",
        field: "purchaseOrderDate",
        width: 140,
      },
      {
        headerName: "Gross Amount",
        field: "grossAmount",
        width: 150,
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.grossAmount),
        type: "rightAligned",
      },
      {
        headerName: "Net Amount",
        field: "netAmount",
        width: 150,
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.netAmount),
        type: "rightAligned",
      },
      // {
      //   headerName: "Branch Name",
      //   field: "sbuName",
      //   width: 160,
      // },
      {
        headerName: "Supplier Name",
        field: "supplierName",
        width: 160,
      },
      {
        headerName: "purpose",
        field: "purpose",
        width: 160,
      },

      {
        field: "Action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) { },
        },
        minWidth: 250,
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
      editable: true,
    };
    this.getMaster();
  }

  public getMaxPurchaseorderno(date: Date) {
    this.PurchaseorderService.getmaxPurchaseOrder(
      date.toDateString().substring(4, 15)
    ).subscribe((returns: any) => {
      if (returns.success) {
        this.master.purOrderNo = returns.data[0].MaxNo;
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
          console.log(returns.data);
        }
      }
    );
  }
  public GetAutoStockInOutStatus() {
    this.PurchaseorderService.GetAutoStockInOutSettingStatusById(1).subscribe(
      (returns: any) => {
        if (returns.success) {
          this.master.isAutoStock = returns.data[0].isAutoStock;
        }
      }
    );
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.PurchaseorderService.GetPurchaseById(0).subscribe((data: any) => {
    //   if (data.success) {
    //     this.rowData = data.data;
    //   }
    // });

    this.PurchaseorderService.getPurchaseOrder(0,3).subscribe(
      (data: any) => {
        if (data.success) {
          this.rowData = data.data;
        }
      }
    );
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
      var purchaseOrderId = event.node.data.purchaseOrderId;

      // this.PurchaseorderService.getPurchaseOrder(0,0).subscribe(
      //   (data: any) => {
      //     if (data.success) {
      //       this.rowData = data.data;
      //     }
      //   }
      // );
      this.PurchaseorderService.getPurchaseOrder(purchaseOrderId,3).subscribe(
        (data: any) => {
          if (data.success) {
            this.master = data.data[0];
            console.log(this.master);
            this.getSBU(0);
            this.getPurchaseOrderDetailsInUpdate();
            this.getTermsAndConditionSupplierIdWiseInUpdate(purchaseOrderId);

            // this.sbuIdSelected = {
            //   id: data.data[0].sbuId,
            //   name: data.data[0].sbuName,
            // };
            // this.getStore();

            let purchaseForm = this.purchaseFromList.filter(x=>x.id == this.master.purchaseFromId)[0];
            if(purchaseForm){
              this.master.purchaseFromSelected = {
                id: purchaseForm.id,
                name: purchaseForm.name,
              };
            }

            this.master.supplierSelected = {
              id: data.data[0].supplierId,
              name: data.data[0].supplierName,
            };

            this.master.transactionTypeSelected = {
              id: data.data[0].transactionTypeId,
              name: data.data[0].transactionTypeName,
            };
            //this.calculateGrandTotal();
          }
        }
      );
      this.ngOnInit();
    }
  }

  private agDelete(event) {
    var result = confirm("Are you sure you want to delete that?");
    if (result) {
      this.master.purchaseOrderId = event.node.data.purchaseOrderId;
      this.PurchaseorderService.deletePurchaseOrderById(
        this.master.purchaseOrderId
      ).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          // this.PurchaseorderService.GetPurchaseById(
          //   this.master.purchaseOrderId
          // ).subscribe((data: any) => {
          //   if (data.success) {
          //     this.rowData = data.data;
          //   }
          // });

          this.PurchaseorderService.getPurchaseOrder(0,3).subscribe(
            (data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            }
          );
          //////////////Grid Refresh ///////////////////
        }
      });
    }
  }
  //////////////////////////////////End of Ag Grid Data Load/////////////////////////////////

  @Output() myEvent = new EventEmitter();

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

  //////////// Open Modal ////////////////

  names: any;

  openWithDataModel() {
    this.dialogService
      .open(DialogNamePromptComponent)
      .onClose.subscribe((name) => name && this.names.push(name));
  }
  /////////////////////////////

  public currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  sbuId: number = 0;
  sbuIdSelected = {};
  public getSBU(companyId) {
    //this.master.sbusSelected = null;
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.sbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }
  public StoreList = [];
  storeSlected = {};
  public getStore() {
    this.stockinService.getStore(this.sbuId, 0).subscribe((returns: any) => {
      this.StoreList = returns.data.map((val) => ({
        id: val.storeId,
        name: val.storeName,
      }));
    });
  }

  // public getSupplier() {
  //   this.PurchaseorderService.getProductsupplier().subscribe((retuns: any) => {
  //     if (retuns.success) {
  //       this.supplierList = retuns.data.map((val: any) => ({
  //         id: val.supplierId,
  //         name: val.supplierName,
  //       }));
  //     }
  //   });
  // }

  supplierList = [];
  public getSupplier() {
    //this.master.supplierSelected = null;
    this.supplierList = null;
    this.comboService.GetSupplierForDropdown().subscribe((returns: any) => {
      this.supplierList = returns.data.map((val) => ({
        id: val.partyId,
        name: val.partyName,
      }));
    });
  }

  public productTypeList = [];
  public getProductType() {
    this.productService.getProductType().subscribe((retuns: any) => {
      if (retuns.success) {
        this.productTypeList = retuns.data.map((val: any) => ({
          id: val.productTypeId,
          name: val.productTypeName,
        }))
      }
    })
  }

  public getProductSpecDetails() {
    this.master.productId = this.master.productSpecSelected["productId"];
    this.master.price = this.master.productSpecSelected["price"];
    this.master.uomName = this.master.productSpecSelected["uomName"];
    this.master.productName = this.master.productSpecSelected["name"];
    this.master.productWiseSpecificationId = this.master.productSpecSelected["id"];
  }

  public productSpecList = [];
  public getAllProductForRequisition() {
    // this.productrequisitionService
    //   .getAllProductForRequisition()
    //   .subscribe((returns: any) => {
    //     this.productSpecList = returns.data.map((val: any) => ({
    //       id: val.productWiseSpecificationId,
    //       name: val.productName,
    //       uomId: val.uomId,
    //       uomName: val.uomName,
    //       productId: val.productId,
    //       price: val.price,
    //     }));
    //   });
  }
  clearProductDetails(){
    this.master.productSpecSelected ={};
    this.master.productId = 0;
    this.master.price = 0;
    this.master.uomName = "";
    this.master.productName = "";
    this.master.productWiseSpecificationId = 0;
  }

  public prodSelected = [];
  public getTypeWiseProducts(productId,productTypeId) {
    this.productSpecList =[];
    
    this.clearProductDetails();
    this.productService.getTypeWiseProducts(productId,productTypeId).subscribe((returns: any) => {
        this.productSpecList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uomId: val.uomId,
          uomName: val.uomName,
          productId: val.productId,
          price: val.price,
        }));
      });
  }

  public getAllProductRequisition() {
    this.productrequisitionService.getAllProductForRequisition().subscribe((returns: any) => {
        this.productSpecList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uomId: val.uomId,
          uomName: val.uomName,
          productId: val.productId,
          price: val.price,
        }));
      });
  }

  public Clear() {
    this.master.lstPurOrderDetailsViewModel = [];
  }

  public addToDetailsGrid() {
    //debugger;
    if (this.master.productSpecSelected == null) {
      this.toastrService.danger("Please select product", "Message");
      return;
    }
    if (this.master.invoiceQty == 0) {
      this.toastrService.danger("Please insert quantity", "Message");
      return;
    }
    if (this.master.price == 0) {
      this.toastrService.danger("Please insert price", "Message");
      return;
    }

    var RowCount = this.master.lstPurOrderDetailsViewModel.length;
    for (let i = 0; i < RowCount; i++) {
      //debugger;
      var _productWiseSpecificationId =
        this.master.lstPurOrderDetailsViewModel[i].productWiseSpecificationId;
      if (
        _productWiseSpecificationId == this.master.productWiseSpecificationId
      ) {
        this.toastrService.danger(
          "You have already added this product",
          "Message"
        );
        return;
      }
    }

    let totalPrice =
      (this.master.invoiceQty == null ? 0 : this.master.invoiceQty) *
      (this.master.price == null ? 0 : this.master.price);

    let vatAmount =
      totalPrice * ((this.master.vat == null ? 0 : this.master.vat) / 100);
    let aitAmount =
      totalPrice * ((this.master.ait == null ? 0 : this.master.ait) / 100);
    let discountAmount =
      (totalPrice + vatAmount + aitAmount) *
      ((this.master.discountPercent == null ? 0 : this.master.discountPercent) /
        100);

    //this.master.total = ((totalPrice + vatAmount + aitAmount) - discountAmount);
    this.master.total = totalPrice;

    let elements = {
      purchaseOrderDetailsId: 0,
      purchaseOrderId: this.master.purchaseOrderId,
      productWiseSpecificationId: this.master.productWiseSpecificationId,
      productId: this.master.productId,
      productName: this.master.productName,
      uomId: this.master.uomId,
      uomName: this.master.uomName,
      reqQty: this.master.invoiceQty,

      price: this.master.price,
      totalPricewithQty:totalPrice,
      vatPercent: this.master.vat,
      aitPercent: this.master.ait,
      discountPercent: this.master.discountPercent,

      vatAmount: vatAmount,
      aitAmount: aitAmount,
      discountAmount: discountAmount,

      //totalAmount: this.master.total,
      totalAmount: (this.master.total+vatAmount+aitAmount)-discountAmount,
      //isActive: 1,
    };
    this.master.lstPurOrderDetailsViewModel.push(elements);
    this.calculateGrandTotal();
  }

  calculateGrandTotal() {
    let grossAmount = 0;
    let totalVat = 0;
    let totalAit = 0;
    let totalDiscount = 0;
    this.master.lstPurOrderDetailsViewModel.forEach((row) => {
      var totalPrice=row.price==""||row.price==null ? 0 : row.price;
      var totalReqQty=row.reqQty==""||row.reqQty==null ? 0 : row.reqQty;
      var totalGrossAmount=totalPrice*totalReqQty;
      grossAmount +=totalGrossAmount;
        //row.totalAmount == "" || row.totalAmount == null ? 0 : row.totalAmount;
      totalVat +=
        row.vatAmount == "" || row.vatAmount == null ? 0 : row.vatAmount;
      totalAit +=
        row.aitAmount == "" || row.aitAmount == null ? 0 : row.aitAmount;
      totalDiscount +=
        row.discountAmount == "" || row.discountAmount == null
          ? 0
          : row.discountAmount;
    });

    let freightCharge =
      this.master.freightCharge == null ? 0 : this.master.freightCharge;

    this.master.grossAmount = this.commonService.roundWithDecimalPoint(grossAmount,2);
    this.master.totalVat = this.commonService.roundWithDecimalPoint(totalVat,2);
    this.master.totalAit = this.commonService.roundWithDecimalPoint(totalAit,2);
    this.master.totalDiscount = this.commonService.roundWithDecimalPoint(totalDiscount,2);
    this.master.netAmount =this.commonService.roundWithDecimalPoint(
      grossAmount + totalVat + totalAit + freightCharge - totalDiscount,2)
  }

  public calculateTotal(index: any) {
    let vatAmount = 0;
    let aitAmount = 0;
    let discountAmount = 0;
    let totalPrice = 0;

    let reqQty =
      this.master.lstPurOrderDetailsViewModel[index].reqQty == ""
        ? 0
        : this.master.lstPurOrderDetailsViewModel[index].reqQty;
    let price =
      this.master.lstPurOrderDetailsViewModel[index].price == ""
        ? 0
        : this.master.lstPurOrderDetailsViewModel[index].price;
    let vatPercent =
      this.master.lstPurOrderDetailsViewModel[index].vatPercent == ""
        ? 0
        : this.master.lstPurOrderDetailsViewModel[index].vatPercent;
    let aitPercent =
      this.master.lstPurOrderDetailsViewModel[index].aitPercent == ""
        ? 0
        : this.master.lstPurOrderDetailsViewModel[index].aitPercent;
    let discountPercent =
      this.master.lstPurOrderDetailsViewModel[index].discountPercent == ""
        ? 0
        : this.master.lstPurOrderDetailsViewModel[index].discountPercent;

    totalPrice = reqQty * price;
    vatAmount = totalPrice * (vatPercent / 100);
    aitAmount = totalPrice * (aitPercent / 100);
    discountAmount =
      (totalPrice + vatAmount + aitAmount) * (discountPercent / 100);

    this.master.lstPurOrderDetailsViewModel[index].totalPricewithQty = totalPrice;
    this.master.lstPurOrderDetailsViewModel[index].vatAmount = vatAmount;
    this.master.lstPurOrderDetailsViewModel[index].aitAmount = aitAmount;
    this.master.lstPurOrderDetailsViewModel[index].discountAmount =
      discountAmount;
    this.master.lstPurOrderDetailsViewModel[index].totalAmount = (totalPrice+vatAmount+aitAmount)-discountAmount;

    this.calculateGrandTotal();
  }

  public deleteDetails(index: any) {
    // this.PurchaseorderService.deletePurchaseOrderDetailsById(this.master.lstPurOrderDetailsViewModel[index].purchaseOrderDetailsId).subscribe((returns: any) => {
    //   if (returns.success) {
    //     this.toastrService.success(this.commonService.deletedmsg, "Message");
    //   }
    // });

    // this.selectedRow = this.master.lstPurOrderDetailsViewModel[index];
    // this.master.lstPurOrderDetailsViewModel.splice(index, 1);
    // if (this.selectedRow.helpDetailId > 0) { }
    // this.toastrService.danger(this.commonService.deletedmsg, "Message");

    this.selectedRow = this.master.lstPurOrderDetailsViewModel[index];
    this.master.lstPurOrderDetailsViewModel.splice(index, 1);

    var index1 = this.master.lstPurOrderDetailsViewModel.findIndex(
      (x) =>
        x.productWiseSpecificationId == this.master.productWiseSpecificationId
    );
    if (index1 > -1) {
      this.master.lstPurOrderDetailsViewModel.splice(index1, 1);
    }
    this.toastrService.danger(this.commonService.deletedmsg, "Message");

    this.calculateGrandTotal();
  }

  public addTC() {
    //debugger;
    let elements: any = [];
    if (this.master.termsAndConditions == "") {
      this.toastrService.danger("Terms And Condition is empty !", "Message");
      return;
    }
    if (this.master.supplierSelected == "") {
      this.toastrService.danger("Please add Supplier!", "Message");
      return;
    }

    elements = {
      termsAndConditions: this.master.termsAndConditions,
      supplierId: this.master.supplierId,
      supplierName: this.master.supplierSelected["name"],
    };
    this.master.poWiseTermsAndConditions.push(elements);
  }

  public getPurchaseOrderDetailsInUpdate() {
    this.PurchaseorderService.getPurchaseOrderDetailsInUpdate(
      this.master.purchaseOrderId
    ).subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        if (data.data.length > 0) {
          for (let index = 0; index < data.data.length; index++) {
            this.master.lstPurOrderDetailsViewModel = data.data;
          }
        } else {
          this.master.lstPurOrderDetailsViewModel = [];
        }
      }
    });
  }

  public getTermsAndConditionSupplierIdWise(supplierId) {
    this.PurchaseorderService.getTermsAndConditionSupplierIdWise(
      supplierId
    ).subscribe((data: any) => {
      if (data.success) {
        this.master.poWiseTermsAndConditions = data.data;
      }
    });
  }

  public getTermsAndConditionSupplierIdWiseInUpdate(purchaseOrderId) {
    this.PurchaseorderService.getTermsAndConditionPOIdWiseInUpdate(
      purchaseOrderId
    ).subscribe((data: any) => {
      if (data.success) {
        this.master.poWiseTermsAndConditions = data.data;
      }
    });
  }

  public clearTermsAndConditions() {
    this.master.poWiseTermsAndConditions = [];
  }

  public AddTermsAndConditions() {
    let detail = {
      termsAndConditions: this.master.termsAndConditions,
      Active: 1,
      supplierId: this.master.supplierId,
      supplierName: this.master.supplierSelected["name"],
    };
    this.master.poWiseTermsAndConditions.push(detail);
  }

  public DeleteTAndCdetail(index: any) {
    this.selectedRow = this.master.poWiseTermsAndConditions[index];
    this.master.poWiseTermsAndConditions.splice(index, 1);
    if (this.selectedRow.helpDetailId > 0) {
    }
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }

  private agReport(event) {
    //this.generateVoucherReport(event.data.purchaseOrderId);
    this.getReportData(event.data.purchaseOrderId);
  }

  public subTotal = 0;
  public discount = 0;
  public vat = 0;
  public tax = 0;
  public grandTotal = 0;
  public grandTotalInWord = "";
  public grossAmount = 0;
  public totalVat = 0;
  public totalAit = 0;
  public totalDiscount = 0;
  public freightCharge = 0;
  public netAmount = 0;
  public netAmountInWord = "";

  public LcNo = "";
  public RefNo = "";
  public paymentMode = "";

  public bodyData: any = [];

  public masterData: any = [];
  public detailsData: any = [];
  public termsAndconditionData: any = [];

  public datalength: number;
  public purOrderNo = "";
  public purchaseOrderDate = "";
  public price = "";
  public params = [];
  public test =
    " 1. Material should be delivered in good condition & within the schedule";

  private getReportData(purchaseOrderId) {
    //debugger;
    this.PurchaseorderService.getPurchaseOrder(purchaseOrderId,3).subscribe(
      (returns: any) => {
        if (returns.success) {
          this.masterData = returns.data;
          debugger;
          //this.datalength = returns.data.length * 50;
          this.purOrderNo = this.masterData[0].purOrderNo;

          this.purchaseOrderDate = this.masterData[0].purchaseOrderDate;
          this.grandTotal = this.masterData[0].TotalAmount;
          this.grandTotalInWord = this.masterData[0].TotalAmountInWord;
          this.grossAmount = this.masterData[0].grossAmount;
          this.totalVat = this.masterData[0].totalVat;
          this.totalAit = this.masterData[0].totalAit;
          this.totalDiscount = this.masterData[0].totalDiscount;
          this.freightCharge = this.masterData[0].freightCharge;
          this.netAmount = this.masterData[0].netAmount;
          this.netAmountInWord = this.masterData[0].netAmountInWord;
          this.LcNo = this.masterData[0].lcNo;
          this.RefNo = this.masterData[0].refNo;
          this.paymentMode = this.masterData[0].transactionTypeName;
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      }
    );

    this.PurchaseorderService.getTermsAndConditionPOIdWiseInUpdate(
      purchaseOrderId
    ).subscribe((returns: any) => {
      if (returns.success) {
        this.termsAndconditionData = returns.data;
        //this.datalength = returns.data.length * 50;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });

    this.PurchaseorderService.getPurchaseOrderDetailsData(
      purchaseOrderId
    ).subscribe((returns: any) => {
      if (returns.success) {
        this.detailsData = returns.data;
        this.datalength = returns.data.length * 50;
        var fileName = this.pageNavigation + ".pdf";
        const content = document.getElementById("reportHeader");
        //console.log("reportHeader");
        //console.log(content);
        this.generateReport("print", fileName, content, this.datalength);
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Budget No",
      leftValue: "",
      rightLabel: "Budget Date",
      rightValue: "",
    });
    this.params.push({ leftLabel: "Fiscal Year", leftValue: "" });
  }

  public generateReport(
    buttonAction: any,
    fileName: string,
    content: any,
    datalength: number
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5);
    doc.setTextColor(40);

    var legend = {
      height: 100,
      totalheight: 100 + datalength,
    };
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
          html: "#header_table",
          theme: "grid",
          startY: legend.height + 20,
          //styles: { font: "Meta" },

          columnStyles: {
            2: { halign: "center", valign: "middle", fontSize: 12 },
          },
          // styles:{
          //   valign: "middle"
          // },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 350,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            //font: "arial",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [105, 105, 105],
            fontSize: 11,
          },
          bodyStyles: {
            //fillColor: [216, 216, 216],
            textColor: 50,
            //vertical-align: middle,1
            // halign:"right"
          },
          columnStyles: {
            2: { halign: "right" },
            0: { halign: "center" },
            4: { halign: "right" },
            5: { halign: "right" },
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
        });

        addFooters(doc);

        ////////////PRINT ////////////
        if (buttonAction == "pdf") {
          doc.save(fileName);
        } else {
          doc.setProperties({
            title: fileName,
          });
          window.open(URL.createObjectURL(doc.output("blob")), "_blank"); //doc.output("dataurlnewwindow");
          doc.close();
        }
      },
    });
  }
}
