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
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { NavigationStart, Router } from "@angular/router";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { ProductService } from "app/services/inventory/product.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { StockinwithbarcodeService } from "app/services/inventory/stockinwithbarcode.service";
import { from } from "rxjs";
import { Console } from "node:console";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-productwisecolor',
  templateUrl: './productwisecolor.component.html',
  styleUrls: ['./productwisecolor.component.scss']
})
export class ProductwisecolorComponent implements OnInit {

  master: {
    productWiseColorId: number;
    productWiseSpecificationId: number;
    colorCode: string;
    minRange: number;
    maxRange: number;
    isActive: number;

    productSelected: {};
    productspecificationSelected: {};
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

  public pageNavigation = "Product Color Range";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
      this.disabled = false;
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

    this.master = {
      productWiseColorId: 0,
      productWiseSpecificationId: 0,
      colorCode: "",
      minRange: 0,
      maxRange: 0,
      isActive: 1,

      productSelected: null,
      productspecificationSelected: null,
    };
  }

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
    if (this.master.productSelected == null) {
      this.toastrService.danger("Please select product", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.productspecificationSelected == null) {
      this.toastrService.danger("Please select product specification", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.colorCode == null || this.master.colorCode == '') {
      this.toastrService.danger("Please input color code.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.minRange == null) {
      this.toastrService.danger("Please input minimum range.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.maxRange == null || this.master.maxRange == 0) {
      this.toastrService.danger("Please input maximum range.", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    this.productService.saveProductWiseColor(this.master).subscribe(
      (returns: any) => {
        if (returns.success) {
          if (button == "update") {
            this.toastrService.success(this.commonService.updatedmsg, "Message");
          } else {
            this.toastrService.success(this.commonService.successmsg, "Message");
          }
          this.show = true;
          //////////////Grid Refresh ///////////////////

          this.getMaster();
          this.productService.GetProductWiseColorById(0).subscribe(
            (data: any) => {
              if (data.status) {
                this.rowData = data.data;
              }
            }
          );
          //////////////Grid Refresh ///////////////////
        }
      }
    );
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
    private productService: ProductService,
    private comboService: CommoncomboService,
    private StockinwithbarcodeService: StockinwithbarcodeService,
  ) {

    this.commonService.valueSet("showlist");
    this.getAllProduct();


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
        headerName: "Product Name",
        field: "productName",
        width: 220,
      },
      {
        headerName: "Product Name & Spec.",
        field: "productNameWithSpec",
        width: 400,
      },
      {
        headerName: "Color Code",
        field: "colorCode",
        width: 120,
      },
      {
        headerName: "Min. Range",
        field: "minRange",
        width: 140,
      },
      {
        headerName: "Max. Range",
        field: "maxRange",
        width: 140,
      },
      {
        headerName: "Is Active?",
        field: "isActive",
        width: 120,
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

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.productService.GetProductWiseColorById(0).subscribe(
      (data: any) => {
        if (data.status) {
          this.rowData = data.data;
        }
      }
    );
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
      var productWiseColorId = event.node.data.productWiseColorId;
      this.productService.GetProductWiseColorById(productWiseColorId).subscribe(
        (data: any) => {
          if (data.status) {
            this.master = data.data[0];

            this.master.productSelected = {
              id: data.data[0].productId,
              name: data.data[0].productName,
            };

            this.getAllProductSpecification(data.data[0].productId);
            this.master.productspecificationSelected = {
              id: data.data[0].productWiseSpecificationId,
              name: data.data[0].productNameWithSpec,
            };
          }
        }
      );
      this.ngOnInit();
    }
  }

  private agReport(event) {
    this.toastrService.info("Print button clicked", "Message");
  }

  private agDelete(event) {
    this.master.productWiseColorId = event.node.data.productWiseColorId;
    this.productService.DeleteProductWiseColorById(this.master.productWiseColorId).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success(this.commonService.deletedmsg, "Message");
        //////////////Grid Refresh ///////////////////
        this.productService.GetProductWiseColorById(0).subscribe(
          (data: any) => {
            if (data.status) {
              this.rowData = data.data;
            }
          }
        );
        //////////////Grid Refresh ///////////////////
      }
    });
  }

  // public refesh() {
  //   this.master.lstDetailsViewModel = [];
  //   this.toastrService.warning(this.commonService.warningmsg, "Message");
  // }

  public ProductList = [];
  public getAllProduct() {
    this.StockinwithbarcodeService.getAllProduct().subscribe((returns: any) => {
      this.ProductList = returns.data.map((val) => ({
        id: val.productId,
        name: val.productName,
      }));
    });
  }

  public ProductSpecificationList = [];
  public getAllProductSpecification(productId) {
    this.master.productspecificationSelected = {};
    this.StockinwithbarcodeService.getAllProductSpecification(
      productId
    ).subscribe((returns: any) => {
      this.ProductSpecificationList = returns.data.map((val) => ({
        id: val.productWiseSpecificationId,
        name: val.productName,
      }));
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

}
