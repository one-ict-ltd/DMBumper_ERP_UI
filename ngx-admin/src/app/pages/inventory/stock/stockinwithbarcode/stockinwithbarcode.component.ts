import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}
import { HttpClient } from "@angular/common/http";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DatePipe } from "@angular/common";
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
import { StockinwithbarcodeService } from "app/services/inventory/stockinwithbarcode.service";
import { CommoncomboService } from "app/services/commoncombo.service";
//import { registerPrebuiltTheme } from "@nebular/theme/schematics/ng-add/register-theme";
import { NgxBarcodeModule } from "ngx-barcode";
import { debug } from "node:console";

@Component({
  selector: "ngx-stockinwithbarcode",
  templateUrl: "./stockinwithbarcode.component.html",
  styleUrls: ["./stockinwithbarcode.component.scss"],
})
export class StockinwithbarcodeComponent implements OnInit {
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

  master: {
    barcodeId: number;
    stockInDate: Date;
    receiveQty: number;
    isSelect: number;
    hasSerial: number;

    //barcodeId: number;
    poReceiveId: number;

    purchasePrice: number;
    partyId: number;

    companyId: number;
    sbuId: number;
    storeId: number;
    barcodeNo: string;
    //stockInDate: Date;
    stockTypeId: string;
    remarks: string;
    productId: number;
    productWiseSpecificationId: number;
    currentStock: number;
    //receiveQty: number;

    companySelected: {};
    supplierSelected: {};
    branchSelected: {};
    storeSelected: {};

    POReceiveSelected: {};

    prodReqSelected: {};
    productSelected: {};
    productspecificationSelected: {};
    partySelected: {};

    StockInWithBarcode: any[];
  };

  // productSerial: {
  //   barcodeDetailsId: number;
  //   barcodeId: number;
  //   serialNo: string;
  //   isActive: number;
  //   isSale: number;
  // }
  public sbus = [];
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
  }

  public pageNavigation = "Stock In With Barcode";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.getMaxNo();
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
      barcodeId: 0,
      stockInDate: new Date(),
      receiveQty: 0,
      isSelect: 1,
      hasSerial: 1,
      StockInWithBarcode: [],

      //barcodeId: 0,
      partyId: 0,
      purchasePrice: 0,

      poReceiveId: 0,
      companyId: 0,
      sbuId: 0,
      storeId: 0,
      productId: 0,
      barcodeNo: "",
      currentStock: 0,
      //receiveQty: 0,
      //stockInDate: new Date(),
      stockTypeId: "",
      remarks: "",
      companySelected: null,
      supplierSelected: null,
      storeSelected: null,
      branchSelected: null,
      POReceiveSelected: null,
      prodReqSelected: null,
      productWiseSpecificationId: null,
      productSelected: null,
      productspecificationSelected: null,
      partySelected: null,
    };
    this.master.StockInWithBarcode = [];
  }
  // getDetails() {
  //   this.StockInWithBarcodeDetails = {
  //     barcodeDetailsId: 0,
  //     barcodeId: 0,
  //     serialNo: "",
  //     isActive: 1,
  //     isSale: 0,
  //   }
  // }
  public employeeItems = [];
  public companyItems = [];

  private save() {
    var button = this.commonService.buttonClicked;

    //console.log(this.master.StockInWithBarcode);
    this.show = true;


    this.StockinwithbarcodeService.SaveStockInWithBarcode(
      this.master.StockInWithBarcode
    ).subscribe((returns: any) => {
      if (returns.success) {
        if (button == "update") {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        } else {
          this.toastrService.success(this.commonService.successmsg, "Message");
        }
        //////////////Grid Refresh ///////////////////

        this.getMaster();
        this.StockinwithbarcodeService.GetStockInWithBarcodeById(0).subscribe(
          (data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          }
        );
        //////////////Grid Refresh ///////////////////
      }
    });
  }

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
    private StockinwithbarcodeService: StockinwithbarcodeService,
    private comboService: CommoncomboService,
    private datePipe: DatePipe
  ) {
    this.commonService.valueSet("showlist");
    this.getCompany();
    this.getAllProduct();
    this.getAllparty(2); // 2 for vendor
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
        headerName: "Barcode No.",
        field: "barcodeNo",
        filter: "agNumberColumnFilter",
        editable: false,
        width: 130,
      },
      {
        headerName: "Stock Date",
        field: "stockInDate",
        width: 120,
      },
      {
        headerName: "Store Name",
        field: "storeName",
        width: 140,
      },
      {
        headerName: "Product Name",
        field: "productName",
        width: 250,
      },
      {
        headerName: "Receive Qty.",
        field: "receiveQty",
        width: 130,
      },
      {
        headerName: "UOM Name",
        field: "uomName",
        width: 120,
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.StockinwithbarcodeService.GetStockInWithBarcodeById(0).subscribe(
      (data: any) => {
        if (data.success) {
          this.rowData = data.data;
        }
      }
    );
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
      //this.agReport(event);
      this.agPopup(event, this.templateref);
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
      var barcodeId = event.node.data.barcodeId;

      this.StockinwithbarcodeService.GetStockInWithBarcodeById(
        barcodeId
      ).subscribe((data: any) => {
        if (data.success) {
          this.master.StockInWithBarcode = data.data;
          //console.log(data.data);
          //this.master.StockInWithBarcode.push(data.data[0]);

          this.StockinwithbarcodeService.GetStockInWithBarcodeDetailsById(
            barcodeId
          ).subscribe((data: any) => {
            if (data.success) {
              //this.master.StockInWithBarcode = null;
              //console.log(data.data);
              this.master.StockInWithBarcode[0].lstDetailsViewModel = data.data;
            }
          });

          //console.log(this.master.StockInWithBarcode);
          this.getCompany();
          this.ProductSpecificationList = [];
          this.getSBU(0);
          this.getStore(0);

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
          this.master.remarks = data.data[0].remarks;
        }
      });
      //this.getStockDetailsData(barcodeId);

      this.tempMaxBarcodeNo();
      this.ngOnInit();
    }
  }

  public getStockDetailsData(barcodeId) {
    // this.master.StockInWithBarcode = [];
    // this.StockinwithbarcodeService.GetStockInWithBarcodeById(barcodeId).subscribe((data: any) => {
    //   if (data.success) {
    //     this.master.StockInWithBarcode = data.data;
    //   }
    //   else {
    //     this.master.StockInWithBarcode = [];
    //   }
    // });
  }

  public getCurrentStock(specificationId) {
    this.StockinwithbarcodeService.getCurrentStock(
      this.master.productWiseSpecificationId,
      this.master.storeId
    ).subscribe((data: any) => {
      //debugger;
      if (data.success) {
        this.master.currentStock =
          data.data.length > 0 ? data.data[0].CurrentStock : 0;
      } else {
        this.master.currentStock = 0;
      }
    });
  }

  private agDelete(event) {
    //this.master.barcodeId = event.node.data.barcodeId;
    this.StockinwithbarcodeService.DeleteStockInWithBarcodeById(
      event.node.data.barcodeId
    ).subscribe((returns: any) => {
      //this.StockinService.deleteStockInById(event.node.data.barcodeId).subscribe((returns: any) => {
      if (returns.success) {
        this.toastrService.success(this.commonService.deletedmsg, "Message");

        //////////////Grid Refresh ///////////////////
        this.StockinwithbarcodeService.GetStockInWithBarcodeById(0).subscribe(
          (data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          }
        );
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
    this.master.StockInWithBarcode = [];
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
    //this.master.branchSelected = {};
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.sbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }

  public StoreList = [];
  public getStore(sbuId) {
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
    this.StockinwithbarcodeService.getMaxBarcodeNo(
      this.datePipe.transform(this.master.stockInDate, "yyyy-MM-dd")
    ).subscribe((returns: any) => {
      if (returns.success) {
        this.master.barcodeNo = returns.data[0].MaxNo;
      }
    });
  }

  public tempMaxBarcodeNo() {
    if (this.master.StockInWithBarcode.length > 0) {
      let maxBarcodeNo: number = 0;
      maxBarcodeNo = Math.max.apply(
        Math,
        this.master.StockInWithBarcode.map(function (a) {
          return a.barcodeNo;
        })
      );
      this.master.barcodeNo = (maxBarcodeNo + 1).toString();
    } else {
      this.getMaxNo();
    }
  }

  barcodeDetails: any[];
  public addStockdetails(dialog) {
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
    if (this.master.receiveQty == 0) {
      this.toastrService.danger("Please enter quantity.", "Message");

      return false;
    }
    this.barcodeDetails = [];
    if (this.master.hasSerial == 1) {
      for (let index = 0; index < this.master.receiveQty; index++) {
        const productSerial = {
          barcodeDetailsId: 0,
          barcodeId: 0,
          serialNo: "",
          isActive: 1,
          isSale: 0,
        };
        this.barcodeDetails.length == 0
          ? (this.barcodeDetails[0] = productSerial)
          : this.barcodeDetails.push(productSerial);
      }
    }

    let _partyId = (this.master.partySelected == null || this.master.partySelected == undefined) ? 0 : this.master.partyId;

    let detail = {
      //productName: this.master.productSelected['name'],
      productId: this.master.productSelected["id"],
      productName: this.master.productspecificationSelected["name"],
      productWiseSpecificationId:
        this.master.productspecificationSelected["id"],
      currentStock: this.master.currentStock,
      receiveQty: this.master.receiveQty,
      barcodeNo: this.master.barcodeNo,
      storeId: this.master.storeId,
      barcodeId: this.master.barcodeId,
      isSelect: this.master.isSelect,
      stockInDate: this.commonService.DateFormat(this.master.stockInDate),
      remarks: this.master.remarks,
      isActive: 1,
      hasSerial: this.master.hasSerial,
      lstDetailsViewModel: this.barcodeDetails,
      partyId: _partyId,
      partyName: _partyId > 0 ? this.master.partySelected["name"] : '',
      purchasePrice: this.master.purchasePrice,
    };
    // var result = this.master.StockInWithBarcode.filter(x => x.productWiseSpecificationId == this.master.productWiseSpecificationId);
    // if (result.length > 0) {
    //   this.master.StockInWithBarcode[0] = detail;
    // }
    // else {
    //   this.master.StockInWithBarcode.push(detail);
    // }
    //console.log(detail)
    this.master.StockInWithBarcode.length == 0
      ? (this.master.StockInWithBarcode[0] = detail)
      : this.master.StockInWithBarcode.push(detail);

    console.log(this.master.StockInWithBarcode);

    debugger;
    this.tempMaxBarcodeNo();

    this.master.purchasePrice = 0;
  }

  validateSerialNo(pRowIndex, cRowIndex) {
    const currentSerial =
      this.master.StockInWithBarcode[pRowIndex].lstDetailsViewModel[cRowIndex]
        .serialNo;

    if (currentSerial == "") {
      this.toastrService.danger(
        "Empty Serial Number Not Allowed !!!",
        "Message"
      );
      return;
    }

    let counts: number = 0;
    this.master.StockInWithBarcode[pRowIndex].lstDetailsViewModel.forEach(
      (element) => {
        if (currentSerial == element.serialNo) {
          counts++;
        }
      }
    );
    if (counts > 1) {
      this.toastrService.danger(
        "Duplicate Serial Number (" + currentSerial + ") Found !!!",
        "Message"
      );
    }
  }

  validationForMasterSave(): Boolean {
    let isValid: Boolean = true;
    if (this.master.companySelected == null) {
      this.toastrService.warning("Please select company.", "Message");
      // this.show = false;
      //this.commonService.valueSet("create");
      return false;
    }
    if (this.master.branchSelected == null) {
      this.toastrService.warning("Please select branch.", "Message");
      // this.show = false;
      //this.commonService.valueSet("create");
      return false;
    }
    if (this.master.storeSelected == null) {
      this.toastrService.warning("Please select store.", "Message");
      // this.show = false;
      //this.commonService.valueSet("create");
      return false;
    }
    if (this.master.stockInDate == null) {
      this.toastrService.warning("Please select MR date.", "Message");
      // this.show = false;
      //this.commonService.valueSet("create");
      return false;
    }
    if (
      this.master.StockInWithBarcode.length == 0 ||
      this.master.StockInWithBarcode == null
    ) {
      this.toastrService.warning("Please enter a product.", "Message");
      // this.show = false;
      //this.commonService.valueSet("create");
      return false;
    }

    this.master.StockInWithBarcode.forEach((element) => {
      element.lstDetailsViewModel.forEach((dupsElement) => {
        if (dupsElement.serialNo == "") {
          this.toastrService.warning(
            "Empty serial number not allowed for BarcodeNo. : " +
            dupsElement.barcodeNo +
            "  !!!",
            "Message"
          );
          isValid = false;
          return isValid;
        }
        let existItem = element.lstDetailsViewModel.filter(
          (item) => item.serialNo == dupsElement.serialNo
        );
        console.log(existItem);
        if (existItem.length > 1) {
          this.toastrService.warning(
            "Duplicate serial number (" +
            existItem[0].serialNo +
            ") found for BarcodeNo. : " +
            element.barcodeNo +
            " !!!",
            "Message"
          );

          isValid = false;
          return isValid;
        }
      });

      //#region region
      // var counts = {};
      //element.lstDetailsViewModel.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
      // let counts: number = 0;
      // element.lstDetailsViewModel.forEach(element => {
      //   if (currentSerial == element.serialNo) {
      //     counts++;
      //   }
      // })
      // console.log(counts);
      // if (counts > 1) {
      //   this.toastrService.danger("Duplicate Serial Number Found !!!", "Message");
      //   return false;
      // }
      //#endregion
    });

    return isValid;
  }

  public ProductList = [];
  public getAllProduct() {
    this.StockinwithbarcodeService.getAllProduct().subscribe((returns: any) => {
      this.ProductList = returns.data.map((val) => ({
        id: val.productId,
        name: val.productName,
      }));
    });
  }

  public ProductSpecificationList = [];
  public getAllProductSpecification(productId) {
    this.master.productspecificationSelected = {};
    this.StockinwithbarcodeService.getAllProductSpecification(
      productId
    ).subscribe((returns: any) => {
      this.ProductSpecificationList = returns.data.map((val) => ({
        id: val.productWiseSpecificationId,
        name: val.productName,
      }));
    });
  }

  public partyList = [];
  public getAllparty(partyTypeId) {
    debugger;
    //this.master.partySelected = {};
    this.StockinwithbarcodeService.GetAllPartyByPartyType(
      partyTypeId
    ).subscribe((returns: any) => {
      let element = { id: 0, name: "... select none ..." };
      this.partyList = returns.data.map((val) => ({
        id: val.partyId,
        name: val.partyName,
      }));

      if (this.partyList.length > 0)
        this.partyList.splice(0, 0, element);
    });
  }

  public editDetails(index: any) {
    this.selectedRow = this.master.StockInWithBarcode[index];
    this.master.receiveQty = this.selectedRow.receiveQty;
    this.master.currentStock = this.selectedRow.currentStock;
    this.getAllProduct();
    this.master.productSelected = {
      id: this.selectedRow.productId,
      name: this.selectedRow.productName,
    };
    this.getAllProductSpecification(this.master.productId);
    this.master.productspecificationSelected = {
      id: this.selectedRow.productWiseSpecificationId,
      name: this.selectedRow.productSpecification,
    };
  }

  public DeleteDetails(index: any) {
    this.selectedRow = this.master.StockInWithBarcode[index];
    this.master.StockInWithBarcode.splice(index, 1);
    if (this.selectedRow.helpDetailId > 0) {
    }
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }

  //////////// Open Modal ////////////////

  @ViewChild("dialog") templateref: TemplateRef<any>;
  elementType = "img";
  public selectedBarcode: {};
  private agPopup(event, templateref: TemplateRef<any>) {
    //debugger;
    this.StockinwithbarcodeService.GetStockInWithBarcodeById(
      event.node.data.barcodeId
    ).subscribe((data: any) => {
      if (data.success) {
        this.selectedBarcode = data.data;
      }
    });
    this.dialogService.open(templateref, {
      context: [],
    });
  }
  printPage() {
    window.print();
  }
  //////////// Open Modal ////////////////

  public tableHeader = ["#", "Product Name", "Store Name", "Current Stock"];

  private agReport() {
    //debugger;
    this.generateStockInReport(0);
  }

  public datalength: number;
  public stockNo = "";
  public stockInDate = "";
  public bodyData = [];

  barcodePrintList: any[];
  public generateStockInReport(barcodeId) {
    // this.StockinwithbarcodeService.getStockInWithOutPoReportById(barcodeId).subscribe((returns: any) => {
    //   if (returns.success) {
    //     this.bodyData = returns.data;
    //     this.stockNo = this.bodyData[0].stockNo;
    //     this.stockInDate = this.bodyData[0].stockInDate;
    //     this.setParam();
    //     var fileName = this.pageNavigation + ".pdf";
    //     const content = document.getElementById("reportHeader");

    //     this.generateReport("print", fileName, content, this.datalength);
    //   }
    //   else {
    //     this.toastrService.danger("Message", this.commonService.nodatafound);
    //   }
    // });
    this.barcodePrintList = [];
    let barcodePrintQty: number = this.selectedBarcode[0].printQty;
    for (let i = 0; i < barcodePrintQty; i++) {
      let item = {
        printQty: this.selectedBarcode[0].printQty,
        barcodeNo: this.selectedBarcode[0].barcodeNo,
      };

      //i == 0 ? (this.barcodePrintList = items) : this.barcodePrintList.push(items);
      //this.barcodePrintList.push(items);
      if (this.barcodePrintList == null) this.barcodePrintList[0] = item;
      else this.barcodePrintList.push(item);
    }

    var fileName = this.pageNavigation + ".pdf";
    const content = document.getElementById("reportHeader");

    this.generateReport("print", fileName, content, this.datalength);
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
