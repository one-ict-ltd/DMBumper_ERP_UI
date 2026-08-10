import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductionRoutingModule } from './production-routing.module';
import { ProductionComponent } from './production.component';
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

} from '@nebular/theme';

import { ThemeModule } from 'app/@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';

import { AuthRoutingModule } from 'app/auth/auth-routing.module';
import { CommonButtonComponent } from './settings/common/common-button/common-button.component';
import { ReportButtonComponent } from './settings/common/report-button/report-button.component';
import { RptFooterComponent } from './settings/common/rpt-footer/rpt-footer.component';
import { RptHeaderComponent } from './settings/common/rpt-header/rpt-header.component';
import { RptHeaderLandscapeComponent } from './settings/common/rpt-header-landscape/rpt-header-landscape.component';
import { BomComponent } from './bom/bom.component';
import { BomFinishGoodStockInComponent } from './bom-finish-good-stock-in/bom-finish-good-stock-in.component';
import { ProductionProcessHeadComponent } from './production-process-head/production-process-head.component';
import { RequisitionForRMComponent } from './requisition/requisition-for-rm/requisition-for-rm.component';
import { MachineInfoComponent } from './machine-info/machine-info.component';
import { RmIssueComponent } from './requisition/rm-issue/rm-issue.component';
import { RequisitionForPMComponent } from './requisition/requisition-for-pm/requisition-for-pm.component';
import { ProductionPlanComponent } from './production-plan/production-plan.component';
import { ProcessHeadGroupComponent } from './process-head-group/process-head-group.component';
import { ProductGroupAssignComponent } from './product-group-assign/product-group-assign.component';
import { SharedPipeModule } from "app/pipes/shared-pipe.module"; import { RmReceiveComponent } from './requisition/rm-receive/rm-receive.component';
import { ProductionProcessComponent } from './production-process/production-process.component';
import { TransferNotesComponent } from './requisition/transfer-notes/transfer-notes.component';
import { MachineCleningMaintenenceComponent } from './machine-clening-maintenence/machine-clening-maintenence.component';
import { ProductionQaApprovalComponent } from './production-qa-approval/production-qa-approval.component';
import { PmIssueComponent } from './requisition/pm-issue/pm-issue.component';
import { BomApprovalComponent } from './bom-approval/bom-approval.component';
import { BomApprovalListComponent } from './bom-approval-list/bom-approval-list.component';
import { ProductionAchievementComponent } from './reports/production-achievement/production-achievement.component';
import { BlankTemplateComponent } from './reports/blank-template/blank-template.component';
import { ProductWiseRmStockComponent } from './reports/product-wise-rm-stock/product-wise-rm-stock.component';
import { ProductWisePmStockComponent } from './reports/product-wise-pm-stock/product-wise-pm-stock.component';
import { ProductionplanReportFromDateRangeComponent } from './reports/productionplan-report-from-date-range/productionplan-report-from-date-range.component';
import { BatchStatusReportComponent } from './reports/batch-status-report/batch-status-report.component';
import { MaterialReturnComponent } from './requisition/material-return/material-return.component';
import { MaterialReceiveFromReturnComponent } from './requisition/material-receive-from-return/material-receive-from-return.component';
import { ProductionPlanApprovalComponent } from './production-plan-approval/production-plan-approval.component';
import { BatchReleaseComponent } from './batch-release/batch-release.component';
import { StockInFromProductionByBatchComponent } from './stock-in-from-production-by-batch/stock-in-from-production-by-batch.component';
import { ProductwiseRMPMStockReportComponent } from './reports/productwise-rmpm-stock-report/productwise-rmpm-stock-report.component';
import { BomActiveInactiveComponent } from './bom-active-inactive/bom-active-inactive.component';
import { ProductionPlanProcessReportByDateRangeComponent } from './reports/production-plan-process-report-by-date-range/production-plan-process-report-by-date-range.component';
import { ReagentRequisitionComponent } from './requisition/reagent-requisition/reagent-requisition.component';
import { ReagentIssueComponent } from './requisition/reagent-issue/reagent-issue.component';
import { ReagentReceiveComponent } from './requisition/reagent-receive/reagent-receive.component';



const MODULES = [
  ThemeModule,
  CommonModule,
  FormsModule,
  NbInputModule,
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
  HttpClientModule,
  AgGridModule.withComponents([]),
  NbToastrModule,
  AuthRoutingModule,
  NbAlertModule,
  NbCardModule,
  ProductionRoutingModule,
  SharedPipeModule
];

const COMPONENTS = [
  CommonButtonComponent,
  ReportButtonComponent,
  RptFooterComponent,
  RptHeaderComponent,
  RptHeaderLandscapeComponent,
  ProductionComponent,
  BomComponent,
  ProductionProcessHeadComponent,
  RequisitionForRMComponent,
  MachineInfoComponent,
  RmIssueComponent,
  RequisitionForPMComponent,
  BomFinishGoodStockInComponent,
  ProductionPlanComponent,
  RmReceiveComponent,
  BomFinishGoodStockInComponent, ProcessHeadGroupComponent, ProductGroupAssignComponent, ProductionProcessComponent,
  BomFinishGoodStockInComponent,
  ProcessHeadGroupComponent,
  ProductGroupAssignComponent,
  TransferNotesComponent,
  MachineCleningMaintenenceComponent,
  ProductionQaApprovalComponent,
  PmIssueComponent,
  BomApprovalComponent,
  BomApprovalListComponent, ProductionAchievementComponent, BlankTemplateComponent, ProductWiseRmStockComponent, ProductWisePmStockComponent, ProductionplanReportFromDateRangeComponent, BatchStatusReportComponent, MaterialReturnComponent, MaterialReceiveFromReturnComponent, ProductionPlanApprovalComponent, BatchReleaseComponent, StockInFromProductionByBatchComponent, ProductwiseRMPMStockReportComponent, BomActiveInactiveComponent, ProductionPlanProcessReportByDateRangeComponent
];

const SERVICES = [];

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS, ReagentRequisitionComponent, ReagentIssueComponent, ReagentReceiveComponent],
  providers: [...SERVICES],
})

export class ProductionModule { }
