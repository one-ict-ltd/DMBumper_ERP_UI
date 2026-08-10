import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  //TemplateRef,
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
  //NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
// import { NavigationStart, Router } from "@angular/router";
// import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
// import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
// import { ProductService } from "app/services/inventory/product.service";
// import { CommoncomboService } from "app/services/commoncombo.service";
// import { StockinService } from "app/services/inventory/stockin.service";

import { BomService } from "app/services/production/bom.service";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { ProductionServiceService } from "app/services/production/production-service.service";
// import { ProductionPlanService } from "app/services/production/production-plan.service";
// import { ProductuomService } from "app/pages/inventory/settings/productuom.service";


interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-miscellaneous-req',
  templateUrl: './miscellaneous-req.component.html',
  styleUrls: ['./miscellaneous-req.component.scss']
})
export class MiscellaneousReqComponent implements OnInit {

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
    // private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    // private ProducttransferService: ProducttransferService,
    private productrequisitionService: ProductrequisitionService,
    // private productService: ProductService,
    // private comboService: CommoncomboService,
    // private stockinService: StockinService,
    private bomService: BomService,
    private datePipe: DatePipe,
    // private productionProcessService: ProductionServiceService,
    // private productionPlanService: ProductionPlanService,
    // private productuomService: ProductuomService
  ) {
    this.commonService.valueSet("showlist");
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
        headerName: "Req. No.",
        field: "RmPmMiscReqNo",
        width: 140,
      },
      {
        headerName: "Date",
        field: "RmPmMiscReqDate",
        width: 140,
      },
      {
        headerName: "Material Type",
        field: "productTypeName",
        width: 170,
      },
      {
        headerName: "Req From",
        field: "reqFrom",
        width: 170,
      },
      {
        headerName: "Purpose",
        field: "reqPurpose",
        width: 250,
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
    this.GetMiscellaneousIssueTypeList();
    this.GetMaterialTypeListForMiscellaneousReq();
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

  public pageNavigation = "Miscellaneous Req.";
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

  master: {
    RmPmMiscReqId: number;
    RmPmMiscReqNo: string;
    RmPmMiscReqDate: Date;
    productTypeId: number;
    miscReqTypeId: number;
    reqFrom: string;
    reqPurpose: string;
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

      RmPmMiscReqId: 0,
      RmPmMiscReqNo: "",
      RmPmMiscReqDate: new Date(),
      productTypeId: 0,
      miscReqTypeId: 0,
      reqFrom: "",
      reqPurpose: "",
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
    this.master.RmPmMiscReqDate = this.commonService.DateFormat(this.master.RmPmMiscReqDate);
    this.master.gatePassDate = this.commonService.DateFormat(this.master.gatePassDate);

    this.apiUrl = `Stock/SetPrdRmPmMiscellaneousReq`;
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
    //this.getBomMasterProductSpec();
    //this.getBomDetailsProductSpec();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.GetGridData();
  }
  apiUrl: string = "";
  GetGridData() {
    this.apiUrl = `Stock/GetPrdRmPmMiscellaneousReq?masterId=${this.master.RmPmMiscReqId}&fDate=&tDate=`;
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
      this.agEdit(event);

    } else if (data == "view") {
      // this.agEdit(event);
      // this.show = false;
      // this.disabled = true;

      this.toastrService.warning("Comming soon !", "Message");
      this.commonService.valueSet("showlist");
      this.agEdit(event);

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
    /*
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
              //this.calculateGrandTotal();
            });
          //console.log(this.master);
        }
      });
      this.ngOnInit();

    }
  */
  }

  private agReport(event) {
    this.generateCrReport(event.node.data.RmPmMiscReqId);
  }

  generateCrReport(masterId: any) {
    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `InventoryReport/GetMiscellaneousReq?reportFormat=Pdf&userId=${userInfo[0].employeeid}&masterId=${masterId}`;

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
    // console.log(event.node.data.RmPmMiscReqId);
    if (confirm("Are you sure to delete ?")) {
      this.commonService
        .postApiData("stock/DeletePrdRmPmMiscellaneousReq", event.node.data.RmPmMiscReqId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.GetGridData();
            this.toastrService.success(returns.message, "Message");
          } else {
            this.toastrService.danger("Data not Delete!", "Message");
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

  // productImageFile: string;
  // getProductImage(imageUrl: string) {
  //   this.productImageFile = "";
  //   // this.salesOfferService.getProductImage(imageUrl).subscribe((returns: any) => {
  //   //   if (returns.success) {
  //   //     this.productImageFile = returns.data[0].ImageFile;
  //   //   }
  //   // });
  // }
  lblpackSize: string = "";

  isRound = 0;
  public getProductSpecDetails() {
    this.isRound = 0;
    //this.getProductImage(this.master.productSpecSelected["imageUrl"]);
    this.price = this.detailsProductSpecSelected["price"];
    this.uomName = this.detailsProductSpecSelected["uomName"];
    this.productName = this.detailsProductSpecSelected["name"];
    // this.isRound = this.detailsProductSpecSelected["isRound"];
    this.currentStock = this.detailsProductSpecSelected["currentStock"];
    //this.getCurrentStock();
  }

  public getBomDetailsProductSpec(id) {
    this.detailsProductSpecList = [];
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
          isRound: val.isRound,
          currentStock: val.currentStock
        }));
      });
  }
  // public getbomForList(bomForId) {
  //   this.bomService
  //     .getAllbomForList(bomForId)
  //     .subscribe((returns: any) => {
  //       this.bomForList = returns.data.map((val: any) => ({
  //         id: val.bomForId,
  //         name: val.bomForName,
  //       }));
  //     });
  // }
  miscReqTypeList = [];
  GetMiscellaneousIssueTypeList() {
    this.apiUrl = "";
    this.apiUrl = `Stock/GetMiscellaneousIssueTypeList`;

    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.status) {
        this.miscReqTypeList = returns.data.map((val: any) => ({
          id: val.miscReqTypeId,
          name: val.miscReqTypeName,
        }));
      } else {
        this.miscReqTypeList = [];
        this.toastrService.warning(returns.message, "Message");
      }
    });


  }
  // public getBomMasterProductSpec() {
  //   this.bomService.GetBomMasterProductSpec(0).subscribe((returns: any) => {
  //     this.bomProductSpecList = returns.data.map((val: any) => ({
  //       id: val.productWiseSpecificationId,
  //       name: val.productName,
  //       uomId: val.uomId,
  //       uomName: val.uomName,
  //       productId: val.productId,
  //       price: val.price,
  //       imageUrl: val.imageUrl,
  //       packSize: val.packSize,
  //       bomProductName: val.bomProductName
  //     }));
  //   });
  // }

  validationForMasterSave(): boolean {
    debugger;
    if (this.master.miscReqTypeId == null || this.master.miscReqTypeId == 0) {
      this.toastrService.warning("Please select Misc Req. Type", "Message");
      return false;
    }

    if (
      this.master.lstDetail.length == 0 ||
      this.master.lstDetail == null
    ) {
      this.toastrService.warning(
        "Please add at least one material",
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
    if (confirm(`Are you sure to delete ${this.master.lstDetail[index].productName} ?`)) {
      let RmPmMiscReqDetailId = this.master.lstDetail[index].RmPmMiscReqDetailId;
      if (RmPmMiscReqDetailId > 0) {
        this.commonService
          .postApiData("stock/DeletePrdRmPmMiscellaneousReqDetails", RmPmMiscReqDetailId)
          .subscribe((returns: any) => {
            if (returns.success) {
              this.master.lstDetail.splice(index, 1);
              this.toastrService.success(this.commonService.deletedmsg, "Message");
            } else {
              this.toastrService.warning(returns.message, "Message");
            }
          });
      }
      else {
        this.master.lstDetail.splice(index, 1);
        this.toastrService.success(this.commonService.deletedmsg, "Message");
      }
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



  public GetTypeWiseProductSpec(id) {
    debugger
    this.getBomDetailsProductSpec(id);
  }



  materialsTypeList: any = [];
  GetMaterialTypeListForMiscellaneousReq() {
    this.commonService.getApiData("stock/GetMaterialTypeListForMiscellaneousReq").subscribe((data: any) => {
      if (data.success) {
        this.materialsTypeList = data.data.map((val: any) => ({
          id: val.productTypeId,
          name: val.productTypeName,
        }));
      }
    });
  }
}
