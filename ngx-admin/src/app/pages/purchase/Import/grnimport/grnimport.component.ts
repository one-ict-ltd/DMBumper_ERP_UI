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
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import { NavigationStart, Router } from "@angular/router";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { ProductService } from "app/services/inventory/product.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { StockinService } from "app/services/inventory/stockin.service";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { SalesreturnService } from "app/services/sales/salesreturn.service";
import { isJSDocThisTag } from "typescript";
import { PurchaserequisitionService } from "app/pages/purchase/settings/purchaserequisition.service";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";

@Component({
  selector: 'ngx-grnimport',
  templateUrl: './grnimport.component.html',
  styleUrls: ['./grnimport.component.scss']
})
export class GRNImportComponent implements OnInit {

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
  //////////////////

  show: boolean = true;
  vlucherForm: FormGroup;
  submitted: boolean;
  saveupdate: string = "Save";
  gridbutton: string = "";
  name: string;
  description: string;
  selectedRow: any;
  public productUOMList = [];

  ngOnInit() {
    //debugger;
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "GRN Import";
  public buttons = this.commonService.btnList;

  public ButtonAction() {

    if (this.commonService.buttonClicked == "create") {

      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      //this.GetPurchaseApprovedRequisition();
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

    ImpgrnMasterId: number;
    grnNo: string;
    grnDate: Date;
    RMRNo: string;
    MRRNo: string;
    address: string;
    TruckNo: string;
    DriverName: string;
    CFAgentName: string;
    mobileNo: string;
    ImpPreLCInfoMasterId: number;

    purchaseOrderId: number;
    inhouseChallanNo: string;
    factoryReceiveSINo: string;
    partyId: number;
    supplierChallanNo: string;
    factoryReceivedDate: Date;

    purchaseOrderSelected: {};
    lCNoSelected: {};
    partySelected: {};
    purchaseOrderDate: string;

    isActive: number;
    isDelete: number;
    lstDetailsViewModel: any[];
  };


  public getMaster() {
    this.master = {
      ImpgrnMasterId: 0,
      grnNo: "",
      grnDate: new Date(),

      RMRNo: "",
      MRRNo: "",
      address: "",
      TruckNo: "",
      DriverName: "",
      CFAgentName: "",
      mobileNo: "",
      ImpPreLCInfoMasterId: 0,


      purchaseOrderId: 0,
      partyId: 0,
      inhouseChallanNo: "",
      factoryReceiveSINo: "",
      supplierChallanNo: "",
      factoryReceivedDate: null,

      partySelected: null,
      purchaseOrderSelected: null,
      lCNoSelected: null,
      purchaseOrderDate: "",

      isActive: 1,
      isDelete: 0,
      lstDetailsViewModel: [],
    };
    // this.getPurchaseFinalReqNo();
    //this.getPurchaseFinalReqNo();
    this.getGRNNo();
    this.getAllLcNo();
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
    debugger;
    if (!this.master.lstDetailsViewModel || this.master.lstDetailsViewModel.length == 0) {
      this.toastrService.danger("No selected items found!", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    let flag = false;
    let flagReceivedUOM = true;
    let warnMessage = "No selected items found!"
    if (this.master.lstDetailsViewModel.length > 0) {
      this.master.lstDetailsViewModel.forEach(element => {
        if (element.isSelect == 1) {  // 1 is YES
          flag = true;
          // if (element.receivedQty > element.balanceQty) {
          //   flagReceivedQty = true;
          //   warnMessage= "No selected items found!"
          // }
          if (!element.toUOMId || element.toUOMId == 0 || element.toUOMId == null || !element.actualRcvQty || element.actualRcvQty == 0 || element.actualRcvQty < 0) {
            flagReceivedUOM = false;
            warnMessage = "Please select Received UOM. and Rcv. Qty."
          }
        }
      });
    }

    if (!flag) {
      this.toastrService.danger("No selected items found!", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (!flagReceivedUOM) {
      this.toastrService.danger("Please select Received UOM  and Rcv. Qty.", "Message");
      this.commonService.valueSet("create");
      return false;
    }



    // console.log(this.master)

    this.show = true;



    //console.log(this.master);
    this.master.grnDate = this.commonService.DateFormat(this.master.grnDate);
    // this.commonService.ConsoleLog(this.master);
    let button = ""
    this.PurchaseorderService
      .setGRNImport(this.master)
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
          this.initGrid(0);
          this.getMaster();

        }
        else {
          this.toastrService.warning(
            this.commonService.successmsg,
            "Message"
          );
        }
      });
  }


  private reset() {
    this.getMaster();
  }

  public getGRNNo() {
    if (this.master.grnDate == null) {
      this.master.grnDate = new Date();
    }
    this.PurchaseorderService
      .GetMaxGRNImpNo(
        this.master.grnDate.toDateString().substring(4, 15)
      )
      .subscribe((returns: any) => {
        if (returns.success) {
          this.master.grnNo = returns.data[0].MaxNo;
        }
      });
  }


  //////////////////////////////// End CRUD /////////////////////////////////////////

  onRefesh() {
    this.selectedRow = "";
    this.ngOnInit();
    //this.onGridReady;
    this.toastrService.warning("warning", this.commonService.warningmsg);
  }

  parties = [];
  public getParty() {
    //debugger;
    this.master.partySelected = null;
    this.parties = null;
    this.comboService.GetSupplierForDropdown().subscribe((returns: any) => {
      //let res = returns.data.filter((it) => it.sbuId == sbuId);
      console.log(returns.data);
      this.parties = returns.data.map((val) => ({
        id: val.partyId,
        name: val.partyName,
      }));
    });
  }

  uomSelected: any[] = [];
  public getProductUOM() {
    this.productUOMList = null;
    this.productService.getProductUOM().subscribe((retuns: any) => {
      if (retuns.success) {
        this.productUOMList = retuns.data.map((val: any) => ({
          id: val.uomId,
          name: val.uomName,
        }))
      }
    })
  }



  purchaseOrderList = []
  public getAllPurchaseOrdersForGRN() {
    this.master.purchaseOrderSelected = null;
    this.purchaseOrderList = null;
    //debugger
    this.PurchaseorderService.getPurchaseOrdersForGRN(0).subscribe((returns: any) => {
      if (returns.success) {

        this.purchaseOrderList = returns.data.map((val) => ({
          id: val.purchaseOrderId,
          name: val.purOrderNo,
          purchaseOrderDate: val.purchaseOrderDate,
          supplierId: val.supplierId,
          supplierName: val.supplierName,

        }));
      }
    });
  }

  lcNoList = []
  public getAllLcNo() {
    this.master.lCNoSelected = null;
    this.lcNoList = null;
    //debugger
    this.PurchaseorderService.getLcNo().subscribe((returns: any) => {
      if (returns.success) {
        //debugger;
        this.lcNoList = returns.data.map((val) => ({
          id: val.ImpPreLCInfoMasterId,
          name: val.LCNo + ' | ' + val.LCOpenDate + ' | ' + val.partyName + ' | ' + val.countryName,
          LCOpenDate: val.LCOpenDate,
          ImpLCInfoMasterId: val.ImpLCInfoMasterId,
          partyId: val.partyId,
          partyName: val.partyName,
          countryName: val.countryName,
        }));
      }
    });
  }


  getPurchaseOrderItems(event: any) {
    this.master.partySelected = {}
    this.master.purchaseOrderDate = "";
    this.master.lstDetailsViewModel = []
    if (event) {
      this.master.partySelected = { id: event.partyId, name: event.partyName };
      this.master.ImpPreLCInfoMasterId = event.id;
      this.PurchaseorderService.getPODetailsByLcInfo(this.master.ImpPreLCInfoMasterId).subscribe((returns: any) => {
        if (returns.success) {
          debugger;
          this.master.lstDetailsViewModel = returns.data;
        }
      });
    }
  }



  CalculateLineTotal(rowIndex: number) {
    debugger
    let lineReceivedQty: number = 0;
    let balanceQty: number = 0;
    let ttlQty: number = 0;
    let lineTotal: number = 0;
    let linePrice: number = 0;
    let lineVatPercent: number = 0;
    let lineVatAmount: number = 0;
    let lineActualAmount: number = 0;


    lineReceivedQty = this.master.lstDetailsViewModel[rowIndex].receivedQty == null ? 0 : this.master.lstDetailsViewModel[rowIndex].receivedQty;
    balanceQty = this.master.lstDetailsViewModel[rowIndex].qty == null ? 0 : this.master.lstDetailsViewModel[rowIndex].qty;
    ttlQty = lineReceivedQty //+ (this.master.lstDetailsViewModel[rowIndex].receivedTotal == null ? 0 : this.master.lstDetailsViewModel[rowIndex].receivedTotal);
    if (lineReceivedQty > balanceQty) {
      //this.master.lstDetailsViewModel[rowIndex].receivedQty = null;
      //this.master.lstDetailsViewModel[rowIndex].receivedQty = balanceQty;
      this.toastrService.warning("Receive Qty is greater than Invoice Qty.", "Warning!")
    }
    linePrice = this.master.lstDetailsViewModel[rowIndex].rate == null ? 0 : this.master.lstDetailsViewModel[rowIndex].rate;
    lineTotal = Math.round(balanceQty * linePrice);
    lineVatPercent = this.master.lstDetailsViewModel[rowIndex].vatPercent == null ? 0 : this.master.lstDetailsViewModel[rowIndex].vatPercent;

    lineVatAmount = Math.round((lineVatPercent * lineTotal) / 100);


    this.master.lstDetailsViewModel[rowIndex].totalAmount = lineTotal;
    this.master.lstDetailsViewModel[rowIndex].vatAmount = lineVatAmount;
    lineActualAmount = Math.round(lineVatAmount + lineTotal);
    this.master.lstDetailsViewModel[rowIndex].actualAmount = lineActualAmount
    // this.CalculateSummary();
  }

  CalculateLineTotalkeyFunc(e: any, rowIndex: number) {
    // const typedValue = e.keyCode;
    // if (typedValue < 48 ||  typedValue > 57) {
    //   return;
    // }

    let lineReceivedQty = this.master.lstDetailsViewModel[rowIndex].receivedQty == null ? 0 : this.master.lstDetailsViewModel[rowIndex].receivedQty;
    let balanceQty = this.master.lstDetailsViewModel[rowIndex].balanceQty == null ? 0 : this.master.lstDetailsViewModel[rowIndex].balanceQty;

    if (lineReceivedQty > balanceQty) {
      //this.master.lstDetailsViewModel[rowIndex].receivedQty = null;
      //this.master.lstDetailsViewModel[rowIndex].receivedQty = balanceQty;
      //this.toastrService.warning("Receive Qty is greater than Invoice Qty.", "Warning!")
    }
  }
  checkChange(e, rowIndex) {
    debugger
    if (e.target.checked) {
      this.master.lstDetailsViewModel[rowIndex].isEnable = 1;
      this.master.lstDetailsViewModel[rowIndex].receivedQty = this.master.lstDetailsViewModel[rowIndex].balanceQty;
      this.makeCheckBoxDisable(rowIndex);

    } else {
      this.master.lstDetailsViewModel[rowIndex].isEnable = 0;
      this.master.lstDetailsViewModel[rowIndex].receivedQty = 0;
      // this.master.lstDetailsViewModel[rowIndex].balanceAmount = this.master.lstDetailsViewModel[rowIndex].dueAmount;
      // this.master.lstDetailsViewModel[rowIndex].bonusDiscount = 0.00;
      // this.master.lstDetailsViewModel[rowIndex].collectionAmount = null;
      // this.master.lstDetailsViewModel[rowIndex].others = null;
    }
    this.CalculateLineTotal(rowIndex);

  }
  makeCheckBoxDisable(rowIndex) {
    this.master.lstDetailsViewModel.forEach((element, index) => {
      if (index != rowIndex) {
        element.isSelect = 0;
      }
    });
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
    private ProducttransferService: ProducttransferService,
    private productrequisitionService: ProductrequisitionService,
    private productService: ProductService,
    private comboService: CommoncomboService,
    private stockinService: StockinService,
    private salesinvoiceService: SalesinvoiceService,
    private salesreturnService: SalesreturnService,
    private purchaserequisitionService: PurchaserequisitionService,
    private PurchaseorderService: PurchaseorderService,
    private datePipe: DatePipe
  ) {
    this.commonService.valueSet("showlist");

    // this.commonService.valueSet("showlist");
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
        headerName: "GRN No.",
        field: "grnNo",
        width: 250,
      },
      {
        headerName: "GRN Date",
        field: "grnDate",
        width: 200,
      },
      {
        headerName: "LC Number",
        field: "LCNo",
        width: 200,
      },
      {
        headerName: "Supplier",
        field: "supplierName",
        width: 200,
      },
      {
        headerName: "Material Name",
        field: "productName",
        width: 250,
      },
      {
        headerName: "RMR No",
        field: "RMRNo",
        width: 200
      },
      {
        headerName: "MRR No",
        field: "MRRNo",
        width: 200
      },
      {
        headerName: "C & F Agent Name",
        field: "CFAgentName",
        width: 200
      },
      {
        field: "action",
        cellRenderer: "btnCellRenderer",
        cellRendererParams: {
          clicked: function (field: any) {
            //localStorage.setItem("Token", user.auth_token);
            localStorage.setItem("button", field);
          },
        },
        minWidth: 250,
        editable: false,
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
    this.getMaster();

    // this.getAllPurchaseOrdersForGRN();
    this.getProductUOM();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.initGrid(0);
    // this.PurchaseorderService.GetGRN(0).subscribe((data: any) => {
    //     if (data.success) {
    //       this.rowData = data.data;
    //       //console.log(this.rowData);
    //     }
    //   });
  }

  initGrid(ImpgrnMasterId: any) {

    this.PurchaseorderService.getGRNImport(ImpgrnMasterId).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
        //console.log(this.rowData);
      }
    });
    // this.getAllPurchaseOrdersForGRN();
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
      //this.agReport(event);
      this.generateCrReport('Pdf', event.node.data.ImpgrnMasterId);
    } else if (data == "delete") {
      //this.agDelete(event);
      this.toastrService.info("Delete Disable Now!!", "Message");
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  private agEdit(event) {
    debugger;
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
      var ImpgrnMasterId = event.node.data.ImpgrnMasterId;
      //debugger;
      //this.getStore();
      this.PurchaseorderService.getGRNImport(ImpgrnMasterId).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];

          this.master.grnNo = data.data[0].grnNo;
          this.master.grnDate = data.data[0].grnDate;
          this.master.lCNoSelected = {
            id: data.data[0].ImpPreLCInfoMasterId,
            name: data.data[0].LCNo + ' | ' + data.data[0].purchaseOrderDate + ' | ' + data.data[0].supplierName + ' | ' + data.data[0].countryName,
            LCOpenDate: data.data[0].purchaseOrderDate,
            ImpLCInfoMasterId: data.data[0].ImpLCInfoMasterId,
            partyId: data.data[0].supplierId,
            partyName: data.data[0].supplierName,
            countryName: data.data[0].countryName,

          }
          this.master.partySelected = {
            id: data.data[0].supplierId,
            name: data.data[0].supplierName
          }
          this.master.factoryReceivedDate = data.data[0].factoryReceivedDate;
          this.master.lstDetailsViewModel = [];
          this.PurchaseorderService.GetGRNImportDetails(ImpgrnMasterId, this.master.ImpPreLCInfoMasterId).subscribe((returns: any) => {
            if (returns.success) {
              this.master.lstDetailsViewModel = returns.data;
            }
          });

        }
      });
      // this.GetPurchaseApprovedRequisition(1, requsitionFinalMasterId)
      this.ngOnInit();
    }
  }

  generateCrReport(reportFormat: any, masterId: number) {
    let userInfo = this.commonService.GetUserProfileJson();
    const apiUrl = `SalesInvoiceReport/GetGRNfromImportById?reportFormat=${reportFormat}&masterId=${masterId}`;
    console.log('Hit');
    debugger;
    this.commonService.GetCrystalReportData(apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      debugger;
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
        console.log(res);
      }
    });
  }

  private agReport(event) {
    this.generateReport(event.data.ImpgrnMasterId);
  }

  private agDelete(event) {
    this.master.ImpgrnMasterId = event.node.data.ImpgrnMasterId;

    // var requsitionFinalMasterId = event.node.data.requisitionFinalizeMasterId;
    this.PurchaseorderService.DeleteGRNById(this.master.ImpgrnMasterId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");
          this.initGrid(0)
        }
      });
  }


  public partyList = [];
  public GetAllPartysByTypeId(partyTypeId: any) {
    this.salesinvoiceService
      .GetAllPartysByTypeId(partyTypeId)
      .subscribe((returns: any) => {
        this.partyList = returns.data.map((val: any) => ({
          id: val.partyId,
          name: val.partyName,
        }));
      });
  }
  gRowIndex: number = -1;
  ViewDetails(dialog: TemplateRef<any>, ImpPreLCInfoMasterId: number, rowIndex: number) {
    debugger;
    if (this.master.lstDetailsViewModel[rowIndex].isSelect == 1) {
      this.gRowIndex = -1;
      this.gRowIndex = rowIndex;
      this.dialogService.open(dialog, {
        context: [],
      });
    }
    else {
      this.toastrService.warning("Please select an item.", "Message");
    }

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

  public salesReturnNo = "";
  public salesReturnDate = "";
  public salesInvoiceNo = "";
  public partyName = "";
  public contactNumber = "";
  public addressLine = "";

  public rtotalGross: number = 0;
  public rtotalVat: number = 0;
  public rtotalAit: number = 0;
  public rshippingCost: number = 0;
  public rtotalDiscountAmount: number = 0;
  public rgrandTotal: number = 0;

  public tableHeader = [
    "#",
    "Product Name",
    "Serial No",
    "Invoice Qty",
    "Return Qty",
    "Price",
    "Total",
  ];
  public apiUrl = "";
  public htmlBodyData: string = "";

  public params = [];
  public bodyData: any = [];
  public bodyDatashow: any = [];
  public datalength: number;

  public grnNo: string = "";
  public grnDate: Date = new Date();
  public poNo: string = "";
  public frDate: Date = new Date();
  public supplierName: string = "";
  public address: string = "";
  public chalanNo: string = "";

  public generateReport(ImpgrnMasterId) {

    // this.salesreturnService
    //   .GetSalesGrossReturnById(salesReturnMasterId)
    //   .subscribe((data: any) => {
    //     if (data.success) {

    //       //this.master.salesReturnDate = new Date(this.master.salesReturnDate);
    //       var fileName = this.pageNavigation + ".pdf";
    //       const content = document.getElementById("reportHeader");
    //       this.generateReportPdf("print", fileName, content, this.datalength);
    //     } else {
    //       this.toastrService.danger("Message", this.commonService.nodatafound);
    //     }
    //   });

    this.PurchaseorderService.getGRNImport(ImpgrnMasterId).subscribe((data: any) => {
      if (data.success) {
        this.master = data.data[0];

        this.grnNo = data.data[0].grnNo
        this.grnDate = data.data[0].grnDate
        this.poNo = data.data[0].purOrderNo
        this.frDate = data.data[0].factoryReceivedDate
        this.supplierName = data.data[0].supplierName
        this.address = data.data[0].addressLine
        this.chalanNo = data.data[0].supplierChallanNo

        this.master.grnNo = data.data[0].grnNo;
        this.master.grnDate = data.data[0].grnDate;
        this.master.purchaseOrderSelected = {
          id: data.data[0].purchaseOrderId,
          name: data.data[0].purOrderNo,
          purchaseOrderDate: data.data[0].purchaseOrderDate,
          supplierId: data.data[0].supplierId,
          supplierName: data.data[0].supplierName,

        }
        this.master.partySelected = {
          id: data.data[0].supplierId,
          name: data.data[0].supplierName
        }
        this.master.factoryReceivedDate = data.data[0].factoryReceivedDate;
        this.master.lstDetailsViewModel = [];
        this.PurchaseorderService.getPODetailsByIdForGRNforReport(ImpgrnMasterId, this.master.purchaseOrderId).subscribe((returns: any) => {
          if (returns.success) {
            this.master.lstDetailsViewModel = returns.data;
            var fileName = this.pageNavigation + ".pdf";
            const content = document.getElementById("reportHeader");
            this.generateReportPdf("print", fileName, content, this.datalength);
          }
          else {
            this.toastrService.danger("Message", this.commonService.nodatafound);
          }
        });

      }
    });
  }

  public generateReportPdf(
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
          startY: legend.height + 50,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
        });
        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 80,
          styles: { font: "Meta" },
        });
        autoTable(doc, {
          html: "#body_table1",
          startY: legend.height + 250,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
          styles: {
            font: "Meta",
            lineColor: [44, 62, 80],
            lineWidth: 0.55,
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontSize: 11,
            halign: "center",
            valign: "middle",
            fontStyle: "bold",
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          columnStyles: {
            3: { halign: "right" },
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });

        autoTable(doc, {
          html: "#footer_table",
          //startY: legend.totalheight + 300,
          theme: "grid",
          // tableLineColor: [0, 0, 0],
          // tableLineWidth: 0.75,
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
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
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

  //#endregion Report
}
