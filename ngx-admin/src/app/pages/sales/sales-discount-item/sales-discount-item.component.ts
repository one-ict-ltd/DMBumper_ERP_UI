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
import { CommoncomboService } from "app/services/commoncombo.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";

@Component({
  selector: 'ngx-sales-discount-item',
  templateUrl: './sales-discount-item.component.html',
  styleUrls: ['./sales-discount-item.component.scss']
})
export class SalesDiscountItemComponent implements OnInit {

  public pageNavigation = "Sales Discount Item Policy";
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

  disabledNew: boolean = true;
  loadFromDateShow: Date = new Date();
  loadToDateShow: Date = new Date();

  master: {
    DiscountItemId: number;
    bonusforSpecificationId: number;
    partyId: number;
    forQuantity: number;
    bonusSpecificationId: number;
    quantity: number;
    fromDate: Date;
    endDate: Date;
    isActive: true;
    isAll: boolean;
  };

  constructor(
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private comboService: CommoncomboService, private salesinvoiceService: SalesinvoiceService,
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
        width: 60,
      },
      {
        headerName: "Item",
        field: "productName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 260,
      },
      {
        headerName: "Qty. For",
        field: "forQuantity",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 110,
      },
      {
        headerName: "Discount Item",
        field: "bonusproductName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 230,
      },
      {
        headerName: "Discount Qty.",
        field: "quantity",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 140,
      },
      {
        headerName: "From Date",
        field: "fromDate",
        filter: "agTextColumnFilter",
        editable: false,
        width: 120,
      },
      {
        headerName: "To Date",
        field: "endDate",
        filter: "agTextColumnFilter",
        editable: false,
        width: 120,
      },
      {
        headerName: "Is Active",
        field: "isActive",
        width: 120,
      },
      {
        headerName: "Customer",
        field: "partyName",
        filter: "agTextColumnFilter",
        editable: false,
        width: 220,
      },
      {
        field: "Action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) { },
        },
        minWidth: 200,
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
    //this.getCustomerData();
    //this.getCustomerList();
    //this.loadFromDateShow.setDate(this.loadFromDateShow.getDate() - 1);
    this.getAllProductForRequisition();
  }

  onGridReady(params) {
    debugger
    let fromDate = this.commonService.DateFormat(this.loadFromDateShow);
    let endDate = this.commonService.DateFormat(this.loadToDateShow);
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.PolicyService.GetSalesDiscountItemPolicy(0, fromDate, endDate).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }
  GetGridData(){
    let fromDate = this.commonService.DateFormat(this.loadFromDateShow);
    let endDate = this.commonService.DateFormat(this.loadToDateShow);
    this.PolicyService.GetSalesDiscountItemPolicy(0, fromDate, endDate).subscribe((data: any) => {
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
    var date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
    var lastDay = new Date(y, m + 1, 0);
    this.master = {
      DiscountItemId: 0,
      bonusforSpecificationId: 0,
      partyId: null,
      forQuantity: null,
      bonusSpecificationId: 0,
      quantity: null,
      fromDate: new Date(),
      endDate: lastDay,
      isActive: true,
      isAll: true,
    };
    this.partiesSelected = null;
    this.productSpecListSelected = null;
    this.productSpecListBonusSelected = null;
    this.GetAllDepo();
  }
  checkAll(e) {
    debugger
    let isChecked: boolean = false;
    isChecked = e.target.checked;

    if (isChecked) {
      this.disabledNew = true;
      this.master.partyId = null;
      this.partiesSelected = null;
      this.depotList = [];
      this.depotSelected = null;
    }
    else {
      this.disabledNew = false;
      this.GetAllDepo();
    }
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
      this.agEdit(event);
      this.show = false;
    } else if (data == "view") {
      this.agEdit(event);
      this.show = false;
      this.disabled = true;
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

    this.PolicyService.SaveDiscountItemPolicy(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        }
        else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        //////////////Grid Refresh ///////////////////
        this.getMaster();
        this.PolicyService.GetSalesDiscountItemPolicy(0, this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)).subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
          this.loadFromDateShow = new Date();
          this.loadToDateShow = new Date();
        });
        //////////////Grid Refresh ///////////////////
        //
      }
      else {
        this.toastrService.danger(this.commonService.failedmsg, "Message");
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
      let DiscountItemId = event.node.data.DiscountItemId;
      //alert(generalPolicyId);
      this.PolicyService.GetSalesDiscountItemPolicy(DiscountItemId, this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];

          this.master.fromDate = new Date(data.data[0].fromDate);
          this.master.endDate = new Date(data.data[0].endDate);
          this.partiesSelected = { id: data.data[0].partyId, name: data.data[0].partyName };
          this.productSpecListSelected = { id: data.data[0].bonusforSpecificationId, name: data.data[0].productName };
          this.productSpecListBonusSelected = { id: data.data[0].bonusSpecificationId, name: data.data[0].bonusproductName };

          console.log(this.master);
        }
      });
      this.ngOnInit();
    }
  }


  private agDelete(event) {
    let DiscountItemId = event.node.data.DiscountItemId;
    if (confirm("Are you sure to delete this item delete?")) {
      this.PolicyService.DeleteDiscountItemPolicy(DiscountItemId).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.PolicyService.GetSalesDiscountItemPolicy(0, this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
          //////////////Grid Refresh ///////////////////
        }
      });
    }
  }

  // public partiesSelected = {};
  // public getCustomerData() {
  //   this.parties = null;
  //   this.partiesSelected = null;
  //   //this.salesinvoiceService.GetAllPartysByTypeId(0).subscribe((returns: any) => {
  //   this.comboService.GetPartyForDropdownJson().subscribe((returns: any) => {
  //     if (returns.status) {
  //       this.parties = returns.data.map((val) => ({
  //         id: val.partyId,
  //         name: val.partyCodeName,
  //         // id: val.partyId,
  //         // name: val.partyName,
  //         // address: val.address,
  //         // mobileNo: val.mobileNo,
  //         // territoryDetails: val.territoryDetails,
  //       }));
  //     }
  //   });
  // }
  public depotCode: string = '';
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
  public productSpecListBonusSelected = {};
  public getAllProductForRequisition() {
    this.productSpecList = null;
    this.productSpecListSelected = null;
    this.productSpecListBonusSelected = null;
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
  loadApprovalStatusList() {
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
    ];
  }

  ProductChange() {
    this.master.bonusSpecificationId = this.master.bonusforSpecificationId;
    this.productSpecListBonusSelected = this.productSpecListSelected;
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