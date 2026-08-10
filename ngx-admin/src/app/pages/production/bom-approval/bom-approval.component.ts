import { ChangeDetectorRef, Component, OnInit, TemplateRef } from "@angular/core";
import { NbComponentStatus, NbDialogService, NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrConfig, NbToastrService } from "@nebular/theme";

import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { BomService } from "app/services/production/bom.service";
@Component({
  selector: 'ngx-bom-approval',
  templateUrl: './bom-approval.component.html',
  styleUrls: ['./bom-approval.component.scss']
})
export class BomApprovalComponent implements OnInit {
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

  }
  /////Dynamic Button section (Do Not Edit)///////

  public pageNavigation = "BOM Approval";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.GetGRNListForApproval();
      this.getMaster();
    } else if (this.commonService.buttonClicked == "showlist") {
      this.GetGRNListForApproval();
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
      this.GetGRNListForApproval();
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

  master: {

    approvalStatus: string;
    bomModel: any[];
    bomMaster: any[];
  };

  public getMaster() {
    this.master = {
      //grnMasterId: 0,
      approvalStatus: "",
      bomModel: [],
      bomMaster: []
    };
    this.GetGRNListForApproval();
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
    if (
      this.master.approvalStatus == null
    ) {
      this.toastrService.warning("Please select a Approval Status.", "Message");
      return false;
    }

    let count: number = 0;
    this.master.bomModel.forEach((e) => {
      if (e.isSelect == true) {
        count++;
        let elements = {
          pendingbomId: e.pendingbomId,

          approvalStatus: this.master.approvalStatus,

        };
        this.master.bomMaster.push(elements);
      }

    });
    console.log(this.master.bomMaster);

    if (count == 0) {
      this.toastrService.warning("Please select a bom for approval.", "Message");
      return false;
    }
    return true;
  }

  private save() {
    var button = this.commonService.buttonClicked;
    this.show = true;
    debugger
    if (this.master.approvalStatus) {
      if (this.master.approvalStatus == "1") {

        if (this.SaveValidation() == true) {
          this.BomService
            .SaveBomForApproval(this.master)
            .subscribe((returns: any) => {
              if (returns.success) {
                this.toastrService.success(
                  this.commonService.successmsg,
                  "Message"
                );
                this.getMaster();
              }
            });
        }
      }
    }
    else {
      this.toastrService.warning("Please select a Approval Status", "Message");
    }
  }

  private reset() {
    this.getMaster();
  }

  //////////////////////////////// End CRUD /////////////////////////////////////////

  onRefesh() {
    this.selectedRow = "";
    this.ngOnInit();
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
    private datePipe: DatePipe,
    private BomService: BomService,
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
  }

  private selectedRows = [];
  public onRowClicked(event) {
    this.selectedRow = event.node.data;
    var data = this.commonService.agButtonClicked;
    if (data == "edit") {
    } else if (data == "view") {
    } else if (data == "transectionreport") {
      //this.agReport(event);
    } else if (data == "delete") {
    } else {
      this.toastrService.info("Please Click Any Button", "Message");
    }
  }

  ViewDetails(dialog: TemplateRef<any>, pendingbomId: number) {
    debugger;
    this.GetBOMApprovalDetails(pendingbomId);
    this.dialogService.open(dialog, {
      context: [],
    });
  }
  BOMApprovalModel: any[];
  GetBOMApprovalDetails(pendingbomId: number) {
    this.BomService
      .GetBomReportDataById(pendingbomId)
      .subscribe((data: any) => {
        if (data.success) {
          this.BOMApprovalModel = data.data;
        }
      });

  }

  GetGRNListForApproval() {
    debugger
    this.commonService.valueSet("create");
    this.BomService
      .GetPendingBomMasterById(0)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.master.bomModel = returns.data;
        }
      });
  }

}
