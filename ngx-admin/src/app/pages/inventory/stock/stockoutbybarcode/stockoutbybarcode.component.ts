import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";
import { StockinService } from "app/services/inventory/stockin.service";
//import { StockoutService } from "app/services/inventory/stockout.service";
import { StockinwithoutpoService } from "app/services/inventory/Stockinwithoutpo.service";
import { StockoutbybarcodeService } from "app/services/inventory/Stockoutbybarcode.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { DatePipe } from "@angular/common";

@Component({
  selector: "ngx-stockoutbybarcode",
  templateUrl: "./stockoutbybarcode.component.html",
  styleUrls: ["./stockoutbybarcode.component.scss"],
})
export class StockoutbybarcodeComponent implements OnInit {
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

  /////////////////////////////
  master: {
    lstStockOutByBarcodeDetails: any[];

    // no need bellow variable but a copy of this page with all variable will develop in next time
    stockMasterId: number;
    poReceiveId: number;
    companyId: number;
    sbuId: number;
    storeId: number;
    stockNo: string;
    stockDate: Date;
    stockTypeId: number;
    remarks: string;
    stockCategory: string;
    stockCategoryId: number;
    barcodeNo: string;
    productId: 0;
    productWiseSpecificationId: 0;
    CurrentStock: 0;
    stockQty: 0;
    companySelected: {};
    supplierSelected: {};
    branchSelected: {};
    storeSelected: {};
    productSelected: {};
    POReceiveSelected: {};
    productspecificationSelected: {};
    // stockDetailsList: any[];
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

  public pageNavigation = "Stock Out by Barcode";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.GetMaxStockOutNo();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
      this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      this.show = true;
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

  public getMaster() {
    this.master = {
      lstStockOutByBarcodeDetails: [],
      stockMasterId: 0,
      poReceiveId: 0,
      companyId: 0,
      sbuId: 0,
      storeId: 0,
      productId: 0,
      productWiseSpecificationId: 0,
      stockQty: 0,
      stockNo: "",
      stockDate: new Date(),
      stockTypeId: 2,
      stockCategoryId: 6,
      stockCategory: "Stock Out by Barcode",
      remarks: "",
      barcodeNo: "",
      CurrentStock: 0,
      companySelected: null,
      supplierSelected: null,
      storeSelected: null,
      branchSelected: null,
      POReceiveSelected: null,
      productSelected: null,
      productspecificationSelected: null,
      // stockDetailsList: [],
    };
    this.StoreList = null;
    this.sbus = null;
  }

  public employeeItems = [];
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
    //console.log(this.master);
    this.master.stockDate = this.commonService.DateFormat(this.master.stockDate);
    this.StockoutbybarcodeService.SaveStockOutByBarcode(this.master).subscribe(
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
          this.StockoutbybarcodeService.GetStockOutByBarcodeByMasterId(
            0
          ).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
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
    private StockinService: StockinService,
    //private StockoutService: StockoutService,
    private comboService: CommoncomboService,
    private StockinwithoutpoService: StockinwithoutpoService,
    private StockoutbybarcodeService: StockoutbybarcodeService,
    private datePipe: DatePipe
  ) {
    this.commonService.valueSet("showlist");
    // this.getPOReceive();
    this.getCompany();
    this.getAllProduct();
    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 50,
      },
      {
        headerName: "Stock No.",
        field: "stockNo",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 160,
      },
      {
        headerName: "Stock Out Date",
        field: "stockDate",
        width: 160,
      },
      {
        headerName: "Stock Type",
        field: "stockName",
        width: 140,
      },
      {
        headerName: "Remarks",
        field: "remarks",
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.StockoutbybarcodeService.GetStockOutByBarcodeByMasterId(0).subscribe(
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
      var stockMasterId = event.node.data.stockMasterId;

      this.StockoutbybarcodeService.GetStockOutByBarcodeByMasterId(
        stockMasterId
      ).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];
          this.master.stockDate = new Date(this.master.stockDate);
          this.getCompany();
          this.ProductSpecificationList = [];
          // this.getPOReceive();

          this.master.companySelected = {
            id: data.data[0].companyId,
            name: data.data[0].companyName,
          };
          this.getSBU(this.master.companyId);
          this.master.branchSelected = {
            id: data.data[0].sbuId,
            name: data.data[0].sbuName,
          };
          this.getStore(this.master.sbuId);
          this.master.storeSelected = {
            id: data.data[0].storeId,
            name: data.data[0].storeName,
          };
          // this.master.POReceiveSelected = {
          //   id: data.data[0].poReceiveId,
          //   name: data.data[0].purOrderRecvNo,
          // }
          this.master.stockCategory = "Stock Out by Barcode";
          this.master.stockCategoryId = 6;
          this.StockoutbybarcodeService.GetStockOutByBarcodeDetailsByMasterId(
            stockMasterId
          ).subscribe((data: any) => {
            if (data.success) {
              this.master.lstStockOutByBarcodeDetails = data.data;
            }
          });
        }
      });

      this.ngOnInit();
    }
  }

  // public getStockDetailsData(stockMasterId) {
  //   this.StockoutbybarcodeService.getStockDetailsOut(stockMasterId).subscribe((data: any) => {
  //     if (data.success) {
  //       this.master.stockDetailsList = data.data;
  //     }
  //     else {
  //       this.master.stockDetailsList = [];
  //     }
  //   });
  // }

  private agDelete(event) {
    this.master.stockMasterId = event.node.data.stockMasterId;
    this.StockoutbybarcodeService.deleteStockOutById(
      this.master.stockMasterId
    ).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success(this.commonService.deletedmsg, "Message");

        //////////////Grid Refresh ///////////////////
        this.StockoutbybarcodeService.GetStockOutByBarcodeByMasterId(
          this.master.stockMasterId
        ).subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
        });
        //////////////Grid Refresh ///////////////////
      }
    });
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

  //////////// Open Modal ////////////////

  public purchaseOrderFrom = [];
  public getpurchaseOrderFrom(companyId) {
    this.comboService
      .getpurchaseOrderFrom(companyId)
      .subscribe((returns: any) => {
        this.purchaseOrderFrom = returns.data.map((val) => ({
          id: val.employeeId,
          name: val.fullName,
        }));
      });
  }

  public supplierList = [];
  public getSupplier() {
    this.PurchaseorderService.getProductsupplier().subscribe((retuns: any) => {
      if (retuns.success) {
        this.supplierList = retuns.data.map((val: any) => ({
          id: val.supplierId,
          name: val.supplierName,
        }));
      }
    });
  }

  public Clear() {
    // this.master.stockDetailsList = [];
  }

  public companyList = [];
  public getCompany() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyList = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  public getSBU(companyId) {
    this.master.branchSelected = {};
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.sbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }

  public StoreList = [];
  public getStore(sbuId) {
    this.master.storeSelected = {};
    this.StockinService.getStore(sbuId, this.master.companyId).subscribe(
      (returns: any) => {
        this.StoreList = returns.data.map((val) => ({
          id: val.storeId,
          name: val.storeName,
        }));
      }
    );
  }

  public GetMaxStockOutNo() {
    this.StockoutbybarcodeService.GetMaxStockOutNo(
      this.datePipe.transform(this.master.stockDate, "yyyy-MM-dd")
    ).subscribe((returns: any) => {
      if (returns.success) {
        this.master.stockNo = returns.data[0].MaxNo;
      }
    });
  }

  // public POReceiveList = [];
  // public getPOReceive() {
  //   this.StockinService.getPOReceive(0).subscribe((returns: any) => {
  //     this.POReceiveList = returns.data.map((val) => ({
  //       id: val.poReceiveId,
  //       name: val.purOrderRecvNo,
  //     }));
  //   });
  // }

  GetBarcodeDetails() {
    if (this.master.barcodeNo == "") {
      return;
    }
    this.StockoutbybarcodeService.GetBarcodeDetails(
      this.master.barcodeNo
    ).subscribe((data: any) => {
      if (data.success) {
        // let BarcodeDetails: any[];
        this.master.lstStockOutByBarcodeDetails = data.data;
        /*

        barcodeId: 7
        barcodeNo: "2107030001"
        companyId: 1
        companyName: "ONE ICT"
        price: 0
        product: "Asus"
        productId: 31
        productName: "Asus-0006 (SKU_0005,  Version-AA, Other color-SS, Materials-DD)"
        productWiseSpecificationId: 74
        sbuId: 6
        sbuName: "Chittagong"
        stockCategory: "Stock Out by Barcode"
        stockCategoryId: 6
        stockDate: "03-Jul-2021"
        storeId: 15
        stockTypeId:2
        storeName: "store-5"

        */

        // this.master.companyId = data.data[0].companyId;
        // this.master.companySelected = {
        //   id: data.data[0].companyId,
        //   name: data.data[0].companyName,
        // };
        // this.getSBU(this.master.companyId);
        // this.master.branchSelected = {
        //   id: data.data[0].sbuId,
        //   name: data.data[0].sbuName,
        // };
        // this.getStore(this.master.sbuId);
        // this.master.storeSelected = {
        //   id: data.data[0].storeId,
        //   name: data.data[0].storeName,
        // };
        // this.master.stockCategory = "";
        // //this.master.stockCategoryId = 6;
        // this.master.productId = data.data[0].productId;
        // this.master.storeSelected = {
        //   id: data.data[0].productId,
        //   name: data.data[0].product,
        // };
        // this.getAllProductSpecification(this.master.productId)
      } else {
        //this.master.stockDetailsList = [];
      }
    });
  }

  public addStockOutDetails() {
    let details = {
      product: this.master.productSelected["name"],
      productId: this.master.productSelected["id"],
      productName: this.master.productspecificationSelected["name"],
      productWiseSpecificationId:
        this.master.productspecificationSelected["id"],
      CurrentStock: this.master.CurrentStock,
      stockQty: this.master.stockQty,
      barcodeId: 0,
      barcodeNo: "N/A",
      stockTypeId: 2,
      stockMasterId: 0,
      stockDetailsId: 0,
      transactionDetailsId: 0,
      price: 0,
    };
    this.master.lstStockOutByBarcodeDetails.length == 0
      ? (this.master.lstStockOutByBarcodeDetails[0] = details)
      : this.master.lstStockOutByBarcodeDetails.push(details);

    this.master.productSelected = null;
    this.master.productspecificationSelected = null;
    this.master.CurrentStock = 0;
    this.master.stockQty = 0;
  }

  public addStockOutDetailsByBarcode() {
    //debugger;
    if (this.master.barcodeNo == "" || this.master.barcodeNo.length != 10) {
      return;
    }

    this.StockoutbybarcodeService.GetBarcodeDetails(
      this.master.barcodeNo
    ).subscribe((data: any) => {
      if (data.success && data.data.length > 0) {
        //debugger;
        let BarcodeDetails: {};
        BarcodeDetails = data.data[0];
        this.master.lstStockOutByBarcodeDetails.length == 0
          ? (this.master.lstStockOutByBarcodeDetails[0] = BarcodeDetails)
          : this.master.lstStockOutByBarcodeDetails.push(BarcodeDetails);
        this.master.barcodeNo = "";
      }
    });
  }

  // public editDetails(index: any) {
  //   this.selectedRow = this.master.stockDetailsList[index];
  //   this.master.stockQty = this.selectedRow.stockQty;
  //   this.master.CurrentStock = this.selectedRow.CurrentStock;
  //   this.master.productSelected = {
  //     id: this.selectedRow.productId,
  //     name: this.selectedRow.productName,
  //   };
  //   this.getAllProductSpecification(this.selectedRow.productId)
  //   this.master.productspecificationSelected = {
  //     id: this.selectedRow.productWiseSpecificationId,
  //     name: this.selectedRow.productSpecification,
  //   };
  // }

  public DeleteDetails(index: any) {
    this.selectedRow = this.master.lstStockOutByBarcodeDetails[index];
    this.master.lstStockOutByBarcodeDetails.splice(index, 1);
    if (this.selectedRow.helpDetailId > 0) {
    }
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }

  public ProductList = [];
  public getAllProduct() {
    this.StockinwithoutpoService.getAllProduct().subscribe((returns: any) => {
      this.ProductList = returns.data.map((val) => ({
        id: val.productId,
        name: val.productName,
      }));
    });
  }

  public ProductSpecificationList = [];
  public getAllProductSpecification(productId) {
    this.master.productspecificationSelected = {};
    this.StockinwithoutpoService.getAllProductSpecification(
      productId
    ).subscribe((returns: any) => {
      this.ProductSpecificationList = returns.data.map((val) => ({
        id: val.productWiseSpecificationId,
        name: val.productName,
      }));
    });
  }

  public getCurrentStock(specificationId) {
    this.master.CurrentStock = 0;
    this.StockinwithoutpoService.getCurrentStock(
      this.master.productWiseSpecificationId,
      this.master.storeId
    ).subscribe((data: any) => {
      if (data.success) {
        this.master.CurrentStock = data.data[0].CurrentStock;
      } else {
        this.master.CurrentStock = 0;
      }
    });
  }

  public tableHeader = ["#", "Product Name", "Store Name", "Current Stock"];
  private agReport(event) {
    this.toastrService.info("There is no report !", "Message");
    //this.generateStockInReport(event.data.stockMasterId);
  }

  public datalength: number;
  public stockNo = "";
  public stockDate = "";
  public bodyData = [];

  public generateStockInReport(stockMasterId) {
    this.StockoutbybarcodeService.getStockOutReportById(
      stockMasterId
    ).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
        this.stockNo = this.bodyData[0].stockNo;
        this.stockDate = this.bodyData[0].stockDate;
        this.setParam();
        var fileName = this.pageNavigation + ".pdf";
        const content = document.getElementById("reportHeader");
        this.generateReport("print", fileName, content, this.datalength);
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  public params = [];
  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Voucher No",
      leftValue: "",
      rightLabel: "Voucher Date",
      rightValue: "",
    });
  }

  public generateReport(
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
          startY: legend.height + 30,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 80,
          styles: { font: "Meta" },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 120,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
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
            fillColor: [216, 216, 216],
            textColor: 50,
          },
          columnStyles: {
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
          window.open(URL.createObjectURL(doc.output("blob")), "_blank"); //doc.output("dataurlnewwindow");
          doc.close();
        }
      },
    });
  }
}
