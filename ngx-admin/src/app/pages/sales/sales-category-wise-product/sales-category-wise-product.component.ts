import {
  Component,
  OnInit,
} from "@angular/core";
import {
  NbComponentStatus,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { BonusIncentivePolicyService } from "app/services/sales/bonus-incentive-policy.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { ProductService } from "app/services/inventory/product.service";
import { ItemsList } from "@ng-select/ng-select/lib/items-list";


@Component({
  selector: 'ngx-sales-category-wise-product',
  templateUrl: './sales-category-wise-product.component.html',
  styleUrls: ['./sales-category-wise-product.component.scss']
})
export class SalesCategoryWiseProductComponent implements OnInit {

  public pageNavigation = "Sales Category Wise Product Assign";
  show: boolean = true;
  disabled: boolean = false;
  fDate: Date;
  tDate: Date;

  name: string;
  description: string;
  selectedRow: any;

  public selectdetailRows = [];
  private gridApi;
  private gridColumnApi;
  public columnDefs;
  public defaultColDef;
  public rowData: [];

  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };


  master: {
    month: number;
    year: string;
    productCategoryId: number;
    monthSelected: any;
    productCategorySelected: any;
    lstDetailsViewModel: any[];
    isChecked: boolean;
    salesCategoryWiseProductMasterId: number;
    salesCategoryWiseProductDetails: number;

    incentivePolicyId: number;
    incentiveType: string;
    uom: string;
    productWiseSpecificationId: number;
    minOrderQty: number;
    effectiveDate: Date;
    toDate: Date;
    incentiveValue: number;
    collUpToDays: number;
    isActive: true;
  };

  constructor(
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private productrequisitionService: ProductrequisitionService,
    private PolicyService: BonusIncentivePolicyService,
    private productService: ProductService
  ) {
    this.commonService.valueSet('showlist');
    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 50,
      },
      {
        headerName: "Month",
        field: "incentivePolicyId",
        width: 150,
      },
      {
        headerName: "Year",
        field: "productName",
        width: 150,
      },
      {
        headerName: "Category.",
        field: "minOrderQty",
        filter: "agNumberColumnFilter",
        width: 150,
      },
      // {
      //   headerName: "UOM",
      //   field: "uom",
      //   filter: "agNumberColumnFilter",
      //   editable: false,
      //   width: 70,
      // },
      // {
      //   headerName: "Incentive Type",
      //   field: "incentiveType",
      //   width: 150,
      // },
      // {
      //   headerName: "Incentive Value",
      //   field: "incentiveValue",
      //   filter: "agNumberColumnFilter",
      //   width: 150,
      // },
      // {
      //   headerName: "Eff. From Date",
      //   field: "effectiveDate",
      //   width: 150,
      // },
      // {
      //   headerName: "Eff. To Date",
      //   field: "effectiveToDate",
      //   width: 150,
      // },
      // {
      //   headerName: "Is Active",
      //   field: "isActive",
      //   width: 150,
      // },
      // {
      //   headerName: "Is Delete",
      //   field: "isDelete",
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
      editable: true,
    };


    this.fDate = this.commonService.GetAnyMonthAndDateOfYear(-6);
    this.tDate = new Date();
    this.lstMaster = [];
    let lstType = [{ id: 'Amount', name: 'Amount' }, { id: 'Percent', name: 'Percent' }];
    this.incentiveTypeList = lstType.map((val) => ({
      id: val.id,
      name: val.name,
    }));
    this.GetAllMonths();
    this.getProductCategory();
    this.GetAllProducts();
    this.getMaster();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadData();
  }

  ngOnInit() {
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }

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
      this.show = true;
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
      month: 0,
      year: "",
      productCategoryId: 0,
      monthSelected: {},
      productCategorySelected: {},
      lstDetailsViewModel: null,
      isChecked: false,
      salesCategoryWiseProductMasterId: 0,
      salesCategoryWiseProductDetails: 0,

      incentivePolicyId: 0,
      incentiveType: '',
      uom: '',
      productWiseSpecificationId: 0,
      minOrderQty: 0,
      effectiveDate: new Date(),
      toDate: new Date(),
      incentiveValue: 0,
      collUpToDays: 0,
      isActive: true,
    };

    this.incentiveTypeSelected = null;
    this.productSelected = null;
    //this.loadProduct();
  }


  lstMaster: any[];
  incentiveTypeList = [];
  incentiveTypeSelected = {};
  productSelected = {};

  productList = [];
  GetAllProducts() {
    this.productrequisitionService
      .getAllProductForRequisition()
      .subscribe((returns: any) => {
        this.productList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uom: val.uomName,
        }));
      });
  }
  LoadData() {
    // this.PolicyService.GetProductSpecWiseIncentivePolicy(0, this.commonService.DateFormat(this.fDate), this.commonService.DateFormat(this.tDate)).subscribe((data: any) => {
    //   if (data.success) {
    //     this.rowData = data.data;
    //   }
    // });
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

  private reset() {
    this.getMaster();
  }


  onRefesh() {
    this.selectedRow = "";
    this.ngOnInit();
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
  }

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


  private save() {
    debugger;
    if (this.master.lstDetailsViewModel.length > 0) {
      if (1 == 1) {
        if (this.master.year == "") {
          return;
        }
        this.show = true;
        var button = this.commonService.buttonClicked;
        const checkedItems = this.master.lstDetailsViewModel.filter(item => item.isChecked === true || item.isChecked === 1 || item.isChecked === false);
        checkedItems.forEach(item => {
          if (item.isChecked === 1) {
            item.isChecked = true;
          }
        });
        const categoryWiseProductVM: any = {
          month: this.master.month,
          year: this.master.year,
          productCategoryId: this.master.productCategoryId,
          lstDetailsViewModel: checkedItems
        };

        this.PolicyService.SaveCategorySales(categoryWiseProductVM).subscribe((returns: any) => {
          if (returns.success) {
            debugger;
            if (button == "update") {
              this.toastrService.success(this.commonService.updatedmsg, "Message");
            }
            else {
              this.toastrService.success(returns.message, "Message");
            }
            this.getMaster();
            this.lstMaster = [];
            this.commonService.valueSet('create');

            this.show = true;
          }
        });
      }
    }
    else {
      this.toastrService.danger("Please add at least one product!", "Message");
      this.commonService.valueSet("create");
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
      this.selectedRows.push(event.node.data);
      this.selectedRow = event.node.data;
      let incentivePolicyId = event.node.data.incentivePolicyId;

      this.PolicyService.GetProductSpecWiseIncentivePolicy(incentivePolicyId, this.commonService.DateFormat(this.fDate), this.commonService.DateFormat(this.tDate)).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];
          this.incentiveTypeSelected = {
            id: this.master.incentiveType, name: this.master.incentiveType
          }
          this.productSelected = {
            id: this.master.productWiseSpecificationId, name: data.data[0].productName, uom: data.data[0].uom
          }
          this.master.effectiveDate = new Date(this.master.effectiveDate);
        }
      });
      this.ngOnInit();
    }
  }


  private agDelete(event) {
    if (confirm("Are you sure to delete?")) {
      let incentivePolicyId = event.node.data.incentivePolicyId;
      this.PolicyService.DeleteProductSpecWiseIncentive(incentivePolicyId).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          this.PolicyService.GetProductSpecWiseIncentivePolicy(0, this.commonService.DateFormat(this.fDate), this.commonService.DateFormat(this.tDate)).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
        }
      });
    }
  }
  validation(): boolean {
    if (this.incentiveTypeSelected == null || Object.keys(this.incentiveTypeSelected).length === 0) {
      this.toastrService.danger("Please select a incentive type", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.incentiveType == "") {
      this.toastrService.danger("Please select a incentive type", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.incentiveValue == 0) {
      this.toastrService.danger("Please select a incentive value", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.minOrderQty == 0) {
      this.toastrService.danger("Please input min order qty.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.productSelected == null) {
      this.toastrService.danger("Please select a product", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.collUpToDays == null || this.master.collUpToDays <= 0) {
      this.toastrService.danger("Please input collection up to days", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    return true;
  }


  // addRow() {
  //   if (this.validation()) {
  //     let row = {
  //       incentivePolicyId: this.master.incentivePolicyId,
  //       effectiveDate: this.commonService.DateFormat(this.master.effectiveDate),
  //       toDate: this.commonService.DateFormat(this.master.toDate),
  //       incentiveType: this.master.incentiveType,
  //       incentiveValue: this.master.incentiveValue,
  //       uom: this.master.uom,
  //       minOrderQty: this.master.minOrderQty,
  //       collUpToDays: this.master.collUpToDays,
  //       productWiseSpecificationId: this.master.productWiseSpecificationId,
  //       productName: this.productSelected["name"],
  //       isActive: this.master.isActive,
  //     }
  //     this.lstMaster.push(row);
  //     this.master.minOrderQty = null;
  //     this.master.incentiveValue = null;
  //   }
  // }


  // removeRow(index) {
  //   debugger;
  //   if (confirm("Are you sure to remove?")) {
  //     this.commonService.valueSet("create");
  //     this.selectedRow = this.lstMaster[index];
  //     this.lstMaster.splice(index, 1);
  //     if (this.selectedRow.helpDetailId > 0) {
  //     }
  //     this.toastrService.danger(this.commonService.deletedmsg, "Message");
  //   }
  // }

  private agReport(event) {
  }

  config: NbToastrConfig;
  index = 1;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus = "primary";



  monthList = [];

  GetAllMonths() {
    this.monthList = this.commonService.GetAllMonths();
  }
  public productCategoryList = [];
  public getProductCategory() {
    this.productService.getCategorySales().subscribe((retuns: any) => {
      if (retuns.success) {
        this.productCategoryList = retuns.data.map((val: any) => ({
          id: val.categorySalesId,
          name: val.categorySalesName,
        }))
      }
    })
  }

  loadProduct() {
    this.productService
      .getProductByCategoryId(this.master.productCategoryId, this.master.month, this.master.year)
      .subscribe((data: any) => {
        if (data.success) {
          debugger;
          this.master.salesCategoryWiseProductDetails = data.data
          this.master.lstDetailsViewModel = data.data;
        }
      });
  }

  loadSelect() {
    this.master.productCategorySelected = {};
    this.master.lstDetailsViewModel = [];
  }

  yearError = false; // Boolean to track if there's a year input error

  validateYear() {
    this.yearError = !/^\d{4}$/.test(this.master.year);
  }

}

