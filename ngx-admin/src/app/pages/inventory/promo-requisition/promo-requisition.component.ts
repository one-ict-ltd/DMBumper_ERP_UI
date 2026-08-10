import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import {
  NbComponentStatus,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { PurchaserequisitionService } from "app/pages/purchase/settings/purchaserequisition.service";
import { PromoRequisitionService } from "../settings/promo-requisition.service";


@Component({
  selector: 'ngx-promo-requisition',
  templateUrl: './promo-requisition.component.html',
  styleUrls: ['./promo-requisition.component.scss']
})
export class PromoRequisitionComponent implements OnInit {

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
    promoRequisitionId: number;
  };

  protected options: {};
  protected cd: ChangeDetectorRef;
  showMessages: any = {};
  errors: string[];
  apiUrl: string;

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

  show: boolean = true;
  showList: boolean = false;
  showpo: boolean = true;
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

  public pageNavigation = "Promo Requisition";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
      this.showList = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
      this.showList = false;
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
      promoRequisitionId: 0
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
    this.show = true;
    this.purchaserequisitionService
      .savePurchaseRequisition(this.master)
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

          this.getMaster();
          this.purchaserequisitionService
            .getPurchaseRequisition()
            .subscribe((data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            });
        }
      });
  }

  private reset() {
    this.getMaster();
  }

  onRefesh() {
    this.selectedRow = "";
    this.ngOnInit();
    //this.onGridReady;
    this.toastrService.warning("warning", this.commonService.warningmsg);
  }

  onEditGrid() {
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
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private purchaserequisitionService: PurchaserequisitionService,
    private promoRequisitionService: PromoRequisitionService) {
    this.commonService.valueSet("showlist");

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
        headerName: "Promo Requisition No",
        field: "promoRequisitionNo",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 220,
      },
      {
        headerName: "Promo Req. Date",
        field: "promoRequisitionDate",
        width: 220,
      },
      {
        headerName: "Program Name",
        field: "programName",
        width: 220,
      },
      {
        field: "Action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function () { },
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
    debugger;
    this.gridColumnApi = params.columnApi;
    this.apiUrl = "";
    this.apiUrl = `Promo/GetPromoRequisitionMaster`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.rowData = returns.data.map(item => ({
          ...item,
          promoRequisitionDate: this.formatDate(item.promoRequisitionDate)
        }));
      }
    });
  }

  formatDate(inputDate: string): string {
    const date = new Date(inputDate);
    const day = date.getDate();
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${day}-${monthNames[monthIndex]}-${year}`;
  }

  getSelectedRowData() {
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map((node) => node.data);
    alert(`${JSON.stringify(selectedData)}`);
    this.name = selectedData[0].currencyName;
    return selectedData;
  }
  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    debugger;
    var data = this.commonService.agButtonClicked;
    this.commonService.agButtonClicked = "";
    if (data == "edit") {
      this.toastrService.info("Access denied!", "Message");
      this.commonService.valueSet("craete");
      return false;
      //this.agEdit(event);
      //this.show = false;
      //this.showList = true;
    } else if (data == "view") {
      this.toastrService.info("Access denied!", "Message");
      this.commonService.valueSet("craete");
      return false;
      // this.agEdit(event);
      // this.show = false;
      // this.showList = true;
      // this.disabled = true;
    } else if (data == "transectionreport") {
      this.toastrService.info("Access denied!", "Message");
      this.commonService.valueSet("craete");
      return false;
      //this.agReport(event);
    } else if (data == "delete") {
      this.agDelete(event);
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  private agEdit(event) {
    this.master.lstReqDetailsViewModel = [];
    this.master.promoRequisitionId = event.node.data.promoRequisitionId;
    this.promoRequisitionService
      .getPromoRequisitionDetailsById(this.master.promoRequisitionId)
      .subscribe((data: any) => {
        if (data.success) {
          debugger;
          this.master.lstReqDetailsViewModel.push(...data.data);
        }
      });
    this.ngOnInit();
  }
  private agReport(event) {
    this.generateCrReport("Pdf", event.node.data.promoRequisitionId);
  }

  generateCrReport(reportFormat: any, promoRequisitionId: any) {
    debugger;
    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `PromoReport/PromoRequisitionReport?promoRequisitionId=${promoRequisitionId}&employeeId=${userInfo[0].employeeid}&reportFormat=${reportFormat}`;

    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      debugger;
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }
  private agDelete(event) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      let user = this.commonService.GetUserProfileJson();
      this.master.promoRequisitionId = event.node.data.promoRequisitionId;
      this.promoRequisitionService
        .deletePromoRequisitionById(user[0].employeeid, this.master.promoRequisitionId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(this.commonService.deletedmsg, "Message");
            this.apiUrl = "";
            this.apiUrl = `Promo/GetPromoRequisitionMaster`;
            this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
              if (returns.success) {
                this.rowData = returns.data.map(item => ({
                  ...item,
                  promoRequisitionDate: this.formatDate(item.promoRequisitionDate)
                }));
              }
            });
          }
        });
    }
  }
  public refesh() {
    this.master.lstReqDetailsViewModel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
  }
}

