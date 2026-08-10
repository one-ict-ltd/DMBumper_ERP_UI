import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PurchaseComponent } from "./purchase.component";
import { ProductrequisitionComponent } from "./settings/productrequisition/productrequisition.component";
import { PurchaseorderreceiveComponent } from "./settings/purchaseorderreceive/purchaseorderreceive.component";
import { PurchaseorderComponent } from "./settings/purchaseorder/purchaseorder.component";
import { PurchaserequisitionComponent } from "./settings/purchaserequisition/purchaserequisition.component";
import { PurchasedirectComponent } from "./settings/purchasedirect/purchasedirect.component";
import { PurchasereturnComponent } from "./settings/purchasereturn/purchasereturn.component";
import { PurchaseOrderReportComponent } from "./settings/reports/purchase-order-report/purchase-order-report.component";
import { PurchaseOrderSearchReportComponent } from "./settings/reports/purchase-order-search-report/purchase-order-search-report.component";
import { PreLcInfoComponent } from "./Import/pre-lc-info/pre-lc-info.component";
import { LCInfoComponent } from "./Import/lc-info/lc-info.component";
import { ChargeComponent } from "./Import/charge/charge.component";
import { ClearenceComponent } from "./Import/clearence/clearence.component";
import { LCAmendmentComponent } from "./Import/lc-amendment/lc-amendment.component";
import { LCAmendmentChargeComponent } from "./Import/lc-amendment-charge/lc-amendment-charge.component";
import { OtherOffshoreChargeComponent } from "./Import/other-offshore-charge/other-offshore-charge.component";
import { ShipmentInfoComponent } from "./Import/shipment-info/shipment-info.component";
import { ChargeHeadComponent } from "./Import/charge-head/charge-head.component";
import { BenificiaryComponent } from "./Import/benificiary/benificiary.component";
import { LocalAgentComponent } from "./Import/local-agent/local-agent.component";
import { ModeOfTransportComponent } from "./Import/mode-of-transport/mode-of-transport.component";
import { PortInfoComponent } from "./Import/port-info/port-info.component";
import { AdviceBankComponent } from "./Import/advice-bank/advice-bank.component";
import { CustomeClearenceComponent } from "./Import/custome-clearence/custome-clearence.component";
import { BankClearenceComponent } from "./Import/bank-clearence/bank-clearence.component";
import { OtherChargeComponent } from "./Import/other-charge/other-charge.component";
import { BillCreateComponent } from "./bill-create/bill-create.component";
import { BillPaymentComponent } from "./bill-payment/bill-payment.component";
import { GrnCreateComponent } from "./grn-create/grn-create.component";
import { PurchaseRequisitionApprovelComponent } from "./purchase-requisition-approvel/purchase-requisition-approvel.component";
import { RequisitionFinalizeComponent } from "./requisition-finalize/requisition-finalize.component";
import { QuotationCollectionComponent } from "./quotation-collection/quotation-collection.component";
import { ComparativeStatementComponent } from "./comparative-statement/comparative-statement.component";
import { ComparativeStatementApprovalComponent } from "./comparative-statement-approval/comparative-statement-approval.component";
import { SupplierInfoComponent } from "./supplier-info/supplier-info.component";
import { PurchaseRequisitionHOComponent } from "./purchase-requisition-ho/purchase-requisition-ho.component";
import { GrnQaApprovalComponent } from "./grn-qa-approval/grn-qa-approval.component";
import { GRNImportComponent } from "./Import/grnimport/grnimport.component";
import { GrnImportQcApprovalComponent } from "./Import/grn-import-qc-approval/grn-import-qc-approval.component";
import { PurchaseRequFileUploadComponent } from "./purchase-requ-file-upload/purchase-requ-file-upload.component";
import { GrnCreateForRejectedqtyComponent } from "./grn-create-for-rejectedqty/grn-create-for-rejectedqty.component";
import { GrnImportForRejectedQtyComponent } from "./Import/grn-import-for-rejected-qty/grn-import-for-rejected-qty.component";
import { BudgetCreateComponent } from "./budget-create/budget-create.component";
import { RetestForGrnComponent } from "./retest-for-grn/retest-for-grn.component";
import { GrnReportListComponent } from "./settings/reports/grn-report-list/grn-report-list.component";
import { UserWiseProductTypeComponent } from "./settings/user-wise-product-type/user-wise-product-type.component";
import { PurchaseApprovalMatrixComponent } from "./settings/purchase-approval-matrix/purchase-approval-matrix.component";

const routes: Routes = [
  {
    path: "",
    component: PurchaseComponent,
    children: [
      {
        path: "productrequisition",
        component: ProductrequisitionComponent,
      },
      {
        path: "purchaserequisition",
        component: PurchaserequisitionComponent,
      },
     
      {
        path: "purchaseorderreceive",
        component: PurchaseorderreceiveComponent,
      },
      {
        path: "purchaseorder",
        component: PurchaseorderComponent,
      },
      {
        path: "purchase-direct",
        component: PurchasedirectComponent,
      },
      {
        path: "purchasereturn",
        component: PurchasereturnComponent,
      },
      {
        path: "purchase-order-report",
        component: PurchaseOrderReportComponent,
      },
      {
        path: "purchase-order-search-report",
        component: PurchaseOrderSearchReportComponent,
      },
      {
        path: "bill-create",
        component: BillCreateComponent,
      },
      {
        path: "bill-payment",
        component: BillPaymentComponent,
      },
      {
        path: "grn-create",
        component: GrnCreateComponent,
      },
      {
        path: "grn-qa-approval",
        component: GrnQaApprovalComponent,
      },
      {
        path: "purchase-requisition-approval",
        component: PurchaseRequisitionApprovelComponent,
      },
      {
        path: "requisition-finalize",
        component: RequisitionFinalizeComponent,
      },
      {
        path: "quotation-collection",
        component: QuotationCollectionComponent,
      },
      {
        path: "comparative-statement",
        component: ComparativeStatementComponent,
      },
      {
        path: "comparative-statement-approval",
        component: ComparativeStatementApprovalComponent,
      },
      {
        path: "supplier-info",
        component: SupplierInfoComponent,
      },
      {
        path: "purchase-requisition-ho",
        component: PurchaseRequisitionHOComponent,
      },

      // for import
      {
        path: "pre-lc-inof",
        component: PreLcInfoComponent,
      },
      {
        path: "lc-info",
        component: LCInfoComponent,
      },
      {
        path: "charge",
        component: ChargeComponent,
      },
      {
        path: "clearence",
        component: ClearenceComponent,
      },
      {
        path: "lc-amendment",
        component: LCAmendmentComponent,
      },
      {
        path: "lc-amendment-charge",
        component: LCAmendmentChargeComponent,
      },
      {
        path: "other-offshore-charge",
        component: OtherOffshoreChargeComponent,
      },
      {
        path: "shipment-info",
        component: ShipmentInfoComponent,
      },
      {
        path: "charge-head",
        component: ChargeHeadComponent,
      },
      {
        path: "benificiary",
        component: BenificiaryComponent,
      },
      {
        path: "local-agent",
        component: LocalAgentComponent,
      },
      {
        path: "mode-of-transport",
        component: ModeOfTransportComponent,
      },
      {
        path: "port-info",
        component: PortInfoComponent,
      },
      {
        path: "advice-bank",
        component: AdviceBankComponent,
      },
      {
        path: "custome-clearance",
        component: CustomeClearenceComponent,
      },
      {
        path: "bank-clearance",
        component: BankClearenceComponent,
      },
      {
        path: "other-charge",
        component: OtherChargeComponent,
      },
      {
        path: "Grm-Import",
        component: GRNImportComponent,
      },
      {
        path: "grn-import-qc-approval",
        component: GrnImportQcApprovalComponent,
      }
      , { path: 'purchase-requ-file-upload', component: PurchaseRequFileUploadComponent }
      , {
        path: "grn-create-for-rejectedqty",
        component: GrnCreateForRejectedqtyComponent,
      },
      {
        path: "grn-import-for-rejectedqty",
        component: GrnImportForRejectedQtyComponent,
      },
      {
        path: "budget-create",
        component: BudgetCreateComponent,
      },
      {
        path: "retest-for-grn",
        component: RetestForGrnComponent,
      },
      {
        path: "retest-for-grn",
        component: RetestForGrnComponent,
      },
      {
        path: "grn-report-list",
        component: GrnReportListComponent,
      }
      , { path: 'user-wise-product-type', component: UserWiseProductTypeComponent }
      , { path: 'purchase-approval-matrix', component: PurchaseApprovalMatrixComponent }
      ////// Report Section ///
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseRoutingModule { }
