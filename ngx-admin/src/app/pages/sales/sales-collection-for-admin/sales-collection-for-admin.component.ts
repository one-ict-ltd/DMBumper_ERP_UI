import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from "@angular/core";
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
import { SalesDistributionService } from "app/services/sales/sales-distribution.service";

import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import { DatePipe } from "@angular/common";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { DialogNamePromptComponent } from "app/pages/client/dialog-name-prompt/dialog-name-prompt.component";
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";
import { BillcollectionService } from "app/services/sales/billcollection.service";


import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { CommoncomboService } from "app/services/commoncombo.service";

@Component({
  selector: 'ngx-sales-collection-for-admin',
  templateUrl: './sales-collection-for-admin.component.html',
  styleUrls: ['./sales-collection-for-admin.component.scss']
})
export class SalesCollectionForAdminComponent implements OnInit {


  //public tableHeader = ["#", "Picking Number", "Dispatch Number", "Invoice No", "Invoice Date", "Party Name", "Bonus/Discount", "Amount"];
  public tableHeader = ["#", "Invoice Date", "Invoice No.", "Customer", "Incentive", "Discount", "VAT Adjust", "Collection Amount", "Collection + VAT Adj. Amount"];

  protected options: {};
  protected cd: ChangeDetectorRef;
  showMessages: any = {};
  public apiUrl = "";
  public collectionNo = "";
  public collectionDate = "";
  public collectionAmount = 0.00;
  public collectionRemarks = "";
  public collectionAmountInWord = "";
  public bodyData: any = [];
  public bodyDatashow: any = [];
  errors: string[];
  disabled: boolean = false;
  disabledNew: boolean = false;
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

  show: boolean = true;
  showChk: boolean = true;
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

  public pageNavigation = "Sales Collections For Admin";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.disabledNew = false;
      //this.GetSalesInvoiceListfromDispatch();
      debugger;
      if (this.PaymentModeList.length > 0) {
        this.master.paymentModeId = this.PaymentModeList[1].id;
        this.master.PaymentModeSelected = { id: this.PaymentModeList[1].id, name: this.PaymentModeList[1].name }
        this.ChangePaymentMode();
      }
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      //this.GetSalesInvoiceListfromDispatch();
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      if (this.ValidationForSave() == false) {
        this.commonService.valueSet("create");
        return;
      };
      this.save();
      //this.commonService.valueSet("create");
    } else if (this.commonService.buttonClicked == "update") {
      if (this.ValidationForSave() == false) {
        this.commonService.valueSet("create");
        return;
      };
      this.save();
      // this.commonService.valueSet("create");
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      //this.GetSalesInvoiceListfromDispatch();
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
      this.toastrService.info("Edit Button Click.", "Message")
    }
  }

  master: {
    collectionMasterId: number;
    distributionMasterId: number;
    employeeId: number;
    partyId: number;
    transactionTypeId: number;
    paymentModeId: number;
    moneyReceiptId: number;
    collectionAmount: number;
    collectionAmountInput: number;
    dues: number;
    ttlBonus: number;
    collectionDate: Date;
    approvalStatus: string;
    bankName: string;
    branchName: string;
    chequeNo: string;
    chequeDate: Date;
    collectionNumber: string;
    address: string;
    partyType: string;
    terrytory: string;
    terrOfficer: string;
    depot: string;
    remarks: string;
    lstDetailsViewModel: any[];
    lstProductListViewModel: any[];
    EmployeeSelected: {};
    PaymentModeSelected: {};
    transactionTypeSelected: {};
    partySelected: {};
    territoryCode: string;
    moneyReceiptNo: string;
    paymentMode: string;
    territoryName: string;

    territorySelected: {};
    moneyReceiptSelected: {};
  };

  public getMaster() {
    this.master = {
      collectionMasterId: 0,
      distributionMasterId: 0,
      employeeId: 0,
      partyId: 0,
      transactionTypeId: 0,
      paymentModeId: 0,
      moneyReceiptId: 0,
      dues: 0,
      ttlBonus: 0,
      collectionAmount: 0,
      collectionAmountInput: null,
      approvalStatus: "",
      chequeNo: "",
      collectionNumber: "",
      address: "",
      partyType: "",
      terrytory: "",
      terrOfficer: "",
      depot: "",
      remarks: "",
      bankName: "",
      branchName: "",
      lstDetailsViewModel: [],
      lstProductListViewModel: [],
      collectionDate: new Date(this.currentDate),
      chequeDate: null,
      EmployeeSelected: null,
      PaymentModeSelected: null,
      transactionTypeSelected: null,
      partySelected: null,


      paymentMode: "",
      territoryName: "",
      territoryCode: "",
      moneyReceiptNo: "",
      territorySelected: null,
      moneyReceiptSelected: null,
    };
    //this.GetSalesInvoiceListfromDispatch();
    //this.ChangeNumber();
    this.billcollectionService.GetMaxSalesCollectionNumber(this.commonService.DateFormat(this.master.collectionDate)).subscribe((retuns: any) => {
      if (retuns.success) {
        this.master.collectionNumber = retuns.data[0].MaxNo;
        //console.log(this.LeaveTypeList);
      }
    });
    this.partyList = [];
    this.MoneyReceiptDetails = "";
    //this.getServerDateTime();
  }

  partyList = [];
  GetAllPartysForDepot(territoryCode: any) {

    this.partyList = [];
    this.master.partyId = 0;
    this.master.partySelected = null;

    this.master.lstDetailsViewModel = [];
    this.TerritoryDetails = "";
    this.master.depot = "";
    this.master.terrOfficer = "";
    this.master.terrytory = "";
    this.master.partyType = "";
    this.master.address = "";
    this.TerritoryDetails = "";

    debugger;

    this.GetAllPendingMoneyRecipts();

    this.salesinvoiceService
      .GetPartybyTerritoryCodeForCollection(territoryCode)
      .subscribe((returns: any) => {
        this.partyList = returns.data.map((val: any) => ({
          id: val.partyId,
          name: val.partyName,
          address: val.address,
          mobileNo: val.mobileNo,
          terrytory: val.terrytory,
          terrOfficer: val.terrOfficer,
          partyType: val.partyType,
          depot: val.depot,
        }));
      });

  }

  TerritoryDetails: string = "";
  public GetPartyDetails() {
    //this.master.collectionAmountInput = null;

    if (this.master.partySelected == null) {
      this.TerritoryDetails = "";
      this.master.depot = "";
      this.master.terrOfficer = "";
      this.master.terrytory = "";
      this.master.partyType = "";
      this.master.address = "";
      this.TerritoryDetails = "";
    }
    else {
      this.TerritoryDetails = "";
      this.master.depot = this.master.partySelected["depot"];
      this.master.terrOfficer = this.master.partySelected["terrOfficer"];
      this.master.terrytory = this.master.partySelected["terrytory"];
      this.master.partyType = this.master.partySelected["partyType"];
      this.master.address = this.master.partySelected["address"];
      this.TerritoryDetails = this.master.partySelected["territoryDetails"];
    }
    //console.log(this.TerritoryDetails, this.master.partySelected);
    this.GetSalesInvoiceListfromDispatch();
  }

  MoneyReceiptDetails: string = '';
  public MoneyReceiptList = [];
  public GetAllPendingMoneyRecipts() {
    this.MoneyReceiptList = [];
    this.MoneyReceiptDetails = "";
    this.master.moneyReceiptSelected = null;
    this.billcollectionService.GetAllPendingMoneyRecipts(this.master.territoryCode, this.mioCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.MoneyReceiptList = retuns.data.map((val: any) => ({
          id: val.moneyReceiptId,
          name: val.moneyReceiptNo,
          amount: val.amount,
          bankName: val.bankName,
          branchName: val.branchName,
          trxNo: val.trxNo,
          chequeNo: val.chequeNo,
          chequeDate: val.chequeDate,
          paymentMode: val.paymentMode,
          paymentModeId: val.paymentModeId,
          moneyReceiptDate: val.moneyReceiptDate,
        }));
        //console.log(this.LeaveTypeList);
      }
    })
  }

  changeMoneyRecipt(event: any) {
    debugger;
    this.MoneyReceiptDetails = '';
    if (this.master.moneyReceiptSelected != (undefined || {} || null)) {
      this.master.moneyReceiptId = this.master.moneyReceiptSelected['id'];
      this.master.moneyReceiptNo = this.master.moneyReceiptSelected['name'];
      this.master.collectionAmountInput = this.master.moneyReceiptSelected['amount'];
      this.master.paymentModeId = this.master.moneyReceiptSelected['paymentModeId'];
      this.master.paymentMode = this.master.moneyReceiptSelected['paymentMode'];
      this.master.bankName = this.master.moneyReceiptSelected['bankName'];
      this.master.branchName = this.master.moneyReceiptSelected['branchName'];
      this.master.chequeNo = this.master.moneyReceiptSelected['chequeNo'];
      this.master.chequeDate = this.commonService.DateFormat(this.master.moneyReceiptSelected['chequeDate']);

      this.MoneyReceiptDetails = `MR No.: ${this.master.moneyReceiptNo};  Mode: ${this.master.paymentMode};  Money Receipt Date: ${this.commonService.DateFormat(this.master.moneyReceiptSelected['moneyReceiptDate'])};  ${this.master.bankName}, ${this.master.branchName}, ${this.master.moneyReceiptSelected['trxNo']}`;
      console.log(this.master.moneyReceiptSelected);
    }
  }


  public EmployeeList = [];
  public getEmployee() {
    this.master.EmployeeSelected = null;
    this.employeeinformationService.GetEmployeeBasicInfoById(0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.EmployeeList = retuns.data.map((val: any) => ({
          id: val.employeeId,
          name: val.fullName + '-' + val.employeeNo,
        }));
        //console.log(this.LeaveTypeList);
      }
    })
  }

  public ChangePaymentMode() {
    this.master.bankName = "";
    this.master.branchName = "";
    this.master.chequeNo = "";
    this.master.chequeDate = null;

    // if (this.master.paymentModeId == 1) {
    if (this.master.paymentModeId != 2) {
      this.showChk = false;
    } else {
      this.showChk = true;
    }
  }

  public PaymentModeList = [];
  public getPaymentMode() {
    this.PaymentModeList = [];
    this.master.paymentModeId = 0;
    this.master.PaymentModeSelected = null;
    this.billcollectionService.getpaymentMode().subscribe((retuns: any) => {
      if (retuns.success) {
        this.PaymentModeList = retuns.data.map((val: any) => ({
          id: val.paymentModeId,
          name: val.paymentMode,
        }));
      }
    })
  }

  transactionTypeList = [];
  public GetTransactionType() {

    this.billcollectionService.GetTransactionType(0).subscribe(
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

  mioList = [];
  mioSelected: {};
  mioCode = "";
  public GetAllMIOByTerritory() {
    this.mioCode = "";
    this.mioSelected = null;
    this.comboService
      .GetAllMIOByTerritory(this.master.territoryCode)
      .subscribe((returns: any) => {
        if (returns.status) {
          this.mioList = returns.data.map((val: any) => ({
            id: val.employeeNo,
            name: val.mioName,
          }));
        }
      });
  }

  ChangeNumber() {
    this.billcollectionService.GetMaxSalesCollectionNumber(this.commonService.DateFormat(this.master.collectionDate)).subscribe((retuns: any) => {
      if (retuns.success) {
        this.master.collectionNumber = retuns.data[0].MaxNo;
        //console.log(this.LeaveTypeList);
      }
    });
    //if (this.master.partyId > 0)
    this.GetPartyDetails();
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

  checkedChildCount: number = 0;
  ValidationForSave(): boolean {
    // let duplicateMRNo = 0;
    // this.apiUrl = `SalesCollection/GetMoneyReceiptNoStatus?moneyReceiptNo=${this.master.moneyReceiptNo}`;
    // this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
    //   if (returns.success) {
    //     //console.log(returns);
    //     duplicateMRNo = returns.data[0].status;
    //     //console.log("duplicateMRNo", duplicateMRNo);
    //     if (duplicateMRNo == 0) {
    //       debugger;
    //       this.toastrService.warning("This Money Receipt No. already exist!", "Message");
    //       return false;
    //     }
    //     else {
    //       this.save();
    //     }
    //   }
    // });

    //console.log("duplicateMRNoStatus", (duplicateMRNo == 0));

    if (this.isInvoiceDateOverLap == 1) {
      // debugger;
      this.toastrService.warning(`Invoice date of Invoice No. ${this.OverLapInvoiceNo} bigger than collection date. This is not allowed !`, "Message");
      return false;
    }

    if (this.master.lstDetailsViewModel.length > 0) {
      debugger;
      this.master.lstDetailsViewModel.forEach(element => {
        //console.log('element.isSelect', element);
        if (element.isSelect && this.master.collectionMasterId == 0) {
          let collAmnt = (element.collectionAmount == null ? 0 : element.collectionAmount) + (element.vatAdjustment == null ? 0 : element.vatAdjustment)
          //console.log('collAmnt', collAmnt);
          if (collAmnt == null ? 0 : collAmnt <= 0) {
            //element.isSelect = false;
            this.toastrService.warning(`Amount is zero (0)! Please unchecked this invoice (${element.salesInvoiceNo}) number.`, "Message");
            return false;
          }
        }
      });
    }

    debugger;
    if (this.master.moneyReceiptNo.trim() == "") {
      // debugger;
      this.toastrService.warning("Money Receipt No. is empty.", "Message");
      return false;
    }

    else if (this.master.moneyReceiptSelected == (undefined || {} || null)) {
      // 
      this.toastrService.warning("Select a Money Receipt No.", "Message");
      //return false;
    }
    // else if (this.master.partyId == 0 || this.master.partyId == null) {
    //   //this.toastrService.warning("Customer name is empty!", "Message");
    //   // return false;
    // }
    else if (this.master.paymentModeId == null || this.master.paymentModeId == 0) {
      this.toastrService.warning("Please Select a Payment Mode!", "Message");
      return false;
    }
    else if (this.checkedChildCount == 0) {
      this.toastrService.warning("Minimum one collection required!", "Message");
      return false;
    }
    else if (
      this.master.collectionAmountInput != (this.master.collectionAmount)) {
      this.toastrService.warning("Collection Amount & Total Collection Amount must be equal!", "Message");
      // this.commonService.valueSet("create");
      return false;
    }
    else if (
      this.master.collectionAmount == 0 && this.master.collectionMasterId == 0) {
      this.toastrService.warning("Total Collection amount must be greater than zero!", "Message");
      // this.commonService.valueSet("create");
      return false;
    }
    else if (
      this.master.collectionAmountInput == null || this.master.collectionAmountInput <= 0) {
      this.toastrService.warning("Total Collection input amount must be greater than zero!", "Message");
      // this.commonService.valueSet("create");
      return false;
    }

    return true;
    //return false;
  }

  private save() {
    //console.log(this.master);
    this.master.collectionDate = this.commonService.DateFormat(this.master.collectionDate);

    var button = this.commonService.buttonClicked;
    this.show = true;
    this.salesinvoiceService
      .SaveCollectionInvoiceFormDispatch_v2(this.master)
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

          //this.commonService.valueSet("showlist");
          //this.GetSalesInvoiceListfromDispatch();
          this.GetGridData();
        }
        else {
          this.toastrService.warning(this.commonService.failedmsg, "Message");
        }
      });
    this.getMaster();
    /*
    let duplicateMRNo = 0;
    this.apiUrl = `SalesCollection/GetMoneyReceiptNoStatus?moneyReceiptNo=${this.master.moneyReceiptNo}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        //console.log(returns);
        duplicateMRNo = returns.data[0].status;
        //console.log("duplicateMRNo", duplicateMRNo);
        if (duplicateMRNo == 0 && this.master.collectionMasterId == 0) {
          // debugger;
          this.commonService.valueSet("create");
          this.toastrService.warning("This Money Receipt No. already exist!", "Message");
          return false;
        }
        else {
          this.master.collectionDate = this.commonService.DateFormat(this.master.collectionDate);

          var button = this.commonService.buttonClicked;
          this.show = true;
          this.salesinvoiceService
            .SaveCollectionInvoiceFormDispatch_v2(this.master)
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

                this.getMaster();
                //this.commonService.valueSet("showlist");
                this.GetSalesInvoiceListfromDispatch();
              }
              else {
                this.toastrService.success(this.commonService.failedmsg, "Message");
              }
            });
        }
      }
    }); 
    */
  }

  private reset() {
    this.getMaster();

    this.loadFromDateShow.setDate(new Date().getDate() - 15);
  }

  //////////////////////////////// End CRUD /////////////////////////////////////////

  onRefesh() {
    this.selectedRow = "";
    this.ngOnInit();
    //this.onGridReady;
    this.toastrService.warning("warning", this.commonService.warningmsg);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.billcollectionService.getBillCollection_v2(0).subscribe((data: any) => {
    //   if (data.success) {
    //     this.rowData = data.data;
    //   }
    // });
    this.GetGridData();
  }


  loadFromDateShow: Date = new Date();
  loadToDateShow: Date = new Date();
  GetGridData() {
    this.billcollectionService.getBillCollection_v2(0, this.commonService.DateFormat(this.loadFromDateShow), this.commonService.DateFormat(this.loadToDateShow)).subscribe((data: any) => {
      if (data.success) {
        this.rowData = data.data;
      }
    });
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
    private comboService: CommoncomboService,
    private toastrService: NbToastrService,
    // private SalesDistributionService: SalesDistributionService,
    // private fieldforcemasterService: FieldforcemasterService,
    // private datePipe: DatePipe,
    private employeeinformationService: EmployeeinformationService,
    private billcollectionService: BillcollectionService,
    protected dateService: NbDateService<Date>,
    private salesinvoiceService: SalesinvoiceService
  ) {
    this.commonService.valueSet("showlist");
    this.getServerDateTime();

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
        headerName: "Collection No.",
        field: "collectionNumber",
        width: 160,
      },
      {
        headerName: "Money Receipt No.",
        field: "moneyReceiptNo",
        width: 190,
      },
      {
        headerName: "Collection Date",
        field: "collectionDate",
        width: 160,
      },
      {
        headerName: "Amount",
        field: "collectionAmount",
        width: 120,
        valueFormatter: (params) =>
          this.currencyFormatter(params.data.collectionAmount),
        type: "rightAligned",
      },
      {
        headerName: "Party Name",
        field: "partyName",
        width: 250,
      },
      {
        headerName: "Territory Name",
        field: "territoryName",
        width: 200,
      },
      {
        headerName: "Remarks",
        field: "remarks",
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
    };


    this.getMaster();
    this.LoadAllDropdown();
    this.loadFromDateShow.setDate(new Date().getDate() - 0);
  }

  minDate: Date = new Date();
  maxDate: Date = new Date();
  currentDate: Date = new Date();
  getServerDateTime() {
    let apiUrl = `menu/getServerDateTime`;
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        //console.log(returns);
        this.currentDate = new Date(returns.data[0].currentDate);
        this.minDate = this.dateService.addDay(new Date(returns.data[0].minCDate), -180);
        this.maxDate = this.dateService.addDay(new Date(returns.data[0].maxCDate), 45);
      } else {
        this.currentDate = new Date();
        this.minDate = new Date();
        this.maxDate = new Date();
      }
    });
  }
  ////////////////////////////////// Ag Grid Data Load /////////////////////////////////
  private selectedRows = [];
  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    if (data == "edit") {
      this.show = false;
      this.disabledNew = true;
      this.agEdit(event);
    } else if (data == "view") {
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      this.agDelete(event);
    }
    else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }


  agEdit(event) {
    //this.toastrService.info("Comming soon", "Message");
    debugger;

    //collectionMasterId	collectionNumber	salesInvoiceId	collectionAmount	collectionDate	isActive	remarks	salesInvoiceNo	address	partyId	partyName	mobileNo	moneyReceiptNo	territoryCode	territoryName	paymentModeId	paymentMode	bankName	branchName	chequeNo	chequeDate


    console.log('agEdit', event);

    this.master.territoryCode = event.node.data.territoryCode;
    this.master.territoryName = event.node.data.territoryName;
    this.GetAllPendingMoneyRecipts();
    // this.GetAllPartysForDepot(this.master.territoryCode);


    this.master.collectionMasterId = event.node.data.collectionMasterId;

    // debugger;
    this.master.partyId = event.node.data.partyId;
    this.master.collectionDate = new Date(event.node.data.collectionDate);

    this.master.territorySelected = { id: event.node.data.territoryCode, name: event.node.data.territoryName };

    this.master.moneyReceiptNo = event.node.data.moneyReceiptNo;
    this.master.moneyReceiptId = event.node.data.moneyReceiptId;
    this.master.collectionAmountInput = event.node.data.collectionAmount;
    this.master.moneyReceiptSelected = {
      // id: event.node.data.moneyReceiptId,
      // name: event.node.data.moneyReceiptNo,
      // amount: event.node.data.collectionAmount
      id: event.node.data.moneyReceiptId,
      name: event.node.data.moneyReceiptNo,
      amount: event.node.data.collectionAmount,
      bankName: event.node.data.bankName,
      branchName: event.node.data.branchName,
      trxNo: event.node.data.trxNo,
      chequeNo: event.node.data.chequeNo,
      chequeDate: new Date(event.node.data.chequeDate),
      paymentMode: event.node.data.paymentMode,
    };

    this.master.collectionNumber = "";
    this.master.collectionNumber = event.node.data.collectionNumber;
    this.master.collectionAmount = event.node.data.collectionAmount;
    this.master.remarks = event.node.data.remarks;
    this.master.address = event.node.data.address;

    this.master.paymentModeId = event.node.data.paymentModeId;
    this.master.paymentMode = event.node.data.paymentMode;
    this.master.bankName = event.node.data.bankName;
    this.master.branchName = event.node.data.branchName;
    this.master.chequeNo = event.node.data.chequeNo;
    this.master.chequeDate = this.commonService.DateFormat(event.node.data.chequeDate);

    this.master.PaymentModeSelected = { id: event.node.data.paymentModeId, name: event.node.data.paymentMode };

    var selectedParty: any[];

    this.salesinvoiceService.GetPartybyTerritoryCodeForCollection(this.master.territoryCode).subscribe((returns: any) => {
      if (returns.status) {
        this.partyList = returns.data.map((val: any) => ({
          id: val.partyId,
          name: val.partyName,
          address: val.address,
          mobileNo: val.mobileNo,
          terrytory: val.terrytory,
          terrOfficer: val.terrOfficer,
          partyType: val.partyType,
          depot: val.depot,
        }));


        // selectedParty = returns.data.filter(function (item) {
        //   return item.partyId == this.master.partyId;
        // });

        selectedParty = returns.data.filter((obj) => {
          return obj.partyId === this.master.partyId;
        });

        //console.log('selectedParty', selectedParty);
        //debugger;

        if (selectedParty.length > 0) {
          this.TerritoryDetails = "";
          this.master.depot = selectedParty[0].depot;
          this.master.terrOfficer = selectedParty[0].terrOfficer;
          this.master.terrytory = selectedParty[0].terrytory;
          this.master.partyType = selectedParty[0].partyType;
          this.master.address = selectedParty[0].address;
          this.TerritoryDetails = selectedParty[0].territoryDetails;

          this.master.partySelected = {
            id: selectedParty[0].partyId
            , name: selectedParty[0].partyName
            , depot: selectedParty[0].depot
            , terrOfficer: selectedParty[0].terrOfficer
            , terrytory: selectedParty[0].terrytory
            , partyType: selectedParty[0].partyType
            , address: selectedParty[0].address
            , territoryDetails: selectedParty[0].territoryDetails
          };
        }

        this.GetSalesInvoiceListfromDispatch();
        //this.GetPartyDetails();
      }
    });

    console.log('this.master', this.master);
  }

  agDelete(event) {
    if (confirm(`Are you sure to delete this [ ${event.data.collectionNumber} ]?`)) {
      let collectionMasterId = event.node.data.collectionMasterId;

      this.billcollectionService.DeleteSalesCollectionByMasterId(collectionMasterId).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.deletedmsg, "Message");
          this.GetGridData();
        }
        else {
          this.toastrService.warning(this.commonService.deleteFailedMsg, "Message");
        }
      });
    }
  }

  private agReport(event) {
    // debugger
    // this.getReportData(event.data.collectionMasterId);
    // this.generateReport1(event.data.collectionMasterId, "print");
    this.generateCrReport("Pdf", event.data.collectionMasterId);
  }



  //apiUrl: any = ""
  generateCrReport(reportFormat: any, collectionMasterId: any) {
    // debugger;

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `SalesInvoiceReport/GetSalesCollectionReportById?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&salesCollectionId=${collectionMasterId}`;

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


  private getReportData(collectionId) {
    this.bodyData = [];

    this.sTtlBonus = 0;
    this.incentiveAmount = 0;
    this.ttlvatAdjustment = 0;
    this.ttlincentiveAmount = 0;
    this.sTtlCollectionAmount = 0;
    this.sTtlVatAndCollectionAmount = 0;

    this.apiUrl = `SalesCollection/GetSalesCollectionByIdJson_v2?collectionId=${collectionId}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        //console.log(returns.data);
        this.datalength = returns.data.length * 50;
        this.bodyData = returns.data;
        this.collectionNo = returns.data[0].collectionNumber;
        this.collectionDate = returns.data[0].collectionDate;
        this.collectionAmount = returns.data[0].collectionAmount;
        this.collectionRemarks = returns.data[0].remarks;
        this.moneyReceiptNo = returns.data[0].moneyReceiptNo;
        this.partyName = returns.data[0].partyName;
        this.territoryName = returns.data[0].territoryName;
        this.territoryOfficer = returns.data[0].territoryOfficer;
        this.collectionAmountInWord = returns.data[0].collectionAmountInWord + " Taka.";

        this.bodyData.forEach(e => {
          this.sTtlBonus += e.bonusAmount;
          this.ttlincentiveAmount += e.incentiveAmount;
          this.ttlvatAdjustment += e.vatAdjustment;
          this.sTtlCollectionAmount += e.Amount;
          this.sTtlVatAndCollectionAmount += e.ttlVatAndCollection;
        });

      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }


  public generateReport1(collectionMasterId, buttonAction: any) {
    var fileName = this.pageNavigation + ".pdf";
    //this.getReportData(collectionMasterId);
    const content = document.getElementById("reportHeader");
    this.generateReport(buttonAction, fileName, content, this.datalength);
  }

  LoadAllDropdown() {
    this.getPaymentMode();
    this.getAllTerritory();
    this.GetTransactionType();
    //this.GetAllPartysForDepot(0);
    //this.loadApprovalStatusList();
  }

  territoryList: any = [];
  getAllTerritory() {
    this.territoryList = [];
    this.salesinvoiceService
      .GetAllTerritoryForDepot()
      .subscribe((returns: any) => {
        if (returns.success) {
          //console.log(returns.data);
          this.territoryList = returns.data.map((val: any) => ({
            id: val.TerritoryCode,
            name: val.TerritoryName,
          }));

          this.CalculateSummary();
        }
      });
  }


  CalculateSummary_BAK() {
    this.checkedChildCount = 0;
    this.master.collectionAmount = 0.00;
    let ttlInvoiceAmount: number = 0.00;
    //let ttlDueAmount: number = 0.00;
    let ttlPaid: number = 0.00;
    this.master.dues = 0.00;
    let ttlBonusDiscount: number = 0.00;
    let ttlCollectionAmount: number = 0.00;
    // debugger;
    this.master.lstDetailsViewModel.forEach((element, i) => {

      ttlInvoiceAmount += element.grandTotal == null ? 0 : element.grandTotal;
      //ttlDueAmount += element.dueAmount;
      ttlPaid += element.paidAmount == null ? 0 : element.paidAmount;

      if (element.isSelect) {
        this.checkedChildCount++;
        ttlBonusDiscount += element.bonusDiscount == null ? 0 : element.bonusDiscount;
        ttlCollectionAmount += (element.collectionAmount == null ? 0 : element.collectionAmount) + (element.vatAdjustment == null ? 0 : element.vatAdjustment);

        this.master.lstDetailsViewModel[i].balanceAmount = Math.round((element.dueAmount == null ? 0 : element.dueAmount)
          - (
            (element.bonusDiscount == null ? 0 : element.bonusDiscount)
            + (element.vatAdjustment == null ? 0 : element.vatAdjustment)
            + (element.collectionAmount == null ? 0 : element.collectionAmount)
          )
        );
      }

      if (this.master.lstDetailsViewModel.length == i + 1) {
        this.master.dues = Math.round(ttlInvoiceAmount - (ttlPaid + ttlCollectionAmount + ttlBonusDiscount));
        this.master.collectionAmount = Math.round(ttlCollectionAmount);//Math.round(ttlCollectionAmount + ttlBonusDiscount);
        this.master.ttlBonus = Math.round(ttlBonusDiscount);
      }
    });
  }

  OverLapInvoiceNo: string = '';
  isInvoiceDateOverLap: number = 0;

  CalculateSummary() {
    this.checkedChildCount = 0;
    this.master.collectionAmount = 0.00;
    let ttlInvoiceAmount: number = 0.00;
    let ttlVatAdjustment: number = 0.00;
    //let ttlDueAmount: number = 0.00;
    let ttlPaid: number = 0.00;
    this.master.dues = 0.00;
    let ttlBonusDiscount: number = 0.00;
    let ttlCollectionAmount: number = 0.00;
    let ttlIncentiveAmount: number = 0.00;
    let ttlGrosReturnAmount: number = 0.00; // 18-May-2023

    // debugger;
    this.OverLapInvoiceNo = "";
    this.isInvoiceDateOverLap = 0;

    this.master.lstDetailsViewModel.forEach((element, i) => {

      ttlInvoiceAmount += element.grandTotal == null ? 0 : element.grandTotal;
      //ttlDueAmount += element.dueAmount;
      ttlPaid += (element.paidAmount == null ? 0 : element.paidAmount) -
        (element.collectionMasterId == 0 ? 0.00 : (
          (element.collectionAmount == null ? 0 : element.collectionAmount) +
          (element.bonusDiscount == null ? 0 : element.bonusDiscount)
          // +
          //   (element.vatAdjustment == null ? 0 : element.vatAdjustment)
        ));

      // debugger;
      if (element.isSelect) {

        this.checkedChildCount++;

        ttlBonusDiscount += element.bonusDiscount == null ? 0 : element.bonusDiscount;
        ttlIncentiveAmount += element.incentiveAmount == null ? 0 : element.incentiveAmount;

        ttlGrosReturnAmount += (element.grossReturn == null ? 0 : element.grossReturn); // 18-May-2023

        ttlCollectionAmount += (element.collectionAmount == null ? 0 : element.collectionAmount);
        ttlVatAdjustment += (element.vatAdjustment == null ? 0 : element.vatAdjustment);
        // debugger;
        this.master.lstDetailsViewModel[i].balanceAmount = Math.round(

          (element.dueAmount == null ? 0 : element.dueAmount) + // prevDues
          (element.collectionMasterId == 0 ? 0.00 : (
            (element.paidAmount == null ? 0 : element.paidAmount)
          ))
          //)
          - (
            (element.bonusDiscount == null ? 0 : element.bonusDiscount)
            + (element.incentiveAmount == null ? 0 : element.incentiveAmount) +
            (element.collectionAmount == null ? 0 : element.collectionAmount)
            + (element.vatAdjustment == null ? 0 : element.vatAdjustment)
          ))
          ;
      }
      //dueAmount
      if (this.master.lstDetailsViewModel.length == i + 1) {

        this.master.dues = Math.round(ttlInvoiceAmount - (
          ttlPaid
          + ttlCollectionAmount
          + ttlGrosReturnAmount // 18-May-2023
          + ttlBonusDiscount
          + ttlVatAdjustment
          + ttlIncentiveAmount
        ));

        this.master.collectionAmount = Math.round(ttlCollectionAmount
          //Math.round(ttlCollectionAmount + ttlBonusDiscount);
          + ttlVatAdjustment
        );

        this.master.ttlBonus = Math.round(ttlBonusDiscount
          + ttlIncentiveAmount
        );
      }



      if (new Date(element.salesInvoiceDate) > this.master.collectionDate) {
        this.isInvoiceDateOverLap = 1;
        this.OverLapInvoiceNo = element.salesInvoiceNo;
        //console.log('this.isInvoiceDateOverLap: ', this.isInvoiceDateOverLap)
        this.toastrService.warning(`Invoice date of Invoice No. ${this.OverLapInvoiceNo} bigger than collection date. This is not allowed !`, "Message");

      }

    });
  }

  gBalanceAmount: number = 0;
  gBonusDiscount: number = 0;
  oldCollectableAmt: number = 0;

  CalculateBonusDiscount(rowIndex: number, flag: any = "Auto") {
    let totaldiscount: number = 0;
    let totalcollectable: number = 0;
    let totaLWOVAT: number = 0;

    debugger;

    if (this.master.collectionMasterId > 0) this.ValueAssignInEdit(rowIndex);

    this.ValidationForVAT(rowIndex);

    if (flag == "Auto") {
      //let bonusAmount: number = 0.00;
      //let paidAmount: number = this.master.lstDetailsViewModel[index].paidAmount
      let collAmont: number = this.master.lstDetailsViewModel[rowIndex].collectionAmount == null ? 0 : this.master.lstDetailsViewModel[rowIndex].collectionAmount;
      //console.log("collAmont", collAmont);
      let percentValue: number = this.master.lstDetailsViewModel[rowIndex].percentValue;
      //console.log("percentValue", percentValue);
      totaLWOVAT = Math.round(this.master.lstDetailsViewModel[rowIndex].grandTotal)
        - Math.round(this.master.lstDetailsViewModel[rowIndex].totalVat)
        ;

      totaldiscount = Math.round(totaLWOVAT * this.master.lstDetailsViewModel[rowIndex].percentValue * 0.01) //+ Math.round(this.master.lstDetailsViewModel[rowIndex].incentiveAmount)
        ;

      totalcollectable = Math.round(totaLWOVAT - totaldiscount - Math.round(this.master.lstDetailsViewModel[rowIndex].incentiveAmountBak)
      );

      // let bonusDiscount: number = (totaldiscount * collAmont / totalcollectable); //Math.round(((collAmont == null ? 0 : collAmont) * (percentValue * 0.01)));
      // this.master.lstDetailsViewModel[rowIndex].bonusDiscount = Math.round(bonusDiscount); //Math.round(((collAmont == null ? 0 : collAmont) * ((percentValue == null ? 0 : percentValue) * 0.01)));


      let totalIncentive: number = this.master.lstDetailsViewModel[rowIndex].incentiveAmountBak;
      let totalInVOiceAmnt: number = this.master.lstDetailsViewModel[rowIndex].grandTotal;


      //this.master.lstDetailsViewModel[rowIndex].incentiveAmount = Math.round(totalIncentive * collAmont / totalcollectable);

      this.master.lstDetailsViewModel[rowIndex].incentiveAmount = Math.round(this.checkIncentiveAmt * (collAmont / this.checkCollectionAmt));
      this.master.lstDetailsViewModel[rowIndex].bonusDiscount = Math.round(this.checkBonusDiscountAmt * (collAmont / this.checkCollectionAmt));


      //console.log("bonusDiscount", bonusDiscount);
      //this.master.lstDetailsViewModel[index].dueAmount = Math.round(this.master.lstDetailsViewModel[index].grandTotal - ((collAmont == null ? 0 : collAmont) + bonusDiscount + this.master.lstDetailsViewModel[index].paidAmount));
    }
    else {
      // do something here if needed.
    }

    //this.ValidationForVAT(rowIndex);
    //#region 
    let duesVat: number = this.master.lstDetailsViewModel[rowIndex].duesVat;
    let vatAdjustment: number = this.master.lstDetailsViewModel[rowIndex].vatAdjustment == null ? 0 : this.master.lstDetailsViewModel[rowIndex].vatAdjustment;
    if (duesVat > 0) {
      if (duesVat > vatAdjustment) {
        //this.master.lstDetailsViewModel[rowIndex].collectionAmount = 0;
        // this.master.lstDetailsViewModel[rowIndex].collectionAmount = null;
        // this.master.lstDetailsViewModel[rowIndex].collectionAmount = "";
        // this.master.lstDetailsViewModel[rowIndex].bonusDiscount = null;
        //this.master.lstDetailsViewModel[rowIndex].collectionAmount.isEnable = 0;
        //this.master.lstDetailsViewModel[rowIndex].balanceAmount = this.master.lstDetailsViewModel[rowIndex].dueAmount;
        //this.master.lstDetailsViewModel[rowIndex].vatAdjustment = null;

        this.toastrService.warning("Please adjust VAT amount first.", "Warning !")
        //return false;
      }
      else if (duesVat < vatAdjustment) {
        //this.master.lstDetailsViewModel[rowIndex].collectionAmount = 0;
        this.master.lstDetailsViewModel[rowIndex].collectionAmount = null;
        this.master.lstDetailsViewModel[rowIndex].bonusDiscount = null;
        //this.master.lstDetailsViewModel[rowIndex].balanceAmount = this.master.lstDetailsViewModel[rowIndex].dueAmount;
        this.master.lstDetailsViewModel[rowIndex].vatAdjustment = null;
        this.toastrService.warning("VAT Adjust amount must be equal to VAT Dues amount.", "Warning !")
        //return false;
      }
    }

    // console.log("this.master.lstDetailsViewModel[rowIndex].vatAdjustment", this.master.lstDetailsViewModel[rowIndex].vatAdjustment);
    // console.log("this.master.lstDetailsViewModel[rowIndex].collectionAmount", this.master.lstDetailsViewModel[rowIndex].collectionAmount);
    //#endregion

    this.CalculateSummary();

    this.gBalanceAmount = this.master.lstDetailsViewModel[rowIndex].balanceAmount;
    //debugger;

    if (this.gBalanceAmount >= 0) {
      //this.gBalanceAmount = this.master.lstDetailsViewModel[rowIndex].balanceAmount;
      this.gCollectableAmt = this.master.lstDetailsViewModel[rowIndex].collectionAmount;
      this.gBonusDiscount = this.master.lstDetailsViewModel[rowIndex].bonusDiscount;
    }
    else {//this.gBalanceAmount < 0
      this.master.lstDetailsViewModel[rowIndex].collectionAmount = null;
      this.master.lstDetailsViewModel[rowIndex].bonusDiscount = null;

      // this.master.lstDetailsViewModel[rowIndex].collectionAmount = this.gCollectableAmt;
      // this.master.lstDetailsViewModel[rowIndex].bonusDiscount = this.gBonusDiscount;

      // this.master.lstDetailsViewModel[rowIndex].balanceAmount = this.master.lstDetailsViewModel[rowIndex].dueAmount - (this.gCollectableAmt + this.gBonusDiscount);
      this.toastrService.warning("Collection + Bonus amount cannot be larger than Dues amount", "Warning!")
      this.CalculateSummary();
    }
    // console.log(this.master.lstDetailsViewModel[rowIndex].collectionAmount);
    //console.log("this.master.lstDetailsViewModel[rowIndex].vatAdjustment", this.master.lstDetailsViewModel[rowIndex].vatAdjustment);
  }


  CalculateBonusDiscountIn(rowIndex: number, flag: any = "Auto") {
    let totaldiscount: number = 0;
    let totalcollectable: number = 0;
    let totaLWOVAT: number = 0;
    let inputamount: number = 0;
    inputamount = this.master.lstDetailsViewModel[rowIndex].inputAmount;
    if (this.master.lstDetailsViewModel[rowIndex].duesVat < inputamount) {

      this.master.lstDetailsViewModel[rowIndex].vatAdjustment = this.master.lstDetailsViewModel[rowIndex].duesVat;
      this.master.lstDetailsViewModel[rowIndex].collectionAmount = inputamount - this.master.lstDetailsViewModel[rowIndex].vatAdjustment;
    }
    else {

      this.master.lstDetailsViewModel[rowIndex].vatAdjustment = this.master.lstDetailsViewModel[rowIndex].inputAmount;
      this.master.lstDetailsViewModel[rowIndex].collectionAmount = 0;
    };
    debugger;

    if (this.master.collectionMasterId > 0) this.ValueAssignInEdit(rowIndex);

    this.ValidationForVAT(rowIndex);

    if (flag == "Auto") {
      //let bonusAmount: number = 0.00;
      //let paidAmount: number = this.master.lstDetailsViewModel[index].paidAmount
      let collAmont: number = this.master.lstDetailsViewModel[rowIndex].collectionAmount == null ? 0 : this.master.lstDetailsViewModel[rowIndex].collectionAmount;
      //console.log("collAmont", collAmont);
      let percentValue: number = this.master.lstDetailsViewModel[rowIndex].percentValue;
      //console.log("percentValue", percentValue);
      totaLWOVAT = Math.round(this.master.lstDetailsViewModel[rowIndex].grandTotal)
        - Math.round(this.master.lstDetailsViewModel[rowIndex].totalVat)
        ;
      // totaLWOVAT = Math.round(this.master.lstDetailsViewModel[rowIndex].collectionAmount)
      //   ;


      totaldiscount = Math.round(totaLWOVAT * this.master.lstDetailsViewModel[rowIndex].percentValue * 0.01) //+ Math.round(this.master.lstDetailsViewModel[rowIndex].incentiveAmount)
        ;

      totalcollectable = Math.round(totaLWOVAT - totaldiscount - Math.round(this.master.lstDetailsViewModel[rowIndex].incentiveAmountBak)
      );

      // let bonusDiscount: number = (totaldiscount * collAmont / totalcollectable); //Math.round(((collAmont == null ? 0 : collAmont) * (percentValue * 0.01)));
      // this.master.lstDetailsViewModel[rowIndex].bonusDiscount = Math.round(bonusDiscount); //Math.round(((collAmont == null ? 0 : collAmont) * ((percentValue == null ? 0 : percentValue) * 0.01)));


      let totalIncentive: number = this.master.lstDetailsViewModel[rowIndex].incentiveAmountBak;
      let totalInVOiceAmnt: number = this.master.lstDetailsViewModel[rowIndex].grandTotal;


      //this.master.lstDetailsViewModel[rowIndex].incentiveAmount = Math.round(totalIncentive * collAmont / totalcollectable);

      this.master.lstDetailsViewModel[rowIndex].incentiveAmount = Math.round(this.checkIncentiveAmt * (collAmont / this.checkCollectionAmt));
      this.master.lstDetailsViewModel[rowIndex].bonusDiscount = Math.round(this.checkBonusDiscountAmt * (collAmont / this.checkCollectionAmt));


      //console.log("bonusDiscount", bonusDiscount);
      //this.master.lstDetailsViewModel[index].dueAmount = Math.round(this.master.lstDetailsViewModel[index].grandTotal - ((collAmont == null ? 0 : collAmont) + bonusDiscount + this.master.lstDetailsViewModel[index].paidAmount));
    }
    else {
      // do something here if needed.
    }

    //this.ValidationForVAT(rowIndex);
    //#region 
    let duesVat: number = this.master.lstDetailsViewModel[rowIndex].duesVat;
    let vatAdjustment: number = this.master.lstDetailsViewModel[rowIndex].vatAdjustment == null ? 0 : this.master.lstDetailsViewModel[rowIndex].vatAdjustment;
    if (duesVat > 0) {
      if (duesVat > vatAdjustment) {
        //this.master.lstDetailsViewModel[rowIndex].collectionAmount = 0;
        // this.master.lstDetailsViewModel[rowIndex].collectionAmount = null;
        // this.master.lstDetailsViewModel[rowIndex].collectionAmount = "";
        // this.master.lstDetailsViewModel[rowIndex].bonusDiscount = null;
        //this.master.lstDetailsViewModel[rowIndex].collectionAmount.isEnable = 0;
        //this.master.lstDetailsViewModel[rowIndex].balanceAmount = this.master.lstDetailsViewModel[rowIndex].dueAmount;
        //this.master.lstDetailsViewModel[rowIndex].vatAdjustment = null;

        this.toastrService.warning("Please adjust VAT amount first.", "Warning !")
        //return false;
      }
      else if (duesVat < vatAdjustment) {
        //this.master.lstDetailsViewModel[rowIndex].collectionAmount = 0;
        this.master.lstDetailsViewModel[rowIndex].collectionAmount = null;
        this.master.lstDetailsViewModel[rowIndex].bonusDiscount = null;
        //this.master.lstDetailsViewModel[rowIndex].balanceAmount = this.master.lstDetailsViewModel[rowIndex].dueAmount;
        this.master.lstDetailsViewModel[rowIndex].vatAdjustment = null;
        this.toastrService.warning("VAT Adjust amount must be equal to VAT Dues amount.", "Warning !")
        //return false;
      }
    }

    // console.log("this.master.lstDetailsViewModel[rowIndex].vatAdjustment", this.master.lstDetailsViewModel[rowIndex].vatAdjustment);
    // console.log("this.master.lstDetailsViewModel[rowIndex].collectionAmount", this.master.lstDetailsViewModel[rowIndex].collectionAmount);
    //#endregion

    this.CalculateSummary();

    this.gBalanceAmount = this.master.lstDetailsViewModel[rowIndex].balanceAmount;
    //debugger;

    if (this.gBalanceAmount >= 0) {
      //this.gBalanceAmount = this.master.lstDetailsViewModel[rowIndex].balanceAmount;
      this.gCollectableAmt = this.master.lstDetailsViewModel[rowIndex].collectionAmount;
      this.gBonusDiscount = this.master.lstDetailsViewModel[rowIndex].bonusDiscount;
    }
    else {//this.gBalanceAmount < 0
      this.master.lstDetailsViewModel[rowIndex].collectionAmount = null;
      this.master.lstDetailsViewModel[rowIndex].bonusDiscount = null;

      // this.master.lstDetailsViewModel[rowIndex].collectionAmount = this.gCollectableAmt;
      // this.master.lstDetailsViewModel[rowIndex].bonusDiscount = this.gBonusDiscount;

      // this.master.lstDetailsViewModel[rowIndex].balanceAmount = this.master.lstDetailsViewModel[rowIndex].dueAmount - (this.gCollectableAmt + this.gBonusDiscount);
      this.toastrService.warning("Collection + Bonus amount cannot be larger than Dues amount", "Warning!")
      this.CalculateSummary();
    }
    // console.log(this.master.lstDetailsViewModel[rowIndex].collectionAmount);
    //console.log("this.master.lstDetailsViewModel[rowIndex].vatAdjustment", this.master.lstDetailsViewModel[rowIndex].vatAdjustment);
  }



  checkIncentiveAmt: number = 0;
  checkBonusDiscountAmt: number = 0;
  checkCollectionAmt: number = 0;

  gCollectableAmt: number = 0;
  invtotalTotalCollectionAmt: number = 0;

  checkChange(e, rowIndex: number) {
    debugger;
    let totaLWOVAT = 0;
    this.gCollectableAmt = 0;
    if (e.target.checked) {
      this.master.lstDetailsViewModel[rowIndex].isEnable = 1;

      // this.master.lstDetailsViewModel[rowIndex].bonusDiscount = Math.round(this.master.lstDetailsViewModel[rowIndex].dueAmount * this.master.lstDetailsViewModel[rowIndex].percentValue * 0.01);

      // this.master.lstDetailsViewModel[rowIndex].collectionAmount = Math.round(this.master.lstDetailsViewModel[rowIndex].dueAmount - this.master.lstDetailsViewModel[rowIndex].bonusDiscount);
      // totaLWOVAT = Math.round(this.master.lstDetailsViewModel[rowIndex].grandTotal) - Math.round(this.master.lstDetailsViewModel[rowIndex].totalVat)
      //   // - Math.round(this.master.lstDetailsViewModel[rowIndex].incentiveAmount)
      //   ;

      totaLWOVAT = Math.round(this.master.lstDetailsViewModel[rowIndex].grandTotalC
        //- Math.round(this.master.lstDetailsViewModel[rowIndex].totalVat)
        // - Math.round(this.master.lstDetailsViewModel[rowIndex].incentiveAmount)
      );

      console.log(totaLWOVAT);
      console.log(Math.round(totaLWOVAT * this.master.lstDetailsViewModel[rowIndex].percentValue * 0.01));
      debugger;

      this.master.lstDetailsViewModel[rowIndex].bonusDiscount = Math.round(totaLWOVAT * this.master.lstDetailsViewModel[rowIndex].percentValue * 0.01) //+ Math.round(this.master.lstDetailsViewModel[rowIndex].incentiveAmount)
        ;

      this.master.lstDetailsViewModel[rowIndex].collectionAmount = Math.round(totaLWOVAT
        //+ this.master.lstDetailsViewModel[rowIndex].paidVat
        - this.master.lstDetailsViewModel[rowIndex].bonusDiscount
        //- this.master.lstDetailsViewModel[rowIndex].paidAmount
        - this.master.lstDetailsViewModel[rowIndex].incentiveAmount
      )
        ;

      //this.master.lstDetailsViewModel[rowIndex].dueAmount = 0.00;
      // this.ValidationForVAT(rowIndex);
      //#region validation
      let duesVat = this.master.lstDetailsViewModel[rowIndex].duesVat;
      let vatAdjustment = this.master.lstDetailsViewModel[rowIndex].vatAdjustment == null ? 0 : this.master.lstDetailsViewModel[rowIndex].vatAdjustment;
      //if (duesVat > 0) {
      if (duesVat > vatAdjustment) {
        //this.master.lstDetailsViewModel[rowIndex].collectionAmount = 0;
        //this.master.lstDetailsViewModel[rowIndex].collectionAmount = null;
        //this.master.lstDetailsViewModel[rowIndex].collectionAmount = "";
        //this.master.lstDetailsViewModel[rowIndex].bonusDiscount = null;
        //this.master.lstDetailsViewModel[rowIndex].collectionAmount.isEnable = 0;
        //this.master.lstDetailsViewModel[rowIndex].balanceAmount = this.master.lstDetailsViewModel[rowIndex].dueAmount;
        //this.master.lstDetailsViewModel[rowIndex].vatAdjustment = null;

        //this.toastrService.warning("Please adjust VAT amount first.", "Warning !")
        //return false;
      }
      else if (duesVat < vatAdjustment) {
        //this.master.lstDetailsViewModel[rowIndex].collectionAmount = 0;
        //this.master.lstDetailsViewModel[rowIndex].collectionAmount = null;
        //this.master.lstDetailsViewModel[rowIndex].bonusDiscount = null;
        //this.master.lstDetailsViewModel[rowIndex].balanceAmount = this.master.lstDetailsViewModel[rowIndex].dueAmount;
        this.master.lstDetailsViewModel[rowIndex].vatAdjustment = null;
        this.toastrService.warning("VAT Adjust amount must be equal to VAT Dues amount.", "Warning !")
        //return false;
      }
      //}

      // console.log("this.master.lstDetailsViewModel[rowIndex].vatAdjustment", this.master.lstDetailsViewModel[rowIndex].vatAdjustment);
      // console.log("this.master.lstDetailsViewModel[rowIndex].collectionAmount", this.master.lstDetailsViewModel[rowIndex].collectionAmount);
      //#endregion
    } else {
      this.master.lstDetailsViewModel[rowIndex].isEnable = 0;
      this.master.lstDetailsViewModel[rowIndex].balanceAmount = this.master.lstDetailsViewModel[rowIndex].dueAmount;
      this.master.lstDetailsViewModel[rowIndex].vatAdjustment = this.master.lstDetailsViewModel[rowIndex].duesVat;
      this.master.lstDetailsViewModel[rowIndex].bonusDiscount = 0;
      this.master.lstDetailsViewModel[rowIndex].collectionAmount = null;
      this.master.lstDetailsViewModel[rowIndex].incentiveAmount = this.master.lstDetailsViewModel[rowIndex].incentiveAmountBak;
      this.master.lstDetailsViewModel[rowIndex].inputAmount = 0;
    }


    this.checkIncentiveAmt = this.master.lstDetailsViewModel[rowIndex].incentiveAmount;
    this.checkBonusDiscountAmt = this.master.lstDetailsViewModel[rowIndex].bonusDiscount;
    this.checkCollectionAmt = this.master.lstDetailsViewModel[rowIndex].collectionAmount;

    this.master.lstDetailsViewModel[rowIndex].inputAmount = Math.round(this.master.lstDetailsViewModel[rowIndex].collectionAmount
      + this.master.lstDetailsViewModel[rowIndex].vatAdjustment
      // - Math.round(this.master.lstDetailsViewModel[rowIndex].incentiveAmount)
    );
    //this.CalculateBonusDiscount(rowIndex);
    this.CalculateSummary();


    this.gCollectableAmt = this.master.lstDetailsViewModel[rowIndex].collectionAmount == null ? 0 : this.master.lstDetailsViewModel[rowIndex].collectionAmount;
    this.gBonusDiscount = this.master.lstDetailsViewModel[rowIndex].bonusDiscount == null ? 0 : this.master.lstDetailsViewModel[rowIndex].bonusDiscount;
  }

  ValueAssignInEdit(rowIndex: number) {
    if (rowIndex >= 0) {
      this.checkIncentiveAmt = this.master.lstDetailsViewModel[rowIndex].checkIncentiveAmt;
      this.checkBonusDiscountAmt = this.master.lstDetailsViewModel[rowIndex].checkBonusDiscountAmt;
      this.checkCollectionAmt = this.master.lstDetailsViewModel[rowIndex].checkCollectionAmt;
    }
  }

  //ValidationForVAT(rowIndex: number): boolean {
  ValidationForVAT(rowIndex: number) {

    let duesVat: number = this.master.lstDetailsViewModel[rowIndex].duesVat;
    let vatAdjustment: number = this.master.lstDetailsViewModel[rowIndex].vatAdjustment == null ? 0 : this.master.lstDetailsViewModel[rowIndex].vatAdjustment;
    if (duesVat > 0) {
      if (duesVat > vatAdjustment) {
        ////this.master.lstDetailsViewModel[rowIndex].collectionAmount = 0;
        // this.master.lstDetailsViewModel[rowIndex].collectionAmount = null;
        // this.master.lstDetailsViewModel[rowIndex].collectionAmount = "";
        // this.master.lstDetailsViewModel[rowIndex].bonusDiscount = null;
        ////this.master.lstDetailsViewModel[rowIndex].collectionAmount.isEnable = 0;
        ////this.master.lstDetailsViewModel[rowIndex].balanceAmount = this.master.lstDetailsViewModel[rowIndex].dueAmount;

        ////this.master.lstDetailsViewModel[rowIndex].vatAdjustment = null;

        //this.toastrService.warning("Please adjust VAT amount first.", "Warning !")

      }
      else if (duesVat < vatAdjustment) {
        ////this.master.lstDetailsViewModel[rowIndex].collectionAmount = 0;
        //this.master.lstDetailsViewModel[rowIndex].collectionAmount = null;
        //this.master.lstDetailsViewModel[rowIndex].bonusDiscount = null;
        ////this.master.lstDetailsViewModel[rowIndex].balanceAmount = this.master.lstDetailsViewModel[rowIndex].dueAmount;
        this.master.lstDetailsViewModel[rowIndex].vatAdjustment = null;
        this.toastrService.warning("VAT Adjust amount must be equal to VAT Dues amount.", "Warning !")

      }
    }

    console.log("VatAdjustmentAmt", this.master.lstDetailsViewModel[rowIndex].vatAdjustment);
    // console.log("this.master.lstDetailsViewModel[rowIndex].collectionAmount", this.master.lstDetailsViewModel[rowIndex].collectionAmount);

  }


  invoiceCount: number = 0;
  GetSalesInvoiceListfromDispatch() {
    debugger;
    // this.commonService.valueSet("create");
    this.invoiceCount = 0;
    this.master.lstDetailsViewModel = [];
    this.salesinvoiceService
      .GetSalesInvoiceListfromDispatchJson_v2(this.master.collectionMasterId, this.master.partyId, this.commonService.DateFormat(this.master.collectionDate), this.master.territoryCode, this.master.transactionTypeId, this.mioCode)
      .subscribe((returns: any) => {
        if (returns.success) {
          //console.log(returns.data);
          this.master.lstDetailsViewModel = returns.data;
          this.invoiceCount = returns.data.length;
          this.CalculateSummary();
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
  territoryOfficer = '';
  territoryName = '';

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

  // UpdateSalesInvoiceDetails() {
  //   this.salesinvoiceService
  //     .UpdateSalesInvoiceDetails(this.SalesModel)
  //     .subscribe((returns: any) => {
  //       if (returns.success) {
  //         //this.master.lstDetailsViewModel = returns.data;
  //         this.toastrService.success(returns.message, 'Message');

  //         this.GetSalesInvoiceListfromDispatch();
  //       }
  //       else {
  //         this.toastrService.warning(returns.message, 'Warning');
  //       }
  //     });
  // }

  msg = "";
  names: any;
  ViewDetails(dialog: TemplateRef<any>, salesInvoiceId: number) {
    // debugger;
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

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  moneyReceiptNo: any = "";
  public datalength: number;
  sTtlBonus: number = 0;
  incentiveAmount: number = 0;
  ttlvatAdjustment: number = 0;
  ttlincentiveAmount: number = 0;
  sTtlCollectionAmount: number = 0;
  sTtlVatAndCollectionAmount: number = 0;

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
    doc.html(content, {
      callback: function (doc) {
        autoTable(doc, {
          html: "#header_table_top",
          startY: legend.height + 40,
          styles: { font: "Meta", fontSize: 15, halign: "center" },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });
        autoTable(doc, {
          html: "#header_table",
          startY: legend.height + 90,
          styles: { font: "Meta" },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 50,
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });
        autoTable(doc, {
          html: "#body_table",
          startY: legend.height + 180,
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
            //3: { halign: "right" },
            4: { halign: "right" },
            5: { halign: "right" },
            6: { halign: "right" },
            7: { halign: "right" },
            8: { halign: "right" },
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255],
          },
        });

        // autoTable(doc, {
        //   html: "#table_AmountInWOrd",
        //   startY: legend.height + 430,
        //   styles: { font: "Meta", fontSize: 13, halign: "center" },
        //   bodyStyles: {
        //     fillColor: [255, 255, 255],
        //     textColor: 50,
        //   },
        //   alternateRowStyles: {
        //     fillColor: [255, 255, 255],
        //   },
        //   columnStyles: {
        //     0: { halign: "left" },
        //   },
        // });

        // autoTable(doc, {
        //   html: "#table_signature",
        //   startY: legend.height + 550,
        //   styles: { font: "Meta", fontSize: 11, halign: "center" },
        //   bodyStyles: {
        //     fillColor: [255, 255, 255],
        //     textColor: 50,
        //   },
        //   alternateRowStyles: {
        //     fillColor: [255, 255, 255],
        //   },
        // });

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
