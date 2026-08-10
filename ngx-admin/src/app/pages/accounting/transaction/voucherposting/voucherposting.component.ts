import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  TemplateRef,
  ViewChild,
  OnInit,
  Output,
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
import { SalesDistributionService } from "app/services/sales/sales-distribution.service";
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import { DatePipe } from "@angular/common";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { LeaveService } from "app/services/hrm/leave.service";
import { VoucherService } from "app/services/transaction/voucher.service";
import { take } from "rxjs/operators";
import { CommoncomboService } from "app/services/commoncombo.service";

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

@Component({
  selector: 'ngx-voucherposting',
  templateUrl: './voucherposting.component.html',
  styleUrls: ['./voucherposting.component.scss']
})
export class VoucherpostingComponent implements OnInit {

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
  searchText: string;

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

  public pageNavigation = "Voucher Posting";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      // this.GetVoucherForPosting();
      this.getMaster();
      //this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      // this.GetVoucherForPosting();
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
      // this.GetVoucherForPosting();
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

  master: {
    voucherMasterId: number;
    approvalStatus: string;
    isPosted: number;
    lstMasterViewModel: any[];
    voucherTypeId: number;
    voucherTypeSelected: any;
  };

  public getMaster() {
    this.master = {
      voucherMasterId: 0,
      isPosted: 0,
      approvalStatus: "",
      lstMasterViewModel: [],
      voucherTypeId: 0,
      voucherTypeSelected: null,
    };
    this.getVoucherType();
    // this.GetVoucherForPosting();
    this.loadApprovalStatusList();
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

  private save() {
    var button = this.commonService.buttonClicked;
    this.show = true;
    console.log(this.master);

    if (this.SaveValidation() == true) {
      this.voucherService
        .updateVoucher(this.master)
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

  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private SalesDistributionService: SalesDistributionService,
    private fieldforcemasterService: FieldforcemasterService,
    private datePipe: DatePipe,
    private salesinvoiceService: SalesinvoiceService,
    private voucherService: VoucherService,
    private leaveService: LeaveService,
    private comboService: CommoncomboService,
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
  apiUrl = '';
  private getCrReport(voucherMasterId: any, reportFormat: any = 'pdf') {
    this.apiUrl = `AccountsReport/GetVoucherReportById?voucherMasterId=${voucherMasterId}&reportFormat=${reportFormat}`;
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      this.commonService.GenerateBase64ToReport(returns);
    });
  }

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

  public openWithDataObjModel(dialog: TemplateRef<any>) {
    //debugger;
    this.dialogService.open(dialog, {
      context: this.data,
    });
  }

  @ViewChild('dialogFiles') dialogFiles: TemplateRef<any>;
  voucherModalData: any[] = [];
  showFileModal(voucherMasterId: number) {
    this.voucherService.getVoucherAttachmentByMasterId(voucherMasterId).pipe(take(1)).subscribe((returns: any) => {
      if (returns.success) {
        this.voucherModalData = returns.data;
        this.openWithDataObjModel(this.dialogFiles);
      }
    });
  }

  downloadFile(voucherAttachmentId: number) {
    this.voucherService.downloadVoucherAttachmentByAttachmentId(voucherAttachmentId).pipe(take(1)).subscribe(
      (returns: any) => {
        if (returns.success !== undefined && !returns.success) {
          this.toastrService.warning(returns.message, 'Message');
          return false;
        }
        const ext = returns.fileName.split('.').pop();
        if (ext) {
          const downloadLink = document.createElement('a');
          const blob = this.commonService.b64toBlob(returns.fileString, returns.contentType);
          const blobUrl = URL.createObjectURL(blob);
          downloadLink.href = blobUrl;
          downloadLink.download = returns.fileName;
          downloadLink.click();
        } else {
          this.toastrService.warning('Please Try Again.', 'Message');
        }
      }
    );
  }

  currencyFormatter(currency) {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}`;
  }

  LoadAllDropdown() {
    this.loadApprovalStatusList();
  }
  public voucherTypeItems = [];
  public getVoucherType() {
      this.comboService.getVoucherType().subscribe((returns: any) => {
        this.voucherTypeItems = returns.data.map((val) => ({
          id: val.voucherTypeId,
          name: val.voucherTypeName,
        }));
      });
    }
  GetVoucherForPosting() {
    this.commonService.valueSet("create");
    if (this.master.voucherTypeId == 0 || this.master.voucherTypeId == null) {
      this.toastrService.danger("Please select Voucher Type!", "Message");
      return;
    }
    this.voucherService
      .getVoucherForPosting(0, this.master.voucherTypeId, 0)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.master.lstMasterViewModel = returns.data;
        }
      });
  }

  ApprovalStatusList: {};
  ApprovalStatusSelected: {};
  loadApprovalStatusList() {
    this.ApprovalStatusSelected = null;
    this.ApprovalStatusList = [
      {
        id: 1,
        name: "Approve",
      },
      {
        id: 3,
        name: "Return",
      },
      {
        id: 2,
        name: "Rejected",
      },
    ];
  }
}