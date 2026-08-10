import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { SalaryreportService } from "app/services/salary/salaryprocess/salaryreport.service";
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
import { NavigationStart, Router } from "@angular/router";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { ElementRef } from "@angular/core";
import { PurchaserequisitionService } from "app/pages/purchase/settings/purchaserequisition.service";
import { BtnCellRendererVoucher } from "app/pages/common/btn-cell-renderervoucher.component";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: "ngx-purchaseorder",
  templateUrl: "./purchaseorder.component.html",
  styleUrls: ["./purchaseorder.component.scss"],
})
export class PurchaseorderComponent implements OnInit {
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
    purchaseOrderId: number;
    purOrderNo: string;
    purchaseReqId: number;
    purchaseFromId: number;
    purchaseOrderDate: Date;
    fromWarehouseId: number;
    toWarehouseId: number;
    supplierId: number;
    csMasterId: number;
    requisitionFinalizeMasterId: number;
    purchaseOrderFromId: string;
    purchaseOrderSignatoryId: number;
    purpose: string;
    isUrgency: number;
    approvalStatus: number;
    isDelete: number;
    isActive: number;
    termsAndConditions: string;
    supplierName: string;

    addressLine: string;
    contactPerson: string;
    contactNumber: string;
    email: string;

    lcNo: string;
    refNo: string;
    transactionTypeId: number;

    transactionTypeSelected: {};
    ToWarehouseSelected: {};
    FromWarehouseSelected: {};
    purchaseOrderFromSelect: {};
    purchaseOrderSignatorySelect: {};
    purchasereqselected: {};
    supplierSelected: {};
    purchaseFromSelected: {}
    csSelected: {}
    finalizeRequisitionSelected: {}

    lstPurOrderDetailsViewModel: any[];
    poWiseTermsAndConditions: any[];
  };

  public sbus = [];
  public purchaseFromList = [{ id: 1, name: "Purchase (Finalized Requisition)" }, { id: 2, name: "Comparative Statement(CS)" }]

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
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "Purchase Orders";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.getMaxPurchaseorderno(new Date());
      this.getpurchaseOrderFrom(0);
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
      purchaseOrderId: 0,
      purchaseOrderFromId: "",
      purchaseOrderSignatoryId: 0,
      purchaseOrderFromSelect: null,
      purchaseOrderSignatorySelect: null,
      purOrderNo: "",
      purchaseReqId: 0,
      purchaseOrderDate: new Date(),
      fromWarehouseId: null,
      toWarehouseId: 0,
      supplierId: 0,
      purpose: "",
      isUrgency: 0,
      approvalStatus: 0,
      isDelete: 0,
      isActive: 1,
      purchaseFromId: 0,
      csMasterId: 0,
      requisitionFinalizeMasterId: 0,

      lcNo: "",
      refNo: "",
      transactionTypeId: 0,

      transactionTypeSelected: null,
      purchaseFromSelected: null,
      termsAndConditions: null,
      FromWarehouseSelected: null,
      ToWarehouseSelected: null,
      supplierSelected: null,
      supplierName: null,
      purchasereqselected: null,
      addressLine: "",
      contactPerson: "",
      contactNumber: "",
      email: "",
      csSelected: null,
      finalizeRequisitionSelected: null,

      lstPurOrderDetailsViewModel: [],
      poWiseTermsAndConditions: [],
    };
    this.master.transactionTypeSelected = {};
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
    if (this.master.purchaseOrderDate == null) {
      this.toastrService.danger("Please enter purchase order date.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.purOrderNo == "" || this.master.purOrderNo == null) {
      this.toastrService.danger("Please enter purchase order no.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }

    if (this.master.supplierId == 0 || this.master.supplierId == null) {
      this.toastrService.danger("Please select supplier name.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }
    if (
      this.master.lstPurOrderDetailsViewModel.length == 0 ||
      this.master.lstPurOrderDetailsViewModel == null
    ) {
      this.toastrService.danger(
        "Products not Found!",
        "Message"
      );
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }
    if (
      this.master.transactionTypeId == 0 ||
      this.master.transactionTypeId == null
    ) {
      this.toastrService.danger("Please select a Transaction Type.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }

    if (!this.master.purchaseOrderSignatorySelect || this.master.purchaseOrderSignatorySelect == null
    ) {
      this.master.purchaseOrderSignatoryId = null
    }

    this.show = true;
    this.PurchaseorderService.savePurchaseOrder(this.master).subscribe(
      (returns: any) => {
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
          this.PurchaseorderService.getPurchaseOrder(0, 0).subscribe(
            (data: any) => {
              if (data.success) {
                this.rowData = data.data;
              }
            }
          );
          //////////////Grid Refresh ///////////////////
        }
      }
    );
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
  public tableHeader = ["#", "Req. Qty", "Price", "Ship To", "Bill To"];
  public termsandcondition = ["Terms And Conditions"];
  public selectdetailRows = [];
  private gridApi;
  private gridColumnApi;
  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: [];
  public frameworkComponents: {
  //  btnCellRenderer: typeof BtnCellRenderer;
     btnCellRendererVoucher: typeof BtnCellRendererVoucher;
  };

  constructor(
    private http: HttpClient,
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private PurchaseorderService: PurchaseorderService,
    private comboService: CommoncomboService,
    private purchaserequisitionService: PurchaserequisitionService,
    private salaryreportService: SalaryreportService,
  ) {
    this.getSBU(0);
    this.commonService.valueSet("showlist");
    this.getpurchaseOrderFrom(0);
    // this.getSupplier();
    this.getPurchaseReq();
    this.getMaxPurchaseorderno(new Date());
    this.GetTransactionType();
    // this information is get from DB for next time
    this.company = {
      name: "One Information And Communications Technology Ltd",
      address: "14/A, Center Point Concord Unit-10A & B Tejgaon, Dhaka - 1215",
      custom_footer: true,
      phone: "01704-055668",
      fax: "02-98765432",
      email: "info@one-ict.com",
      website: "www.one-ict.com",
      vat: "13145664564",
      tin: "00000000000",
    };

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
        headerName: "Order No.",
        field: "purOrderNo",
        width: 160,
      },
      {
        headerName: "Purchase Order Date",
        field: "purchaseOrderDate",
        width: 140,
      },

      {
        headerName: "Supplier Name",
        field: "supplierName",
        width: 160,
      },
      {
        headerName: "purpose",
        field: "purpose",
        width: 160,
      }, {
        headerName: "Urgency",
        field: "Urgency",
        width: 160,
      },
      {
        field: "Action",
        cellRenderer: "btnCellRendererVoucher",
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
   //   btnCellRenderer: BtnCellRenderer,
      btnCellRendererVoucher:BtnCellRendererVoucher,
    };
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
    };
    this.getMaster();
  }

  public getMaxPurchaseorderno(date: Date) {
    this.PurchaseorderService.getmaxPurchaseOrder(
      date.toDateString().substring(4, 15)
    ).subscribe((returns: any) => {
      if (returns.success) {
        this.master.purOrderNo = returns.data[0].MaxNo;
      }
    });
  }

  DateChange() {
    debugger
    this.getMaxPurchaseorderno(this.master.purchaseOrderDate)

  }

  // public purchaseFromList = [{id:1,name:"Spot Purchase (Finalized Requisition)"},{id:2,name:"Comparative Statement(CS)"}]
  public ClearOrderItemList() {
    this.master.lstPurOrderDetailsViewModel = [];
  }
  clearSupplier() {
    this.supplierList = [];
    this.master.supplierSelected = {};
  }

  csList = [];
  finalizeRequisitionList = [];
  getPurchaseFromDetails(data: any) {
    this.ClearOrderItemList();
    this.csList = [];
    this.finalizeRequisitionList = [];
    this.clearSupplier();
    if (this.master.purchaseFromId == 1) { //Spot Purchase (Finalized Requisition)

      this.purchaserequisitionService.GetAllFinalizeRequisitions(0, 1)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.finalizeRequisitionList = returns.data.map((val) => ({
              id: val.requisitionFinalizeMasterId,
              name: val.requisitionFinalizeNo + " - " + val.requisitionFinalizeDate,
            }));
          }
        });

    } else if (this.master.purchaseFromId == 2) { // Comparative Statement(CS)
      this.purchaserequisitionService.GetAllComparativeStatementsbyStatus(1, 1).subscribe(
        (returns: any) => {
          if (returns.success) {
            this.csList = returns.data.map((val) => ({
              id: val.csMasterId,
              name: val.csMasterNo,
            }));
          }
        });
    }
  }

  csDetails(data: any) {
    this.ClearOrderItemList();
    this.clearSupplier();
    this.clearTermsAndConditions();
    this.purchaserequisitionService.GetCSDetailsbyMasterId(this.master.csMasterId, 0).subscribe((res: any) => {
      if (res.success) {
        this.supplierList = res.data.map((val: any) => ({
          id: val.supplierId,
          name: val.supplierName,
        }));


      }
    });

  }
  finalizeRequisitionDetails(data: any) {
    this.ClearOrderItemList();
    this.clearSupplier();
    this.clearTermsAndConditions();
    this.purchaserequisitionService.GetAllFinalizeRequisitionDetailByMasterId(this.master.requisitionFinalizeMasterId, 0).subscribe((res: any) => {
      if (res.success) {
        this.supplierList = res.data.map((val: any) => ({
          id: val.supplierId,
          name: val.supplierName,
        }));


      }
    });
  }


  getProductsSupplierWise() {
    this.ClearOrderItemList()
    this.clearTermsAndConditions();
    if (this.master.purchaseFromId == 1) { //Spot Purchase (Finalized Requisition)
      this.purchaserequisitionService.GetAllFinalizeRequisitionDetailByMasterId(this.master.requisitionFinalizeMasterId, this.master.supplierId)
        .subscribe((returns: any) => {
          if (returns.success) {
            //this.detaildata = returns.data;
            debugger
            this.master.lstPurOrderDetailsViewModel = returns.data;
            if (returns.data.length > 0) {
              let productTypeId = returns.data[0].productTypeId;
              if (productTypeId && productTypeId != 0) {
                this.getProductTypeWiseTermsAndConditions(this.master.purchaseOrderId, productTypeId);
              }
            }

          }
        });

    } else if (this.master.purchaseFromId == 2) { // Comparative Statement(CS)
      this.purchaserequisitionService.GetCSDetailsbyMasterId(this.master.csMasterId, this.master.supplierId).subscribe((returns: any) => {
        if (returns.success) {
          debugger
          this.master.lstPurOrderDetailsViewModel = returns.data;
          if (returns.data.length > 0) {
            let productTypeId = returns.data[0].productTypeId;
            if (productTypeId && productTypeId != 0) {
              this.getProductTypeWiseTermsAndConditions(this.master.purchaseOrderId, productTypeId);
            }
          }
        }
      });
    }


  }

  getProductTypeWiseTermsAndConditions(purchaseOrderId: any, productTypeId: any) {
    this.master.poWiseTermsAndConditions = [];
    this.PurchaseorderService.getProductTypeWiseTermsAndConditions(purchaseOrderId, productTypeId).subscribe((data: any) => {
      if (data.success) {
        this.master.poWiseTermsAndConditions = data.data;
      }
    });
  }

  transactionTypeList = [];
  public GetTransactionType() {
    this.PurchaseorderService.GetTransactionType(0).subscribe(
      (returns: any) => {
        if (returns.success) {
          this.transactionTypeList = returns.data.map((val) => ({
            id: val.transactionTypeId,
            name: val.transactionTypeName,
          }));
        }
      }
    );
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.PurchaseorderService.getPurchaseOrder(0, 0).subscribe((data: any) => {
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
    } else if (data == "print") {

      this.printReport(event,2)
    } 
     else if (data == "transectionreport") {
      this.printReport(event, 1);
    }
    else if (data == "delete") {
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
      var purchaseOrderId = event.node.data.purchaseOrderId;

      this.PurchaseorderService.getPurchaseOrder(purchaseOrderId, 0).subscribe(
        (data: any) => {
          if (data.success) {
            debugger
            this.master = data.data[0];
            let purchaseForm = this.purchaseFromList.filter(x => x.id == this.master.purchaseFromId)[0];
            if (purchaseForm) {
              this.master.purchaseFromSelected = {
                id: purchaseForm.id,
                name: purchaseForm.name,
              };
            }

            if (this.master.purchaseFromId == 1) {
              this.master.csSelected = {}
              this.master.finalizeRequisitionSelected = {
                id: data.data[0].requisitionFinalizeMasterId,
                name: data.data[0].requisitionFinalizeNo,
              };
            } else if (this.master.purchaseFromId == 2) {
              this.master.finalizeRequisitionSelected = {}
              this.master.csSelected = {
                id: data.data[0].csMasterId,
                name: data.data[0].csMasterNo,
              };
            } else {
              this.master.csSelected = {}
              this.master.finalizeRequisitionSelected = {}
            }
            this.getSBU(0);
            this.getpurchaseOrderFrom(0);
            this.getPurchaseOrderDetailsInUpdate();
            //this.getTermsAndConditionSupplierIdWiseInUpdate(purchaseOrderId);
            this.getProductTypeWiseTermsAndConditions(purchaseOrderId, 0);

            this.master.purchaseOrderFromSelect = {
              id: data.data[0].employeeId,
              name: data.data[0].fullName,
            };

            this.master.purchaseOrderSignatorySelect = {
              id: data.data[0].signatoryEmployeeId,
              name: data.data[0].purchaseOrderSignatoryfullName,
            };



            this.master.supplierSelected = {
              id: data.data[0].supplierId,
              name: data.data[0].supplierName,
            };

            this.master.transactionTypeSelected = {
              id: data.data[0].transactionTypeId,
              name: data.data[0].transactionTypeName,
            };
          }
        }
      );
      this.ngOnInit();
    }
  }

  private agDelete(event) {
    if (confirm('Are you sure to delete?')) {
      this.master.purchaseOrderId = event.node.data.purchaseOrderId;
      this.PurchaseorderService.deletePurchaseOrderById(
        this.master.purchaseOrderId
      ).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");

          //////////////Grid Refresh ///////////////////
          this.PurchaseorderService.getPurchaseOrder(
            0, 0).subscribe((data: any) => {
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
  public getSBU(companyId) {
    //this.master.sbusSelected = null;
    this.comboService.getSBU(companyId).subscribe((returns: any) => {
      this.sbus = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }

  public purchaseOrderSignatoryList = [];
  public purchaseOrderFrom = [];

  public getpurchaseOrderFrom(companyId) {
    this.comboService
      .getpurchaseOrderFrom(companyId)
      .subscribe((returns: any) => {
        //console.log(returns.data)
        debugger
        this.purchaseOrderFrom = returns.data.map((val) => ({
          id: val.employeeId,
          name: val.fullName,
        }));

        let selectedUser = returns.data;
        if (selectedUser) {
          this.master.purchaseOrderFromId = selectedUser.employeeId;
          this.master.purchaseOrderFromSelect = {
            id: selectedUser.employeeId,
            name: selectedUser.fullName,
          };
        }

        this.purchaseOrderSignatoryList = returns.data.filter(x => x.employeeId == 201293).map((val) => ({
          id: val.employeeId,
          name: val.fullName,
        }));
      });
  }

  public supplierList = [];


  public PurchaseReqNoList = [];
  public getPurchaseReq() {
    this.PurchaseorderService.getPurchaseReq().subscribe((retuns: any) => {
      if (retuns.success) {
        this.PurchaseReqNoList = retuns.data.map((val: any) => ({
          id: val.purchaseReqId,
          name: val.purReqNo,
        }));
      }
    });
  }

  public Clear() {
    this.master.lstPurOrderDetailsViewModel = [];
  }

  public Add() {
    this.getPurchaseOrderDetails();
  }
  public detaildata: any[];
  public getPurchaseOrderDetails() {
    if (this.master.purchasereqselected == null) {
      this.toastrService.danger("Please select purchase req no.", "Message");
      // this.show = false;
      this.commonService.valueSet("create");
      return false;
    }
    this.PurchaseorderService.getPurchaseOrderDetailsById(
      this.master.purchaseReqId
    ).subscribe((returns: any) => {
      if (returns.success) {
        this.detaildata = returns.data;
        var count = this.master.lstPurOrderDetailsViewModel.length;
        if (count == 0) {
          this.master.lstPurOrderDetailsViewModel = this.detaildata;
        } else {
          this.detaildata.map((item) => {
            var countitem = this.master.lstPurOrderDetailsViewModel.filter(
              (x) =>
                x.PurchaseReqDetailsId == item.PurchaseReqDetailsId &&
                x.productWiseSpecificationId == item.productWiseSpecificationId
            );
            if (countitem.length == 0) {
              this.master.lstPurOrderDetailsViewModel.push(item);
            }
          });
        }

        this.master.purchasereqselected = null;
      }
    });
  }

  public getPurchaseOrderDetailsInUpdate() {
    this.PurchaseorderService.getPurchaseOrderDetailsInUpdate(
      this.master.purchaseOrderId
    ).subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        if (data.data.length > 0) {
          for (let index = 0; index < data.data.length; index++) {
            this.master.lstPurOrderDetailsViewModel = data.data;
          }
        } else {
          this.master.lstPurOrderDetailsViewModel = [];
        }
      }
    });
  }

  public getTermsAndConditionSupplierIdWise(supplierId) {
    this.PurchaseorderService.getTermsAndConditionSupplierIdWise(
      supplierId
    ).subscribe((data: any) => {
      if (data.success) {
        this.master.poWiseTermsAndConditions = data.data;
      }
    });
  }

  public getTermsAndConditionSupplierIdWiseInUpdate(purchaseOrderId) {
    this.PurchaseorderService.getTermsAndConditionPOIdWiseInUpdate(
      purchaseOrderId
    ).subscribe((data: any) => {
      if (data.success) {
        this.master.poWiseTermsAndConditions = data.data;
      }
    });
  }

  public clearTermsAndConditions() {
    this.master.poWiseTermsAndConditions = [];
  }

  public AddTermsAndConditions() {
    let detail = {
      termsAndConditions: this.master.termsAndConditions,
      Active: 1,
      supplierId: this.master.supplierId,
      supplierName: this.master.supplierSelected["name"],
    };
    this.master.poWiseTermsAndConditions.push(detail);
  }

  public DeleteTAndCdetail(index: any) {
    this.selectedRow = this.master.poWiseTermsAndConditions[index];
    this.master.poWiseTermsAndConditions.splice(index, 1);
    if (this.selectedRow.helpDetailId > 0) {
    }
    this.toastrService.danger(this.commonService.deletedmsg, "Message");
  }



  public subTotal = 0;
  public discount = 0;
  public vat = 0;
  public tax = 0;
  public grandTotal = 0;
  public grandTotalInWord = "";

  // Use in Future. also need amount to word API
  calculateSum() {
    //debugger;
    for (let j = 0; j < this.detailsData.length; j++) {
      this.subTotal += this.detailsData[j].price * this.detailsData[j].reqQty;
    }
    this.grandTotal = this.subTotal + this.vat + this.tax - this.discount;
    //console.log(this.subTotal)
  }

  public bodyData: any = [];

  public masterData: any = [];
  public detailsData: any = [];
  public termsAndconditionData: any = [];

  // Vendor info
  public vAddressLine = "";
  public vContactPerson = "";
  public vContactNumber = "";
  public vEmail = "";

  // Supplier info
  public pAddressLine = "";
  public pContactPerson = "";
  public pContactNumber = "";
  public pEmail = "";

  // Bill collection
  public bAddressLine = "";
  public bContactPerson = "";
  public bContactNumber = "";
  public bEmail = "";

  public datalength: number;
  public purOrderNo = "";
  public LcNo = "";
  public RefNo = "";
  public paymentMode = "";
  public purReqNo = "";
  public purchaseOrderDate = "";
  public reqQty = "";
  public price = "";
  public params = [];
  public test =
    " 1. Material should be delivered in good condition & within the schedule";



  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Budget No",
      leftValue: "",
      rightLabel: "Budget Date",
      rightValue: "",
    });
    this.params.push({ leftLabel: "Fiscal Year", leftValue: "" });
  }

  printReport(event: any,type:any) {
    debugger
   // alert(type);
    if (event.node.data.purchaseOrderId != null && event.node.data.purchaseOrderId > 0) {
      this.generateCrReport(event.node.data.purchaseOrderId, 'pdf',type);
    }
  }

  generateCrReport(purchaseOrderId: any, reportFormat: any,type:any) {
    debugger
    let apiUrl = `PurchaseRequisition/GetPurchaseOrderReport?purchaseOrderId=${purchaseOrderId}&reportFormat=${reportFormat}&type=${type}`;
    this.commonService.GetCrystalReportData(apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }

  public generateReport(reportFormat: any) {
    debugger;
    let param = '';
    if (param.length > 0) {
      param = param.substring(0, param.length - 1);
    }
    this.purchaserequisitionService.RptPurchaseOrderReport(1, this.master.purchaseOrderId, reportFormat).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });

  }
}
