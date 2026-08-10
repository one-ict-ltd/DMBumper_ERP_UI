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
// import { NavigationStart, Router } from "@angular/router";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { ProducttransferService } from "app/services/inventory/producttransfer.service";
// import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { ProductService } from "app/services/inventory/product.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { StockinService } from "app/services/inventory/stockin.service";

import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { forkJoin } from "rxjs";


import * as XLSX from 'xlsx';
// import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "node:constants";
type AOA = any[][];

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-producttransfer-v2-without-batch',
  templateUrl: './producttransfer-v2-without-batch.component.html',
  styleUrls: ['./producttransfer-v2-without-batch.component.scss']
})
export class ProducttransferV2WithoutBatchComponent implements OnInit {

  serverDate: any[];

  loadFromDateShow: Date = new Date();
  loadToDateShow: Date = new Date();

  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private ProducttransferService: ProducttransferService,
    // private productrequisitionService: ProductrequisitionService,
    private productService: ProductService,
    private comboService: CommoncomboService,
    protected dateService: NbDateService<Date>,
    private stockinService: StockinService
  ) {
    this.loadFromDateShow.setDate(this.loadFromDateShow.getDate() - 1);
    this.commonService.valueSet("showlist");
    this.getServerDateTime();//this.SetServerDate();
    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 70,
      }, /// Dont Change
      // {
      //   headerName: "purchase Req. ID",
      //   field: "prodTrnfrId",
      //   filter: "agNumberColumnFilter",
      //   editable: false,
      //   width: 120,
      // },
      {
        headerName: "Product Transfer No.",
        field: "prodTrnNo",
        width: 200,
      },
      {
        headerName: "Transfer Date",
        field: "prodTrnDate",
        width: 180,
      },
      // {
      //   headerName: "From Warehouse",
      //   field: "fromSbuName",
      //   width: 160,
      // },
      {
        headerName: "To Depot",
        field: "tosbuName",
        width: 160,
      },
      {
        headerName: "Receive Status",
        field: "receiveStatus",
        width: 160,
      },
      {
        headerName: "Product Req. No.",
        field: "prodReqNo",
        width: 200,
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
    this.getProductTransferNo();
    this.getSBU(0);
    this.getSbuWhithoutSelf(0);
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
    this.ProducttransferService.GetProductTransferById(0, this.master.transferType, this.loadFromDateShow, this.loadToDateShow).subscribe(
      (data: any) => {
        if (data.success) {
          this.rowData = data.data;
        }
      }
    );
  }
  master: {
    prodTrnfrId: number;
    prodTrnNo: string;
    productReqId: number;
    prodReqNo: string;
    prodTrnDate: Date;

    fromWarehouseId: string;
    toWarehouseId: string;
    fromsbuId: number;
    tosbuId: number;

    purpose: string;
    isUrgency: number;
    approvalStatus: number;
    productWiseSpecificationId: number;
    PurchaseReqDetailsId: number;
    prodReqId: number;
    prodName: string;
    productName: string;
    uomName: string;
    fromSbuName: string;
    tosbuName: string;
    transferType: string;
    isDelete: number;
    isActive: number;

    reqQty: number;
    productReqNoSelected: {};
    productSelected: [];
    fromStoreSlected: {};
    storeId: number;

    fromsbusSelected: {};
    tosbusSelected: {};
    toStorselected: {};
    storeSelected: [];
    companyId: number;
    lstDetailsViewModel: any[];
  };

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

  public pageNavigation = "Issue to Depot by Excel (CSD)  [Stock Send From Factory]";
  public rptHeader = "Issue to Depot (CSD)";
  public tableHeader = ["#", "Product Name", "Pack Size", "Batch No.", "UOM", "Qty"];

  public buttons = this.commonService.btnList;

  SbuAutoSelect() {
    if (this.fromsbus.length > 0) {
      //console.log("this.fromsbus[0]", this.fromsbus)
      this.master.fromsbusSelected = {
        id: this.fromsbus[0].id,
        name: this.fromsbus[0].name,
      }
      this.getStore(this.fromsbus[0].id);
      this.GetAllProductReqNumberBySbuId(this.fromsbus[0].id);
    }
  }

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;

      this.SbuAutoSelect();
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");
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
      //this.edit();
      this.show = false;
    }
  }
  public getMaster() {
    this.master = {
      prodTrnfrId: 0,
      prodTrnNo: "",
      productReqId: 0,
      prodTrnDate: new Date(),
      fromWarehouseId: "",
      toWarehouseId: "",
      purpose: "",
      isUrgency: 0,
      approvalStatus: 0,
      productWiseSpecificationId: 0,
      PurchaseReqDetailsId: 0,
      prodReqId: 0,
      prodReqNo: "",
      prodName: "",
      reqQty: 0,
      productName: "",
      uomName: "",
      fromSbuName: "",
      transferType: "F2D",
      tosbuName: "",
      isDelete: 0,
      isActive: 1,

      productReqNoSelected: null,
      productSelected: null,
      fromStoreSlected: null,
      storeId: 0,
      toStorselected: null,
      fromsbusSelected: null,
      tosbusSelected: null,

      fromsbuId: 0,
      tosbuId: 0,
      lstDetailsViewModel: null,

      storeSelected: null,
      companyId: 0,
    };
    this.getProductTransferNo();
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
      //console.log("Click action button");
    }
  }
  /////End of Dynamic Button section (Do Not Edit)///////

  /////////////////////////////// CRUD ///////////////////////////////////////////

  isDisabled: boolean = false;
  private save() {
    console.log(this.master);

    // this.master.lstDetailsViewModel.forEach(element => {
    //   if (element.batchNo.trim() == "")
    //     this.toastrService.danger(`Batch Number not found. Without Batch you can not Transfer ${element.productName}`, 'Warning');
    //   return false;
    // });

    if (this.master.fromsbusSelected == null) {
      this.toastrService.danger("Please select from sbu.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    // if (this.master.productReqNoSelected == null) {
    //   this.toastrService.danger(
    //     "Please select product requisition.",
    //     "Message"
    //   );
    //   this.commonService.valueSet("create");
    //   return false;
    // }

    if (this.master.fromStoreSlected == null) {
      this.toastrService.danger("Store not found.", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    if (
      this.master.lstDetailsViewModel == null ||
      this.master.lstDetailsViewModel.length == 0
    ) {
      this.toastrService.danger("Please upload Excel data.", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    if (
      this.verifyStatus != "Successed"
    ) {
      this.toastrService.danger("Please verify the data first.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    this.master.prodTrnDate = this.commonService.DateFormat(this.master.prodTrnDate);

    console.log(this.master);
    var button = this.commonService.buttonClicked;

    this.isDisabled = true;
    this.ProducttransferService.SaveProductTransferWithoutBatch(this.master).subscribe(
      (returns: any) => {
        if (returns.success) {
          this.verifyStatus = '';

          this.isDisabled = false;
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
          this.GetGridData();
          this.show = true;
          //////////////Grid Refresh ///////////////////
        }
        else {

          this.show = false;
          this.commonService.valueSet("create");
          this.isDisabled = false;
          this.toastrService.warning(
            returns.message,
            "Message"
          );
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

  private gridApi;
  private gridColumnApi;

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

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
      this.show = true;
      this.commonService.valueSet("showlist");
      let receiveStatus = event.node.data.receiveStatus;
      if (receiveStatus && receiveStatus == "Received") {
        this.toastrService.info("Already Received! You can not Edit!", 'Info')
        return;
      }
      this.toastrService.info("Access denied, you can delete this CSD", "Message");
      //this.agEdit(event);
      //this.show = false;
    } else if (data == "view") {
      this.agEdit(event);
      this.show = false;
      this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      if (this.commonService.getUserGroup() == '1') {
        this.agDelete(event);
      }
      else {
        // this.toastrService.info("Access denied", "Message");
        this.agDelete(event);
      }
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  private agEdit(event) {

    let receiveStatus = event.node.data.receiveStatus;
    if (receiveStatus && receiveStatus == "Received") {
      this.toastrService.info("You Can't Edit Received Product!", 'Info')
      return;
    }
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
      var prodTrnfrId = event.node.data.prodTrnfrId;
      ////debugger;
      this.ProducttransferService.GetProductTransferById(prodTrnfrId, this.master.transferType).subscribe(
        (data: any) => {
          if (data.success) {
            this.master = data.data[0];
            this.master.prodTrnDate = new Date(this.master.prodTrnDate);
            // this.master.tosbuName = data.data[0].tosbuName;
            // this.master.tosbuId = data.data[0].tosbuId;

            this.master.fromsbusSelected = {
              id: this.master.fromsbuId,
              name: this.master.fromSbuName,
            };

            //  this.GetAllProductReqNumberBySbuId(this.master.fromsbuId);

            this.master.productReqNoSelected = {
              id: this.master.prodReqId,
              name: this.master.prodReqNo,
            };

            this.ProducttransferService.GetProductTransferDetailsByMasterId(
              prodTrnfrId
            ).subscribe((data: any) => {
              if (data.success) {
                this.master.lstDetailsViewModel = data.data;
                this.master.fromStoreSlected = {
                  id: data.data[0].fromStoreId,
                  name: data.data[0].storeName,
                };


                this.master.lstDetailsViewModel.forEach(el => {
                  //el.currentStock = 0;
                  const index = el.BatchList.map(x => x.batchNo).indexOf(`${el.batchNo}`);

                  if (el.BatchList.length > 0 && index >= 0) {
                    el.BatchSelected = { id: el.BatchList[index].id, name: el.BatchList[index].name, currentStock: el.BatchList[index].currentStock };
                    el.currentStock = el.BatchList[0].currentStock;
                    //el.batchNo = el.BatchList[0].batchNo;
                  }
                });
              }

              // this.getStore(this.master.fromsbuId);
            });

            this.master.transferType = 'F2D';
            //console.log(this.master);
          }
        }
      );
      this.ngOnInit();
    }
  }

  private agReport(event) {
    //this.toastrService.info("Print button clicked", "Message");
    // this.getReportData(event.data.prodTrnfrId);
    this.generateCrReport("Pdf", event.data.prodTrnfrId);
  }



  apiUrl: any = ""
  generateCrReport(reportFormat: any, stockTransferId: any) {
    // //debugger;

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();


    //console.log("userInfo[0].employeeid", userInfo[0].employeeid);
    let reportHeaderName = "CWH Stock Transfer to Depot"//"Issue to Depot (CSD)"
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



  private agDelete(event) {
    if (confirm('Are sure to delete?')) {
      let prodTrnfrId = event.node.data.prodTrnfrId;
      let receiveStatus = event.node.data.receiveStatus;
      if (receiveStatus == "Received") {
        this.toastrService.warning('You Can not delete this, because it`s already Received.', "Message");
        return;
      }
      this.ProducttransferService.DeleteProductTransferById(
        prodTrnfrId
      ).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.GetGridData();
          //////////////Grid Refresh ///////////////////
        }
      });
    }
  }

  public sbus = [];
  public fromsbus = [];
  public tosbus = [];
  public getSBU(companyId) {
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      //debugger;
      this.fromsbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }
  public getSbuWhithoutSelf(companyId) {
    this.comboService.getSbuWhithoutSelf(companyId).subscribe((returns: any) => {
      this.tosbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
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
          //debugger;
          this.master.fromStoreSlected = { id: this.StoreList[0].id, name: this.StoreList[0].name };
          this.master.storeId = this.StoreList[0].id;
        }
      });
  }

  public getProductTransferNo() {
    if (this.master.prodTrnDate == null) {
      this.master.prodTrnDate = new Date("dd-MM-yyyy");
    }

    this.ProducttransferService.GetMaxProductTransferNumber(
      this.commonService.DateFormat(this.master.prodTrnDate), this.master.transferType
      //this.master.prodTrnDate.toDateString().substring(4, 15)
    ).subscribe((returns: any) => {
      ////debugger;
      if (returns.success) {
        this.master.prodTrnNo = returns.data[0].MaxNo;
        //console.log(returns.data[0].MaxNo);
      }
    });
  }

  public getProductById(id) {
    this.productService.getProductById(id).subscribe((data: any) => {
      if (data.success) {
        this.master.uomName = this.master.productSelected["uomName"];
      }
    });
  }

  public prodReqList = [];
  public GetAllProductReqNumberBySbuId(sbuId) {
    this.master.productReqNoSelected = null;
    this.ProducttransferService.GetAllProductReqNumberBySbuId(sbuId).subscribe(
      (returns: any) => {

        //this.master.fromStoreSlected = null;
        this.master.lstDetailsViewModel = [];

        this.prodReqList = returns.data.map((val: any) => ({
          id: val.prodReqId,
          name: val.prodReqNo,
          // sbuName:val.sbuName,
          // fromsbuId:val.fromWarehouseId
        }));
        //this.prodReqList.push({ id: 1417, name: 'PDR-230327-005; Sylhet; Date: 27-Mar-2023' })
      }
    );
  }
  public changeStore(fromStoreId) {
    //debugger;
    this.master.lstDetailsViewModel = [];
    this.master.storeId = fromStoreId;

    // console.log(fromStoreId);
    //this.master.productReqId = 1383;

    if (this.master.prodTrnfrId == 0)
      this.getProdReqDetails(this.master.productReqId, this.master.storeId);
  }

  public changeProdReq(productReqId) {
    //debugger;
    //this.master.prodTrnfrId = productReqId;
    // this.master.tosbuName=this.master.fromsbusSelected["fromsbuId"];
    // this.master.tosbuName=this.master.fromsbusSelected["sbuName"];
    if (this.master.prodTrnfrId == 0) {
      this.master.productReqId = productReqId;
      this.getProdReqDetails(this.master.productReqId, this.master.storeId);
    }
  }

  public getProdReqDetails(prodReqId, storeId) {
    this.ProducttransferService.GetProductReqDetailsForProdTrnsfrById(
      prodReqId,
      storeId
    ).subscribe((returns: any) => {
      if (returns.success) {
        this.master.lstDetailsViewModel = returns.data;

        this.master.tosbuName = returns.data[0].fromsbuName;
        this.master.tosbuId = returns.data[0].fromsbuId;


        this.master.lstDetailsViewModel.forEach(el => {
          el.currentStock = 0;
          if (el.BatchList.length > 0) {
            el.BatchSelected = { id: el.BatchList[0].id, name: el.BatchList[0].name, currentStock: el.BatchList[0].currentStock };
            el.currentStock = el.BatchList[0].currentStock;
            el.batchNo = el.BatchList[0].batchNo;
          }
        });

      } else this.master.lstDetailsViewModel = [];
    });
  }

  //BatchSlected: any = {};
  getBatchStock(i: number, id: any) {
    this.master.lstDetailsViewModel[i].currentStock = 0;
    this.master.lstDetailsViewModel[i].currentStock = this.master.lstDetailsViewModel[i].BatchSelected["currentStock"];
    this.master.lstDetailsViewModel[i].batchNo = this.master.lstDetailsViewModel[i].BatchSelected["batchNo"];

    console.log('BatchSelected= ', this.master.lstDetailsViewModel[i].BatchSelected);
  }

  public validateTransferQty(index: any) {
    var reqQty = this.master.lstDetailsViewModel[index].reqQty;
    var currentStock = this.master.lstDetailsViewModel[index].currentStock ?? 0;
    var transferQty =
      this.master.lstDetailsViewModel[index].transferQty == null
        ? 0
        : this.master.lstDetailsViewModel[index].transferQty;

    if (transferQty == null || transferQty == 0) {
      this.master.lstDetailsViewModel[index].transferQty = transferQty; //reqQty;
      this.master.lstDetailsViewModel[index].isSelect = 0;
      //transferQty = 0;
    }
    //             4 > 3                     4 > 5
    if (transferQty > currentStock || transferQty > reqQty) {
      if (currentStock == 0)
        this.master.lstDetailsViewModel[index].transferQty = currentStock;
      else this.master.lstDetailsViewModel[index].transferQty = reqQty;

      this.master.lstDetailsViewModel[index].isSelect = 0;
    }
  }

  public refesh() {
    this.master.lstDetailsViewModel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
  }




  datalength: number;
  headerData = [];
  bodyData = [];
  params = [];

  public getReportData(masterId) {

    forkJoin([
      this.ProducttransferService.GetProductTransferById(masterId, this.master.transferType),
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
            leftLabel: "Req. No.",
            leftValue: `: ${this.headerData[0].prodReqNo}`,
            rightLabel: "To Depot",
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
    ////debugger;
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

          alternateRowStyles: {
            //fillColor: [250, 250, 250],
          },
          columnStyles: {
            5: { halign: "right" },
            //5: { halign: "right" },
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



  //////////////////////////////////End of Ag Grid Data Load/////////////////////////////////

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

  data_BAK: Country[] = [
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



  //#region upload


  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'UploadFile.xlsx';
  BatchWiseStock: any = [];
  onFileChange(evt: any) {
    //debugger;

    this.master.lstDetailsViewModel = [];

    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);

    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

      console.log("ExcleData:", this.data);
      this.data.splice(0, 1);
      //console.log('Delete column text', this.data);

      const excelData = [];

      this.data.forEach(e => {
        //debugger;
        /*
          productTrnfrDetailsId
          prodTrnfrId
          productReqDetailsId
          fromStoreId
          productId
          productWiseSpecificationId
          price
          isActive
          isSelect
          transferQty
          batchNo
        */
        let obj = {
          productCode: e[1],
          productName: '',//e[2],
          packSize: '', //e[3],
          //batchNo: e[3],
          batchNo: '',
          mfgDate: '', //e[5],
          expDate: '', //e[6],
          currentStock: 0, //e[7],
          reqQty: e[4],
          transferQty: e[4],
          //isActive: 1,
          status: '',

          productTrnfrDetailsId: null,
          prodTrnfrId: null,
          productReqDetailsId: null,
          fromStoreId: null,
          productId: null,
          productWiseSpecificationId: null,
          price: 0,
          isActive: 0,
          isSelect: 0,
        }

        excelData.push(obj);

        this.master.lstDetailsViewModel.push(obj);
      });



      //this.master.lstDetailsViewModel = excelData;


      this.data.map(res => {
        if (res[0] === "no") {
          console.log("no", res[0]);
        } else {
          console.log(res[0]);
        }
      })

    };

    reader.readAsBinaryString(target.files[0]);
  }


  public deleteDetails(index: any) {
    //debugger;
    if (confirm("Are you sure to delete?")) {
      //this.commonService.valueSet("create");
      this.selectedRow = this.master.lstDetailsViewModel[index];
      this.master.lstDetailsViewModel.splice(index, 1);
      if (this.selectedRow.helpDetailId > 0) {
      }
      this.toastrService.danger(this.commonService.deletedmsg, "Message");
    }
  }


  ttlItemCount = 0;
  verifyStatus = "Not verified";
  public VerifyData() {
    //debugger;
    if (this.master.lstDetailsViewModel.length == 0) {
      this.toastrService.warning("No data found for verification!", "Message");
      return false;
    }

    this.BatchWiseStock = [];
    let companyId = this.commonService.getCurrentCompany();
    this.stockinService.GetAllStockWithoutBatch((companyId ?? 1), this.master.storeId).subscribe((res: any) => {
      if (res.success) {
        console.log('data: ', res.data);
        this.BatchWiseStock = res.data;

        this.master.lstDetailsViewModel.forEach(el => {

          let result = this.BatchWiseStock.filter((obj) => {
            return obj.productCode.trim() == el.productCode.trim(); //&& obj.batchNo.trim() == el.batchNo.trim();
          });
          console.log('BatchWiseStock Match: ', result);

          if (result != null && result.length > 0) {

            let status = el.transferQty > result[0].CurrentStock ? 'Stock Qty. Exceeded' : 'OK';
            //debugger;
            if (el.transferQty > el.reqQty) status = 'Req. Qty. Exceeded';

            el.productCode = result[0].productCode;
            el.productName = result[0].productName;
            el.packSize = result[0].packSize;

            //el.batchNo = result[0].batchNo;
            //el.mfgDate = result[0].mgfDate;
            //el.expDate = result[0].expireDate;

            el.currentStock = result[0].CurrentStock;
            //el.transferQty = (status == 'OK' ? el.transferQty : 0); //el.transferQty > result[0].CurrentStock ? 0 : el.transferQty;
            el.status = status; //el.reqQty > result[0].CurrentStock ? 'NOT OK' : 'OK';

            el.productTrnfrDetailsId = 0; //result[0].expireDate;
            el.prodTrnfrId = 0; //result[0].expireDate;
            el.productReqDetailsId = 0; //result[0].expireDate;
            el.fromStoreId = result[0].storeId;
            el.productId = result[0].productId;
            el.productWiseSpecificationId = result[0].productWiseSpecificationId;
            el.price = result[0].price;
            el.isActive = 1;
            el.isSelect = 1;
          }
          else {
            el.currentStock = 0;
            el.transferQty = 0;
            el.status = 'NOT OK';
          }

          console.log('row: ', el);
        });

        //debugger;
        this.ttlItemCount = this.master.lstDetailsViewModel.length;
        let ttlOkStatus = this.master.lstDetailsViewModel.filter((el: any) =>
          el.status == "OK").length;

        let vQtyStatus = this.master.lstDetailsViewModel.filter((el: any) =>
          el.transferQty <= 0).length;

        if (vQtyStatus > 0) this.toastrService.warning("Transfer Qty. must be larger than 0 (zero).", "Warning");

        this.verifyStatus = ((this.ttlItemCount == ttlOkStatus) && (vQtyStatus == 0)) ? "Successed" : "Failed";
        console.log('Final Verify Data: ', this.master.lstDetailsViewModel);

      }
    });
  }

  //#endregion





}
