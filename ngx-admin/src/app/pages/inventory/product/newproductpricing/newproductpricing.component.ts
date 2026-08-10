import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup, NgForm } from "@angular/forms";
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
import { CommoncomboService } from "app/services/commoncombo.service";
import { PoductPricingService } from "app/services/inventory/poduct-pricing.service";

@Component({
  selector: "ngx-newproductpricing",
  templateUrl: "./newproductpricing.component.html",
  styleUrls: ["./newproductpricing.component.scss"],
})
export class NewproductpricingComponent implements OnInit {
  master: {
    lstDetailsViewModel: any[];
  };

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
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Product Pricing";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
      this.disabled = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");
      this.save();
      this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
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
  public getMaster() {
    this.master = {
      lstDetailsViewModel: [],
    };
  }

  ProductPricingViewModel: {
    // productName: string
    // , barcodeNo: string
    // , productWiseSpecificationId: number
    // , barcodeId: number
    // , pricingId: number
    // , productId: number
    // , price: number
    // , uomName: string
    // , effectiveDate: Date
  };

  companyItems = [];
  sbuItems = [];

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

  //////////////////////////////////////////////CRUD////////////////////////////

  private save() {
    var button = this.commonService.buttonClicked;
    this.poductPricingService
      .SaveProductPricing(this.ProductPricingViewModel)
      .subscribe((returns: any) => {
        if (returns.success) {
          button == "update"
            ? this.toastrService.success(
              this.commonService.updatedmsg,
              "Message"
            )
            : this.toastrService.success(
              this.commonService.successmsg,
              "Message"
            );

          //////////////Grid Refresh ///////////////////
          // this.poductPricingService.GetProductPricingByMasterId(0, 0).subscribe((data: any) => {
          //   if (data.success) {
          //     this.master.lstDetailsViewModel = data.data;
          //   }
          // });
          //////////////Grid Refresh ///////////////////
        } else {
          this.toastrService.danger(returns.message, "Message");
        }
      });
  }

  private reset() {
    this.getMaster();
  }

  //////////////////////////////// End CRUD /////////////////////////////////////////

  onRefesh() {
    this.selectedRow = "";
    this.ngOnInit();
    //this.onGridReady;
    this.toastrService.warning("warning", this.commonService.warningmsg);
  }

  onEditGrid() {
    // const d = this.gridApi.getEditingCells();
    // if (this.gridApi.getSelectedRows().length == 0) {
    //   this.toastrService.danger("error", this.commonService.selectdata);
    //   return;
    // }
    // var row = this.gridApi.getSelectedRows();
    // this.selectedRow = row[0];
    // this.ngOnInit();
    // this.saveupdate = "Update";
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
    private http: HttpClient,
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private comboService: CommoncomboService,
    private poductPricingService: PoductPricingService
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
        headerName: "Id",
        field: "fiscalYearId",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 100,
      },
      {
        headerName: "Year Name",
        field: "yearName",
        filter: "agTextColumnFilter",
        width: 250,
      },
      {
        headerName: "Start Date",
        field: "yearStartDate",
        filter: "agDateColumnFilter",
        width: 150,
      },
      {
        headerName: "End Date",
        field: "yearEndDate",
        filter: "agDateColumnFilter",
        width: 150,
      },
      {
        headerName: "Lock Date",
        field: "lockDate",
        filter: "agDateColumnFilter",
        width: 150,
      },
      {
        headerName: "Is Active?",
        field: "isActive",
        width: 150,
      },
      {
        field: "action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) { },
        },
        minWidth: 250,
        editable: false,
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
      editable: true,
    };

    this.getMaster();
    this.loadPricingGrid();
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  loadPricingGrid() {
    this.poductPricingService
      .GetProductPricingNewByMasterId(0, 0)
      .subscribe((data: any) => {
        if (data.success) {
          this.master.lstDetailsViewModel = data.data;
        }
      });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.poductPricingService.GetProductPricingByMasterId(0, 0).subscribe((data: any) => {
    //   if (data.success) {
    //     this.master.lstDetailsViewModel = data.data;
    //   }
    // });
  }

  validatePrice(index) {
    this.ProductPricingViewModel = null;
    if (this.master.lstDetailsViewModel[index].price > 0) {
      this.ProductPricingViewModel = this.master.lstDetailsViewModel[index];
      this.save();
    } else {
      this.toastrService.warning(
        "Price should be larger than 0 (ZERO)!",
        "Warning !"
      );
    }
  }

  getSelectedRowData() {
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map((node) => node.data);
    alert(`${JSON.stringify(selectedData)}`);
    this.name = selectedData[0].currencyName;
    return selectedData;
  }

  private selectedRows = [];

  onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked; //localStorage.getItem("button");
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
    // this.disabled = false;
    // let temp = 0;
    // for (let i = 0; i < this.selectedRows.length; i++) {
    //   if (this.selectedRows[i] == event.node.data) {
    //     this.selectedRows.splice(i, 1);
    //     this.selectedRow = event.node.data;
    //     temp = 1;
    //     this.ngOnInit();
    //   }
    // }
    // if (temp === 0) {
    //   this.selectedRows.push(event.node.data);
    //   this.selectedRow = event.node.data;
    //   var fiscalYearId = event.node.data.fiscalYearId;
    //   this.fiscalyearService.getFiscalYearById(fiscalYearId).subscribe((data: any) => {
    //     if (data.success) {
    //
    //       this.master = data.data[0];
    //       // this.master.companySelected = {
    //       //   id: data.data[0].companyId,
    //       //   name: data.data[0].companyName,
    //       // };
    //       this.getSBU(data.data[0].companyId);
    //       // this.master.sbuSelected = {
    //       //   id: data.data[0].sbuId,
    //       //   name: data.data[0].sbuName,
    //       // };
    //     }
    //   });
    //   this.ngOnInit();
    //}
  }
  private agReport(event) {
    this.toastrService.info("Print button clicked", "Message");
  }
  private agDelete(event) {
    //this.master.fiscalYearId = event.node.data.fiscalYearId;
    // this.fiscalyearService.deleteFiscalYear(this.master).subscribe((returns: any) => {
    //   if (returns.success) {
    //     this.toastrService.success(this.commonService.deletedmsg, "Message");
    //     //////////////Grid Refresh ///////////////////
    //     this.fiscalyearService.getFiscalYear().subscribe((data: any) => {
    //       if (data.success) {
    //         this.rowData = data.data;
    //       }
    //     });
    //     //////////////Grid Refresh ///////////////////
    //   }
    // });
  }
  //////////////////////////////////End of Ag Grid Data Load/////////////////////////////////

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

  //////////// Open Modal ////////////////

  names: any;
  openWithDataObjModel(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      context: this.master,
    });
  }
  openWithDataModel() {
    this.dialogService
      .open(DialogNamePromptComponent)
      .onClose.subscribe((name) => name && this.names.push(name));
  }

  public getCompany() {
    // this.comboService.getCompany().subscribe((returns: any) => {
    //   this.companyItems = returns.data.map((val) => ({
    //     id: val.companyId,
    //     name: val.companyName,
    //   }));
    // });
  }

  public getSBU(companyId) {
    // this.master.sbuSelected = null;
    // this.comboService.getSBU(companyId).subscribe((returns: any) => {
    //   this.sbuItems = returns.data.map((val) => ({
    //     id: val.sbuId,
    //     name: val.sbuName,
    //   }));
    // });
  }
}
