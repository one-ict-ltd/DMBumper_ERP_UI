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
//import { NavigationStart, Router } from "@angular/router";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { ProductService } from "app/services/inventory/product.service";
import { BranchService } from "app/services/erpsetting/branch.service";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { BillcollectionService } from "app/services/sales/billcollection.service";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: "ngx-productrequisition",
  templateUrl: "./productrequisition.component.html",
  styleUrls: ["./productrequisition.component.scss"],
})
export class ProductrequisitionComponent implements OnInit {
  /////////////////////////////
  master: {
    prodReqId: number;
    productReqDetailsId: number;
    prodReqNo: string;
    prodReqDate: Date;
    fromWarehouseId: number;
    toWarehouseId: number;
    purpose: string;
    isUrgency: number;
    approvalStatus: number;
    prodName: string;
    reqQty: number;
    productWiseSpecificationId: number;
    productId: number;
    toUomId: number;
    CtnQty: number;
    convertionQty: number;
    productName: string;
    uomName: string;
    isDelete: number;
    isActive: number;

    productSelected: [];
    fromsbusSelected: {};
    tosbusSelected: {};
    companySelected: {};

    fromsbuId: number;
    fromsbuName: string;
    tosbuId: number;
    tosbuName: string;
    requisitionBy: string;
    //productReqDetails: [];
    lstReqDetailsViewModel: any[];
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
  isConfirmed: boolean = false;

  ngOnInit() {
    //debugger;
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Product Requisition";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.getProductReqNo();
      //this.master.isActive = 1;
      this.show = false;

      if (this.fromsbus.length > 0) {
        this.master.fromsbuId = this.fromsbus[0].id;
        this.master.fromsbusSelected = {
          id: this.fromsbus[0].id,
          name: this.fromsbus[0].name,
        }
      }

    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");
      this.save();
      // this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      // this.show = true;
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
      prodReqId: 0,
      productReqDetailsId: 0,
      prodReqNo: "",
      prodReqDate: new Date(),
      fromWarehouseId: 0,
      toWarehouseId: 0,
      purpose: "",
      isUrgency: 0,
      approvalStatus: 0,
      productId: 0,
      toUomId: 0,
      CtnQty: 0,
      convertionQty: 0,
      prodName: "",
      reqQty: null,
      productWiseSpecificationId: 0,
      productName: "",
      uomName: "",
      isDelete: 0,
      isActive: 1,

      productSelected: null,
      fromsbusSelected: null,
      tosbusSelected: null,
      companySelected: null,

      fromsbuId: 0,
      fromsbuName: "",
      tosbuId: 0,
      tosbuName: "",
      requisitionBy: "",
      //productReqDetails: null,
      lstReqDetailsViewModel: [],
    };
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
      this.commonService.onExportCSV(this.gridApi, this.pageNavigation);
    } else {
      console.log("Click action button");
    }
  }
  /////End of Dynamic Button section (Do Not Edit)///////

  /////////////////////////////// CRUD ///////////////////////////////////////////

  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.prodReqNo == "" || this.master.prodReqNo == null) {
      this.toastrService.danger("Please enter a product.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.prodReqDate == null) {
      this.toastrService.danger("Please enter requisition date.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.fromsbuId == 0 || this.master.fromsbuId == null) {
      this.toastrService.danger("Please select sbu.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (
      this.master.lstReqDetailsViewModel.length == 0 ||
      this.master.lstReqDetailsViewModel == null
    ) {
      this.toastrService.danger("Please enter a product.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    this.show = true;
    this.master.prodReqDate = this.commonService.DateFormat(this.master.prodReqDate);
    this.productrequisitionService
      .saveProductRequisition(this.master)
      .subscribe((returns: any) => {
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
          //////////////Grid Refresh ///////////////////

          this.getMaster();
          this.getProductReqNo();
          this.productrequisitionService
            .getProductRequisition(0)
            .subscribe((data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            });
          //////////////Grid Refresh ///////////////////
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
    private productrequisitionService: ProductrequisitionService,
    private comboService: CommoncomboService,
    private productService: ProductService,
    private branchService: BranchService,
    protected dateService: NbDateService<Date>,
    private billcollectionService: BillcollectionService
  ) {
    this.commonService.valueSet("showlist");

    this.getServerDateTime();
    this.getProductDetails();
    // this.getWarehouse(0);
    this.getSBU(0);

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
      //   headerName: "Product Req. ID",
      //   field: "prodReqId",
      //   filter: "agNumberColumnFilter",
      //   editable: false,
      //   width: 180,
      // },
      {
        headerName: "Product Req. No",
        field: "prodReqNo",
        width: 180,
      },
      {
        headerName: "Product Req. Date",
        field: "prodReqDate",
        width: 180,
      },
      {
        headerName: "Req. Raised By",
        field: "requisitionBy",
        width: 200,
      },
      {
        headerName: "Raised From SBU",
        field: "fromsbuName",
        width: 200,
      },
      {
        headerName: "Purpose",
        field: "purpose",
        width: 260,
      },
      {
        headerName: "Is Urgent",
        field: "priority",
        width: 160,
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
    this.getProductReqNo();
  }

  minDate: Date = new Date();
  maxDate: Date = new Date();
  currentDate: Date = new Date();
  // [min]="minDate" [max]="maxDate"
  // protected dateService: NbDateService<Date>,
  getServerDateTime() {
    console.log('ServerDateTime');

    let apiUrl = `menu/getServerDateTime`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        console.log(returns);
        this.currentDate = new Date(returns.data[0].currentDate);
        this.minDate = this.dateService.addDay(new Date(returns.data[0].minReqDate), 0);
        this.maxDate = this.dateService.addDay(new Date(returns.data[0].maxReqDate), 0);
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
    this.productrequisitionService
      .getProductRequisition(0)
      .subscribe((data: any) => {
        if (data.success) {
          this.rowData = data.data;
          console.log(data.data);
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
    this.commonService.agButtonClicked="";
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
       this.isConfirmed = confirm("Are you sure?, you want to delete this!")
      if(this.isConfirmed){
        this.agDelete(event);
      }
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  public getProductSpecDetails() {
    //this.master.totalPrice = 0;
    //this.master.price = 0;
    this.master.productId = this.master.productSelected["productId"];
    this.master.uomName = this.master.productSelected["uomName"];
    this.master.productName = this.master.productSelected["name"];
    this.master.productWiseSpecificationId = this.master.productSelected["id"];
    //  let companyAliasName = this.salesinvoiceService.GetCompanyAliasName();
    // if (companyAliasName == "EVERGREEN")
    //this.master.price = this.master.productSelected["price"];
    debugger;
    //this.getCurrentStock();
    //this.checkAlreadyExist();
    this.GetUOMConverterInfoByProductSpecId(this.master.productWiseSpecificationId, this.master.productSelected["uomId"], 0);
  }

  toUomList: any[];
  toUomSelected = {};
  GetUOMConverterInfoByProductSpecId(productWiseSpecificationId: any, fromUomId: any, toUomId: any) {
    this.toUomList = [];
    this.toUomSelected = null;
    this.productService.GetUOMConverterInfoByProductSpecId(productWiseSpecificationId, fromUomId, toUomId).subscribe((returns: any) => {
      if (returns.status) {
        this.toUomList = returns.data.map((val: any) => ({
          id: val.toUomId,
          name: val.toUomName,
          fromQty: val.fromQty,
          toQty: val.toQty,
        }));
        if (returns.data.length > 0) {
          this.toUomSelected = {
            id: returns.data[0].toUomId,
            name: returns.data[0].toUomName,
            fromQty: returns.data[0].fromQty,
            toQty: returns.data[0].toQty,
          };

          this.master.toUomId = returns.data[0].toUomId;
        };
      }
    });
  }

  public CalculateTotalPrice(isAvoid: boolean = false) {

    let toQty: number = this.toUomSelected["toQty"];
    let fromQty: number = this.toUomSelected["fromQty"];
    let convertionFactor: number = (fromQty / toQty);
    this.master.reqQty = this.master.CtnQty + this.master.convertionQty * convertionFactor;

    //END : Set Pcs to CTN UOM qty

    if (this.master.reqQty == undefined || this.master.reqQty < 0)
      this.master.reqQty = 0;
    // if (this.master.price == undefined || this.master.price < 0)
    //   this.master.price = 0;

    // this.master.totalPrice = this.master.price * this.master.invoiceQty;
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
      var prodReqId = event.node.data.prodReqId;

      this.productrequisitionService
        .getProductRequisition(prodReqId)
        .subscribe((data: any) => {
          if (data.success) {
            this.master = data.data[0];
            this.master.prodReqDate = new Date(this.master.prodReqDate);
            //console.log(data.data);
            //console.log("agEdit Click");
          }
          this.productrequisitionService
            .getProductReqDetailsById(prodReqId)
            .subscribe((data: any) => {
              if (data.success) {
                this.master.lstReqDetailsViewModel = data.data;
                console.log(data.data);
              }
            });
          console.log("master model");
          console.log(this.master);

          this.master.fromsbusSelected = {
            id: data.data[0].fromsbuId,
            name: data.data[0].fromsbuName,
          };
          this.master.tosbusSelected = {
            id: data.data[0].tosbuId,
            name: data.data[0].tosbuName,
          };
        });

      this.ngOnInit();
    }
  }

  private agDelete(event) {
    this.master.prodReqId = event.node.data.prodReqId;
    this.productrequisitionService
      .deleteProductRequisitionById(this.master.prodReqId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.productrequisitionService
            .getProductRequisition(0)
            .subscribe((data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            });
          //////////////Grid Refresh ///////////////////
        }
      });
  }

  public getWarehouse(sbuId) {
    this.branchService.getBranchById(sbuId).subscribe((data: any) => {
      //debugger;
      console.log(data);

      if (data.success) {
        this.master = data.data[0];

        this.master.fromsbusSelected = {
          id: data.data[0].sbuId,
          name: data.data[0].sbuName,
        };
      }
    });
  }
  public sbus = [];
  public fromsbus = [];
  public tosbus = [];
  public getSBU(companyId) {
    //debugger;
    //this.master.fromsbusSelected = null;
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.fromsbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
      this.tosbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }
  public getProductReqNo() {
    if (this.master.prodReqDate == null) {
      //console.log("Mintu Bhai");
      this.master.prodReqDate = new Date("dd-MM-yyyy");
    }

    this.productrequisitionService
      .getProductRequisitionNo(
        this.master.prodReqDate.toDateString().substring(4, 15)
      )
      .subscribe((returns: any) => {
        console.log(returns);
        if (returns.success) {
          this.master.prodReqNo = returns.data[0].MaxNo;
        }
      });
  }
  public getFromWarehouse() { }

  public prodSelected = [];

  public getProductDetails() {
    this.productrequisitionService
      .getAllProductForRequisition()
      .subscribe((returns: any) => {
        //console.log(returns.data);
        this.prodSelected = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          productId: val.productId,
          uomId: val.uomId,
          uomName: val.uomName,
        }));
      });
  }

  public getProductById(id) {
    // console.log(this.master.productSelected);
    // this.productService.getProductById(id).subscribe((data: any) => {
    //   if (data.success) {
    //     this.master.uomName = this.master.productSelected["uomName"];
    //   }
    // });

    this.master.uomName = this.master.productSelected["uomName"];
    this.GetCurrentStock();

    this.checkAlreadyExist();
  }

  //public lstReqDetailsViewModel = [];

  currentStock: number = 0;
  GetCurrentStock() {
    this.currentStock = 0;
    let apiUrl = `ProductRequisition/GetProductCurrentStockBySbuId?productWiseSpecificationId=${this.master.productWiseSpecificationId}&sbuId=${this.master.fromsbuId}`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.currentStock = returns.data[0].currentStock;
      }
    });
  }

  productAlreadyExist: boolean = false;
  checkAlreadyExist() {
    this.productAlreadyExist = false;
    this.master.lstReqDetailsViewModel.forEach(element => {
      if (element.productWiseSpecificationId == this.master.productWiseSpecificationId) {
        this.productAlreadyExist = true;
        return;
      }
    });
  }
  public addDetails() {
    //console.log(this.master.productSelected);
    if (
      this.master.productWiseSpecificationId == null ||
      this.master.productWiseSpecificationId == 0
    ) {
      this.toastrService.danger("Please select product.", "Message");

      return false;
    }

    if (this.master.reqQty == 0 || this.master.reqQty == null) {
      this.toastrService.danger("Please enter quanty.", "Message");

      return false;
    }

    if (this.productAlreadyExist) {
      this.toastrService.warning(`Product (${this.master.productSelected["name"]}) already in the list !`, "Message");
      return;
    }

    //this.getProductDetails();
    let detail = {
      productReqDetailsId: 0, //this.master.lstReqDetailsViewModel.productReqDetailsId,
      productWiseSpecificationId: this.master.productWiseSpecificationId,
      dropdown: this.prodSelected,
      productId: this.master.productSelected["productId"],
      productName: this.master.productSelected["name"],
      uomId: this.master.productSelected["uomId"],
      reqQty: this.master.reqQty,
      CtnQty: this.master.CtnQty,
      convertionQty: this.master.convertionQty,
      toUomId: this.master.toUomId,
      uomName: this.master.uomName,
      currentStock: this.currentStock,
      isActive: 1,
    };
    //this.master.lstReqDetailsViewModel.push(detail);
    if (detail.reqQty != 0) {
      this.master.lstReqDetailsViewModel.push(detail);
    } else {
      this.toastrService.danger("Quantity is zero.", "Message");
      return;
    }
    this.master.productSelected = null;
    this.master.reqQty = null;
    this.master.CtnQty = null;
    this.master.convertionQty = 0;
    this.master.uomName = "";
  }

  public deleteDetail(index: any) {
    this.selectedRow = this.master.lstReqDetailsViewModel[index];
    this.master.lstReqDetailsViewModel.splice(index, 1);
    if (this.selectedRow.helpDetailId > 0) {
    }
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
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

  public getCompany() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyItems = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  public tableHeader = ["#", "Product Name", "Product Specification", "CTN. Qty", "Loose Qty"];
  private agReport(event) {
    this.generateProductRequisitionReport(event.data.prodReqId);
  }
  public datalength: number;
  public prodReqNo = "";
  public prodReqDate = "";
  public bodyData = [];
  public generateProductRequisitionReport(prodReqId) {
    this.productrequisitionService
      .getProductReqReportById(prodReqId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.bodyData = returns.data;
          this.prodReqNo = this.bodyData[0].prodReqNo;
          this.prodReqDate = this.bodyData[0].prodReqDate;
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
