import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from "@angular/core";
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";

@Component({
  selector: 'ngx-generate-sales-invoice-by-sales-order',
  templateUrl: './generate-sales-invoice-by-sales-order.component.html',
  styleUrls: ['./generate-sales-invoice-by-sales-order.component.scss']
})
export class GenerateSalesInvoiceBySalesOrderComponent implements OnInit {

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

  show: boolean = true;
  vlucherForm: FormGroup;
  submitted: boolean;
  saveupdate: string = "Save";
  gridbutton: string = "";
  name: string;
  description: string;
  selectedRow: any;
  isHideElement: boolean = false;

  ngOnInit() {
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Generate Sales Invoice(s)";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      //this.GetSalesOrderMasterApprovedList();
      this.getMaster();
      //this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      //this.GetSalesOrderMasterApprovedList();
      this.getMaster();
      //this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
      this.commonService.valueSet("create");
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      this.commonService.valueSet("create");
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.GetSalesOrderMasterApprovedList();
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

  master: {
    approvalType: number;
    lstApprovedOrderList: any[];
    //lstCreditNoteViewModel: any[];
  };

  count: number = 0;
  public getMaster() {
    this.master = {
      approvalType: 1,
      lstApprovedOrderList: [],
      //lstCreditNoteViewModel: [],
    };

    this.count = 0;
    //this.territoryCode = "";
    this.territoryCodeList = [];
    this.OrderList = [];
    //this.territoryCodeSelected = null;

    this.GetSalesOrderMasterApprovedList();
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

  Refresh() {
    //debugger;
    if (!this.territoryCodeSelected) {
      this.territoryCode = "";
      this.GetSalesOrderMasterApprovedList();
    }
  }

  SaveValidation(): boolean {
    let count: number = 0;
    let invoiceValue: number = 0;

    for (let index = 0; index < this.master.lstApprovedOrderList.length; index++) {
      const e = this.master.lstApprovedOrderList[index];

      if (e.isSelect == 1) {
        count++;
        invoiceValue = e.grandTotal;
        this.calculateCrediNoteAmount(index);
      }
    };

    if (count == 0) {
      this.toastrService.warning(
        "Please select atleast one Sales Order.",
        "Message"
      );
      return false;
    }
    if (this.AdjustAmount > invoiceValue) {
      this.toastrService.warning("Credit note adjust amount must be less or equal invoice Total amount.", "Message");
      return false;
    }

    return true;
  }

  private save() {
    var button = this.commonService.buttonClicked;
    this.show = true;
    this.isHideElement = true;

    if (this.SaveValidation() == true) {
      console.log(this.master);
      this.salesinvoiceService
        //.GenerateSalesInvoiceBySalesOrder(this.master)
        .GenerateSalesInvoiceBySalesOrder_v2(this.master)
        .subscribe((returns: any) => {
          console.log(returns);
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
            this.isHideElement = false;
            this.getMaster();
          } else {
            this.isHideElement = false;
            this.toastrService.warning(
              returns.message,
              "Message"
            );
          }
        });
    }
  }

  private reset() {
    this.getMaster();
  }

  //////////////////////////////// End CRUD /////////////////////////////////////////

  onRefesh() {
    this.selectedRow = "";
    this.ngOnInit();
    //this.onGridReady;
    this.toastrService.warning("warning", this.commonService.warningmsg);
  }

  private gridApi;
  private gridColumnApi;

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };

  territoryCode = "";
  OrderList: any = [];
  territoryCodeList: any = [];
  territoryCodeSelected: any = {};

  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    // private SalesDistributionService: SalesDistributionService,
    // private fieldforcemasterService: FieldforcemasterService,
    // private datePipe: DatePipe,
    private salesinvoiceService: SalesinvoiceService
  ) {
    this.commonService.valueSet("showlist");

    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderer,
    };
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
    };

    this.getMaster();
    this.LoadAllDropdown();
  }

  ////////////////////////////////// Ag Grid Data Load/////////////////////////////////
  private selectedRows = [];
  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    if (data == "edit") {
      //this.agEdit(event);
      //this.show = false;
    } else if (data == "view") {
      //this.agEdit(event);
      //this.show = false;
      //this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      //this.agDelete(event);
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  private agReport(event) {
    //this.generateReport("print", event.data.distributionMasterId);
  }

  LoadAllDropdown() {
    this.loadApprovalStatusList();
  }
  ttlOrder: number = 0;
  GetSalesOrderMasterApprovedList() {
    this.ttlOrder = 0;
    this.commonService.valueSet("create");
    this.salesinvoiceService
      .GetSalesOrderMasterApprovedList(0, this.territoryCode)
      .subscribe((returns: any) => {
        if (returns.success) {

          this.count = this.count + 1;

          this.master.lstApprovedOrderList = returns.data;
          //this.OrderList = returns.data;

          this.ttlOrder = this.master.lstApprovedOrderList.length;

          /**/
          if (this.count == 1) {

            let arr = Array.from(new Set(returns.data.map((x: any) => ({
              id: x.territoryCode,
              name: x.territoryName,
            }))));

            //console.log('territoryCode', arr);

            let uniqueObjArray = [
              ...new Map(arr.map((item) => [item["id"], item])).values(),
            ];
            //console.log("uniqueObjArray", uniqueObjArray);
            let obj = { id: '', name: '......  All .....' };
            this.territoryCodeList = uniqueObjArray;
            this.territoryCodeList.splice(0, 0, obj);

            // if (this.territoryCodeList.length > 1) {
            //   this.territory = '';
            //   this.territoryCodeSelected = obj;
            // }


            // let myString = "freeCodeCamp";
            // const splitString = [...myString];
            // console.log(splitString);
          }
        }
      });
  }

  salesOrderId = 0;
  grandTotal = 0;
  salesOrderNo = '';
  trTypeShortName = '';
  salesOrderDate = '';
  partyName = '';
  territory = '';
  address = '';
  mobileNo = '';

  SalesModel: any[];
  //   {
  //   // salesInvoiceId: 0,
  //   // grandTotal: 0,
  //   // salesInvoiceNo: '',
  //   // salesInvoiceDate: '',
  //   // partyName: '',
  //   // address: '',
  //   // mobileNo: '',
  //   lstDetailsViewModel: any[],
  // };
  GetSalesOrderDetails(salesOrderId: number) {
    this.salesinvoiceService
      .GetSalesOrderDetailsByIdForApproval(salesOrderId)
      .subscribe((data: any) => {
        if (data.success) {
          console.log(salesOrderId, data.data);
          //console.log("this.master.lstApprovedOrderList[0].lstCreditNoteViewModel.length ", this.master.lstApprovedOrderList[0].lstCreditNoteViewModel.length);

          this.SalesModel = data.data;
          this.salesOrderNo = data.data[0].salesOrderNo;
          this.trTypeShortName = data.data[0].trTypeShortName;
          this.salesOrderId = data.data[0].salesOrderId;
          this.salesOrderDate = data.data[0].salesOrderDate;
          this.grandTotal = data.data[0].grandTotal;
          this.partyName = data.data[0].partyName;
          this.territory = data.data[0].territoryName;
          this.mobileNo = data.data[0].mobileNo;
          this.address = data.data[0].address;

          //console.log(this.SalesModel);
        }
      });
  }


  public calculateTotal(index: any) {
    let totalPrice = 0;
    let invoiceQty =
      (this.SalesModel[index].invoiceQty == null || this.SalesModel[index].invoiceQty == undefined || this.SalesModel[index].invoiceQty == "")
        ? 0
        : this.SalesModel[index].invoiceQty;
    this.SalesModel[index].invoiceQty = invoiceQty;

    let price =
      this.SalesModel[index].price == ""
        ? 0
        : this.SalesModel[index].price;
    let vat =
      this.SalesModel[index].vat == ""
        ? 0
        : this.SalesModel[index].vat;
    let ait =
      this.SalesModel[index].ait == ""
        ? 0
        : this.SalesModel[index].ait;
    let discountAmount =
      this.SalesModel[index].discountAmount == ""
        ? 0
        : this.SalesModel[index].discountAmount;

    totalPrice = invoiceQty * price;
    vat = totalPrice * (vat / 100);
    ait = totalPrice * (ait / 100);
    discountAmount = totalPrice * (discountAmount / 100);

    this.SalesModel[index].Total =
      totalPrice + vat + ait - discountAmount;
    this.calculateGrandTotal();
  }

  calculateGrandTotal() {
    this.grandTotal = 0;
    this.SalesModel.forEach((row) => {
      this.grandTotal += row.Total == "" ? 0 : row.Total;
    });

    // let totalVat = this.master.totalVat == null ? 0 : this.master.totalVat;
    // let totalDiscountAmount =
    //   this.master.totalDiscountAmount == null
    //     ? 0
    //     : this.master.totalDiscountAmount;
    // totalVat = totalVat - totalDiscountAmount;
    // let totalAit = this.master.totalAit == null ? 0 : this.master.totalAit;
    // let shippingCost =
    //   this.master.shippingCost == null ? 0 : this.master.shippingCost;

    // this.master.totalGross = totalGross;
    // this.master.grandTotal = totalGross + totalVat + totalAit + shippingCost;
  }

  UpdateSalesInvoiceDetails() {
    // this.salesinvoiceService
    //   .UpdateSalesInvoiceDetails(this.SalesModel)
    //   .subscribe((returns: any) => {
    //     if (returns.success) {
    //       //this.master.lstMasterViewModel = returns.data;
    //       this.toastrService.success(returns.message, 'Message');

    //       this.GetSalesInvoiceMasterListForApproval();
    //     }
    //     else {
    //       this.toastrService.warning(returns.message, 'Warning');
    //     }
    //   });
  }

  msg = "";
  names: any;
  ViewDetails(dialog: TemplateRef<any>, salesOrderId: number) {
    debugger;
    this.GetSalesOrderDetails(salesOrderId);

    this.dialogService.open(dialog, {
      context: [],
    });
  }

  cnRowIndex: number;
  ViewCreditNoteDetails(dialog: TemplateRef<any>, rowIndex: number) {
    debugger;
    this.cnRowIndex = rowIndex;
    this.calculateCrediNoteAmount(rowIndex);

    this.dialogService.open(dialog, {
      context: [],
    });
  }

  calculateCrediNoteAmount(rowIndex: number) {
    this.AdjustAmount = 0;
    for (let index = 0; index < this.master.lstApprovedOrderList[rowIndex].lstCreditNoteViewModel.length; index++) {
      const el = this.master.lstApprovedOrderList[rowIndex].lstCreditNoteViewModel[index];
      if (el.isSelect) {
        this.AdjustAmount += el.amount;
      }
    };
    this.AdjustAmount = this.commonService.roundWithDecimalPoint(this.AdjustAmount, 2);
  }
  // openWithDataModel() {
  //   this.dialogService
  //     .open(DialogNamePromptComponent)
  //     .onClose.subscribe((name) => name && this.names.push(name));
  // }

  ApprovalStatusList: {};
  ApprovalStatusSelected: {};
  loadApprovalStatusList() {
    this.ApprovalStatusList = [
      // {
      //   id: 0,
      //   name: "select one",
      // },
      {
        id: 1,
        name: "Approve",
      },
      {
        id: 0,
        name: "Pending",
      },
      {
        id: 2,
        name: "Rejected",
      },
    ];
  }

  checkChange(event, rowIndex) {
    this.master.lstApprovedOrderList.forEach(el => {
      el.isSelect = 0;
    });
    this.master.lstApprovedOrderList[rowIndex].isSelect = 1;

    this.calculateCrediNoteAmount(rowIndex);
  }

  AdjustAmount: number = 0;
  creditCheckChange(rowIndex: number) {
    this.AdjustAmount = 0;

    for (let index = 0; index < this.master.lstApprovedOrderList[rowIndex].lstCreditNoteViewModel.length; index++) {
      const el = this.master.lstApprovedOrderList[rowIndex].lstCreditNoteViewModel[index];
      if (el.isSelect) {
        this.AdjustAmount += el.amount;
      }
    };
    this.AdjustAmount = this.commonService.roundWithDecimalPoint(this.AdjustAmount, 2);
  }

  public deleteDetails(index: any, salesOrderId: number) {
    debugger;
    let salesOrderDetailsId = this.SalesModel[index].salesOrderDetailsId;
    let productName = this.SalesModel[index].productName;

    if (confirm(`Are you sure to delete "${productName}"?`) && salesOrderDetailsId > 0) {
      this.commonService.postApiData('SalesInvoice/DeleteSalesOrderDetailsByOrderDetailsId', salesOrderDetailsId).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");
          this.GetSalesOrderDetails(salesOrderId);
        }
        else {
          this.toastrService.warning(returns.message, "Warning");
        }
      });
    }
  }
}

