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
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { StockinService } from "app/services/inventory/stockin.service";

import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { SalesreturnService } from "app/services/sales/salesreturn.service";
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss']
})
export class CreditNoteComponent implements OnInit {



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

  show: boolean = true;
  vlucherForm: FormGroup;
  submitted: boolean;
  saveupdate: string = "Save";
  gridbutton: string = "";
  name: string;
  description: string;
  selectedRow: any;
  isReadonly: boolean = false;
  constructor(
    private dialogService: NbDialogService,
    private cs: CommonService,
    private toastrService: NbToastrService,
    // private ProducttransferService: ProducttransferService,
    private productrequisitionService: ProductrequisitionService,
    // private productService: ProductService,
    // private comboService: CommoncomboService,
    private stockinService: StockinService,
    private salesinvoiceService: SalesinvoiceService,
    private salesreturnService: SalesreturnService,
    private datePipe: DatePipe,
    private fieldforcemasterService: FieldforcemasterService,
    private commonService: CommonService
  ) {
    this.cs.valueSet("showlist");
    //this.GetAllPartysByTypeId(0);

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
        headerName: "Credit Note No.",
        field: "expireReturnNumber",
        width: 160,
      },
      {
        headerName: "Date",
        field: "returnDate",
        width: 150,
      },

      {
        headerName: "Customer Name",
        field: "partyName",
        width: 220,
      },
      // {
      //   headerName: "Product Name",
      //   field: "productName",
      //   width: 180,
      // },
      // {
      //   headerName: "Quantity",
      //   field: "returnQty",
      //   width: 120,
      //   valueFormatter: (params) =>
      //     this.currencyFormatter(params.data.returnQty),
      //   type: "rightAligned",
      // },
      {
        headerName: "Net Amount",
        field: "amount",
        width: 150,
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.amount),
        type: "rightAligned",
      },
      {
        headerName: "Adj. Invoice No.",
        field: "salesInvoiceNo",
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
    };
    //debugger;
    this.getMaster();
    this.getMaxNo();
    this.getStore();
    this.getAllProductForRequisition();
    this.getAllTerritory();

    this.dueAmount = 0;
    this.returnQty = 0;
    this.amount = 0;
    //this.grandTotal = 0;
    this.returnPrice = 0;
    this.price = 0;

    this.terriSelected = null;
    this.partySelected = null
    this.invoiceSelected = null
    this.productSpecSelected = null
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

  public pageNavigation = "Credit Note";
  public buttons = this.cs.btnList;

  public ButtonAction() {
    if (this.cs.buttonClicked == "create") {
      this.getMaster();

      this.show = false;
    } else if (this.cs.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.cs.buttonClicked == "save") {
      //this.openConfirmPopup("");
      this.save();
      // this.show = true;
    } else if (this.cs.buttonClicked == "update") {
      this.save();
      //this.show = true;
    } else if (this.cs.buttonClicked == "view") {
      this.show = false;
    } else if (this.cs.buttonClicked == "reset") {
      this.reset();
    } else if (this.cs.buttonClicked == "edit") {
      //this.edit();
      this.show = false;
    }
  }

  private terriSelected: any = {};
  private partySelected: any = {};
  private invoiceSelected: any = {};
  private productSpecSelected: any = {};
  private dueAmount: number = 0;
  private returnQty: number = 0;
  private returnPrice: number = 0;
  private price: number = 0;
  private UOM: string = "";
  private packSize: string = "";
  private amount: number = 0;
  private grandTotal: number = 0;

  master: {
    productExpireReturnMasterId: number;
    partyId: number;
    grandTotal: number;
    expireReturnNumber: string;
    returnDate: Date;
    lstDetailsViewModel: any[];

    batchNo: string;
    mgfDate: Date;
    expireDate: Date;
  };

  public getMaster() {
    this.master = {
      productExpireReturnMasterId: 0,
      partyId: 0,
      grandTotal: 0,
      expireReturnNumber: "",
      returnDate: new Date(),
      lstDetailsViewModel: [],

      batchNo: "",
      mgfDate: new Date(),
      expireDate: new Date()
    };
    this.isReadonly = false;
    this.getMaxNo();
  }

  public agButtonAction() {
    if (this.cs.agButtonClicked == "pin") {
      this.cs.onPin(this.gridColumnApi);
    } else if (this.cs.agButtonClicked == "unpin") {
      this.cs.onClear(this.gridColumnApi);
    } else if (this.cs.agButtonClicked == "refresh") {
      window.location.reload();
    } else if (this.cs.agButtonClicked == "csv") {
      this.cs.onExportCSV(this.gridApi, this.pageNavigation);
    } else {
      console.log("Click action button");
    }
  }
  /////End of Dynamic Button section (Do Not Edit)///////

  /////////////////////////////// CRUD ///////////////////////////////////////////

  addToGrid() {
    //debugger;
    if (this.master.returnDate == undefined || null) {
      this.toastrService.danger("Please select invoice date.", "Message");
      return;
    }
    else if (this.partySelected == undefined || this.partySelected == null) {
      this.toastrService.danger("Please select a customer.", "Message");
      return;
    }
    else if (this.productSpecSelected == undefined || this.productSpecSelected == null) {
      this.toastrService.danger("Please select Product.", "Message");
      return;
    }
    else if (this.returnQty == null || this.returnQty == 0) {
      this.toastrService.danger("Please input Qty.", "Message");
      return;
    }
    else if (this.amount == null || this.amount == 0) {
      this.toastrService.danger("Total amount must be greater than zero (0)", "Message");
      return;
    }
    else if (this.returnPrice <= 0) {
      this.toastrService.danger("Propossed Price must be greater than zero (0)", "Message");
      return;
    }
    else if (this.amount <= 0) {
      this.toastrService.danger("Total amount must be greater than zero (0)", "Message");
      return;
    }
    else if (this.returnPrice > this.price) {
      this.toastrService.danger("Propossed Price must be less or equal Current Price", "Message");
      return;
    }
    else if (this.master.batchNo == null || this.master.batchNo == '') {
      this.toastrService.danger("Please Add Batch No", "Message");
      return;
    }
    else if (this.master.mgfDate == null) {
      this.toastrService.danger("Please add manufacturing Date", "Message");

      return;
    }
    else if (this.master.expireDate == null) {
      this.toastrService.danger("Please add expire Date", "Message");
      return;
    }


    let item = {
      // salesInvoiceNo: this.invoiceSelected['name'],
      salesInvoiceNo: '',
      productName: this.productSpecSelected['name'],
      uomName: this.productSpecSelected['uomName'],
      packSize: this.productSpecSelected['packSize'],

      expireReturnDetailsId: 0,
      productExpireReturnId: 0,
      expireReturnNumber: this.master.expireReturnNumber,
      returnDate: this.cs.DateFormat(this.master.returnDate),
      productExpireReturnMasterId: this.master.productExpireReturnMasterId,
      //salesInvoiceId: this.invoiceSelected["id"],
      salesInvoiceId: null,
      partyId: this.partySelected["id"],
      productWiseSpecificationId: this.productSpecSelected["id"],
      returnQty: this.returnQty,
      amount: this.amount,
      returnPrice: this.returnPrice,
      batchNo: this.master.batchNo,
      mgfDate: this.commonService.DateFormat(this.master.mgfDate),
      expireDate: this.commonService.DateFormat(this.master.expireDate),
    }

    console.log(item);
    this.master.lstDetailsViewModel.splice(0, 0, item);

    this.master.grandTotal = 0;
    this.master.lstDetailsViewModel.forEach(element => {
      this.master.grandTotal += element.amount
    });

    this.productSpecSelected = null;
    this.price = 0;
    this.UOM = "";
    this.packSize = "";
    this.returnPrice = 0;
    this.returnQty = 0;
    this.amount = 0;
    this.master.mgfDate = null;
    this.master.expireDate = null;
    this.master.batchNo = null;

    // }
    // else {
    //   this.toastrService.warning("Total Return amount must be less or equal to invoice dues amount for this invoice.", "info");
    // }

    this.toggleReadonly();
  }

  toggleReadonly() {
    if (this.master.lstDetailsViewModel.length > 0)
      this.isReadonly = true;
    else
      this.isReadonly = false;
  }
  private save() {
    //debugger;
    var button = this.cs.buttonClicked;

    //console.log(this.master);

    this.salesreturnService
      .SaveSalesPExpireReturnMaster(this.master)
      .subscribe((returns: any) => {
        if (returns.success) {

          this.show = true;
          if (button == "update") {
            this.toastrService.success(
              this.cs.updatedmsg,
              "Message"
            );
          } else {
            this.toastrService.success(
              this.cs.successmsg,
              "Message"
            );
          }

          this.getMaster(); //////////////Grid Refresh ///////////////////
          //debugger;
          this.salesreturnService
            .GetSalesPExpireReturnById(0)
            .subscribe((data: any) => {
              //debugger;
              if (data.success) {
                this.rowData = data.data;
              }
            });
        }
        else {
          this.toastrService.danger(
            this.cs.failedmsg,
            "Message"
          );
          this.cs.valueSet("create");
        }
      });
  }

  removeItem(index: any) {
    if (confirm("Are you sure to remove?")) {
      if ((index != undefined || null) && index >= 0) {
        let expireReturnDetailsId = this.master.lstDetailsViewModel[index].expireReturnDetailsId;

        if (expireReturnDetailsId > 0) {
          this.salesreturnService
            .DeletePExpireReturnDetailsById(this.master.lstDetailsViewModel[index].expireReturnDetailsId)
            .subscribe((data: any) => {
              //debugger;
              if (data.success) {

                this.master.lstDetailsViewModel.splice(index, 1);

                this.master.grandTotal = 0;
                this.master.lstDetailsViewModel.forEach(element => {
                  this.master.grandTotal += element.amount;
                });
                this.toggleReadonly();
                this.toastrService.success("Successfully Deleted.", "Info")
              }
              else {
                this.toastrService.warning("Delete process failed", "Info")
              }
            });
        }
        else {
          this.master.lstDetailsViewModel.splice(index, 1);

          this.master.grandTotal = 0;
          this.master.lstDetailsViewModel.forEach(element => {
            this.master.grandTotal += element.amount;
          });

          this.toggleReadonly();
          this.toastrService.success("Successfully Removed.", "Info")
        }
      }
    }
  }
  onbatchNoChange() {
    debugger
    if (this.master.batchNo != null || this.master.batchNo != '') {
      this.salesreturnService
        .GetManufactAndExpireDateFromStock(this.master.batchNo, this.productSpecSelected["id"])
        .subscribe((data: any) => {
          if (data.success) {
            if (data.data.length > 0) {
              this.master.mgfDate = data.data[0].mgfDate;
              this.master.expireDate = data.data[0].expireDate;
            }

          }
        });
    }

  }
  ValidateAmount() {
    // let dues = this.dueAmount ?? 0;
    // let amount = this.amount ?? 0;
    // if (amount > dues) {
    //   this.amount = null;
    //   this.toastrService.warning("Return amount must be less or equal to invoice dues amount", "info");
    // }
  }
  private reset() {
    this.getMaster();
    this.terriSelected = {};
    this.partySelected = {};
  }

  //////////////////////////////// End CRUD /////////////////////////////////////////

  onRefesh() {
    this.selectedRow = "";
    this.ngOnInit();
    //this.onGridReady;
    this.toastrService.warning("warning", this.cs.warningmsg);
  }

  onEditGrid() {
    const d = this.gridApi.getEditingCells();
    if (this.gridApi.getSelectedRows().length == 0) {
      this.toastrService.danger("error", this.cs.selectdata);
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


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.salesreturnService
      .GetSalesPExpireReturnById(0)
      .subscribe((data: any) => {
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
    //debugger
    this.selectedRow = event.node.data;
    var data = this.cs.agButtonClicked;
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
      var productExpireReturnId = event.node.data.productExpireReturnId;
      //debugger;
      //this.getStore();
      this.salesreturnService
        .GetSalesPExpireReturnById(productExpireReturnId)
        .subscribe((data: any) => {
          if (data.success) {
            this.master = data.data[0];

            ///console.log(data.data[0]);
            // this.partySelected = {
            //   id: this.master.partyId,
            //   name: this.master.partyName,
            // };

            //this.GetInvoiceListByCustomer(data.data[0].partyId);

            // this.invoiceSelected = {
            //   id: data.data[0].salesInvoiceId,
            //   name: data.data[0].salesInvoiceNo,
            // };

            // this.productSpecSelected = {
            //   id: data.data[0].productWiseSpecificationId,
            //   name: data.data[0].productName
            // };

            this.master.returnDate = new Date(this.master.returnDate);
            this.partySelected = { id: data.data[0].partyId, name: data.data[0].partyName, territoryCode: '' };
            this.master.grandTotal = 0;
            this.terriSelected = {
              id: data.data[0].territoryCode,
              name: data.data[0].territory
            }
            this.master.lstDetailsViewModel.forEach(element => {
              this.master.grandTotal += element.amount
            });
            console.log(this.master);
          }
        });
      //this.ngOnInit();
    }
  }

  public productSpecList = [];
  public getAllProductForRequisition() {
    this.productrequisitionService
      .getAllProductForCreditNote()
      .subscribe((returns: any) => {
        //console.log(returns);
        this.productSpecList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uomName: val.uomName,
          packSize: val.packSize,
          price: val.price,
          returnPrice: val.price,
        }));
      });
  }

  productChange() {
    //debugger;
    this.price = ((this.productSpecSelected == undefined) || (this.productSpecSelected == null)) ? 0 : this.productSpecSelected['price'];
    this.UOM = ((this.productSpecSelected == undefined) || (this.productSpecSelected == null)) ? 0 : this.productSpecSelected['uomName'];
    this.packSize = ((this.productSpecSelected == undefined) || (this.productSpecSelected == null)) ? 0 : this.productSpecSelected['packSize'];
    this.returnPrice = ((this.productSpecSelected == undefined) || (this.productSpecSelected == null)) ? 0 : this.productSpecSelected['returnPrice'];
  }

  calculateAmount() {
    if (this.returnPrice > this.price) {
      this.returnPrice = 0;
      this.toastrService.warning('"Return Unit Price" must be less or equal "Current unit Price"', 'Message');
    }

    this.amount = Math.abs(this.returnQty ?? 0) * (this.returnPrice);
  }

  calculateTotalAmount() {
    if (this.returnQty > 0) {
      this.returnPrice = Math.abs(this.commonService.roundWithDecimalPoint((this.amount / this.returnQty), 2))
    }
  }

  public currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  private agReport(event) {
    // this.generateReport(event.data.productExpireReturnId);
    //this.generateReportV2(event.data);
    this.generateCrReport("pdf", event.data.productExpireReturnId);
  }

  private agDelete(event) {
    if (confirm(`Are you sure to delete this ( ${event.node.data.expireReturnNumber} ) number?`)) {
      let productExpireReturnId = event.node.data.productExpireReturnId;
      this.salesreturnService
        .SalSpDeleteSalesPExpireReturn(productExpireReturnId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(this.cs.deletedmsg, "Message");

            this.salesreturnService
              .GetSalesPExpireReturnById(0)
              .subscribe((data: any) => {
                if (data.success) {
                  this.rowData = data.data;
                }
              });
          }
          else {
            this.toastrService.danger(
              this.cs.failedmsg,
              "Message"
            );
            this.cs.valueSet("create");
          }
        });
    }
  }

  public StoreList = [];
  public getStore() {
    this.stockinService.getStore(0, 0).subscribe((returns: any) => {
      this.StoreList = returns.data.map((val) => ({
        id: val.storeId,
        name: val.storeName,
      }));
    });
  }

  public getMaxNo() {
    this.salesreturnService
      .GetMaxSalesPExpireReturnNumber(
        this.datePipe.transform(this.master.returnDate, "yyyy-MM-dd")
      )
      .subscribe((returns: any) => {
        //debugger;
        if (returns.success) {
          this.master.expireReturnNumber = returns.data[0].MaxNo;
        }
      });
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
  public GetAllPartysByTypeId(partyTypeId: any) {
    this.partyList = [];
    this.partySelected = {};
    //let partyId = this.partySelected['id'];

    if (this.terriSelected == undefined || null) return;


    this.salesinvoiceService
      .GetAllPartysByTypeId(0, 0, this.terriSelected['id'])
      .subscribe((returns: any) => {
        this.partyList = returns.data.map((val: any) => ({
          id: val.partyId,
          name: val.partyName,
          territoryCode: val.territoryCode
        }));
      });
  }

  public invoiceList = [];
  public GetInvoiceListByCustomer(customerId) {
    // this.salesinvoiceService
    //   .GetSalesInvoiceListfromDispatchJson_v2(0, customerId, this.cs.DateFormat(new Date()), this.partySelected["territoryCode"])
    //   .subscribe((returns: any) => {
    //     this.invoiceList = returns.data.map((val: any) => ({
    //       id: val.salesInvoiceId,
    //       name: val.salesInvoiceNo,
    //       due: val.dueAmount,
    //     }));
    //   });
  }

  private getInvoiceDetailsDue(salesInvoiceId) {
    this.dueAmount = (this.invoiceSelected == undefined || null) ? 0 : this.invoiceSelected["due"];
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

  public expireReturnNumber = "";
  public returnDate = "";
  public salesInvoiceNo = "";
  public territory = "";
  public mioName = "";
  public partyName = "";
  public productName = "";
  public contactNumber = "";
  public addressLine = "";
  public uomName = "";

  public rtotalGross: number = 0;
  public rtotalVat: number = 0;
  public rtotalAit: number = 0;
  public rshippingCost: number = 0;
  public rtotalDiscountAmount: number = 0;
  public rgrandTotal: number = 0;
  public rgrandPrice: number = 0;
  public rgrandQty: number = 0;
  public rgrandOriginalPrice: number = 0;
  public rgrandOriginalTotal: number = 0;
  public retQty: number = 0;

  public tableHeader = [
    "#",
    "Product Name",
    // "Serial No",
    "Invoice Qty",
    "Total Return Qty",
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

  public generateReport(productExpireReturnId) {
    this.salesreturnService
      .GetSalesPExpireReturnDetailsByMasterId(productExpireReturnId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.bodyData = returns.data;

          // this.expireReturnNumber = this.bodyData[0].expireReturnNumber;
          // this.salesReturnDate = this.bodyData[0].salesReturnDate;
          // this.salesInvoiceNo = this.bodyData[0].salesInvoiceNo;
          // this.partyName = this.bodyData[0].partyName;
          // this.contactNumber = this.bodyData[0].contactNumber;
          // this.addressLine = this.bodyData[0].addressLine;
          // this.productName = this.bodyData[0].productName;
          // this.uomName = this.bodyData[0].uomName;
          // this.retQty = this.bodyData[0].returnQty;

          // this.rtotalGross = this.bodyData[0]["amount"];

          var fileName = this.pageNavigation + ".pdf";
          const content = document.getElementById("reportHeader");
          //this.generateReportPdf("print", fileName, content, this.datalength);
        } else {
          this.toastrService.danger("Message", this.cs.nodatafound);
        }
      });
  }
  diff: any = 0;
  // HTML Report
  // public generateReportV2(data: any) {
  //   //debugger;
  //   // let model: any[];
  //   // model = data;

  //   // if (model.length > 0) {
  //   console.log(data);

  //   this.expireReturnNumber = data['expireReturnNumber'];
  //   this.returnDate = data['returnDate'];
  //   this.salesInvoiceNo = data['salesInvoiceNo'];
  //   this.territory = data['territory'];
  //   this.mioName = data['mioName'];
  //   this.partyName = data['partyName'];

  //   this.bodyData = data.lstDetailsViewModel;
  //   this.datalength = data.lstDetailsViewModel.length;

  //   this.rgrandTotal = 0;
  //   this.rgrandQty = 0;
  //   this.rgrandPrice = 0;
  //   this.rgrandOriginalPrice = 0;
  //   this.rgrandOriginalTotal = 0;
  //   this.bodyData.forEach(element => {
  //     this.rgrandTotal = this.rgrandTotal + element.amount;
  //     this.rgrandQty = this.rgrandQty + element.returnQty;
  //     this.rgrandPrice = this.rgrandPrice + element.returnPrice;
  //     this.rgrandOriginalPrice = this.rgrandOriginalPrice + element.originalPrice;
  //     this.rgrandOriginalTotal = this.rgrandOriginalTotal + element.originalAmount;
  //   });
  //   //this.diff = this.currencyFormatter(this.rgrandOriginalTotal - this.rgrandTotal);
  //   var fileName = this.pageNavigation + ".pdf";
  //   const content = document.getElementById("reportHeader");
  //   this.generateReportPdf("print", fileName, content, this.datalength);
  //   // } else {
  //   //   this.toastrService.danger("Message", this.cs.nodatafound);
  //   // }
  // }
  generateCrReport(reportFormat: any, productExpireReturnId: any) {
    debugger;

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();

    this.apiUrl = `SalesInvoiceReport/GetCreditNoteTransectionReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&productExpireReturnId=${productExpireReturnId}`;

    //console.log(this.apiUrl);
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        console.log(res);
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }

  // public generateReportPdf(
  //   buttonAction: any,
  //   fileName: string,
  //   content: any,
  //   datalength: number
  // ) {
  //   const doc = new jsPDF("p", "pt", "a4");
  //   doc.setFontSize(5);
  //   doc.setTextColor(40);

  //   var legend = {
  //     height: 60,
  //     totalheight: 60 + datalength,
  //   };

  //   const addFooters = (doc) => {
  //     const pageCount = doc.internal.getNumberOfPages();
  //     doc.setFontSize(8);
  //     for (var i = 1; i <= pageCount; i++) {
  //       doc.setPage(i);
  //       doc.text(
  //         "Page " + String(i) + " of " + String(pageCount),
  //         doc.internal.pageSize.width / 1.2,
  //         doc.internal.pageSize.height - 20
  //       );
  //       doc.text(
  //         "Powered by : ONE ERP",
  //         doc.internal.pageSize.width / 2.3,
  //         doc.internal.pageSize.height - 20
  //       );
  //       doc.text(
  //         "Printed Date: " +
  //         new Date().toLocaleDateString() +
  //         " " +
  //         new Date().toLocaleTimeString(),
  //         20,
  //         doc.internal.pageSize.height - 20
  //       );
  //     }
  //   };

  //   //////////// TABLE DATA ////////////
  //   doc.html(content, {
  //     callback: function (doc) {
  //       autoTable(doc, {
  //         html: "#header_table",
  //         startY: legend.totalheight + 20,
  //         styles: { font: "Meta" },
  //         headStyles: {
  //           halign: "center",
  //           valign: "top",
  //           fontStyle: "bold",
  //           textColor: [0, 0, 0],
  //           fontSize: 20,
  //           fillColor: [255, 255, 255],
  //         },
  //         bodyStyles: {
  //           fillColor: [255, 255, 255],
  //           textColor: [0, 0, 0],
  //           valign: "middle",
  //         },
  //         alternateRowStyles: {
  //           fillColor: [255, 255, 255],
  //         },
  //       });

  //       autoTable(doc, {
  //         html: "#body_table",
  //         startY: legend.totalheight + 150,
  //         theme: "grid",
  //         tableLineColor: [0, 0, 0],
  //         tableLineWidth: 0.75,
  //         styles: {
  //           font: "Meta",
  //           lineColor: [44, 62, 80],
  //           lineWidth: 0.55,
  //         },
  //         headStyles: {
  //           fillColor: [255, 255, 255],
  //           textColor: [0, 0, 0],
  //           fontSize: 11,
  //           halign: "center",
  //           valign: "middle",
  //           fontStyle: "bold",
  //         },
  //         bodyStyles: {
  //           fillColor: [255, 255, 255],
  //           textColor: [0, 0, 0],
  //           valign: "middle",
  //         },
  //         columnStyles: {
  //           4: { halign: "right" },
  //           5: { halign: "right" },
  //           6: { halign: "right" },
  //           7: { halign: "right" },
  //           8: { halign: "right" },
  //           9: { halign: "right" },

  //         },
  //         // alternateRowStyles: {
  //         //   fillColor: [250, 250, 250],
  //         // },
  //         alternateRowStyles: {
  //           fillColor: [255, 255, 255],
  //         },
  //       });

  //       autoTable(doc, {
  //         html: "#table_signature",
  //         startY: legend.totalheight + 300,
  //         styles: { font: "Meta", fontSize: 11, halign: "center" },
  //         bodyStyles: {
  //           fillColor: [255, 255, 255],
  //           textColor: 50,
  //         },
  //         alternateRowStyles: {
  //           fillColor: [255, 255, 255],
  //         },
  //       });

  //       addFooters(doc);

  //       ////////////PRINT ////////////
  //       if (buttonAction == "pdf") {
  //         doc.save(fileName);
  //       } else {
  //         window.open(URL.createObjectURL(doc.output("blob")), "_blank"); //doc.output("dataurlnewwindow");
  //         doc.close();
  //       }
  //     },
  //   });
  // }

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
}