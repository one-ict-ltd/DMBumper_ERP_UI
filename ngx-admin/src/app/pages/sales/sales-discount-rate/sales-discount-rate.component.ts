import {
  //ChangeDetectorRef,
  Component,
  //EventEmitter,
  OnInit,
  //Output,
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
import { CommoncomboService } from "app/services/commoncombo.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";

@Component({
  selector: 'ngx-sales-discount-rate',
  templateUrl: './sales-discount-rate.component.html',
  styleUrls: ['./sales-discount-rate.component.scss']
})
export class SalesDiscountRateComponent implements OnInit {

  public pageNavigation = "Sales Discount Rate Policy";
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
  public parties = [];

  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };


  master: {
    DiscountRateId: number;
    productWiseSpecificationId: number;
    partyId: number;
    price: number;
    discountType: string,
    percentAmount: number;
    discountAmount: number;
    amount: number;
    fromDate: Date;
    endDate: Date;
    isActive: true;
  };

  constructor(
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private comboService: CommoncomboService,
    private PolicyService: BonusIncentivePolicyService,
    private productrequisitionService: ProductrequisitionService,
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
        headerName: "Item",
        field: "productName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 200,
      },
      {
        headerName: "Customer",
        field: "partyName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 220,
      },
      {
        headerName: "Price",
        field: "price",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 120,
      },
      {
        headerName: "Type",
        field: "discountType",
        filter: "agTextColumnFilter",
        editable: false,
        width: 180,
      },
      {
        headerName: "Percentage Amount",
        field: "percentAmount",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 120,
      },
      {
        headerName: "Discount Amount",
        field: "discountAmount",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 120,
      },
      {
        headerName: "Amount",
        field: "amount",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 120,
      },
      {
        headerName: "From Date",
        field: "fromDate",
        filter: "agTextColumnFilter",
        editable: false,
        width: 150,
      },
      {
        headerName: "To Date",
        field: "endDate",
        filter: "agTextColumnFilter",
        editable: false,
        width: 150,
      },
      {
        headerName: "Is Active",
        field: "isActive",
        width: 150,
      },
      {
        field: "Action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) { },
        },
        minWidth: 230,
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
    this.getMaster();
    this.getAllProductForRequisition();
    this.DiscountTypeList();
    this.GetAllDepo();
    //this.getCustomerList();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData();
  }

  LoadGridData() {
    this.PolicyService.GetSalesDiscountRatePolicy(0, this.depotCode,0, "").subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }

  ngOnInit() {
    localStorage.setItem("button", "");
    // if (this.selectedRow != undefined) {
    //   this.name = this.selectedRow.currencyName;
    //   this.description = this.selectedRow.aliasName;
    // }
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
      DiscountRateId: 0,
      productWiseSpecificationId: 0,
      partyId: 0,
      price: 0,
      discountType: "",
      percentAmount: 0,
      discountAmount: 0,
      amount: 0,
      fromDate: null,
      endDate: null,
      isActive: true,
    };
    this.productSpecListSelected = null;
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
    this.commonService.agButtonClicked = "";
    if (data == "edit") {
      this.commonService.valueSet('showlist');
      // this.agEdit(event);
      // this.show = false;
    } else if (data == "view") {
      this.commonService.valueSet('showlist');
      // this.agEdit(event);
      // this.show = false;
      // this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      if (confirm("Do you want to delete?")) {
        this.agDelete(event);
      }
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }


  private save() {

    this.show = true;
    var button = this.commonService.buttonClicked;

    this.master.fromDate = this.commonService.DateFormat(this.master.fromDate);
    this.master.endDate = this.commonService.DateFormat(this.master.endDate);
    if (this.master.discountType == "Customer Discount")
      this.master.productWiseSpecificationId = null;

    this.PolicyService.SaveDiscountRatePolicy(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        }
        else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        //////////////Grid Refresh ///////////////////
        this.getMaster();
        this.LoadGridData();
        //////////////Grid Refresh ///////////////////
        //
      }
    });
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
      let DiscountRateId = event.node.data.DiscountRateId;
      //alert(generalPolicyId);
      this.LoadGridData();
      this.ngOnInit();
    }
  }


  private agDelete(event) {
    let DiscountRateId = event.node.data.DiscountRateId;
    this.PolicyService.DeleteDiscountRatePolicy(DiscountRateId).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success(this.commonService.deletedmsg, "Message");

        //////////////Grid Refresh ///////////////////
        this.LoadGridData();
        //////////////Grid Refresh ///////////////////
      }
    });
  }
  unitVat: number = 0;
  public LoadPrice() {
    //alert(this.master.productWiseSpecificationId);
    this.PolicyService.GetitemPriceBySpecId(this.master.productWiseSpecificationId).subscribe((data: any) => {
      if (data.success) {
        this.master.price = data.data[0].price;
        this.unitVat = data.data[0].unitVat;
      }
    });
  }

  public isEnable = false;
  public isEnableP = false;
  public calculateAmount() {
    //debugger
    if (this.master.discountType == "Percentage" || this.master.discountType == "Customer Discount") {
      this.isEnableP = true;
      this.isEnable = false;
      this.master.discountAmount = 0;
      this.master.amount = this.roundToDigit((this.master.price - (this.master.price * (this.master.percentAmount / 100))), 2);
    } else {
      this.isEnable = true;
      this.isEnableP = false;
      this.master.percentAmount = 0;
      this.master.amount = this.roundToDigit((this.master.price - this.master.discountAmount), 2);
    }
  }

  roundToDigit(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

  depotList = [];
  depotSelected: any = {};

  public GetAllDepo() {
    this.depotSelected = {};

    let apiUrl = `SalesInvoice/GetAllDepot`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.depotList = returns.data.map((val: any) => ({
          id: val.depotCode,
          name: val.depotName,
        }));
        if (this.depotList && this.depotList.length == 1) {
          this.depotCode = this.depotList[0].id;
        }
      }
    })
  }

  public depotCode: string = '';
  public partiesSelected = {};
  public getCustomerList() {
    this.parties = null;
    this.partiesSelected = null;
    this.rowData = [];
    let apiUrl = `Party/GetPartyForDropdownJson?partyId=0&depotCode=${this.depotCode}`;

    //this.comboService.GetPartyForDropdownJson().subscribe((returns: any) => {
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.status) {
        this.parties = returns.data.map((val) => ({
          id: val.partyId,
          name: val.partyCodeName,
        }));
      }
    });
  }

  public productSpecList = [];
  public productSpecListSelected = {};
  public getAllProductForRequisition() {
    this.productSpecList = null;
    this.productSpecListSelected = null;
    this.productrequisitionService
      .getAllProductForRequisition()
      .subscribe((returns: any) => {
        this.productSpecList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
        }));
      });
  }

  discountTypeList: {};
  discountTypeSelected: {};
  DiscountTypeList() {
    this.discountTypeList = null;
    this.discountTypeSelected = null;
    this.discountTypeList = [
      {
        id: "Percentage",
        name: "Percentage",
      },
      {
        id: "Flat",
        name: "Flat",
      },
      {
        id: "Customer Discount",
        name: "Customer Discount",
      },
    ];
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