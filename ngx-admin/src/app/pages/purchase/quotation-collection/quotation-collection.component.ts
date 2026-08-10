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
import {
  NbComponentStatus,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrConfig,
  NbToastrService,
} from "@nebular/theme";
//import { NavigationStart, Router } from "@angular/router";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { ProductService } from "app/services/inventory/product.service";
import { BranchService } from "app/services/erpsetting/branch.service";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { BillcollectionService } from "app/services/sales/billcollection.service";
import { StockinService } from "app/services/inventory/stockin.service";
import { forkJoin } from "rxjs";
import { QuotationCollectionService } from "app/services/inventory/quotationCollection.service";
import { take } from "rxjs/operators";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}


@Component({
  selector: 'ngx-quotation-collection',
  templateUrl: './quotation-collection.component.html',
  styleUrls: ['./quotation-collection.component.scss']
})
export class QuotationCollectionComponent implements OnInit {

  master: {
    quotationCollectionMasterId: number;
    isDelete: number;
    isActive: number;
    quotationCollectionMasterNo: string;
    quotationCollectionMasterDate: Date;
    PurRequisitionFinalizeDetailId: number;
    status: number;
    remarks: string;

    qty: number;
    rate: number;
    deferredRate: number;

    partySelected: {};

    reqQty: number;
    supplierId: number;
    CtnQty: number;
    productWiseSpecificationId: number;
    productName: string;
    uomName: string;
    productSelected: {};
    companyId: number;
    quotationTypeId: number;
    quotationTypeSelected: {};
    lstQuoDetailsViewModel: any[];
    manufactureOrigin: string;
    VatPercent: number;
    VatAmount: number;
    TotalRate: number;
    BudgetCreateId: number;
    Discount: number;
  };

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
    { title: null, body: "Toaster rock!" },
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

  public pageNavigation = "Quotation Collection";
  public rptHeader = "Product Issue (TD)";

  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.getQuotationCollectionNo();
      //this.master.isActive = 1;
      this.show = false;

    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");
      this.save();
      // this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      // this.show = true;
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      //this.edit();
      this.show = false;
    }
  }
  public getMaster() {
    this.master = {

      quotationCollectionMasterId: 0,
      isDelete: 0,
      isActive: 1,
      quotationCollectionMasterNo: "",
      quotationCollectionMasterDate: new Date(),
      PurRequisitionFinalizeDetailId: 0,
      status: 0,
      remarks: "",
      qty: 0,
      rate: 0,
      deferredRate: 0,
      reqQty: null,
      supplierId: 0,
      CtnQty: null,
      productWiseSpecificationId: 0,
      productName: "",
      uomName: "",
      productSelected: null,
      partySelected: null,
      companyId: 0,
      quotationTypeId: 0,
      quotationTypeSelected: null,
      lstQuoDetailsViewModel: [],
      manufactureOrigin: "",
      VatPercent: 0,
      VatAmount: 0,
      TotalRate: 0,
      BudgetCreateId: 0,
      Discount: 0
    };
  }

  public employeeItems = [];
  public companyItems = [];
  public quotationTypeList = [
    { id: 1, name: "Local Purchase" },
    { id: 2, name: "Import" }
  ];

  public agButtonAction() {
    if (this.commonService.agButtonClicked == "pin") {
      this.commonService.onPin(this.gridColumnApi);
    } else if (this.commonService.agButtonClicked == "unpin") {
      this.commonService.onClear(this.gridColumnApi);
    } else if (this.commonService.agButtonClicked == "refresh") {
      window.location.reload();
    } else if (this.commonService.agButtonClicked == "csv") {
      this.commonService.onExportCSV(this.gridApi, this.rptHeader);
    } else {
      console.log("Click action button");
    }
  }
  /////End of Dynamic Button section (Do Not Edit)///////

  /////////////////////////////// CRUD ///////////////////////////////////////////

  public getTotalRate() {
    if (this.master.VatAmount == undefined || this.master.VatAmount < 0)
      this.master.VatAmount = 0;
    if (this.master.Discount == undefined || this.master.Discount < 0)
      this.master.Discount = 0;
    var rate = this.master.rate;
    var VatPercent = this.commonService.roundWithDecimalPoint(((this.master.VatPercent / 100)), 4);
    this.master.VatAmount = this.commonService.roundWithDecimalPoint((rate * VatPercent), 4);
    var discount = this.commonService.roundWithDecimalPoint((this.master.Discount), 4);
    this.master.TotalRate = this.commonService.roundWithDecimalPoint(((rate + this.master.VatAmount) - discount), 4);
  }

  private save() {
    debugger
    var button = this.commonService.buttonClicked;
    if (this.master.quotationCollectionMasterNo == "" || this.master.quotationCollectionMasterNo == null) {
      this.toastrService.danger("Please enter a Quotation Collection No.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.quotationCollectionMasterDate == null) {
      this.toastrService.danger("Please enter Quotation Collection date.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.PurRequisitionFinalizeDetailId == 0 || this.master.PurRequisitionFinalizeDetailId == null) {
      this.toastrService.danger("Please select Finalize Requisition Product.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.quotationTypeId == 0 || this.master.quotationTypeId == null) {
      this.toastrService.danger("Please select Quotation Collection Type.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (
      this.master.lstQuoDetailsViewModel.length == 0 ||
      this.master.lstQuoDetailsViewModel == null
    ) {
      this.toastrService.danger("Please enter a Supplier.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    this.show = true;
    this.master.quotationCollectionMasterDate = this.commonService.DateFormat(this.master.quotationCollectionMasterDate);
    this.quotationCollectionService.setQuotationCollection(this.master).subscribe((returns: any) => {
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
        this.getQuotationCollectionNo();
        this.getProductDetails();
        this.quotationCollectionService.getQuotationCollectionById(0).subscribe((data: any) => {
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
    this.getQuotationCollectionNo();
  }

  //////////////////////////////// End CRUD /////////////////////////////////////////

  onRefesh() {
    this.selectedRow = "";
    this.ngOnInit();
    //this.onGridReady;
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
    private productrequisitionService: ProductrequisitionService,
    private ProducttransferService: ProducttransferService,
    private quotationCollectionService: QuotationCollectionService,
    private comboService: CommoncomboService,
    private productService: ProductService,
    private branchService: BranchService,
    private stockinService: StockinService,
    private billcollectionService: BillcollectionService,
    private PurchaseorderService: PurchaseorderService,
  ) {
    this.commonService.valueSet("showlist");

    this.getProductDetails();
    // this.getWarehouse(0);
    //this.getSBU(0);
    //this.getSbuWhithoutSelf(0);
    // this.getParty()

    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 100,
      }, /// Dont Change
      // {
      //   headerName: "Product Req. ID",
      //   field: "prodReqId",
      //   filter: "agNumberColumnFilter",
      //   editable: false,
      //   width: 180,
      // },
      {
        headerName: " Quotation Collection No.",
        field: "quotationCollectionMasterNo",
        width: 180,
      },
      {
        headerName: "Quotation Collection Date",
        field: "quotationCollectionMasterDate",
        width: 150,
      },
      {
        headerName: "Remarks",
        field: "remarks",
        width: 220,
      },
      // {
      //   headerName: "Product Req. No.",
      //   field: "quotationCollectionMasterNo",
      //   width: 180,
      // },
      // {
      //   headerName: "From Depot",
      //   field: "fromSbuName",
      //   width: 160,
      // },
      // {
      //   headerName: "To Depot",
      //   field: "tosbuName",
      //   width: 160,
      // },
      // {
      //   headerName: "Remarks",
      //   field: "remarks",
      //   width: 250,
      // },
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
    this.getMaster();
    this.getQuotationCollectionNo();
  }

  onGridReady(params) {
    debugger
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.quotationCollectionService.getQuotationCollectionById(0).subscribe((data: any) => {
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
      let PurRequisitionFinalizeDetailId = event.node.data.PurRequisitionFinalizeDetailId;
      let quotationCollectionMasterId = event.node.data.quotationCollectionMasterId;
      this.master.quotationCollectionMasterDate = new Date(event.node.data.quotationCollectionMasterDate);
      this.master.quotationCollectionMasterNo = event.node.data.quotationCollectionMasterNo;
      this.quotationCollectionService.getQuotationCollectionById(quotationCollectionMasterId).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];
          this.master.quotationCollectionMasterNo = data.data[0].quotationCollectionMasterNo;

          this.master.quotationTypeId = data.data[0].quotationTypeId;
          if (this.master.quotationTypeId && this.master.quotationTypeId != 0) {
            this.master.quotationTypeSelected = this.quotationTypeList.filter(x => x.id == this.master.quotationTypeId)[0];
            this.getSupplierByQuotationType(this.master.quotationTypeSelected)
          }

          let productElement = {
            id: data.data[0].productWiseSpecificationId,
            name: data.data[0].productName,
            productId: data.data[0].productId,
            uomId: data.data[0].uomId,
            uomName: data.data[0].uomName,
            PurRequisitionFinalizeDetailId: data.data[0].PurRequisitionFinalizeDetailId,
            qty: data.data[0].qty
          }
          this.master.productSelected = productElement
          this.getProductById(productElement);
          this.quotationCollectionService.GetQuotationCollDetailsByMasterId(quotationCollectionMasterId)
            .subscribe((data: any) => {
              if (data.success) {
                this.master.lstQuoDetailsViewModel = data.data;
              }
            });
        }


      });

      this.ngOnInit();
    }
  }

  public StoreList = [];
  public getStore(fromsbuId: number) {
    //this.master.storeSelected = [];
    this.stockinService
      .getStore(fromsbuId, this.master.companyId)
      .subscribe((returns: any) => {
        this.StoreList = returns.data.map((val) => ({
          id: val.storeId,
          name: val.storeName,
        }));
      });
  }


  getSupplierByQuotationType(event: any) {
    this.parties = null;
    if (event) {
      if (event.id == 1) {
        debugger
        this.getParty(18, 0)
        this.master.manufactureOrigin = "BD";
      } else {
        this.getParty(18, 0)
      }
    }

  }


  parties = [];
  public getParty(partyTypeId, partyId) {
    this.parties = null;
    this.comboService.GetTypeWisePartyInfo(partyId, partyTypeId).subscribe((returns: any) => {
      console.log(returns.data);
      this.parties = returns.data.map((val) => ({
        id: val.partyId,
        name: val.partyName,
      }));
    });
    // this.comboService.GetSupplierForDropdown().subscribe((returns: any) => {
    //   console.log(returns.data);
    //   this.parties = returns.data.map((val) => ({
    //     id: val.partyId,
    //     name: val.partyName,
    //   }));
    // });
  }

  private agDelete(event) {

    if (confirm('Are you sure to delete?')) {
      this.master.quotationCollectionMasterId = event.node.data.quotationCollectionMasterId;
      this.quotationCollectionService.DeleteQuotationCollById(this.master.quotationCollectionMasterId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(this.commonService.deletedmsg, "Message");

            //////////////Grid Refresh ///////////////////
            this.quotationCollectionService.getQuotationCollectionById(0).subscribe((data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            });
            //////////////Grid Refresh ///////////////////
          }
        });
    }
  }


  public deleteDetails(index: any) {
    debugger;
    if (confirm('Are you sure to delete?')) {
      let quotationCollectionDetailId = this.master.lstQuoDetailsViewModel[index].quotationCollectionDetailId;
      // console.log("salesInvDetailsId", this.master.lstDetailsViewModel[index].salesInvDetailsId);
      if (quotationCollectionDetailId > 0) {
        this.quotationCollectionService
          .DeleteQuotationCollDetailsById(
            quotationCollectionDetailId
          )
          .subscribe((returns: any) => {
            if (returns.success) {
              this.toastrService.danger(this.commonService.deletedmsg, "Message");

              this.selectedRow = this.master.lstQuoDetailsViewModel[index];
              this.master.lstQuoDetailsViewModel.splice(index, 1);
              if (this.selectedRow.helpDetailId > 0) {
              }
            }
          });
      }
      else {
        this.selectedRow = this.master.lstQuoDetailsViewModel[index];
        this.master.lstQuoDetailsViewModel.splice(index, 1);
        if (this.selectedRow.helpDetailId > 0) {
        }
        this.toastrService.danger(this.commonService.deletedmsg, "Message");

      }
    }

  }


  public getQuotationCollectionNo() {
    // debugger
    if (this.master.quotationCollectionMasterDate == null) {
      //console.log("Mintu Bhai");
      this.master.quotationCollectionMasterDate = new Date("dd-MM-yyyy");
    }

    this.quotationCollectionService.getQuotationCollectionNo(this.commonService.DateFormat(this.master.quotationCollectionMasterDate)).subscribe((returns: any) => {
      //console.log(returns);
      if (returns.success) {
        this.master.quotationCollectionMasterNo = returns.data[0].MaxNo;
      }
    });
  }

  public getFromWarehouse() { }

  public productList = [];

  public getProductDetails() {
    this.productrequisitionService.getAllFinalizeRequisitionProducts(0).subscribe((returns: any) => {
      //console.log(returns.data);
      this.productList = returns.data.map((val: any) => ({
        id: val.productWiseSpecificationId,
        name: val.productName,
        productId: val.productId,
        uomId: val.uomId,
        uomName: val.uomName,
        PurRequisitionFinalizeDetailId: val.PurRequisitionFinalizeDetailId,
        qty: val.qty,
        BudgetCreateId: val.BudgetCreateId
      }));
    });
  }

  // public getProductById(id) {
  //   debugger
  //   this.master.productName = "";
  //   this.master.reqQty = 0;
  //   this.master.PurRequisitionFinalizeDetailId = 0;

  //   this.master.productName = this.master.productSelected["name"];
  //   this.master.reqQty = this.master.productSelected["qty"];
  //   this.master.PurRequisitionFinalizeDetailId = this.master.productSelected["PurRequisitionFinalizeDetailId"];
  // //  this.GetCurrentStock();
  // }

  public getProductById(data: any) {
    debugger
    this.master.productName = "";
    this.master.reqQty = 0;
    this.master.PurRequisitionFinalizeDetailId = 0;
    if (data) {
      this.master.productName = data.name;
      this.master.reqQty = data.qty;
      this.master.PurRequisitionFinalizeDetailId = data.PurRequisitionFinalizeDetailId;
      this.master.uomName = data.uomName;
      this.master.BudgetCreateId = data.BudgetCreateId;
      this.master.qty = data.qty;
    }
  }



  public addDetails() {
    //console.log(this.master.productSelected);
    // if (
    //   this.master.partySelected.id == 0 
    // ) {
    //   this.toastrService.danger("Please select Supplier.", "Message");
    //   return false;
    // }
    if (!this.master.partySelected) {
      this.toastrService.danger("Please select Supplier!!", "Message");
      return;
    }
    if (this.master.rate == 0) {
      this.toastrService.danger("Please insert Supplier Rate!!", "Message");
      return;
    }
    if (!this.master.manufactureOrigin) {
      this.toastrService.danger("Please insert manufactureOrigin!!", "Message");
      return;
    }
    let element = {
      quotationCollectionDetailId: 0, //this.master.lstQuoDetailsViewModel.productReqDetailsId,
      supplierName: this.master.partySelected["name"],
      supplierId: this.master.partySelected["id"],
      rate: this.master.rate,
      deferredRate: this.master.deferredRate,
      qty: this.master.qty,
      amount: (this.master.TotalRate * this.master.qty),
      deferredAmount: (this.master.deferredRate * this.master.qty),
      isActive: 1,
      manufactureOrigin: this.master.manufactureOrigin,
      PurRequisitionFinalizeDetailId: this.master.PurRequisitionFinalizeDetailId,
      productWiseSpecificationId: this.master.productSelected["id"],
      productName: this.master.productSelected["name"],
      VatPercent: this.master.VatPercent,
      VatAmount: this.master.VatAmount,
      TotalRate: this.master.TotalRate,
      uomName: this.master.uomName,
      BudgetCreateId: this.master.BudgetCreateId,
      Discount: this.master.Discount
    };

    // var indexu = this.master.lstQuoDetailsViewModel.findIndex(
    //   (x) =>
    //     x.supplierId == this.master.supplierId
    // );
    // if (indexu > -1) {
    //   this.toastrService.danger("Supplier Already Exist !!", "Message");
    //   return;
    // }


    //this.master.lstQuoDetailsViewModel.push(detail);
    if (element.qty != 0) {
      this.master.lstQuoDetailsViewModel.splice(0, 0, element);
      //this.master.lstQuoDetailsViewModel.push(detail);
    } else {
      this.toastrService.danger("Quantity is zero.", "Message");
      return;
    }

    this.master.partySelected = null;
    //this.master.qty = 0;
    this.master.rate = 0;
    this.master.deferredRate = 0;
    this.master.manufactureOrigin = null;
    this.master.VatPercent = 0;
    this.master.VatAmount = 0;
    this.master.TotalRate = 0;
    this.master.Discount = 0;
    //console.log(this.master.lstQuoDetailsViewModel);
  }

  // public deleteDetail(index: any) {
  //   if (confirm('Are You Sure?')) {
  //     this.selectedRow = this.master.lstQuoDetailsViewModel[index];
  //     const productTrnfrDetailsId = this.selectedRow.productTrnfrDetailsId;
  //     this.ProducttransferService.deleteProductTrnfrDetailsById(productTrnfrDetailsId).pipe(take(1)).subscribe(
  //       (returns: any) => {
  //         if (returns.success) {
  //           this.master.lstQuoDetailsViewModel.splice(index, 1);
  //           if (this.selectedRow.helpDetailId > 0) {
  //           }
  //           this.toastrService.danger(this.commonService.deletedmsg, "Message");
  //         } else {
  //           this.toastrService.warning('Data is not deleted', "Message");
  //         }
  //       }
  //     );
  //   }
  // }

  public refesh() {
    this.master.lstQuoDetailsViewModel = [];
    this.toastrService.warning(this.commonService.warningmsg, "Message");
  }

  //////////////////////////////////End of Ag Grid Data Load/////////////////////////////////

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

  public getCompany() {
    this.comboService.getCompany().subscribe((returns: any) => {
      this.companyItems = returns.data.map((val) => ({
        id: val.companyId,
        name: val.companyName,
      }));
    });
  }

  public tableHeader = [
    "#",
    "Product Name",
    "Carton Qty.",
    "Loose Qty.",
    "UOM",
    // "TP",
    "Amount (TK)"];

  private agReport(event) {
    //this.getReportData(event.data.quotationCollectionMasterId);
    this.generateCrReport(event.data.quotationCollectionMasterId, 'pdf');
  }

  datalength: number;
  quotationCollectionMasterNo = "";
  quotationCollectionMasterDate = "";
  remarks = "";
  bodyData = [];
  headerData = [];
  params = [];
  gTotal: number = 0.00;
  public quotationDetailsData = [];
  public productNameforReport: string = '';
  public quocolNo: string = '';
  public quColDate: Date;
  public qty: number;
  public getReportData(masterId) {

    // forkJoin([this.quotationCollectionService.getQuotationCollectionById(masterId),
    //     this.ProducttransferService.GetProductTransferDetailsByMasterId(masterId)
    // ])
    //   .subscribe(([returnsMaster, returnsDetails]) => {
    //     if (returnsMaster.success) {
    //       this.gTotal = returnsDetails.data.reduce((accumulator, obj) => {
    //         return accumulator + obj.totalAmount;
    //       }, 0);

    //       this.headerData = returnsMaster.data;
    //       this.bodyData = returnsDetails.data;
    //       this.params = [];
    //       this.params.push({
    //         leftLabel: "TD No.",
    //         leftValue: `: ${this.headerData[0].prodTrnNo}`,
    //         rightLabel: "Date",
    //         rightValue: `: ${this.headerData[0].prodTrnDate}`,
    //       });
    //       this.params.push({
    //         leftLabel: "From Depot",
    //         leftValue: `: ${this.headerData[0].fromSbuName}`,
    //         rightLabel: "To Depot",
    //         rightValue: `: ${this.headerData[0].tosbuName}`,
    //       });
    //       this.params.push({
    //         leftLabel: "Driver Name",
    //         leftValue: `: ${this.headerData[0].driverName}`,
    //         rightLabel: "Vehicle No.",
    //         rightValue: `: ${this.headerData[0].vehicleNo}`,
    //       });

    //       this.remarks = this.headerData[0].remarks;

    //       var fileName = this.rptHeader + ".pdf";
    //       const content = document.getElementById("reportHeader");
    //       this.generateReport("print", fileName, content, this.datalength);
    //     } else {
    //       this.toastrService.danger("Message", this.commonService.nodatafound);
    //     }
    //   });

    this.quotationCollectionService.getQuotationCollectionById(masterId).subscribe((data: any) => {
      if (data.success) {
        console.log("quotation master data:======================", data.data);
        this.master = data.data[0];
        this.quocolNo = data.data[0].quotationCollectionMasterNo;
        this.productNameforReport = data.data[0].productName;
        this.quColDate = data.data[0].quotationCollectionMasterDate;
        this.qty = data.data[0].qty;

        this.quotationCollectionService.GetQuotationCollDetailsByMasterId(masterId)
          .subscribe((data: any) => {
            if (data.success) {
              console.log("Details data for quotation Collection:==================", data.data);
              this.quotationDetailsData = data.data;
            }
          });

        var fileName = this.rptHeader + ".pdf";
        const content = document.getElementById("reportHeader");
        this.generateReport("print", fileName, content, this.datalength);

      }
      else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }

      // console.log("master model");
      console.log("master model", this.master);

    });
  }

  generateCrReport(masterId: any, reportFormat: any) {
    let apiUrl = `PurchaseRequisition/GetQuotationCollection?quotationCollectionId=${masterId}&reportFormat=${reportFormat}`;
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




  /////////////////////////////report
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

}