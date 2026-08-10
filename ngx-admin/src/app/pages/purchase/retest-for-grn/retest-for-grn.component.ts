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
  selector: 'ngx-retest-for-grn',
  templateUrl: './retest-for-grn.component.html',
  styleUrls: ['./retest-for-grn.component.scss']
})



export class RetestForGrnComponent implements OnInit {

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
  selectedRowIndex: number | null = null;
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

  public pageNavigation = "Test Request";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      //this.GetGRNListForApproval();
      this.getMaster();
    } else if (this.commonService.buttonClicked == "showlist") {
      this.GetGRNListForRetest();
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
      this.GetGRNListForRetest();
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
    RetestDate: Date;
    grnModel: any[];
    supplierChallanNo: string;
    TestReqQty: number;
    NoOfPackForRetest: number;
    grnDetailsId: number;
    grnType: string;

  };
  selectRow(e, rowIndex): void {
    if (e.target.checked) {
      this.master.grnModel[rowIndex].isEnable = 1;
      this.master.grnModel[rowIndex].TestReqQty = this.master.grnModel[rowIndex].CurrentStock;
      this.master.grnDetailsId = this.master.grnModel[rowIndex].grnDetailsId;
    } else {
      this.master.grnModel[rowIndex].isEnable = 0;

    }
    this.selectedRowIndex = this.selectedRowIndex === rowIndex ? null : rowIndex;
  }
  public getMaster() {
    this.master = {
      grnMasterId: 0,
      GRNid: 0,
      supplierName: "",
      purOrderNo: "",
      RetestDate: new Date(),
      grnModel: [],
      supplierChallanNo: "",
      TestReqQty: 0,
      NoOfPackForRetest: 0,
      grnDetailsId: 0,
      grnType: ""
    };
    this.GetGRNListForRetest();
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
    let count: number = 0;
    this.master.grnModel.forEach((e) => {
      if (e.isSelect == 1) {
        this.master.TestReqQty = e.TestReqQty;
        this.master.NoOfPackForRetest = e.NoOfPackForRetest;
        count++; e.grnStatus = 1;
      }
    });

    if (count == 0) {
      this.toastrService.warning("Please select a grn for test.", "Message");
      return false;
    }
    return true;
  }

  private save() {
    var button = this.commonService.buttonClicked;
    this.show = true;
    debugger

    if (this.SaveValidation() == true) {
      this.PurchaseorderService
        .SetGrnLogtbl(this.master)
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
  public GetGRNListForRetest() {
    this.commonService.valueSet("create");
    this.PurchaseorderService.getGRNForRetest().subscribe((returns: any) => {
      if (returns.success) {
        this.GRNList = returns.data.map((val: any) => ({
          grnNo: val.grnNo,
          supplierName: val.supplierName,
          purOrderNo: val.purOrderNo,
          purchaseOrderDate: val.purchaseOrderDate,
          supplierChallanNo: val.supplierChallanNo,
          grnMasterId: val.grnMasterId,
          grnType: val.grnType
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
        //this.master.RetestDate = item.purchaseOrderDate;
        this.master.supplierChallanNo = item.supplierChallanNo;
        this.master.grnMasterId = item.grnMasterId;
        this.master.grnType = item.grnType;
      }
    });
    this.PurchaseorderService.getGrnDetailsForRetest(grnMasterId, this.master.grnType).subscribe((data1: any) => {
      debugger
      if (data1.success) {
        this.master.grnModel = data1.data;

      }
      this.master.grnModel.forEach((item: any) => {
        item.approvedQty = item.actualRcvQty;
      });
    })

  }

}
