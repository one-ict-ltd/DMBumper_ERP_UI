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
import { NavigationStart, Router } from "@angular/router";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { PurchaserequisitionService } from "app/pages/purchase/settings/purchaserequisition.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { ProductService } from "app/services/inventory/product.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { BranchService } from "app/services/erpsetting/branch.service";
import { from } from "rxjs";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { debug } from "console";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { StockinService } from "app/services/inventory/stockin.service";
import { DatePipe } from "@angular/common";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: "ngx-purchaserequisition",
  templateUrl: "./purchaserequisition.component.html",
  styleUrls: ["./purchaserequisition.component.scss"],
})
export class PurchaserequisitionComponent implements OnInit {
  /////////////////////////////
  master: {
    purchaseReqId: number;
    purReqNo: string;
    productReqId: number;
    purchaseReqDate: Date;
    prodReqDate: Date;
    fromWarehouseId: number;
    toWarehouseId: number;
    purpose: string;
    isUrgency: number;
    approvalStatus: number;
    productWiseSpecificationId: number;
    PurchaseReqDetailsId: number;
    prodReqId: number;
    prodReqNo: string;
    prodName: string;
    productName: string;
    uomName: string;
    prodSpecification: string;
    uomId: number;
    isDelete: number;
    isActive: number;
    isPo: number;
    reqQty: number;
    productSelected: [];
    productReqSelected: [];
    lstReqDetailsViewModel: any[];
    fromsbusSelected: {};
    tosbusSelected: {};
    fromsbuId: number;
    tosbuId: number;

    purOrderNo: string;
    partyName: string;
    purchaseOrderDate: string;
    purchaseOrderDetailId: number;
    partyId: number;
    price: number;
    vatAmount: number;
    rateWithVat: number;
    totalAmount: number;
    stockQty: number;
    purchaseOrderQty: number;
    receivedQty: number;
    storeId: number;
    productTypeId: number;
    revisionId: number;
    revisionSelected: [];
  };

  protected options: {};
  protected cd: ChangeDetectorRef;
  showMessages: any = {};
  errors: string[];

  disabled: boolean = false;
  disabledProductType: boolean = false;
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
  showpo: boolean = true;
  vlucherForm: FormGroup;
  submitted: boolean;
  saveupdate: string = "Save";
  gridbutton: string = "";
  name: string;
  description: string;
  selectedRow: any;
  _CompanyId: number = 1;
  isReadonly: boolean = true;
  ngOnInit() {
    //debugger;
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Purchase Requisition";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.getProductReqNo();
      this.show = false;
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
  minDate: Date = new Date();
  maxDate: Date = new Date();
  currentDate: Date = new Date();
  getServerDateTime() {
    debugger;
    //console.log('ServerDateTime');


    let apiUrl = `menu/getServerDateTime`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        debugger;
        //console.log(returns);
        this.currentDate = new Date(returns.data[0].currentDate);

        this.minDate = this.dateService.addDay(new Date(returns.data[0].currentDate), 0);
        this.maxDate = this.dateService.addDay(new Date(returns.data[0].currentDate), 0);


      } else {
        this.currentDate = new Date();
        this.minDate = this.dateService.addDay(new Date(), -0);
        this.maxDate = this.dateService.addDay(new Date(), 0);
      }
    });
  }
  public getMaster() {
    this.master = {
      purchaseReqId: 0,
      purReqNo: "",
      productReqId: 0,
      purchaseReqDate: new Date(),
      prodReqDate: new Date(),
      fromWarehouseId: 0,
      toWarehouseId: 0,
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
      prodSpecification: "",
      uomId: 0,
      isDelete: 0,
      isActive: 1,
      isPo: 0,
      productSelected: null,
      productReqSelected: null,
      lstReqDetailsViewModel: [],
      fromsbusSelected: null,
      tosbusSelected: null,
      fromsbuId: 0,
      tosbuId: 0,

      purOrderNo: "",
      purchaseOrderDate: "",
      partyName: "",
      purchaseOrderDetailId: 0,
      partyId: 0,
      price: 0,
      vatAmount: 0,
      rateWithVat: 0,
      totalAmount: 0,
      stockQty: 0,
      purchaseOrderQty: 0,
      receivedQty: 0,
      storeId: 0,
      productTypeId: 0,
      revisionId: null,
      revisionSelected: null
    };
    this.ToggleDisableProductType();
  }

  public employeeItems = [];
  public companyItems = [];
  public productTypeList = [];
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
    var button = this.commonService.buttonClicked;
    if (this.master.purchaseReqDate == null) {
      this.toastrService.danger("Please enter requisition date", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.purReqNo == null) {
      this.toastrService.danger("Please enter requisition no", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (
      this.master.fromWarehouseId == 0 ||
      this.master.fromWarehouseId == null
    ) {
      this.toastrService.danger("Please  select sbu name", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (
      this.master.lstReqDetailsViewModel.length == 0 ||
      this.master.lstReqDetailsViewModel == null
    ) {
      this.toastrService.danger("Please enter a products", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    // if (!this.master.prodSpecification || this.master.prodSpecification.trim() === "." || this.master.prodSpecification.trim() === "") {
    //   this.toastrService.danger("Please enter a product Specification", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }
    // if (this.master.prodSpecification.length < 10) {
    //   this.toastrService.danger("Please enter exact product specification.", "Message");
    //   return false;
    // }
    if (
      this.master.productTypeId == null || this.master.productTypeId == 0
    ) {
      this.toastrService.danger("Please select a Product Type", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    const itemWithShortSpec = this.master.lstReqDetailsViewModel.find(x =>
      !x.prodSpecification || x.prodSpecification.trim().length < 10
    );

    if (itemWithShortSpec) {
      console.log(`${itemWithShortSpec.productName} has invalid specification, Please put a valid specification.`);
    }

    //console.log(this.master);
    this.purchaserequisitionService
      .savePurchaseRequisition(this.master)
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
          //this.getProductReqNo();
          this.purchaserequisitionService
            .getPurchaseRequisition()
            .subscribe((data: any) => {
              if (data.success) {
                //debugger;
                this.rowData = data.data;
              }
            });
          //////////////Grid Refresh ///////////////////
        }
        else {
          this.show = false;
          this.commonService.valueSet("create");
          this.toastrService.danger(returns.message, "Message");
        }
      });
  }

  private reset() {
    this.getMaster();
    this.getProductReqNo();
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
    private purchaserequisitionService: PurchaserequisitionService,
    private productrequisitionService: ProductrequisitionService,
    private productService: ProductService,
    private salesinvoiceService: SalesinvoiceService,
    private stockinService: StockinService,
    private datePipe: DatePipe,
    protected dateService: NbDateService<Date>,
    private comboService: CommoncomboService
  ) {
    this.commonService.valueSet("showlist");
    // this.getAllProductRequisition();
    this.getProductDetails(0);
    //this.getProductDetails(this.master.prodReqId);
    this.getSBU(0);
    this.getProductType();
    this.getRequisitionRevision();
    // this.getTypeWiseProducts(0,0)

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
      //   headerName: "purchase Req. ID",
      //   field: "purchaseReqId",
      //   filter: "agNumberColumnFilter",
      //   editable: false,
      //   width: 180,
      // },
      {
        headerName: "Purchase Req. No",
        field: "purReqNo",
        width: 180,
      },
      {
        headerName: "Purchase Req. Date",
        field: "purchaseReqDate",
        width: 180,
      },
      {
        headerName: "SBU",
        field: "fromSbuName",
        width: 160,
      },
      {
        headerName: "Department",
        field: "currentDepartment",
        width: 180,
      },
      {
        headerName: "Is Urgency",
        field: "urgency",
        width: 160,
      },
      {
        headerName: "Status",
        field: "IsApproved",
        width: 160,
      },
      // {
      //   headerName: "To SBU",
      //   field: "toSbuName",
      //   width: 160,
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
    this.getProductReqNo();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.purchaserequisitionService
      .getPurchaseRequisition()
      .subscribe((data: any) => {
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
  public async onRowClicked(event) {
    debugger
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    if (data == "edit") {
      let isnFinalised = await this.isPurchaseRequisitionFinalisedByPRId(event.node.data.purchaseReqId);
      if (!isnFinalised) {

        this.agEdit(event);
        this.show = false;
      } else {
        this.commonService.valueSet("showlist");
        this.toastrService.info("This Requisition has been finalized!", "Message");
      }

    } else if (data == "view") {
      this.agEdit(event);
      this.show = false;
      this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      let isnFinalised = await this.isPurchaseRequisitionFinalisedByPRId(event.node.data.purchaseReqId);
      if (!isnFinalised) {
        this.agDelete(event);
      } else {
        this.commonService.valueSet("showlist");
        this.toastrService.info("This Requisition has been finalized!", "Message");
      }

    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  async isPurchaseRequisitionFinalisedByPRId(purchaseReqId: any): Promise<boolean> {
    let isFinalised = false;
    try {
      const data: any = await this.purchaserequisitionService.IsPurchaseRequisitionFinalisedByPRId(purchaseReqId).toPromise();
      if (data.success) {
        let finalizedRequisition = data.data;
        if (finalizedRequisition && finalizedRequisition.length > 0) {
          isFinalised = true;
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    return isFinalised;
  }



  // async  isPurchaseRequisitionFinalisedByPRId(purchaseReqId:any){
  //   let isFinalised= false;
  //   this.purchaserequisitionService.IsPurchaseRequisitionFinalisedByPRId(purchaseReqId).subscribe((data: any) => {
  //     if (data.success) {
  //       let finalizedRequisition = data.data;
  //       if(finalizedRequisition.length>0){
  //         isFinalised= true;
  //       } 
  //     }
  //   });
  //   return isFinalised
  // }

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
      var purchaseReqId = event.node.data.purchaseReqId;
      // this.getAllProductRequisition();

      // this.getTypeWiseProducts(0, 0)
      this.getProductDetails(0);
      //this.getProductDetails(this.master.prodReqId);

      this.getSBU(0);
      this.purchaserequisitionService
        .getPurchaseRequisitionById(purchaseReqId)
        .subscribe((data: any) => {
          if (data.success) {
            //debugger;
            this.master = data.data[0];

            // this.getProductReqNo();

            this.getTypeWiseProducts(0, this.master.productTypeId);
            this.getPurReqDetails(purchaseReqId);

            // this.master.purchaseOrderFromSelect = {
            //   id: data.data[0].employeeId,
            //   name: data.data[0].fullName,
            // };

            this.master.fromsbusSelected = {
              id: data.data[0].fromWarehouseId,
              name: data.data[0].fromSbuName,
            };

            this.master.tosbusSelected = {
              id: data.data[0].toWarehouseId,
              name: data.data[0].toSbuName,
            };

            // this.master.supplierSelected = {
            //   id: data.data[0].supplierId,
            //   name: data.data[0].supplierName,
            // };
          }
        });
      this.ngOnInit();
    }
  }

  private agDelete(event) {
    if (confirm('Are you sure to delete?')) {
      this.master.purchaseReqId = event.node.data.purchaseReqId;
      this.purchaserequisitionService.deletePurchaseReqById(this.master.purchaseReqId).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.purchaserequisitionService.getPurchaseRequisition().subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
          //////////////Grid Refresh ///////////////////
        }
      });
    }
  }

  public sbus = [];
  public fromsbus = [];
  public tosbus = [];
  public getSBU(companyId) {
    //debugger;
    //let factorySbuIds = [32,19]
    // this.comboService.getSBU(companyId).subscribe((returns: any) => {

    //   this.fromsbus = returns.data.filter(x => x.sbuId == 32 || x.sbuId == 19).map((val) => ({
    //     id: val.sbuId,
    //     name: val.sbuName,
    //   }));

    // });
    this.comboService.getSBUForPurchaseRequisition(companyId).subscribe((returns: any) => {

      this.fromsbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));

    });
  }

  public getProductReqNo() {
    //debugger;
    if (this.master.purchaseReqDate == null) {

      this.master.purchaseReqDate = new Date();
      //this.datePipe.transform(this.master.purchaseReqDate, "yyyy-MM-dd")
    }

    this.purchaserequisitionService
      .getPurchaseRequisitionNo(
        this.master.purchaseReqDate.toDateString().substring(4, 15)
      )
      .subscribe((returns: any) => {
        console.log(returns);
        if (returns.success) {
          this.master.purReqNo = returns.data[0].MaxNo;
        }
      });
  }

  public getbyPO() {
    //debugger;
    if (this.showpo == true) {
      this.showpo = false;
    } else {
      this.showpo = true;
    }
  }
  public getProductById(id) {
    this.productService.getProductById(id).subscribe((data: any) => {
      //debugger;
      if (data.success) {
        this.master.uomName = this.master.productSelected["uomName"];
        this.master.uomId = this.data["uomId"];
        this.master.prodSpecification = this.master.productSelected["prodSpecification"];
        this.getCurrentStock();
      }
    });
  }

  public latestRevisionName: string = "";
  public getLastPurchaseOrderDetailsBySpecId(event: any, id: any) {
    debugger;
    this.latestRevisionName = "";
      this.latestRevisionName = event.latestRevisionName;
    if (this.master.productWiseSpecificationId > 0) {
      // this.getCurrentStock();
      this.productService.getLastPurchaseOrderDetailsBySpecId(id).subscribe((data: any) => {
        if (data.success && data.data.length > 0) {
          debugger
          this.master.purOrderNo = data.data[0].purOrderNo;
          this.master.purchaseOrderDetailId = data.data[0].purchaseOrderDetailId;
          this.master.purchaseOrderDate = data.data[0].purchaseOrderDate;
          this.master.partyName = data.data[0].partyName;
          this.master.partyId = data.data[0].partyId;
          this.master.purchaseOrderQty = data.data[0].purchaseOrderQty;
          this.master.price = data.data[0].price;
          this.master.vatAmount = data.data[0].vatAmount;
          this.master.rateWithVat = data.data[0].rateWithVat;
          this.master.totalAmount = data.data[0].totalAmount;
          this.master.prodSpecification = event.prodSpecification;
          //this.master.stockQty =  data.data[0].stockQty;

        } else {
          this.clearProductDetails()
        }
      });
    } else {
      this.master.stockQty = 0;
      this.master.prodSpecification = "";
      this.clearProductDetails()
    }
  }

  public getCurrentStock() {
    if (this.master.productWiseSpecificationId > 0 && this.master.storeId > 0) {
      this.salesinvoiceService
        .GetCurrentStock(
          this.master.storeId,
          this.master.productWiseSpecificationId
        )
        .subscribe((returns: any) => {
          if (returns.success) {
            this.master.stockQty = returns.data[0].length == 0 ? 0 : returns.data[0].currentStock;
          }
        });
      //this.validateInvoiceQty();
    } else {
      this.master.stockQty = 0;
    }
  }

  clearProductDetails() {
    this.master.purOrderNo = "";
    this.master.purchaseOrderDetailId = null;
    this.master.purchaseOrderDate = "";
    this.master.partyName = "";
    this.master.partyId = null;
    this.master.purchaseOrderQty = 0;
    this.master.price = 0;
    this.master.vatAmount = 0;
    this.master.rateWithVat = 0;
    this.master.totalAmount = 0;
    //this.master.stockQty =  0;
  }


  public getStore() {
    this.master.storeId = 0;
    this.stockinService.getStore(this.master.fromWarehouseId, 0).subscribe((returns: any) => {
      if (returns.success) {
        console.log('Store: ', returns.data);
        this.master.storeId = returns.data[0].storeId;
      }
    });
  }




  public getProductType() {
    this.productService.getProductType().subscribe((retuns: any) => {
      if (retuns.success) {
        this.productTypeList = retuns.data.map((val: any) => ({
          id: val.productTypeId,
          name: val.productTypeName,
        }))
      }
    })
  }

  public requisitionRevisionList = [];
   public getRequisitionRevision() {
    this.purchaserequisitionService.getRequisitionRevision().subscribe((retuns: any) => {
      if (retuns.success) {
        this.requisitionRevisionList = retuns.data.map((val: any) => ({
          id: val.revisionId,
          name: val.revisionName,
        }))
      }
    })
  }

  public prodSelected = [];
  public productList = [];

  public getAllProductRequisition() {

    this.productrequisitionService.getAllProductForRequisition().subscribe((returns: any) => {
      this.productList = returns.data.map((val: any) => ({
        id: val.productWiseSpecificationId,
        name: val.productName,
        uomId: val.uomId,
        uomName: val.uomName,
        productId: val.productId,
        prodSpecification: val.productId,
      }));
    });
  }

  public getTypeWiseProducts(productId, productTypeId) {
    debugger
    if (productTypeId && productTypeId > 0) {

      this.productService.getTypeWiseProducts(productId, productTypeId).subscribe((returns: any) => {
        this.productList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uomId: val.uomId,
          uomName: val.uomName,
          productId: val.productId,
          prodSpecification: val.prodSpecification,
          latestRevisionName: val.latestRevisionName,
        }));
      });

    } else {
      this.productList = []
    }

  }

  public getProductDetails(prodReqId) {
    this.productrequisitionService
      .getProductRequisition(prodReqId)
      .subscribe((returns: any) => {
        //debugger
        console.log(returns.data);
        this.prodSelected = returns.data.map((val: any) => ({
          id: val.prodReqId,
          name: val.prodReqNo,
        }));
      });
  }

  public getReqDetails(prodReqId) {
    this.productrequisitionService
      .getProductReqDetailsById(prodReqId)
      .subscribe((returns: any) => {
        console.log(returns);
        if (returns.success) {
          this.master.lstReqDetailsViewModel.push(returns.data);
        }
      });
  }
  public getPurReqDetails(prodReqId) {
    this.purchaserequisitionService
      .getPurchaseReqDetailsbyMasterId(prodReqId)
      .subscribe((returns: any) => {
        console.log(returns);
        //debugger;
        if (returns.success) {
          this.master.lstReqDetailsViewModel = [];
          //  this.lstdetailmodel.push(returns.data);
          for (let i = 0; i < returns.data.length; i++) {
            this.master.lstReqDetailsViewModel.push(returns.data[i]);
          }

          this.ToggleDisableProductType();
        }
      });
  }

  // public lstdetailmodel = [];
  public lstdetailmodelT = [];
  public addDetails() {


    if (this.master.prodReqId > 0) {
      this.productrequisitionService
        .getProductReqDetailsById(this.master.prodReqId)
        .subscribe((returns: any) => {
          //debugger

          this.lstdetailmodelT = returns.data.map((val: any) => ({
            purchaseReqDetailsId: 0,
            productWiseSpecificationId: val.productWiseSpecificationId,

            productId: val.productId,
            productReqDetailsId: val.productReqDetailsId,
            // dropdown: this.prodSelected,
            productName: val.productName,
            uomId: val.uomId, // this.master.productSelected["uomId"],
            uomName: val.uomName,
            reqQty: val.reqQty,
            price: 0,
            isActive: 1,
            prodSpecification: val.prodSpecification,
            receivedQty: val.receivedQty,
            currentStockQty: val.currentStockQty,
            purchaseOrderDetailId: val.purchaseOrderDetailId,

          }));
          for (let i = 0; i < this.lstdetailmodelT.length; i++) {
            if (this.lstdetailmodelT[i].reqQty != 0) {
              this.master.lstReqDetailsViewModel.push(this.lstdetailmodelT[i]);
            }
          }
          this.master.prodReqId = 0;
          //this.lstdetailmodel=this.lstdetailmodelT;
          this.master.productReqSelected = null;
        });
    } else {
      console.log(this.master.productSelected);
      //  this.getProductDetails(this.master.prodReqId);
      if (this.master.prodSpecification == "." || this.master.prodSpecification.trim() === "" || this.master.prodSpecification == null) {
        this.toastrService.danger("Please enter specification.", "Message");
        return false;
      }
      if (this.master.prodSpecification.length < 10) {
        this.toastrService.danger("Please enter exact product specification.", "Message");
        return false;
      }
      var revisionName = "";
      if (this.master.revisionSelected != null) {
        revisionName = this.master.revisionSelected["name"] ;
      }
      
      this.lstdetailmodelT = [];
      let detail = {
        purchaseReqDetailsId: 0,
        productReqDetailsId: 0,
        productId: this.master.productSelected["productId"],
        // dropdown: this.prodSelected,
        productName: this.master.productSelected["name"],
        uomId: this.master.uomId, // this.master.productSelected["uomId"],
        uomName: this.master.productSelected["uomName"],
        reqQty: this.master.reqQty,
        price: 0,
        isActive: 1,

        productWiseSpecificationId: this.master.productWiseSpecificationId,
        revisionId: this.master.revisionId,
        revisionName: revisionName,

        prodSpecification: this.master.prodSpecification,
        receivedQty: this.master.receivedQty,
        currentStockQty: this.master.stockQty,
        purchaseOrderDetailId: this.master.purchaseOrderDetailId,

      };

      // if (this.master.prodSpecification == "" || this.master.prodSpecification == null) {
      //   this.toastrService.danger("Specification can't be empty", "Message");
      //   return;
      // }
      //this.lstdetailmodelT.push(detail);
      if (detail.reqQty != 0) {
        this.master.lstReqDetailsViewModel.push(detail);
        this.master.productSelected = null;
        this.master.revisionSelected = null;
        this.master.reqQty = 0;
        this.master.uomName = "";
        this.master.prodSpecification = "";
        this.master.partyName = "";
        this.master.purOrderNo = "";
        this.master.purchaseOrderDate = "";
        this.master.price = 0;
        this.master.vatAmount = 0;
        this.master.rateWithVat = 0;
        this.master.purchaseOrderQty = 0;
        this.master.receivedQty = 0;
      } else {
        this.toastrService.danger("Quantity is zero.", "Message");
        return;
      }
    }

    this.ToggleDisableProductType();
  }

  public async deleteDetail(index: any) {
    let isnFinalised = await this.isPurchaseRequisitionFinalisedByPRId(this.master.purchaseReqId);
    if (!isnFinalised) {
      if (confirm('Are you sure to delete?')) {
        debugger
        this.selectedRow = this.master.lstReqDetailsViewModel[index];
        let PurchaseReqDetailsId = this.master.lstReqDetailsViewModel[index].PurchaseReqDetailsId;
        if (PurchaseReqDetailsId > 0) {
          this.purchaserequisitionService.deletePurchaseRequisitionDetailsById(PurchaseReqDetailsId)
            .subscribe((returns: any) => {
              if (returns.success) {
                this.toastrService.danger(this.commonService.deletedmsg, "Message");

                this.selectedRow = this.master.lstReqDetailsViewModel[index];
                this.master.lstReqDetailsViewModel.splice(index, 1);
                if (this.selectedRow.helpDetailId > 0) {
                }

                this.ToggleDisableProductType();
              }
            });
        } else {

          this.master.lstReqDetailsViewModel.splice(index, 1);
          if (this.selectedRow.helpDetailId > 0) { }
          this.toastrService.danger(this.commonService.deletedmsg, "Message");
        }


      }
    }
  }
  ToggleDisableProductType() {
    this.disabledProductType = false;
    if (this.master.lstReqDetailsViewModel.length > 0) {
      this.disabledProductType = true;
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

  public tableHeader = ["#", "Product Name", "Product Specification", "Requisition Qty"];
  private agReport(event) {
    // this.generatePurchaseRequisitionReport(event.data.purchaseReqId);

    if (event.data.purchaseReqId != null && event.data.purchaseReqId > 0) {
      this.generateCrReport(event.data.purchaseReqId, 'pdf', event.data.fromSbuName);
    }
  }

  generateCrReport(purchaseReqId: any, reportFormat: any, fromSbuName: any) {
    let apiUrl = '';
    if (fromSbuName == 'Factory') {
      apiUrl = `PurchaseRequisition/GetPurchaseRequisitionRptData?purchaseRequisitionId=${purchaseReqId}&reportFormat=${reportFormat}`;
    }
    else {
      apiUrl = `PurchaseRequisition/GetPurchaseRequisitionRptData?purchaseRequisitionId=${purchaseReqId}&reportFormat=${reportFormat}&isHo=1`;
    }
    //console.log(this.apiUrl);
    this.commonService.GetCrystalReportData(apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }




  public datalength: number;
  public purReqNo = "";
  public purchaseReqDate = "";
  public Sbu = "";
  public isUrgency = ""
  public bodyData = [];
  public generatePurchaseRequisitionReport(purchaseReqId) {
    this.purchaserequisitionService
      .getPurchaseReqReportById(purchaseReqId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.bodyData = returns.data;
          this.purReqNo = this.bodyData[0].purReqNo;
          this.purchaseReqDate = this.bodyData[0].purchaseReqDate;
          this.Sbu = this.bodyData[0].fromSbuName;
          this.isUrgency = this.bodyData[0].isUrgency;
          this.setParam();
          var fileName = this.pageNavigation + ".pdf";
          const content = document.getElementById("reportHeader");
          this.generateReport("print", fileName, content, this.datalength);
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
  }

  public params = [];
  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Voucher No",
      leftValue: "",
      rightLabel: "Voucher Date",
      rightValue: "",
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
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 80,
          styles: { font: "Meta" },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 120,
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
          },
          columnStyles: {
            4: { halign: "right" },
            5: { halign: "right" },
          },

          alternateRowStyles: {
            fillColor: [250, 250, 250],
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
