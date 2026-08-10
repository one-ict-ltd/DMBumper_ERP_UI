import {
  OnInit,
  Component,
  TemplateRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,

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
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";

import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { forkJoin } from "rxjs";

@Component({
  selector: 'ngx-sales-picking',
  templateUrl: './sales-picking.component.html',
  styleUrls: ['./sales-picking.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesPickingComponent implements OnInit {

  protected options: {};
  protected cd: ChangeDetectorRef;
  showMessages: any = {};
  errors: string[];
  disabled: boolean = false;
  config: NbToastrConfig;
  public bodyData: any = [];
  public bodyData1: any = [];
  index = 1;
  public apiUrl = "";
  public apiUrl1 = "";
  public pickingNo = "";
  public PickingDate = "";
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

  public pageNavigation = "Sales Picking";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      //this.GetSalesInvoiceMasterListByTerritory();
      this.getMaster();
      this.getAllArea();
      //this.getterritorybyareaCode();

      // if (this.transactionTypeList.length > 0) {
      //   this.master.transactionTypeId = this.transactionTypeList[0].id;
      //   this.transactionTypeSelected = { id: this.transactionTypeList[0].id, name: this.transactionTypeList[0].name };
      // }
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      //this.GetSalesInvoiceMasterListByTerritory();
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
      this.commonService.valueSet("create");
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      this.commonService.valueSet("create");
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      //this.GetSalesInvoiceMasterListByTerritory();
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

  master: {
    distributionMasterId: number;
    pickingDate: Date;
    areaCode: any;
    territoryid: any;
    approvalStatus: string;
    lstMasterViewModel: any[];
    lstProductListViewModel: any[];
    areaSelected: {};
    territorySelected: {};
    transactionTypeId: number;
  };

  public getMaster() {
    this.master = {
      distributionMasterId: 0,
      pickingDate: new Date(),
      areaCode: '',
      territoryid: '',
      approvalStatus: "",
      lstMasterViewModel: [],
      lstProductListViewModel: [],
      areaSelected: null,
      territorySelected: null,
      transactionTypeId: 0,
    };
    //this.GetSalesInvoiceMasterListByTerritory();
    this.totalRows = 0;
    this.totalItems = 0;
  }


  areaList: any = [];
  getAllArea(code: string = '') {
    this.areaList = [];
    this.master.areaCode = '';
    this.master.areaSelected = {};

    this.TerritoryList = [];
    this.master.territoryid = '';
    this.master.territorySelected = {};

    this.apiUrl = "";

    this.apiUrl = `ERPCompany/getPendingPickingAreaByUser?code=${code}`;

    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        debugger;
        this.areaList = returns.data.map((val: any) => ({
          id: val.AreaCode,
          name: val.AreaName,
        }));
      }
    });
  }


  public TerritoryList = [];
  public getterritorybyareaCode() {
    this.master.territoryid = '';
    this.master.territorySelected = null;
    this.TerritoryList = [];
    this.fieldforcemasterService.getTerritoryForPickingByUser(this.master.areaCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.TerritoryList = retuns.data.map((val: any) => ({
          id: val.TerritoryCode,
          name: val.TerritoryName,
        }))
      }
    })
  }

  transactionTypeSelected: {};
  transactionTypeList = [];
  public GetTransactionType() {
    this.transactionTypeSelected = null;
    this.PurchaseorderService.GetTransactionType(0).subscribe(
      (returns: any) => {
        if (returns.success) {
          this.transactionTypeList = returns.data.map((val) => ({
            id: val.transactionTypeId,
            name: val.transactionTypeName,
          }));

          this.transactionTypeList.splice(0, 0, {
            id: 0,
            name: 'All',
          });

        }
      }
    );
  }

  totalItems = 0;
  isSelectAll: boolean = false;

  selectAll(e) {

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


    return;


    if (e.target.checked) {
      this.master.lstMasterViewModel.forEach(element => {
        //alert(salesInvoiceId);

        element.isSelect = true;
        const salesInvoiceId = element.salesInvoiceId;

        this.salesinvoiceService.GetSalesInvoiceDetailsByIdForApproval(salesInvoiceId).subscribe((data: any) => {
          //debugger;
          if (data.success) {
            data.data.forEach((value, index) => {
              if (this.master.lstProductListViewModel.length == 0) {
                this.master.lstProductListViewModel.push(value);
              } else {
                var indexu = this.master.lstProductListViewModel.findIndex(
                  (x) =>
                    x.productWiseSpecificationId == value.productWiseSpecificationId
                );
                if (indexu > -1) {
                  this.master.lstProductListViewModel[indexu].invoiceQty += value.invoiceQty;
                } else {
                  this.master.lstProductListViewModel.push(value);
                }
              }
            });
          }
        });
      });
    } else {

      this.master.lstProductListViewModel = [];
      this.master.lstMasterViewModel.forEach(element => {
        element.isSelect = false;
      });

      this.totalItems = this.master.lstProductListViewModel.length;

      /*
      this.salesinvoiceService.GetSalesInvoiceDetailsByIdForApproval(salesInvoiceId).subscribe((data: any) => {
        //debugger;
        if (data.success) {
          data.data.forEach((value, index) => {
            var indexu = this.master.lstProductListViewModel.findIndex(
              (x) =>
                x.productWiseSpecificationId == value.productWiseSpecificationId
            );
            if (indexu > -1) {
              this.master.lstProductListViewModel[indexu].invoiceQty -= value.invoiceQty;
              if (this.master.lstProductListViewModel[indexu].invoiceQty <= 0) {
                this.master.lstProductListViewModel.splice(indexu, 1);
              }
              // this.master.lstProductListViewModel.forEach((value, index) => {
              //   if (value.invoiceQty == 0) this.master.lstProductListViewModel.splice(index, 1);
              // });
            }
          });
        }
      });
 */
    }

  }

  AddProduct(e, salesInvoiceId) {

    return;

    if (e.target.checked) {
      //alert(salesInvoiceId);
      this.salesinvoiceService.GetSalesInvoiceDetailsByIdForApproval(salesInvoiceId).subscribe((data: any) => {
        //debugger;
        if (data.success) {
          data.data.forEach((value, index) => {
            if (this.master.lstProductListViewModel.length == 0) {
              this.master.lstProductListViewModel.push(value);
            } else {
              var indexu = this.master.lstProductListViewModel.findIndex(
                (x) =>
                  x.productWiseSpecificationId == value.productWiseSpecificationId
              );
              if (indexu > -1) {
                this.master.lstProductListViewModel[indexu].invoiceQty += value.invoiceQty;
              } else {
                this.master.lstProductListViewModel.push(value);
              }
            }
          });
        }
      });
    } else {
      this.salesinvoiceService.GetSalesInvoiceDetailsByIdForApproval(salesInvoiceId).subscribe((data: any) => {
        //debugger;
        if (data.success) {
          data.data.forEach((value, index) => {
            var indexu = this.master.lstProductListViewModel.findIndex(
              (x) =>
                x.productWiseSpecificationId == value.productWiseSpecificationId
            );
            if (indexu > -1) {
              this.master.lstProductListViewModel[indexu].invoiceQty -= value.invoiceQty;
              if (this.master.lstProductListViewModel[indexu].invoiceQty <= 0) {
                this.master.lstProductListViewModel.splice(indexu, 1);
              }
              // this.master.lstProductListViewModel.forEach((value, index) => {
              //   if (value.invoiceQty == 0) this.master.lstProductListViewModel.splice(index, 1);
              // });
            }
          });
        }
      });

    }
    //console.log(this.master.lstProductListViewModel);
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

  SaveValidation(): boolean {
    if (
      this.ApprovalStatusSelected == null ||
      this.ApprovalStatusSelected["name"] == ""
    ) {
      this.toastrService.warning("Please select a Approval Status.", "Message");
      // this.commonService.valueSet("create");
      return false;
    }

    let count: number = 0;
    this.master.lstMasterViewModel.forEach((e) => {
      if (e.isSelect == 1) count++;
    });

    if (count == 0) {
      this.toastrService.warning(
        "Please select a invoice for approval.",
        "Message"
      );
      // this.commonService.valueSet("create");
      return false;
    }

    return true;
  }

  isDisabled: boolean = false;
  private save() {
    //console.log(this.master);
    var button = this.commonService.buttonClicked;
    this.show = true;

    this.master.pickingDate = this.commonService.DateFormat(this.master.pickingDate);

    this.isDisabled = true;
    this.salesinvoiceService
      .SetSalesPicking(this.master)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.isDisabled = false;
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
          this.loadListData();
          this.commonService.valueSet("showlist");
        }
        else {
          this.isDisabled = false;
          this.toastrService.warning(
            returns.message,
            "Message"
          );
        }
      });
    this.getMaster();
  }

  private reset() {
    this.transactionTypeSelected = {};
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

  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private PurchaseorderService: PurchaseorderService,
    private fieldforcemasterService: FieldforcemasterService,
    //private datePipe: DatePipe,
    private salesinvoiceService: SalesinvoiceService
  ) {
    this.commonService.valueSet("showlist");

    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.rowIndex + 1",
        pinned: "left",
        filter: false,
        width: 70,
      }, /// Dont Change
      {
        headerName: "Picking Number",
        field: "pickingNo",
        width: 180,
      },
      {
        headerName: "Picking Date",
        field: "pickingDate",
        width: 150,
      },
      {
        headerName: "Territory Name",
        field: "TerritoryName",
        width: 230,
      },
      {
        headerName: "TO Name",
        field: "territoryOfficerName",
        width: 250,
      },
      {
        headerName: "Invoice(s)",
        field: "salesInvoiceNos",
        width: 350,
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

    this.getMaster();
    this.LoadAllDropdown();

    this.fDate.setDate(this.fDate.getDate() - 0);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.loadListData();
  }
  fDate: Date = new Date();
  tDate: Date = new Date();

  loadListData() {
    this.salesinvoiceService.SalSpGetAllPickingJson(this.commonService.DateFormat(this.fDate), this.commonService.DateFormat(this.tDate)).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    });
  }

  ////////////////////////////////// Ag Grid Data Load/////////////////////////////////
  private selectedRows = [];
  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    this.commonService.agButtonClicked = "";
    if (data == "edit") {
      this.toastrService.info("Permission Denied!!", "Message");
      //this.agEdit(event);
      //this.show = false;
    } else if (data == "view") {
      this.toastrService.info("Permission Denied!!", "Message");
      //this.agEdit(event);
      //this.show = false;
      //this.disabled = true;
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      this.agDelete(event);
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }



  private agDelete(event) {


    // before delete u must be check it alread has a Dispatch.
    // this.toastrService.danger("Permission denied!!.", "Warning");
    // return false;
    if (confirm('Are suer to delete?')) {
      let pickingMasterId = event.node.data.pickingMasterId;
      this.salesinvoiceService
        .DeleteSalesPicking(pickingMasterId)
        .subscribe((returns: any) => {
          if (returns.success) {
            this.toastrService.success(this.commonService.deletedmsg, "Warning");
            this.loadListData();
          }
        });
    }
  }

  private agReport(event) {
    // this.getReportData(event.data.pickingMasterId);
    // this.generateReport1(event.data.pickingMasterId, "print");
    this.getReportData(event.data.pickingMasterId, 'Pdf');
  }

  public generateReport1(collectionMasterId, buttonAction: any) {
    var fileName = this.pageNavigation + ".pdf";
    //this.getReportData(collectionMasterId);
    const content = document.getElementById("reportHeader");
    this.generateReport(buttonAction, fileName, content, this.datalength);
  }

  public LoadTerritoryWise() {
    // this.salesinvoiceService
    //   .GetSalesInvoiceMasterListByStatusandTerritory(1, id)
    //   .subscribe((returns: any) => {
    //     if (returns.success) {
    //       console.log('LoadTerritoryWise', returns.data);
    //       this.master.lstMasterViewModel = returns.data;
    //     }
    //   });
    debugger;
    if (this.master.areaSelected == undefined || this.master.areaSelected == null) {
      this.toastrService.warning("Please select a Area.", "Message")
      return
    }

    this.GetSalesInvoiceMasterListByTerritory();
  }

  LoadAllDropdown() {
    this.loadApprovalStatusList();
    this.getAllArea();
    //this.getterritorybyareaCode();
    this.GetTransactionType();
  }

  totalRows: number = 0;
  GetSalesInvoiceMasterListByTerritory() {
    //this.commonService.valueSet("create");

    this.master.lstMasterViewModel = null;
    this.totalRows = 0;
    this.isDisabled = true;
    this.salesinvoiceService
      .GetSalesInvoiceMasterListByStatusJson(1, this.master.territoryid, this.master.transactionTypeId, this.master.areaCode)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.isDisabled = false;
          this.totalRows = returns.data.length;
          if (this.totalRows == 0) this.toastrService.warning("No Invoice Found!", "info");
          //console.log('returns.data', returns.data);
          this.master.lstMasterViewModel = returns.data;
        }
        else {
          this.isDisabled = false;
          this.toastrService.warning(returns.message, "Warning");
        }
      });
  }

  salesInvoiceId = 0;
  grandTotal = 0;
  salesInvoiceNo = '';
  salesInvoiceDate = '';
  partyName = '';
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
  GetSalesInvoiceDetails(salesInvoiceId: number) {
    this.salesinvoiceService
      .GetSalesInvoiceDetailsByIdForApproval(salesInvoiceId)
      .subscribe((data: any) => {
        if (data.success) {
          //console.log(data.data);

          this.SalesModel = data.data;
          this.salesInvoiceId = data.data[0].salesInvoiceId;
          this.grandTotal = data.data[0].grandTotal;
          this.salesInvoiceNo = data.data[0].salesInvoiceNo;
          this.salesInvoiceDate = data.data[0].salesInvoiceDate;
          this.partyName = data.data[0].partyName;
          this.mobileNo = data.data[0].mobileNo;

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

    this.SalesModel[index].total =
      totalPrice + vat + ait - discountAmount;
    this.calculateGrandTotal();
  }
  calculateGrandTotal() {
    this.grandTotal = 0;
    this.SalesModel.forEach((row) => {
      this.grandTotal += row.total == "" ? 0 : row.total;
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
    this.salesinvoiceService
      .UpdateSalesInvoiceDetails(this.SalesModel)
      .subscribe((returns: any) => {
        if (returns.success) {
          //this.master.lstMasterViewModel = returns.data;
          this.toastrService.success(returns.message, 'Message');

          this.GetSalesInvoiceMasterListByTerritory();
        }
        else {
          this.toastrService.warning(returns.message, 'Warning');
        }
      });
  }

  msg = "";
  names: any;
  ViewDetails(dialog: TemplateRef<any>, salesInvoiceId: number) {
    debugger;
    this.GetSalesInvoiceDetails(salesInvoiceId);

    this.dialogService.open(dialog, {
      context: [],
    });
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

  public datalength: number;
  private getReportData(pickingMasterId: number, reportFormat: any = '') {
    if (reportFormat != '') {
      this.apiUrl = `SalesInvoiceReport/GetPickingReportById?reportFormat=${reportFormat}&pickingMasterId=${pickingMasterId}`;
      let apiUrl2 = `SalesInvoiceReport/GetSalesInvoicesReportByPickingMasterId?reportFormat=${reportFormat}&pickingMasterId=${pickingMasterId}`;

      forkJoin([
        this.commonService.GetCrystalReportData(this.apiUrl),
        this.commonService.GetCrystalReportData(apiUrl2)

        // this.salesinvoiceService.GetPicingItemSummary(pickingMasterId, reportFormat),
        // this.salesinvoiceService.GetPicingInvoiceDetails(pickingMasterId, reportFormat)
      ]).subscribe(([returns, invoices]) => {
        let res = JSON.parse(invoices);
        let res2 = JSON.parse(returns);

        if (res.status) {
          this.commonService.GenerateBase64ToReport(res.data[0].data);
          this.commonService.GenerateBase64ToReport(res2.data[0].data);
        } else {
          this.toastrService.warning("Message", this.commonService.nodatafound);
          console.log("res=", res);
          console.log("res2=", res2);
        }
      });
    }
    else {

      this.bodyData = [];
      this.apiUrl = `SalesInvoice/GetSalesPickingSummaryByMasterIdJson?pikingMasterId=${pickingMasterId}`;
      this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
        if (returns.success) {
          console.log(returns);
          this.datalength = returns.data.length * 50;
          this.bodyData = returns.data;
          this.pickingNo = returns.data[0].pickingNo;
          this.PickingDate = returns.data[0].pickingDate;
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });

      this.apiUrl1 = `SalesInvoice/GetSalesPickingDetailByMasterIdJson?pikingMasterId=${pickingMasterId}`;
      this.commonService.getReportData(this.apiUrl1).subscribe((returns: any) => {
        if (returns.success) {
          console.log(returns.data);
          this.bodyData1 = returns.data;
        } else {
          this.toastrService.danger("Message", this.commonService.nodatafound);
        }
      });
    }
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
          startY: legend.height + 20,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
          bodyStyles: {
            fillColor: [255, 255, 255],
            //textColor: 50,
            textColor: [0, 0, 0],
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });
        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 60,
          styles: { font: "Meta" },
          bodyStyles: {
            fillColor: [255, 255, 255],
            //textColor: 50,
            textColor: [0, 0, 0],
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });
        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 120,
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
            //textColor: 50,
            textColor: [0, 0, 0],
          },
          columnStyles: {
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
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
            //textColor: 50,
            textColor: [0, 0, 0],
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
            //textColor: 50,
            textColor: [0, 0, 0],
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