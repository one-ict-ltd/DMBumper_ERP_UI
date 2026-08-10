import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
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
  NbDateService,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { ProductService } from "app/services/inventory/product.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { StockinService } from "app/services/inventory/stockin.service";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import { NumericLiteral } from "typescript";
import { filter } from "rxjs/operators";
import { Message } from "@angular/compiler/src/i18n/i18n_ast";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}


@Component({
  selector: 'ngx-invoice-gdnconfirmation',
  templateUrl: './invoice-gdnconfirmation.component.html',
  styleUrls: ['./invoice-gdnconfirmation.component.scss']
})
export class InvoiceGDNConfirmationComponent implements OnInit {

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

  title = "Hi there!";
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
  //////////////////
  loadFromDateShow: Date = new Date();
  loadToDateShow: Date = new Date();

  show: boolean = true;
  vlucherForm: FormGroup;
  submitted: boolean;
  saveupdate: string = "Save";
  gridbutton: string = "";
  name: string;
  description: string;
  selectedRow: any;

  private gridApi;
  private gridColumnApi;
  _CompanyId: number = 1;
  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };
  Credit: boolean = true;
  //creditNoteList: any[];
  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    // private ProducttransferService: ProducttransferService,
    private productrequisitionService: ProductrequisitionService,
    // private productService: ProductService,
    private comboService: CommoncomboService,
    private stockinService: StockinService,
    private salesinvoiceService: SalesinvoiceService,
    private PurchaseorderService: PurchaseorderService,
    private datePipe: DatePipe,
    private fieldforcemasterService: FieldforcemasterService,
    protected dateService: NbDateService<Date>,
  ) {
    this.creditNoteMsg = "";
    this.AdjustAmount = 0;
    this.Credit = false;

    this.commonService.valueSet("showlist");
    //this.getServerDateTime();
    // debugger;

    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 50,
      }, /// Dont Change
      {
        headerName: "Invoice No.",
        field: "salesInvoiceNo",
        width: 180,
      },
      {
        headerName: "Inv. Date",
        field: "salesInvoiceDate",
        width: 130,
      },
      {
        headerName: "Territory Name",
        field: "TerritoryName",
        width: 220,
      },
      {
        headerName: "Party Name",
        field: "partyName",
        width: 220,
      },

      {
        headerName: "Address",
        field: "address",
        width: 260,
      },

      // {
      //   headerName: "Net Total",
      //   field: "grandTotal",
      //   width: 120,
      //   valueFormatter: (params) =>
      //     commonService.currencyFormatter(params.data.grandTotal),
      //   type: "rightAligned",
      // },

      {
        headerName: "GDN Status",
        field: "isClosed",
        width: 130,
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
    };
    //debugger;
    this.loadListOfConfirmation();
    this.getMaster();
    //this.GetCollectionDiscountNotApplicableProductList();
    //this.getMaxNo();
    //this.getStore();
    //this.getzone();
    //this._CompanyId = Number(this.commonService.getCurrentCompany());
    //this.GetAllPartysByTypeId(0);
    this.getAllTerritory();
    //this.getAllProductForRequisition();
    //this.GetTransactionType();
    this.loadFromDateShow.setDate(this.loadFromDateShow.getDate() - 0);
    this.fDate.setDate(this.fDate.getDate() - 0);
  }

  // onGridReady(params) {
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  //   this.salesinvoiceService.GetSalesInvoiceById(0).subscribe((data: any) => {
  //     if (data.success) {
  //       this.rowData = data.data;
  //     }
  //   });
  // }




  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.GetGridData();
    this.loadListData();
  }

  fDate: Date = new Date();
  tDate: Date = new Date();

  loadListData() {
    this.salesinvoiceService.GetInvoiceGDNConfirmationData(0, this.commonService.DateFormat(this.fDate), this.commonService.DateFormat(this.tDate), 1).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }



  CollectionDiscountNotApplicableProductList: any[];
  GetCollectionDiscountNotApplicableProductList() {
    this.CollectionDiscountNotApplicableProductList = [];
    this.salesinvoiceService.GetCollectionDiscountNotApplicableProductList(0).subscribe((data: any) => {
      if (data.success) {
        this.CollectionDiscountNotApplicableProductList = data.data;
        //console.log(this.CollectionDiscountNotApplicableProductList);
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
    this.commonService.agButtonClicked = "";

    if (data == "edit") {
      //this.agEdit(event); 
      this.toastrService.info("Access denied !", "Message");
      this.commonService.valueSet("showlist");
      //this.show = true;     
      return;
    } else if (data == "view") {
      this.toastrService.info("Access denied !", "Message");
      this.commonService.valueSet("showlist");
      //this.show = true;      
      return;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {

      if (this.master.salesInvoiceId > 0 && (this.master.hasCollection > 0 || this.master.hasPicking > 0)) {
        this.toastrService.warning(`This Invoice has one or more collections / picking, so you can not delete this invoice.`, 'Warning !')
        return;
      }

      this.agDelete(event);
    } else {
      this.toastrService.info("Please Click Any Button", "Warning");
    }
  }

  private agEdit(event) {
    debugger
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
      var salesInvoiceId = event.node.data.salesInvoiceId;
      //debugger;
      this.getStore();
      this.salesinvoiceService
        .GetSalesInvoiceById(salesInvoiceId)
        .subscribe((data: any) => {
          if (data.success) {
            this.master.lstMasterViewModel = data.data;

            //console.log("last view modell for edit after edit call=============",this.master.lstMasterViewModel);
            // this.salesinvoiceService
            //   .GetSalesInvoiceDetailsByMasterId(salesInvoiceId)
            //   .subscribe((data: any) => {
            //     if (data.status) {
            //       this.master.lstDetailsViewModel = data.data;
            //       //console.log(this.master);
            //       if (this._CompanyId == 1) {
            //         //this.VerifyNationalBonusForGrid();
            //         this.VerifyNationalBonusForEditGrid();
            //         //this.calculateGrandTotal();
            //       }

            //     }

            //     this.salesinvoiceService
            //       .GetSalesInvoiceTCByMasterId(salesInvoiceId)
            //       .subscribe((data: any) => {
            //         if (data.success) {
            //           this.master.tcLstDetailsViewModel = data.data;
            //           ////console.log(this.master);
            //         }
            //       });
            //     this.master.productSpecSelected = {
            //       id: this.master.productWiseSpecificationId,
            //       name: this.master.productName,
            //     };

            //     this.master.vat = 0;
            //     this.master.ait = 0;
            //     this.master.invoiceQty = 0;
            //     this.master.discountAmount = 0;
            //     this.calculateGrandTotal();
            //   });
            ////console.log(this.master);

            // this.master.salesInvoiceDate = new Date(this.master.salesInvoiceDate);
            //this.master.paymentDate = this.master.paymentDate == null ? null : new Date(this.master.paymentDate);


          }
        });
      this.ngOnInit();
    }
  }

  private agReport(event) {
    //this.toastrService.info("Print button clicked", "Warning");
    //this.generateReport("print", event.data.salesInvoiceId);
    this.generateReport2("print", event.data.salesInvoiceId);
  }

  private agDelete(event) {

    let gid = this.commonService.getUserGroup();
    if (gid != '1' && gid !='2') {
      this.toastrService.danger("Permission denied!!.", "Warning");
      return false;
    }
    this.master.salesInvoiceId = event.node.data.salesInvoiceId;
    this.salesinvoiceService
      .DeleteGDNById(this.master.salesInvoiceId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Warning");
        }
      });
  }

  ngOnInit() {
    //debugger;
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Invoice GDN Confirmation";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.GetSalesInvoiceMasterListByTerritory(0);
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.Credit = false;
      this.master.lstCreditNoteViewModel = [];
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");
      this.save();
      // this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      //this.edit();
      this.show = false;
    }
  }

  master: {
    hasPicking: number;
    hasCollection: number;
    collectionDate: Date;
    salesInvoiceId: number;
    salesInvoiceNo: string;
    batchNo: string;
    salesInvoiceDate: Date;
    paymentDate: Date;
    pickingDate: Date;
    fDate: Date;
    tDate: Date;
    isConfirmed: number;
    storeId: number;
    partyId: number;
    partyName: string;
    partySelected: {};

    mobileNo: string;
    alternateMobileNo: string;
    address: string;

    totalPrice: number;
    totalGross: number;
    totalVat: number;
    totalAit: number;
    shippingCost: number;
    totalDiscountAmount: number;
    grandTotal: number;
    approvalStatus: number;

    isActive: number;
    isDelete: number;

    uomName: string;
    uomId: number;
    productId: number;
    productWiseSpecificationId: number;
    productName: string;
    productSpecSelected: {};
    BatchSelected: {};

    price: number;
    invoiceQty: number;
    vat: number;
    ait: number;
    discountAmount: number;
    total: number;

    termsAndCondition: string;

    isAutoStock: number;
    currentStock: number;
    storeSlected: {};

    refNo: string;
    transactionTypeId: number;
    transactionTypeSelected: {};

    lstDetailsViewModel: any[];
    tcLstDetailsViewModel: any[];
    lstCreditNoteViewModel: any[];
    lstProductListViewModel: any[];

    territoryCode: string;

    zoneSelected: {};
    depotSelected: {};
    regionSelected: {};
    areaSelected: {};
    territorySelected: {};
    terriSelected: {};
    confirmedSelected: {};
    areaCode: any;
    territoryid: any;

    lstMasterViewModel: any[];


  };

  public getMaster() {
    this.master = {
      hasPicking: 0,
      hasCollection: 0,
      collectionDate: null,
      salesInvoiceId: 0,
      salesInvoiceNo: "",
      batchNo: "",
      isConfirmed: 1,
      salesInvoiceDate: new Date(this.currentDate),
      paymentDate: new Date(),
      pickingDate: new Date(),
      fDate: new Date(),
      tDate: new Date(),

      storeId: 0,
      partyId: 0,
      partyName: "",
      partySelected: null,
      confirmedSelected: null,

      mobileNo: "",
      alternateMobileNo: "",
      address: "",

      totalPrice: 0,
      totalGross: 0,
      totalVat: 0,
      totalAit: 0,
      totalDiscountAmount: 0,
      grandTotal: 0,
      shippingCost: 0,

      approvalStatus: 0,
      isActive: 1,
      isDelete: 0,

      uomName: "",
      uomId: 0,
      productId: 0,
      productWiseSpecificationId: 0,
      productName: "",
      productSpecSelected: null,
      BatchSelected: null,

      price: 0,
      invoiceQty: 0,
      vat: 0,
      ait: 0,
      discountAmount: 0,
      total: 0,

      termsAndCondition: "",

      isAutoStock: 0,
      currentStock: 0,
      storeSlected: null,

      refNo: "",
      transactionTypeId: 0,
      transactionTypeSelected: null,

      lstDetailsViewModel: [],
      tcLstDetailsViewModel: [],
      lstCreditNoteViewModel: [],
      lstMasterViewModel: [],
      lstProductListViewModel: [],

      territoryCode: "",

      zoneSelected: null,
      depotSelected: null,
      regionSelected: null,
      areaSelected: null,
      territorySelected: null,
      terriSelected: null,
      areaCode: '',
      territoryid: '',
    };
    //this.getMaxNo();
    //this.GetAutoStockInOutStatus();
    //this.getCompanyAndPType();

    //this.Credit = false;
    //this.master.lstCreditNoteViewModel = [];

    this.master.isConfirmed = 1;
    this.master.confirmedSelected = {
      id: this.listOfConfirmation[0].id,
      name: this.listOfConfirmation[0].name,
    };
    //console.log("confirmedSelected=======================",this.master.confirmedSelected);
  }

  minDate: Date = new Date();
  maxDate: Date = new Date();
  currentDate: Date = new Date();
  // getServerDateTime() {
  //   //debugger;
  //   ////console.log('ServerDateTime');
  //   let apiUrl = `menu/getServerDateTime`;
  //   this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
  //     if (returns.success) {
  //       debugger;
  //       ////console.log(returns);
  //       this.currentDate = new Date(returns.data[0].currentDate);

  //       this.minDate = this.dateService.addDay(new Date(returns.data[0].minSIDate), 0);
  //       this.maxDate = this.dateService.addDay(new Date(returns.data[0].maxSIDate), 0);
  //     } else {
  //       this.currentDate = new Date();
  //       this.minDate = this.dateService.addDay(new Date(), -0);
  //       this.maxDate = this.dateService.addDay(new Date(), 0);
  //     }
  //   });
  // }

  // public zoneList = [];
  // public getzone() {
  //   this.fieldforcemasterService.getZone(0).subscribe((retuns: any) => {
  //     if (retuns.length) {
  //       this.zoneList = retuns.map((val: any) => ({
  //         id: val.Code,
  //         name: val.Name,
  //       }))
  //     }
  //   })
  // }
  // public depotList = [];
  // public getdepot() {
  //   var zoneId = 0;
  //   this.fieldforcemasterService.getZone(0).subscribe((retuns: any) => {
  //     if (retuns.length) {
  //       zoneId = retuns[0].ZoneID
  //     }
  //   })
  //   this.fieldforcemasterService.getDepo(zoneId).subscribe((retuns: any) => {
  //     if (retuns.success) {
  //       this.depotList = retuns.data.map((val: any) => ({
  //         id: val.Code,
  //         name: val.Name,
  //       }))
  //     }
  //   })
  // }
  // public getdepotbyCode(zoneCode) {
  //   this.master.depotSelected = {};
  //   this.fieldforcemasterService.getDepoByZoneCode(zoneCode).subscribe((retuns: any) => {
  //     if (retuns.success) {
  //       this.depotList = retuns.data.map((val: any) => ({
  //         id: val.Code,
  //         name: val.Name,
  //       }))
  //     }
  //   })
  // }

  // areaList: any = [];
  // getAllArea(code: string = '') {
  //   this.areaList = [];
  //   this.master.areaCode = '';
  //   this.master.areaSelected = {};

  //   this.TerritoryList = [];
  //   this.master.territoryid = '';
  //   this.master.territorySelected = {};

  //   this.apiUrl = "";

  //   this.apiUrl = `ERPCompany/getPendingPickingAreaByUser?code=${code}`;

  //   this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
  //     if (returns.success) {
  //       debugger;
  //       this.areaList = returns.data.map((val: any) => ({
  //         id: val.AreaCode,
  //         name: val.AreaName,
  //       }));
  //     }
  //   });
  // }


  // public TerritoryList = [];
  // public getterritorybyareaCode() {
  //   this.master.territoryid = '';
  //   this.master.territorySelected = null;
  //   this.TerritoryList = [];
  //   this.fieldforcemasterService.getTerritoryForPickingByUser(this.master.areaCode).subscribe((retuns: any) => {
  //     if (retuns.success) {
  //       this.TerritoryList = retuns.data.map((val: any) => ({
  //         id: val.TerritoryCode,
  //         name: val.TerritoryName,
  //       }))
  //     }
  //   })
  // }
  // public LoadTerritoryWise() {
  //   // this.salesinvoiceService
  //   //   .GetSalesInvoiceMasterListByStatusandTerritory(1, id)
  //   //   .subscribe((returns: any) => {
  //   //     if (returns.success) {
  //   //       //console.log('LoadTerritoryWise', returns.data);
  //   //       this.master.lstMasterViewModel = returns.data;
  //   //     }
  //   //   });
  //   debugger;
  //   if (this.master.areaSelected == undefined || this.master.areaSelected == null) {
  //     this.toastrService.warning("Please select a Area.", "Message")
  //     return
  //   }

  //   this.GetSalesInvoiceMasterListByTerritory();
  // }


  totalRows: number = 0;
  public GetSalesInvoiceMasterListByTerritory(gdnType: number) {
    debugger;
    //this.commonService.valueSet("create");

    this.master.lstMasterViewModel = null;
    this.totalRows = 0;
    // this.salesinvoiceService
    //   .GetSalesInvoiceMasterListByStatusJson(1, this.master.territoryid, this.master.transactionTypeId, this.master.areaCode)
    //   .subscribe((returns: any) => {
    //     if (returns.success) {
    //       this.totalRows = returns.data.length;
    //       if (this.totalRows == 0) this.toastrService.warning("No Invoice Found!", "info");
    //       ////console.log('returns.data', returns.data);
    //       this.master.lstMasterViewModel = returns.data;
    //     }
    //     else {
    //       this.toastrService.warning("No Invoice Found!", "info");
    //     }
    //   });


    this.salesinvoiceService.GetInvoiceGDNConfirmationData(0, this.commonService.DateFormat(this.master.fDate), this.commonService.DateFormat(this.master.tDate), gdnType).subscribe((data: any) => {
      if (data.success) {
        //this.rowData = data.data;
        this.master.lstMasterViewModel = data.data;
        this.totalRows = data.data.length;
        if (this.totalRows == 0) this.toastrService.warning("No Invoice Found!", "info");
      }
    });
  }

  // public AreaList = [];
  // public getareabyregionCode(ZoneCode) {
  //   this.master.areaSelected = {};
  //   this.fieldforcemasterService.getAreabyregioncode(ZoneCode).subscribe((retuns: any) => {
  //     if (retuns.success) {
  //       this.AreaList = retuns.data.map((val: any) => ({
  //         id: val.Code,
  //         name: val.Name,
  //       }))
  //     }
  //   })
  // }
  public RegionList = [];
  public GetRegionByZoneOrDepoCode(ZoneCode, DepoCode) {
    this.master.regionSelected = {};
    this.fieldforcemasterService.GetRegionByZoneOrDepoCode(ZoneCode, DepoCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.RegionList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }

  /*
GetRegionByZoneCode( ZoneCode);GetRegionByZoneOrDepoCode
GetDepoByRegionCode( RegionCode)
GetAreaByDepoCode(DepoCode);
  */
  public zoneChange(ZoneCode) {
    this.master.regionSelected = {};
    this.fieldforcemasterService.GetRegionByZoneCode(ZoneCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.RegionList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }
  // public GetAllDepo() {
  //   this.master.depotSelected = {};
  //   this.fieldforcemasterService.GetAllDepo('').subscribe((retuns: any) => {
  //     if (retuns.success) {
  //       this.depotList = retuns.data.map((val: any) => ({
  //         id: val.Code,
  //         name: val.Name,
  //       }))
  //     }
  //   })
  // }

  // public regionChange_BAK(RegionCode) {
  //   this.master.depotSelected = {};
  //   this.fieldforcemasterService.GetDepoByRegionCode(RegionCode).subscribe((retuns: any) => {
  //     if (retuns.success) {
  //       this.depotList = retuns.data.map((val: any) => ({
  //         id: val.Code,
  //         name: val.Name,
  //       }))
  //     }
  //   })
  // }

  // public regionChange(RegionCode) {
  //   debugger;
  //   this.master.areaSelected = {};
  //   this.fieldforcemasterService.GetAreaByRegionCode(RegionCode).subscribe((retuns: any) => {
  //     if (retuns.success) {
  //       this.areaList = retuns.data.map((val: any) => ({
  //         id: val.Code,
  //         name: val.Name,
  //       }))
  //     }
  //   })
  // }

  // public depoChange(DepoCode) {
  //   this.master.areaSelected = {};
  //   this.fieldforcemasterService.GetAreaByDepoCode(DepoCode).subscribe((retuns: any) => {
  //     if (retuns.success) {
  //       this.areaList = retuns.data.map((val: any) => ({
  //         id: val.Code,
  //         name: val.Name,
  //       }))
  //     }
  //   })
  // }



  // public TerritoryList = [];
  // public getterritorybyareaCode(ZoneCode) {
  //   this.master.territorySelected = null;
  //   this.fieldforcemasterService.getTerritorybyAreacode(ZoneCode).subscribe((retuns: any) => {
  //     if (retuns.success) {
  //       this.TerritoryList = retuns.data.map((val: any) => ({
  //         id: val.TerritoryCode,
  //         name: val.TerritoryName,
  //       }))
  //     }
  //   })
  // }

  public GetAutoStockInOutStatus() {
    this.PurchaseorderService.GetAutoStockInOutSettingStatusById(2).subscribe(
      (returns: any) => {
        if (returns.success) {
          this.master.isAutoStock = returns.data[0].isAutoStock;
        }
      }
    );
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
      //console.log("Click action button");
    }
  }
  /////End of Dynamic Button section (Do Not Edit)///////

  /////////////////////////////// CRUD ///////////////////////////////////////////

  public getTerritoryOfficerByPartyId() {
    //debugger;

  }

  private view() {
    this.toastrService.info("Data can not View", "Warning");
  }

  private save() {
    debugger;
    var button = this.commonService.buttonClicked;

    //this.commonService.valueSet("create");
    let len = this.invoiceIds.length;
    let inviId = this.invoiceIds.slice(0, len - 1);
    let model = {
      Ids: inviId,
      gdnType: this.master.isConfirmed,
    }

    if (inviId.length > 1) {
      this.salesinvoiceService
        .SaveSaleInvoiceGDNConfirmation(model)
        .subscribe((returns: any) => {
          if (returns.success) {
            if (button == "update") {
              this.toastrService.success(
                this.commonService.updatedmsg,
                "Warning"
              );
            } else {
              this.toastrService.success(
                this.commonService.successmsg,
                "Warning"
              );
            }

            this.loadListData();
          }
          else {
            this.toastrService.danger(
              this.commonService.failedmsg,
              "Warning"
            );
          }
        });
    }
    else {
      this.toastrService.success(
        this.commonService.warningmsg,
        "Please Checked at least one Invoice"
      );
    }


    this.getMaster();
    this.invoiceIds = "";
    model = {
      Ids: null,
      gdnType: -1
    };

  }
  invoiceIds = "";
  getInvoiceIds() {

    this.invoiceIds = "";
    this.master.lstMasterViewModel.forEach(element => {
      if (element.isSelect == true) {
        this.invoiceIds += element.salesInvoiceId + ',';
      }
    });
    //console.log(this.invoiceIds);
  }

  private reset() {
    this.loadFromDateShow.setDate(this.loadFromDateShow.getDate() - 15);
    this.getMaster();
    //this.getzone();
  }

  //////////////////////////////// End CRUD /////////////////////////////////////////

  onRefesh() {
    this.selectedRow = "";
    this.ngOnInit();
    //this.onGridReady;
    this.toastrService.warning("warning", this.commonService.warningmsg);
  }
  refesh() {
    window.location.reload();
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

  //////// grid data load from api////////

  transactionTypeList = [];
  public GetTransactionType() {
    this.PurchaseorderService.GetTransactionType(0).subscribe(
      (returns: any) => {
        if (returns.success) {
          this.transactionTypeList = returns.data.map((val) => ({
            id: val.transactionTypeId,
            name: val.transactionTypeName,
          }));
          // debugger;
          // if (this.transactionTypeList.length > 0) {
          //   this.master.transactionTypeId = this.transactionTypeList[1].id;
          //   this.master.transactionTypeSelected = { id: this.transactionTypeList[1].id, name: this.transactionTypeList[1].name };
          // }
          this.transactionTypeList.splice(0, 0, {
            id: 0,
            name: 'All',
          });

        }
      }
    );
  }
  public StoreList = [];
  public getStore() {
    this.stockinService.getStore(0, 0).subscribe((returns: any) => {
      if (returns.success) {
        this.StoreList = returns.data.map((val) => ({
          id: val.storeId,
          name: val.storeName,
        }));

        if (returns.data.length > 0) {
          this.master.storeSlected = {
            id: returns.data[0].storeId,
            name: returns.data[0].storeName,
          };
          this.master.storeId = returns.data[0].storeId;
          //alert(returns.data[0].storeId);
        }
      }
    });
  }

  nationalDiscount: number = 0;
  public getCurrentStock() {
    /*
    //this.master.currentStock = 0;
    this.nationalDiscount = 0;
    if (this.master.productWiseSpecificationId > 0) {
      this.salesinvoiceService
        .GetCurrentStock(
          this.master.storeId,
          this.master.productWiseSpecificationId
        )
        .subscribe((returns: any) => {
          if (returns.success) {
            this.master.currentStock = returns.data[0].length == 0 ? 0 : returns.data[0].currentStock;
            //this.nationalDiscount = returns.data[0].length == 0 ? 0 : returns.data[0].nationalDiscount;
          }
        });
      //this.validateInvoiceQty();
    }
 */

    //added on 27-Apr-2023 for Batch no.

    if (this.master.productSpecSelected == (undefined || null)) return;

    this.master.currentStock = null;
    this.BatchList = [];
    this.master.BatchSelected = {};

    let apiUrl = `SalesInvoice/GetProductBatch?storeId=${this.master.storeId}&productWiseSpecificationId=${this.master.productWiseSpecificationId}`;

    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {

      if (returns.success) {
        //console.log('Batch: ', returns.data);
        this.BatchList = returns.data.map((val: any) => ({
          id: val.id,
          name: val.name,
          batchNo: val.batchNo,
          currentStock: val.currentStock,
          EXPIREDATE: val.EXPIREDATE,
        }));

        //console.log("BatchList", this.BatchList);
        if (returns.data.length > 0) {
          this.master.batchNo = returns.data[0].batchNo;
          this.master.currentStock = returns.data[0].currentStock;
          this.master.BatchSelected = {
            id: returns.data[0].id,
            name: returns.data[0].name,
            batchNo: returns.data[0].batchNo,
            currentStock: returns.data[0].currentStock,
            EXPIREDATE: returns.data[0].EXPIREDATE,
          };
        } else {
          this.toastrService.warning("Current stock information not available for this product.", "Message");
        }
      }
    });
  }

  BatchList: any = [];
  getBatchStock() {
    this.master.currentStock = 0;
    this.stockinService
      .GetCurrentStock(this.master.storeId, this.master.productWiseSpecificationId, this.master.batchNo)
      .subscribe((returns: any) => {
        ////console.log(returns.data);
        this.master.currentStock = returns.data.length > 0 ? returns.data[0].currentStock : 0;
      });
  }

  public validateInvoiceQty() {
    // if (
    //   this.master.invoiceQty == null
    //     ? 0
    //     : this.master.invoiceQty > this.master.currentStock
    // )
    //   this.master.invoiceQty = 0;
  }

  public getMaxNo() {
    this.salesinvoiceService
      .GetMaxSalesInvoiceNumber(
        this.datePipe.transform(this.master.salesInvoiceDate, "yyyy-MM-dd")
      )
      .subscribe((returns: any) => {
        //debugger;
        if (returns.success) {
          this.master.salesInvoiceNo = returns.data[0].MaxNo;
        }
      });
    this.GetItemWsieBonus();

    if (this.master.salesInvoiceId > 0 && (this.master.hasCollection > 0 || this.master.hasPicking > 0)) {
      if (this.master.collectionDate != null && (new Date(this.master.collectionDate) < new Date(this.master.salesInvoiceDate))) {
        this.toastrService.warning(`Invoice date can not be less than from collection / picking date (${this.commonService.DateFormat(this.master.collectionDate)}) .`, 'Warning !')
      }
    }
  }


  territoryList: any = [];
  getAllTerritory() {
    this.territoryList = [];
    this.salesinvoiceService
      .GetAllTerritoryForDepot()
      .subscribe((returns: any) => {
        if (returns.success) {
          this.territoryList = returns.data.map((val: any) => ({
            id: val.TerritoryCode,
            name: val.TerritoryName,
          }));
        }
      });
  }


  public partyList = [];
  public GetAllActivePartyByTypeId(partyTypeId: any) {

    this.partyList = [];
    this.master.partySelected = null;
    this.master.partyId = 0;

    if (this.master.territoryCode == null || this.master.territoryCode == '') return;

    this.salesinvoiceService
      .GetAllActivePartysByTypeId(partyTypeId, 0, this.master.territoryCode)
      .subscribe((returns: any) => {
        this.partyList = returns.data.map((val: any) => ({
          id: val.partyId,
          name: val.partyName,
          address: val.address,
          mobileNo: val.mobileNo,
          territoryDetails: val.territoryDetails,
        }));
      });
  }


  hasDeed: boolean = true;
  overDuesStatus: boolean = false;
  creditLimitCrossed: boolean = false;
  TerritoryDetails: string = "";
  balanceAmount: number = 0;

  public GetPartyDetails() {
    this.balanceAmount = 0;
    this.TerritoryDetails = "";
    this.master.mobileNo = this.master.partySelected["mobileNo"];
    this.master.address = this.master.partySelected["address"];
    this.TerritoryDetails = this.master.partySelected["territoryDetails"];
    ////console.log(this.TerritoryDetails, this.master.partySelected);

    this.salesinvoiceService.GetCustomerDuesStatus(this.master.partyId).subscribe((returns: any) => {
      if (returns.success) {
        this.TerritoryDetails = `${this.master.partySelected["territoryDetails"]}; Has Deed: ${returns.data[0].hasDeed}; Credit Limit: ${returns.data[0].creditLimit} TK; Dues Amount: ${returns.data[0].duesAmount} TK; Credit Limit Crossed: ${returns.data[0].creditLimitCrossed}; Has Over Dues Days: ${returns.data[0].overDuesStatus}`;

        this.balanceAmount = returns.data[0].creditLimit - returns.data[0].duesAmount;

        if (returns.data[0].hasDeed == "No") {
          this.hasDeed = false;
          this.master.lstDetailsViewModel = [];
          this.master.totalGross = 0;
          this.master.grandTotal = 0;
          this.toastrService.warning("This customer has not deed.", "Warning !!!")
        }
        if (returns.data[0].overDuesStatus == "Yes") {
          this.overDuesStatus = true;
          this.master.lstDetailsViewModel = [];
          this.master.totalGross = 0;
          this.master.grandTotal = 0;
          this.toastrService.warning("This customer has over dues days invoice.", "Warning !!!")
        }
        else if (returns.data[0].creditLimitCrossed == "Yes") {
          this.creditLimitCrossed = true;
          this.master.lstDetailsViewModel = [];
          this.master.totalGross = 0;
          this.master.grandTotal = 0;
          this.toastrService.warning("This customer has crossed credit limit.", "Warning !!!")
        }
        else {
          this.hasDeed = true;
          this.overDuesStatus = false;
          this.creditLimitCrossed = false;
        }
      }
    });

    this.GetCreditNoteList();
  }
  creditNoteMsg = "";
  AdjustAmount: number = 0;
  GetCreditNoteList() {

    //this.creditNoteList = [];
    this.AdjustAmount = 0;
    this.salesinvoiceService.GetCreditNoteList(this.master.partyId, this.master.salesInvoiceId).subscribe((returns: any) => {
      if (returns.success) {
        this.master.lstCreditNoteViewModel = returns.data;

        if (this.master.lstCreditNoteViewModel.length > 0) {
          this.Credit = true;
          this.creditNoteMsg = "This Customer Has pending Credit Note. Please see the details end of this page ";
          this.toastrService.info("This Customer Has pending Credit Note. Please see the details end of this page ", "");
        }
        else {
          this.creditNoteMsg = "";
          this.Credit = false;
        }
      }
    });
  }

  checkChange(rowIndex: number) {
    if (this.master.lstCreditNoteViewModel[rowIndex].isSelect == false && this.master.lstCreditNoteViewModel[rowIndex].salesInvoiceId > 0) {
      this.salesinvoiceService.PExpireReturnInvoiceIdRemoveByUncheck(this.master.lstCreditNoteViewModel[rowIndex].productExpireReturnId).subscribe((returns: any) => {
        if (returns.success) {

        }
      });
    }
    this.AdjustAmount = 0;
    this.master.lstCreditNoteViewModel.forEach(el => {
      if (el.isSelect) {
        this.AdjustAmount += el.amount;
      }
    });
  }

  public getProductSpecDetails() {
    this.master.totalPrice = 0;
    this.master.price = 0;
    this.master.productId = this.master.productSpecSelected["productId"];
    this.master.uomName = this.master.productSpecSelected["uomName"];
    this.master.productName = this.master.productSpecSelected["name"];
    this.master.productWiseSpecificationId =
      this.master.productSpecSelected["id"];
    let companyAliasName = this.salesinvoiceService.GetCompanyAliasName();
    // if (companyAliasName == "EVERGREEN")
    //   this.master.price = this.master.productSpecSelected["price"];
    //this.master.price = this.master.productSpecSelected["price"];
    this.master.price = this.master.productSpecSelected["tradePrice"];
    this.master.vat = this.master.productSpecSelected["unitVat"];

    this.getCurrentStock();
  }

  public productSpecList = [];
  public getAllProductForRequisition() {
    this.productrequisitionService
      .getAllProductForRequisition()
      .subscribe((returns: any) => {
        this.productSpecList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uomId: val.uomId,
          uomName: val.uomName,
          productId: val.productId,
          price: val.price,
          tradePrice: val.tradePrice,
          unitVat: val.unitVat,
        }));
      });
  }

  public CaculateUnitPrice() {
    if (this.master.totalPrice == undefined || this.master.totalPrice < 0)
      this.master.totalPrice = 0;
    this.master.price = this.master.totalPrice / this.master.invoiceQty;
  }

  public CalculateTotalPrice() { // b4 add to list
    // if (this.master.invoiceQty == undefined || this.master.invoiceQty < 0)
    //   this.master.invoiceQty = 0;
    if (this.master.price == undefined || this.master.price == null || this.master.price < 0)
      this.master.price = 0;

    this.master.totalPrice = this.roundToDigit((this.master.price * (this.master.invoiceQty == null ? 0 : this.master.invoiceQty)), 2);

    if (this.master.totalPrice >= this.lowestAmnt && this.master.totalPrice < this.midAmnt && this.hasNationalBonus == 1) {// 2.00 %
      this.master.discountAmount = this.commonService.roundWithDecimalPoint(this.master.price * this.minNationalBonus, 2);
    }
    else if (this.master.totalPrice >= this.midAmnt && this.master.totalPrice < this.maxAmnt && this.hasNationalBonus == 1) { // 2.50 %
      this.master.discountAmount = this.commonService.roundWithDecimalPoint(this.master.price * this.midNationalBonus, 2);
    }
    else if (this.master.totalPrice >= this.maxAmnt && this.hasNationalBonus == 1) { // 3.00 %
      this.master.discountAmount = this.commonService.roundWithDecimalPoint(this.master.price * this.maxNationalBonus, 2);
    }
    else {
      //this.master.discountAmount = 0
    }
  }

  public calculateTotal(index: number) { // in list

    let totalPrice = 0;
    debugger;
    let invoiceQty =
      this.master.lstDetailsViewModel[index].invoiceQty == (null || 0)
        ? 1
        : this.master.lstDetailsViewModel[index].invoiceQty;

    this.master.lstDetailsViewModel[index].invoiceQty = invoiceQty;

    let price =
      this.master.lstDetailsViewModel[index].price == ""
        ? 0
        : this.master.lstDetailsViewModel[index].price;

    let vat =
      this.master.lstDetailsViewModel[index].vat == ""
        ? 0
        : this.master.lstDetailsViewModel[index].vat;

    let ait =
      this.master.lstDetailsViewModel[index].ait == ""
        ? 0
        : this.master.lstDetailsViewModel[index].ait;



    if (this._CompanyId == 1) {

      this.salesinvoiceService
        .GetItemWsieBonus(
          this.commonService.DateFormat(this.master.salesInvoiceDate),
          this.master.lstDetailsViewModel[index].partyId,
          this.master.lstDetailsViewModel[index].productWiseSpecificationId,
          invoiceQty
        )
        .subscribe((returns: any) => {
          debugger;
          if (returns.success) {
            //console.log('OnGridEdit: ', returns);
            let msg = returns.data[0].msg;
            let flatPrice = returns.data[0].price;

            // let discountAmount = returns.data[0].discountAmount;
            // this.master.discountAmount = this.calculateDiscount(this.master.price);
            // this.master.discountAmount = discountAmount;

            if (flatPrice > 0) { this.master.lstDetailsViewModel[index].price = flatPrice; }
            if (msg != '') { this.toastrService.info(msg, 'info'); }


            // this.discountType = ` ( ${msg} )`;
            // this.nationalDiscount = returns.data[0].discountAmount;
            // this.minProductAmt = returns.data[0].minProductAmt;
            // this.hasNationalBonus = returns.data[0].hasNationalBonus;
            // this.minNationalBonus = returns.data[0].minNationalBonus;
            // this.maxNationalBonus = returns.data[0].maxNationalBonus;
            // this.CalculateTotalPrice();

            /*response=
              discountAmount: 2.7
              hasNationalBonus: 1
              lowestAmnt: 0
              maxAmnt: 50000
              maxNationalBonus: 0.03
              midAmnt: 15000
              midNationalBonus: 0.025
              minNationalBonus: 0.02
              minProductAmt: 20000
              msg: "National discount applied"
              price: 0
            */

            this.master.lstDetailsViewModel[index].hasNationalBonus = returns.data[0].hasNationalBonus;
            this.master.lstDetailsViewModel[index].discountAmount = returns.data[0].discountAmount;

            let discountAmount2 = this.master.lstDetailsViewModel[index].discountAmount == "" ? 0 : this.master.lstDetailsViewModel[index].discountAmount;

            totalPrice = invoiceQty * this.master.lstDetailsViewModel[index].price;
            vat = vat * invoiceQty;
            ait = ait * invoiceQty;

            discountAmount2 = discountAmount2 * invoiceQty;

            this.master.lstDetailsViewModel[index].total =
              this.roundToDigit(totalPrice + vat + ait - discountAmount2, 2);
            this.VerifyNationalBonusForGrid();
            //this.calculateGrandTotal();
          }
          else {
            this.hasNationalBonus = null;
            this.toastrService.danger('Network error occurred!', 'Warning !');
          }
        });
    }
    else {



      //this.master.lstDetailsViewModel[index].discountAmount = this.calculateDiscount(price);

      let discountAmount =
        this.master.lstDetailsViewModel[index].discountAmount == ""
          ? 0
          : this.master.lstDetailsViewModel[index].discountAmount;

      totalPrice = invoiceQty * price;
      vat = vat * invoiceQty;
      ait = ait * invoiceQty;

      discountAmount = discountAmount * invoiceQty;

      this.master.lstDetailsViewModel[index].total =
        this.roundToDigit((totalPrice + vat + ait - discountAmount), 2);
      //this.VerifyNationalBonusForGrid();
      this.calculateGrandTotal();
    }

  }

  public calculateTotalForVerifyGrid(index: number) { // in list

    let totalPrice = 0;

    let invoiceQty =
      this.master.lstDetailsViewModel[index].invoiceQty == ""
        ? 0
        : this.master.lstDetailsViewModel[index].invoiceQty;

    let price =
      this.master.lstDetailsViewModel[index].price == ""
        ? 0
        : this.master.lstDetailsViewModel[index].price;

    let vat =
      this.master.lstDetailsViewModel[index].vat == ""
        ? 0
        : this.master.lstDetailsViewModel[index].vat;

    let ait =
      this.master.lstDetailsViewModel[index].ait == ""
        ? 0
        : this.master.lstDetailsViewModel[index].ait;



    if (this._CompanyId == 1) {
      let discountAmount2 =
        this.master.lstDetailsViewModel[index].discountAmount == ""
          ? 0
          : this.master.lstDetailsViewModel[index].discountAmount;

      totalPrice = invoiceQty * this.master.lstDetailsViewModel[index].price;
      vat = vat * invoiceQty;
      ait = ait * invoiceQty;

      discountAmount2 = discountAmount2 * invoiceQty;
      this.master.lstDetailsViewModel[index].total = this.roundToDigit(totalPrice + vat + ait - discountAmount2, 2);
    }
    else {
      let discountAmount =
        this.master.lstDetailsViewModel[index].discountAmount == ""
          ? 0
          : this.master.lstDetailsViewModel[index].discountAmount;

      totalPrice = invoiceQty * price;
      vat = vat * invoiceQty;
      ait = ait * invoiceQty;

      discountAmount = discountAmount * invoiceQty;

      this.master.lstDetailsViewModel[index].total =
        this.roundToDigit((totalPrice + vat + ait - discountAmount), 2);
      //this.VerifyNationalBonusForGrid();
      //this.calculateGrandTotal();
    }

  }

  calculateGrandTotal() {
    let totalGross = 0;
    this.master.lstDetailsViewModel.forEach((row) => {
      totalGross += row.total == "" ? 0 : row.total;
    });
    let totalVat = this.master.totalVat == null ? 0 : this.master.totalVat;
    let totalDiscountAmount =
      this.master.totalDiscountAmount == null
        ? 0
        : this.master.totalDiscountAmount;
    totalVat = totalVat - totalDiscountAmount;
    let totalAit = this.master.totalAit == null ? 0 : this.master.totalAit;
    let shippingCost =
      this.master.shippingCost == null ? 0 : this.master.shippingCost;

    this.master.totalGross = this.roundToDigit(totalGross, 2);
    this.master.grandTotal = this.roundToDigit((totalGross + totalVat + totalAit + shippingCost), 2);
  }

  roundToDigit(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

  public addToDetailsGrid(e: any) {
    debugger;

    if (this._CompanyId == 2) {
      if (!this.hasDeed) {
        this.toastrService.warning("This customer has not Deed. So you can not create any invoice for this customer!", "Message");
        return;
      }
      if (this.overDuesStatus) {
        this.toastrService.warning("This customer has over dues days invoice. So you can not create any invoice for this customer!", "Message");
        return;
      }
      if (this.creditLimitCrossed) {
        this.toastrService.warning("This customer has crossed Credit Limit. So you can not create any invoice for this customer!", "Message");
        return;
      }

      if (((this.master.totalPrice ?? 0) + (this.master.grandTotal ?? 0)) > this.balanceAmount) {
        this.toastrService.warning(`Customer Credit limit has crossed ! Available balance amount for this customer is TK${this.balanceAmount}`, "Message");
        return;
      }
    }


    //#region has Collection Discount not applicable block

    let hasCollDiscount = 1;
    let count = this.master.lstDetailsViewModel.length;
    // const prod = this.master.lstDetailsViewModel.filter(x => x.productWiseSpecificationId == this.master.productWiseSpecificationId)
    const prod = this.CollectionDiscountNotApplicableProductList.filter(x => x.productWiseSpecificationId == this.master.productWiseSpecificationId)
    ////console.log("prod", prod);

    const isArr = Array.isArray(prod);

    if (isArr && prod.length > 0) {
      hasCollDiscount = 0;
    }
    ////console.log("hasCollDiscount", hasCollDiscount);

    if (count > 0) {

      let value = 0;
      this.master.lstDetailsViewModel.forEach(el => {
        value += el.hasCollDiscount;
      });

      let avg = 0;
      if (count > 0) {
        avg = value / count;
      }

      ////console.log("hasCollDiscount", `hasCollDiscount=${hasCollDiscount}, avg=${avg}`);

      if (hasCollDiscount != avg) {
        this.toastrService.danger('Collection discount item and non-discount item can not be added in same invoice. Please create another invoice for this product type.', 'Warning !');
        return;
      }
    }

    //#endregion

    if (this.hasNationalBonus == null) {
      this.toastrService.danger('Network error occurred! You can not add to list this product.', 'Warning !');
      return;
    }
    if (this.master.productSpecSelected == null) {
      this.toastrService.warning("Please select a product !", "Warning");
      return;
    }
    if (this.master.price == 0) {
      this.toastrService.warning("Price can not be zero !", "Warning");
      return;
    }
    if (this.master.currentStock == null) {
      this.toastrService.warning("Current stock information not available for this product.", "Message");
      return false;
    }
    if ((this.master.invoiceQty == null ? 0 : this.master.invoiceQty) == 0) {
      this.toastrService.warning("Quantity can not be zero !", "Warning");
      return;
    }
    var indexu = this.master.lstDetailsViewModel.findIndex(
      (x) =>
        x.productWiseSpecificationId == this.master.productWiseSpecificationId
    );
    if (indexu > -1) {
      this.toastrService.warning("Product Already Exist !!", "Warning");
      return;
    }
    // if (this.master.currentStock == 0) {
    //   this.toastrService.warning("Current stock is not available!", "Warning");
    //   return;
    // }
    if (this.master.invoiceQty > this.master.currentStock) {
      this.toastrService.warning("You do not have enough stock !", "Warning");
      //return;
    }



    let totalPrice =
      (this.master.invoiceQty == null ? 0 : this.master.invoiceQty) *
      (this.master.price == null ? 0 : this.master.price);

    debugger;
    totalPrice =
      totalPrice - (this.master.discountAmount == null ? 0 : this.master.discountAmount * this.master.invoiceQty);

    let vat = this.master.vat == null ? 0 : (this.master.vat * this.master.invoiceQty);
    let ait = this.master.ait == null ? 0 : (this.master.ait * this.master.invoiceQty);
    //let discountAmount = (this.master.invoiceQty * this.master.discountAmount);
    debugger;
    //this.master.discountAmount = 0;
    this.master.total = this.roundToDigit(((totalPrice + vat + ait)), 2);

    let elements = {
      salesInvDetailsId: 0,
      salesInvoiceId: this.master.salesInvoiceId,
      productWiseSpecificationId: this.master.productWiseSpecificationId,
      productId: this.master.productId,
      productName: this.master.productName,
      uomId: this.master.uomId,
      uomName: this.master.uomName,
      invoiceQty: this.master.invoiceQty,

      price: this.master.price,
      vat: this.master.vat == null ? 0 : this.master.vat,
      ait: this.master.ait == null ? 0 : this.master.ait,
      discountAmount: this.master.discountAmount == null ? 0 : this.master.discountAmount,
      total: this.roundToDigit(this.master.total, 2),
      isActive: 1,
      isSelect: 1,
      hasNationalBonus: this.hasNationalBonus,//this.roundToDigit(this.master.total, 2) >= 20000 ? 1 : this.hasNationalBonus,
      discountAmountBAK: this.nationalDiscount,
      batchNo: this.master.batchNo,
      // bonusType:
      hasCollDiscount: hasCollDiscount
    };
    //this.master.lstDetailsViewModel.push(elements);
    this.master.lstDetailsViewModel.splice(0, 0, elements);
    ////console.log(elements);
    if (this._CompanyId == 1) {
      this.VerifyNationalBonusForGrid();
    } else {
      this.calculateGrandTotal();
    }
    //this.VerifyNationalBonusForGrid();

    this.resetCtrl();

  }

  resetCtrl() {
    this.master.productId = 0;
    this.master.productWiseSpecificationId = 0;
    this.master.productSpecSelected = null;
    this.master.currentStock = null;
    this.master.invoiceQty = null;
    this.master.price = null;
    this.master.vat = null;
    this.master.ait = 0;
    this.master.totalPrice = 0;
    this.master.discountAmount = 0;
    this.discountType = '';
  }

  calculateDiscount(tradePrice: number): number {
    let discountAmount = 0;

    if (this._CompanyId == 1) // 1 for Human Health
      discountAmount = (tradePrice * this.nationalDiscount);
    else discountAmount = 0;

    return this.roundToDigit(discountAmount, 2);
  }

  discountType: string = '';
  hasNationalBonus: number = 0;

  minNationalBonus: number = 0.020;
  midNationalBonus: number = 0.025
  maxNationalBonus: number = 0.03;

  minProductAmt: number = 0;

  lowestAmnt: number = 0;
  midAmnt: number = 0;
  maxAmnt: number = 0;


  //midNationalBonus, 20000.00 minProductAmt, 1000 lowestAmnt, 15000 midAmnt, 50000 maxAmnt

  public GetItemWsieBonus() {
    this.nationalDiscount = 0;
    this.hasNationalBonus = 0;
    // this.minNationalBonus = 0;
    // this.maxNationalBonus= 0;
    this.minProductAmt = 0;

    debugger;
    //this.master.currentStock = 0;
    this.master.discountAmount = 0;
    this.discountType = '';
    if (this.master.salesInvoiceDate == null || this.master.productWiseSpecificationId == 0 || this.master.partyId == 0) return;

    if (this.master.productWiseSpecificationId > 0) {
      this.salesinvoiceService
        .GetItemWsieBonus(
          this.commonService.DateFormat(this.master.salesInvoiceDate),
          this.master.partyId,
          this.master.productWiseSpecificationId,
          this.master.invoiceQty
        )
        .subscribe((returns: any) => {
          debugger;
          if (returns.success) {
            //console.log(returns.data);
            let msg = returns.data[0].msg;
            let price = returns.data[0].price;
            let discountAmount = returns.data[0].discountAmount;

            //this.master.discountAmount = this.calculateDiscount(this.master.price);

            if (this._CompanyId == 1) {
              this.master.discountAmount = discountAmount;
              if (price > 0) { this.master.price = price; }
              if (msg != '') { this.toastrService.info(msg, 'info'); }
              this.discountType = ` ( ${msg} )`;

              this.nationalDiscount = returns.data[0].discountAmount;

              this.minProductAmt = returns.data[0].minProductAmt;
              this.hasNationalBonus = returns.data[0].hasNationalBonus;
              this.minNationalBonus = returns.data[0].minNationalBonus;
              this.maxNationalBonus = returns.data[0].maxNationalBonus;

              this.midNationalBonus = returns.data[0].midNationalBonus;
              this.minProductAmt = returns.data[0].minProductAmt;
              this.lowestAmnt = returns.data[0].lowestAmnt;
              this.midAmnt = returns.data[0].midAmnt;
              this.maxAmnt = returns.data[0].maxAmnt;
            }
            this.CalculateTotalPrice();
          }
          else {
            this.hasNationalBonus = null;
            this.toastrService.danger('Network error occurred', 'Warning !');
          }
        });
      //this.validateInvoiceQty();
    }
  }

  VerifyNationalBonusForGrid() {
    let ttlNationalAmnt: number = 0;
    //console.log(this.master.lstDetailsViewModel);
    this.master.lstDetailsViewModel.forEach(element => {

      // if (element.total > this.minProductAmt) element.hasNationalBonus = 1;

      if (element.hasNationalBonus == 1) ttlNationalAmnt += element.price * element.invoiceQty //element.total;
    });

    //console.log('ttlNationalAmnt=', ttlNationalAmnt);

    /*
    
    if (this.master.totalPrice >= this.lowestAmnt && this.master.totalPrice < this.midAmnt && this.hasNationalBonus == 1) {// 2.00 %
          this.master.discountAmount = this.commonService.roundWithDecimalPoint(this.master.price * this.minNationalBonus, 2);
        }
        else if (this.master.totalPrice >= this.midAmnt && this.master.totalPrice < this.maxAmnt && this.hasNationalBonus == 1) { // 2.50 %
          this.master.discountAmount = this.commonService.roundWithDecimalPoint(this.master.price * this.midNationalBonus, 2);
        }
        else if (this.master.totalPrice >= this.maxAmnt && this.hasNationalBonus == 1) { // 3.00 %
          this.master.discountAmount = this.commonService.roundWithDecimalPoint(this.master.price * this.maxNationalBonus, 2);
        }
    
    */


    this.master.lstDetailsViewModel.forEach((element, index) => {
      debugger;

      if (ttlNationalAmnt >= this.lowestAmnt && ttlNationalAmnt < this.midAmnt && element.hasNationalBonus == 1) {
        element.discountAmount = this.commonService.roundWithDecimalPoint(element.price * this.minNationalBonus, 2);// 2.00 %
        element.total = this.commonService.roundWithDecimalPoint(((element.price * element.invoiceQty) + (element.vat * element.invoiceQty) + (element.ait * element.invoiceQty)) - (element.discountAmount * element.invoiceQty), 2);
      }
      else if (ttlNationalAmnt >= this.midAmnt && ttlNationalAmnt < this.maxAmnt && element.hasNationalBonus == 1) {
        element.discountAmount = this.commonService.roundWithDecimalPoint(element.price * this.midNationalBonus, 2);// 2.50 %
        element.total = this.commonService.roundWithDecimalPoint(((element.price * element.invoiceQty) + (element.vat * element.invoiceQty) + (element.ait * element.invoiceQty)) - (element.discountAmount * element.invoiceQty), 2);
      }
      else if (ttlNationalAmnt >= this.maxAmnt && element.hasNationalBonus == 1) {
        element.discountAmount = this.commonService.roundWithDecimalPoint(element.price * this.maxNationalBonus, 2);// 3.0 %
        element.total = this.commonService.roundWithDecimalPoint(((element.price * element.invoiceQty) + (element.vat * element.invoiceQty) + (element.ait * element.invoiceQty)) - (element.discountAmount * element.invoiceQty), 2);
      }
      else {
        //element.discountAmount = 0;
      }

      //this.calculateTotal(index);
      // this.calculateTotalForVerifyGrid(index);
    });
    this.calculateGrandTotal();
  }


  VerifyNationalBonusForEditGrid() {
    let ttlNationalAmnt: number = 0;
    //console.log(this.master.lstDetailsViewModel);
    this.master.lstDetailsViewModel.forEach(element => {

      // if (element.total > this.minProductAmt) element.hasNationalBonus = 1;

      if (element.hasNationalBonus == 1) ttlNationalAmnt += element.price * element.invoiceQty //element.total;
      element.total = this.commonService.roundWithDecimalPoint(((element.price * element.invoiceQty) + (element.vat * element.invoiceQty) + (element.ait * element.invoiceQty)) - (element.discountAmount * element.invoiceQty), 2);
    });

    //console.log('ttlNationalAmnt=', ttlNationalAmnt);

    /*
    
    if (this.master.totalPrice >= this.lowestAmnt && this.master.totalPrice < this.midAmnt && this.hasNationalBonus == 1) {// 2.00 %
          this.master.discountAmount = this.commonService.roundWithDecimalPoint(this.master.price * this.minNationalBonus, 2);
        }
        else if (this.master.totalPrice >= this.midAmnt && this.master.totalPrice < this.maxAmnt && this.hasNationalBonus == 1) { // 2.50 %
          this.master.discountAmount = this.commonService.roundWithDecimalPoint(this.master.price * this.midNationalBonus, 2);
        }
        else if (this.master.totalPrice >= this.maxAmnt && this.hasNationalBonus == 1) { // 3.00 %
          this.master.discountAmount = this.commonService.roundWithDecimalPoint(this.master.price * this.maxNationalBonus, 2);
        }
    
    */

    if (this.master.salesInvoiceId == 0) {
      // this.master.lstDetailsViewModel.forEach((element, index) => {
      //   debugger;

      //   if (ttlNationalAmnt >= this.lowestAmnt && ttlNationalAmnt < this.midAmnt && element.hasNationalBonus == 1) {
      //     element.discountAmount = this.commonService.roundWithDecimalPoint(element.price * this.minNationalBonus, 2);// 2.00 %
      //     element.total = this.commonService.roundWithDecimalPoint(((element.price * element.invoiceQty) + (element.vat * element.invoiceQty) + (element.ait * element.invoiceQty)) - (element.discountAmount * element.invoiceQty), 2);
      //   }
      //   else if (ttlNationalAmnt >= this.midAmnt && ttlNationalAmnt < this.maxAmnt && element.hasNationalBonus == 1) {
      //     element.discountAmount = this.commonService.roundWithDecimalPoint(element.price * this.midNationalBonus, 2);// 2.50 %
      //     element.total = this.commonService.roundWithDecimalPoint(((element.price * element.invoiceQty) + (element.vat * element.invoiceQty) + (element.ait * element.invoiceQty)) - (element.discountAmount * element.invoiceQty), 2);
      //   }
      //   else if (ttlNationalAmnt >= this.maxAmnt && element.hasNationalBonus == 1) {
      //     element.discountAmount = this.commonService.roundWithDecimalPoint(element.price * this.maxNationalBonus, 2);// 3.0 %
      //     element.total = this.commonService.roundWithDecimalPoint(((element.price * element.invoiceQty) + (element.vat * element.invoiceQty) + (element.ait * element.invoiceQty)) - (element.discountAmount * element.invoiceQty), 2);
      //   }
      //   else {
      //     //element.discountAmount = 0;
      //   }

      //// this.calculateTotal(index);
      //// this.calculateTotalForVerifyGrid(index);
      // });
    }
    this.calculateGrandTotal();
  }



  public addTC() {
    //debugger;
    let elements: any = [];
    if (this.master.termsAndCondition == "") {
      this.toastrService.danger("Terms And Condition is empty !", "Warning");
      return;
    }
    elements = {
      salesInvoiceTCId: 0,
      salesInvoiceId: this.master.salesInvoiceId,
      termsAndCondition: this.master.termsAndCondition,
      isActive: 1,
      isSelect: 1,
    };
    this.master.tcLstDetailsViewModel.push(elements);
  }

  public refeshDetails() {
    this.master.lstDetailsViewModel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Warning");
  }

  @Output() myEvent = new EventEmitter();

  public deleteRow(state, action) {
    //debugger;
    const nodeIdToRemove = action.payload;
    const filteredData = state.rowData.filter(
      (node) => node.id !== nodeIdToRemove
    );
    return {
      ...state,
      rowData: [...filteredData],
    };
  }

  public deleteDetails(index: any) {

    if (this.master.salesInvoiceId > 0 && (this.master.hasCollection > 0 || this.master.hasPicking > 0)) {
      if (this.master.collectionDate != null && (this.master.collectionDate < this.master.salesInvoiceDate)) {
        this.toastrService.warning(`You can not delete this invoice item because it has already minimum one collection / picking`, 'Warning !')
        return;
      }
    }
    else {
      if (confirm('Are you sure to delete?')) {
        this.salesinvoiceService
          .DeleteSalesInvoiceDetailsById(
            this.master.lstDetailsViewModel[index].salesInvDetailsId
          )
          .subscribe((returns: any) => {
            if (returns.success) {
              this.toastrService.success(this.commonService.deletedmsg, "Message");
              this.selectedRow = this.master.lstDetailsViewModel[index];
              this.master.lstDetailsViewModel.splice(index, 1);
              if (this.selectedRow.helpDetailId > 0) {
              }
              //this.calculateTotal(index);
              if (this._CompanyId == 1) {
                this.VerifyNationalBonusForGrid();
              }
              else {
                this.calculateTotal(index);
              }
            }
            else {
              this.toastrService.warning('Data Delete Failed!', "Message");
            }
          });
      }
    }
  }

  public deleteTC(index: any) {
    this.salesinvoiceService
      .DeleteSalesInvoiceTCById(
        this.master.tcLstDetailsViewModel[index].salesInvoiceTCId
      )
      .subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Warning");
        }
      });

    this.selectedRow = this.master.tcLstDetailsViewModel[index];
    this.master.tcLstDetailsViewModel.splice(index, 1);
    if (this.selectedRow.helpDetailId > 0) {
    }
    this.toastrService.danger(this.commonService.deletedmsg, "Warning");
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

  //#region Report

  public rPartyName: string = "";
  public rBranchName: string = "";
  public rSalesInvoiceNo: string = "";
  public rInvoiceDate: string = "";
  public rPaymentDate: string = "";

  public rtotalGross: number = 0;
  public rtotalVat: number = 0;
  public rtotalAit: number = 0;
  public rshippingCost: number = 0;
  public rtotalDiscountAmount: number = 0;
  public rgrandTotal: number = 0;

  public rReportHeader = "Sales Invoice Report";
  public tableHeader = [
    "#",
    "Product Name",
    "Warranty",
    "Quantity",
    "UOM",
    "Price",
    "AIT",
    "VAT",
    "Discount",
    "Total",
  ];
  public apiUrl = "";
  public htmlBodyData: string = "";

  public params = [];
  public bodyData: any = [];
  public bodyDatashow: any = [];
  public address: any = [];

  private getReportData(salesInvoiceId: number) {
    try {
      this.salesinvoiceService
        .GetAddressForReportFooter(0)
        .subscribe((returns: any) => {
          if (returns.success && returns.data.length > 0) {
            this.address = [];
            this.address = returns.data;
          }
        });

      this.apiUrl = `SalesInvoice/GetSalesInvoiceReportDataById?salesInvoiceId=${salesInvoiceId}`;
      this.commonService
        .getReportData(this.apiUrl)
        .subscribe((returns: any) => {
          if (returns.success && returns.data.length > 0) {
            this.bodyData = [];
            this.bodyData = returns.data;
            // //console.log(this.bodyData)

            this.rtotalGross = this.bodyData[0]["totalGross"];
            this.rtotalVat = this.bodyData[0]["totalVat"];
            this.rtotalAit = this.bodyData[0]["totalAit"];
            this.rshippingCost = this.bodyData[0]["shippingCost"];
            this.rtotalDiscountAmount = this.bodyData[0]["totalDiscountAmount"];
            this.rgrandTotal = this.bodyData[0]["grandTotal"];

            this.rPartyName = this.bodyData[0]["partyName"];
            this.rSalesInvoiceNo = this.bodyData[0]["salesInvoiceNo"];
            this.rInvoiceDate = this.bodyData[0]["salesInvoiceDate"];
            this.rPaymentDate = this.bodyData[0]["paymentDate"];
            this.rBranchName = this.bodyData[0]["sbuName"];

            this.setParam();
          } else {
            this.toastrService.info(
              "Warning",
              this.commonService.nodatafound
            );
          }
        });
    } catch (error) {
      this.toastrService.danger("Warning", error);
    }
  }
  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Customer Name",
      leftValue: this.rPartyName,
      rightLabel: "Invoice Date",
      rightValue: this.rInvoiceDate,
    });
    this.params.push({
      leftLabel: "Invoice No.",
      leftValue: this.rSalesInvoiceNo,
      rightLabel: "Payment Date",
      rightValue: this.rPaymentDate,
    });
    this.params.push({
      leftLabel: "Branch Name",
      leftValue: this.rBranchName,
      rightLabel: "",
      rightValue: "",
    });
  }
  public generateReport(buttonAction: any, salesInvoiceId: number = 0) {
    //debugger;
    var fileName = this.pageNavigation + "." + buttonAction;
    this.getReportData(salesInvoiceId);
    const content = document.getElementById("reportHeader");
    this.commonService.generateSalesReport(
      buttonAction,
      fileName,
      content
      //,this.address
    );
  }
  reportResults: any;
  public generateReport2(buttonAction: any, salesInvoiceId: number = 0) {
    //debugger;
    this.salesinvoiceService
      .GetSalesInvoiceReportById(salesInvoiceId, "Pdf")
      .subscribe((returns: any) => {
        //this.commonService.GenerateBase64ToReport(returns);
        let res = JSON.parse(returns);
        if (res.status) {
          this.commonService.GenerateBase64ToReport(res.data[0].data);
        } else {
          //console.log(res);
          this.toastrService.warning("Warning", this.commonService.nodatafound);
        }
      });
    ////console.log(this.reportResults);
    // this.reportResults =
    //   "data:application/pdf;base64,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IAovTWVkaWFCb3ggMyAwIFIgCi9Dcm9wQm94IDQgMCBSIAo+PiAKZW5kb2JqIAozIDAgb2JqIApbIDAgMCA2MTIgNzkyIF0gCmVuZG9iaiAKNCAwIG9iaiAKWyAwIDAgNjEyIDc5MiBdIAplbmRvYmogCjYgMCBvYmogCjw8IAovUHJvY1NldCA3IDAgUiAKL0ZvbnQgPDwgCi85IDkgMCBSICAKPj4gCj4+IAplbmRvYmogCjcgMCBvYmogClsgL1BERiAvVGV4dCAgXSAKZW5kb2JqIAo4IDAgb2JqIAo8PCAKL1R5cGUgL1BhZ2UgCi9QYXJlbnQgMiAwIFIgCi9SZXNvdXJjZXMgNiAwIFIgCi9Db250ZW50cyBbIDUgMCBSIF0gCj4+IAplbmRvYmogCjkgMCBvYmogCjw8IAovVHlwZSAvRm9udCAKL1N1YnR5cGUgL1RydWVUeXBlIAovQmFzZUZvbnQgL0FBQUFBQitBcmlhbCAKL0ZpcnN0Q2hhciAzMiAKL0xhc3RDaGFyIDQ4IAovV2lkdGhzIDEwIDAgUiAKL0ZvbnREZXNjcmlwdG9yIDEyIDAgUiAKL1RvVW5pY29kZSAxMSAwIFIgCj4+IAplbmRvYmogCjEwIDAgb2JqIApbIAo3MjIgCjU1NiAKNTU2IAo1NTYgCjMzMyAKMjc4IAoyNzggCjcyMiAKNTU2IAo1NTYgCjY2NyAKNTU2IAo3MjIgCjIyMiAKMjIyIAo1MDAgCjYxMSAKXSAKZW5kb2JqIAoxMiAwIG9iaiAKPDwgCi9UeXBlIC9Gb250RGVzY3JpcHRvciAKL0FzY2VudCA5MDUgCi9DYXBIZWlnaHQgNTAwIAovRGVzY2VudCAtMjEyIAovRmxhZ3MgNCAKL0ZvbnRCQm94IDEzIDAgUiAKL0ZvbnROYW1lIC9BQUFBQUIrQXJpYWwgCi9JdGFsaWNBbmdsZSAwCi9TdGVtViAwIAovU3RlbUggMCAKL0F2Z1dpZHRoIDQ0MSAKL0ZvbnRGaWxlMiAxNCAwIFIgCi9MZWFkaW5nIDAgCi9NYXhXaWR0aCAyNjY1IAovTWlzc2luZ1dpZHRoIDQ0MSAKL1hIZWlnaHQgMCAKPj4gCmVuZG9iaiAKMTMgMCBvYmogClsgLTY2NSAtMzI1IDIwMDAgMTA0MCBdIAplbmRvYmogCjE1IDAgb2JqIAooUG93ZXJlZCBCeSBDcnlzdGFsKSAKZW5kb2JqIAoxNiAwIG9iaiAKKENyeXN0YWwgUmVwb3J0cykgCmVuZG9iaiAKMTcgMCBvYmogCjw8IAovUHJvZHVjZXIgKFBvd2VyZWQgQnkgQ3J5c3RhbCkgIAovQ3JlYXRvciAoQ3J5c3RhbCBSZXBvcnRzKSAgCj4+IAplbmRvYmogCnhyZWYgCjAgMTggCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNyAwMDAwMCBuIAowMDAwMDEyNTQ4IDAwMDAwIG4gCjAwMDAwMTI2NDcgMDAwMDAgbiAKMDAwMDAxMjY4MSAwMDAwMCBuIAowMDAwMDAwMTk0IDAwMDAwIG4gCjAwMDAwMTI3MTUgMDAwMDAgbiAKMDAwMDAxMjc4MSAwMDAwMCBuIAowMDAwMDEyODE1IDAwMDAwIG4gCjAwMDAwMTI5MDcgMDAwMDAgbiAKMDAwMDAxMzA3OCAwMDAwMCBuIAowMDAwMDAwNDQzIDAwMDAwIG4gCjAwMDAwMTMxODcgMDAwMDAgbiAKMDAwMDAxMzQ2MSAwMDAwMCBuIAowMDAwMDAwODQ1IDAwMDAwIG4gCjAwMDAwMTM1MDQgMDAwMDAgbiAKMDAwMDAxMzU0NCAwMDAwMCBuIAowMDAwMDEzNTgxIDAwMDAwIG4gCnRyYWlsZXIgCjw8IAovU2l6ZSAxOCAKL1Jvb3QgMSAwIFIgCi9JbmZvIDE3IDAgUiAKPj4gCnN0YXJ0eHJlZiAKMTM2NjkgCiUlRU9GDQo=";
    // this.commonService.GenerateBase64ToReport(this.reportResults);
  }

  //#endregion Report

  //////////// Open Modal ////////////////

  data: Country[] = [
    {
      name: "Russia",
      flag: "f/f3/Flag_of_Russia.svg",
      area: 17075200,
      population: 146989754,
    },
    {
      name: "Canada",
      flag: "c/cf/Flag_of_Canada.svg",
      area: 9976140,
      population: 36624199,
    },
    {
      name: "United States",
      flag: "a/a4/Flag_of_the_United_States.svg",
      area: 9629091,
      population: 324459463,
    },
    {
      name: "China",
      flag: "f/fa/Flag_of_the_People%27s_Republic_of_China.svg",
      area: 9596960,
      population: 1409517397,
    },
  ];

  names: any;
  openWithDataObjModel(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      context: this.data,
    });
  }
  openWithDataModel() {
    this.dialogService
      .open(DialogNamePromptComponent)
      .onClose.subscribe((name) => name && this.names.push(name));
  }


  totalItems = 0;
  isSelectAll: boolean = false;

  selectAll(e) {


    debugger;

    if (e.target.checked) {
      this.master.lstMasterViewModel.forEach(element => {
        element.isSelect = true;
      });
    }
    else {
      this.master.lstMasterViewModel.forEach(element => {
        element.isSelect = false;
      });
    }

    this.getInvoiceIds();


  }

  AddProduct(e, salesInvoiceId) {

    this.getInvoiceIds();
  }
  /////////////////////////////

  //#region Modal
  companies = [];
  companyId = 0;
  companySelected = {};
  partyTypes = [];
  partyTypeId = 0;
  pName = "";
  pMobile = "";
  pAddress = "";
  sbus = [];
  sbuId = 0;
  sbusSelected = {};

  getCompanyAndPType() {
    this.companies = [];
    this.companySelected = {};
    this.partyTypes = [];
    this.partyTypeId = 0;
    this.pName = "";
    this.pMobile = "";
    this.pAddress = "";
    this.sbus = [];
    this.sbusSelected = {};

    this.comboService.getCompany().subscribe((returns: any) => {
      this.companies = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
    this.comboService.getPartyType().subscribe((returns: any) => {
      this.partyTypes = returns.data.map((val) => ({
        id: val.partyTypeId,
        name: val.partyTypeName,
      }));
    });
  }

  public getSBU(companyId) {
    this.sbusSelected = null;
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.sbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }
  msg = "";
  public getDuplicate() {
    this.msg = "";
    this.salesinvoiceService
      .GetDuplicatePartyInfo(this.pName, this.pMobile)
      .subscribe((returns: any) => {
        if (returns.success) {
          debugger;
          this.msg = returns.data[0].partyName;
          //if (returns.data.length > 0) alert("Duplicate Party Found");
        }
      });
  }

  public OpenModal(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      context: [], //this.data,
    });
  }

  SaveCustomer() {
    if (this.companyId == 0 || this.companyId == null) {
      this.toastrService.warning("Please select company", "Warning");
      return false;
    } else if (this.sbuId == 0 || this.sbuId == null) {
      this.toastrService.warning("Please select branch", "Warning");
      return false;
    } else if (this.partyTypeId == 0 || this.partyTypeId == null) {
      this.toastrService.warning("Please select party type", "Warning");
      return false;
    } else if (this.pName == "" || this.pName == null) {
      this.toastrService.warning("Please input party name", "Warning");
      return false;
    } else if (this.pMobile == "" || this.pMobile == null) {
      this.toastrService.warning("Please input party mobile number", "Warning");
      return false;
    } else if (this.pAddress == "" || this.pAddress == null) {
      this.toastrService.warning("Please input party address", "Warning");
      return false;
    }
    else if (this.master.territorySelected == null) {
      this.toastrService.warning("Please select market detail", "Warning");
      return false;
    }

    let model = {
      partyId: 0,
      companyId: this.companyId,
      sbuId: this.sbuId,
      partyTypeId: this.partyTypeId,
      partyName: this.pName,
      partyMobile: this.pMobile,
      partyAddress: this.pAddress,
      territoryCode: this.master.territorySelected["id"],
    };

    this.salesinvoiceService
      .SaveParty(
        model
        // this.companyId,
        // this.sbuId,
        // this.partyTypeId,
        // this.pName,
        // this.pMobile,
        // this.pAddress
      )
      .subscribe((returns: any) => {
        if (returns.success) {
          this.pName = "";
          this.pMobile = "";
          this.pAddress = "";
          this.GetAllActivePartyByTypeId(0);
          this.toastrService.success(this.commonService.successmsg, "Warning");
        }
      });
  }

  //#endregion Modal


  listOfConfirmation = [];
  loadListOfConfirmation() {
    debugger;
    this.listOfConfirmation = [
      {
        id: 1,
        name: "Confirmed"
      },
      {
        id: 2,
        name: "Unconfirmed"
      }
    ]

  }


}
