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
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { ProductService } from "app/services/inventory/product.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { StockinService } from "app/services/inventory/stockin.service";

import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { forkJoin } from "rxjs";
import { PromoRequisitionService } from "../settings/promo-requisition.service";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-depot-promo-distribution',
  templateUrl: './depot-promo-distribution.component.html',
  styleUrls: ['./depot-promo-distribution.component.scss']
})
export class DepotPromoDistributionComponent implements OnInit {
  serverDate: any[];
  isSelectAll: boolean = false;
  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private ProducttransferService: ProducttransferService,
    private productService: ProductService,
    private comboService: CommoncomboService,
    protected dateService: NbDateService<Date>,
    private stockinService: StockinService,
    private PromoRequisition: PromoRequisitionService
  ) {
    this.commonService.valueSet("showlist");
    debugger;
    this.getServerDateTime();

    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 70,
      },
      {
        headerName: "Promo Distribution No.",
        field: "promoDistributionNo",
        width: 200,
      },
      {
        headerName: "Distribution Date",
        field: "promoDistributionDate",
        width: 180,
      },
      {
        headerName: "Purpose",
        field: "Purpose",
        width: 180,
      }, {
        headerName: "Promo Receive No./Ref.",
        field: "promoReceivedNo",
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
    this.getMaster();
    this.getSBU(0);
    this.getAllSbu(0);
    this.getPacketTransferNo();

  }

  minDate: Date = new Date();
  maxDate: Date = new Date();
  currentDate: Date = new Date();
  getServerDateTime() {
    let apiUrl = `menu/getServerDateTime`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
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
    debugger;
    this.PromoRequisition.GetPromoDistributionById(0).subscribe(
      (data: any) => {
        if (data.success) {
          this.rowData = data.data;
        }
      }
    );
  }

  master: {
    promoDistributionNo: string;
    prodTrnfrId: number;
    prodTrnNo: string;
    productReqId: number;
    prodReqNo: string;
    promoDistributionDate: Date;

    fromWarehouseId: string;
    toWarehouseId: string;
    fromSbuId: number;
    toSbuId: number;

    Purpose: string;
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
    packetDistributionId: number;
    reqQty: number;
    productReqNoSelected: {};
    productTransferNoSelected: {};
    productSelected: [];
    fromStoreSlected: {};
    storeId: number;

    fromsbusSelected: {};
    tosbusSelected: {};
    toStorselected: {};
    storeSelected: [];
    companyId: number;
    lstDetailsViewModel: any[];
    promoDistributionMasterId: number;
    promoTrnfId: number;
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
  public pageNavigation = "Depot To Territory Promo Packet Distribution";
  public rptHeader = "Issue to Depot (CSD)";
  public tableHeader = ["#", "Product Name", "Pack Size", "Batch No.", "UOM", "Qty"];

  public buttons = this.commonService.btnList;

  SbuAutoSelect() {
    if (this.fromsbus.length > 0) {
      this.master.fromsbusSelected = {
        id: this.fromsbus[0].id,
        name: this.fromsbus[0].name,
      }
      this.master.fromSbuId = this.fromsbus[0].id;
      this.getStore(this.fromsbus[0].id);
      this.getDistribution(this.fromsbus[0].id);
      this.GetAllProductReqNumberBySbuId(this.fromsbus[0].id);
    }
  }
  public getAllSbu(companyId) {
    this.comboService.getSBUALL(companyId).subscribe((returns: any) => {
      this.tosbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }
  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
      this.SbuAutoSelect();
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
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
      promoDistributionNo: "",
      prodTrnfrId: 0,
      prodTrnNo: "",
      productReqId: 0,
      promoDistributionDate: new Date(),
      fromWarehouseId: "",
      toWarehouseId: "",
      Purpose: "",
      isUrgency: 0,
      approvalStatus: 0,
      productWiseSpecificationId: 0,
      PurchaseReqDetailsId: 0,
      productTransferNoSelected: {},
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
      packetDistributionId: 0,
      fromSbuId: 0,
      toSbuId: 0,
      lstDetailsViewModel: null,

      storeSelected: null,
      companyId: 0,
      promoDistributionMasterId: 0,
      promoTrnfId: 0
    };
    this.getPacketTransferNo();
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
    }
  }

  private save() {
    debugger
    var button = this.commonService.buttonClicked;
    this.master.lstDetailsViewModel = this.master.lstDetailsViewModel.filter(x => x.isSelect == true).map(detail => ({
      distributionDetailsId: detail.distributionDetailsId,
      territoryCode: detail.territoryCode,
      transferQuantity: detail.transferQuantity
    }));
    this.master.lstDetailsViewModel.forEach(element => {
      if (element.territoryCode.trim() == "")
        this.toastrService.danger(`Territory Code not found. Without Territory Code you can not Transfer`, 'Warning');
      return false;
    });

    if (this.master.fromsbusSelected == null || this.master.fromSbuId == 0) {
      this.toastrService.danger("Please select from sbu.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (
      this.master.lstDetailsViewModel.length == 0 ||
      this.master.lstDetailsViewModel == null
    ) {
      this.toastrService.danger("Please add data.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.promoDistributionMasterId != 0) {
      debugger;
      this.master.promoTrnfId = this.master.promoDistributionMasterId;
    }
    this.show = true;
    this.master.promoDistributionDate = this.commonService.DateFormat(this.master.promoDistributionDate);
    debugger;
    console.log(this.master);
    let id = this.master.fromSbuId;
    this.PromoRequisition.SaveDepotPromoDistribution(this.master).subscribe(
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
          this.getMaster();
          this.PromoRequisition.GetPromoDistributionById(0).subscribe(
            (data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            }
          );
        }
      }
    );
  }

  private reset() {
    this.getMaster();
  }

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
  private selectedRows = [];
  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    this.commonService.agButtonClicked = "";
    if (data == "edit") {
      this.toastrService.info("Access denied!", "Message");
      this.commonService.valueSet("craete");
      return false;
      // let receiveStatus = event.node.data.receiveStatus;
      // if (receiveStatus && receiveStatus == "Received") {
      //   this.toastrService.info("Already Received! You can not Edit!", 'Info')
      //   return;
      // }
      // this.agEdit(event);
      // this.show = false;
    } else if (data == "view") {
      this.agEdit(event);
      this.show = false;
      this.disabled = true;
    } else if (data == "transectionreport") {
      //this.toastrService.info("Access denied!", "Message");
      this.generateCrReport('pdf', event.node.data.promoDistributionMasterId);
      this.commonService.valueSet("craete");
      return false;
      //this.agReport(event);
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
      this.selectedRow = event.node.data;
      var prodTrnfrId = event.node.data.promoDistributionMasterId;
      this.PromoRequisition.GetDepotPromoDistributionDetailsByMasterId(
        prodTrnfrId
      ).subscribe((data: any) => {
        if (data.success) {
          debugger;
          this.master = data.data[0];
          this.master.promoTrnfId = data.data[0].depotPromoReceiveMasterId;
          this.master.lstDetailsViewModel = data.data;
          this.master.fromsbusSelected = {
            id: data.data[0].fromSbuId,
            name: data.data[0].sbuFromName,
          };
          this.master.productTransferNoSelected = {
            id: data.data[0].depotPromoReceiveId,
            name: data.data[0].promoReceivedNo,
          };
        }
      }
      );
      this.ngOnInit();
    }
  }
  private agReport(event) {
    this.generateCrReport("Pdf", event.node.data.promoDistributionMasterId);
  }

  apiUrl: any = ""
  generateCrReport(reportFormat: any, depotPromoReceiveMasterId: any) {
    debugger
    this.apiUrl = "";
    debugger;
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `PromoReport/DepotToTerritoryReport?promoDistributionMasterId=${depotPromoReceiveMasterId}&userId=${userInfo[0].employeeid}&reportFormat=${reportFormat}`;

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
      let promoTrnfrId = event.node.data.promoDistributionMasterId;
      debugger;
      this.PromoRequisition.DeleteDepotPromoDistributionById(
        promoTrnfrId
      ).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");
          this.PromoRequisition.GetPromoDistributionById(0).subscribe(
            (data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            }
          );
        }
      });
    }
  }

  public sbus = [];
  public fromsbus = [];
  public tosbus = [];
  public getSBU(companyId) {
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      debugger;
      this.fromsbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }

  public StoreList = [];
  public getStore(fromSbuId: number) {
    debugger;
    this.stockinService
      .getStore(fromSbuId, this.master.companyId)
      .subscribe((returns: any) => {
        this.StoreList = returns.data.map((val) => ({
          id: val.storeId,
          name: val.storeName,
        }));

        if (returns.data.length > 0) {
          debugger;
          this.master.fromStoreSlected = { id: this.StoreList[0].id, name: this.StoreList[0].name };
          this.master.storeId = this.StoreList[0].id;
        }
      });
  }

  public DistributionList = [];
  public getDistribution(fromSbuId: number) {
    debugger;
    this.PromoRequisition
      .getReceived(fromSbuId)
      .subscribe((returns: any) => {
        debugger;
        this.DistributionList = returns.data.map((val) => ({
          id: val.depotPromoReceiveId,
          name: val.promoReceivedNo,
        }));
      });
  }

  public getPacketTransferNo() {
    debugger;
    this.master.promoDistributionNo = null;
    if (this.master.promoDistributionDate == null) {
      this.master.promoDistributionDate = new Date("dd-MM-yyyy");
    }
    this.PromoRequisition.GetMaxDistributeTransferNumber(
      this.commonService.DateFormat(this.master.promoDistributionDate)
    ).subscribe((returns: any) => {
      debugger;
      if (returns.success) {
        this.master.promoDistributionNo = returns.data[0].MaxNo;
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
        this.master.lstDetailsViewModel = [];
        this.prodReqList = returns.data.map((val: any) => ({
          id: val.prodReqId,
          name: val.prodReqNo,
        }));
      }
    );
  }
  public GetAllPacketByDistribution(event: any) {
    this.master.lstDetailsViewModel = [];
    const selectedDistributionId = event;
    this.master.packetDistributionId = selectedDistributionId;
    debugger;
    this.PromoRequisition.GetAllPacketByReceived(selectedDistributionId).subscribe((returns: any) => {
      if (returns.success) {
        debugger;
        console.log(returns.data);
        this.master.lstDetailsViewModel = returns.data;
      }
    });
  }
  public changeStore(fromStoreId) {
    debugger;
    this.master.lstDetailsViewModel = [];
    this.master.storeId = fromStoreId;
    if (this.master.prodTrnfrId == 0)
      this.getProdReqDetails(this.master.productReqId, this.master.storeId);
  }

  public changeProdReq(productReqId) {
    debugger;
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
        debugger;
        this.master.lstDetailsViewModel = returns.data;
        this.master.tosbuName = returns.data[0].fromsbuName;
        this.master.toSbuId = returns.data[0].fromSbuId;
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
  getBatchStock(i: number, id: any) {
    this.master.lstDetailsViewModel[i].currentStock = 0;
    this.master.lstDetailsViewModel[i].currentStock = this.master.lstDetailsViewModel[i].BatchSelected["currentStock"];
    this.master.lstDetailsViewModel[i].batchNo = this.master.lstDetailsViewModel[i].BatchSelected["batchNo"];

    console.log('BatchSelected= ', this.master.lstDetailsViewModel[i].BatchSelected);
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
            rightValue: `: ${this.headerData[0].packetDistributionDate}`,
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

    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table_top",
          startY: legend.height + 30,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
          bodyStyles: {
            textColor: 50,
          },
          alternateRowStyles: {
          },
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 80,
          styles: { font: "Meta" },
          tableLineColor: [0, 0, 0],

          bodyStyles: {
            textColor: 50,
          },
          alternateRowStyles: {
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
            textColor: 50,
          },

          alternateRowStyles: {
          },
          columnStyles: {
            5: { halign: "right" },
          },
        });

        addFooters(doc);
        if (buttonAction == "pdf") {
          doc.save(fileName);
        } else {
          window.open(URL.createObjectURL(doc.output("blob")), "_blank");
          doc.close();
        }
      },
    });
  }

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
  checkChange(e: any) {
    let isChecked: boolean = false;
    isChecked = e.target.checked;

    this.master.lstDetailsViewModel.forEach(element => {
      element.isSelect = isChecked;
    });
  }
}
