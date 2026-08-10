import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import {
  NbComponentStatus,
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

// import autoTable from "jspdf-autotable";
// import jsPDF from "jspdf";

@Component({
  selector: 'ngx-destruction-note-receive',
  templateUrl: './destruction-note-receive.component.html',
  styleUrls: ['./destruction-note-receive.component.scss']
})
export class DestructionNoteReceiveComponent implements OnInit {

  public pageNavigation = "Destruction Receive";// For Factory
  public tableHeader = ["#", "Miscellaneous No.", "Misc. Date", "Code", "Product Name", "Pack Size", "Qty.", "Value"];
  protected options: {};
  protected cd: ChangeDetectorRef;

  public bodyData: any = [];
  public apiUrl = "";
  public dispatchNo = "";
  public dispatchDate = "";
  public dispatcherName = "";

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

  types: NbComponentStatus[] = [
    "primary",
    "success",
    "info",
    "warning",
    "danger",
  ];
  // quotes = [
  //   { title: null, body: "We rock at Angular" },
  //   { title: null, body: "Titles are not always needed" },
  //   { title: null, body: "Toaster rock!" },
  // ];

  show: boolean = true;
  vlucherForm: FormGroup;
  submitted: boolean;
  saveupdate: string = "Save";
  gridbutton: string = "";
  name: string;
  description: string;
  selectedRow: any;
  userGroupId: any;


  constructor(
    //private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    // private SalesDistributionService: SalesDistributionService,
    // private fieldforcemasterService: FieldforcemasterService,
    // private datePipe: DatePipe,
    //private employeeinformationService: EmployeeinformationService,
    private salesinvoiceService: SalesinvoiceService
  ) {
    this.commonService.valueSet("showlist");
    this.userGroupId = this.commonService.getUserGroup();
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
        headerName: "DN Recv. Number",
        field: "destructionNoteReceiveNo",
        width: 200,
      },
      {
        headerName: "Date",
        field: "destructionNoteReceiveDate",
        width: 160,
      },
      {
        headerName: "Type",
        field: "miscellaneousType",
        width: 150,
      },
      {
        headerName: "Received From",
        field: "DepotName",
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

    this.getMaster();
  }


  ngOnInit() {
    localStorage.setItem("button", "");
    if (this.selectedRow != undefined) {
      this.name = this.selectedRow.currencyName;
      this.description = this.selectedRow.aliasName;
    }
  }
  /////Dynamic Button section (Do Not Edit)///////

  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      if (this.SaveValidation() == false) {
        this.commonService.valueSet("create");
        return;
      }
      this.save();
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      //this.commonService.valueSet("create");
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

  master: {
    damageExpireProductReturnMasterId: number;
    employeeId: number;
    miscellaneousTypeId: number;
    isApproved: number;
    destructionNoteReceiveDate: Date;
    remarks: string;
    miscellaneousType: string;
    lstMasterViewModel: any[];
    lstDetailsViewModel: any[];
    EmployeeSelected: {};
    typeSelected: {};
    MarketOrDepo: string;
  };

  public getMaster() {
    this.master = {
      damageExpireProductReturnMasterId: 0,
      employeeId: 0,
      miscellaneousTypeId: 0,
      isApproved: 0,
      remarks: "",
      miscellaneousType: "",
      lstMasterViewModel: [],
      lstDetailsViewModel: [],
      destructionNoteReceiveDate: new Date(),
      EmployeeSelected: null,
      typeSelected: null,
      MarketOrDepo: null
    };
    this.LoadAllDropdown();
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
    debugger
    // this.commonService.valueSet("create");
    if (this.master.damageExpireProductReturnMasterId == 0) {
      this.toastrService.warning("Please select a sestruction note number.", "Message");
      return false;
    }
    else if (this.master.lstMasterViewModel.length == 0) {
      this.toastrService.warning("Please select a destruction summary not found.", "Message");
      return false;
    }
    else if (this.master.lstDetailsViewModel.length == 0) {
      this.toastrService.warning("Please select a destruction note details not found.", "Message");
      return false;
    }

    return true;
  }

  private save() {
    debugger
    this.show = true;
    var button = this.commonService.buttonClicked;

    this.master.destructionNoteReceiveDate = this.commonService.DateFormat(this.master.destructionNoteReceiveDate);
    console.log(this.master);
    this.master.MarketOrDepo = this.master.lstMasterViewModel[0].MarketOrDepo;
    this.salesinvoiceService
      .SaveDestructionNoteReceive(this.master)
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
          this.loadGridData();
          this.getMaster();
        }
        else {
          this.toastrService.warning(
            this.commonService.failedmsg,
            "Message"
          );
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

  ////////////////////////////////// Ag Grid Data Load/////////////////////////////////
  private selectedRows = [];
  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    this.commonService.agButtonClicked = "";
    if (data == "edit") {
      this.commonService.valueSet("showlist");
      this.toastrService.warning('Not Allowed', 'Info')
    } else if (data == "view") {
      this.commonService.valueSet("showlist");
      this.toastrService.warning('Not Allowed', 'Info')
    } else if (data == "transectionreport") {
      this.agReport(event);
    } else if (data == "delete") {
      if (this.userGroupId == "1") {
        if (confirm('Are you sure to delete?')) {
          this.agDelete(event);
        }
      }
      else {
        this.toastrService.warning("Access Dennied", 'Info');
      }
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  private agDelete(event) {
    this.salesinvoiceService.DeleteDestructionNoteReceiveById(event.data.destructionNoteReceiveId).subscribe((data: any) => {
      if (data.success) {
        this.toastrService.success(this.commonService.deletedmsg, 'Info')
        this.loadGridData();
      }
      else {
        this.toastrService.warning(this.commonService.deleteFailedMsg, 'Info')
      }
    });
  }

  private agReport(event) {
    this.GetReport(event.data.destructionNoteReceiveId);
  }

  private GetReport(masterId) {
    debugger
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `SalesInvoiceReport/GetDestructionReceivedReportById?reportFormat=Pdf&userId=${userInfo[0].employeeid}&masterId=${masterId}&rType=Summary`;
    debugger;
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        console.log(res.message);
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.loadGridData();
  }

  loadGridData() {
    this.salesinvoiceService
      .GetAllDestructionNoteReceive(0).subscribe((data: any) => {
        if (data.success) {
          console.log(data);
          this.rowData = data.data;
        }
      });
  }

  isSelectAll: boolean = false;
  ToggleChange(event: any) {
    let isChecked: boolean = false;
    isChecked = event.target.checked;
    this.master.lstMasterViewModel.forEach(element => {
      element.isSelect = isChecked;
    });
  }

  LoadAllDropdown() {
    this.GetAllApprovedDestructionNoteNo();
  }

  DestructionNoteNoList: {};
  DestructionNoteSelected: {};
  GetAllApprovedDestructionNoteNo() {
    this.DestructionNoteSelected = null;
    this.salesinvoiceService.GetAllApprovedDestructionNoteNo().subscribe((returns: any) => {
      if (returns.success) {
        this.DestructionNoteNoList = returns.data.map((val: any) => ({
          id: val.id,
          name: val.name,
          miscellaneousType: val.miscellaneousType,
          miscellaneousTypeId: val.miscellaneousTypeId,
        }));
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });

  }

  GetDestructionDetails() {


    this.master.lstMasterViewModel = [];
    this.master.lstDetailsViewModel = [];

    if (this.DestructionNoteSelected == null) {
      this.master.damageExpireProductReturnMasterId = 0;
      this.master.miscellaneousTypeId = 0;
      return;
    }
    debugger
    this.salesinvoiceService.GetDestructionNoteById(this.master.damageExpireProductReturnMasterId).subscribe((returns: any) => {
      if (returns.success) {
        // console.log(returns.data);
        this.master.lstMasterViewModel = returns.data[0].summary;
        this.master.lstDetailsViewModel = returns.data[0].details;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }


}