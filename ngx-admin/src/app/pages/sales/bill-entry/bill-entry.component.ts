import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
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
  NbDateService,
} from "@nebular/theme";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";

@Component({
  selector: "ngx-bill-entry",
  templateUrl: "./bill-entry.component.html",
  styleUrls: ["./bill-entry.component.scss"],
})
export class BillEntryComponent implements OnInit {
  // NOTE: Bill API endpoints/SPs are not built yet. All bill service calls below
  // are commented with `TODO(bill-api)` so the page compiles and renders now.
  // Wire them once SaveTenderBill / GetChallanForBill / GetChallanDetailsForBillById /
  // GetTenderBillById / GetAllActivePartysForBillByTypeId exist on the API.

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

  types: NbComponentStatus[] = ["primary", "success", "info", "warning", "danger"];
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
  }

  /////Dynamic Button section (Do Not Edit)///////
  public pageNavigation = "Bill";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.getGridData();
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

  master: {
    billMasterId: number;
    billNo: string;
    billDate: string;
    billDateShow: Date;

    challanMasterId: number; // source challan
    challanSelected: any;

    storeId: number;
    partyId: number;
    partyName: string;
    partySelected: any;
    address: string;
    mobileNo: string;
    alternateMobileNo: string;

    totalPrice: number;
    totalGross: number;
    totalVat: number;
    totalAit: number;
    shippingCost: number;
    totalDiscountAmount: number;
    grandTotal: number;
    billStatus: string;

    isActive: number;
    isDelete: number;
    refNo: string;

    loadFromDateShow: Date;
    loadToDateShow: Date;

    lstDetailsViewModel: any[];
  };

  public getMaster() {
    this.master = {
      billMasterId: 0,
      billNo: "",
      billDate: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
      billDateShow: new Date(this.currentDate),

      challanMasterId: 0,
      challanSelected: null,

      storeId: 0,
      partyId: 0,
      partyName: "",
      partySelected: null,
      address: "",
      mobileNo: "",
      alternateMobileNo: "",

      totalPrice: 0,
      totalGross: 0,
      totalVat: 0,
      totalAit: 0,
      totalDiscountAmount: 0,
      grandTotal: 0,
      shippingCost: 0,

      billStatus: "",
      isActive: 1,
      isDelete: 0,
      refNo: "",

      loadFromDateShow: new Date(),
      loadToDateShow: new Date(),

      lstDetailsViewModel: [],
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
    if (this.master.billNo == null || this.master.billNo.trim() === "") {
      this.toastrService.warning("Please enter a Bill No.", "Warning");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.refNo == null || this.master.refNo.trim() === "") {
      this.toastrService.warning("Please enter a Ref No.", "Warning");
      this.commonService.valueSet("create");
      return false;
    }
    if (!this.master.lstDetailsViewModel || this.master.lstDetailsViewModel.length == 0) {
      this.toastrService.danger("Please select a Challan!", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    let flag = false;
    this.master.lstDetailsViewModel.forEach((element) => {
      if (element.isSelect == 1 && element.billQty == 0) {
        this.toastrService.danger("Please enter a Bill Quantity!", "Message");
        this.commonService.valueSet("create");
        return false;
      } else if (element.isSelect == 1 && element.billQty > 0) {
        flag = true;
      }
    });

    if (!flag) {
      this.toastrService.danger("No selected items found! ", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    var button = this.commonService.buttonClicked;

    this.salesinvoiceService.SaveTenderBill(this.master).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        this.show = true;
        this.getGridData();
        this.getMaster();
      } else {
        this.toastrService.warning(returns.message, "Message");
      }
    });
  }

  private reset() {
    this.getMaster();
  }
  //////////////////////////////// End CRUD /////////////////////////////////////////

  public getActualDate(event: any) {
    let dateCon = event.toLocaleDateString() + " " + event.toLocaleTimeString();
    if (dateCon != "") {
      this.master.billDate = dateCon;
    }
  }

  public partyList = [];
  public GetAllActivePartyByTypeId(partyTypeId: any) {
    this.partyList = [];
    this.salesinvoiceService.GetAllActivePartysForBillByTypeId(partyTypeId, 0, '').subscribe((returns: any) => {
      if (returns && returns.data) {
        this.partyList = returns.data.map((val: any) => ({
          id: val.partyId,
          name: val.partyName,
          address: val.address,
          mobileNo: val.mobileNo,
        }));
      }
    }, () => this.toastrService.danger('Failed to load customers.', 'Error'));
  }

  public GetPartyDetails() {
    if (!this.master.partySelected) return;
    this.master.partyId = this.master.partySelected["id"] || 0;
    this.master.address = this.master.partySelected["address"] || "";
    this.master.mobileNo = this.master.partySelected["mobileNo"] || "";
    this.master.lstDetailsViewModel = [];
    this.master.totalGross = 0;
    this.master.grandTotal = 0;
    this.GetChallanForBill(this.master.partyId);
  }

  public challanList = [];
  public GetChallanForBill(partyId: any) {
    this.challanList = [];
    this.salesinvoiceService.GetChallanForBill(partyId).subscribe((returns: any) => {
      if (returns && returns.data) {
        this.challanList = returns.data.map((val: any) => ({
          id: val.challanMasterId,
          name: val.challanNo,
        }));
      }
    }, () => this.toastrService.danger('Failed to load Challans.', 'Error'));
  }

  GetChallanDetailsForBillById(challanMasterId: any) {
    this.master.lstDetailsViewModel = [];
    if (challanMasterId > 0) {
      this.salesinvoiceService.GetChallanDetailsForBillById(challanMasterId).subscribe((returns: any) => {
        if (returns.success) {
          // The SP returns the challan line's Total; a new bill line starts at billQty 0,
          // so reset Total to 0 and let CalculateRowTotal fill it as the user types.
          this.master.lstDetailsViewModel = (returns.data || []).map((d: any) => ({
            ...d,
            billQty: 0,
            Total: 0,
          }));
          this.CalculateSummary();
        }
      });
    }
  }

  public currencyFormatter(currency: any) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  checkChange(e: any, rowIndex: number) {
    if (e.target.checked) {
      this.master.lstDetailsViewModel[rowIndex].isSelect = 1;
    } else {
      this.master.lstDetailsViewModel[rowIndex].isSelect = 0;
    }
    this.CalculateSummary();
  }

  CalculateSummary() {
    this.master.totalGross = 0;
    this.master.grandTotal = 0;
    this.master.lstDetailsViewModel.forEach((element) => {
      if (element.isSelect) {
        this.master.totalGross += element.billQty * element.price;
      }
    });
    this.master.totalGross = this.commonService.roundWithDecimalPoint(this.master.totalGross, 0);
    this.master.grandTotal =
      this.master.totalGross + this.master.totalVat + this.master.totalAit + this.master.shippingCost - this.master.totalDiscountAmount;
  }

  ValidateBillQtys(rowIndex: number) {
    const row = this.master.lstDetailsViewModel[rowIndex];

    if (row.billQty == null || row.billQty === "" || isNaN(row.billQty) || row.billQty < 0) {
      row.billQty = 0;
    }
    if (row.billQty > row.balanceQty) {
      row.billQty = row.balanceQty;
      this.toastrService.danger("Bill Quantity can't exceed Balance Quantity!", "Message");
      this.commonService.valueSet("create");
    }
    this.CalculateRowTotal(rowIndex);
  }

  // Bill price is independent of the challan price, so it is freely editable.
  ValidateUnitPrice(rowIndex: number) {
    const row = this.master.lstDetailsViewModel[rowIndex];

    if (row.price == null || row.price === "" || isNaN(row.price) || row.price < 0) {
      row.price = 0;
      this.toastrService.warning("Unit Price can't be negative!", "Message");
    }
    this.CalculateRowTotal(rowIndex);
  }

  CalculateRowTotal(rowIndex: number) {
    const row = this.master.lstDetailsViewModel[rowIndex];
    row.Total = (Number(row.billQty) || 0) * (Number(row.price) || 0);
    this.CalculateSummary();
  }

  minDate: Date = new Date();
  maxDate: Date = new Date();
  currentDate: Date = new Date();
  getServerDateTime() {
    let apiUrl = `menu/getServerDateTime`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.currentDate = new Date(returns.data[0].currentDate);
        this.minDate = this.dateService.addDay(new Date(returns.data[0].minVoucherDatePV), 0);
        this.maxDate = this.dateService.addDay(new Date(returns.data[0].maxVoucherDatePV), 0);
      } else {
        this.currentDate = new Date();
        this.minDate = this.dateService.addDay(new Date(), -0);
        this.maxDate = this.dateService.addDay(new Date(), 0);
      }
    });
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
    private salesinvoiceService: SalesinvoiceService,
    private datePipe: DatePipe,
    protected dateService: NbDateService<Date>
  ) {
    this.commonService.valueSet("showlist");

    this.columnDefs = [
      { headerName: "#", colId: "rowNum", valueGetter: "node.rowIndex + 1", pinned: "left", filter: false, width: 50 },
      { headerName: "Bill No", field: "billNo", filter: "agTextColumnFilter", width: 250 },
      { headerName: "Bill Date", field: "billDate", filter: "agTextColumnFilter", width: 140 },
      { headerName: "Party Code", field: "partyCode", filter: "agTextColumnFilter", width: 150 },
      { headerName: "Party Name", field: "partyName", filter: "agTextColumnFilter", width: 280 },
      { headerName: "Address", field: "address", filter: "agTextColumnFilter", width: 280 },
      { headerName: "Status", field: "billStatus", filter: "agTextColumnFilter", width: 120 },
      {
        headerName: "Net Total",
        field: "grandTotal",
        filter: "agNumberColumnFilter",
        valueFormatter: (params) => this.currencyFormatter(params.data.grandTotal),
        type: "rightAligned",
        width: 130,
      },
      {
        field: "action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) {
            localStorage.setItem("button", field);
          },
        },
        minWidth: 250,
        editable: false,
        pinned: "right",
      },
    ];
    this.frameworkComponents = { btnCellRenderer: BtnCellRenderer };
    this.defaultColDef = { sortable: true, resizable: true, filter: true };

    this.getMaster();
    this.getServerDateTime();
    this.GetAllActivePartyByTypeId(0);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getGridData();
  }

  public getGridData() {
    const fromDate = this.master.loadFromDateShow;
    const toDate = this.master.loadToDateShow;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.salesinvoiceService.GetTenderBillById(0,
        this.commonService.DateFormat(this.master.loadFromDateShow),
        this.commonService.DateFormat(this.master.loadToDateShow)).subscribe((data: any) => {
        if (data.success) { this.rowData = data.data; }
      });
    } else {
      alert("To Date cannot be earlier than From Date.");
    }
  }

  ////////////////////////////////// Ag Grid Data Load/////////////////////////////////
  private selectedRows = [];
  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    if (data == "edit") {
      this.commonService.valueSet("showlist");
      this.toastrService.info("Not Allowed", "Info");
    } else if (data == "view") {
      this.commonService.valueSet("showlist");
      this.toastrService.info("Not Allowed", "Info");
    } else if (data == "transectionreport" || data == "print") {
      this.agReport(event);
    } else if (data == "delete") {
      this.commonService.valueSet("showlist");
      this.toastrService.info("Not Allowed", "Info");
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  private agReport(event) {
    this.getCrReport(event.data.billMasterId);
  }

  private getCrReport(billMasterId: any, reportFormat: any = "Pdf") {
    this.salesinvoiceService.GetTenderBillReportById(billMasterId, reportFormat).subscribe((returns: any) => {
      const res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning(this.commonService.nodatafound, "Warning");
      }
    }, () => {
      this.toastrService.danger("Failed to generate bill report.", "Error");
    });
  }

  @Output() myEvent = new EventEmitter();
  public apiUrl = "";
}
