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
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
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
  selector: 'ngx-packet-distribution',
  templateUrl: './packet-distribution.component.html',
  styleUrls: ['./packet-distribution.component.scss']
})
export class PacketDistributionComponent implements OnInit {


  serverDate: any[];
  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private ProducttransferService: ProducttransferService,
    private productrequisitionService: ProductrequisitionService,
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
        headerName: "Packet Distribution No.",
        field: "packetDistributionNo",
        width: 200,
      },
      {
        headerName: "Transfer Date",
        field: "packetDistributionDate",
        width: 180,
      },
      {
        headerName: "Purpose",
        field: "Purpose",
        width: 180,
      },
      {
        headerName: "Packet No./Ref",
        field: "packetingMasterNo",
        width: 180,
      },
      {
        headerName: "To Depot",
        field: "toSbu",
        width: 180,
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
    this.PromoRequisition.GetPromoTransferById(0).subscribe(
      (data: any) => {
        if (data.success) {
          this.rowData = data.data;
        }
      }
    );
  }

  master: {
    packetDistributionNo: string;
    prodTrnfrId: number;
    prodTrnNo: string;
    productReqId: number;
    prodReqNo: string;
    packetDistributionDate: Date;

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
    promoPacketDistributionMasterId: number;
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

  public pageNavigation = "Packet Distribution To Depot";
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
      this.master.fromSbuId = this.fromsbus[0].id;
      this.getStore(this.fromsbus[0].id);
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
      packetDistributionNo: "",
      prodTrnfrId: 0,
      prodTrnNo: "",
      productReqId: 0,
      packetDistributionDate: new Date(),
      fromWarehouseId: "",
      toWarehouseId: "",
      Purpose: "",
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

      fromSbuId: 0,
      toSbuId: 0,
      lstDetailsViewModel: null,

      storeSelected: null,
      companyId: 0,
      promoPacketDistributionMasterId: 0,
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
    var button = this.commonService.buttonClicked;
    debugger;
    this.master.lstDetailsViewModel = this.master.lstDetailsViewModel.map(detail => ({
      packetDistributionDetailsId: detail.packetDistributionDetailsId,
      territoryCode: detail.territoryCode,
      transferQuantity: detail.totalPacket,
      packetingMasterId: detail.packetingMasterId
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
    if (this.master.tosbusSelected == null) {
      this.toastrService.danger("Please select To sbu.", "Message");
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
    if (this.master.promoPacketDistributionMasterId != 0) {
      this.master.promoTrnfId = this.master.promoPacketDistributionMasterId;
    }
    this.show = true;
    this.master.packetDistributionDate = this.commonService.DateFormat(this.master.packetDistributionDate);
    debugger;
    let id = this.master.fromSbuId;
    this.PromoRequisition.SavePromoTransfer(this.master).subscribe(
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
          this.PromoRequisition.GetPromoTransferById(0).subscribe(
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
      this.toastrService.info("Access denied!", "Message");
      this.commonService.valueSet("craete");
      return false;
      // this.agEdit(event);
      // this.show = false;
      // this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      this.agDelete(event);
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
      this.selectedRow = event.node.data;
      var prodTrnfrId = event.node.data.packetDistributionId;
      this.PromoRequisition.GetPromoTransferDetailsByMasterId(
        prodTrnfrId
      ).subscribe((data: any) => {
        if (data.success) {
          debugger;
          console.log(data);
          this.master = data.data[0];
          this.master.lstDetailsViewModel = data.data;
          this.master.fromStoreSlected = {
            id: data.data[0].storeId,
            name: data.data[0].storeName,
          };
          this.master.fromsbusSelected = {
            id: data.data[0].fromSbuId,
            name: data.data[0].sbuFromName,
          };
          this.master.tosbusSelected = {
            id: data.data[0].toSbuId,
            name: data.data[0].toSbuName,
          };
          // this.master.lstDetailsViewModel.forEach(el => {
          //   const index = el.BatchList.map(x => x.batchNo).indexOf(`${el.batchNo}`);
          //   if (el.BatchList.length > 0 && index >= 0) {
          //     el.BatchSelected = { id: el.BatchList[index].id, name: el.BatchList[index].name, currentStock: el.BatchList[index].currentStock };
          //     el.currentStock = el.BatchList[0].currentStock;
          //   }
          // });
        }
      }
      );
      this.ngOnInit();
    }
  }
  private agReport(event) {
    this.generateCrReport("Pdf", event.node.data.packetDistributionId);
  }



  apiUrl: any = ""
  generateCrReport(reportFormat: any, prodTrnfrId: any) {
    this.apiUrl = "";
    debugger;
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `PromoReport/PacketDistributionToDepotReport?packetingMasterId=${prodTrnfrId}&userId=${userInfo[0].employeeid}&reportFormat=${reportFormat}`;

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
      let promoTrnfrId = event.node.data.packetDistributionId;;
      this.PromoRequisition.DeletePromoTransferById(
        promoTrnfrId
      ).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");
          this.PromoRequisition.GetPromoTransferById(0).subscribe(
            (data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            }
          );
        }
        else {
          this.toastrService.warning("This packet has already received by depot! you can not delete this.", "Message")
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

  public getPacketTransferNo() {
    debugger;
    this.master.packetDistributionNo = null;
    if (this.master.packetDistributionDate == null) {
      this.master.packetDistributionDate = new Date("dd-MM-yyyy");
    }
    this.PromoRequisition.GetMaxPacketTransferNumber(
      this.commonService.DateFormat(this.master.packetDistributionDate)
    ).subscribe((returns: any) => {
      debugger;
      if (returns.success) {
        this.master.packetDistributionNo = returns.data[0].MaxNo;
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
  public GetAllPacketBySbuId(event: any) {
    this.master.lstDetailsViewModel = [];
    const selectedSbuId = event;
    debugger;
    this.PromoRequisition.GetAllPacketBySbuId(selectedSbuId).subscribe((returns: any) => {
      if (returns.success) {
        debugger;
        this.master.lstDetailsViewModel = returns.data;
      }
    });
  }
  public changeStore(fromStoreId) {
    debugger;
    this.master.lstDetailsViewModel = [];
    this.master.storeId = fromStoreId;

    // console.log(fromStoreId);
    //this.master.productReqId = 1383;

    if (this.master.prodTrnfrId == 0)
      this.getProdReqDetails(this.master.productReqId, this.master.storeId);
  }

  public changeProdReq(productReqId) {
    debugger;
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
  //BatchSlected: any = {};
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
}
