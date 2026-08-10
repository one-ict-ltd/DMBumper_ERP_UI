import { ChangeDetectorRef, Component, OnInit, TemplateRef } from "@angular/core";
import { NbComponentStatus, NbDialogService, NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrConfig, NbToastrService } from "@nebular/theme";

import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { PurchaseorderService } from "app/pages/purchase/settings/purchaseorder.service";
@Component({
  selector: 'ngx-grn-qa-approval',
  templateUrl: './grn-qa-approval.component.html',
  styleUrls: ['./grn-qa-approval.component.scss']
})
export class GrnQaApprovalComponent implements OnInit {

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

  public pageNavigation = "GRN QC Approval";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      // this.GetGRNListForApproval();
      this.getMaster();
    } else if (this.commonService.buttonClicked == "showlist") {
      // this.GetGRNListForApproval();
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
  public TestTypeList = [
    { id: 1, name: "Initial" },
    { id: 2, name: "Retest" }
  ];
  master: {
    grnMasterId: number;
    GRNid: number;
    supplierName: string;
    purOrderNo: string;
    approvalStatus: string;
    purchaseOrderDate: Date;
    grnModel: any[];
    supplierChallanNo: string;
    testTypeId: number;
    grnDetailsId: number;
    RetestDate: Date;
    InitialOrRetest: string;
  };

  public getMaster() {
    this.master = {
      grnMasterId: 0,
      GRNid: 0,
      supplierName: "",
      purOrderNo: "",
      approvalStatus: "",
      purchaseOrderDate: new Date(),
      grnModel: [],
      supplierChallanNo: "",
      testTypeId: 0,
      grnDetailsId: 0,
      RetestDate: new Date(),
      InitialOrRetest: ""

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
    if (this.master.approvalStatus == null || this.master.approvalStatus == '0' || this.master.approvalStatus == '') {
      this.toastrService.warning("Please select a Approval Status.", "Message");
      return false;
    }

    let count: number = 0;
    this.master.grnModel.forEach((e) => {
      if (e.isSelect == 1) {
        count++; e.grnStatus = 1;
      }
    });

    if (count == 0) {
      this.toastrService.warning("Please select a grn for approval.", "Message");
      return false;
    }
    return true;
  }

  private save() {
    var button = this.commonService.buttonClicked;
    this.show = true;
    debugger
    this.master.RetestDate = this.commonService.DateFormat(this.master.RetestDate);
    //this.master.approvalStatus = Number(this.master.approvalStatus);
    if (this.SaveValidation() == true) {
      this.PurchaseorderService
        .UpdateGRNQaForApproval(this.master)
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
    private PurchaseorderService: PurchaseorderService,
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

  public GRNList = [];
  public GetGRNListForApproval() {
    debugger
    this.commonService.valueSet("create");
    this.PurchaseorderService.getGRNForQA().subscribe((returns: any) => {
      if (returns.success) {
        this.GRNList = returns.data.map((val: any) => ({
          grnNo: val.grnNo,
          supplierName: val.supplierName,
          purOrderNo: val.purOrderNo,
          purchaseOrderDate: val.purchaseOrderDate,
          supplierChallanNo: val.supplierChallanNo,
          grnMasterId: val.grnMasterId,
          InitialOrRetest: val.InitialOrRetest
        }));
      }
    });
  }
  public getGrnDetails(grnMasterId: any) {
    debugger
    this.GRNList.forEach((item: any) => {
      if (item.grnMasterId == grnMasterId) {
        this.master.supplierName = item.supplierName;
        this.master.purOrderNo = item.purOrderNo;
        //this.master.approvalStatus = item.approvalStatus;
        this.master.purchaseOrderDate = item.purchaseOrderDate;
        this.master.supplierChallanNo = item.supplierChallanNo;
        this.master.grnMasterId = item.grnMasterId;
        this.master.InitialOrRetest = item.InitialOrRetest;
      }
    });
    this.PurchaseorderService.getGrnDetailsForQA(grnMasterId, this.master.InitialOrRetest).subscribe((data1: any) => {
      debugger
      if (data1.success) {
        this.master.grnModel = data1.data;

      }
      this.master.grnModel.forEach((item: any) => {
        item.approvedQty = item.actualRcvQty;
      });
    })

  }
  public checkPotency(rowIndex: any) {
    debugger
    if (this.master.grnModel[rowIndex].potency > 100) {
      this.toastrService.info("Potency can not be greater than 100", "Message");
      this.master.grnModel[rowIndex].potency = '';
    }
  }
}


