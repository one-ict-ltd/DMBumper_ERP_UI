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

@Component({
  selector: 'ngx-promo-bulk-packeting',
  templateUrl: './promo-bulk-packeting.component.html',
  styleUrls: ['./promo-bulk-packeting.component.scss']
})
export class PromoBulkPacketingComponent implements OnInit {

  serverDate: any[];
  isShowTerritory: boolean = false;
  isShowArea: boolean = false;
  isShowRegion: boolean = false;
  promoRequisitionId: number;
  spinner: boolean = false;
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
        headerName: "Promo Packeting No.",
        field: "packetingMasterNo",
        width: 200,
      },
      {
        headerName: "Packeting Date",
        field: "packetingMasterDate",
        width: 180,
      },
      {
        headerName: "Territoty",
        field: "territoryName",
        width: 180,
      },
      {
        headerName: "Item Type(s)",
        field: "itemType",
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
    this.PromoRequisition.GetPromoPacketById(0).subscribe(
      (data: any) => {
        if (data.success) {
          this.rowData = data.data;
        }
      }
    );
  }

  master: {
    packetingMasterNo: string;
    promoRequisitionId: number;
    prodTrnNo: string;
    productReqId: number;
    prodReqNo: string;
    packetingMasterDate: Date;
    packetingFor: string;

    fromWarehouseId: string;
    toWarehouseId: string;
    fromSbuId: number;
    toSbuId: number;

    remarks: string;
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
    packetingMasterId: number;
    territoryCode: string;
    productSubCategoryId: number;
    productReqNoSelected: {};
    productTransferNoSelected: {};
    productSelected: [];
    fromStoreSlected: {};
    territorySelected: {};
    productSubCategorySelected: {};
    storeId: number;
    packetNo: string;
    packetNames: string;
    totalPacket: number;
    fromsbusSelected: {};
    tosbusSelected: {};
    toStorselected: {};
    storeSelected: [];
    companyId: number;
    lstDetailsViewModel: any[];
    lstDetailsViewModelTemp: any[];
    lstDetailsViewModelForModal: any[];
    lstPacketDetailsViewModel: any[];
    lstDetailsViewModelForStoreData: any[];
    allPacketListModel: any[];
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
  public pageNavigation = "Promo Bulk Packeting";
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
      //this.getDistribution(this.fromsbus[0].id);
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
    debugger
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
    debugger
    this.master = {
      packetingMasterNo: "",
      promoRequisitionId: 0,
      prodTrnNo: "",
      productReqId: 0,
      packetingMasterDate: new Date(),
      packetingFor: "T",
      fromWarehouseId: "",
      toWarehouseId: "",
      remarks: "",
      isUrgency: 0,
      approvalStatus: 0,
      productWiseSpecificationId: 0,
      PurchaseReqDetailsId: 0,
      packetingMasterId: 0,
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
      packetNo: "",
      territoryCode: "",
      productSubCategoryId: 0,
      productReqNoSelected: null,
      productTransferNoSelected: null,
      productSelected: null,
      fromStoreSlected: null,
      storeId: 0,
      packetNames: "",
      totalPacket: 0,
      toStorselected: null,
      fromsbusSelected: null,
      tosbusSelected: null,
      territorySelected: null,
      productSubCategorySelected: null,
      packetDistributionId: 0,
      fromSbuId: 0,
      toSbuId: 0,
      lstDetailsViewModel: null,
      lstDetailsViewModelTemp: [],
      lstDetailsViewModelForModal: [],
      lstDetailsViewModelForStoreData: [],
      lstPacketDetailsViewModel: null,
      allPacketListModel: [],
      storeSelected: null,
      companyId: 0,
      promoDistributionMasterId: 0,
      promoTrnfId: 0
    };
    this.getPacketingMasterNo();
    this.getRequisition();
  }
  public OpenModal(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      context: [], //this.data,
    });
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
    // var button = this.commonService.buttonClicked;
    // this.master.packetingFor = this.isShowArea ? 'A' : this.isShowTerritory ? 'T' : 'R';


    // if (this.getTotalPackcetNumber(this.master.lstDetailsViewModel) <= 0) {
    //   this.toastrService.danger("No quantity to be packed!", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }
    // else if (this.master.lstPacketDetailsViewModel == null || this.master.lstPacketDetailsViewModel == undefined || this.master.lstPacketDetailsViewModel.length == 0) {
    //   this.toastrService.danger("Please enter packet information!", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }
    // else if (this.master.promoRequisitionId == null || this.master.promoRequisitionId == undefined || this.master.promoRequisitionId == 0) {
    //   this.toastrService.danger("Please select requisition number!", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }


    // this.master.packetNames = this.master.lstPacketDetailsViewModel
    //   .map((element: any) => element.packetNo)
    //   .join(",");
    // this.master.totalPacket = this.getTotalPackcetNumber(this.master.lstDetailsViewModel);

    // if (
    //   this.master.lstDetailsViewModel.length == 0 ||
    //   this.master.lstDetailsViewModel == null
    // ) {
    //   this.toastrService.danger("Please add data.", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }
    // for (let i = 1; i < this.master.lstDetailsViewModel.length; i++) {
    //   if (this.master.lstDetailsViewModel[i].restQty < this.master.lstDetailsViewModel[i].transferQty) {
    //     this.toastrService.danger("Transfer quantity can not be more than rest quantity!", "Message");
    //     this.commonService.valueSet("create");
    //     return false;
    //   }
    //   else if (this.master.lstDetailsViewModel[i].transferQty < 0) {
    //     this.toastrService.danger("Transfer quantity can not be negative!", "Message");
    //     this.commonService.valueSet("create");
    //     return false;
    //   }
    // }
    // this.master.packetingMasterDate = this.commonService.DateFormat(this.master.packetingMasterDate);
    // this.PromoRequisition.SaveBulkPromoPacketing(this.master).subscribe(
    //   (returns: any) => {
    //     if (returns.success) {
    //       if (button == "update") {
    //         this.toastrService.success(
    //           this.commonService.updatedmsg,
    //           "Message"
    //         );

    //       } else {
    //         this.toastrService.success(
    //           this.commonService.successmsg,
    //           "Message"
    //         );
    //       }
    //       this.getMaster();
    //       this.PromoRequisition.GetPromoPacketById(0).subscribe(
    //         (data: any) => {
    //           if (data.success) {
    //             this.rowData = data.data;
    //           }
    //         }
    //       );
    //       this.commonService.valueSet("showlist");
    //       this.show = true;
    //     }
    //     else {
    //       this.toastrService.danger(returns.message, "Message");
    //       this.commonService.valueSet("create");
    //     }
    //   }
    // );
  }

  private reset() {
    this.getMaster();
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
      this.commonService.valueSet("create");
      return false;
    } else if (data == "view") {
      this.toastrService.info("Access denied!", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (data == "transectionreport") {
      this.agReport(event);
      this.commonService.valueSet("showlist");
      return false;
      //this.agReport(event);
    } else if (data == "delete") {
      this.toastrService.info("Delete Unavailable!", "Message");
      //this.agDelete(event);
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
      var packetingMasterId = event.node.data.packetingMasterId;
      forkJoin(
        this.PromoRequisition.GetPromoPacketDetailsByMasterId(packetingMasterId),
        this.PromoRequisition.GetPromoPacketNoDetailsByMasterId(packetingMasterId)
      ).subscribe(([detailsData, packetDetailsData]: any) => {
        if (detailsData.success) {
          debugger;
          this.master = detailsData.data[0];
          this.master.packetingMasterId = detailsData.data[0].packetingMasterId;
          this.master.lstDetailsViewModel = detailsData.data;

          this.master.territorySelected = {
            id: detailsData.data[0].TerritoryCode,
            name: detailsData.data[0].TerritoryName,
          };
          this.master.productTransferNoSelected = {
            id: detailsData.data[0].promoRequisitionId,
            name: detailsData.data[0].promoRequisitionNo,
          };
        }
        if (packetDetailsData.success) {
          this.master.lstPacketDetailsViewModel = packetDetailsData.data;
        }
        this.ngOnInit();
      });
    }
  }
  private agReport(event) {
    this.generateCrReport("Pdf", event.node.data.packetingMasterId);
  }

  apiUrl: any = ""
  generateCrReport(reportFormat: any, packetingMasterId: any) {
    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `PromoReport/PromoPacketingReport?packetingMasterId=${packetingMasterId}&userId=${userInfo[0].employeeid}&reportFormat=${reportFormat}`;

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
    debugger;
    if (confirm('Are sure to delete?')) {
      let promoTrnfrId = event.node.data.packetingMasterId;
      debugger;
      this.PromoRequisition.DeletePromoPacketById(
        promoTrnfrId
      ).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");
          this.PromoRequisition.GetPromoPacketById(0).subscribe(
            (data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            }
          );
        }
        else {
          this.toastrService.warning("This packet has already been distributed to depot! you can not delete this", "Message");
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

  getTotalPackcetNumber(master: any): number {
    debugger
    let k = 0;
    for (let i = 0; i < master.length; i++) {
      if (master[i].transferQty > 0) {
        k++;
      }
    }
    return k;
  }
  requisitionType: string = "";
  public RequisitionList = [];
  public getRequisition() {
    debugger;
    this.PromoRequisition
      .getRequisition()
      .subscribe((returns: any) => {
        this.RequisitionList = returns.data.map((val) => ({
          id: val.promoRequisitionId,
          name: val.promoRequisitionNo + '|' + val.programName,
          requisitionType: val.allocationType,
          allocationType: val.allocationType
        }));
        //this.requisitionType = returns.data.allocationType;
      });
  }

  public getPacketingMasterNo() {
    debugger;
    this.master.packetingMasterNo = null;
    if (this.master.packetingMasterDate == null) {
      this.master.packetingMasterDate = new Date("dd-MM-yyyy");
    }
    this.PromoRequisition.GetMaxPacketingMasterNo(
      this.commonService.DateFormat(this.master.packetingMasterDate)
    ).subscribe((returns: any) => {
      debugger;
      if (returns.success) {
        this.master.packetingMasterNo = returns.data[0].MaxNo;
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

  // public loadPacketDetails(territoryCode: any, requisitionId: any) {
  //   debugger
  //   let allocationType = this.isShowArea ? 'A' : this.isShowTerritory ? 'T' : 'R';
  //   this.master.lstDetailsViewModel = [];
  //   this.productSubCategoryList = [];
  //   this.PromoRequisition.GetProductReqDetails(
  //     territoryCode,
  //     requisitionId,
  //     allocationType
  //   ).subscribe((returns: any) => {
  //     if (returns.success) {
  //       debugger
  //       this.master.lstDetailsViewModelForStoreData = returns.data;
  //       this.getProductSubCategoryList();
  //       this.master.lstDetailsViewModelTemp = returns.data;
  //       this.getTotalOfTable();
  //     }
  //   });
  // }
  filterByProductSubCategory(productSubCategoryId: number) {
    let obj = [];
    obj = this.master.lstDetailsViewModelForStoreData.filter(x => x.productSubCategoryId === productSubCategoryId);
    if (obj.length == 0) {
      this.master.lstDetailsViewModel = [];
    }
    else {
      this.master.lstDetailsViewModelTemp = obj;
      this.getTotalOfTable();
    }


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

  public territoryList = [];
  public GetTerritoryByRequisition(requisitionId: any, allocationType: string) {
    if (allocationType == 'T') {
      this.areaManagerCodeList = [];
      this.rsmCodeList = [];
      this.master.territorySelected = null;
      const selectedRequisitionId = requisitionId;
      debugger;
      this.PromoRequisition.GetTerritoryByRequisition(selectedRequisitionId).subscribe((returns: any) => {
        if (returns.success) {
          this.territoryList = returns.data.map((val: any) => ({
            id: val.TerritoryCode,
            name: val.TerritoryName,
          }))
          this.isShowTerritory = this.territoryList.length > 0;
          this.isShowArea = false;
          this.isShowRegion = false;

        }
      });
    }

  }
  public areaManagerCodeList = [];
  public GetAreaManagerCodeByRequisition(requisitionId: any, allocationType: string) {
    if (allocationType == 'A') {
      this.rsmCodeList = [];
      this.territoryList = [];
      this.master.territorySelected = null;
      const selectedRequisitionId = requisitionId;
      debugger;
      this.PromoRequisition.GetAreaManagerCodeByRequisition(selectedRequisitionId).subscribe((returns: any) => {
        if (returns.success) {
          this.areaManagerCodeList = returns.data.map((val: any) => ({
            id: val.TerritoryCode,
            name: val.TerritoryName,
          }))
          this.isShowArea = this.areaManagerCodeList.length > 0;
          this.isShowTerritory = false;
          this.isShowRegion = false;
        }
      });
    }

  }

  public rsmCodeList = [];
  public GetRSMCodeByRequisition(requisitionId: any, allocationType: string) {
    if (allocationType == 'R') {
      this.areaManagerCodeList = [];
      this.territoryList = [];
      this.master.territorySelected = null;
      const selectedRequisitionId = requisitionId;
      debugger;
      this.PromoRequisition.GetRSMCodeByRequisition(selectedRequisitionId).subscribe((returns: any) => {
        if (returns.success) {
          this.rsmCodeList = returns.data.map((val: any) => ({
            id: val.TerritoryCode,
            name: val.TerritoryName,
          }))
          this.isShowRegion = this.rsmCodeList.length > 0;
          this.isShowArea = false;
          this.isShowTerritory = false;
        }
      });
    }

  }

  public productSubCategoryList: any = [];
  getProductSubCategoryList() {
    // this.productSubCategoryList = [];
    // this.PromoRequisition.GetProductSubCategoryByCategoryId(17).subscribe((returns: any) => {
    //   if (returns.success) {
    //     this.productSubCategoryList = returns.data;
    //   }
    //   else {
    //     this.toastrService.warning("Product Sub Category not found!", "Message");
    //   }
    // });

    const array = this.master.lstDetailsViewModelForStoreData;

    const key = 'productSubCategoryId';

    const arrayUniqueByKey = [...new Map(array.map(item =>
      [item[key], item])).values()];
    const object = arrayUniqueByKey;
    this.productSubCategoryList = arrayUniqueByKey.map(({ productSubCategoryId, subCategoryName }) =>
    ({
      id: productSubCategoryId,
      name: subCategoryName
    }));

  }
  public changeStore(fromStoreId) {
    this.master.lstDetailsViewModel = [];
    this.master.storeId = fromStoreId;
    if (this.master.promoRequisitionId == 0)
      this.getProdReqDetails(this.master.productReqId, this.master.storeId);
  }

  public changeProdReq(productReqId) {
    debugger;
    if (this.master.promoRequisitionId == 0) {
      this.master.productReqId = productReqId;
      this.getProdReqDetails(this.master.productReqId, this.master.storeId);
    }
  }
  public addToDetailsGrid() {
    debugger;
    if (this.master.packetNo === "") {
      this.toastrService.warning("Please enter packet  no.", "Message");
      return;
    }
    let elements = {
      packetNo: this.master.packetNo,
      PacketNoDetailId: 0
    };
    if (!this.master.lstPacketDetailsViewModel) {
      this.master.lstPacketDetailsViewModel = [];
    }
    this.master.lstPacketDetailsViewModel.splice(0, 0, elements);
    this.master.packetNo = "";
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
  resetPacketDetails() {
    debugger
    this.master.lstPacketDetailsViewModel = [];
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

  totalRequQty: number = 0;
  totalPackedQty: number = 0;
  totalRestQty: number = 0;
  totalNumberOfPacks: number = 0;
  ftotalRequQty: number = 0;
  ftotalPackedQty: number = 0;
  ftotalRestQty: number = 0;
  ftotalNumberOfPacks: number = 0;

  getTotalOfTable() {
    debugger;
    this.totalRequQty = 0;
    this.totalPackedQty = 0;
    this.totalRestQty = 0;
    this.totalNumberOfPacks = 0;
    for (let i = 0; i <= this.master.lstDetailsViewModelTemp.length; i++) {
      this.totalNumberOfPacks += Number(this.master.lstDetailsViewModelTemp[i].transferQty);
      this.totalRequQty += Number(this.master.lstDetailsViewModelTemp[i].quantity);
      this.totalPackedQty += Number(this.master.lstDetailsViewModelTemp[i].transferedQty);
      this.totalRestQty += Number(this.master.lstDetailsViewModelTemp[i].restQty);
    }

  }
  getTotalOfFinalTable() {
    debugger;
    this.ftotalRequQty = 0;
    this.ftotalPackedQty = 0;
    this.ftotalRestQty = 0;
    this.ftotalNumberOfPacks = 0;
    for (let i = 0; i <= this.master.lstDetailsViewModel.length; i++) {
      this.ftotalNumberOfPacks += Number(this.master.lstDetailsViewModel[i].transferQty);
      this.ftotalRequQty += Number(this.master.lstDetailsViewModel[i].quantity);
      this.ftotalPackedQty += Number(this.master.lstDetailsViewModel[i].transferedQty);
      this.ftotalRestQty += Number(this.master.lstDetailsViewModel[i].restQty);
    }

  }

  deleteTableRow(index: number): void {
    this.master.lstPacketDetailsViewModel.splice(index, 1);
  }
  hasDiplicateItems: boolean = false;
  addToFinalDetailsGrid() {
    debugger;
    this.hasDiplicateItems = false;
    let obj = this.master.lstDetailsViewModelTemp.filter(x => (x.transferQty ?? 0) > 0);

    obj.forEach(el => {
      if (!this.master.lstDetailsViewModel.some(item => item.productWiseSpecificationId === el.productWiseSpecificationId)) {
        this.master.lstDetailsViewModel.push(el);
      }
      else {
        this.hasDiplicateItems = true;
      }
    });
    if (this.hasDiplicateItems) {
      this.toastrService.warning("Item(s) already in Carton!", "Message");
      //this.master.lstDetailsViewModel = [];
    }
    this.getTotalOfFinalTable();
  }
  promoRequisionMasterId: number = null;
  GetPromoTerritotiesForBulkPacketing() {
    debugger
    this.totalRequQty = 0;
    this.apiUrl = '';
    this.promoRequisionMasterId = this.master.productTransferNoSelected == null || this.master.productTransferNoSelected == undefined ? 0 : this.master.productTransferNoSelected['id'];
    this.master.promoRequisitionId = this.promoRequisionMasterId;
    this.apiUrl = `Promo/GetPromoTerritotiesForBulkPacketing?promoRequisitionMasterId=${this.promoRequisionMasterId}`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.master.lstDetailsViewModelForModal = returns.data;
        this.master.lstDetailsViewModelForModal.forEach(element => {
          this.totalRequQty += element.quantity;
        });
      }
      else {
        console.log('Error faching data from API');
      }
    })
  }

  getAllPacketByRequisitionMasterId() {
    debugger
    this.spinner = true;
    this.master.allPacketListModel = [];
    let allocationType = this.master.productTransferNoSelected == null || this.master.productTransferNoSelected == undefined ? null : this.master.productTransferNoSelected['allocationType'];
    this.master.lstDetailsViewModel = [];
    this.productSubCategoryList = [];
    this.PromoRequisition.GetProductReqDetails(
      null,
      this.promoRequisionMasterId,
      allocationType
    ).subscribe((returns: any) => {
      if (returns.success) {
        this.spinner = false;
        this.master.allPacketListModel = returns.data;
      }
    });
  }
  currentTerritory: string = null;
  public viewPacketDetails(locationCode: any) {
    debugger
    this.currentTerritory = locationCode;
    this.master.lstDetailsViewModelTemp = this.master.allPacketListModel.filter(x => x.locationCode == locationCode);

    this.totalNumberOfPacks =this.master.lstDetailsViewModelTemp.reduce((sum, item) => sum + item.transferQty, 0);
    
  }
  finilizePackets() {
    debugger;
    this.spinner = true;
    this.master.packetingFor = this.master.productTransferNoSelected == null || this.master.productTransferNoSelected == undefined ? null : this.master.productTransferNoSelected['allocationType'];
    console.log(this.master);
    this.master.packetingMasterDate = this.commonService.DateFormat(this.master.packetingMasterDate);
    this.PromoRequisition.SaveBulkPromoPacketing(this.master).subscribe(
      (returns: any) => {
        if (returns.success) {
          this.toastrService.success('Successfully packeted', 'Message');
          this.getMaster();
          this.PromoRequisition.GetPromoPacketById(0).subscribe(
            (data: any) => {
              if (data.success) {
                this.spinner = true;
                this.rowData = data.data;
              }
            }
          );
          this.commonService.valueSet("showlist");
          this.show = true;
        }
        else {
          this.spinner = false;
          this.toastrService.danger(returns.message, "Message");
          this.commonService.valueSet("create");
        }
      }
    );

  }

  changedItemList = [];

  addToChangeList(listItems: any[]) {
    debugger
    listItems.forEach(listItem => {
      // Find the index of the item in allPacketListModel that matches locationCode and productWiseSpecificationId
      const index = this.master.allPacketListModel.findIndex(item =>
        item.locationCode === listItem.locationCode &&
        item.productWiseSpecificationId === listItem.productWiseSpecificationId
      );
      if (index !== -1) {
        this.master.allPacketListModel[index].transferQty = listItem.transferQty;
        //console.log('Item updated in allPacketListModel:', this.master.allPacketListModel[index]);
      } else {
        //console.log('No matching item found to update in allPacketListModel for:', listItem);
      }
    });
  }




}
