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


@Component({
  selector: 'ngx-requisition-for-pm',
  templateUrl: './requisition-for-pm.component.html',
  styleUrls: ['./requisition-for-pm.component.scss']
})
export class RequisitionForPMComponent implements OnInit {
  loadFromDateShow: Date = new Date();
  loadToDateShow: Date = new Date();
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

  ngOnInit() {

    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Requisition For Packing Materials (PM)";
  public rptHeader = "PM Requisition";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();

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
  companyList: [];
  companySelected: {};
  sbuList: [];
  sbuSelected: {};
  bomProductSpecList: {};
  bomProductSpecSelected: {};
  productionPlanSelected: {};
  bomForSelected: {};
  master: {
    rmRequisitonId: number;
    bomId: number;
    bomNo: string;
    bomName: string;
    productName: string;
    reqNo: string;
    reqDate: Date;
    uomName: string;
    bomProductWiseSpecificationId: number;
    bomDescription: string;
    bomTotalCost: number;
    companyId: number;
    sbuId: number;
    // isActive: number;
    // isDelete: number;
    bomQty: number;
    //total: number;
    lstDetailsViewModel: any[];
    typeId: number;
    typeSelected: {};
    remarks: string;
    status: number;
    type: string;
    bomMasterProductWiseSpecificationId: number;
    batchRatio: number;
    stdBatchSize: number;
    chargeNo: string;
    bomForId: number;
    batchWeight: number;
  };
  public getMaster() {
    this.master = {
      rmRequisitonId: 0,
      reqNo: "",
      reqDate: new Date(),
      bomQty: 0,
      remarks: "",
      status: 1,
      type: "packing",
      bomId: 0,
      bomMasterProductWiseSpecificationId: 0,

      uomName: "",
      typeId: 0,

      bomNo: "",
      bomName: "",
      productName: "",

      bomProductWiseSpecificationId: 0,
      bomDescription: "",
      bomTotalCost: 0,

      companyId: null,
      sbuId: null,
      lstDetailsViewModel: [],
      typeSelected: null,
      batchRatio: 0,
      stdBatchSize: 0,
      chargeNo: null,
      bomForId: 0,
      batchWeight: 0
    };
    this.companySelected = null;
    this.sbuSelected = null;
    this.bomProductSpecSelected = null;
    this.detailsProductSpecSelected = null;
    this.productionPlanSelected = null;
    this.bomProductList = [];
    this.listData = [];
    this.bomProductSpecSelected = {};
    this.bomForSelected = {};
    this.qty = 1;
    this.price = 0;
    this.wastage = 0;
    this.grandTotalQty = 0;
    this.uomName = "";
    this.bomForList = [];
    this.getMaxNo();
    this.LoadDropdown();
    this.loadTypeList();
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

  productionPlanList = [];
  public getAllBatch() {
    this.productionPlanService.GetProductionPlanWithType(0, 'packing').subscribe((data: any) => {
      if (data.success) {
        this.productionPlanList = data.data.map((val: any) => ({
          id: val.productionPlanId,
          name: val.batchNo,
        }));

      }
    });
  }
  bomForList = [];
  getBatchWiseBOMDetails(planId: any) {
    debugger
    this.bomProductList = [];
    this.bomProductSpecSelected = {};
    this.master.bomId = 0;
    this.master.bomQty = 0;
    this.master.batchWeight = 0;
    this.listData = []
    // this.master.bomMasterProductWiseSpecificationId =0;
    this.master.bomMasterProductWiseSpecificationId = 0;
    this.productionPlanService.GetProductionPlanForRequisitionWithType(planId, 'packing').subscribe((data: any) => {
      if (data.success) {
        let bomDetails = data.data[0];
        console.log(bomDetails);
        this.master.bomQty = data.data[0].bomQty;
        this.master.batchWeight = data.data[0].batchWeight;
        this.master.batchRatio = data.data[0].batchRatio;
        this.master.stdBatchSize = data.data[0].stdBatchSize;
        this.master.chargeNo = data.data[0].chargeNo;
        this.master.bomMasterProductWiseSpecificationId = data.data[0].productWiseSpecificationId;
        this.bomProductList = [{
          id: data.data[0].bomId,
          name: data.data[0].productName,
          sepecicationId: data.data[0].productWiseSpecificationId
        }];

        this.bomProductSpecSelected = {
          id: data.data[0].bomId,
          name: data.data[0].productName,
          sepecicationId: data.data[0].productWiseSpecificationId
        }
        this.master.bomId = data.data[0].bomId;
        //this.getBomProductSpecDetails(this.master.bomId)

        this.bomForList = [];
        this.master.bomForId = 0;
        this.bomForSelected = {};
        this.bomService.GetBOMForListFromBOM(planId, 'packing').subscribe((data: any) => {
          if (data.success) {
            this.bomForList = data.data.map((val: any) => ({
              id: val.bomForId,
              name: val.bomForType,
            }));
          }
        });
      }
    });
  }
  /////////////////////////////// CRUD ///////////////////////////////////////////

  private save() {
    debugger;


    let count: number = 0;
    this.listData.forEach((e) => {
      if (e.isSelect == 1) count++;
    });

    if (count == 0) {
      this.toastrService.warning("Please select MATERIALS DETAILS!", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    this.getSelectedList();
    var button = this.commonService.buttonClicked;
    // if (button == "save") {
    //   this.getSelectedList();
    // }
    // else {
    //   this.master.lstDetailsViewModel = this.listData;
    // }

    console.log(this.master);
    this.show = true;
    this.master.reqDate = this.commonService.DateFormat(this.master.reqDate);
    this.productionServiceService.SaveRMRequisitionMaster(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }

        this.getMaster(); //////////////Grid Refresh ///////////////////
        // this.bomService.GetBomMasterById(0).subscribe((data: any) => {
        //   if (data.success) {
        //     this.rowData = data.data;
        //   }
        // });
        this.productionServiceService.GetRMRequisitionMasterByIdWithDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)
          , 0).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data.filter(x => x.type == "packing");
            }
          });
      }
    });
  }

  private reset() {
    this.getMaster();
  }

  getSelectedList() {

    this.listData.forEach((element) => {
      if (element.isSelect == 1) {
        var obj = {
          requisitionDetailId: 0,
          productWiseSpecificationId: element.productWiseSpecificationId,
          qty: element.qty,
          totalQty: element.totalQty,
        }
        this.master.lstDetailsViewModel.push(obj);
      }

    })
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
    private productionServiceService: ProductionServiceService,
    private productionPlanService: ProductionPlanService

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
        headerName: "Requisition No.",
        field: "reqNo",
        width: 200,
      },
      {
        headerName: "Req. Date",
        field: "reqDate",
        width: 130,
      },
      // {
      //   headerName: "BOM No.",
      //   field: "bomNo",
      //   width: 150,
      // },
      // {
      //   headerName: "Bom Name",
      //   field: "bomName",
      //   width: 250,
      // },
      {
        headerName: "BOM Product Name",
        field: "productName",
        width: 200,
      },
      {
        headerName: "Batch No.",
        field: "batchNo",
        width: 200,
      },
      {
        headerName: "BOM For",
        field: "bomForType",
        width: 200,
      },
      // {
      //   headerName: "Description",
      //   field: "bomDescription",
      //   width: 150,
      // },
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
    //this.LoadDropdown();
    this.loadFromDateShow.setDate(this.loadFromDateShow.getDate() - 1);
  }

  LoadDropdown() {
    //this.getCompany();
    // this.getBomMasterProductSpec();
    this.getAllBatch();
    //this.getBomDetailsProductSpec();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.GetGridData();

  }
  GetGridData() {
    this.productionServiceService.GetRMRequisitionMasterByIdWithDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)
      , 0).subscribe((data: any) => {
        debugger
        if (data.success) {
          this.rowData = data.data.filter(x => x.type == "packing");
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
      this.agEdit(event);
      this.show = false;
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
    debugger
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
      var rmId = event.node.data.rmRequisitonId;


      this.productionServiceService.GetRMRequisitionMasterById(rmId).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];
          this.productionPlanSelected = {
            id: data.data[0].productionPlanId,
            name: data.data[0].batchNo
          }
          this.bomProductSpecSelected = {
            id: data.data[0].bomId,
            name: data.data[0].productName,
            sepecicationId: data.data[0].bomProductWiseSpecificationId,
            type: data.data[0].type,
          }
          this.bomForSelected = {
            id: data.data[0].bomForId,
            name: data.data[0].bomForType,
          }
          this.productionServiceService.GetRMRequisitionDetialsByMasterId(rmId).subscribe((data: any) => {
            this.listData = data.data;
            this.listData.forEach((row) => {
              row.qty = this.roundToDigit(row.qty, 4);

            });
          })
        }
      })
      this.ngOnInit();
    }
  }

  private agReport(event) {
    //this.toastrService.info("Print button clicked", "Message");
    this.getReportData(event.data.rmRequisitonId)
    //this.generateReport("print", event.data.rmRequisitonId);
  }

  private agDelete(event) {
    var rmId = event.node.data.rmRequisitonId;
    if (confirm('Are you sure?')) {
      this.productionServiceService.DeleteRMRequisitionById(rmId).subscribe((data: any) => {
        if (data.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          this.productionServiceService.GetRMRequisitionMasterByIdWithDate(this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)
            , 0).subscribe((data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            });
        }
        else {
          this.toastrService.warning(data.message, "Message");
        }
      })
    }
  }

  getCompany() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyList = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  getSBU(companyId) {
    //this.master.branchSelected = {};
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.sbuList = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }

  public validateQty() {
    if (this.qty == null ? 0 : this.qty < 0) this.master.bomQty = 0;
  }

  public getMaxNo() {
    this.productionServiceService.GetMaxPMRequisitionMasterNumber(this.datePipe.transform(this.master.reqDate, "yyyy-MM-dd")).subscribe((returns: any) => {
      if (returns.success) {
        this.master.reqNo = returns.data[0].MaxNo;
      }
    })
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
  public listData = [];
  public initialListData = [];
  public getBomProductSpecDetails(bomForId: any) {
    this.productionServiceService.GetProductSpecificationByBomIdFromBomDetails(this.master.bomId, bomForId).subscribe((returns: any) => {
      if (returns.success) {

        // returns.data.forEach((a) => (a.qty = a.qty * this.master.bomQty));
        // returns.data.forEach((a) => (a.totalQty = a.totalQty * this.master.bomQty));
        returns.data.forEach((a) => (a.qty = this.roundToDigit(a.qty * this.master.batchRatio, 4)));
        returns.data.forEach((a) => (a.totalQty = this.roundToDigit(a.totalQty * this.master.batchRatio, 4)));
        this.listData = returns.data;
      }
    });
    //this.getProductImage(this.master.productSpecSelected["imageUrl"]);
    // this.master.uomName = this.bomProductSpecSelected["uomName"];
  }

  public getProductSpecDetails() {
    //this.getProductImage(this.master.productSpecSelected["imageUrl"]);
    this.price = this.detailsProductSpecSelected["price"];
    this.uomName = this.detailsProductSpecSelected["uomName"];
    this.productName = this.detailsProductSpecSelected["name"];
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
        }));
      });
  }
  public bomProductList: any = [];
  public getBomMasterProductSpec() {


    this.bomService.GetBomMasterById(0).subscribe((data: any) => {
      if (data.success) {
        console.log("get data:====================================", data.data);
        //this.rowData = data.data;
        this.bomProductList = data.data.map((val: any) => ({
          id: val.bomId,
          name: val.productName,
          // uomId: val.uomId,
          // uomName: val.uomName,
          // productId: val.productId,
          // price: val.price,
          // imageUrl: val.imageUrl,
          sepecicationId: val.bomProductWiseSpecificationId,
          type: val.meterialsType,
        }));

      }
      console.log("Bom Product list:====================", this.bomProductList);
      this.bomProductList = this.bomProductList.filter(x => x.type == "packing");
      console.log("Bom Product list:====================", this.bomProductList);

    });

  }

  validationForMasterSave(): boolean {
    // if (this.master.bomProductWiseSpecificationId == null) {
    //   this.toastrService.warning("Please BOM Product.", "Message");
    //   return false;
    // }
    // if (this.master.bomName == null || this.master.bomName == "") {
    //   this.toastrService.warning("Please input BOM Name", "Message");
    //   return false;
    // }
    // if (this.master.bomQty == null || this.master.bomQty == 0) {
    //   this.toastrService.warning("Please input BOM Qty.", "Message");
    //   return false;
    // }
    if (
      this.master.lstDetailsViewModel.length == 0 ||
      this.master.lstDetailsViewModel == null
    ) {
      this.toastrService.warning(
        "Please add at least one BOM Details",
        "Message"
      );
      return false;
    }

    return true;
  }



  public calculateTotal(index: any) {
    debugger

    var batchRatio = this.master.batchRatio;
    this.productionServiceService.GetProductSpecificationByBomIdFromBomDetails(this.master.bomId, this.master.bomForId).subscribe((returns: any) => {
      if (returns.success) {
        this.listData = returns.data;
        // this.listData.forEach((row) => {
        //   let newqty = row.qty * qty;
        //   row.qty = row.qty * qty;
        //   row.totalQty = this.roundToDigit(row.totalQty * newqty, 2)

        // });
        this.listData.forEach((row) => {
          let newqty = row.qty * batchRatio;
          row.qty = this.roundToDigit(row.qty * batchRatio, 4);
          row.totalQty = this.roundToDigit(row.totalQty * newqty, 4)

        });
        console.log(this.listData);
      }
    });
  }
  public roundToDigit(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };


  // calculateGrandTotal() {
  //   this.master.bomTotalCost = 0.0;
  //   this.grandTotalQty = 0.0;
  //   this.master.lstDetailsViewModel.forEach((row) => {
  //     this.master.bomTotalCost += row.totalPrice == "" ? 0.0 : row.totalPrice;
  //     this.grandTotalQty += row.totalQty == "" ? 0.0 : row.totalQty;
  //   });
  // }

  // public refeshDetails() {
  //   this.master.lstDetailsViewModel = [];
  //   this.toastrService.warning(this.commonService.warningmsg, "Message");
  // }

  @Output() myEvent = new EventEmitter();

  // public deleteRow(state, action) {
  //   ////debugger;
  //   const nodeIdToRemove = action.payload;
  //   const filteredData = state.rowData.filter(
  //     (node) => node.id !== nodeIdToRemove
  //   );
  //   return {
  //     ...state,
  //     rowData: [...filteredData],
  //   };
  // }

  // public deleteDetails(index: any) {
  //   let bomDetailsId = this.master.lstDetailsViewModel[index].bomDetailsId;
  //   this.selectedRow = this.master.lstDetailsViewModel[index];

  //   //if (this.selectedRow.helpDetailId > 0) { }

  //   if (bomDetailsId > 0) {
  //     this.bomService
  //       .DeleteBomDetailsById(bomDetailsId)
  //       .subscribe((returns: any) => {
  //         if (returns.success) {
  //           this.master.lstDetailsViewModel.splice(index, 1);
  //           this.toastrService.success(
  //             this.commonService.deletedmsg,
  //             "Message"
  //           );
  //         } else {
  //           this.toastrService.danger("Data not Delete!", "Message");
  //         }
  //       });
  //   } else {
  //     this.master.lstDetailsViewModel.splice(index, 1);
  //     this.toastrService.success(this.commonService.deletedmsg, "Message");
  //   }
  // }

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
    "Details Product Name",
    "Qty.",
    "Waste (%)",
    "Total Qty.",
    "UOM",
  ];
  public apiUrl = "";
  public htmlBodyData: string = "";


  public bodyDatashow: any = [];

  datalength: number;
  requisitionNo: string = "";
  reuisitionDate: Date = new Date();
  stdBatchSize: number = 0;
  batchNo: string = "";
  pmProductName: string = "";
  remarks = "";
  bodyData = [];
  headerData = [];
  params = [];
  gTotal: number = 0.00;
  RequisitionBy: string = "";
  public pmRequisitinDetailsData = [];
  public productNameforReport: string = '';
  public BatchSize: number;
  public batchRatio: number;
  public bomForType: string = "";
  public batchWeight: number;
  public batchWeightUOMname: string = "";

  public getReportData(rmId) {

    this.productionServiceService.GetRMRequisitionMasterById(rmId).subscribe((data: any) => {
      if (data.success) {
        this.master = data.data[0];
        // console.log("report PM requisiton Data:======================",data.data[0])
        this.batchNo = data.data[0].batchNo;
        this.pmProductName = data.data[0].productName;
        this.requisitionNo = data.data[0].reqNo;
        this.reuisitionDate = data.data[0].reqDate;
        this.stdBatchSize = data.data[0].stdBatchSize;
        this.batchWeight = data.data[0].batchWeight;
        this.batchWeightUOMname = data.data[0].batchWeightUOMname;
        this.batchRatio = data.data[0].batchRatio;
        debugger
        this.bomForType = data.data[0].bomForType;
        this.RequisitionBy = data.data[0].RequisitionBy;

        this.productionServiceService.GetRMRequisitionDetialsByMasterId(rmId).subscribe((data: any) => {
          if (data.success) {
            this.pmRequisitinDetailsData = data.data;

            console.log("report PM requisiton Data Detail:======================", data.data);
            var fileName = this.rptHeader + ".pdf";
            const content = document.getElementById("reportHeader");
            this.generateReport("print", fileName, content, this.datalength);
          }
          else {
            this.toastrService.danger("Message", this.commonService.nodatafound);
          }

        })
      }
    })
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
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 60,
          styles: { font: "Meta" },
        });


        autoTable(doc, {
          html: "#body_table1",
          startY: legend.height + 170,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontSize: 11,
            halign: "center",
            valign: "middle",
            fontStyle: "bold",
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          columnStyles: {
            3: { halign: "right" },
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#footer_table",
          //startY: legend.totalheight + 300,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
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
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
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


  /////////////////////////////

  typeList: any = [];

  loadTypeList() {
    this.typeList = [
      {
        id: 1,
        name: "Raw Meterials(RM)",
      },
      {
        id: 2,
        name: "Packing Meterials(PM)",
      },
    ];
  }

  public getType(id) {
    debugger
    if (id == 1) {
      console.log(id)
      this.getBomDetailsProductSpec(3)
    }
    if (id == 2) {
      this.getBomDetailsProductSpec(4)
      console.log(id)
    }

  }
  public getTotalQty(rowIndex: any) {
    debugger
    let qty = this.listData[rowIndex].qty == "" ? 0.0 : this.listData[rowIndex].qty;
    this.listData[rowIndex].totalQty = qty;
  }
}
