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
import { StockinwithoutpoService } from "app/services/inventory/Stockinwithoutpo.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { registerPrebuiltTheme } from "@nebular/theme/schematics/ng-add/register-theme";
import { ProductionPlanService } from "app/services/production/production-plan.service";

@Component({
  selector: 'ngx-stock-in-from-production-by-batch',
  templateUrl: './stock-in-from-production-by-batch.component.html',
  styleUrls: ['./stock-in-from-production-by-batch.component.scss']
})

export class StockInFromProductionByBatchComponent implements OnInit {

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
  master: {
    stockMasterId: number;
    transactionMasterId: number;
    poReceiveId: number;
    companyId: number;
    sbuId: number;
    storeId: number;
    stockNo: string;
    stockDate: Date;
    stockTypeId: string;
    remarks: string;
    productId: number;
    productWiseSpecificationId: number;
    CurrentStock: number;
    stockQty: number;
    companySelected: {};
    supplierSelected: {};
    branchSelected: {};
    storeSelected: {};
    POReceiveSelected: {};
    prodReqSelected: {};
    productSelected: {};
    productspecificationSelected: {};
    transectionSelected: {};
    stockDetailsList: any[];

    batchNo: string;
    mgfDate: Date;
    expireDate: Date;
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

  public pageNavigation = "Stock In From Production"; //"Stock In By OB Or Without PO";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.getMaxPurchaseorderno();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      //this.show = true;
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
      stockMasterId: 0,
      transactionMasterId: null,
      poReceiveId: 0,
      companyId: 0,
      sbuId: 0,
      storeId: 0,
      productId: 0,
      stockNo: "",
      CurrentStock: 0,
      stockQty: 0,
      stockDate: new Date(),
      stockTypeId: "",
      remarks: "",
      companySelected: null,
      supplierSelected: null,
      storeSelected: null,
      branchSelected: null,
      POReceiveSelected: null,
      prodReqSelected: null,
      productWiseSpecificationId: null,
      productSelected: null,
      productspecificationSelected: null,
      transectionSelected: null,
      stockDetailsList: [],

      batchNo: "",
      mgfDate: null,
      expireDate: null,
    };
    this.SetDefaultValue();
    this.GETALLTransection();
  }

  SetDefaultValue() {
    if (this.companyList.length > 0) {
      this.master.companyId = this.companyList[0].id;
      this.master.companySelected = { id: this.companyList[0].id, name: this.companyList[0].name };
      this.getSBU(this.master.companyId);
    }
  }

  transectionList: [];
  GETALLTransection() {
    debugger
    this.productionPlanService.GetTransferNoteListForStockIn(0).subscribe((data: any) => {
      if (data.success) {
        debugger
        this.transectionList = data.data.map((val: any) => ({
          id: val.productTransferId,
          name: val.transferNoteNo + ` (${val.batchTypeName})` + ' | ' + val.transferDate + + ' | Batch: ' + val.batchNo + ' | ' + val.productName + ' | Qty: ' + val.noOfBox,
        }));;
      }
    });
  }

  public getTransferDetailsDataLoad(productTransferId) {
    debugger
    this.master.stockDetailsList = [];

    this.productionPlanService.GetTransferNoteByIdForBatch(productTransferId).subscribe((data: any) => {
      if (data.success) {
        this.master.stockDetailsList = data.data;
      } else {
        this.master.stockDetailsList = [];
      }
    });

  }

  public employeeItems = [];
  public companyItems = [];

  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.companySelected == null) {
      this.toastrService.danger("Please select company.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.branchSelected == null) {
      this.toastrService.danger("Please select branch.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.storeSelected == null) {
      this.toastrService.danger("Please select store.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.stockDate == null) {
      this.toastrService.danger("Please select MR date.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }
    if (
      this.master.stockDetailsList.length == 0 ||
      this.master.stockDetailsList == null
    ) {
      this.toastrService.danger("Please enter a product.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }

    this.show = true;

    this.master.stockDate = this.commonService.DateFormat(this.master.stockDate);
    //console.log(this.master);
    this.StockinwithoutpoService.saveStockIn_FromTransferNote(this.master).subscribe(
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

          this.GetGridData();
          //////////////Grid Refresh ///////////////////
        }
        else {
          this.toastrService.warning(
            this.commonService.failedmsg,
            "Message"
          );
        }
      }
    );

    this.getMaster();
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
  loadFromDateShow: Date = new Date();
  loadToDateShow: Date = new Date();
  constructor(
    private http: HttpClient,
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private PurchaseorderService: PurchaseorderService,
    private StockinService: StockinService,
    private StockinwithoutpoService: StockinwithoutpoService,
    private comboService: CommoncomboService,
    private productionPlanService: ProductionPlanService,
  ) {
    this.loadFromDateShow.setDate(this.loadFromDateShow.getDate() - 1);
    this.commonService.valueSet("showlist");
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
        headerName: "Receive No.",
        field: "stockNo",
        // filter: "agNumberColumnFilter",
        editable: false,
        width: 160,
      },
      {
        headerName: "Received Date",
        field: "stockDate",
        width: 160,
      },
      {
        headerName: "Factory Name",
        field: "storeName",
        width: 140,
      },
      // {
      //   headerName: "Stock Type",
      //   field: "stockName",
      //   width: 140,
      // },
      {
        headerName: "Remarks",
        field: "remarks",
        width: 460,
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
    this.GetGridData();
  }
  GetGridData() {
    this.StockinwithoutpoService.GetStockInWithProductionById_FromTransferNote(0, this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    })
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
      //this.agEdit(event);
      this.show = false;
    } else if (data == "view") {
      //this.agEdit(event);
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

      this.StockinwithoutpoService.GetStockInWithProductionById_FromTransferNote(stockMasterId).subscribe(
        (data: any) => {
          if (data.success) {
            this.master = data.data[0];
            this.master.stockDate = new Date(this.master.stockDate);

            this.getCompany();
            //this.ProductSpecificationList = [];
            this.getSBU(0);
            this.getStore(0);

            this.master.companySelected = {
              id: data.data[0].companyId,
              name: data.data[0].companyName,
            };
            this.master.branchSelected = {
              id: data.data[0].sbuId,
              name: data.data[0].sbuName,
            };
            this.master.storeSelected = {
              id: data.data[0].storeId,
              name: data.data[0].storeName,
            };
            this.master.POReceiveSelected = {
              id: data.data[0].poReceiveId,
              name: data.data[0].purOrderRecvNo,
            };
          }
        }
      );
      this.getStockDetailsData(stockMasterId);
      this.ngOnInit();
    }
  }

  public getStockDetailsData(stockMasterId) {
    this.master.stockDetailsList = [];
    this.StockinwithoutpoService.getStockDetailsWithOutPOIn(
      stockMasterId
    ).subscribe((data: any) => {
      if (data.success) {
        this.master.stockDetailsList = data.data;
      } else {
        this.master.stockDetailsList = [];
      }
    });
  }

  public getCurrentStock(specificationId) {
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

  private agDelete(event) {
    if (confirm('Are you sure to delete')) {
      this.master.stockMasterId = event.node.data.stockMasterId;
      this.StockinService.deleteStockInById(this.master.stockMasterId).subscribe(
        (returns: any) => {
          if (returns.success) {
            this.toastrService.success(this.commonService.deletedmsg, "Message");

            //////////////Grid Refresh ///////////////////
            this.GetGridData();
            //////////////Grid Refresh ///////////////////
          }
        }
      );
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
    this.master.stockDetailsList = [];
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
      if (returns.status) {
        this.sbus = returns.data.map((val) => ({
          id: val.sbuId,
          name: val.sbuName,
        }));

        if (returns.data.length == 1) {
          this.master.sbuId = this.sbus[0].id;
          this.master.branchSelected = { id: this.sbus[0].id, name: this.sbus[0].name }
          this.getStore(this.master.sbuId);
        }
      }
    });
  }

  public StoreList = [];
  public getStore(sbuId) {
    this.master.storeSelected = {};
    console.log(this.master.companyId, sbuId);
    this.StockinService.getStore(sbuId, this.master.companyId).subscribe(
      (returns: any) => {
        if (returns.status) {
          this.StoreList = returns.data.map((val) => ({
            id: val.storeId,
            name: val.storeName,
          }));

          if (returns.data.length == 1) {
            this.master.storeId = this.StoreList[0].id;
            this.master.storeSelected = { id: this.StoreList[0].id, name: this.StoreList[0].name }
          }
        }
      }
    );
  }

  public getMaxPurchaseorderno() {
    this.StockinService.getmaxMRNo("").subscribe((returns: any) => {
      if (returns.success) {
        this.master.stockNo = returns.data[0].MaxNo;
      }
    });
  }

  public addStockdetails() {

    if (this.master.batchNo == null || this.master.batchNo.trim() == '' || this.master.batchNo == undefined) {
      this.toastrService.warning("Please input actual Batch Number!", "warning");
      return;
    }

    if (this.master.mgfDate == null || this.master.mgfDate == undefined) {
      this.toastrService.warning("Please input actual Manufacturing Date!", "warning");
      return;
    }

    if (this.master.expireDate == null || this.master.expireDate == undefined) {
      this.toastrService.warning("Please input actual Expire Date!", "warning");
      return;
    }

    this.master.mgfDate = this.commonService.DateFormat(this.master.mgfDate);
    this.master.expireDate = this.commonService.DateFormat(this.master.expireDate);
    if (this.master.mgfDate == this.master.expireDate) {
      this.toastrService.warning("Manufacture & Expire Date can not be same!", "warning");
      return;
    }

    let expireDate: any = this.master.expireDate;
    let mgfDate: any = this.master.mgfDate;
    var daysDiff: any = Math.floor((expireDate - mgfDate) / (1000 * 60 * 60 * 24));
    console.log('daysDiff: ', daysDiff);

    if (daysDiff == null || daysDiff < 90) {
      this.toastrService.warning("Invalid Manufacturing or Expire Date! Days different between Mfg. and Expire is very short.", "warning");
      return;
    }

    let detail = {
      // productName: this.master.productSelected["name"],
      // productId: this.master.productSelected["id"],
      productName: '',
      productId: null,
      productSpecification: this.master.productspecificationSelected["name"],
      productWiseSpecificationId:
        this.master.productspecificationSelected["id"],
      CurrentStock: this.master.CurrentStock,
      stockQty: this.master.stockQty,
      batchNo: this.master.batchNo,
      mgfDate: this.commonService.DateFormat(this.master.mgfDate, "dd-MMM-yyyy"),
      expireDate: this.commonService.DateFormat(this.master.expireDate, "dd-MMM-yyyy"),
    };

    var result = this.master.stockDetailsList.filter(
      (x) =>
        x.productWiseSpecificationId == this.master.productWiseSpecificationId
    );

    // if (result.length > 0) {
    //   this.master.stockDetailsList[0] = detail;
    // } else {
    //   this.master.stockDetailsList.push(detail);
    // }

    this.master.stockDetailsList.splice(0, 0, detail);

    this.master.productWiseSpecificationId = 0;
    this.master.productspecificationSelected = {};
    this.master.CurrentStock = 0;
    this.master.stockQty = null;
    this.master.batchNo = '';
    //  this.master.mgfDate,
    //   this.master.expireDate,
  }

  public ProductList = [];
  public getAllProduct() {
    // this.StockinwithoutpoService.getAllProduct().subscribe((returns: any) => {
    //   this.ProductList = returns.data.map((val) => ({
    //     id: val.productId,
    //     name: val.productName,
    //   }));
    // });

    this.getAllProductForRequisition();
  }

  public ProductSpecificationList = [];
  public getAllProductSpecification(productId) {
    // this.master.productspecificationSelected = {};
    // this.StockinwithoutpoService.getAllProductSpecification(
    //   productId
    // ).subscribe((returns: any) => {
    //   this.ProductSpecificationList = returns.data.map((val) => ({
    //     id: val.productWiseSpecificationId,
    //     name: val.productName,
    //   }));
    // });

  }

  public getAllProductForRequisition() {
    //this.master.productspecificationSelected = {};
    this.StockinwithoutpoService
      .getAllProductForRequisition()
      .subscribe((returns: any) => {
        this.ProductSpecificationList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uomId: val.uomId,
          uomName: val.uomName,
          productId: val.productId,
          price: val.price,
          tradePrice: val.tradePrice,
          unitVat: val.unitVat,
        }));
      });
  }

  public editDetails(index: any) {
    this.selectedRow = this.master.stockDetailsList[index];
    this.master.stockQty = this.selectedRow.stockQty;
    this.master.CurrentStock = this.selectedRow.CurrentStock;
    this.getAllProduct();
    this.master.productSelected = {
      id: this.selectedRow.productId,
      name: this.selectedRow.productName,
    };
    this.getAllProductSpecification(this.master.productId);
    this.master.productspecificationSelected = {
      id: this.selectedRow.productWiseSpecificationId,
      name: this.selectedRow.productSpecification,
    };
  }

  public DeleteDetails(index: any) {
    this.selectedRow = this.master.stockDetailsList[index];
    this.master.stockDetailsList.splice(index, 1);
    if (this.selectedRow.helpDetailId > 0) {
    }
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }

  public tableHeader = ["#", "Product Name", "Batch No.", "Stock Qty.", "Current Stock"];
  private agReport(event) {
    this.generateStockInReport(event.data.stockMasterId);
  }

  public datalength: number;
  public stockNo = "";
  public stockDate = "";
  public storeName = "";
  public bodyData = [];

  public generateStockInReport(stockMasterId) {
    this.StockinwithoutpoService.getStockInWithOutPoReportById(
      stockMasterId
    ).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
        this.stockNo = this.bodyData[0].stockNo;
        this.stockDate = this.bodyData[0].stockDate;
        this.storeName = this.bodyData[0].storeName;
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
