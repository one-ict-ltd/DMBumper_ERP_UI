import { Component, OnInit } from "@angular/core";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import {
  NbComponentStatus,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";

@Component({
  selector: "ngx-quotation-approval",
  templateUrl: "./quotation-approval.component.html",
  styleUrls: ["./quotation-approval.component.scss"],
})
export class QuotationApprovalComponent implements OnInit {
  disabled: boolean = false;
  config: NbToastrConfig;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  status: NbComponentStatus = "primary";
  show: boolean = true;

  private gridApi;
  private gridColumnApi;
  private selectedRow: any;

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: { btnCellRenderer: typeof BtnCellRenderer };

  public pageNavigation = "Quotation Approval";
  public buttons = this.commonService.btnList;

  constructor(
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private salesinvoiceService: SalesinvoiceService
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
      { headerName: "Customer Name", field: "partyName", width: 220 },
      { headerName: "Address", field: "address", width: 220 },
      {
        headerName: "Net Total",
        field: "grandTotal",
        width: 120,
        valueFormatter: (params) => this.commonService.currencyFormatter(params.data.grandTotal),
        type: "rightAligned",
      },
      { headerName: "Status", field: "approveStatus", width: 120 },
      {
        field: "Action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: { clicked: function (field: any) {} },
        minWidth: 150,
        editable: false,
        filter: false,
        pinned: "right",
      },
    ];

    this.frameworkComponents = { btnCellRenderer: BtnCellRenderer };
    this.defaultColDef = { sortable: true, resizable: true, filter: true };
  }

  ngOnInit() {
    localStorage.setItem("button", "");
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.loadGridData(1);
  }

  loadGridData(isApproved: number) {
    this.salesinvoiceService.GetALLTenderQuotationApproval(isApproved).subscribe((data: any) => {
      if (data.success) {
        if (isApproved == 1)
          this.rowData = data.data;
        else
          this.master.lstMasterViewModel = data.data;
      }
    });
  }

  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    const data = this.commonService.agButtonClicked;
    this.commonService.agButtonClicked = "";
    if (data === "transectionreport") {
      this.agReport(event);
    } else if (data === "view") {
      this.toastrService.info("Not allowed.", "Info");
    } else if (data === "edit") {
      this.toastrService.info("Not allowed.", "Info");
    } else {
      this.toastrService.info("Please click a button.", "Info");
    }
  }

  private agReport(event) {
    this.printQuotation(event.node.data.quotationMasterId);
  }

  public printQuotation(quotationMasterId: any) {
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

  public ButtonAction() {
    if (this.commonService.buttonClicked === "create") {
      this.getMaster();
      this.loadGridData(0);
      this.show = false;
    } else if (this.commonService.buttonClicked === "showlist") {
      this.show = true;
      this.loadGridData(1);
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
    approvalStatusValue: number;
    approvalStatus: string;
    lstMasterViewModel: any[];
  };

  getMaster() {
    this.master = {
      approvalStatusValue: 1,
      approvalStatus: "Approve",
      lstMasterViewModel: [],
    };
    this.loadApprovalStatusList();
  }

  ApprovalStatusList: any[];
  ApprovalStatusSelected: any;

  loadApprovalStatusList() {
    this.ApprovalStatusList = [
      { id: 1, name: "Approve" },
      { id: 0, name: "Pending" },
    ];
    this.ApprovalStatusSelected = { id: 1, name: "Approve" };
    this.master.approvalStatusValue = 1;
  }

  isSelectAll: boolean = false;
  ToggleChange(event: any) {
    const isChecked: boolean = event.target.checked;
    this.master.lstMasterViewModel.forEach(element => {
      element.isSelect = isChecked;
    });
  }

  SaveValidation(): boolean {
    const count = this.master.lstMasterViewModel.filter(e => e.isSelect).length;
    if (count === 0) {
      this.toastrService.danger("Please select at least one quotation for approval.", "Message");
      return false;
    }
    return true;
  }

  private save() {
    if (this.master.approvalStatusValue == null) {
      this.toastrService.danger("Please select an approval status.", "Message");
      return;
    }
    if (!this.SaveValidation()) return;

    this.salesinvoiceService.SaveTenderQuotationApproval(this.master).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success(this.commonService.successmsg, "Message");
        this.show = true;
        this.loadGridData(1);
      } else {
        this.toastrService.warning(this.commonService.failedmsg, "Message");
      }
    });
    this.getMaster();
  }
}
