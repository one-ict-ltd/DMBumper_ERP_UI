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

import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { ProductService } from "app/services/inventory/product.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { BomService } from "app/services/production/bom.service";

import { ProductionServiceService } from "app/services/production/production-service.service";
import { ProductionPlanService } from "app/services/production/production-plan.service";
import { ProductuomService } from "app/pages/inventory/settings/productuom.service";
import { filter } from "rxjs/operators";
@Component({
  selector: 'ngx-transfer-notes',
  templateUrl: './transfer-notes.component.html',
  styleUrls: ['./transfer-notes.component.scss']
})
export class TransferNotesComponent implements OnInit {

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
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Transfer Notes";
  public rptHeader = "Transfer Notes";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {

      this.save();

    } else if (this.commonService.buttonClicked == "update") {

      this.save();

    } else if (this.commonService.buttonClicked == "view") {
      this.commonService.valueSet("showlist");
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      //this.edit();
      this.commonService.valueSet("showlist");
      this.show = false;
    }
  }


  master: {

    batchNo: string;
    batchWeight: number;
    batchWeightUOM: string;
    isRePack: boolean;

    bomId: number;
    bomNo: string;
    bomName: string;
    productName: string;

    transferDate: Date;
    uomName: string;
    bomMasterProductWiseSpecificationId: number;
    bomDescription: string;
    bomTotalCost: number;

    productionPlanId: number;
    productWiseSpecificationId: number;
    transferNoteNo: string;
    bomForId: number;
    stdBatchSize: number;
    weightPerPack: number;
    weightPerPackUOM: string;
    sWeightPerPack: number;
    productCode: string;
    packSizeForPM: number;
    noOfBox: number;
    qtyPerShipper: number;
    manufacturingDate: Date;
    ExpireDate: Date;
    mfgDate: string;
    expDate: string;
    transferQty: number;
    batchTypeName: string;
    looseqty: number;
    equivalentWeight: number;
    totalCommercialQty: number;
    transfered: number;
    remainQty: number;
    transferIssuedBy: string;
    remarks: string;
    // Transfered: number;
    weightUOMId: number;
    productionPlanSelected: {};
    shelfLife: number;
    isComplete: boolean;
    productId: number;
    prdPlanProcessId: number;
    SecndproductWiseSpecificationId: number;
    MRP: number;
  };
  public getMaster() {
    this.master = {

      batchNo: "",
      batchWeight: 0,
      batchWeightUOM: "",
      isRePack: false,
      transferDate: new Date(),
      bomId: 0,
      bomMasterProductWiseSpecificationId: 0,
      productionPlanId: 0,
      uomName: "",
      bomNo: "",
      bomName: "",
      productName: "",

      productWiseSpecificationId: 0,
      bomDescription: "",
      bomTotalCost: 0,

      transferNoteNo: "",
      bomForId: 0,
      stdBatchSize: 0,
      weightPerPack: 0,
      weightPerPackUOM: "",
      sWeightPerPack: 0,
      productCode: "",
      packSizeForPM: 0,
      noOfBox: 0,
      qtyPerShipper: 0,
      manufacturingDate: new Date(),
      ExpireDate: new Date(),
      mfgDate: "",
      expDate: "",
      transferQty: 0,
      batchTypeName: "",
      looseqty: 0,
      equivalentWeight: 0,
      totalCommercialQty: 0,
      transfered: 0,
      remainQty: 0,
      transferIssuedBy: "",
      remarks: "",
      // Transfered: 0,
      weightUOMId: 0,
      productionPlanSelected: null,
      shelfLife: 0,
      isComplete: false,
      productId: 0,
      prdPlanProcessId: 0,
      SecndproductWiseSpecificationId: 0,
      MRP: 0
    };


    this.detailsProductSpecSelected = null;

    this.qty = 1;
    this.price = 0;
    this.wastage = 0;
    this.grandTotalQty = 0;
    this.uomName = "";
    this.getMaxNo();
    this.LoadDropdown();
  }

  // bomDetails

  bomDetailsId: number = 0;
  bomId: number = 0;
  productName: string = "";
  bomDetailsProductWiseSpecificationId: number = 0;
  qty: number = 0;
  uomName: string = "";
  price: number = 0.0;
  wastage: number = 0.0;
  totalPrice: number = 0.0;
  grandTotalQty: number = 0.0;
  totalQty: number = 0.0;
  detailsProductSpecList: {};
  detailsProductSpecSelected: {};

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
  batchTypeList = [];
  getBatchTypebyId(batchTypeId) {
    this.productionPlanService.GetBatchTypeById(batchTypeId).subscribe((returns: any) => {
      if (returns.success) {
        this.batchTypeList = returns.data.map((val: any) => ({
          id: val.batchTypeId,
          name: val.batchTypeName,
        }));
      }
    });
  }
  private save() {
    //debugger


    var button = this.commonService.buttonClicked;
    if (button == "save") {
      this.beforeSave();
    }
    if (this.master.productionPlanId == 0) {
      this.toastrService.danger("Please Select BatchNo", "Message");
      this.commonService.valueSet("create");
      return;
    }
    if (this.master.transferQty == 0) {
      this.toastrService.danger("Please Select Transfer Qty", "Message");
      this.commonService.valueSet("create");
      return;
    }
    if ((this.master.qtyPerShipper ?? 0) == 0) {
      this.toastrService.danger("Please input Box/Master Carton qty.", "Message");
      this.commonService.valueSet("create");
      return;
    }
    if ((this.master.packSizeForPM ?? 0) == 0) {
      this.toastrService.danger("Please input Qty. per Box", "Message");
      this.commonService.valueSet("create");
      return;
    }
    if ((this.master.batchTypeName ?? "") == "") {
      this.toastrService.danger('Please select "Transfer to Batch Type"', "Message");
      this.commonService.valueSet("create");
      return;
    }
    if ((this.master.SecndproductWiseSpecificationId ?? 0) == 0) {
      this.toastrService.danger('Please select "Transfer to Pack Size"', "Message");
      this.commonService.valueSet("create");
      return;
    }
    if ((this.master.sWeightPerPack ?? 0) == 0) {
      this.toastrService.danger('Please input Weight/Pack', "Message");
      this.commonService.valueSet("create");
      return;
    }
    // if (this.master.weightUOMId == 0) {
    //   this.toastrService.danger("Please Select UOM", "Message");
    //   return;
    // }
    if (this.master.transferIssuedBy == "") {
      this.toastrService.danger("Please enter IssuedBy.", "Message");
      this.commonService.valueSet("create");
      return;
    }
    if (this.master.MRP == 0) {
      this.toastrService.danger("Please input MRP.", "Message");
      this.commonService.valueSet("create");
      return;
    }

    this.master.manufacturingDate = this.commonService.DateFormat(this.master.manufacturingDate);
    this.master.ExpireDate = this.commonService.DateFormat(this.master.ExpireDate);
    this.master.transferDate = this.commonService.DateFormat(this.master.transferDate);

    this.productionPlanService.SaveTransferNote(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }

        this.getMaster(); //////////////Grid Refresh ///////////////////
        this.GetGridData();
        this.show = true;
      }
      else {
        this.commonService.valueSet("create");
        this.show = false;
        this.toastrService.danger(returns.message, "Message");
      }
    });
  }

  private reset() {
    this.getMaster();
  }

  beforeSave() {

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

  loadFromDateShow: Date = new Date();
  loadToDateShow: Date = new Date();
  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    // private ProducttransferService: ProducttransferService,
    // private productrequisitionService: ProductrequisitionService,
    private productService: ProductService,
    private comboService: CommoncomboService,

    // private bomService: BomService,
    private datePipe: DatePipe,
    // private productionServiceService: ProductionServiceService,
    private productionPlanService: ProductionPlanService,
    private productuomService: ProductuomService
  ) {
    this.loadFromDateShow.setDate(this.loadFromDateShow.getDate() - 1);
    this.commonService.valueSet("showlist");
    this.LoadDropdown();
    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 70,
      }, /// Dont Change
      {
        headerName: "Transfer No.",
        field: "transferNoteNo",
        width: 140,
      },
      {
        headerName: "Date",
        field: "transferDate",
        width: 140,
      },
      {
        headerName: "Batch No.",
        field: "batchNo",
        width: 120,
      },
      {
        headerName: "Batch Type",
        field: "batchTypeName",
        width: 140,
      },
      {
        headerName: "Product Name",
        field: "sProductName",
        width: 200,
      },
      {
        headerName: "Pack Size",
        field: "sPackSize",
        width: 120,
      },
      {
        headerName: "Qty. (Box)",
        field: "noOfBox",
        width: 110,
      },
      {
        headerName: "Qty. (Pcs)",
        field: "transferQty",
        width: 130,
      },
      {
        headerName: "Batch Status",
        field: "batchStatus",
        width: 140,
      },
      {
        headerName: "Issued By",
        field: "transferIssuedBy",
        width: 150,
      },
      {
        headerName: "Remarks",
        field: "remarks",
        width: 150,
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
    this.getBatchTypebyId(0);
  }

  LoadDropdown() {

    this.getAllBatch();
    this.getProductUOMList();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.GetGridData();
  }
  GetGridData() {
    this.productionPlanService.GetTransferNoteById(0, this.loadFromDateShow, this.loadToDateShow).subscribe((data: any) => {
      //debugger
      if (data.success) {
        this.rowData = data.data;
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
      // this.agEdit(event);
      // this.show = false;
      this.show = true;
      this.toastrService.info("Not Allowed", "Message");
    } else if (data == "view") {
      // this.agEdit(event);
      // this.show = false;
      // this.disabled = true;
      this.show = true;
      this.toastrService.info("Not Allowed", "Message");
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      this.agDelete(event);
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  private agEdit(event) {
    //debugger
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
      var tnId = event.node.data.productTransferId;
      this.master.productionPlanSelected = {
        id: event.node.data.productionPlanId,
        name: event.node.data.batchNo
      }
      this.productionPlanService.GetTransferNoteById(tnId).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];
        }
      })
      this.ngOnInit();
    }
  }

  private agReport(event) {
    //this.toastrService.info("Print button clicked", "Message");
    //this.getReportData(event.data.rmRequisitonId);
    this.generateCrReport("Pdf", event.data.productTransferId);
  }

  private agDelete(event) {
    var Id = event.node.data.productTransferId;
    if (confirm('Are you sure?')) {
      this.productionPlanService.DeleteTransferNoteById(Id).subscribe((data: any) => {
        if (data.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          this.GetGridData();
        }
        else {
          this.toastrService.danger(data.message, "Message");
        }
      })
    }
  }

  percentCompleted: number = 0;
  getTransferQtyInPcs() {
    this.percentCompleted = 0;
    this.master.transferQty = this.master.packSizeForPM * this.master.noOfBox;
    this.master.remainQty = this.master.stdBatchSize - (this.master.transfered + this.master.transferQty);

    this.percentCompleted = this.commonService.roundWithDecimalPoint(((this.master.transfered + this.master.transferQty) / this.master.stdBatchSize * 100), 2);

    if (this.master.remainQty < 0) {
      this.toastrService.danger("Transfer Qty. is greater than remaining Qty.", "Warning");
    }
  }
  SecondaryProductList = [];
  SecondaryProductListall = [];
  SecondaryProductSelected: any = {};
  stdBoxQty: number = 0;
  public getBatchDetails(event) {

    //console.log(event);
    this.SecondaryProductSelected = null;
    this.master.SecndproductWiseSpecificationId = null;
    this.master.packSizeForPM = 0;

    this.master.stdBatchSize = event.stdBatchSize;
    this.master.batchWeight = event.batchWeight;
    this.master.batchWeightUOM = event.batchWeightUOM;
    this.master.weightPerPack = event.weightPerPack;
    this.master.weightPerPackUOM = event.weightPerPackUOM;
    this.master.sWeightPerPack = event.sWeightPerPack;
    this.master.productCode = event.productCode;
    this.master.uomName = event.uomName;
    this.master.productName = event.productName + " " + event.packSize;
    this.master.packSizeForPM = event.packSizeForPM;
    this.master.batchTypeName = event.batchTypeName;
    this.master.productWiseSpecificationId = event.productWiseSpecificationId;
    this.master.shelfLife = event.shelfLife;
    this.master.manufacturingDate = event.manufacturingDate;
    this.master.ExpireDate = event.ExpireDate;
    this.master.mfgDate = event.mfgDate;
    this.master.expDate = event.expDate;
    this.master.productId = event.productId;
    this.master.transfered = event.transfered;
    //this.master.noOfBox = this.commonService.round((event.stdBatchSize) / (event.packSizeForPM));
    this.stdBoxQty = this.commonService.round((event.stdBatchSize) / (event.packSizeForPM));

    this.productService.getTypeWiseProducts(event.productId, 0).subscribe((returns: any) => {
      //debugger
      let data = returns.data.filter((val: any) => val.packSize != "");
      this.SecondaryProductList = data.map((val: any) => ({
        id: val.productWiseSpecificationId,
        // name: val.productName,
        name: val.packSize,
        uomId: val.uomId,
        uomName: val.uomName,
        productId: val.productId,
        packSize: val.packSize,
        qtyPerPack: val.qtyPerPack,
        sWeightPerPack: val.sWeightPerPack,
      }));
       this.SecondaryProductListall = this.SecondaryProductList ;
         this.batchwiseProductlist();
    });
    this.getTransferQtyInPcs();
  
  }
  productionPlanList = [];
  public getAllBatch() {
    this.productionPlanService.GetTransferedProductionProcessBatch(0).subscribe((data: any) => {
      if (data.success) {
        this.productionPlanList = data.data.map((val: any) => ({
          id: val.productionPlanId,
          name: val.batchNo + " (" + val.bomName + ")",
          productName: val.productName,
          productWiseSpecificationId: val.productWiseSpecificationId,
          batchWeight: val.batchWeight,
          batchWeightUOM: val.batchWeightUOM,
          batchNo: val.batchNo,
          stdBatchSize: val.stdBatchSize,
          planDate: val.planDate,
          packSize: val.packSize,
          productCode: val.productCode,
          weightPerPack: val.weightPerPack,
          weightPerPackUOM: val.weightPerPackUOM,
          sWeightPerPack: val.weightPerPack,
          finalOutputQty: val.finalOutputQty,
          uomName: val.uomName,
          packSizeForPM: val.packSizeForPM,
          batchTypeName: val.batchTypeName,
          shelfLife: val.shelfLife,
          manufacturingDate: val.manufacturingDate,
          ExpireDate: val.ExpireDate,
          mfgDate: val.mfgDate,
          expDate: val.expDate,
          productId: val.productId,
          transfered: val.transfered,
        }));
      }
    });
  }
  public apiUrl = "";
  generateCrReport(reportFormat: any, productTransferId: any) {
    //debugger;

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `ProductionReport/GetTransferNoteReportById?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&productTransferId=${productTransferId}`;

    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        console.log(res);
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }
  public getMaxNo() {
    this.productionPlanService.GetMaxTransferNoteNumber(this.datePipe.transform(this.master.transferDate, "yyyy-MM-dd")).subscribe((returns: any) => {
      if (returns.success) {
        this.master.transferNoteNo = returns.data[0].MaxNo;
      }
    })
  }

  public batchwiseProductlist()
  {
   debugger;
    let searchText="Sample";
        let searchTextE="Export";

    if(this.master.batchTypeName=="Sample")
      {
        
        this.SecondaryProductList=this.SecondaryProductListall.filter(x=>x.name.toLowerCase().includes(searchText.toLowerCase()));
      }
      else if(this.master.batchTypeName=="Export")
      {
       
        this.SecondaryProductList=this.SecondaryProductListall.filter(x=>x.name.toLowerCase().includes(searchTextE.toLowerCase()));
      }
      else
      {

        this.SecondaryProductList=this.SecondaryProductListall.filter(x=>!x.name.toLowerCase().includes(searchText.toLowerCase())&&!x.name.toLowerCase().includes(searchTextE.toLowerCase()));
      
      }
   

  }

  productImageFile: string;
  getProductImage(imageUrl: string) {
    this.productImageFile = "";

  }
  validationForMasterSave(): boolean {

    return true;
  }
  public roundToDigit(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };
  public calculateExpiryDate() {
    if (this.master.manufacturingDate && this.master.shelfLife !== null) {
      var manufactureDate = new Date(this.master.manufacturingDate);
      var ExpireDate = new Date(manufactureDate.setMonth(manufactureDate.getMonth() + this.master.shelfLife));
      this.master.ExpireDate = ExpireDate;
    } else {
      this.master.ExpireDate = null;
    }
  }



  @Output() myEvent = new EventEmitter();

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
}

