import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProductionComponent } from './production.component';
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
import { RmReceiveComponent } from './requisition/rm-receive/rm-receive.component';
import { ProductionProcessComponent } from './production-process/production-process.component';
import { TransferNotesComponent } from './requisition/transfer-notes/transfer-notes.component';
import { MachineCleningMaintenenceComponent } from './machine-clening-maintenence/machine-clening-maintenence.component';
import { ProductionQaApprovalComponent } from './production-qa-approval/production-qa-approval.component';
import { PmIssueComponent } from './requisition/pm-issue/pm-issue.component';
import { BomApprovalComponent } from './bom-approval/bom-approval.component';
import { BomApprovalListComponent } from './bom-approval-list/bom-approval-list.component';
import { ProductionAchievementComponent } from './reports/production-achievement/production-achievement.component';
import { ProductWisePmStockComponent } from './reports/product-wise-pm-stock/product-wise-pm-stock.component';
import { ProductWiseRmStockComponent } from './reports/product-wise-rm-stock/product-wise-rm-stock.component';
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

const routes: Routes = [{
  path: '',
  component: ProductionComponent,
  children: [
    {
      path: 'production',
      component: ProductionComponent,
    },
    {
      path: 'production-plan',
      component: ProductionPlanComponent,
    },
    {
      path: 'production-process',
      component: ProductionProcessComponent,
    },
    {
      path: 'bom',
      component: BomComponent,
    },
    {
      path: 'bom-finish-good-stock-in',
      component: BomFinishGoodStockInComponent,
    },
    {
      path: 'production-process-head',
      component: ProductionProcessHeadComponent,
    },
    {
      path: 'process-head-group',
      component: ProcessHeadGroupComponent,
    },
    {
      path: 'product-group-assign',
      component: ProductGroupAssignComponent,
    },
    {
      path: 'requisition-for-rm',
      component: RequisitionForRMComponent,
    },
    {
      path: 'machine-info',
      component: MachineInfoComponent,
    },
    {
      path: 'rm-issue',
      component: RmIssueComponent,
    },
    {
      path: 'pm-issue',
      component: PmIssueComponent,
    },
    {
      path: 'requisition-for-pm',
      component: RequisitionForPMComponent,
    },
    {
      path: 'rm-receive',
      component: RmReceiveComponent,
    },
    {
      path: 'transfer-Note',
      component: TransferNotesComponent,
    },
    {
      path: 'Machine-Clening-Maintenance',
      component: MachineCleningMaintenenceComponent,
    },
    {
      path: 'production-qa-approval',
      component: ProductionQaApprovalComponent,
    },
    {
      path: 'bom-approval',
      component: BomApprovalComponent,
    },
    {
      path: 'bom-approval-list',
      component: BomApprovalListComponent,
    }
    , { path: 'production-achievement', component: ProductionAchievementComponent, }
    , { path: 'product-wise-rm-stock', component: ProductWiseRmStockComponent, }
    , { path: 'product-wise-pm-stock', component: ProductWisePmStockComponent, }
    , { path: 'productionplan-report-from-date-range', component: ProductionplanReportFromDateRangeComponent, }
    , { path: 'batch-status-report', component: BatchStatusReportComponent, }
    , { path: 'material-return', component: MaterialReturnComponent, }
    , { path: 'material-receive-from-return', component: MaterialReceiveFromReturnComponent, }
    , { path: 'production-plan-approval', component: ProductionPlanApprovalComponent, }
    , { path: 'batch-release', component: BatchReleaseComponent, }
    , { path: 'stock-in-from-production-by-batch', component: StockInFromProductionByBatchComponent, }
    , { path: 'productwiseRMPMStockReport', component: ProductwiseRMPMStockReportComponent, }
    , { path: 'bom-active-inactive', component: BomActiveInactiveComponent, }
    , { path: 'production-plan-process-report-by-date-range', component: ProductionPlanProcessReportByDateRangeComponent, }
    , { path: 'reagent-requisition', component: ReagentRequisitionComponent }
    , { path: 'reagent-issue', component: ReagentIssueComponent }
    , { path: 'reagent-receive', component: ReagentReceiveComponent }

  ]
}];

// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionRoutingModule { }
