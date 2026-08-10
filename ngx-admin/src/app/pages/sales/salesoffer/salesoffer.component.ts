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
import { BranchService } from "app/services/erpsetting/branch.service";
import { from } from "rxjs";
import { Console } from "node:console";
import { SalesofferService } from "app/services/sales/salesoffer.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: "ngx-salesoffer",
  templateUrl: "./salesoffer.component.html",
  styleUrls: ["./salesoffer.component.scss"],
})
export class SalesofferComponent implements OnInit {
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
    ////debugger;
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Sales Offer";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      if (this.validationForMasterSave() == false) {
        this.commonService.valueSet("create");
        return;
      }
      this.save();
      this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      if (this.validationForMasterSave() == false) {
        this.commonService.valueSet("edit");
        return;
      }
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

  //salesOfferId, salesOfferNo, salesOfferDate, paymentDate, partyId, mobileNo, alternateMobileNo, address, totalGross, totalVat, totalAit, shippingCost, totalDiscountAmount, grandTotal, approvalStatus, isActive, isDelete, createdBy, createdAt, updateBy, updateAt

  master: {
    salesOfferId: number;
    salesOfferNo: string;
    salesOfferDate: Date;
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

    uomName: string;
    uomId: number;
    productId: number;
    productWiseSpecificationId: number;
    productName: string;
    productSpecSelected: {};

    price: number;
    salesOfferQty: number;
    vat: number;
    ait: number;
    discountAmount: number;
    total: number;

    termsAndCondition: string;

    currentStock: number;
    storeSlected: {};

    lstDetailsViewModel: any[];
    //tcLstDetailsViewModel: any[];
  };

  public getMaster() {
    this.master = {
      salesOfferId: 0,
      salesOfferNo: "",
      salesOfferDate: new Date(),
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

      uomName: "",
      uomId: 0,
      productId: 0,
      productWiseSpecificationId: 0,
      productName: "",
      productSpecSelected: null,

      price: 0,
      salesOfferQty: 1,
      vat: 0,
      ait: 0,
      discountAmount: 0,
      total: 0,

      termsAndCondition: "",

      currentStock: 0,
      storeSlected: null,

      lstDetailsViewModel: [],
      //tcLstDetailsViewModel: [],
    };
    this.getMaxNo();
    this.getCompanyAndPType();
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
    var button = this.commonService.buttonClicked;
    this.beforeSave();
    // console.log(this.master);
    this.master.salesOfferDate = this.commonService.DateFormat(this.master.salesOfferDate);
    this.master.paymentDate = this.commonService.DateFormat(this.master.paymentDate);
    this.salesofferService
      .SaveSalesOffer(this.master)
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
          this.salesofferService.GetSalesOfferById(0).subscribe((data: any) => {
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

  beforeSave() {
    this.master.lstDetailsViewModel.forEach((element) => {
      element.imageFile = null;
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
    private salesofferService: SalesofferService,
    private datePipe: DatePipe,
    private salesinvoiceService: SalesinvoiceService
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
        headerName: "Offer No.",
        field: "salesOfferNo",
        width: 150,
      },
      {
        headerName: "Offer Date",
        field: "salesOfferDate",
        width: 130,
      },
      {
        headerName: "Customer Name",
        field: "partyName",
        width: 180,
      },
      {
        headerName: "Mobile",
        field: "mobileNo",
        width: 150,
      },
      {
        headerName: "Address",
        field: "address",
        width: 260,
      },
      {
        headerName: "Gross Total",
        field: "totalGross",
        width: 130,
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.totalGross),
        type: "rightAligned",
      },
      {
        headerName: "Net Total",
        field: "grandTotal",
        width: 130,
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.grandTotal),
        type: "rightAligned",
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
    };
    ////debugger;
    this.getMaster();
    this.getMaxNo();
    this.getStore();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.salesofferService.GetSalesOfferById(0).subscribe((data: any) => {
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
      var salesOfferId = event.node.data.salesOfferId;
      ////debugger;
      this.getStore();
      this.salesofferService
        .GetSalesOfferById(salesOfferId)
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

            this.salesofferService
              .GetSalesOfferDetailsByMasterId(salesOfferId)
              .subscribe((data: any) => {
                if (data.success) {
                  this.master.lstDetailsViewModel = data.data;
                  console.log(this.master);
                }

                // this.salesofferService.GetSalesOfferTCByMasterId(salesOfferId).subscribe((data: any) => {
                //   if (data.success) {
                //     this.master.tcLstDetailsViewModel = data.data;
                //     console.log(this.master);
                //   }
                // });
                // this.master.productSpecSelected = {
                //   id: this.master.productWiseSpecificationId,
                //   name: this.master.productName,
                // };

                this.master.vat = 0;
                this.master.ait = 0;
                this.master.price = 0;
                this.master.salesOfferQty = 1;
                this.master.discountAmount = 0;
                this.calculateGrandTotal();
              });
          }
          this.master.salesOfferDate = new Date(this.master.salesOfferDate);
          this.master.paymentDate = new Date(this.master.paymentDate);
        });
      this.ngOnInit();
    }
  }

  private agReport(event) {
    this.generateReport("print", event.data.salesOfferId);
  }
  private agDelete(event) {
    this.master.salesOfferId = event.node.data.salesOfferId;
    this.salesofferService
      .DeleteSalesOfferById(this.master.salesOfferId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          this.salesofferService.GetSalesOfferById(0).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
        }
      });
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
    // this.salesofferService.GetCurrentStock(this.master.storeId, this.master.productWiseSpecificationId).subscribe((returns: any) => {
    //   if (returns.success) {
    //     this.master.currentStock = returns.data[0].length == 0 ? 0 : returns.data[0].currentStock;
    //   }
    // });
    //this.validateOfferQty();
  }

  public validateOfferQty() {
    if (
      this.master.salesOfferQty == null
        ? 0
        : this.master.salesOfferQty > this.master.currentStock
    )
      this.master.salesOfferQty = 0;
  }

  public getMaxNo() {
    this.salesofferService
      .GetMaxSalesOfferNumber(
        this.datePipe.transform(this.master.salesOfferDate, "yyyy-MM-dd")
      )
      .subscribe((returns: any) => {
        if (returns.success) {
          this.master.salesOfferNo = returns.data[0].MaxNo;
        }
      });
  }

  public partyList = [];
  public GetAllPartysByTypeId(partyTypeId: any) {
    this.salesofferService
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

  productImageFile: string;
  getProductImage(imageUrl: string) {
    this.productImageFile = "";
    this.salesofferService
      .getProductImage(imageUrl)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.productImageFile = returns.data[0].ImageFile;
        }
      });
  }

  public getProductSpecDetails() {
    this.getProductImage(this.master.productSpecSelected["imageUrl"]);
    this.master.productId = this.master.productSpecSelected["productId"];
    this.master.price = this.master.productSpecSelected["price"];
    this.master.uomName = this.master.productSpecSelected["uomName"];
    this.master.productName = this.master.productSpecSelected["name"];
    this.master.productWiseSpecificationId =
      this.master.productSpecSelected["id"];
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
          imageUrl: val.imageUrl,
        }));
      });
  }

  public calculateTotal(index: any) {
    let totalPrice = 0;
    let salesOfferQty =
      this.master.lstDetailsViewModel[index].salesOfferQty == ""
        ? 0
        : this.master.lstDetailsViewModel[index].salesOfferQty;
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

    totalPrice = salesOfferQty * price;
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

  validationForMasterSave(): boolean {
    if (this.master.partySelected == null) {
      this.toastrService.warning("Please select a Customer.", "Message");
      return false;
    }
    if (this.master.mobileNo == null || this.master.mobileNo == "0") {
      this.toastrService.warning("Please input a Mobile No.", "Message");
      return false;
    }
    if (this.master.address == null || this.master.address.trim() == "") {
      this.toastrService.warning("Please input a address.", "Message");
      return false;
    }
    if (
      this.master.lstDetailsViewModel.length == 0 ||
      this.master.lstDetailsViewModel == null
    ) {
      this.toastrService.warning("Please add at least one product.", "Message");
      return false;
    }

    return true;
  }

  public addToDetailsGrid() {
    ////debugger;
    if (
      this.master.productSpecSelected == null ||
      this.master.productSpecSelected["id"] == null ||
      this.master.productSpecSelected["id"] == undefined
    ) {
      this.toastrService.warning("Please select a Product", "Message");
      return;
    }
    if (this.master.price == 0 || this.master.price == null) {
      this.toastrService.warning("price is zero.", "Message");
      return;
    }
    if (this.master.salesOfferQty == 0 || this.master.salesOfferQty == null) {
      this.toastrService.warning("Offer Quantity is zero.", "Message");
      return;
    }

    let totalPrice =
      this.master.salesOfferQty == null
        ? 0
        : this.master.salesOfferQty * this.master.price == null
          ? 0
          : this.master.price;
    totalPrice =
      totalPrice -
      totalPrice *
      ((this.master.discountAmount == null ? 0 : this.master.discountAmount) /
        100);
    let vat =
      totalPrice * (this.master.vat == null ? 0 : this.master.vat / 100);
    let ait =
      totalPrice * (this.master.vat == null ? 0 : this.master.vat / 100);
    //let discountAmount = (totalPrice * (this.master.discountAmount / 100));

    this.master.total = totalPrice + vat + ait;

    let elements = {
      salesInvDetailsId: 0,
      salesOfferId: this.master.salesOfferId,
      productWiseSpecificationId: this.master.productWiseSpecificationId,
      productId: this.master.productId,
      productName: this.master.productName,
      uomId: this.master.uomId,
      uomName: this.master.uomName,
      salesOfferQty: this.master.salesOfferQty,

      price: this.master.price,
      vat: this.master.vat,
      ait: this.master.ait,
      discountAmount: this.master.discountAmount,
      total: this.master.total,
      isActive: 1,
      isSelect: 1,
      imageFile: this.productImageFile,
    };
    this.master.lstDetailsViewModel.push(elements);
    this.calculateGrandTotal();
    this.master.productSpecSelected = null;
  }

  public addTC() { }

  public refeshDetails() {
    this.master.lstDetailsViewModel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
  }

  @Output() myEvent = new EventEmitter();

  public deleteRow(state, action) {
    ////debugger;
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
    this.salesofferService
      .DeleteSalesOfferDetailsById(
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

  public currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
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

  public rPartyName: string = "";
  public rcontactNumber = "";
  public raddressLine = "";
  public rOfficeName = "";
  public rSalesOfferNo: string = "";
  public rOfferDate: string = "";
  public rPaymentDate: string = "";

  public rtotalGross: number = 0;
  public rtotalVat: number = 0;
  public rtotalAit: number = 0;
  public rshippingCost: number = 0;
  public rtotalDiscountAmount: number = 0;
  public rgrandTotal: number = 0;

  public rReportHeader = "Sales Offer Report";
  public tableHeader = [
    "#",
    "Product Name",
    "Image",
    "UOM",
    "Offer Qty.",
    "Price",
    "VAT (%)",
    "AIT (%)",
    "Discount (%)",
    "Total",
  ];
  public apiUrl = "";
  public htmlBodyData: string = "";

  public bodyData: any = [];
  public bodyDatashow: any = [];

  // private getReportData(salesOfferId: number) {
  //   try {
  //     this.apiUrl = `SalesOffer/GetSalesOfferReportDataById?salesOfferId=${salesOfferId}`;
  //     this.commonService
  //       .getReportData(this.apiUrl)
  //       .subscribe((returns: any) => {
  //         if (returns.success && returns.data.length > 0) {
  //           this.bodyData = [];
  //           this.bodyData = returns.data;
  //           //console.log(this.bodyData)

  //           this.rtotalGross = this.bodyData[0]["totalGross"];
  //           this.rtotalVat = this.bodyData[0]["totalVat"];
  //           this.rtotalAit = this.bodyData[0]["totalAit"];
  //           this.rshippingCost = this.bodyData[0]["shippingCost"];
  //           this.rtotalDiscountAmount = this.bodyData[0]["totalDiscountAmount"];
  //           this.rgrandTotal = this.bodyData[0]["grandTotal"];

  //           this.rPartyName = this.bodyData[0]["partyName"];
  //           this.rcontactNumber = this.bodyData[0].mobileNo;
  //           this.raddressLine = this.bodyData[0].address;
  //           this.rOfficeName = this.bodyData[0].officeName;
  //           this.rSalesOfferNo = this.bodyData[0]["salesOfferNo"];
  //           this.rOfferDate = this.bodyData[0]["salesOfferDate"];
  //           this.rPaymentDate = this.bodyData[0]["paymentDate"];
  //         } else {
  //           this.toastrService.warning(
  //             "Message",
  //             this.commonService.nodatafound
  //           );
  //         }
  //       });
  //   } catch (error) {
  //     this.toastrService.danger("Message", error);
  //   }
  // }

  // public generateReport(buttonAction: any, salesOfferId: number = 0) {
  //   ////debugger;
  //   var fileName = this.pageNavigation + "." + buttonAction;
  //   this.getReportData(salesOfferId);
  //   const content = document.getElementById("reportHeader");
  //   // if (this.bodyData.length == 0) {
  //   //   this.toastrService.warning("Message", this.commonService.nodatafound);
  //   // }
  //   this.commonService.generateSalesReportWithImage2(
  //     buttonAction,
  //     fileName,
  //     content,
  //     2,
  //     0,
  //     this.bodyData
  //   );
  // }

  private getReportData(
    buttonAction: any,
    fileName: any,
    salesOfferId: number
  ) {
    try {
      this.apiUrl = `SalesOffer/GetSalesOfferReportDataById?salesOfferId=${salesOfferId}`;
      this.commonService
        .getReportData(this.apiUrl)
        .subscribe((returns: any) => {
          if (returns.success && returns.data.length > 0) {
            this.bodyData = [];
            this.bodyData = returns.data;
            //console.log(this.bodyData)

            this.rtotalGross = this.bodyData[0]["totalGross"];
            this.rtotalVat = this.bodyData[0]["totalVat"];
            this.rtotalAit = this.bodyData[0]["totalAit"];
            this.rshippingCost = this.bodyData[0]["shippingCost"];
            this.rtotalDiscountAmount = this.bodyData[0]["totalDiscountAmount"];
            this.rgrandTotal = this.bodyData[0]["grandTotal"];

            this.rPartyName = this.bodyData[0]["partyName"];
            this.rcontactNumber = this.bodyData[0].mobileNo;
            this.raddressLine = this.bodyData[0].address;
            this.rOfficeName = this.bodyData[0].officeName;
            this.rSalesOfferNo = this.bodyData[0]["salesOfferNo"];
            this.rOfferDate = this.bodyData[0]["salesOfferDate"];
            this.rPaymentDate = this.bodyData[0]["paymentDate"];

            const content = document.getElementById("reportHeader");

            // A Better Example of Show Image at Field Force Tracking Reports
            this.commonService.generateSalesReportWithImage2(
              buttonAction,
              fileName,
              content,
              2,
              0,
              this.bodyData
            );
          } else {
            this.toastrService.warning(
              "Message",
              this.commonService.nodatafound
            );
          }
        });
    } catch (error) {
      this.toastrService.danger("Message", error);
    }
  }
  public generateReport(buttonAction: any, salesOfferId: number = 0) {
    var fileName = this.pageNavigation + "." + buttonAction;
    this.getReportData(buttonAction, fileName, salesOfferId);
    const content = document.getElementById("reportHeader");
  }

  //#endregion Report

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
  openWithDataObjModel(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      context: this.data,
    });
  }
  openWithDataModel() {
    this.dialogService
      .open(DialogNamePromptComponent)
      .onClose.subscribe((name) => name && this.names.push(name));
  }
  /////////////////////////////

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
}
