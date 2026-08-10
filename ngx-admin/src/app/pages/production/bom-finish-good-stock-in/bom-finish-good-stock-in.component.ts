import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";
import { StockinService } from "app/services/inventory/stockin.service";
import { StockinwithoutpoService } from "app/services/inventory/Stockinwithoutpo.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { BomFinishGoodStockInService } from "app/services/production/bom-finish-good-stock-in.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "ngx-bom-finish-good-stock-in",
  templateUrl: "./bom-finish-good-stock-in.component.html",
  styleUrls: ["./bom-finish-good-stock-in.component.scss"],
})
export class BomFinishGoodStockInComponent implements OnInit {
  pageNavigation = "BOM FINISH GOODS STOCK IN";
  buttons = this.commonService.btnList;

  company: {
    name: string;
    address: string;
    custom_footer: boolean;
    phone: string;
    fax: string;
    email: string;
    website: string;
    vat: string;
    tin: string;
  };

  master: {
    bomStockInId: number;
    companyId: number;
    sbuId: number;
    storeId: number;
    isActive: number;
    stockInNo: string;
    stockInDate: Date;
    remarks: string;
    lstDetailsViewModel: any[];
  };

  bomId: number = 0;
  qty: number = 0;
  CurrentStock: number = 0;
  productWiseSpecificationId: number = 0;
  productId: number = 0;
  sbus = [];
  bomProductSpecList: {};
  companySelected: {};
  supplierSelected: {};
  branchSelected: {};
  storeSelected: {};
  POReceiveSelected: {};
  prodReqSelected: {};
  productSelected: {};
  bomProductspecificationSelected: {};

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

  show: boolean = true;
  vlucherForm: FormGroup;
  submitted: boolean;
  saveupdate: string = "Save";
  gridbutton: string = "";
  name: string;
  description: string;
  selectedRow: any;

  selectdetailRows = [];
  gridApi;
  gridColumnApi;
  modules: Module[] = AllCommunityModules;
  columnDefs;
  defaultColDef;
  rowData: [];
  frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  constructor(
    private http: HttpClient,
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private PurchaseorderService: PurchaseorderService,
    private StockinService: StockinService,
    private StockinwithoutpoService: StockinwithoutpoService,
    private comboService: CommoncomboService,
    private BomFinishGoodStockInService: BomFinishGoodStockInService,
    private datePipe: DatePipe
  ) {
    this.commonService.valueSet("showlist");
    this.loadAllDropdown();
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
        headerName: "BOM Stock-In No",
        field: "stockInNo",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 120,
      },
      {
        headerName: "Stock-In Date",
        field: "stockInDate",
        width: 160,
      },
      {
        headerName: "companyName",
        field: "companyName",
        width: 140,
      },
      {
        headerName: "Store Name",
        field: "storeName",
        width: 160,
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
    this.getMaster();
  }

  ngOnInit() {
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }

  ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.GetMaxBomFinishGoodStockInNumber();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      if (this.validationForMasterSave() == false) {
        this.commonService.valueSet("create");
        return;
      }
      this.save();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      if (this.validationForMasterSave() == false) {
        this.commonService.valueSet("edit");
        return;
      }
      this.save();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

  getMaster() {
    this.master = {
      bomStockInId: 0,
      companyId: 0,
      sbuId: 0,
      storeId: 0,
      isActive: 1,
      stockInNo: "",
      stockInDate: new Date(),
      remarks: "",
      lstDetailsViewModel: [],
    };
    this.GetMaxBomFinishGoodStockInNumber();
  }

  loadAllDropdown() {
    this.getCompany();
    this.GetBomFinishGoodProductSpec();
  }

  GetMaxBomFinishGoodStockInNumber() {
    this.BomFinishGoodStockInService.GetMaxBomFinishGoodStockInNumber(
      this.commonService.DateFormat(this.master.stockInDate)
    ).subscribe((returns: any) => {
      if (returns.success) {
        this.master.stockInNo = returns.data[0].MaxNo;
      }
    });
  }

  validationForMasterSave(): boolean {
    if (this.companySelected == null) {
      this.toastrService.warning("Please select company.", "Message");
      return false;
    }
    if (this.branchSelected == null) {
      this.toastrService.warning("Please select branch.", "Message");
      return false;
    }
    if (this.storeSelected == null) {
      this.toastrService.warning("Please select store.", "Message");
      return false;
    }
    if (this.master.stockInDate == null) {
      this.toastrService.warning("Please select stock date.", "Message");
      return false;
    }
    if (
      this.master.lstDetailsViewModel.length == 0 ||
      this.master.lstDetailsViewModel == null
    ) {
      this.toastrService.warning("Please add BOM Product", "Message");
      return false;
    }

    return true;
  }

  save() {
    var button = this.commonService.buttonClicked;
    this.show = true;
    //console.log(this.master);
    this.master.stockInDate = this.commonService.DateFormat(this.master.stockInDate);
    this.BomFinishGoodStockInService.SaveBomFinishGoodStockIn(
      this.master
    ).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }

        //////////////Grid Refresh ///////////////////
        this.getMaster();
        this.BomFinishGoodStockInService.GetBomFinishGoodStockInMasterById(
          0
        ).subscribe((data: any) => {
          if (data.success) {
            this.rowData = data.data;
          }
        });
        //////////////Grid Refresh ///////////////////
      }
    });
  }

  reset() {
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

    this.saveupdate = "Update";
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.BomFinishGoodStockInService.GetBomFinishGoodStockInMasterById(
      0
    ).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }

  getSelectedRowData() {
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map((node) => node.data);
    alert(`${JSON.stringify(selectedData)}`);
    this.name = selectedData[0].currencyName;
    return selectedData;
  }
  ////////////////////////////////// Ag Grid Data Load/////////////////////////////////
  selectedRows = [];
  onRowClicked(event) {
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

  agEdit(event) {
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
      var bomStockInId = event.node.data.bomStockInId;

      this.BomFinishGoodStockInService.GetBomFinishGoodStockInMasterById(
        bomStockInId
      ).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];
          this.master.stockInDate = new Date(this.master.stockInDate);
          this.ProductSpecificationList = [];

          this.getCompany();
          this.companySelected = {
            id: data.data[0].companyId,
            name: data.data[0].companyName,
          };

          this.getSBU(data.data[0].companyId);
          this.branchSelected = {
            id: data.data[0].sbuId,
            name: data.data[0].sbuName,
          };

          this.getStore(data.data[0].sbuId);
          this.storeSelected = {
            id: data.data[0].storeId,
            name: data.data[0].storeName,
          };

          this.getStockDetailsData(bomStockInId);
        }
      });
      this.ngOnInit();
    }
  }

  getStockDetailsData(bomStockInId) {
    this.master.lstDetailsViewModel = [];
    this.BomFinishGoodStockInService.GetBomFinishGoodStockInDetailsByMasterId(
      bomStockInId
    ).subscribe((data: any) => {
      if (data.success) {
        this.master.lstDetailsViewModel = data.data;
      } else {
        this.master.lstDetailsViewModel = [];
      }
    });
  }
  uomName: string = "";
  getCurrentStock() {
    this.uomName = "";
    this.uomName = this.bomProductspecificationSelected["uomName"];
    let productWiseSpecificationId =
      this.bomProductspecificationSelected["productWiseSpecificationId"];
    this.StockinwithoutpoService.getCurrentStock(
      productWiseSpecificationId,
      this.master.storeId
    ).subscribe((data: any) => {
      if (data.success) {
        this.CurrentStock =
          data.data.length > 0 ? data.data[0].CurrentStock : 0; //data.data[0].CurrentStock;
      } else {
        this.CurrentStock = 0;
      }
    });
  }

  agDelete(event) {
    this.master.bomStockInId = event.node.data.bomStockInId;
    if (confirm('Are you sure?')) {
      this.BomFinishGoodStockInService.DeleteBomFinishGoodStockInMasterById(
        this.master.bomStockInId
      ).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.BomFinishGoodStockInService.GetBomFinishGoodStockInMasterById(
            this.master.bomStockInId
          ).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });
          //////////////Grid Refresh ///////////////////
        }
      });
    }
  }
  //////////////////////////////////End of Ag Grid Data Load/////////////////////////////////

  @Output() myEvent = new EventEmitter();

  deleteRow(state, action) {
    const nodeIdToRemove = action.payload;
    const filteredData = state.rowData.filter(
      (node) => node.id !== nodeIdToRemove
    );
    return {
      ...state,
      rowData: [...filteredData],
    };
  }

  showToast(type: NbComponentStatus, title: string, body: string) {
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

  purchaseOrderFrom = [];
  getpurchaseOrderFrom(companyId) {
    this.comboService
      .getpurchaseOrderFrom(companyId)
      .subscribe((returns: any) => {
        this.purchaseOrderFrom = returns.data.map((val) => ({
          id: val.employeeId,
          name: val.fullName,
        }));
      });
  }

  supplierList = [];
  getSupplier() {
    this.PurchaseorderService.getProductsupplier().subscribe((retuns: any) => {
      if (retuns.success) {
        this.supplierList = retuns.data.map((val: any) => ({
          id: val.supplierId,
          name: val.supplierName,
        }));
      }
    });
  }

  Clear() {
    this.master.lstDetailsViewModel = [];
  }

  companyList = [];
  getCompany() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyList = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  getSBU(companyId) {
    this.branchSelected = {};
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.sbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }

  StoreList = [];
  getStore(sbuId) {
    this.storeSelected = {};
    this.StockinService.getStore(sbuId, this.master.companyId).subscribe(
      (returns: any) => {
        this.StoreList = returns.data.map((val) => ({
          id: val.storeId,
          name: val.storeName,
        }));
      }
    );
  }

  GetBomFinishGoodProductSpec() {
    this.BomFinishGoodStockInService.GetBomFinishGoodProductSpec(0).subscribe(
      (returns: any) => {
        this.bomProductSpecList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          bomId: val.bomId,
          bomName: val.bomName,
          productWiseSpecificationId: val.productWiseSpecificationId,
          productName: val.productName,
          uomId: val.uomId,
          uomName: val.uomName,
          productId: val.productId,
          price: val.price,
          imageUrl: val.imageUrl,
        }));
      }
    );
  }

  // getBomMasterProductSpec() {
  //   this.BomFinishGoodStockInService.GetBomMasterProductSpec(0).subscribe((returns: any) => {
  //     this.bomProductSpecList = returns.data.map((val: any) => ({
  //       id: val.productWiseSpecificationId,
  //       name: val.productName,
  //       uomId: val.uomId,
  //       uomName: val.uomName,
  //       productId: val.productId,
  //       price: val.price,
  //       imageUrl: val.imageUrl,
  //     }));
  //   });
  // }

  addDetails() {
    if (this.bomProductspecificationSelected == null) {
      this.toastrService.warning("Please select a BOM Product Name", "Message");
      return false;
    }
    if (this.qty == 0 || this.qty == 0) {
      this.toastrService.warning("Please input Stock-In Qty.", "Message");
      return false;
    }

    let detail = {
      //productName: this.productSelected['name'],
      bomStockInDetailsId: 0,
      bomStockInId: this.master.bomStockInId,
      bomId: this.bomProductspecificationSelected["bomId"],
      bomName: this.bomProductspecificationSelected["bomName"],
      productWiseSpecificationId: this.bomProductspecificationSelected["id"],
      productName: this.bomProductspecificationSelected["name"],
      CurrentStock: this.CurrentStock,
      qty: this.qty,
      uomName: this.bomProductspecificationSelected["uomName"],
      isSelect: 1,
    };

    var result = this.master.lstDetailsViewModel.filter(
      (x) => x.productWiseSpecificationId == this.productWiseSpecificationId
    );
    if (result.length > 0) {
      this.master.lstDetailsViewModel[0] = detail;
    } else {
      this.master.lstDetailsViewModel.push(detail);
    }

    this.bomProductspecificationSelected = null;
    this.CurrentStock = 0;
    this.qty = 0;
  }

  ProductList = [];
  getAllProduct() {
    // this.StockinwithoutpoService.getAllProduct().subscribe((returns: any) => {
    //   this.ProductList = returns.data.map((val) => ({
    //     id: val.productId,
    //     name: val.productName,
    //   }));
    // });
  }

  ProductSpecificationList = [];
  getAllProductSpecification(productId) {
    // this.bomProductspecificationSelected = {};
    // this.StockinwithoutpoService.getAllProductSpecification(productId).subscribe((returns: any) => {
    //   this.ProductSpecificationList = returns.data.map((val) => ({
    //     id: val.productWiseSpecificationId,
    //     name: val.productName,
    //   }));
    //});
  }

  editDetails(index: any) {
    // this.selectedRow = this.master.lstDetailsViewModel[index];
    // this.qty = this.selectedRow.qty;
    // this.CurrentStock = this.selectedRow.CurrentStock;
    // this.getAllProduct();
    // this.productSelected = {
    //   id: this.selectedRow.productId,
    //   name: this.selectedRow.productName,
    // };
    // this.getAllProductSpecification(this.productId)
    // this.bomProductspecificationSelected = {
    //   id: this.selectedRow.productWiseSpecificationId,
    //   name: this.selectedRow.productSpecification,
    // };
  }

  DeleteDetails(index: any) {
    this.selectedRow = this.master.lstDetailsViewModel[index];
    this.master.lstDetailsViewModel.splice(index, 1);
    if (this.selectedRow.helpDetailId > 0) {
    }
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }

  tableHeader = ["#", "Product Name", "Store Name", "Qty."];
  agReport(event) {
    this.generateStockInReport(event.data.bomStockInId);
  }

  datalength: number;
  stockInNo = "";
  stockInDate = "";
  bodyData = [];

  generateStockInReport(bomStockInId) {
    this.StockinwithoutpoService.getStockInWithOutPoReportById(
      bomStockInId
    ).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
        this.stockInNo = this.bodyData[0].stockInNo;
        this.stockInDate = this.bodyData[0].stockInDate;
        this.setParam();
        var fileName = this.pageNavigation + ".pdf";
        const content = document.getElementById("reportHeader");
        this.generateReport("print", fileName, content, this.datalength);
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  params = [];
  setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Voucher No",
      leftValue: "",
      rightLabel: "Voucher Date",
      rightValue: "",
    });
  }

  generateReport(
    buttonAction: any,
    fileName: string,
    content: any,
    datalength: number
  ) {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(5); //optional
    doc.setTextColor(40); //optional

    var legend = {
      height: 100,
      totalheight: 100 + datalength,
    };
    //debugger;
    const addFooters = (doc) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
          "Page " + String(i) + " of " + String(pageCount),
          doc.internal.pageSize.width / 1.2,
          doc.internal.pageSize.height - 20
        );
        doc.text(
          "Powered by : ONE ERP",
          doc.internal.pageSize.width / 2.3,
          doc.internal.pageSize.height - 20
        );
        doc.text(
          "Printed Date: " +
          new Date().toLocaleDateString() +
          " " +
          new Date().toLocaleTimeString(),
          20,
          doc.internal.pageSize.height - 20
        );
      }
    };

    //////////// TABLE DATA ////////////
    // legend.totalheight=legend.height+this.datalength;
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table_top",
          startY: legend.height + 30,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
        });

        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 80,
          styles: { font: "Meta" },
        });

        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 120,
          theme: "grid",
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [105, 105, 105],
            fontSize: 11,
          },
          bodyStyles: {
            fillColor: [216, 216, 216],
            textColor: 50,
          },
          columnStyles: {
            4: { halign: "right" },
            5: { halign: "right" },
          },

          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
        });

        addFooters(doc);
        ////////////PRINT ////////////
        if (buttonAction == "pdf") {
          doc.save(fileName);
        } else {
          window.open(URL.createObjectURL(doc.output("blob")), "_blank"); //doc.output("dataurlnewwindow");
          doc.close();
        }
      },
    });
  }
}
