import { ChangeDetectorRef, Component, OnInit, TemplateRef } from "@angular/core";
import { NbComponentStatus, NbDialogService, NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrConfig, NbToastrService } from "@nebular/theme";
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
import { PurchaserequisitionService } from "app/pages/purchase/settings/purchaserequisition.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { ProductService } from "app/services/inventory/product.service";

@Component({
  selector: 'ngx-purchase-requisition-approvel',
  templateUrl: './purchase-requisition-approvel.component.html',
  styleUrls: ['./purchase-requisition-approvel.component.scss']
})
export class PurchaseRequisitionApprovelComponent implements OnInit {

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

  public pageNavigation = "Purchase Requisition Approval";
  public buttons = this.commonService.btnList;

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.GetPurchaseRequisitionListForApproval();
      this.getMaster();
      //this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.GetPurchaseRequisitionListForApproval();
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
      this.GetPurchaseRequisitionListForApproval();
      this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  }

  master: {
    distributionMasterId: number;
    approvalStatus: string;
    // lstMasterViewModel: any[];
    lstReqDetailsViewModel: any[];
  };

  public getMaster() {
    this.master = {
      distributionMasterId: 0,
      approvalStatus: "",
      // lstMasterViewModel: [],
      lstReqDetailsViewModel: [],
    };
    this.GetPurchaseRequisitionListForApproval();
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
      // this.commonService.valueSet("create");
      return false;
    }

    let count: number = 0;
    this.master.lstReqDetailsViewModel.forEach((e) => {
      if (e.isSelect == 1) count++;
    });

    if (count == 0) {
      this.toastrService.warning("Please select a requisition for approval.", "Message");
      return false;
    }
    return true;
  }

  private save() {
    var button = this.commonService.buttonClicked;
    this.show = true;


    if (this.SaveValidation() == true) {
      this.purchaserequisitionService
        .ApprovePurchaseRequisitionMaster(this.master)
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
    private purchaserequisitionService: PurchaserequisitionService,
    private productService: ProductService,
    private datePipe: DatePipe,
    private salesinvoiceService: SalesinvoiceService
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

  GetPurchaseRequisitionListForApproval() {
    this.commonService.valueSet("create");
    this.purchaserequisitionService
      .GetPurchaseRequisitionListForApproval(0)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.master.lstReqDetailsViewModel = returns.data;
        }
      });
  }

  purchaseReqId = 0;
  purReqNo = '';
  purchaseReqDate = '';
  fromSbuName = '';
  address = '';
  purpose = '';
  approvalStatus = '';


  PurchaseModel: any[];
  DetailsViewModel: any[];
  GetPurchaseRequisitionDetails(purchaseReqId: number) {
    this.purchaserequisitionService
      .GetPurchaseRequisitionDetailsByIdForApproval(purchaseReqId)
      .subscribe((data: any) => {
        if (data.success) {

          this.PurchaseModel = data.data;
          this.purchaseReqId = data.data[0].purchaseReqId;
          // this.grandTotal = data.data[0].grandTotal;
          this.purReqNo = data.data[0].purReqNo;
          this.purchaseReqDate = data.data[0].purchaseReqDate;

          debugger
          this.purchaserequisitionService
            .getPurchaseReqDetailsbyMasterId(purchaseReqId)
            .subscribe((returns: any) => {

              if (returns.success) {
                this.DetailsViewModel = [];
                //this.DetailsViewModel = returns.data;
                for (let i = 0; i < returns.data.length; i++) {
                  this.DetailsViewModel.push(returns.data[i]);
                }
              }
            });
        }
      });
  }
  // public async deleteDetail(index: any) {

  //   if (confirm('Are you sure to delete?')) {
  //     this.DetailsViewModel.splice(index, 1);
  //     this.toastrService.danger(this.commonService.deletedmsg, "Message");
  //   }


  // }
  public async deleteDetail(index: any) {

    if (confirm('Are you sure to delete?')) {
      debugger
      this.selectedRow = this.DetailsViewModel[index];
      let PurchaseReqDetailsId = this.DetailsViewModel[index].PurchaseReqDetailsId;
      if (PurchaseReqDetailsId > 0) {
        this.purchaserequisitionService.deletePurchaseRequisitionDetailsById(PurchaseReqDetailsId)
          .subscribe((returns: any) => {
            if (returns.success) {
              this.toastrService.danger(this.commonService.deletedmsg, "Message");
              this.selectedRow = this.DetailsViewModel[index];
              this.DetailsViewModel.splice(index, 1);
            }
          });
      } else {
        this.DetailsViewModel.splice(index, 1);
        this.toastrService.danger(this.commonService.deletedmsg, "Message");
      }
      this.GetPurchaseRequisitionListForApproval();

    }

  }

  RemarksChange(rowIndex: number, data: any) {
    this.master.lstReqDetailsViewModel[rowIndex].comments = data;

  }



  UpdatePurchaseRequisitionDetails() {
    if (this.SaveValidation() == true) {
      this.purchaserequisitionService
        .UpdatePurchaseRequisitionDetails(this.DetailsViewModel)
        .subscribe((returns: any) => {
          if (returns.success) {
            //this.master.lstMasterViewModel = returns.data;
            //this.toastrService.success(returns.message, 'Message');
            this.save();
            this.commonService.valueSet("create");
          }
          else {
            this.toastrService.warning(returns.message, 'Warning');
          }
        });
    }
  }

  msg = "";
  names: any;
  ViewDetails(dialog: TemplateRef<any>, purchaseReqId: number, rowIndex: number) {
    if (this.master.lstReqDetailsViewModel[rowIndex].isSelect == 1) {
      // debugger;
      this.GetPurchaseRequisitionDetails(purchaseReqId);

      this.dialogService.open(dialog, {
        context: [],
      });
    }
    else {
      this.toastrService.warning("Please select a requisition for approval.", "Message");
    }

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

  printReport(purchaseReqId: any) {
    if (purchaseReqId != null && purchaseReqId > 0) {
      this.generateCrReport(purchaseReqId, 'pdf');
    }
  }

  generateCrReport(purchaseReqId: any, reportFormat: any) {
    let apiUrl = `PurchaseRequisition/GetPurchaseRequisitionRptData?purchaseRequisitionId=${purchaseReqId}&reportFormat=${reportFormat}`;
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

}
