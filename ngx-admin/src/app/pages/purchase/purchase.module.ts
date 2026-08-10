import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NbActionsModule,
  NbAlertModule,
  NbAutocompleteModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbOptionModule,
  NbRadioModule,
  NbSelectModule,
  NbTabsetModule,
  NbToastrModule,
  NbUserModule,
} from "@nebular/theme";
import { ThemeModule } from "app/@theme/theme.module";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { HttpClientModule } from "@angular/common/http";
import { AgGridModule } from "ag-grid-angular";
import { PurchaseComponent } from "./purchase.component";
import { AuthRoutingModule } from "app/auth/auth-routing.module";
import { PurchaseRoutingModule } from "./purchase-routing.module";
import { ProductrequisitionComponent } from "./settings/productrequisition/productrequisition.component";
import { PurchaserequisitionComponent } from "./settings/purchaserequisition/purchaserequisition.component";
import { PurchaseorderreceiveComponent } from "./settings/purchaseorderreceive/purchaseorderreceive.component";
import { PurchaseorderComponent } from "./settings/purchaseorder/purchaseorder.component";
import { RptHeaderComponent } from "./settings/common/rpt-header/rpt-header.component";
import { RptFooterComponent } from "./settings/common/rpt-footer/rpt-footer.component";
import { ReportButtonComponent } from "./settings/common/report-button/report-button.component";
import { CommonButtonComponent } from "../purchase/settings/common/common-button/common-button.component";
import { RptPurchaseorderheaderComponent } from "./settings/common/rpt-purchaseorderheader/rpt-purchaseorderheader.component";
import { PurchasedirectComponent } from "./settings/purchasedirect/purchasedirect.component";
import { PurchasereturnComponent } from "./settings/purchasereturn/purchasereturn.component";
import { PurchaseOrderReportComponent } from "./settings/reports/purchase-order-report/purchase-order-report.component";
import { PurchaseOrderSearchReportComponent } from './settings/reports/purchase-order-search-report/purchase-order-search-report.component';
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
import { ComparativeStatementComponent } from "./comparative-statement/comparative-statement.component";
import { ComparativeStatementApprovalComponent } from "./comparative-statement-approval/comparative-statement-approval.component";
import { PurchaseRequisitionHOComponent } from "./purchase-requisition-ho/purchase-requisition-ho.component";
import { PurchaseRequisitionApprovelComponent } from "./purchase-requisition-approvel/purchase-requisition-approvel.component";
import { QuotationCollectionComponent } from "./quotation-collection/quotation-collection.component";
import { RequisitionFinalizeComponent } from "./requisition-finalize/requisition-finalize.component";
import { SupplierInfoComponent } from "./supplier-info/supplier-info.component";
import { GrnQaApprovalComponent } from './grn-qa-approval/grn-qa-approval.component';
import { GRNImportComponent } from "./Import/grnimport/grnimport.component";
import { GrnImportQcApprovalComponent } from './Import/grn-import-qc-approval/grn-import-qc-approval.component';
import { PurchaseRequFileUploadComponent } from './purchase-requ-file-upload/purchase-requ-file-upload.component';
import { GrnCreateForRejectedqtyComponent } from './grn-create-for-rejectedqty/grn-create-for-rejectedqty.component';
import { GrnImportForRejectedQtyComponent } from './Import/grn-import-for-rejected-qty/grn-import-for-rejected-qty.component';
import { BudgetCreateComponent } from './budget-create/budget-create.component';
import { RetestForGrnComponent } from './retest-for-grn/retest-for-grn.component';
import { GrnReportListComponent } from './settings/reports/grn-report-list/grn-report-list.component';
import { UserWiseProductTypeComponent } from './settings/user-wise-product-type/user-wise-product-type.component';
import { PurchaseApprovalMatrixComponent } from './settings/purchase-approval-matrix/purchase-approval-matrix.component';

const MODULES = [
  ThemeModule,
  CommonModule,
  FormsModule,
  NbInputModule,
  NbCardModule,
  NbButtonModule,
  NbActionsModule,
  NbUserModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbSelectModule,
  NbOptionModule,
  NbIconModule,
  NbAutocompleteModule,
  NbRadioModule,
  NbTabsetModule,
  NgSelectModule,
  Ng2SmartTableModule,
  FormsModule,
  HttpClientModule,
  AgGridModule.withComponents([]),
  NbToastrModule,
  AuthRoutingModule,
  NbAlertModule,
  PurchaseRoutingModule,
];

const COMPONENTS = [
  CommonButtonComponent,
  PurchaseComponent,
  ProductrequisitionComponent,
  PurchaserequisitionComponent,
  PurchaseorderComponent,
  RptHeaderComponent,
  RptFooterComponent,
  ReportButtonComponent,
  PurchaseorderreceiveComponent,
  PurchaseorderComponent,
  RptPurchaseorderheaderComponent,
  PurchasedirectComponent,
  PurchasereturnComponent,
  PurchaseOrderReportComponent,
  PreLcInfoComponent,
  LCInfoComponent,
  ChargeComponent,
  ClearenceComponent,
  LCAmendmentComponent,
  LCAmendmentChargeComponent,
  OtherOffshoreChargeComponent,
  ShipmentInfoComponent,
  ChargeHeadComponent,
  BenificiaryComponent,
  LocalAgentComponent,
  ModeOfTransportComponent,
  PortInfoComponent,
  AdviceBankComponent,
  CustomeClearenceComponent,
  BankClearenceComponent,
  OtherChargeComponent,
  BillCreateComponent,
  BillPaymentComponent,
  ComparativeStatementComponent,
  ComparativeStatementApprovalComponent,
  GrnCreateComponent,
  PurchaseRequisitionApprovelComponent,
  PurchaseRequisitionHOComponent,
  QuotationCollectionComponent,
  RequisitionFinalizeComponent,
  SupplierInfoComponent,
  PurchaseOrderSearchReportComponent,
  GrnQaApprovalComponent,
  GRNImportComponent
  , GrnImportQcApprovalComponent, GrnCreateForRejectedqtyComponent, GrnImportForRejectedQtyComponent
];
const SERVICES = [];

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS, PurchaseRequFileUploadComponent, BudgetCreateComponent, RetestForGrnComponent, GrnReportListComponent, UserWiseProductTypeComponent, PurchaseApprovalMatrixComponent],
  providers: [...SERVICES],
})
export class PurchaseModule { }
