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
  NbDateService,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
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

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-gross-return-multiple',
  templateUrl: './gross-return-multiple.component.html',
  styleUrls: ['./gross-return-multiple.component.scss']
})
export class GrossReturnMultipleComponent implements OnInit {

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
  isReadOnly: boolean = true;
  vlucherForm: FormGroup;
  submitted: boolean;
  saveupdate: string = "Save";
  gridbutton: string = "";
  name: string;
  description: string;
  selectedRow: any;

  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    //private ProducttransferService: ProducttransferService,
    private productrequisitionService: ProductrequisitionService,
    private productService: ProductService,
    //private comboService: CommoncomboService,
    private stockinService: StockinService,
    private salesinvoiceService: SalesinvoiceService,
    private salesreturnService: SalesreturnService,
    protected dateService: NbDateService<Date>,
    private datePipe: DatePipe
  ) {
    this.commonService.valueSet("showlist");
    this._CompanyId = Number(this.commonService.getCurrentCompany());
    this.getServerDateTime();
    this.partyList = [];
    //this.partySelected = null;
    this.terriSelected = null;
    this.getAllTerritory();

    //this.GetAllPartysByTypeId(0);

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
        headerName: "Return No.",
        field: "salesReturnNo",
        width: 170,
      },
      {
        headerName: "Return Date",
        field: "salesReturnDate",
        width: 140,
      },
      {
        headerName: "Customer Name",
        field: "partyName",
        width: 200,
      },
      {
        headerName: "Territory Name",
        field: "TerritoryName",
        width: 200,
      },
      // {
      //   headerName: "Territory Code",
      //   field: "TerritoryCode",
      //   width: 180,
      // },
      {
        headerName: "Net Amount",
        field: "netAmount",
        width: 150,
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.totalAmount ?? 0),
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
    //debugger;
    this.getMaster();
    this.getMaxNo();
    this.getStore();
    this.getProductDetails();
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

  public pageNavigation = "Sales Gross Return";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      if (this.StoreList.length > 0) {
        this.master.storeSlected = {
          id: this.StoreList[0].id,
          name: this.StoreList[0].name,
        }
        this.master.storeId = this.StoreList[0].id;
      }
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

  master: {
    salesReturnMasterId: number;
    salesInvoiceId: number;
    salesReturnNo: string;
    salesReturnDate: Date;
    salesReturnDateText: string;
    addressLine: string;
    TerritoryName: string;
    mioName: string;
    storeId: number;
    partyId: number;
    partyName: string;
    partySelected: {};
    invoiceSelected: {};

    grossAmount: number;
    convertionQty: number;
    discount: number;
    tp: number;
    totalPrice: number;
    CtnQty: number;
    totalVatAmount: number;
    ProductTotalAmount: number;
    InvoiceTotalAmount: number;
    totalAitAmount: number;
    shippingCostAmount: number;
    totalDiscountAmount: number;
    netAmount: number;
    toUomId: number;
    totalprice: number;

    isActive: number;
    isDelete: number;

    batchNo: string;
    uomName: string;
    productId: number;
    productWiseSpecificationId: number;
    salesInvDetailsId: number;
    productName: string;
    productSpecSelected: {};

    price: number;
    returnQty: number;
    vat: number;
    ait: number;
    discountAmount: number;
    total: number;

    storeSlected: {};
    lstDetailsViewModel: any[];
    lstInvoiceDetails: any[];
    productSelected: {};
    tosbuId: number;
  };

  public getMaster() {
    this.master = {
      salesReturnMasterId: 0,
      salesInvoiceId: 0,
      salesReturnNo: "",
      salesReturnDate: new Date(),
      salesReturnDateText: "",
      addressLine: "",

      TerritoryName: "",
      mioName: "",

      storeId: 0,
      tosbuId: 0,
      partyId: 0,
      convertionQty: 0,
      tp: 0,
      discount: 0,
      totalPrice: 0,
      CtnQty: 0,
      partyName: "",
      partySelected: null,
      invoiceSelected: null,
      productSelected: null,

      InvoiceTotalAmount: 0,
      ProductTotalAmount: 0,
      grossAmount: 0,
      totalVatAmount: 0,
      totalAitAmount: 0,
      totalDiscountAmount: 0,
      netAmount: 0,
      shippingCostAmount: 0,
      toUomId: 0,
      totalprice: 0,

      isActive: 1,
      isDelete: 0,

      batchNo: "",
      uomName: "",

      productId: 0,
      productWiseSpecificationId: 0,
      salesInvDetailsId: 0,
      productName: "",
      productSpecSelected: null,

      price: 0,
      returnQty: 0,
      vat: 0,
      ait: 0,
      discountAmount: 0,
      total: 0,

      storeSlected: null,
      lstDetailsViewModel: [],
      lstInvoiceDetails: [],
    };
    this.getMaxNo();
    this.isReadOnly = true;
    this.Price_Backup = 0;
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
        this.minDate = this.dateService.addDay(new Date(returns.data[0].minTransferDate), 0);
        this.maxDate = this.dateService.addDay(new Date(returns.data[0].maxTransferDate), 0);
      } else {
        this.currentDate = new Date();
        this.minDate = new Date();
        this.maxDate = new Date();
      }
    });
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

    if (this.master.salesReturnDate == null) {
      this.toastrService.danger("Please select invoice date.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    ////debugger;
    if (this.master.partySelected == null) {
      this.toastrService.danger("Please select customer.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    //debugger;
    let InvoiceList = this.master.lstInvoiceDetails.filter(
      (item) => item.isSelect === true
    );

    let TotalItemPrice = 0;
    let TotalInvoicePrice = 0;

    InvoiceList.forEach(
      (a) => (
        (TotalItemPrice += parseFloat(a.collectionAmount))
      )
    );

    this.master.lstDetailsViewModel.forEach(
      (a) => (
        (TotalInvoicePrice += parseFloat(a.totalPrice))
      )
    );

    // if (TotalItemPrice != TotalInvoicePrice) {
    //   //console.log('TotalItemPrice != TotalInvoicePrice', `${TotalItemPrice} != ${TotalInvoicePrice}`)

    //   this.toastrService.danger("Return Invoice Amount and Return Item Amount Missmatch.", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }

    if (this.master.ProductTotalAmount <= 0) {
      this.toastrService.danger("Return Invoice Amount can not be 0.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.InvoiceTotalAmount <= 0) {
      this.toastrService.danger("Return Invoice Amount can not be 0.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.ProductTotalAmount != this.master.InvoiceTotalAmount) {
      //console.log('TotalItemPrice != TotalInvoicePrice', `${TotalItemPrice} != ${TotalInvoicePrice}`)

      this.toastrService.danger("Return Invoice Amount and Return Item Amount mismatch.", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    // if (this.master.productWiseSpecificationId == null) {
    //   this.toastrService.danger("Please select Product.", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }

    // if (this.master.returnQty == null) {
    //   this.toastrService.danger("Please give Quantity.", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }

    // if (this.master.netAmount == null) {
    //   this.toastrService.danger("Please give Amount.", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }

    this.show = true;

    //console.log(this.master);
    this.master.salesReturnDate = this.commonService.DateFormat(this.master.salesReturnDate);
    this.commonService.ConsoleLog(this.master);

    this.salesreturnService
      .SaveSalesGrossReturnMultiple(this.master)
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
          this.salesreturnService
            .GetSalesGrossReturnMultiById(0)
            .subscribe((data: any) => {
              //debugger;
              if (data.success) {
                this.rowData = data.data;
              }
            });
        }
        else {
          this.toastrService.warning(
            this.commonService.failedmsg,
            "Message"
          );
        }
      });
  }

  territoryList: any = [];
  getAllTerritory() {
    this.territoryList = [];
    this.salesinvoiceService
      .GetAllTerritoryForDepot()
      .subscribe((returns: any) => {
        if (returns.success) {
          this.territoryList = returns.data.map((val: any) => ({
            id: val.TerritoryCode,
            name: val.TerritoryName,
          }));
        }
      });
  }

  public partyList = [];
  //partySelected = {};
  terriSelected = {};
  public GetAllPartysByTypeId(partyTypeId: any) {
    this.partyList = [];
    this.master.partySelected = {};
    //let partyId = this.partySelected['id'];

    if (this.terriSelected == undefined || null) return;


    this.salesinvoiceService
      .GetAllPartysByTypeId(0, 0, this.terriSelected['id'])
      .subscribe((returns: any) => {
        this.partyList = returns.data.map((val: any) => ({
          id: val.partyId,
          name: val.partyName,
          territoryCode: val.territoryCode
        }));
      });
  }

  public getProductById(id) {
    // console.log(this.master.productSelected);
    // this.productService.getProductById(id).subscribe((data: any) => {
    //   if (data.success) {
    //     this.master.uomName = this.master.productSelected["uomName"];
    //   }
    // });

    this.master.uomName = this.master.productSelected["uomName"];
    //this.GetCurrentStock();
  }

  //public lstReqDetailsViewModel = [];

  currentStock: number = 0;
  GetCurrentStock() {
    this.currentStock = 0;
    let apiUrl = `ProductRequisition/GetProductCurrentStockBySbuId?productWiseSpecificationId=${this.master.productWiseSpecificationId}&sbuId=${this.master.tosbuId}`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.currentStock = returns.data[0].currentStock;
      }
    });
  }

  private reset() {
    this.terriSelected = {};
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

  private gridApi;
  private gridColumnApi;

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.salesreturnService
      .GetSalesGrossReturnMultiById(0)
      .subscribe((data: any) => {
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
    this.commonService.agButtonClicked = "";
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
      var salesReturnMasterId = event.node.data.salesReturnMasterId;
      //debugger;
      //this.getStore();
      //alert(salesReturnMasterId);
      this.salesreturnService
        .GetSalesGrossReturnMultiById(salesReturnMasterId)
        .subscribe((data: any) => {
          if (data.success) {
            this.master = data.data[0];
            //console.log(data.data[0]);
            this.master.partySelected = {
              id: this.master.partyId,
              name: this.master.partyName,
            };

            //this.GetInvoiceListByCustomer(salesReturnMasterId,data.data[0].partyId);
            this.GetSalesInvoiceListfromDispatchEdit(data.data[0].partyId, salesReturnMasterId)

            this.master.invoiceSelected = {
              id: data.data[0].salesInvoiceId,
              name: data.data[0].salesInvoiceNo,
            };

            this.master.productSelected = {
              id: data.data[0].productWiseSpecificationId,
              name: data.data[0].productName
            };

            this.salesreturnService
              .GetSalesGrossReturnDetailsProductByMasterId(salesReturnMasterId)
              .subscribe((data: any) => {
                if (data.success) {
                  this.master.lstDetailsViewModel = data.data;
                  let totalGross = 0;
                  this.master.lstDetailsViewModel.forEach((row) => {
                    totalGross += row.totalPrice == "" ? 0 : row.totalPrice;
                  });

                  this.master.ProductTotalAmount = totalGross;
                }
                //this.calculateGrandTotal();
              });
            //console.log(this.master);

            this.master.salesReturnDate = new Date(this.master.salesReturnDate);
            //this.calculateGrandTotal();
            //this.calculateGrandTotalInvoice();
          }
        });
      this.ngOnInit();
    }
  }
  isDeal: boolean = false;
  public addDetails() {
    //console.log(this.master.productSelected);
    if (
      this.master.productWiseSpecificationId == null || this.master.productWiseSpecificationId ==0) {
      this.toastrService.warning("Please select a product.", "Message");
      return false;
    }
    if (this.master.returnQty == null || this.master.returnQty <= 0) {
      this.toastrService.warning("Please input product quanty.", "Message");
      return false;
    }
    if (this.master.batchNo.trim() == null || this.master.batchNo.trim() == "") {
      this.toastrService.warning("Please input batch no.", "Message");
      return false;
    }
    if (!this.isDeal && (this.master.totalPrice == null || this.master.totalPrice <= 0)) {
      this.toastrService.warning("Total Price can not be 0.", "Message");
      return false;
    }
    //this.getProductDetails();

    let returnQty = this.master.returnQty ?? 0;
    let price = this.master.price ?? 0;
    let vat = this.master.vat ?? 0;
    let discount = this.master.discount ?? 0;
    console.log(`returnQty=${returnQty}; price=${price}; vat=${vat}; discount=${discount};`);
    let totalPrice = returnQty * ((price + vat) - discount);
    this.master.totalPrice = this.commonService.roundWithDecimalPoint(totalPrice, 2);

    if (this.isDeal) {
      price = 0;
      vat = 0;
      discount = this.master.discount ?? 0;
      this.master.totalPrice = 0;
    }

    let item = {
      productReqDetailsId: 0, //this.master.lstReqDetailsViewModel.productReqDetailsId,
      productWiseSpecificationId: this.master.productWiseSpecificationId,
      //dropdown: this.productList,
      productId: this.master.productSelected["productId"],
      productName: this.master.productSelected["name"] + (this.isDeal ? ' (Bonus)' : ''),
      uomId: this.master.productSelected["uomId"],
      packSize: this.master.productSelected["packSize"],
      uomName: this.master.uomName,
      batchNo: this.master.batchNo,
      returnQty: returnQty,//this.master.returnQty,
      price: price,//this.master.price,
      vat: vat,//this.master.vat,
      discount: discount,//this.master.discount,
      totalPrice: this.master.totalPrice,

      toUomId: this.master.toUomId,
      CtnQty: this.master.CtnQty,
      convertionQty: this.master.convertionQty,
      currentStock: this.currentStock,
      isActive: 1,
    };
    /*
     //this.master.lstReqDetailsViewModel.push(detail);
     if (detail.returnQty != 0 && detail.price != 0) {
       this.master.lstDetailsViewModel.push(detail);
     } else {
       this.toastrService.danger("Quantity Or Price is zero.", "Message");
       return;
     }
     */
    this.master.lstDetailsViewModel.splice(0, 0, item);
    this.master.productSelected = null;
    this.master.price = 0;
    this.master.vat = 0;
    this.master.discount = 0;
    this.master.batchNo = '';
    this.master.returnQty = 0;
    this.master.CtnQty = 0;
    this.master.convertionQty = 0;
    this.master.totalPrice = 0;
    this.master.uomName = "";

    this.calculateProductTotalAmount();
    //console.log(this.master.lstReqDetailsViewModel);
  }

  public deleteDetail(index: any) {
    this.selectedRow = this.master.lstDetailsViewModel[index];
    this.master.lstDetailsViewModel.splice(index, 1);
    if (this.selectedRow.helpDetailId > 0) {
    }
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }

  public productList = [];

  public getProductDetails() {
    this.productrequisitionService
      .getAllProductForRequisition()
      .subscribe((returns: any) => {
        console.log(returns.data);
        this.productList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uomId: val.uomId,
          uomName: val.uomName,
          productId: val.productId,
          price: val.tradePrice,
          unitVat: val.unitVat,
          packSize: val.packSize,
        }));
      });
  }

  Price_Backup: number = 0;
  public getProductSpecDetails() {
    //debugger;
    console.log(this.master.productSelected);
    this.master.totalPrice = 0;
    this.master.price = 0;
    this.master.productId = this.master.productSelected["productId"];
    this.master.uomName = this.master.productSelected["uomName"];
    this.master.productName = this.master.productSelected["name"];
    this.master.productWiseSpecificationId = this.master.productSelected["id"];
    //  let companyAliasName = this.salesinvoiceService.GetCompanyAliasName();
    // if (companyAliasName == "EVERGREEN")
    this.master.price = this.master.productSelected["price"];
    this.master.vat = this.master.productSelected["unitVat"];
    this.Price_Backup = this.master.productSelected["price"];
    // debugger;
    //this.getCurrentStock();
    //this.checkAlreadyExist();
    //this.GetUOMConverterInfoByProductSpecId(this.master.productWiseSpecificationId, this.master.productSelected["uomId"], 0);
  }

  toUomList: any[];
  toUomSelected = {};
  GetUOMConverterInfoByProductSpecId(productWiseSpecificationId: any, fromUomId: any, toUomId: any) {
    this.toUomList = [];
    this.toUomSelected = null;
    this.productService.GetUOMConverterInfoByProductSpecId(productWiseSpecificationId, fromUomId, toUomId).subscribe((returns: any) => {
      if (returns.status) {
        this.toUomList = returns.data.map((val: any) => ({
          id: val.toUomId,
          name: val.toUomName,
          fromQty: val.fromQty,
          toQty: val.toQty,
        }));
        if (returns.data.length > 0) {
          this.toUomSelected = {
            id: returns.data[0].toUomId,
            name: returns.data[0].toUomName,
            fromQty: returns.data[0].fromQty,
            toQty: returns.data[0].toQty,
          };

          this.master.toUomId = returns.data[0].toUomId;
        };
      }
    });
  }



  _CompanyId: number = 1;
  discountType: string = '';
  hasNationalBonus: number = 0;

  minNationalBonus: number = 0.020;
  midNationalBonus: number = 0.025
  maxNationalBonus: number = 0.03;

  minProductAmt: number = 0;
  lowestAmnt: number = 0;
  nationalDiscount: number = 0;

  midAmnt: number = 0;
  maxAmnt: number = 0;

  public GetItemWsieBonus() {
    this.nationalDiscount = 0;
    this.hasNationalBonus = 0;
    // this.minNationalBonus = 0;
    // this.maxNationalBonus= 0;
    this.minProductAmt = 0;

    debugger;
    //this.master.currentStock = 0;
    this.master.discount = 0;
    this.discountType = '';
    this.isReadOnly = true;

    if (this.master.salesReturnDate == null || this.master.productWiseSpecificationId == 0 || this.master.partyId == 0) return;

    if (this.master.productWiseSpecificationId > 0) {
      this.salesinvoiceService
        .GetItemWsieBonus(
          this.commonService.DateFormat(this.master.salesReturnDate),
          this.master.partyId,
          this.master.productWiseSpecificationId,
          this.master.returnQty,
        )
        .subscribe((returns: any) => {
          debugger;
          if (returns.success) {
            //console.log(returns.data);

            let msg = returns.data[0].msg;
            let price = returns.data[0].price;
            let discountAmount = returns.data[0].discountAmount;

            //this.master.discountAmount = this.calculateDiscount(this.master.price);

            if (this._CompanyId == 1) {
              this.master.discount = discountAmount;
              if (price > 0) { this.master.price = price; }
              if (msg != '') { this.toastrService.info(msg, 'info'); }
              this.discountType = ` ( ${msg} )`;

              this.nationalDiscount = returns.data[0].discountAmount;

              this.minProductAmt = returns.data[0].minProductAmt;
              this.hasNationalBonus = returns.data[0].hasNationalBonus;
              this.minNationalBonus = returns.data[0].minNationalBonus;
              this.maxNationalBonus = returns.data[0].maxNationalBonus;

              this.midNationalBonus = returns.data[0].midNationalBonus;
              this.minProductAmt = returns.data[0].minProductAmt;
              this.lowestAmnt = returns.data[0].lowestAmnt;
              this.midAmnt = returns.data[0].midAmnt;
              this.maxAmnt = returns.data[0].maxAmnt;
            }
            this.CalculateTotalPrice();

            this.isReadOnly = returns.data[0].isReadOnly;
          }
          else {
            this.hasNationalBonus = null;
            this.isReadOnly = true;
            this.toastrService.danger('Network error occurred', 'Warning !');
          }
        });
      //this.validateInvoiceQty();
    }
  }



  GetSalesInvoiceListfromDispatch() {
    // this.commonService.valueSet("create");

    this.master.lstInvoiceDetails = [];
    this.salesinvoiceService
      .GetSalesInvoiceListfromDispatchJson_v2(0, this.master.partyId, this.commonService.DateFormat(this.master.salesReturnDate), this.terriSelected['id'], 0, '')
      .subscribe((returns: any) => {
        if (returns.success) {
          //console.log(returns.data);
          this.master.lstInvoiceDetails = returns.data;
          //this.CalculateSummary();
        }
      });

    //this.GetItemWsieBonus();
  }

  GetSalesInvoiceListfromDispatchEdit(partyId, GReturnId) {
    // this.commonService.valueSet("create");
    this.master.lstInvoiceDetails = [];
    this.salesinvoiceService
      .GetSalesGrossReturnDetailsInvoiceByMasterId(GReturnId, partyId)
      .subscribe((returns: any) => {
        if (returns.success) {
          //console.log(returns.data);
          this.master.lstInvoiceDetails = returns.data;
          let totalGross = 0;
          this.master.lstInvoiceDetails.forEach((row) => {
            totalGross += row.collectionAmount == null || row.collectionAmount == "" ? 0 : row.collectionAmount;
          });

          this.master.InvoiceTotalAmount = totalGross;
          //this.CalculateSummary();
        }
      });
  }

  gCollectableAmt: number = 0;

  checkChange(e, rowIndex) {

    this.gCollectableAmt = 0;
    debugger;
    if (e.target.checked) {
      this.master.lstInvoiceDetails[rowIndex].isEnable = 1;
    } else {
      this.master.lstInvoiceDetails[rowIndex].isEnable = 0;
      this.master.lstInvoiceDetails[rowIndex].collectionAmount = 0;
    }
    //this.CalculateBonusDiscount(rowIndex);
    //this.CalculateSummary();

    //this.gCollectableAmt = this.master.lstDetailsViewModel[rowIndex].collectionAmount;
    //this.gBonusDiscount = this.master.lstDetailsViewModel[rowIndex].bonusDiscount;

    this.calculateGrandTotalInvoice();
  }

  public currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  private agReport(event): any {
    debugger
    //this.generateReport(event.data.salesReturnMasterId);
    this.generateCrReport("pdf", event.data.salesGrossRetunId);
  }

  generateCrReport(reportFormat: any, salesGrossRetunId: number) {
    debugger
    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `SalesInvoiceReport/GetGrossTransectionReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid
      }&grossRetunMasterId=${salesGrossRetunId}`;

    this.commonService
      .GetCrystalReportData(this.apiUrl)
      .subscribe((returns: any) => {
        let res = JSON.parse(returns);
        console.log(res);
        if (res.status) {
          this.commonService.GenerateBase64ToReport(res.data[0].data);
        } else {
          this.toastrService.warning("Message", this.commonService.nodatafound);
        }
      });
  }

  private agDelete(event) {
    if (confirm('Are you sure to delete?')) {
      this.master.salesReturnMasterId = event.node.data.salesGrossRetunId;
      this.salesreturnService
        .SalSpDeleteSalesGrossReturn(this.master.salesReturnMasterId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(this.commonService.deletedmsg, "Message");

            this.salesreturnService
              .GetSalesGrossReturnMultiById(0)
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

  public getMaxNo() {
    this.salesreturnService
      .GetMaxSalesGrossReturnNumber(
        this.datePipe.transform(this.master.salesReturnDate, "yyyy-MM-dd")
      )
      .subscribe((returns: any) => {
        //debugger;
        if (returns.success) {
          this.master.salesReturnNo = returns.data[0].MaxNo;
        }
      });
  }

  // public partyList = [];
  // public GetAllPartysByTypeId(partyTypeId: any) {
  //   this.salesinvoiceService
  //     .GetAllPartysByTypeId(partyTypeId)
  //     .subscribe((returns: any) => {
  //       this.partyList = returns.data.map((val: any) => ({
  //         id: val.partyId,
  //         name: val.partyName,
  //       }));
  //     });
  // }

  public invoiceList = [];
  public GetInvoiceListByCustomer(customerId) {
    this.salesinvoiceService
      //.GetSalesInvoiceListByPartyId(customerId)
      .GetSalesInvoiceListForReturn(customerId)
      .subscribe((returns: any) => {
        this.invoiceList = returns.data.map((val: any) => ({
          id: val.salesInvoiceId,
          name: val.salesInvoiceNo,
        }));
      });
  }

  private getInvoiceDetails(salesInvoiceId, isAllQtyReturn: boolean = false) {
    this.master.lstDetailsViewModel = [];
    this.salesinvoiceService
      .GetSalesInvoiceDetailsByMasterId(salesInvoiceId)
      .subscribe((data: any) => {
        if (data.status) {
          //debugger;
          //this.master.lstDetailsViewModel = data.data;

          this.master.lstInvoiceDetails = data.data;
          this.master.lstInvoiceDetails.forEach((row) => {
            let details = {
              salesInvDetailsId: row.salesInvDetailsId,
              productId: row.productId,
              productWiseSpecificationId: row.productWiseSpecificationId,
              productName: row.productName,
              serialNo: row.serialNo,
              invoiceQty: row.invoiceQty,
              returnQty: isAllQtyReturn ? row.invoiceQty : null,
              unitPrice: row.price,
              vatPercent: row.vat,
              aitPercent: row.ait,
              discountPercent: row.discountAmount,
              totalAmount: 0,//row.total,
            };
            this.master.lstDetailsViewModel.push(details);
          });

          for (let index = 0; index < this.master.lstDetailsViewModel.length; index++) {
            this.calculateTotal(index);
          }
        }
      });
  }

  returnAll() {
    if (this.master.salesInvoiceId > 0)
      this.getInvoiceDetails(this.master.salesInvoiceId, true);
  }

  public calculateTotal(index: any) {
    let totalPrice = 0;

    let returnQty =
      this.master.lstDetailsViewModel[index].returnQty == ""
        ? 0
        : this.master.lstDetailsViewModel[index].returnQty;
    let price =
      this.master.lstDetailsViewModel[index].unitPrice == ""
        ? 0
        : this.master.lstDetailsViewModel[index].unitPrice;
    let vat =
      this.master.lstDetailsViewModel[index].vatPercent == ""
        ? 0
        : this.master.lstDetailsViewModel[index].vatPercent;
    let ait =
      this.master.lstDetailsViewModel[index].aitPercent == ""
        ? 0
        : this.master.lstDetailsViewModel[index].aitPercent;
    let discountAmount =
      this.master.lstDetailsViewModel[index].discountPercent == ""
        ? 0
        : this.master.lstDetailsViewModel[index].discountPercent;

    totalPrice = returnQty * price;
    vat = totalPrice * (vat / 100);
    ait = totalPrice * (ait / 100);
    discountAmount = totalPrice * (discountAmount / 100);

    this.master.lstDetailsViewModel[index].totalAmount =
      totalPrice + vat + ait - discountAmount;
    this.calculateProductTotalAmount();
  }

  public CalculateTotalPrice(isAvoid: boolean = false) {
    //START : Set Pcs to CTN UOM qty

    // if (!isAvoid && this.toUomSelected != null) {
    //   let toQty: number = this.toUomSelected["toQty"];
    //   let fromQty: number = this.toUomSelected["fromQty"];
    //   let convertionFactor: number = (fromQty * toQty); //this.commonService.roundWithDecimalPoint((fromQty / toQty), 5);
    //   // console.log(toQty, fromQty);
    //   // console.log('convertionFactor', convertionFactor);
    //   // console.log('this.master.convertionQty', this.master.convertionQty);
    //   this.master.convertionQty = (this.master.invoiceQty * convertionFactor); //this.commonService.roundWithDecimalPoint((this.master.invoiceQty * convertionFactor), 5);
    // }
    // else {
    //   this.master.convertionQty = null;
    // }

    /*
    if (this.master.convertionQty == null) {
      this.master.convertionQty = 0;
    }
    
    let toQty: number = this.toUomSelected["toQty"];
    let fromQty: number = this.toUomSelected["fromQty"];
    let convertionFactor: number = (fromQty / toQty);
    this.master.returnQty = this.master.CtnQty + this.master.convertionQty * convertionFactor;

    //END : Set Pcs to CTN UOM qty

    if (this.master.returnQty == undefined || this.master.returnQty < 0)
      this.master.returnQty = 0;
    if (this.master.price == undefined || this.master.price < 0)
      this.master.price = 0;
 */

    //this.master.totalPrice = this.master.price * this.master.returnQty;

    if (this.master.price > this.Price_Backup) {
      this.toastrService.warning("Inputed Price must be less or equal to Current Price.", 'Warnig')
      this.master.totalPrice = 0;
      return;
    }

    let returnQty = this.master.returnQty ?? 0;
    let price = this.master.price ?? 0;
    let vat = this.master.vat ?? 0;
    let discount = this.master.discount ?? 0;
    //console.log(`returnQty=${returnQty}; price=${price}; vat=${vat}; discount=${discount};`);
    let totalPrice = returnQty * ((price + vat) - discount);
    this.master.totalPrice = this.commonService.roundWithDecimalPoint(totalPrice, 2);

  }

  calculateProductTotalAmount() {
    let totalGross = 0;
    this.master.lstDetailsViewModel.forEach((row) => {
      totalGross += row.totalPrice == null ? 0 : row.totalPrice;
    });

    this.master.ProductTotalAmount = this.commonService.roundWithDecimalPoint(totalGross, 2);
  }

  calculateGrandTotalInvoice() {
    debugger;
    let totalGross = 0;
    this.master.lstInvoiceDetails.forEach((row) => {
      totalGross += row.collectionAmount == null || row.collectionAmount == "" ? 0 : row.collectionAmount;
    });

    this.master.InvoiceTotalAmount = this.commonService.roundWithDecimalPoint(totalGross, 2);
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
    // this.salesinvoiceService.DeleteSalesInvoiceDetailsById(this.master.lstDetailsViewModel[index].salesInvDetailsId).subscribe((returns: any) => {
    //   if (returns.success) {
    //     this.toastrService.success(this.commonService.deletedmsg, "Message");
    //   }
    // });

    // this.selectedRow = this.master.lstDetailsViewModel[index];
    // this.master.lstDetailsViewModel.splice(index, 1);
    // if (this.selectedRow.helpDetailId > 0) { }
    // this.toastrService.danger(this.commonService.deletedmsg, "Message");

    this.selectedRow = this.master.lstDetailsViewModel[index];
    this.master.lstDetailsViewModel.splice(index, 1);

    var index1 = this.master.lstDetailsViewModel.findIndex(
      (x) => x.salesInvDetailsId == this.master.salesInvDetailsId
    );
    if (index1 > -1) {
      this.master.lstDetailsViewModel.splice(index1, 1);
    }
    this.toastrService.danger(this.commonService.deletedmsg, "Message");

    this.calculateProductTotalAmount();
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

  ttlCollectionAmount: number = 0;
  NetTotalPrice: number = 0;
  public generateReport(salesReturnMasterId) {
    this.datalength = 0;
    this.NetTotalPrice = 0;
    this.salesreturnService
      .GetSalesGrossReturnMultiById(salesReturnMasterId)
      .subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];
          this.master.salesReturnDateText = this.commonService.DateFormat(this.master.salesReturnDate, 'dd-MMM-yyyy');//new Date(this.master.salesReturnDate).toLocaleString();
          //console.log(data.data[0]);
          this.master.partySelected = {
            id: this.master.partyId,
            name: this.master.partyName,
          };

          //this.GetInvoiceListByCustomer(salesReturnMasterId,data.data[0].partyId);
          //this.GetSalesInvoiceListfromDispatchEdit(data.data[0].partyId, salesReturnMasterId);

          this.master.lstInvoiceDetails = [];
          this.salesinvoiceService
            .GetSalesGrossReturnDetailsInvoiceByMasterId(salesReturnMasterId, data.data[0].partyId)
            .subscribe((returns: any) => {
              if (returns.success) {
                console.log(returns.data);
                this.master.lstInvoiceDetails = returns.data.filter(
                  (item) => item.isSelect === 1
                );
                //this.CalculateSummary();

                this.master.lstInvoiceDetails.forEach(a => {
                  this.ttlCollectionAmount += parseFloat(a.collectionAmount ?? 0);
                });
              }
            });

          this.master.invoiceSelected = {
            id: data.data[0].salesInvoiceId,
            name: data.data[0].salesInvoiceNo,
          };

          this.master.productSelected = {
            id: data.data[0].productWiseSpecificationId,
            name: data.data[0].productName
          };

          this.salesreturnService
            .GetSalesGrossReturnDetailsProductByMasterId(salesReturnMasterId)
            .subscribe((data: any) => {
              if (data.success) {
                this.master.lstDetailsViewModel = data.data;
                //console.log(this.master);
              }
              //this.calculateGrandTotal();
              this.datalength = this.master.lstDetailsViewModel.length;
              this.master.lstDetailsViewModel.forEach(a => {
                this.NetTotalPrice += parseFloat(a.totalPrice ?? 0);
              });
              this.NetTotalPrice = this.commonService.roundWithDecimalPoint(this.NetTotalPrice, 0);

            });
          //console.log(this.master);

          this.master.salesReturnDate = new Date(this.master.salesReturnDate);
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
          startY: legend.height + 40,
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
          startY: legend.height + 90,
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
          startY: legend.height + 170,
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
          html: "#table_signature",
          startY: legend.height + 650,
          styles: { font: "Meta", fontSize: 11, halign: "center" },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
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
}