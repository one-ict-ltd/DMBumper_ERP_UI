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
import { DamageGoodsService } from "app/services/inventory/damage-goods.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "ngx-damage-goods",
  templateUrl: "./damage-goods.component.html",
  styleUrls: ["./damage-goods.component.scss"],
})
export class DamageGoodsComponent implements OnInit {
  public company: {
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

  /////////////////////////////
  master: {
    damageGoodsId: number;
    damageGoodsNo: string;
    receiveDate: Date;
    companyId: number;
    sbuId: number;
    storeId: number;
    stockTypeId: number;
    stockCategoryId: number;
    stockCategory: string;
    remarks: string;
    productId: 0;
    productWiseSpecificationId: 0;
    currentStock: 0;
    damageQty: 0;
    companySelected: {};
    branchSelected: {};
    storeSelected: {};
    productSelected: {};
    productspecificationSelected: {};
    serialNoSelected: {};
    lstDetailsViewModel: any[];
    isActive: number;
    barcodeDetailsId: number;
  };

  public sbus = [];
  serialNoList = [];
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

  ngOnInit() {
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }

  public pageNavigation = "Damage Goods";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      // this.getMaster();

      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      // this.show = true;
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
      damageGoodsId: 0,
      damageGoodsNo: "",
      //poReceiveId: 0,
      companyId: 0,
      sbuId: 0,
      storeId: 0,
      productId: 0,
      productWiseSpecificationId: 0,
      damageQty: 0,
      receiveDate: new Date(),
      stockTypeId: 2,
      stockCategoryId: 9,
      stockCategory: "Damage Goods",
      remarks: "",
      currentStock: 0,

      companySelected: null,
      storeSelected: null,
      branchSelected: null,
      productSelected: null,
      productspecificationSelected: null,
      serialNoSelected: null,

      lstDetailsViewModel: [],
      isActive: 1,
      barcodeDetailsId: 0,
    };
    this.StoreList = null;
    this.sbus = null;
    this.dRemarks = "";
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

  private save() {
    var button = this.commonService.buttonClicked;
    if (this.master.companySelected == null) {
      this.toastrService.danger("Please select company.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }
    //debugger;
    if (this.master.branchSelected == null || this.master.branchSelected == 0) {
      this.toastrService.danger("Please select branch.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }
    //debugger;
    if (this.master.storeSelected == null || this.master.storeSelected == 0) {
      this.toastrService.danger("Please select store.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.receiveDate == null) {
      this.toastrService.danger("Please select date.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }
    if (
      this.master.lstDetailsViewModel.length == 0 ||
      this.master.lstDetailsViewModel == null
    ) {
      this.toastrService.danger("Please enter a product.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }
    //console.log(this.master);
    this.master.receiveDate = this.commonService.DateFormat(this.master.receiveDate);

    this.show = true;
    this.damageGoodsService
      .SaveDamageGoods(this.master)
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
          //////////////Grid Refresh ///////////////////
          this.getMaster();
          this.getMaxNo();
          this.damageGoodsService
            .GetDamageGoodsById(0)
            .subscribe((data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            });
          //////////////Grid Refresh ///////////////////
        }
      });
  }

  private reset() {
    this.getMaster();
    this.getMaxNo();
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

  public selectdetailRows = [];
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
    private http: HttpClient,
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private PurchaseorderService: PurchaseorderService,
    private StockinService: StockinService,
    private damageGoodsService: DamageGoodsService,
    private comboService: CommoncomboService,
    private StockinwithoutpoService: StockinwithoutpoService,
    private datePipe: DatePipe
  ) {
    this.commonService.valueSet("showlist");
    // this.getPOReceive();
    this.getCompany();
    this.getAllProduct();
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
        headerName: "Damage No.",
        field: "damageGoodsNo",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 120,
      },
      {
        headerName: "Date",
        field: "receiveDate",
        width: 160,
      },
      {
        headerName: "CompanyName",
        field: "companyName",
        width: 160,
      },
      {
        headerName: "Store Name",
        field: "storeName",
        width: 160,
      },
      {
        headerName: "Stock Type",
        field: "stockName",
        width: 140,
      },
      {
        headerName: "Remarks",
        field: "remarks",
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
    this.getMaxNo();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.damageGoodsService.GetDamageGoodsById(0).subscribe((data: any) => {
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
      var damageGoodsId = event.node.data.damageGoodsId;

      this.damageGoodsService
        .GetDamageGoodsById(damageGoodsId)
        .subscribe((data: any) => {
          if (data.success) {
            this.master = data.data[0];
            this.master.receiveDate = new Date(this.master.receiveDate);
            this.getCompany();
            this.ProductSpecificationList = [];
            this.getSBU(0);
            this.getStore(0);
            // this.getPOReceive();

            this.master.companySelected = {
              id: data.data[0].companyId,
              name: data.data[0].companyName,
            };
            this.master.branchSelected = {
              id: data.data[0].sbuId,
              name: data.data[0].sbuName,
            };
            this.master.storeSelected = {
              id: data.data[0].storeId,
              name: data.data[0].storeName,
            };
            // this.master.POReceiveSelected = {
            //   id: data.data[0].poReceiveId,
            //   name: data.data[0].purOrderRecvNo,
            // }
            this.GetDamageGoodsDetailsById(damageGoodsId);
          }
        });
      this.ngOnInit();
    }
  }

  public GetDamageGoodsDetailsById(damageGoodsId) {
    this.damageGoodsService
      .GetDamageGoodsDetailsById(damageGoodsId)
      .subscribe((data: any) => {
        if (data.success) {
          this.master.lstDetailsViewModel = data.data;
        } else {
          this.master.lstDetailsViewModel = [];
        }
      });
  }

  private agDelete(event) {
    this.master.damageGoodsId = event.node.data.damageGoodsId;
    this.damageGoodsService
      .DeleteDamageGoodsById(this.master.damageGoodsId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.damageGoodsService
            .GetDamageGoodsById(this.master.damageGoodsId)
            .subscribe((data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            });
          //////////////Grid Refresh ///////////////////
        }
      });
  }
  //////////////////////////////////End of Ag Grid Data Load/////////////////////////////////

  @Output() myEvent = new EventEmitter();

  public deleteRow(state, action) {
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

  public purchaseOrderFrom = [];
  public getpurchaseOrderFrom(companyId) {
    this.comboService
      .getpurchaseOrderFrom(companyId)
      .subscribe((returns: any) => {
        this.purchaseOrderFrom = returns.data.map((val) => ({
          id: val.employeeId,
          name: val.fullName,
        }));
      });
  }

  public supplierList = [];
  public getSupplier() {
    this.PurchaseorderService.getProductsupplier().subscribe((retuns: any) => {
      if (retuns.success) {
        this.supplierList = retuns.data.map((val: any) => ({
          id: val.supplierId,
          name: val.supplierName,
        }));
      }
    });
  }

  public Clear() {
    this.master.lstDetailsViewModel = [];
  }

  public companyList = [];
  public getCompany() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyList = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  public getSBU(companyId) {
    //debugger;
    // this.master.branchSelected = {};
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.sbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
      // this.master.branchSelected = returns.data.map((val) => ({
      //   id: val.sbuId,
      //   name: val.sbuName,
      // }));
    });
  }

  public StoreList = [];
  public getStore(sbuId) {
    //debugger;
    // this.master.storeSelected = {};
    this.StockinService.getStore(sbuId, this.master.companyId).subscribe(
      (returns: any) => {
        this.StoreList = returns.data.map((val) => ({
          id: val.storeId,
          name: val.storeName,
        }));
      }
    );
  }

  public getMaxNo() {
    this.damageGoodsService
      .GetMaxDamageGoodsNumber(
        this.datePipe.transform(this.master.receiveDate, "yyyy-MM-dd")
      )
      .subscribe((returns: any) => {
        if (returns.success) {
          this.master.damageGoodsNo = returns.data[0].MaxNo;
        }
      });
  }
  dRemarks: string = "";
  public addDetails() {
    if (this.master.productSelected == null) {
      this.toastrService.danger("Please select product.", "Message");
      return false;
    }
    if (this.master.productspecificationSelected == null) {
      this.toastrService.danger(
        "Please select product specification.",
        "Message"
      );
      return false;
    }
    if (this.master.damageQty == 0) {
      this.toastrService.danger("Please enter quantity.", "Message");
      return false;
    }
    let detail = {
      damageGoodsDetailsId: 0,
      barcodeDetailsId: this.master.barcodeDetailsId,
      damageGoodsId:
        this.master.serialNoSelected == null
          ? 0
          : this.master.serialNoSelected["id"],
      serialNo:
        this.master.serialNoSelected == null
          ? ""
          : this.master.serialNoSelected["name"],
      stockTypeId: 2,
      isSelect: 1,
      isActive: 1,
      productName: this.master.productSelected["name"],
      productId: this.master.productSelected["id"],
      productSpecification: this.master.productspecificationSelected["name"],
      productWiseSpecificationId:
        this.master.productspecificationSelected["id"],
      currentStock: this.master.currentStock,
      damageQty: this.master.damageQty,
      remarks: this.dRemarks,
    };

    //#region Replace Existing Item

    // var indexu = this.master.lstDetailsViewModel.findIndex(x => x.productWiseSpecificationId == this.master.productWiseSpecificationId);
    // if (indexu > -1) {
    //   this.master.lstDetailsViewModel[indexu] = detail;
    // }
    // else {
    //   this.master.lstDetailsViewModel.push(detail);
    // }

    //#endregion
    this.master.lstDetailsViewModel.push(detail);

    this.dRemarks = "";
    this.master.damageQty = 0;
  }

  public editDetails(index: any) {
    this.selectedRow = this.master.lstDetailsViewModel[index];
    this.master.damageQty = this.selectedRow.damageQty;
    this.master.currentStock = this.selectedRow.currentStock;
    this.master.productSelected = {
      id: this.selectedRow.productId,
      name: this.selectedRow.productName,
    };
    this.getAllProductSpecification(this.selectedRow.productId);
    this.master.productspecificationSelected = {
      id: this.selectedRow.productWiseSpecificationId,
      name: this.selectedRow.productSpecification,
    };
  }

  public DeleteDetails(index: any) {
    this.selectedRow = this.master.lstDetailsViewModel[index];
    this.master.lstDetailsViewModel.splice(index, 1);
    if (this.selectedRow.helpDetailId > 0) {
    }
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }

  public ProductList = [];
  public getAllProduct() {
    this.StockinwithoutpoService.getAllProduct().subscribe((returns: any) => {
      this.ProductList = returns.data.map((val) => ({
        id: val.productId,
        name: val.productName,
      }));
    });
  }

  public ProductSpecificationList = [];
  public getAllProductSpecification(productId) {
    this.master.productspecificationSelected = null;
    this.ProductSpecificationList = [];
    this.serialNoList = [];
    this.master.serialNoSelected = null;

    this.StockinwithoutpoService.getAllProductSpecification(
      productId
    ).subscribe((returns: any) => {
      this.ProductSpecificationList = returns.data.map((val) => ({
        id: val.productWiseSpecificationId,
        name: val.productName,
      }));
    });
  }

  getProductSerial() {
    this.serialNoList = [];
    this.master.serialNoSelected = null;

    if (this.master.productspecificationSelected == null) {
      this.master.productWiseSpecificationId = 0;
    }

    this.damageGoodsService
      .getProductSerialNoByProductSpec(this.master.productWiseSpecificationId)
      .subscribe((returns: any) => {
        this.serialNoList = returns.data.map((val) => ({
          id: val.barcodeDetailsId,
          name: val.serialNo,
        }));
      });
  }

  public getCurrentStock(specificationId) {
    this.master.currentStock = 0;
    this.StockinwithoutpoService.getCurrentStock(
      this.master.productWiseSpecificationId,
      this.master.storeId
    ).subscribe((data: any) => {
      if (data.success) {
        this.master.currentStock =
          data.data.length > 0 ? data.data[0].CurrentStock : 0;
      }
      this.getProductSerial();
    });
  }

  public tableHeader = [
    "#",
    "Product Name",
    "Store Name",
    "Serial No.",
    "Damage Qty",
    "UOM",
  ];
  private agReport(event) {
    this.GetDamageGoodsReportById(event.data.damageGoodsId);
  }

  public datalength: number;
  public damageGoodsNo = "";
  public receiveDate = "";
  public bodyData = [];

  public GetDamageGoodsReportById(damageGoodsId) {
    this.damageGoodsService
      .GetDamageGoodsReportById(damageGoodsId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.bodyData = returns.data;
          this.damageGoodsNo = this.bodyData[0].damageGoodsNo;
          this.receiveDate = this.bodyData[0].receiveDate;
          this.setParam();
          var fileName = this.pageNavigation + ".pdf";
          const content = document.getElementById("reportHeader");
          this.generateReport("print", fileName, content, this.datalength);
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
  }

  public params = [];
  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Voucher No",
      leftValue: "",
      rightLabel: "Voucher Date",
      rightValue: "",
    });
  }

  public generateReport(
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
