
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
//import { NavigationStart, Router } from "@angular/router";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { ProductService } from "app/services/inventory/product.service";
import { BranchService } from "app/services/erpsetting/branch.service";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { BillcollectionService } from "app/services/sales/billcollection.service";
import { StockinService } from "app/services/inventory/stockin.service";
import { forkJoin } from "rxjs";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-stationaries-product-transfer',
  templateUrl: './stationaries-product-transfer.component.html',
  styleUrls: ['./stationaries-product-transfer.component.scss']
})
export class StationariesProductTransferComponent implements OnInit {

  master: {
    prodReqId: number;
    productReqDetailsId: number;
    prodReqNo: string;
    batchNo: string;
    prodReqDate: Date;
    fromWarehouseId: number;
    toWarehouseId: number;
    purpose: string;
    driverName: string;
    vehicleNo: string;
    isUrgency: number;
    approvalStatus: number;
    prodName: string;
    reqQty: number;
    productWiseSpecificationId: number;
    productName: string;
    transferType: string;
    uomName: string;
    isDelete: number;
    isActive: number;

    productSelected: [];
    fromsbusSelected: {};
    tosbusSelected: {};
    companySelected: {};
    fromStoreSlected: {};
    BatchSelected: {};

    fromsbuId: number;
    fromsbuName: string;
    tosbuId: number;
    tosbuName: string;
    requisitionBy: string;
    //productReqDetails: [];
    companyId: number;
    fromStoreId: number;
    lstReqDetailsViewModel: any[];
  };

  protected options: {};
  protected cd: ChangeDetectorRef;
  showMessages: any = {};
  errors: string[];
  msbus
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
    { title: null, body: "Toaster rock!" },
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

  public pageNavigation = "Stationaries Product Transfer";
  public rptHeader = "Product Issue (TD)";

  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.getProductReqNo();
      //this.master.isActive = 1;
      this.show = false;

      if (this.fromsbus.length > 0) {
        this.master.fromsbuId = this.fromsbus[0].id;
        this.master.fromsbusSelected = {
          id: this.fromsbus[0].id,
          name: this.fromsbus[0].name,
        }
      }

      if (this.StoreList.length > 0) {
        this.master.fromStoreSlected = { id: this.StoreList[0].id, name: this.StoreList[0].name };
        this.master.fromStoreId = this.StoreList[0].id;
      }

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
      prodReqId: 0,
      productReqDetailsId: 0,
      prodReqNo: "",
      batchNo: "",
      prodReqDate: new Date(),
      fromWarehouseId: 0,
      toWarehouseId: 0,
      purpose: "",
      driverName: "",
      vehicleNo: "",
      isUrgency: 0,
      approvalStatus: 0,
      prodName: "",
      reqQty: null,
      productWiseSpecificationId: 0,
      productName: "",
      transferType: "SD2D",
      uomName: "",
      isDelete: 0,
      isActive: 1,

      productSelected: null,
      fromsbusSelected: null,
      tosbusSelected: null,
      companySelected: null,
      fromStoreSlected: null,
      BatchSelected: null,

      fromsbuId: 0,
      fromsbuName: "",
      tosbuId: 0,
      companyId: 0,
      fromStoreId: 0,
      tosbuName: "",
      requisitionBy: "",
      //productReqDetails: null,
      lstReqDetailsViewModel: [],
    };
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
      this.commonService.onExportCSV(this.gridApi, this.rptHeader);
    } else {
      console.log("Click action button");
    }
  }
  /////End of Dynamic Button section (Do Not Edit)///////

  /////////////////////////////// CRUD ///////////////////////////////////////////

  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.prodReqNo == "" || this.master.prodReqNo == null) {
      this.toastrService.danger("Please enter a transfer No.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.prodReqDate == null) {
      this.toastrService.danger("Please enter transfer date.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.fromsbuId == 0 || this.master.fromsbuId == null) {
      this.toastrService.danger("Please select from sbu.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.tosbuId == 0 || this.master.tosbuId == null) {
      this.toastrService.danger("Please select to sbu.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (
      this.master.lstReqDetailsViewModel.length == 0 ||
      this.master.lstReqDetailsViewModel == null
    ) {
      this.toastrService.danger("Please enter a product.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    this.master.prodReqDate = this.commonService.DateFormat(this.master.prodReqDate);
    console.log('m: ', this.master);

    this.productrequisitionService
      .setDepotToDepotTransfer(this.master)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.show = true;
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
          this.getProductReqNo();
          this.GetGridData();
          //////////////Grid Refresh ///////////////////
        }
        else {
          this.commonService.valueSet("create");
          this.toastrService.warning(returns.message, "Message");
        }
      });
  }

  private reset() {
    // this.getMaster();
    // this.getProductReqNo();
    window.location.reload();
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
  serverDate = [];
  loadFromDateShow: Date = new Date();
  loadToDateShow: Date = new Date();
  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private productrequisitionService: ProductrequisitionService,
    private ProducttransferService: ProducttransferService,
    private comboService: CommoncomboService,
    private productService: ProductService,
    private branchService: BranchService,
    private stockinService: StockinService,
    protected dateService: NbDateService<Date>,
    private billcollectionService: BillcollectionService
  ) {
    this.loadFromDateShow.setDate(this.loadFromDateShow.getDate() - 1);
    this.commonService.valueSet("showlist");
    this.getServerDateTime();//this.SetServerDate();
    this.getProductDetails();
    // this.getWarehouse(0);
    this.getSBU(0);
    this.getSbuWhithoutSelf(0);

    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 50,
      }, /// Dont Change
      // {
      //   headerName: "Product Req. ID",
      //   field: "prodReqId",
      //   filter: "agNumberColumnFilter",
      //   editable: false,
      //   width: 180,
      // },
      {
        headerName: "Product Transfer No.",
        field: "prodTrnNo",
        width: 180,
      },
      {
        headerName: "Product Req. No.",
        field: "prodReqNo",
        width: 180,
      },
      {
        headerName: "Date",
        field: "prodTrnDate",
        width: 180,
      },
      {
        headerName: "From Depot",
        field: "fromSbuName",
        width: 180,
      },
      {
        headerName: "To Depot",
        field: "tosbuName",
        width: 180,
      },
      {
        headerName: "Receive Status",
        field: "receiveStatus",
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
    };

    this.getMaster();
    this.getProductReqNo();


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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.GetGridData();
  }
  GetGridData() {
    this.ProducttransferService
      .GetProductTransferById(0, this.master.transferType, this.loadFromDateShow, this.loadToDateShow).subscribe(
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
    this.commonService.agButtonClicked = "";
    if (data == "edit") {
      let receiveStatus = event.node.data.receiveStatus;
      if (receiveStatus && receiveStatus == "Received") {
        this.commonService.valueSet("showlist");
        this.toastrService.info("Already Received! You can not Edit!", 'Info')
        return;
      }
      this.agEdit(event);
      this.show = false;
    } else if (data == "view") {
      this.agEdit(event);
      this.show = false;
      this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      if (this.commonService.getUserGroup() == '1') {
        if (confirm("Are you sure to delete?")) {
          this.agDelete(event);
        }
      }
      else {
        this.toastrService.info("Access denied", "Message");
      }
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
      var prodReqId = event.node.data.prodTrnfrId;

      this.ProducttransferService
        .GetProductTransferById(prodReqId, this.master.transferType)
        .subscribe((data: any) => {
          if (data.success) {
            debugger;
            this.master = data.data[0];
            this.master.prodReqDate = new Date(data.data[0].prodTrnDate);
            //console.log(data.data);
            //console.log("agEdit Click");
            this.master.prodReqNo = data.data[0].prodTrnNo;
            this.master.fromsbusSelected = {
              id: this.master.fromsbuId,
              name: data.data[0].fromSbuName,
            };

            this.getStore(this.master.fromsbuId);
            //  this.GetAllProductReqNumberBySbuId(this.master.fromsbuId);

            this.master.tosbusSelected = {
              id: this.master.tosbuId,
              name: data.data[0].tosbuName,
            };

          }
          this.ProducttransferService.GetProductTransferDetailsByMasterId(prodReqId)
            .subscribe((data: any) => {
              if (data.success) {
                this.master.lstReqDetailsViewModel = data.data;
              }
            });
          console.log("master model");
          console.log(this.master);

          this.master.fromsbusSelected = {
            id: data.data[0].fromsbuId,
            name: data.data[0].fromSbuName,
          };
          this.master.tosbusSelected = {
            id: data.data[0].tosbuId,
            name: data.data[0].tosbuName,
          };
          this.master.tosbusSelected = {
            id: data.data[0].tosbuId,
            name: data.data[0].tosbuName,
          };

          this.master.transferType = 'SD2D';
        });

      this.ngOnInit();
    }
  }

  public StoreList = [];
  public getStore(fromsbuId: number) {
    //this.master.storeSelected = [];
    this.stockinService
      .getStore(fromsbuId, this.master.companyId)
      .subscribe((returns: any) => {
        this.StoreList = returns.data.map((val) => ({
          id: val.storeId,
          name: val.storeName,
        }));
        if (returns.data.length > 0) {
          this.master.fromStoreSlected = { id: returns.data[0].storeId, name: returns.data[0].storeName };
          this.master.fromStoreId = returns.data[0].storeId;
        }
        this.getSbuWhithoutSelf(1);
      });
  }

  private agDelete(event) {
    this.master.prodReqId = event.node.data.prodTrnfrId;
    let receiveStatus = event.node.data.receiveStatus;
    if (receiveStatus == "Received") {
      this.toastrService.warning('You Can not delete this, because it`s already Received.', "Message");
      return;
    }
    this.ProducttransferService.DeleteProductTransferById(this.master.prodReqId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.GetGridData();
          //////////////Grid Refresh ///////////////////
        }
      });
  }

  public getWarehouse(sbuId) {
    this.branchService.getBranchById(sbuId).subscribe((data: any) => {
      //debugger;
      console.log(data);

      if (data.success) {
        this.master = data.data[0];

        this.master.fromsbusSelected = {
          id: data.data[0].sbuId,
          name: data.data[0].sbuName,
        };
      }
    });
  }
  public sbus = [];
  public fromsbus = [];
  public tosbus = [];
  public getSBU(companyId) {
    //debugger;
    //this.master.fromsbusSelected = null;
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.fromsbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
      this.getStore(this.fromsbus[0].id);
    });
  }

  public getSbuWhithoutSelf(companyId) {
    //debugger;
    //this.master.fromsbusSelected = null;
    this.comboService.getSbuWhithoutSelf(companyId).subscribe((returns: any) => {
      this.tosbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));

      this.tosbus = this.tosbus.filter((element) => {
        return (element.id != 19 && element.id != 33);
      });
    });
  }
  public getProductReqNo() {
    if (this.master.prodReqDate == null) {
      //console.log("Mintu Bhai");
      this.master.prodReqDate = new Date("dd-MM-yyyy");
    }

    this.ProducttransferService.GetMaxProductTransferNumber(
      this.commonService.DateFormat(this.master.prodReqDate), this.master.transferType
    )
      .subscribe((returns: any) => {
        //console.log(returns);
        if (returns.success) {
          this.master.prodReqNo = returns.data[0].MaxNo;
        }
      });
  }
  public getFromWarehouse() { }

  public prodSelected = [];

  public getProductDetails() {
    this.productrequisitionService
      .getAllProductForRequisitionByProductTypeId(0)
      .subscribe((returns: any) => {
        //console.log(returns.data);
        this.prodSelected = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          productId: val.productId,
          uomId: val.uomId,
          uomName: val.uomName,
          packSize: val.packSize
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

    this.currentStock = 0;
    this.master.batchNo = "";
    this.BatchList = [];
    this.master.BatchSelected = {};

    if ((this.master.fromStoreId == null || 0) || (this.master.fromStoreSlected == undefined || null)) {
      this.toastrService.warning('Please select a store.', 'Msg');
      return;
    }

    this.master.uomName = this.master.productSelected["uomName"];
    this.GetCurrentStock();
  }

  //public lstReqDetailsViewModel = [];

  currentStock: number = 0;
  GetCurrentStock() {
    // this.currentStock = 0;
    // let apiUrl = `ProductRequisition/GetProductCurrentStockBySbuId?productWiseSpecificationId=${this.master.productWiseSpecificationId}&sbuId=${this.master.fromsbuId}`;
    // this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
    //   if (returns.success) {
    //     this.currentStock = returns.data[0].currentStock;
    //   }
    // });

    this.currentStock = null;
    this.BatchList = [];
    this.master.BatchSelected = {};

    let apiUrl = `SalesInvoice/GetProductBatch?storeId=${this.master.fromStoreId}&productWiseSpecificationId=${this.master.productWiseSpecificationId}`;
    debugger;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      debugger;
      if (returns.success) {
        this.BatchList = returns.data.map((val: any) => ({
          id: val.id,
          name: val.name,
          batchNo: val.batchNo,
          currentStock: val.currentStock,
          EXPIREDATE: val.EXPIREDATE,
        }));


        if (returns.data.length > 0) {
          this.master.batchNo = returns.data[0].batchNo;
          this.currentStock = returns.data[0].currentStock;
          this.master.BatchSelected = {
            id: returns.data[0].id,
            name: returns.data[0].name,
            batchNo: returns.data[0].batchNo,
            currentStock: returns.data[0].currentStock,
            EXPIREDATE: returns.data[0].EXPIREDATE,
          };
        } else {
          this.toastrService.warning("Current stock information not available for this product.", "Message");
        }
      }
    });
  }

  BatchList: any = [];
  getBatchStock() {
    this.currentStock = 0;
    this.stockinService
      .GetCurrentStock(this.master.fromStoreId, this.master.productWiseSpecificationId, this.master.batchNo)
      .subscribe((returns: any) => {
        //console.log(returns.data);
        this.currentStock = returns.data.length > 0 ? returns.data[0].currentStock : 0;
      });
  }

  public addDetails() {
    //console.log(this.master.productSelected);
    if (!this.master.BatchSelected) {
      this.toastrService.danger('Batch Number not found. Without Batch you can not invoice for this product', 'Warning');
      return;
    }

    if (this.master.batchNo.trim() == "") {
      this.toastrService.danger('Batch Number not found. Without Batch you can not invoice for this product', 'Warning');
      return;
    }
    if (
      this.master.productWiseSpecificationId == 0 ||
      this.master.productWiseSpecificationId == null
    ) {
      this.toastrService.warning("Please select product.", "Message");
      return false;
    }
    if (this.currentStock == null) {
      this.toastrService.warning("Current stock information not available for this product.", "Message");
      return false;
    }
    if (this.master.reqQty == 0 || this.master.reqQty == null) {
      this.toastrService.warning("Please enter quanty.", "Message");
      return false;
    }
    if (this.master.reqQty > this.currentStock) {
      this.toastrService.warning("Stock not available !", "Message");
      return false;
    }
    var indexu = this.master.lstReqDetailsViewModel.findIndex((x) => x.productWiseSpecificationId == this.master.productWiseSpecificationId && x.batchNo == this.master.batchNo);
    if (indexu > -1) {
      this.toastrService.warning("Product Already Exist !!", "Warning");
      return;
    }
    //this.getProductDetails();
    let detail = {
      productReqDetailsId: 0, //this.master.lstReqDetailsViewModel.productReqDetailsId,
      productWiseSpecificationId: this.master.productWiseSpecificationId,
      dropdown: this.prodSelected,
      productId: this.master.productSelected["productId"],
      productName: this.master.productSelected["name"],
      uomId: this.master.productSelected["uomId"],
      packSize: this.master.productSelected["packSize"],
      fromStoreId: this.master.fromStoreSlected["id"],
      reqQty: this.master.reqQty,
      uomName: this.master.uomName,
      batchNo: this.master.batchNo,
      currentStock: this.currentStock,
      isActive: 1,
    };


    //this.master.lstReqDetailsViewModel.push(detail);
    if (detail.reqQty != 0) {
      //this.master.lstReqDetailsViewModel.push(detail);
      this.master.lstReqDetailsViewModel.splice(0, 0, detail);
    } else {
      this.toastrService.danger("Quantity is zero.", "Message");
      return;
    }





    this.master.productSelected = null;
    this.master.BatchSelected = null;
    this.master.reqQty = null;
    this.master.uomName = "";
    this.master.batchNo = '';
    this.currentStock = 0;
    this.BatchList = []
    //console.log(this.master.lstReqDetailsViewModel);
  }

  public deleteDetail(index: any) {
    if (confirm("Are you sure to delte?")) {

      let detailId = this.master.lstReqDetailsViewModel[index].productTrnfrDetailsId;
      console.log(detailId);
      if ((detailId ?? 0) > 0) {
        this.ProducttransferService
          .DeleteProductTransferDetailsById(detailId)
          .subscribe((returns: any) => {
            if (returns.success) {
              this.toastrService.success(this.commonService.deletedmsg, "Warning");
              this.master.lstReqDetailsViewModel.splice(index, 1);
            }
          });
      }
      else {
        this.selectedRow = this.master.lstReqDetailsViewModel[index];
        this.master.lstReqDetailsViewModel.splice(index, 1);
        if (this.selectedRow.helpDetailId > 0) {
        }
        this.toastrService.danger(this.commonService.deletedmsg, "Message");

      }

    }
  }

  public refesh() {
    this.master.lstReqDetailsViewModel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
  }

  //////////////////////////////////End of Ag Grid Data Load/////////////////////////////////

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

  public getCompany() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyItems = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  public tableHeader = ["#", "Product Name", "Pack Size", "Batch No.", "UOM", "Transfer Qty."];
  private agReport(event) {
    // this.getReportData(event.data.prodTrnfrId);
    this.generateCrReport("Pdf", event.data.prodTrnfrId);
  }


  apiUrl: any = ""
  generateCrReport(reportFormat: any, stockTransferId: any) {
    // debugger;

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();


    //console.log("userInfo[0].employeeid", userInfo[0].employeeid);
    let reportHeaderName = "Depot To Depot Stock Transfer"; //"Product Issue (TD)";
    this.apiUrl = `SalesInvoiceReport/GetStockTransferReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&stockTransferId=${stockTransferId}&reportHeader=${reportHeaderName}`;

    //console.log(this.apiUrl);
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }


  datalength: number;
  prodReqNo = "";
  prodReqDate = "";
  bodyData = [];
  headerData = [];
  params = [];

  public getReportData(masterId) {

    forkJoin([this.ProducttransferService.GetProductTransferById(masterId, this.master.transferType),
    this.ProducttransferService.GetProductTransferDetailsByMasterId(masterId)
    ])
      .subscribe(([returnsMaster, returnsDetails]) => {
        if (returnsMaster.success) {
          this.headerData = returnsMaster.data;
          this.bodyData = returnsDetails.data;
          this.params = [];
          this.params.push({
            leftLabel: "Transfer No.",
            leftValue: `: ${this.headerData[0].prodTrnNo}`,
            rightLabel: "Transfer Date",
            rightValue: `: ${this.headerData[0].prodTrnDate}`,
          });
          this.params.push({
            leftLabel: "From",
            leftValue: `: ${this.headerData[0].fromSbuName}`,
            rightLabel: "To",
            rightValue: `: ${this.headerData[0].tosbuName}`,
          });
          this.params.push({
            leftLabel: "Driver Name",
            leftValue: `: ${this.headerData[0].driverName}`,
            rightLabel: "Vehicle No.",
            rightValue: `: ${this.headerData[0].vehicleNo}`,
          });



          var fileName = this.rptHeader + ".pdf";
          const content = document.getElementById("reportHeader");
          this.generateReport("print", fileName, content, this.datalength);
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
  }


  /////////////////////////////report
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
          bodyStyles: {
            //fillColor: [216, 216, 216],
            textColor: 50,
          },
          alternateRowStyles: {
            //fillColor: [250, 250, 250],
          },
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 80,
          styles: { font: "Meta" },
          tableLineColor: [0, 0, 0],

          bodyStyles: {
            //fillColor: [216, 216, 216],
            textColor: 50,
          },
          alternateRowStyles: {
            //fillColor: [250, 250, 250],
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 160,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [250, 250, 250],
            fontSize: 11,
            textColor: 50,
          },
          bodyStyles: {
            //fillColor: [216, 216, 216],
            textColor: 50,
          },
          columnStyles: {
            5: { halign: "right" },
            //5: { halign: "right" },
          },

          alternateRowStyles: {
            //fillColor: [250, 250, 250],
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