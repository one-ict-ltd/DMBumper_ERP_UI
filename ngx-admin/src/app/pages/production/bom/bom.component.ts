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
// import { BranchService } from "app/services/erpsetting/branch.service";
// import { from } from "rxjs";
// import { Console } from "node:console";
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
  selector: "ngx-bom",
  templateUrl: "./bom.component.html",
  styleUrls: ["./bom.component.scss"],
})
export class BomComponent implements OnInit {
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
  ngOnInit() {
    ////debugger;
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "BOM";
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
  materialsTypeSelected: {};
  batchWeightUOMSelected: {};
  WeightPerPackUOMSelected: {};
  bomForSelected: {};
  master: {
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

    this.qty = 1;
    this.price = 0;
    this.wastage = 0;
    this.grandTotalQty = 0;
    this.uomName = "";
    this.getMaxNo();
  }

  // bomDetails

  bomDetailsId: number = 0;
  pendingbomId: number = 0;
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
    this.bomService.GetBomMasterIsExistOrNot(this.master.bomProductWiseSpecificationId, this.master.materialsType).subscribe((data: any) => {
      debugger
      if (data.success) {
        if (data.data[0].status == 0) {
          this.toastrService.warning("BOM is Exist.Please inactive previous BOM", "Message");

        }
        else {
          debugger
          var button = this.commonService.buttonClicked;
          this.beforeSave();
          //console.log(this.master);
          this.master.bomDate = this.commonService.DateFormat(this.master.bomDate);
          this.bomService.SaveBomMaster(this.master).subscribe((returns: any) => {
            if (returns.success) {
              if (button == "update") {
                this.toastrService.success(this.commonService.updatedmsg, "Message");
              } else {
                this.toastrService.success(this.commonService.successmsg, "Message");
              }

              this.getMaster(); //////////////Grid Refresh ///////////////////
              this.bomService.GetBomMasterById(0).subscribe((data: any) => {
                if (data.success) {
                  this.rowData = data.data;
                }
              });
            }
          });
        }
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
    this.LoadDropdown();
    this.loadTypeList();
    this.loadPotencyEffectList();
    this.getbomForList(0);
    this.getAllprocessGroups();
    this.getProductUOMList();
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
        headerName: "BOM Date",
        field: "bomDate",
        width: 130,
      },
      {
        headerName: "BOM No.",
        field: "bomNo",
        width: 140,
      },
      {
        headerName: "Material Type",
        field: "materialsType",
        width: 140,
      },
      {
        headerName: "Bom Product Name",
        field: "productName",
        width: 250,
      },
      {
        headerName: "Bom Group Name",
        field: "groupName",
        width: 230,
      },
      {
        headerName: "Bom Type",
        field: "bomType",
        width: 150,
      },
      {
        headerName: "Description",
        field: "bomDescription",
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
    this.getBomMasterProductSpec();
    //this.getBomDetailsProductSpec();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.bomService.GetBomMasterById(0).subscribe((data: any) => {
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
      this.bomService.GetBomMasterIsApproveOrNot(event.node.data.pendingbomId, event.node.data.materialsType).subscribe((data: any) => {
        debugger
        if (data.success) {
          if (data.data[0].status == 0) {
            this.toastrService.warning("BOM is Approved. you can not edit it", "Message");
            this.commonService.valueSet("showlist");
            return;
          }
          else {
            this.agEdit(event);
            this.show = false;
          }
        }
      });
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
              this.qty = 0;
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
    //this.toastrService.info("Print button clicked", "Message");
    debugger
    this.generateReport("print", event.data.pendingbomId);
  }

  private agDelete(event) {
    // this.master.pendingbomId = event.node.data.pendingbomId;
    // this.bomService
    //   .DeleteBomMasterById(this.master.pendingbomId)
    //   .subscribe((returns: any) => {
    //     if (returns.success) {
    //       this.toastrService.success(this.commonService.deletedmsg, "Message");

    //       this.bomService.GetBomMasterById(0).subscribe((data: any) => {
    //         if (data.success) {
    //           this.rowData = data.data;
    //         }
    //       });
    //     }
    //   });
    this.toastrService.warning("Delete is not allowed", "Message");
  }



  public validateQty() {
    if (this.qty == null ? 0 : this.qty < 0) this.master.bomQty = 0;
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
    this.isRound = this.detailsProductSpecSelected["isRound"];
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
    if (this.master.bomProductWiseSpecificationId == null) {
      this.toastrService.warning("Please BOM Product.", "Message");
      return false;
    }
    if (this.master.bomName == null || this.master.bomName == "") {
      this.toastrService.warning("Please input BOM Name", "Message");
      return false;
    }
    if (this.master.bomQty == null || this.master.bomQty == 0) {
      this.toastrService.warning("Please input BOM Qty.", "Message");
      return false;
    }
    if (
      this.master.pendinglstDetailsViewModel.length == 0 ||
      this.master.pendinglstDetailsViewModel == null
    ) {
      this.toastrService.warning(
        "Please add at least one BOM Details",
        "Message"
      );
      return false;
    }

    return true;
  }

  public addToDetailsGrid() {
    debugger;
    if (
      this.detailsProductSpecSelected == null ||
      this.detailsProductSpecSelected["id"] == null ||
      this.detailsProductSpecSelected["id"] == undefined
    ) {
      this.toastrService.warning("Please select a Details Product", "Message");
      return;
    }
    // if (this.price == 0 || this.price == null) {
    //   this.toastrService.warning("Price is zero.", "Message");
    //   return;
    // }
    if (this.qty == 0 || this.qty == null) {
      this.toastrService.warning("Quantity is zero.", "Message");
      return;
    }
    if (this.wastage < 0 || this.qty == null) {
      this.toastrService.warning("Waste is zero.", "Message");
      return;
    }
    if (this.selectedpotencyEffect == null) {
      this.toastrService.warning("select Potency Effect", "Message");
      return;
    }
    if (this.master.bomForId == null) {
      this.toastrService.warning("select Bom For", "Message");
      return;
    }
    if (this.wastage == null) { this.wastage = 0; }
    this.totalQty = 0;
    let waste = this.qty * (this.wastage / 100);

    if (this.isRound == 1) {
      this.totalQty = this.commonService.round(this.qty + waste);
    }
    else {
      this.totalQty = this.qty + waste;
    }
    this.totalPrice = this.totalQty * (this.price == null ? 0 : this.price);

    let elements = {
      bomDetailsId: 0,
      pendingbomId: 0,
      bomDetailsProductWiseSpecificationId:
        this.bomDetailsProductWiseSpecificationId,
      bomDetailsProductSpecName: this.productName,
      uomName: this.uomName,
      qty: this.qty,
      price: this.price,
      wastage: this.wastage,
      totalQty: this.totalQty,
      totalPrice: this.totalPrice,
      isActive: 1,
      isSelect: 1,
      imageFile: "", // this.productImageFile,
      potencyEffect: this.selectedpotencyEffect["id"],
      potencyEffectName: this.selectedpotencyEffect["name"],
      bomForId: this.master.bomForId,
      bomForName: this.bomForSelected["name"]
    };
    this.master.pendinglstDetailsViewModel.push(elements);
    this.calculateGrandTotal();
    this.detailsProductSpecSelected = null;
    this.uomName = null;
    this.qty = null;
    this.wastage = null;
    //this.selectedpotencyEffect = null;

  }

  public calculateTotal(index: any) {
    let totalPrice = 0.0;
    let totalQty = 0.0;

    let qty =
      this.master.pendinglstDetailsViewModel[index].qty == ""
        ? 0.0
        : this.master.pendinglstDetailsViewModel[index].qty;
    let waste =
      this.master.pendinglstDetailsViewModel[index].wastage == null
        ? 0.0
        : this.master.pendinglstDetailsViewModel[index].wastage;
    let price =
      this.master.pendinglstDetailsViewModel[index].price == ""
        ? 0.0
        : this.master.pendinglstDetailsViewModel[index].price;

    let wasteQty = 0.0;
    wasteQty = qty * (waste / 100);
    totalQty = qty + wasteQty;

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

  typeList: any = [];

  loadTypeList() {
    this.typeList = [
      {
        id: 1,
        name: "Raw Materials(RM)",
      },
      {
        id: 2,
        name: "Packing Materials(PM)",
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

  public getType(id) {
    debugger
    if (id == 1) {
      console.log(id)
      this.master.materialsType = null;
      this.master.materialsType = "raw";
      this.getBomDetailsProductSpec(5)
      this.areaShow = false;
      this.master.packSizeForPM = 0;
    }
    if (id == 2) {
      this.master.materialsType = null;
      this.master.materialsType = "packing";
      this.getBomDetailsProductSpec(6)
      this.areaShow = true;
    }

  }
  processGroupList = [];
  getAllprocessGroups() {
    debugger
    this.productionProcessService.GetProcessHeadGroupMasterById(0).subscribe((data: any) => {
      if (data.success) {
        // this.rowData=data.data;
        this.processGroupList = data.data.map((val: any) => ({
          id: val.phGroupMasterId,
          name: val.groupName,
        }));

      }
    })

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
}
