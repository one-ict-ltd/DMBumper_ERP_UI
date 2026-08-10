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
// import { NavigationStart, Router } from "@angular/router";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { ProductService } from "app/services/inventory/product.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { StockinService } from "app/services/inventory/stockin.service";

import { BomService } from "app/services/production/bom.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ProductionServiceService } from "app/services/production/production-service.service";
import { ProductionPlanService } from "app/services/production/production-plan.service";
import { ProductuomService } from "app/pages/inventory/settings/productuom.service";


interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-miscellaneous-issue',
  templateUrl: './miscellaneous-issue.component.html',
  styleUrls: ['./miscellaneous-issue.component.scss']
})
export class MiscellaneousIssueComponent implements OnInit {


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

  title = "Hi there!";
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
  areaShow: boolean = true;
  currentStock: 0;

  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private ProducttransferService: ProducttransferService,
    private productrequisitionService: ProductrequisitionService,
    private productService: ProductService,
    private comboService: CommoncomboService,
    private stockinService: StockinService,
    private bomService: BomService,
    private datePipe: DatePipe,
    private productionProcessService: ProductionServiceService,
    private productionPlanService: ProductionPlanService,
    private productuomService: ProductuomService
  ) {
    this.commonService.valueSet("showlist");
    //this.LoadDropdown();
    // this.loadPotencyEffectList();
    // this.getbomForList(0);
    // this.getAllprocessGroups();
    // this.getProductUOMList();
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
        headerName: "Issue No.",
        field: "RmPmMiscIssueNo",
        width: 140,
      },

      {
        headerName: "Date",
        field: "RmPmMiscReqDate",
        width: 140,
      },
      {
        headerName: "Req. No.",
        field: "RmPmMiscReqNo",
        width: 140,
      },
      {
        headerName: "Misc Type",
        field: "miscReqTypeName",
        width: 170,
      },
      {
        headerName: "Issue To",
        field: "reqFrom",
        width: 200,
      },
      {
        headerName: "Purpose",
        field: "issuePurpose",
        width: 270,
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
    // this.GetMiscellaneousIssueTypeList();
    this.GetMaterialTypeList();
    this.GetMiscellaneousIssueTypeList();
  }


  ngOnInit() {
    ////debugger;
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Miscellaneous Issue";
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

  //

  bomProductSpecList: {};
  bomProductSpecSelected: {};
  bomForList: {};
  materialsTypeSelected: any = {};
  batchWeightUOMSelected: {};
  WeightPerPackUOMSelected: {};
  bomForSelected: {};
  miscReqTypeSelected: any = {};
  RmPmMiscReqList: any = [];
  RmPmMiscReqListSelected: any = {};

  master: {
    //RmPmMiscIssueNo, RmPmMiscIssueDate, RmPmMiscReqId, issuePurpose, gatePassNo, gatePassDate

    RmPmMiscIssueId: number;
    RmPmMiscReqId: number;
    RmPmMiscIssueNo: string;
    RmPmMiscIssueDate: Date;
    RmPmMiscReqDate: Date;
    productTypeId: number;
    miscReqTypeId: number;
    reqFrom: string;
    miscReqTypeName: string;
    issuePurpose: string;
    gatePassNo: string;
    gatePassDate: Date;
    lstDetail: any[];


    pendingbomId: number;
    bomNo: string;
    bomName: string;
    productName: string;
    bomDate: Date;
    uomName: string;
    bomProductWiseSpecificationId: number;
    bomDescription: string;
    bomTotalCost: number;
    companyId: number;
    sbuId: number;
    WeightPerPackUOM: number;
    bomQty: number;
    pendinglstDetailsViewModel: any[];
    materialsType: string;
    bomType: string;
    weightPerPack: number;
    packSizeForPM: number;
    bomForId: number;
    batchWeight: number;
    phGroupMasterId: number;
    shelfLife: number;
    typeId: number;
    typeSelected: any[];
    revisionNo: number;


  };
  public getMaster() {
    this.master = {
      RmPmMiscIssueId: 0,
      RmPmMiscReqId: 0,
      RmPmMiscIssueNo: "",
      RmPmMiscIssueDate: new Date(),
      RmPmMiscReqDate: new Date(),
      productTypeId: 0,
      miscReqTypeId: 0,
      reqFrom: "",
      miscReqTypeName: "",
      issuePurpose: "",
      gatePassNo: "",
      gatePassDate: new Date,
      lstDetail: [],


      typeId: 0,
      typeSelected: null,
      pendingbomId: 0,
      bomNo: "",
      bomName: "",
      productName: "",
      bomDate: new Date(),
      uomName: "",
      bomProductWiseSpecificationId: 0,
      bomDescription: "",
      bomTotalCost: 0,
      bomQty: 1,
      companyId: null,
      sbuId: null,
      pendinglstDetailsViewModel: [],
      materialsType: null,
      bomType: null,
      WeightPerPackUOM: null,
      weightPerPack: null,
      packSizeForPM: 0,
      bomForId: null,
      batchWeight: null,
      phGroupMasterId: null,
      shelfLife: null,
      revisionNo: 0,

    };

    this.bomProductSpecSelected = null;
    this.detailsProductSpecSelected = null;
    this.bomForSelected = null;
    this.WeightPerPackUOMSelected = null;
    this.materialsTypeSelected = null;
    this.batchWeightUOMSelected = null;
    this.processGroupSelected = null;
    this.selectedpotencyEffect = null;

    this.reqQty = 1;
    this.price = 0;
    this.wastage = 0;
    this.grandTotalQty = 0;
    this.uomName = "";
    //this.getMaxNo();
    this.GetPrdRmPmMiscellaneousReqListForIssue();
  }

  // bomDetails

  bomDetailsId: number = 0;
  pendingbomId: number = 0;
  productName: string = "";
  productWiseSpecificationId: number = 0;
  reqQty: number = 0;
  uomName: string = "";
  price: number = 0.0;
  wastage: number = 0.0;
  totalPrice: number = 0.0;
  grandTotalQty: number = 0.0;
  totalQty: number = 0.0;
  detailsProductSpecList: {};
  detailsProductSpecSelected: {};
  processGroupSelected: {};
  selectedpotencyEffect: {};
  // All Button Action

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
    this.master.RmPmMiscIssueDate = this.commonService.DateFormat(this.master.RmPmMiscIssueDate);
    this.master.gatePassDate = this.commonService.DateFormat(this.master.gatePassDate);
    console.log(this.master);
    this.apiUrl = `Stock/SetPrdRmPmMiscellaneousIssue`;
    this.commonService.postApiData(this.apiUrl, this.master).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success(returns.message, "Message");
        this.getMaster();
        this.GetGridData()
        this.show = true;
      } else {
        this.show = false;
        this.commonService.valueSet("create");
        this.toastrService.warning(returns.message, "Message");
      }
    });
  }

  private reset() {
    this.getMaster();
  }

  beforeSave() {
    this.master.pendinglstDetailsViewModel.forEach((element) => {
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

  LoadDropdown() {
    this.getBomMasterProductSpec();
    //this.getBomDetailsProductSpec();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.GetGridData();
  }
  GetGridData() {
    this.apiUrl = `Stock/GetPrdRmPmMiscellaneousIssue?masterId=${this.master.RmPmMiscReqId}&fDate=&tDate=`;
    this.commonService.getApiData(this.apiUrl).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
      else {
        this.toastrService.warning(data.message, "Message");
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
      // this.bomService.GetBomMasterIsApproveOrNot(event.node.data.pendingbomId, event.node.data.materialsType).subscribe((data: any) => {
      //   debugger
      //   if (data.success) {
      //     if (data.data[0].status == 0) {
      //       this.toastrService.warning("BOM is Approved. you can not edit it", "Message");
      //       this.commonService.valueSet("showlist");
      //       return;
      //     }
      //     else {
      //       this.agEdit(event);
      //       this.show = false;
      //     }
      //   }
      // });

      this.toastrService.warning("Comming soon !", "Message");
      this.commonService.valueSet("showlist");
      //this.agEdit(event);

    } else if (data == "view") {
      // this.agEdit(event);
      // this.show = false;
      // this.disabled = true;

      this.toastrService.warning("Comming soon !", "Message");
      this.commonService.valueSet("showlist");
      //this.agEdit(event);

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
      var pendingbomId = event.node.data.pendingbomId;

      this.bomService.GetBomMasterById(pendingbomId).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];
          this.master.bomDate = new Date(this.master.bomDate);
          if (data.data[0].materialsType == "raw") {
            this.materialsTypeSelected = {
              id: 1,
              name: "Raw Materials(RM)"
            };
            this.getBomDetailsProductSpec(5);
          }
          else {
            this.materialsTypeSelected = {
              id: 2,
              name: "Packing Materials(PM)"
            };
            this.getBomDetailsProductSpec(6);
          }
          this.batchWeightUOMSelected = {
            id: data.data[0].batchWeightUOMId,
            name: data.data[0].batchWeightUOMname,
          };
          debugger
          this.WeightPerPackUOMSelected = {
            id: data.data[0].WeightPerPackUOM,
            name: data.data[0].WeightPerPackUOMname,
          };
          this.bomProductSpecSelected = {
            id: data.data[0].bomProductWiseSpecificationId,
            name: data.data[0].bomProductSpecName,
          };
          // this.bomForSelected = {
          //   id: data.data[0].bomForId,
          //   name: data.data[0].bomForType,
          // };
          this.processGroupSelected = {
            id: data.data[0].phGroupMasterId,
            name: data.data[0].groupName,
          };
          debugger
          this.bomService
            .GetBomDetailsByMasterId(pendingbomId)
            .subscribe((data: any) => {
              if (data.success) {
                this.master.pendinglstDetailsViewModel = data.data;
                console.log(this.master);
              }
              this.reqQty = 0;
              this.price = 0;
              this.wastage = 0;
              this.uomName = "";
              this.calculateGrandTotal();
            });
          //console.log(this.master);
        }
      });
      this.ngOnInit();

    }

  }

  private agReport(event) {
    this.generateCrReport(event.node.data.RmPmMiscIssueId);
  }

  generateCrReport(masterId: any) {
    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `InventoryReport/GetMiscellaneousIssue?reportFormat=Pdf&userId=${userInfo[0].employeeid}&masterId=${masterId}`;

    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning(this.commonService.procesFailed, "Message");
      }
    });
  }
  private agDelete(event) {
    // console.log(event.node.data);
    // console.log(event.node.data.RmPmMiscIssueId);
    if (confirm("Are you sure to delete ?")) {
      this.commonService
        .postApiData("stock/DeletePrdRmPmMiscellaneousIssue", event.node.data.RmPmMiscIssueId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.GetGridData();
            this.toastrService.success(returns.message, "Message");
          } else {
            this.toastrService.danger(returns.message, "Message");
          }
        });
    }
  }



  public validateQty() {
    if (this.reqQty == null ? 0 : this.reqQty < 0) this.master.bomQty = 0;
  }

  public getMaxNo() {
    this.bomService
      .GetMaxBomMasterNumber(
        this.datePipe.transform(this.master.bomDate, "yyyy-MM-dd")
      )
      .subscribe((returns: any) => {
        if (returns.success) {
          this.master.bomNo = returns.data[0].MaxNo;
        }
      });
  }

  productImageFile: string;
  getProductImage(imageUrl: string) {
    this.productImageFile = "";
    // this.salesOfferService.getProductImage(imageUrl).subscribe((returns: any) => {
    //   if (returns.success) {
    //     this.productImageFile = returns.data[0].ImageFile;
    //   }
    // });
  }
  lblpackSize: string = "";
  public getBomProductSpecDetails(id) {
    //this.getProductImage(this.master.productSpecSelected["imageUrl"]);
    this.lblpackSize = this.bomProductSpecSelected["packSize"];
    this.master.uomName = this.bomProductSpecSelected["uomName"];
    this.master.bomName = this.bomProductSpecSelected["bomProductName"];

    this.master.pendinglstDetailsViewModel = [];
    debugger
    this.bomService.getRevisionNoFromBOM(id, this.master.materialsType)
      .subscribe((returns: any) => {
        debugger
        this.master.revisionNo = returns.data[0].revisionNo;
      });
    this.bomService.getLastGroupName(id)
      .subscribe((returns: any) => {
        debugger
        this.processGroupSelected = {
          id: returns.data[0].phGroupMasterId,
          name: returns.data[0].groupName,
        };
        this.master.phGroupMasterId = returns.data[0].phGroupMasterId;
      });
  }
  isRound = 0;
  public getProductSpecDetails() {
    this.isRound = 0;
    //this.getProductImage(this.master.productSpecSelected["imageUrl"]);
    this.price = this.detailsProductSpecSelected["price"];
    this.uomName = this.detailsProductSpecSelected["uomName"];
    this.productName = this.detailsProductSpecSelected["name"];
    // this.isRound = this.detailsProductSpecSelected["isRound"];
    // this.currentStock = this.detailsProductSpecSelected["currentStock"];
    //this.getCurrentStock();
  }

  public getBomDetailsProductSpec(id) {
    this.productrequisitionService
      .getAllProductForBOM(id)
      .subscribe((returns: any) => {
        this.detailsProductSpecList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uomId: val.uomId,
          uomName: val.uomName,
          productId: val.productId,
          price: val.price,
          imageUrl: val.imageUrl,
          isRound: val.isRound
        }));
      });
  }
  public getbomForList(bomForId) {
    this.bomService
      .getAllbomForList(bomForId)
      .subscribe((returns: any) => {
        this.bomForList = returns.data.map((val: any) => ({
          id: val.bomForId,
          name: val.bomForName,
        }));
      });
  }
  miscReqTypeList = [];
  GetMiscellaneousIssueTypeList() {
    // this.apiUrl = "";
    // this.apiUrl = `Stock/GetMiscellaneousIssueTypeList`;

    // this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
    //   if (returns.status) {
    //     this.miscReqTypeList = returns.data.map((val: any) => ({
    //       id: val.miscReqTypeId,
    //       name: val.miscReqTypeName,
    //     }));
    //   } else {
    //     this.miscReqTypeList = [];
    //     this.toastrService.warning(returns.message, "Message");
    //   }
    // });
  }
  GetPrdRmPmMiscellaneousReqListForIssue() {
    this.apiUrl = "";
    this.apiUrl = `Stock/GetPrdRmPmMiscellaneousReqListForIssue`;

    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.status) {
        //RmPmMiscReqId	RmPmMiscReqNo	RmPmMiscReqDate	productTypeName	miscReqTypeName	reqFrom	reqPurpose	gatePassNo	gatePassDate
        this.RmPmMiscReqList = returns.data.map((val: any) => ({
          id: val.RmPmMiscReqId,
          name: val.RmPmMiscReqNo + " | " + val.RmPmMiscReqDate + "; " + val.miscReqTypeName,
          RmPmMiscReqDate: val.RmPmMiscReqDate,
          productTypeName: val.productTypeName,
          miscReqTypeName: val.miscReqTypeName,
          reqFrom: val.reqFrom,
          reqPurpose: val.reqPurpose,
          gatePassNo: val.gatePassNo,
          gatePassDate: val.gatePassDate,
        }));
      } else {
        this.RmPmMiscReqList = [];
        this.toastrService.warning(returns.message, "Message");
      }
    });
  }

  GetReqDetails(RmPmMiscReqId: number) {
    this.master.miscReqTypeName = this.RmPmMiscReqListSelected["miscReqTypeName"];
    this.master.reqFrom = this.RmPmMiscReqListSelected["reqFrom"];
    this.master.issuePurpose = this.RmPmMiscReqListSelected["reqPurpose"];
    this.master.gatePassNo = this.RmPmMiscReqListSelected["gatePassNo"];
    this.master.gatePassDate = this.RmPmMiscReqListSelected["gatePassDate"];

    this.apiUrl = "";
    this.apiUrl = `Stock/GetPrdRmPmMiscellaneousReq?masterId=${RmPmMiscReqId}&fDate=&tDate=`;

    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.status) {
        this.master.lstDetail = returns.data;
      } else {
        this.master.lstDetail = [];
        this.toastrService.warning(returns.message, "Message");
      }
    });
  }

  public getBomMasterProductSpec() {
    this.bomService.GetBomMasterProductSpec(0).subscribe((returns: any) => {
      this.bomProductSpecList = returns.data.map((val: any) => ({
        id: val.productWiseSpecificationId,
        name: val.productName,
        uomId: val.uomId,
        uomName: val.uomName,
        productId: val.productId,
        price: val.price,
        imageUrl: val.imageUrl,
        packSize: val.packSize,
        bomProductName: val.bomProductName
      }));
    });
  }

  validationForMasterSave(): boolean {
    debugger;
    for (let index = 0; index < this.master.lstDetail.length; index++) {
      const el = this.master.lstDetail[index];
      if ((el.issueQty ?? 0) > (el.currentStock ?? 0)) {
        this.toastrService.warning(`You do not have enough Current Stock for ${el.productName} issue!`, "Warning");
        return false;
      }
    }

    if (this.master.RmPmMiscReqId == null || this.master.RmPmMiscReqId == 0) {
      this.toastrService.warning("Please select a Misc Req. No.", "Message");
      return false;
    }

    if (
      this.master.lstDetail.length == 0 ||
      this.master.lstDetail == null
    ) {
      this.toastrService.warning(
        "No material find in the list for save.",
        "Message"
      );
      return false;
    }

    return true;
  }
  remarks: string = "";
  public addToDetailsGrid() {
    debugger;
    if (
      this.detailsProductSpecSelected == null ||
      this.detailsProductSpecSelected["id"] == null ||
      this.detailsProductSpecSelected["id"] == undefined
    ) {
      this.toastrService.warning("Please select a Material", "Message");
      return;
    }
    // if (this.price == 0 || this.price == null) {
    //   this.toastrService.warning("Price is zero.", "Message");
    //   return;
    // }
    if (this.reqQty == 0 || this.reqQty == null) {
      this.toastrService.warning("Quantity is zero.", "Message");
      return;
    }
    if (this.wastage < 0 || this.reqQty == null) {
      this.toastrService.warning("Waste is zero.", "Message");
      return;
    }

    let elements = {
      RmPmMiscReqDetailId: 0,
      RmPmMiscReqId: this.master.RmPmMiscReqId,
      productWiseSpecificationId: this.productWiseSpecificationId,
      productName: this.productName,
      uomName: this.uomName,
      reqQty: this.reqQty,
      remarks: this.remarks,

      // price: this.price,
      // wastage: this.wastage,
      // totalQty: this.totalQty,
      // totalPrice: this.totalPrice,
      // isActive: 1,
      // isSelect: 1,
      // imageFile: "", // this.productImageFile,
      // potencyEffect: this.selectedpotencyEffect["id"],
      // potencyEffectName: this.selectedpotencyEffect["name"],
      // bomForId: this.master.bomForId,
      // bomForName: this.bomForSelected["name"]
    };
    this.master.lstDetail.push(elements);
    //this.calculateGrandTotal();
    this.productWiseSpecificationId = null;
    this.detailsProductSpecSelected = null;
    this.uomName = null;
    this.reqQty = null;
    this.wastage = null;
    this.remarks = null;
    //this.selectedpotencyEffect = null;

  }

  public calculateTotal(index: any) {
    let totalPrice = 0.0;
    let totalQty = 0.0;

    let reqQty =
      this.master.pendinglstDetailsViewModel[index].reqQty == ""
        ? 0.0
        : this.master.pendinglstDetailsViewModel[index].reqQty;
    let waste =
      this.master.pendinglstDetailsViewModel[index].wastage == null
        ? 0.0
        : this.master.pendinglstDetailsViewModel[index].wastage;
    let price =
      this.master.pendinglstDetailsViewModel[index].price == ""
        ? 0.0
        : this.master.pendinglstDetailsViewModel[index].price;

    let wasteQty = 0.0;
    wasteQty = reqQty * (waste / 100);
    totalQty = reqQty + wasteQty;

    totalPrice = totalQty * price;

    this.master.pendinglstDetailsViewModel[index].totalQty = totalQty;
    this.master.pendinglstDetailsViewModel[index].totalPrice = totalPrice;

    this.calculateGrandTotal();
  }

  calculateGrandTotal() {
    debugger
    this.master.bomTotalCost = 0.0;
    this.grandTotalQty = 0.0;
    this.master.pendinglstDetailsViewModel.forEach((row) => {
      this.master.bomTotalCost += row.totalPrice == "" ? 0.0 : row.totalPrice;
      this.grandTotalQty += row.totalQty == "" ? 0.0 : row.totalQty;
    });
  }

  public refeshDetails() {
    this.master.pendinglstDetailsViewModel = [];
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
    debugger
    let bomDetailsId = this.master.pendinglstDetailsViewModel[index].pendingbomDetailsId;
    this.selectedRow = this.master.pendinglstDetailsViewModel[index];

    //if (this.selectedRow.helpDetailId > 0) { }

    if (bomDetailsId > 0) {
      this.bomService
        .DeleteBomDetailsById(bomDetailsId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.master.pendinglstDetailsViewModel.splice(index, 1);
            this.toastrService.success(
              this.commonService.deletedmsg,
              "Message"
            );
          } else {
            this.toastrService.danger("Data not Delete!", "Message");
          }
        });
    } else {
      this.master.pendinglstDetailsViewModel.splice(index, 1);
      this.toastrService.success(this.commonService.deletedmsg, "Message");
    }
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

  public rbomProductSpecName: string = "";
  public rbomDescription: string = "";
  public rbomNo: string = "";
  public rbomDate: Date = null;
  public rPaymentDate: string = "";

  public rtotalQty: number = 0;
  public rbomQty: number = 0;
  public rgrandTotal: number = 0;

  public rReportHeader = "BOM (Bill of Materials) Report";
  public tableHeader = [
    "#",
    "Bom For",
    "Details Product Name",
    "Qty.",
    "Waste (%)",
    "Total Qty.",
    "UOM",
    "Potency"
  ];
  public apiUrl = "";
  public htmlBodyData: string = "";

  public params = [];
  public bodyData: any = [];
  public bodyDatashow: any = [];

  public rmaterialType: string = "";
  public rweightPerPack: number = 0;
  public rWeightPerPackUOMname: string = "";
  public rbatchWeight: number = 0;
  public rbatchWeightUOMname: string = "";
  public rgroupName: string = "";
  public rshelfLife: number = 0;
  public rpackSizeForPM: number = 0;
  public rbomType: string = "";
  public rbomFor: string = "";

  private getReportData(pendingbomId: number, buttonAction: any) {
    try {
      this.apiUrl = `Bom/GetBomReportDataById?pendingbomId=${pendingbomId}`;
      this.commonService
        .getReportData(this.apiUrl)
        .subscribe((returns: any) => {
          if (returns.success && returns.data.length > 0) {
            this.bodyData = [];
            this.bodyData = returns.data;
            this.rgrandTotal = this.bodyData[0]["grandTotal"];
            this.rbomProductSpecName = this.bodyData[0]["bomProductSpecName"];
            this.rbomDescription = this.bodyData[0]["bomDescription"];
            this.rbomDate = this.bodyData[0]["bomDate"];
            this.rbomQty = this.bodyData[0]["bomQty"];
            this.rbomNo = this.bodyData[0]["bomNo"];

            this.rbatchWeight = this.bodyData[0]["batchWeight"];
            this.rweightPerPack = this.bodyData[0]["weightPerPack"];
            this.rWeightPerPackUOMname = this.bodyData[0]["WeightPerPackUOMname"];
            this.rgroupName = this.bodyData[0]["groupName"];
            this.rshelfLife = this.bodyData[0]["shelfLife"];
            this.rpackSizeForPM = this.bodyData[0]["packSizeForPM"];
            this.rbomType = this.bodyData[0]["bomType"];
            this.rbomFor = this.bodyData[0]["bomForName"];
            this.setParam();
            if (this.bodyData.length == 0) {
              this.toastrService.warning(
                "Message",
                this.commonService.nodatafound
              );
            } else {
              var fileName = this.pageNavigation + "." + buttonAction;
              const content = document.getElementById("reportHeader");
              this.generateSalesReport(
                buttonAction,
                fileName,
                content,
                2,
                this.bodyData
              );
            }
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

  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "BOM No.",
      leftValue: this.rbomNo,
      rightLabel: "BOM Date",
      rightValue: this.rbomDate,


    });
    this.params.push({
      leftLabel: "BOM Product Name",
      leftValue: this.rbomProductSpecName,
      rightLabel: "BOM Qty.",
      rightValue: this.rbomQty,
    });
    this.params.push({
      leftLabel: "Batch Weight",
      leftValue: this.rbatchWeight,
      rightLabel: "Bom Type",
      rightValue: this.rbomType,
    });
    this.params.push({
      leftLabel: "Weight Per Pack",
      leftValue: this.rweightPerPack,
      rightLabel: "UOM",
      rightValue: this.rWeightPerPackUOMname,
    });
    this.params.push({
      leftLabel: "Group Name",
      leftValue: this.rgroupName,
      rightLabel: "Shelf Life",
      rightValue: this.rshelfLife + " months",
    });
  }

  public generateReport(buttonAction: any, pendingbomId: number = 0) {
    ////debugger;
    // var fileName = this.pageNavigation + "." + buttonAction;
    this.getReportData(pendingbomId, buttonAction);
    // if (this.bodyData.length == 0) {
    //   this.toastrService.warning("Message", this.commonService.nodatafound);
    // }
    // else {
    //   const content = document.getElementById("reportHeader");
    //   this.generateSalesReport(buttonAction, fileName, content, 2, this.bodyData);
    // }
  }

  generateSalesReport(
    buttonAction: any,
    fileName: string,
    content: any,
    columnIndex: any,
    bodyData: any
  ) {
    debugger
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional
    const legend = {
      height: 100,
    };
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      //var a = doc.internal.setFont("helvetica", "italic");
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
          startY: legend.height + 20,
          styles: { font: "Meta" },
          headStyles: {
            halign: "center",
            valign: "top",
            fontStyle: "bold",
            textColor: 50,
            fontSize: 20,
            fillColor: [216, 216, 216],
          },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 170,
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
            valign: "middle",
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
          columnStyles: {
            //2: { halign: "right" },
            3: { halign: "right" },
            4: { halign: "right" },
            5: { halign: "right" },
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

  materialsTypeList: any = [];

  GetMaterialTypeList() {
    this.materialsTypeList = [
      {
        id: 5,
        name: "Raw Materials (RM)",
      },
      {
        id: 6,
        name: "Packing Materials (PM)",
      }
    ];
  }
  potencyEffectList: any = [];

  loadPotencyEffectList() {
    this.potencyEffectList = [
      {
        id: 1,
        name: "Yes",
      },
      {
        id: 2,
        name: "No",
      }
    ];
  }

  public GetTypeWiseProductSpec(id) {
    debugger
    // this.materialsTypeSelected = null;
    // this.master.productTypeId = null;
    this.getBomDetailsProductSpec(id);

    // if (id == 1) {
    //   console.log(id)
    //   this.master.materialsType = null;
    //   this.master.materialsType = "raw";
    //   this.getBomDetailsProductSpec(5)
    //   this.areaShow = false;
    //   this.master.packSizeForPM = 0;
    // }
    // if (id == 2) {
    //   this.master.materialsType = null;
    //   this.master.materialsType = "packing";
    //   this.getBomDetailsProductSpec(6)
    //   this.areaShow = true;
    // }

  }
  processGroupList = [];
  getAllprocessGroups() {
    // debugger
    // this.productionProcessService.GetProcessHeadGroupMasterById(0).subscribe((data: any) => {
    //   if (data.success) {
    //     // this.rowData=data.data;
    //     this.processGroupList = data.data.map((val: any) => ({
    //       id: val.phGroupMasterId,
    //       name: val.groupName,
    //     }));

    //   }
    // })

  }
  clearBomDetails() {
    this.master.pendinglstDetailsViewModel = [];
  }
  UomList = [];
  getProductUOMList() {
    this.productuomService.getProductUOMById(0).subscribe((data: any) => {
      if (data.success) {
        this.UomList = data.data.map((val: any) => ({
          id: val.uomId,
          name: val.uomName,
        }));
      }
    });
  }
  checkStockQty(rowIndex: number) {
    let currentStock = this.master.lstDetail[rowIndex].currentStock ?? 0;
    let IssuedQty = this.master.lstDetail[rowIndex].issueQty ?? 0;

    if (IssuedQty > currentStock) {
      this.toastrService.warning("You do not have enough Current Stock for " + this.master.lstDetail[rowIndex].productName + " issue!", "Warning");
      this.master.lstDetail[rowIndex].issueQty = 0;
    }
  }
}
