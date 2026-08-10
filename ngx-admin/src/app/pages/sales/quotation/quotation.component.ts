import { Component, OnInit } from "@angular/core";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { DatePipe } from "@angular/common";
import {
  NbComponentStatus,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";

@Component({
  selector: "ngx-quotation",
  templateUrl: "./quotation.component.html",
  styleUrls: ["./quotation.component.scss"],
})
export class QuotationComponent implements OnInit {
  disabled: boolean = false;
  isDisabled: boolean = false;
  config: NbToastrConfig;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  status: NbComponentStatus = "primary";

  loadFromDateShow: Date = new Date();
  loadToDateShow: Date = new Date();
  show: boolean = true;

  private gridApi;
  private gridColumnApi;
  private selectedRow: any;
  private selectedRows = [];

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: { btnCellRenderer: typeof BtnCellRenderer };

  constructor(
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private productrequisitionService: ProductrequisitionService,
    private salesinvoiceService: SalesinvoiceService,
    private datePipe: DatePipe,
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
      },
      { headerName: "Quotation No.", field: "quotationNo", width: 180 },
      { headerName: "Date", field: "quotationDate", width: 130 },
      { headerName: "Customer Name", field: "partyName", width: 320 },
      { headerName: "Address", field: "address", width: 380 },
      {
        headerName: "Net Total",
        field: "grandTotal",
        width: 120,
        valueFormatter: (params) => this.commonService.currencyFormatter(params.data.grandTotal),
        type: "rightAligned",
      },
      { headerName: "Status", field: "status", flex: 1 },
      {
        field: "Action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: { clicked: function (field: any) { } },
        minWidth: 250,
        editable: false,
        filter: false,
        pinned: "right",
      },
    ];

    this.frameworkComponents = { btnCellRenderer: BtnCellRenderer };
    this.defaultColDef = { sortable: true, resizable: true, filter: true };

    this.getMaster();
    this.getAllProductForRequisition();
    this.GetAllActivePartyByTypeId(0);
  }

  ngOnInit() {
    localStorage.setItem("button", "");
    this.GetAllActivePartyByTypeId(0);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.GetGridData();
  }

  GetGridData() {
    this.salesinvoiceService
      .GetTenderQuotationById(0, this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow))
      .subscribe((data: any) => {
        if (data.success) this.rowData = data.data;
      });
  }

  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    const data = this.commonService.agButtonClicked;
    this.commonService.agButtonClicked = "";
    if (data === "edit" || data === "view") {
      if (data === "edit" && event.node.data.status === "Approve") {
        this.toastrService.warning("This quotation is approved and cannot be edited.", "Warning");
        return;
      }
      this.loadQuotationForEdit(event.node.data, data === "view");
    } else if (data === "delete") {
      if (event.node.data.status === "Approve") {
        this.toastrService.warning("This quotation is approved and cannot be deleted.", "Warning");
        return;
      }
      this.deleteQuotation(event.node.data.quotationMasterId);
    } else if (data === "transectionreport") {
      this.agReport(event);
    } else {
      this.toastrService.info("Please click a button.", "Info");
    }
  }

  private loadQuotationForEdit(row: any, readOnly: boolean) {
    this.master.salesInvoiceId = row.quotationMasterId;
    this.master.salesInvoiceNo = row.quotationNo;
    this.master.salesInvoiceDate = row.quotationDate;
    this.master.partyId = row.partyId;
    this.master.address = row.address;
    this.master.mobileNo = row.mobileNo;
    this.master.totalGross = row.totalGross;
    this.master.grandTotal = row.grandTotal;
    this.master.refNo = row.refNo || '';
    this.master.partySelected = { id: row.partyId, name: row.partyName, address: row.address, mobileNo: row.mobileNo };

    this.salesinvoiceService.GetTenderQuotationDetailsById(row.quotationMasterId).subscribe((returns: any) => {
      if (returns && returns.data) {
        this.master.lstDetailsViewModel = returns.data.map((d: any) => ({
          quotationDetailsId: d.quotationDetailsId,
          productWiseSpecificationId: d.productWiseSpecificationId,
          productId: d.productId,
          productName: d.productName,
          uomId: d.uomId,
          uomName: d.uomName,
          invoiceQty: d.invoiceQty,
          price: d.price,
          vat: d.vat,
          discountAmount: d.discountAmount,
          total: d.Total || d.total,
          specification: d.specification,
        }));
        this.calculateGrandTotal();
      }
    });

    this.disabled = readOnly;
    this.show = false;
  }

  private deleteQuotation(quotationMasterId: number) {
    if (!confirm('Are you sure you want to delete this quotation?')) return;
    this.salesinvoiceService.DeleteTenderQuotationById(quotationMasterId).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success('Quotation deleted successfully.', 'Success');
        this.GetGridData();
      } else {
        this.toastrService.danger(returns.message || 'Failed to delete quotation.', 'Error');
      }
    }, () => {
      this.toastrService.danger('Failed to delete quotation.', 'Error');
    });
  }

  private agReport(event) {
    const quotationMasterId = event.node.data.quotationMasterId;
    this.salesinvoiceService.GetTenderQuotationReportById(quotationMasterId, "Pdf").subscribe((returns: any) => {
      const res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning(this.commonService.nodatafound, "Warning");
      }
    }, () => {
      this.toastrService.danger("Failed to generate report.", "Error");
    });
  }

  public pageNavigation = "Quotation";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked === "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked === "showlist") {
      this.getMaster();
      this.GetGridData();
      this.show = true;
    } else if (this.commonService.buttonClicked === "save") {
      this.save();
    } else if (this.commonService.buttonClicked === "update") {
      this.save();
    } else if (this.commonService.buttonClicked === "reset") {
      this.getMaster();
    }
  }

  public agButtonAction() {
    if (this.commonService.agButtonClicked === "pin") {
      this.commonService.onPin(this.gridColumnApi);
    } else if (this.commonService.agButtonClicked === "unpin") {
      this.commonService.onClear(this.gridColumnApi);
    } else if (this.commonService.agButtonClicked === "refresh") {
      window.location.reload();
    } else if (this.commonService.agButtonClicked === "csv") {
      this.commonService.onExportCSV(this.gridApi, this.pageNavigation);
    }
  }

  master: {
    salesInvoiceId: number;
    salesInvoiceNo: string;
    salesInvoiceDate: Date;

    partyId: number;
    partyName: string;
    partySelected: any;
    address: string;
    mobileNo: string;

    uomName: string;
    uomId: number;
    productId: number;
    productWiseSpecificationId: number;
    productName: string;
    productSpecSelected: any;

    price: number;
    invoiceQty: number;
    vat: number;
    discountAmount: number;
    totalPrice: number;
    tTotal: number;

    totalGross: number;
    grandTotal: number;

    specification: string;
    refNo: string;

    isActive: number;
    isDelete: number;

    lstDetailsViewModel: any[];
  };

  getMaster() {
    this.master = {
      salesInvoiceId: 0,
      salesInvoiceNo: "",
      salesInvoiceDate: new Date(),

      partyId: 0,
      partyName: "",
      partySelected: null,
      address: "",
      mobileNo: "",

      uomName: "",
      uomId: 0,
      productId: 0,
      productWiseSpecificationId: 0,
      productName: "",
      productSpecSelected: null,

      price: 0,
      invoiceQty: 0,
      vat: 0,
      discountAmount: 0,
      totalPrice: 0,
      tTotal: 0,

      totalGross: 0,
      grandTotal: 0,

      specification: "",
      refNo: "",

      isActive: 1,
      isDelete: 0,

      lstDetailsViewModel: [],
    };
    this.getMaxNo();
  }

  public partyList = [];
  public GetAllActivePartyByTypeId(partyTypeId: any) {
    this.partyList = [];
    this.salesinvoiceService.GetAllActivePartysByTypeId(partyTypeId, 0, '').subscribe((returns: any) => {
      if (returns && returns.data) {
        this.partyList = returns.data.map((val: any) => ({
          id: val.partyId,
          name: val.partyName,
          address: val.address,
          mobileNo: val.mobileNo,
        }));
      }
    }, (error) => {
      this.toastrService.danger('Failed to load customers.', 'Error');
    });
  }

  public GetPartyDetails() {
    if (!this.master.partySelected) return;
    this.master.partyId = this.master.partySelected["id"] || 0;
    this.master.address = this.master.partySelected["address"] || "";
    this.master.mobileNo = this.master.partySelected["mobileNo"] || "";
    this.master.lstDetailsViewModel = [];
    this.master.totalGross = 0;
    this.master.grandTotal = 0;
  }

  public productSpecList = [];
  public getAllProductForRequisition() {
    this.productrequisitionService.getAllProductForRequisition().subscribe((returns: any) => {
      this.productSpecList = returns.data.map((val: any) => ({
        id: val.productWiseSpecificationId,
        name: val.productName,
        uomId: val.uomId,
        uomName: val.uomName,
        productId: val.productId,
        tradePrice: val.tradePrice,
        unitVat: val.unitVat,
      }));
    });
  }

  public getProductSpecDetails() {
    if (!this.master.productSpecSelected) return;
    this.master.productId = this.master.productSpecSelected["productId"];
    this.master.uomName = this.master.productSpecSelected["uomName"];
    this.master.productName = this.master.productSpecSelected["name"];
    this.master.productWiseSpecificationId = this.master.productSpecSelected["id"];
    this.master.price = this.master.productSpecSelected["tradePrice"] || 0;
    this.master.vat = this.master.productSpecSelected["unitVat"] || 0;
    this.master.discountAmount = 0;
    this.master.invoiceQty = 1;
    this.CalculateTotalPrice();
  }

  public getMaxNo() {
    const date = this.datePipe.transform(this.master.salesInvoiceDate, "yyyy-MM-dd");
    this.salesinvoiceService.GetMaxSalesInvoiceNumber(date).subscribe((returns: any) => {
      if (returns && returns.success) {
        this.master.salesInvoiceNo = returns.data[0].MaxNo;
      }
    });
  }

  public CalculateTotalPrice() {
    const qty = this.master.invoiceQty || 0;
    const price = this.master.price || 0;
    const vat = this.master.vat || 0;
    const disc = this.master.discountAmount || 0;
    this.master.totalPrice = this.round(price * qty, 2);
    this.master.tTotal = this.round((price * qty) + (vat * qty) - (disc * qty), 2);
  }

  public calculateTotal(index: number) {
    const row = this.master.lstDetailsViewModel[index];
    const qty = row.invoiceQty || 0;
    const price = row.price || 0;
    const vat = row.vat || 0;
    const disc = row.discountAmount || 0;
    row.total = this.round((price * qty) + (vat * qty) - (disc * qty), 2);
    this.calculateGrandTotal();
  }

  public calculateGrandTotal() {
    let gross = 0;
    for (const row of this.master.lstDetailsViewModel) {
      gross += row.total || 0;
    }
    this.master.totalGross = this.round(gross, 2);
    this.master.grandTotal = this.round(gross, 2);
  }

  private round(value: number, decimals: number): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  public addToDetailsGrid() {
    if (!this.master.productSpecSelected) {
      this.toastrService.warning("Please select a product.", "Warning");
      return;
    }
    if (!this.master.invoiceQty || this.master.invoiceQty <= 0) {
      this.toastrService.warning("Please enter a valid quantity.", "Warning");
      return;
    }
    if (!this.master.price || this.master.price <= 0) {
      this.toastrService.warning("Please enter a unit price.", "Warning");
      return;
    }

    const alreadyAdded = this.master.lstDetailsViewModel.some(
      (item: any) => item.productWiseSpecificationId === this.master.productWiseSpecificationId
    );
    if (alreadyAdded) {
      this.toastrService.warning("This product has already been added.", "Warning");
      return;
    }

    const qty = this.master.invoiceQty || 0;
    const price = this.master.price || 0;
    const vat = this.master.vat || 0;
    const disc = this.master.discountAmount || 0;

    this.master.lstDetailsViewModel.push({
      productWiseSpecificationId: this.master.productWiseSpecificationId,
      productName: this.master.productName,
      uomName: this.master.uomName,
      uomId: this.master.uomId,
      productId: this.master.productId,
      invoiceQty: qty,
      price: price,
      vat: vat,
      discountAmount: disc,
      total: this.round((price * qty) + (vat * qty) - (disc * qty), 2),
    });

    this.calculateGrandTotal();

    this.master.productSpecSelected = null;
    this.master.productWiseSpecificationId = 0;
    this.master.productName = "";
    this.master.uomName = "";
    this.master.uomId = 0;
    this.master.productId = 0;
    this.master.price = 0;
    this.master.invoiceQty = 0;
    this.master.vat = 0;
    this.master.discountAmount = 0;
    this.master.totalPrice = 0;
    this.master.tTotal = 0;
  }

  public deleteDetails(index: number) {
    this.master.lstDetailsViewModel.splice(index, 1);
    this.calculateGrandTotal();
  }

  private save() {
    if (!this.master.salesInvoiceNo || this.master.salesInvoiceNo.trim() === "") {
      this.toastrService.warning("Please enter a quotation number.", "Warning");
      return;
    }
    if (!this.master.partySelected) {
      this.toastrService.warning("Please select a customer.", "Warning");
      return;
    }
    if (!this.master.lstDetailsViewModel || this.master.lstDetailsViewModel.length === 0) {
      this.toastrService.warning("Please add at least one product.", "Warning");
      return;
    }

    const payload = {
      quotationMasterId: this.master.salesInvoiceId || 0,
      quotationNo: this.master.salesInvoiceNo,
      quotationDate: this.commonService.DateFormat(this.master.salesInvoiceDate),
      paymentDate: null,
      partyId: this.master.partyId,
      address: this.master.address,
      mobileNo: this.master.mobileNo,
      alternateMobileNo: '',
      storeId: null,
      totalGross: this.master.totalGross,
      totalVat: 0,
      totalAit: 0,
      shippingCost: 0,
      totalDiscountAmount: 0,
      grandTotal: this.master.grandTotal,
      approvalStatus: 0,
      refNo: this.master.refNo || '',
      transactionTypeId: null,
      lstDetailsViewModel: this.master.lstDetailsViewModel.map((item: any) => ({
        quotationDetailsId: 0,
        productId: item.productId,
        productWiseSpecificationId: item.productWiseSpecificationId,
        invoiceQty: item.invoiceQty,
        price: item.price,
        vat: item.vat,
        ait: 0,
        discountAmount: item.discountAmount || 0,
        Total: item.total,
        barcodeId: null,
        serialNo: '',
        hasNationalBonus: false,
        specification: this.master.specification || '',
        remarks: '',
        isActive: true,
        isSelect: true,
      })),
    };

    this.salesinvoiceService.SaveTenderQuotation(payload).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success('Quotation saved successfully.', 'Success');
        this.getMaster();
        this.show = true;
        this.GetGridData();
      } else {
        this.toastrService.danger(returns.message || 'Failed to save quotation.', 'Error');
      }
    }, () => {
      this.toastrService.danger('Failed to save quotation.', 'Error');
    });
  }
}
