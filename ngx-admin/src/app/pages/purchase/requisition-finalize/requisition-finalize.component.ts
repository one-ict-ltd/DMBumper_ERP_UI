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
import { BranchService } from "app/services/erpsetting/branch.service";
import { from } from "rxjs";
import { Console } from "node:console";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { SalesreturnService } from "app/services/sales/salesreturn.service";
import { isJSDocThisTag } from "typescript";
import { PurchaserequisitionService } from "app/pages/purchase/settings/purchaserequisition.service";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-requisition-finalize',
  templateUrl: './requisition-finalize.component.html',
  styleUrls: ['./requisition-finalize.component.scss']
})
export class RequisitionFinalizeComponent implements OnInit {

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

  ngOnInit() {
    //debugger;
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Requisition Finalize";
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
      this.GetPurchaseApprovedRequisition(1, 0);
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      //this.edit();
      this.show = false;
    }
  }

  master: {
    salesReturnMasterId: number;
    salesInvoiceId: number;
    requisitionFinalizeMasterId: number;
    salesReturnNo: string;
    finalRequsitionNo: string;
    requisitionFianlDate: Date;
    remarks: string;
    salesReturnDate: Date;
    salesReturnDateText: string;
    addressLine: string;

    storeId: number;
    partyId: number;
    partyName: string;
    partySelected: {};
    invoiceSelected: {};
    BudgetCategorySelected: {};

    grossAmount: number;
    convertionQty: number;
    totalPrice: number;
    CtnQty: number;
    totalVatAmount: number;
    ProductTotalAmount: number;
    InvoiceTotalAmount: number;
    totalAitAmount: number;
    shippingCostAmount: number;
    totalDiscountAmount: number;
    netAmount: number;
    toUomId: number;
    totalprice: number;

    isActive: number;
    isDelete: number;

    uomName: string;
    productId: number;
    productWiseSpecificationId: number;
    salesInvDetailsId: number;
    productName: string;
    productSpecSelected: {};

    price: number;
    returnQty: number;
    vat: number;
    ait: number;
    discountAmount: number;
    total: number;

    storeSlected: {};
    lstDetailsViewModel: any[];
    lstApproveReqViewModel: any[];
    lstInvoiceDetails: any[];
    productSelected: [];
    tosbuId: number;

  };

  public getMaster() {
    this.master = {
      salesReturnMasterId: 0,
      salesInvoiceId: 0,
      requisitionFinalizeMasterId: 0,
      salesReturnNo: "",
      finalRequsitionNo: "",
      salesReturnDate: new Date(),
      remarks: "",
      requisitionFianlDate: new Date(),
      salesReturnDateText: "",
      addressLine: "",

      storeId: 0,
      tosbuId: 0,
      partyId: 0,
      convertionQty: 0,
      totalPrice: 0,
      CtnQty: 0,
      partyName: "",
      partySelected: null,
      invoiceSelected: null,
      productSelected: null,
      BudgetCategorySelected: null,

      InvoiceTotalAmount: 0,
      ProductTotalAmount: 0,
      grossAmount: 0,
      totalVatAmount: 0,
      totalAitAmount: 0,
      totalDiscountAmount: 0,
      netAmount: 0,
      shippingCostAmount: 0,
      toUomId: 0,
      totalprice: 0,

      isActive: 1,
      isDelete: 0,

      uomName: "",

      productId: 0,
      productWiseSpecificationId: 0,
      salesInvDetailsId: 0,
      productName: "",
      productSpecSelected: null,

      price: 0,
      returnQty: 0,
      vat: 0,
      ait: 0,
      discountAmount: 0,
      total: 0,

      storeSlected: null,
      lstDetailsViewModel: [],
      lstApproveReqViewModel: [],
      lstInvoiceDetails: [],

    };
    //this.GetProductApprovedRequisition();

    this.getPurchaseFinalReqNo();
    this.GetPurchaseApprovedRequisition(1, 0);
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
    //debugger;
    if (!this.master.lstApproveReqViewModel || this.master.lstApproveReqViewModel.length == 0) {
      this.toastrService.danger("Final Requisition List is empty! ", "Message");
      this.commonService.valueSet("create");
      return false;
    }

    let flag = false;

    let warnMessage = ""
    if (this.master.lstApproveReqViewModel.length > 0) {
      debugger
      this.master.lstApproveReqViewModel.forEach(element => {
        if (element.finalQty > element.reqQty) {
          flag = true;
          warnMessage = "Final Qty has to be less than the Request Qty."
        }
        if (element.BudgetCreateId == 0 || element.BudgetCreateId == null) {
          flag = true;
          warnMessage = "Please select Budget Category For All Product"
        }
        if (element.isCS != 1) {  // 1 is YES Comparative Statement and 0 for Spot Purchase
          if (element.PartyId == 0 || element.PartyId == null || element.rate <= 0) {
            flag = true;
            warnMessage = "Please provide Supplier and Amount."
          }

          if (element.BudgetAmount < element.totalAmount) {
            flag = true;
            warnMessage = "Total Amount has to be less than the Budget Amount."
          }
        }


      });
    }

    if (flag) {
      this.toastrService.danger(warnMessage, "Message");
      this.commonService.valueSet("create");
      return false;
    }



    // console.log(this.master)
    // return;
    this.show = true;



    //console.log(this.master);
    this.master.requisitionFianlDate = this.commonService.DateFormat(this.master.requisitionFianlDate);
    //console.log("this.master:", this.master);
    let button = ""
    this.purchaserequisitionService
      .SaveSaveFinalRequisition(this.master)
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

          this.purchaserequisitionService.GetPurchaseFinalRequisitionById(0).subscribe((data: any) => {
            if (data.success) {
              this.rowData = data.data;
            }
          });

          this.getMaster(); //////////////Grid Refresh ///////////////////
          //debugger;

        }
        else {
          this.toastrService.warning(
            returns.message,
            "Message"
          );
        }
      });
  }

  public getProductById(id) {
    // console.log(this.master.productSelected);
    // this.productService.getProductById(id).subscribe((data: any) => {
    //   if (data.success) {
    //     this.master.uomName = this.master.productSelected["uomName"];
    //   }
    // });

    this.master.uomName = this.master.productSelected["uomName"];
    //this.GetCurrentStock();
  }

  //public lstReqDetailsViewModel = [];

  currentStock: number = 0;
  GetCurrentStock() {
    this.currentStock = 0;
    let apiUrl = `ProductRequisition/GetProductCurrentStockBySbuId?productWiseSpecificationId=${this.master.productWiseSpecificationId}&sbuId=${this.master.tosbuId}`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.currentStock = returns.data[0].currentStock;
      }
    });
  }

  private reset() {
    this.getMaster();
  }

  public getPurchaseFinalReqNo() {
    //debugger;
    if (this.master.requisitionFianlDate == null) {
      this.master.requisitionFianlDate = new Date();
    }
    //console.log("the finalrequsition date is:",this.master.requisitionFianlDate)
    this.purchaserequisitionService
      .getPurchaseFinalRequisitionNo(
        this.master.requisitionFianlDate.toDateString().substring(4, 15)
      )
      .subscribe((returns: any) => {
        console.log(returns);
        if (returns.success) {
          this.master.finalRequsitionNo = returns.data[0].MaxNo;
        }
      });
  }

  GetPurchaseApprovedRequisition(approvalStatus, finalizeMasterId) {
    debugger
    this.master.lstDetailsViewModel = [];
    this.master.lstApproveReqViewModel = [];
    this.purchaserequisitionService.getApprovedRequisitionData(approvalStatus, finalizeMasterId).subscribe((returns: any) => {
      if (returns.success) {
        this.master.lstDetailsViewModel = returns.data;
        returns.data.forEach(element => {
          if (element.isSelect) {
            debugger
            this.setFinalizedItems(element)
          }
        });
      }
    })
  }


  setFinalizedItems(element) {
    this.master.lstApproveReqViewModel.push(element);
    let indexNo = this.master.lstApproveReqViewModel.length > 0 ? this.master.lstApproveReqViewModel.length - 1 : this.master.lstApproveReqViewModel.length
    let selectedCS = this.CsStatusList.filter(x => x.id === element.isCS)[0];
    this.CsSelected[indexNo] = selectedCS;
    let selectedSupplier = this.parties.filter(x => x.id === element.PartyId)[0];
    this.partySelected[indexNo] = selectedSupplier;
    debugger
    let SelectedBudgetCategory = this.BudgetList.filter(x => x.BudgetCreateId === element.BudgetCreateId)[0];
    this.BudgetCategorySelected[indexNo] = SelectedBudgetCategory;
  }


  CalculateLineTotal(rowIndex: number) {
    debugger
    this.master.lstApproveReqViewModel[rowIndex].totalAmount = 0;

    let lineReqQty = this.master.lstApproveReqViewModel[rowIndex].reqQty == null ? 0 : this.master.lstApproveReqViewModel[rowIndex].reqQty;
    let lineFinalQty = this.master.lstApproveReqViewModel[rowIndex].finalQty == null ? 0 : this.master.lstApproveReqViewModel[rowIndex].finalQty;
    let lineRate = this.master.lstApproveReqViewModel[rowIndex].rate == null ? 0 : this.master.lstApproveReqViewModel[rowIndex].rate;
    let lineVatAmount = this.master.lstApproveReqViewModel[rowIndex].vatAmount == null ? 0 : this.master.lstApproveReqViewModel[rowIndex].vatAmount;
    if (lineFinalQty > lineReqQty) {
      lineFinalQty = lineReqQty;
      this.master.lstApproveReqViewModel[rowIndex].finalQty = null;
      this.master.lstApproveReqViewModel[rowIndex].finalQty = lineReqQty;
      this.toastrService.warning("Final Qty has to be less than the Request Qty.", "Warning!")
    }
    let lineAmountTotal = lineFinalQty * (lineRate + lineVatAmount);
    this.master.lstApproveReqViewModel[rowIndex].totalAmount = lineAmountTotal;
  }

  CalculateLineVATAmount(rowIndex: number) {
    debugger
    this.master.lstApproveReqViewModel[rowIndex].vatAmount = 0;
    let lineVatAmount = 0;
    let lineFinalQty = this.master.lstApproveReqViewModel[rowIndex].finalQty == null ? 0 : this.master.lstApproveReqViewModel[rowIndex].finalQty;
    let lineRate = this.master.lstApproveReqViewModel[rowIndex].rate == null ? 0 : this.master.lstApproveReqViewModel[rowIndex].rate;
    let lineVatPercentage = this.master.lstApproveReqViewModel[rowIndex].vatPercentage == null ? 0 : this.master.lstApproveReqViewModel[rowIndex].vatPercentage;

    if (lineVatPercentage > 0) {
      lineVatAmount = (lineRate * (lineVatPercentage / 100));
    }
    this.master.lstApproveReqViewModel[rowIndex].vatAmount = lineVatAmount;
    this.CalculateLineTotal(rowIndex);
  }

  // CalculateLineTotalkeyFunc(event:any,rowIndex: number){
  //   // debugger
  //   // this.master.lstApproveReqViewModel[rowIndex].finalQty = null;
  //   // this.master.lstApproveReqViewModel[rowIndex].rate = null;
  //   // this.master.lstApproveReqViewModel[rowIndex].vatAmount = null;

  //   let lineReqQty = this.master.lstApproveReqViewModel[rowIndex].reqQty == null ? 0 : this.master.lstApproveReqViewModel[rowIndex].reqQty;
  //   let lineFinalQty = this.master.lstApproveReqViewModel[rowIndex].finalQty == null ? 0 : this.master.lstApproveReqViewModel[rowIndex].finalQty;
  //   if(lineFinalQty>lineReqQty){
  //     lineFinalQty = lineReqQty;
  //     this.master.lstApproveReqViewModel[rowIndex].finalQty =null;
  //     this.master.lstApproveReqViewModel[rowIndex].finalQty = lineReqQty;
  //   }

  //   // let lineFinalQty = this.master.lstApproveReqViewModel[rowIndex].finalQty == null ? 0 : this.master.lstApproveReqViewModel[rowIndex].finalQty;
  //   // let lineRate = this.master.lstApproveReqViewModel[rowIndex].rate == null ? 0 : this.master.lstApproveReqViewModel[rowIndex].rate;
  //   // let lineVatAmount = this.master.lstApproveReqViewModel[rowIndex].vatAmount == null ? 0 : this.master.lstApproveReqViewModel[rowIndex].vatAmount;

  //   // this.master.lstApproveReqViewModel[rowIndex].finalQty = lineFinalQty;
  //   // this.master.lstApproveReqViewModel[rowIndex].rate = lineRate;
  //   // this.master.lstApproveReqViewModel[rowIndex].vatAmount = lineVatAmount;
  //   this.CalculateLineTotal(rowIndex);
  // }


  //////////////////////////////// End CRUD /////////////////////////////////////////

  onRefesh() {
    this.selectedRow = "";
    this.ngOnInit();
    //this.onGridReady;
    this.toastrService.warning("warning", this.commonService.warningmsg);
  }

  LoadInFinal(e, Id: number) {
    debugger;
    if (e.target.checked) {
      let reqCheck = this.master.lstDetailsViewModel.filter((item) => item.PurchaseReqDetailsId === Id);
      // reqCheck[0].PartyId =0;
      // reqCheck[0].PartyId =0;
      this.master.lstApproveReqViewModel.push(reqCheck[0]);
      if (reqCheck[0].isCS) {
        let selectedCS = this.CsStatusList.filter(x => x.id === reqCheck[0].isCS)[0];
        let indexNo = this.master.lstApproveReqViewModel.length > 0 ? this.master.lstApproveReqViewModel.length - 1 : this.master.lstApproveReqViewModel.length
        this.CsSelected[indexNo] = selectedCS;
      }
      // console.log(this.master.lstApproveReqViewModel);

    } else {
      let reqCheck = this.master.lstApproveReqViewModel.filter((item) => item.PurchaseReqDetailsId === Id);
      const index: number = this.master.lstApproveReqViewModel.indexOf(reqCheck[0]);
      this.master.lstApproveReqViewModel.splice(index, 1);
    }
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
  BudgetList = [];
  public getBudgetList() {
    //debugger;
    this.master.BudgetCategorySelected = null;
    this.BudgetList = null;
    const currentYear = new Date().getFullYear();
    this.PurchaseorderService.GetBudgetCreateList(0).subscribe((returns: any) => {
      //let res = returns.data.filter((it) => it.BudgetYear == currentYear);
      this.BudgetList = returns.data.map((val) => ({
        BudgetCreateId: val.BudgetCreateId,
        BudgetCategoryName: val.BudgetCategoryName,
        BudgetAmount: val.BudgetAmount,
        consumption: val.consumption
      }));
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
    private datePipe: DatePipe,
    private PurchaseorderService: PurchaseorderService
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
        headerName: "Finalize Requisition No.",
        field: "requisitionFinalizeNo",
        width: 250,
      },
      {
        headerName: "Date",
        field: "requisitionFinalizeDate",
        width: 200,
      },
       {
        headerName: "Requisition No.",
        field: "purReqNo",
        width: 250,
      },
      {
        headerName: "Remarks",
        field: "remarks",
        width: 250
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
    //this.getMaxNo();
    this.getProductDetails();
    this.loadCsStatusList();
    this.getParty();
    this.getBudgetList();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.purchaserequisitionService.GetPurchaseFinalRequisitionById(0)
      .subscribe((data: any) => {
        if (data.success) {
          this.rowData = data.data;
          //console.log(this.rowData);
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
  public async onRowClicked(event) {
    debugger
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    if (data == "edit") {
      // this.agEdit(event);
      // this.show = false;
      let isWordOrdered = await this.isFinalisedRequisitionWordOrderedByFRId(event.node.data.requisitionFinalizeMasterId);
      if (!isWordOrdered) {
        this.agEdit(event);
        this.show = false;
      } else {
        this.commonService.valueSet("showlist");
        this.toastrService.info("This Finalised Requisition has been Work Ordered!", "Message");
      }
    } else if (data == "view") {
      this.agEdit(event);
      this.show = false;
      this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      let isWordOrdered = await this.isFinalisedRequisitionWordOrderedByFRId(event.node.data.requisitionFinalizeMasterId);
      if (!isWordOrdered) {
        this.agDelete(event);
      } else {
        this.commonService.valueSet("showlist");
        this.toastrService.info("This Finalised Requisition has been Work Ordered!", "Message");
      }
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  async isFinalisedRequisitionWordOrderedByFRId(requsitionFinalMasterId: any): Promise<boolean> {
    let isWordOrdered = false;
    try {
      const data: any = await this.purchaserequisitionService.isFinalisedRequisitionWordOrderedByFRId(requsitionFinalMasterId).toPromise();
      if (data.success) {
        let isPurchaseOrdered = data.data;
        if (isPurchaseOrdered && isPurchaseOrdered.length > 0) {
          isWordOrdered = true;
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    return isWordOrdered;
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
      var requsitionFinalMasterId = event.node.data.requisitionFinalizeMasterId;
      //debugger;
      //this.getStore();
      this.purchaserequisitionService.GetPurchaseFinalRequisitionById(requsitionFinalMasterId).subscribe((data: any) => {
        if (data.success) {
          // this.master = data.data[0];
          this.master.requisitionFinalizeMasterId = data.data[0].requisitionFinalizeMasterId;
          this.master.finalRequsitionNo = data.data[0].requisitionFinalizeNo;
          this.master.requisitionFianlDate = data.data[0].requisitionFinalizeDate;
          this.master.remarks = data.data[0].remarks;
        }
      });
      //this.finalRequisitionDetailsData=[];
      this.GetPurchaseApprovedRequisition(1, requsitionFinalMasterId)
      this.ngOnInit();
    }
  }

  BudgetCategoryChange(event: any, index: number) {
    debugger
    if (event) {
      let element = this.master.lstApproveReqViewModel[index];
      this.master.lstApproveReqViewModel[index].consumption = event.consumption;
      this.master.lstApproveReqViewModel[index].BudgetAmount = event.BudgetAmount;
    } else {

    }
  }


  // public addDetails() {
  //   //console.log(this.master.productSelected);
  //   if (
  //     this.master.productWiseSpecificationId == 0 ||
  //     this.master.productWiseSpecificationId == null
  //   ) {
  //     this.toastrService.danger("Please select product.", "Message");

  //     return false;
  //   }
  //   if (this.master.returnQty == 0 || this.master.returnQty == null) {
  //     this.toastrService.danger("Please enter quanty.", "Message");

  //     return false;
  //   }
  //   //this.getProductDetails();
  //   let detail = {
  //     productReqDetailsId: 0, //this.master.lstReqDetailsViewModel.productReqDetailsId,
  //     productWiseSpecificationId: this.master.productWiseSpecificationId,
  //     dropdown: this.prodSelected,
  //     productId: this.master.productSelected["productId"],
  //     productName: this.master.productSelected["name"],
  //     uomId: this.master.productSelected["uomId"],
  //     price: this.master.price,
  //     totalPrice: this.master.totalPrice,
  //     returnQty: this.master.returnQty,
  //     CtnQty: this.master.CtnQty,
  //     toUomId: this.master.toUomId,
  //     convertionQty: this.master.convertionQty,
  //     uomName: this.master.uomName,
  //     currentStock: this.currentStock,
  //     isActive: 1,
  //   };
  //   //this.master.lstReqDetailsViewModel.push(detail);
  //   if (detail.returnQty != 0 && detail.price != 0) {
  //     this.master.lstDetailsViewModel.push(detail);
  //   } else {
  //     this.toastrService.danger("Quantity Or Price is zero.", "Message");
  //     return;
  //   }
  //   this.master.productSelected = null;
  //   this.master.returnQty = 0;
  //   this.master.price = 0;
  //   this.master.CtnQty = 0;
  //   this.master.convertionQty = 0;
  //   this.master.totalPrice = 0;
  //   this.master.uomName = "";
  //   this.calculateGrandTotal();
  //   //console.log(this.master.lstReqDetailsViewModel);
  // }

  public deleteDetail(index: any) {
    this.selectedRow = this.master.lstDetailsViewModel[index];
    this.master.lstDetailsViewModel.splice(index, 1);
    if (this.selectedRow.helpDetailId > 0) {
    }
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }

  public prodSelected = [];

  public getProductDetails() {
    this.productrequisitionService
      .getAllProductForRequisition()
      .subscribe((returns: any) => {
        //console.log(returns.data);
        this.prodSelected = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uomId: val.uomId,
          uomName: val.uomName,
          productId: val.productId,
          price: val.price,
        }));
      });
  }

  public getProductSpecDetails() {
    //debugger;
    this.master.totalprice = 0;
    this.master.price = 0;
    this.master.productId = this.master.productSelected["productId"];
    this.master.uomName = this.master.productSelected["uomName"];
    this.master.productName = this.master.productSelected["name"];
    this.master.productWiseSpecificationId = this.master.productSelected["id"];
    //  let companyAliasName = this.salesinvoiceService.GetCompanyAliasName();
    // if (companyAliasName == "EVERGREEN")
    this.master.price = this.master.productSelected["price"];
    debugger;
    //this.getCurrentStock();
    //this.checkAlreadyExist();
    this.GetUOMConverterInfoByProductSpecId(this.master.productWiseSpecificationId, this.master.productSelected["uomId"], 0);
  }

  toUomList: any[];
  toUomSelected = {};
  GetUOMConverterInfoByProductSpecId(productWiseSpecificationId: any, fromUomId: any, toUomId: any) {
    this.toUomList = [];
    this.toUomSelected = null;
    this.productService.GetUOMConverterInfoByProductSpecId(productWiseSpecificationId, fromUomId, toUomId).subscribe((returns: any) => {
      if (returns.status) {
        this.toUomList = returns.data.map((val: any) => ({
          id: val.toUomId,
          name: val.toUomName,
          fromQty: val.fromQty,
          toQty: val.toQty,
        }));
        if (returns.data.length > 0) {
          this.toUomSelected = {
            id: returns.data[0].toUomId,
            name: returns.data[0].toUomName,
            fromQty: returns.data[0].fromQty,
            toQty: returns.data[0].toQty,
          };

          this.master.toUomId = returns.data[0].toUomId;
        };
      }
    });
  }

  GetSalesInvoiceListfromDispatch() {
    // this.commonService.valueSet("create");
    this.master.lstInvoiceDetails = [];
    this.salesinvoiceService
      .GetSalesInvoiceListfromDispatchJson(0, this.master.partyId, this.commonService.DateFormat(this.master.salesReturnDate))
      .subscribe((returns: any) => {
        if (returns.success) {
          //console.log(returns.data);
          this.master.lstInvoiceDetails = returns.data;
          //this.CalculateSummary();
        }
      });
  }



  private agReport(event) {
    //debugger;
    // this.generateReport(event.data.requisitionFinalizeMasterId);
    this.generateCrReport(event.data.requisitionFinalizeMasterId, 'pdf')
  }


  generateCrReport(requisitionFinalizeMasterId: any, reportFormat: any) {
    let apiUrl = `PurchaseRequisition/GetFinalizedPurchaseRequisitionRptData?requisitionFinalizeMasterId=${requisitionFinalizeMasterId}&reportFormat=${reportFormat}`;
    //console.log(this.apiUrl);
    this.commonService.GetCrystalReportData(apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }

  private agDelete(event) {
    this.master.requisitionFinalizeMasterId = event.node.data.requisitionFinalizeMasterId;
    // var requsitionFinalMasterId = event.node.data.requisitionFinalizeMasterId;
    if (confirm('Are you sure?')) {
      this.purchaserequisitionService.deletePurchaseFinalRequisitionById(this.master.requisitionFinalizeMasterId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(this.commonService.deletedmsg, "Message");
            this.purchaserequisitionService.GetPurchaseFinalRequisitionById(0)
              .subscribe((data: any) => {
                if (data.success) {
                  this.rowData = data.data;
                  //console.log(this.rowData);
                }
              });
          }
        });
    }
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
  public finalizeRequisitionNo: string = "";
  public finalizeRequisitionDate: Date = new Date();
  public remarks: string = "";
  public finalRequisitionDetailsData = [];
  public generateReport(requisitionFinalizeMasterId) {
    debugger;


    this.purchaserequisitionService.GetPurchaseFinalRequisitionById(requisitionFinalizeMasterId).subscribe((data: any) => {
      if (data.success) {
        // this.master = data.data[0];
        this.master.requisitionFinalizeMasterId = data.data[0].requisitionFinalizeMasterId;
        this.finalizeRequisitionNo = data.data[0].requisitionFinalizeNo;
        this.finalizeRequisitionDate = data.data[0].requisitionFinalizeDate;
        this.remarks = data.data[0].remarks;
        this.purchaserequisitionService.GetPurchaseFinalRequisitionDetailsByMasterIdForPdfReport(requisitionFinalizeMasterId).subscribe((data: any) => {
          if (data.success) {
            this.finalRequisitionDetailsData = data.data;

            this.master.salesReturnDate = new Date(this.master.salesReturnDate);
            var fileName = this.pageNavigation + ".pdf";
            const content = document.getElementById("reportHeader");
            this.generateReportPdf("print", fileName, content, this.datalength);
          } else {
            this.toastrService.danger("Message", this.commonService.nodatafound);
          }
        })
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
      height: 60,
      totalheight: 60 + datalength,
    };
    debugger;
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
          startY: legend.height + 150,
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
  /////////////////////////////


  CsStatusList: any = [];
  CsSelected: any[] = [];
  partySelected: any[] = [];
  BudgetCategorySelected: any[] = [];
  loadCsStatusList() {
    this.CsStatusList = [
      {
        id: 1,
        name: "Yes",
      },
      {
        id: 0,
        name: "No",
      },
    ];
  }

  CsChange(event: any, index: number) {
    if (event) {
      let element = this.master.lstDetailsViewModel[index]
      console.log(element);
      // let reqCheck = this.master.lstDetailsViewModel.filter((item) => item.PurchaseReqDetailsId === Id);
      console.log(event, index)
    } else {
      console.log(event, index)
    }
  }
}