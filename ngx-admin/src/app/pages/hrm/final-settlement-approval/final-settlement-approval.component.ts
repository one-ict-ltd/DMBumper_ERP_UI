import { ChangeDetectorRef, Component, OnInit, TemplateRef } from "@angular/core";
import { NbComponentStatus, NbDialogService, NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrConfig, NbToastrService } from "@nebular/theme";

import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { BtnCellRenderer } from "app/pages/common/btn-cell-renderer.component";
import { CommonService } from "app/@core/mock/common.service";
import { FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { HrmmasterService } from "app/services/hrm/hrmmaster.service";
@Component({
  selector: 'ngx-final-settlement-approval',
  templateUrl: './final-settlement-approval.component.html',
  styleUrls: ['./final-settlement-approval.component.scss']
})
export class FinalSettlementApprovalComponent implements OnInit {
  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public frameworkComponents: {
    btnCellRenderer: typeof BtnCellRenderer;
  };
  master: {
    approvalStatus: number;
    finalSettlementApprovalModel: any[];
  }
  constructor(
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private hrmmasterService: HrmmasterService) {
    this.commonService.valueSet("showlist");

    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderer,
    };
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
    };
    //this.
    this.getMaster();
    this.loadApprovalStatusList();
  }

  ngOnInit(): void {
  }
  public pageNavigation = "Employee Final Settlement Approval";
  show: boolean = true;
  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.GetFinalSettlementorApproval();
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      this.save();
      this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      this.save();
      this.show = true;
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      this.GetFinalSettlementorApproval();
    } else if (this.commonService.buttonClicked == "edit") {
      this.show = false;
    }
  };

  public getMaster() {
    this.master = {
      approvalStatus: 0,
      finalSettlementApprovalModel: [],
    };

    this.GetFinalSettlementorApproval();
  }
  GetFinalSettlementorApproval() {

    this.commonService.valueSet("create");

    this.hrmmasterService
      .GetfinalSettlementDataForApproval()
      .subscribe((returns: any) => {
        if (returns.success) {
          this.master.finalSettlementApprovalModel = returns.data;
        }
      });
  }
  generateCrReport(index: any) {
    debugger
    var reportFormat = "pdf";
    var finalSettlementMasterId = this.master.finalSettlementApprovalModel[index].finalSettlementMasterId;
    let apiUrl = `Pims/GetEmployeeFinalSettlementById?finalSettlementMasterId=${finalSettlementMasterId}&reportFormat=${reportFormat}`;
    this.commonService.GetCrystalReportData(apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }
  private save() {
    debugger
    var button = this.commonService.buttonClicked;
    this.show = true;
    console.log(this.master);

    if (this.SaveValidation() == true) {
      this.hrmmasterService
        .SaveEmployeeFinalSettlementApproval(this.master)
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
    this.master.finalSettlementApprovalModel.forEach((e) => {
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
}
