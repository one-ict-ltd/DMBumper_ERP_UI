import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
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

@Component({
  selector: 'ngx-leaveapproval',
  templateUrl: './leaveapproval.component.html',
  styleUrls: ['./leaveapproval.component.scss']
})
export class LeaveapprovalComponent implements OnInit {

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

  public pageNavigation = "Leave Approval";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.GetLeaveRegisterListForApproval();
      this.getMaster();
      //this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.GetLeaveRegisterListForApproval();
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
      this.GetLeaveRegisterListForApproval();
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

  master: {
    distributionMasterId: number;
    approvalStatus: string;
    leaveStatus: number;
    lstMasterViewModel: any[];
  };

  public getMaster() {
    this.master = {
      distributionMasterId: 0,
      leaveStatus: 0,
      approvalStatus: "",
      lstMasterViewModel: [],
    };
    this.GetLeaveRegisterListForApproval();
    this.getLeaveType();
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
    // if (
    //   this.ApprovalStatusSelected == null ||
    //   this.ApprovalStatusSelected["name"] == ""
    // ) {
    //   this.toastrService.warning("Please select a Approval Status.", "Message");
    //   // this.commonService.valueSet("create");
    //   return false;
    // }
    if (this.master.leaveStatus == null || this.master.leaveStatus == 0) {
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
        "Please select a row for approval.",
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
      this.leaveService
        .SetApproveLeave(this.master)
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
  public LeaveTypeList = [];
  public LeaveTypeSelected = [];
  public getLeaveType() {
    this.LeaveTypeSelected = null;
    this.leaveService.getLeaveType().subscribe((retuns: any) => {
      if (retuns.success) {
        this.LeaveTypeList = retuns.data.map((val: any) => ({
          id: val.leaveTypeId,
          name: val.typeName,
        }));
        //console.log(this.LeaveTypeList);
      }
    })
  }
  LoadLeaveBalance(rowIndex, employeeId, leaveTypeId, yearId) {
    this.leaveService.GetManualLeaveBalance(employeeId, yearId, leaveTypeId).subscribe((data: any) => {
      if (data.success) {
        this.master.lstMasterViewModel[rowIndex].Balance = data.data[0].leaveBalance;
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

  constructor(
    private dialogService: NbDialogService,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private SalesDistributionService: SalesDistributionService,
    private fieldforcemasterService: FieldforcemasterService,
    private datePipe: DatePipe,
    private salesinvoiceService: SalesinvoiceService,
    private leaveService: LeaveService,
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

  GetLeaveRegisterListForApproval() {
    this.commonService.valueSet("create");
    this.leaveService
      .GetLeaveRegisterForApprovalByEmployeeIdJson()
      .subscribe((returns: any) => {
        if (returns.success) {
          this.master.lstMasterViewModel = returns.data;
        }
      });
  }

  ApprovalStatusList: {};
  ApprovalStatusSelected: {};
  loadApprovalStatusList() {
    this.ApprovalStatusList = [
      {
        id: 1,
        name: "Approved",
      },
      {
        id: 2,
        name: "Rejected",
      },
    ];
  }
}
