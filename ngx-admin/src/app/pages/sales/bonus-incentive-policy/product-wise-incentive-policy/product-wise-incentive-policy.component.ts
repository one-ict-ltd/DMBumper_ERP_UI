
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
import { HrmmasterService } from "app/services/hrm/hrmmaster.service";
import { BonusIncentivePolicyService } from "app/services/sales/bonus-incentive-policy.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";

@Component({
  selector: 'ngx-product-wise-incentive-policy',
  templateUrl: './product-wise-incentive-policy.component.html',
  styleUrls: ['./product-wise-incentive-policy.component.scss']
})
export class ProductWiseIncentivePolicyComponent implements OnInit {


  public pageNavigation = "Product Wise Incentive Policy";
  //public buttons = this.commonService.btnList;
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
  //public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];

  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };


  master: {
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
        headerName: "ID",
        field: "incentivePolicyId",
        //filter: "agNumberColumnFilter",
        //editable: false,
        width: 80,
      },
      {
        headerName: "Product Name",
        field: "productName",
        //filter: "agNumberColumnFilter",
        //editable: false,
        width: 320,
      },
      {
        headerName: "Min. Qty.",
        field: "minOrderQty",
        filter: "agNumberColumnFilter",
        //editable: false,
        width: 120,
      },
      {
        headerName: "UOM",
        field: "uom",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 70,
      },
      {
        headerName: "Incentive Type",
        field: "incentiveType",
        //filter: "agNumberColumnFilter",
        //editable: false,
        width: 150,
      },
      {
        headerName: "Incentive Value",
        field: "incentiveValue",
        filter: "agNumberColumnFilter",
        //editable: false,
        width: 150,
      },
      {
        headerName: "Eff. From Date",
        field: "effectiveDate",
        //filter: "agNumberColumnFilter",
        //editable: false,
        width: 150,
      },
      {
        headerName: "Eff. To Date",
        field: "effectiveToDate",
        //filter: "agNumberColumnFilter",
        //editable: false,
        width: 150,
      },
      {
        headerName: "Is Active",
        field: "isActive",
        width: 150,
      },
      {
        headerName: "Is Delete",
        field: "isDelete",
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


  // protected options: {};
  // protected cd: ChangeDetectorRef;
  // showMessages: any = {};
  // errors: string[];

  // types: NbComponentStatus[] = [
  //   "primary",
  //   "success",
  //   "info",
  //   "warning",
  //   "danger",
  // ];
  // positions: string[] = [
  //   NbGlobalPhysicalPosition.TOP_RIGHT,
  //   NbGlobalPhysicalPosition.TOP_LEFT,
  //   NbGlobalPhysicalPosition.BOTTOM_LEFT,
  //   NbGlobalPhysicalPosition.BOTTOM_RIGHT,
  //   NbGlobalLogicalPosition.TOP_END,
  //   NbGlobalLogicalPosition.TOP_START,
  //   NbGlobalLogicalPosition.BOTTOM_END,
  //   NbGlobalLogicalPosition.BOTTOM_START,
  // ];

  // //vlucherForm: FormGroup;
  // submitted: boolean;
  // saveupdate: string = "Save";
  // gridbutton: string = "";


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

    //this.GetAllMonths();
    this.incentiveTypeSelected = null;
    this.productSelected = null;
  }

  lstMaster: any[];
  incentiveTypeList = [];
  incentiveTypeSelected = {};
  productSelected = {};
  // GetAllMonths() {
  //   this.monthList = this.commonService.GetAllMonths();
  // }

  productList = [];
  GetAllProducts() {
    this.productrequisitionService
      .getAllProductForRequisition()
      .subscribe((returns: any) => {
        this.productList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          // uomId: val.uomId,
          uom: val.uomName,
          // productId: val.productId,
          // price: val.price,
        }));
      });
  }
  LoadData() {
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
    this.PolicyService.GetProductSpecWiseIncentivePolicy(0, this.commonService.DateFormat(this.fDate), this.commonService.DateFormat(this.tDate)).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }
  else {
    // Handle invalid date scenario (e.g., show error message)
    alert('To Date cannot be earlier than From Date.');
  }
  }



  //public employeeItems = [];
  //public companyItems = [];

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


  private reset() {
    this.getMaster();
  }

  //////////////////////////////// End CRUD /////////////////////////////////////////

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
    //this.saveupdate = "Update";
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


  private save() {
    debugger;
    console.log('save()', this.master);
    if (this.lstMaster.length > 0) {
      if (1 == 1) {
        this.show = true;
        var button = this.commonService.buttonClicked;
        const fromDate = this.master.effectiveDate;
        const toDate = this.master.toDate;
        if (this.commonService.validateDates(fromDate, toDate)) {
          this.PolicyService.SaveProductSpecWiseIncentive(this.lstMaster).subscribe((returns: any) => {
            if (returns.success) {
              if (button == "update") {
                this.toastrService.success(this.commonService.updatedmsg, "Message");
              }
              else {
                this.toastrService.success(this.commonService.successmsg, "Message");
              }
              //////////////Grid Refresh ///////////////////
              this.PolicyService.GetProductSpecWiseIncentivePolicy(0, this.commonService.DateFormat(this.fDate), this.commonService.DateFormat(this.tDate)).subscribe((data: any) => {
                if (data.success) {
                  this.rowData = data.data;
                }
              });
              this.getMaster();
              this.lstMaster = [];
              //////////////Grid Refresh ///////////////////
              //
            }
          });
        }
        else {
          // Handle invalid date scenario (e.g., show error message)
          alert('To Date cannot be earlier than From Date.');
        }
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

          //////////////Grid Refresh ///////////////////
          this.PolicyService.GetProductSpecWiseIncentivePolicy(0, this.commonService.DateFormat(this.fDate), this.commonService.DateFormat(this.tDate)).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
          //////////////Grid Refresh ///////////////////
        }
      });
    }
  }
  validation(): boolean {
    //debugger;
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


  addRow() {
    //debugger;
    if (this.validation()) {
      let row = {
        incentivePolicyId: this.master.incentivePolicyId,
        effectiveDate: this.commonService.DateFormat(this.master.effectiveDate),
        toDate: this.commonService.DateFormat(this.master.toDate),
        incentiveType: this.master.incentiveType,
        incentiveValue: this.master.incentiveValue,
        uom: this.master.uom,
        minOrderQty: this.master.minOrderQty,
        collUpToDays: this.master.collUpToDays,
        productWiseSpecificationId: this.master.productWiseSpecificationId,
        productName: this.productSelected["name"],
        isActive: this.master.isActive,
      }
      this.lstMaster.push(row);
      //this.getMaster();

      this.master.minOrderQty = null;
      this.master.incentiveValue = null;
    }
  }


  removeRow(index) {
    debugger;
    if (confirm("Are you sure to remove?")) {
      this.commonService.valueSet("create");
      this.selectedRow = this.lstMaster[index];
      this.lstMaster.splice(index, 1);
      if (this.selectedRow.helpDetailId > 0) {
      }
      this.toastrService.danger(this.commonService.deletedmsg, "Message");
    }
  }

  private agReport(event) {
    //this.generateStockInReport(event.data.stockMasterId);
  }


  // @Output() myEvent = new EventEmitter();

  // public deleteRow(state, action) {
  //   const nodeIdToRemove = action.payload;
  //   const filteredData = state.rowData.filter(
  //     (node) => node.id !== nodeIdToRemove
  //   );
  //   return {
  //     ...state,
  //     rowData: [...filteredData],
  //   };
  // }




  config: NbToastrConfig;
  index = 1;
  destroyByClick = true;
  duration = 2000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus = "primary";

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


}

