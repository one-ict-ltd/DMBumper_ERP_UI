import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { SalesComponent } from "./sales.component";
import { SalesinvoiceComponent } from "./salesinvoice/salesinvoice.component";
import { BillcollectionComponent } from "./billcollection/billcollection.component";
import { SalesinvoicereportComponent } from "./reports/salesinvoicereport/salesinvoicereport.component";
import { CustomerledgerComponent } from "./reports/customerledger/customerledger.component";
import { BillcollectionreportComponent } from "./reports/billcollectionreport/billcollectionreport.component";
import { SalesofferComponent } from "./salesoffer/salesoffer.component";
import { PosComponent } from "./pos/pos.component";
import { SalesinvoiceserialComponent } from "./salesinvoiceserial/salesinvoiceserial.component";
import { SalesreturnComponent } from "./salesreturn/salesreturn.component";
import { SalesDistributionComponent } from "./sales-distribution/sales-distribution.component";
import { SalesDistributionApprovalComponent } from "./sales-distribution-approval/sales-distribution-approval.component";
import { SalesapprovalmatrixComponent } from "./salesapprovalmatrix/salesapprovalmatrix.component";
import { SalesInvoiceApprovalComponent } from "./sales-invoice-approval/sales-invoice-approval.component";
import { SalesInvoiceSearchReportComponent } from "./reports/sales-invoice-search-report/sales-invoice-search-report.component";
import { GeneralCustomerBonusPolicyComponent } from "./bonus-incentive-policy/general-customer-bonus-policy/general-customer-bonus-policy.component";
import { MangoCustomerBonusPolicyComponent } from "./bonus-incentive-policy/mango-customer-bonus-policy/mango-customer-bonus-policy.component";
import { ProductWiseIncentivePolicyComponent } from "./bonus-incentive-policy/product-wise-incentive-policy/product-wise-incentive-policy.component";
import { SalesPickingComponent } from "./sales-picking/sales-picking.component";
import { SalesDispatchComponent } from "./sales-dispatch/sales-dispatch.component";
import { SalesCollectionFromDispatchComponent } from "./sales-collection-from-dispatch/sales-collection-from-dispatch.component";
import { SalesDiscountRateComponent } from "./sales-discount-rate/sales-discount-rate.component";
import { SalesDiscountItemComponent } from "./sales-discount-item/sales-discount-item.component";
import { CustomerentryComponent } from "./customerentry/customerentry.component";
import { DepotWiseOfficerSalesCollectionBalanceComponent } from "./reports/depot-wise-officer-sales-collection-balance/depot-wise-officer-sales-collection-balance.component";
import { TerritoryOfficerWiseCustomerSalesCollectionBalanceComponent } from "./reports/territory-officer-wise-customer-sales-collection-balance/territory-officer-wise-customer-sales-collection-balance.component";
import { SalesRegisterReportComponent } from "./reports/sales-register-report/sales-register-report.component";
import { ProductWiseNationalSalesReportComponent } from "./reports/product-wise-national-sales-report/product-wise-national-sales-report.component";
import { ZoneRegionWiseSalesCollectionBalanceComponent } from "./reports/zone-region-wise-sales-collection-balance/zone-region-wise-sales-collection-balance.component";
import { DepotWiseSalesCollectionBalanceComponent } from "./reports/depot-wise-sales-collection-balance/depot-wise-sales-collection-balance.component";
import { SalesCollectionFromDispatchV2Component } from "./sales-collection-from-dispatch-v2/sales-collection-from-dispatch-v2.component";
import { SalesgrossreturnComponent } from "./salesgrossreturn/salesgrossreturn.component";
import { SalesdashboardComponent } from "./salesdashboard/salesdashboard.component";
import { CustomerWiseCollectionComponent } from "./reports/customer-wise-collection/customer-wise-collection.component";
import { CustomerWiseSalesCollectionDuesComponent } from "./reports/customer-wise-sales-collection-dues/customer-wise-sales-collection-dues.component";
import { CustomerWiseSalesCollectionDuesSummaryComponent } from "./reports/customer-wise-sales-collection-dues-summary/customer-wise-sales-collection-dues-summary.component";
import { DepotStockReportComponent } from "./reports/depot-stock-report/depot-stock-report.component";
import { ProductWiseSalesDuesComponent } from "./reports/product-wise-sales-dues/product-wise-sales-dues.component";
import { NationalProductSalesReportComponent } from "./reports/national-product-sales-report/national-product-sales-report.component";
import { SalesRemittanceComponent } from "./sales-remittance/sales-remittance.component";
import { SalesRemittanceSummaryComponent } from "./reports/sales-remittance-summary/sales-remittance-summary.component";
import { TerritoryOfficerWiseCollectionComponent } from "./reports/territory-officer-wise-collection/territory-officer-wise-collection.component";
import { MioProductWiseSalesComponent } from "./reports/mio-product-wise-sales/mio-product-wise-sales.component";
import { CustomerWiseCollectionSummaryComponent } from "./reports/customer-wise-collection-summary/customer-wise-collection-summary.component";
import { SalesRegisterPrintReportComponent } from "./reports/sales-register-print-report/sales-register-print-report.component";
import { MiosalestargetuploadComponent } from "./miosalestargetupload/miosalestargetupload.component";
import { TerritoryCollectionTargetComponent } from "./territory-collection-target/territory-collection-target.component";
import { SalesExpiredProductComponent } from "./sales-expired-product/sales-expired-product.component";
import { CollectionBonusReportComponent } from "./reports/collection-bonus-report/collection-bonus-report.component";
import { ProductMonitorComponent } from "./product-monitor/product-monitor.component";
import { ProductMonitorReportComponent } from "./reports/product-monitor-report/product-monitor-report.component";
import { WeeklyTargetComponent } from "./weekly-target/weekly-target.component";
import { TargetVsAchievementReportComponent } from "./reports/target-vs-achievement-report/target-vs-achievement-report.component";
import { ComparativeTargetVsAchievementComponent } from "./reports/comparative-target-vs-achievement/comparative-target-vs-achievement.component";
import { SalesTargetVsAchievementComponent } from "./reports/sales-target-vs-achievement/sales-target-vs-achievement.component";

import { MIOWiseSalesBudgetReportComponent } from "./reports/miowise-sales-budget-report/miowise-sales-budget-report.component";

import { CustomerWiseSalesCollectionDuesDaysComponent } from "./reports/customer-wise-sales-collection-dues-days/customer-wise-sales-collection-dues-days.component";
import { ProductWiseSalesBudgetReportComponent } from "./reports/product-wise-sales-budget-report/product-wise-sales-budget-report.component";
import { CsdAuditReportComponent } from "./reports/csd-audit-report/csd-audit-report.component";
import { MiscellaneousItemComponent } from "./miscellaneous-item/miscellaneous-item.component";
import { MiscellaneousItemForDepotComponent } from "./miscellaneous-item-for-depot/miscellaneous-item-for-depot.component";
import { MiscellaneousItemApprovalForDepotComponent } from "./miscellaneous-item-approval-for-depot/miscellaneous-item-approval-for-depot.component";
import { QuotationApprovalComponent } from "./quotation-approval/quotation-approval.component";
import { MIOWiseSalesBudgetReportWithSortComponent } from "./reports/miowise-sales-budget-report-with-sort/miowise-sales-budget-report-with-sort.component";
import { SalesCollectionMonthlyCompareReportComponent } from "./reports/sales-collection-monthly-compare-report/sales-collection-monthly-compare-report.component";
import { MioSalesBudgetReportCompareComponent } from "./reports/mio-sales-budget-report-compare/mio-sales-budget-report-compare.component";

import { FinishGoodAuditReportComponent } from "./reports/finish-good-audit-report/finish-good-audit-report.component";
import { SalesDispatchV2Component } from "./sales-dispatch-v2/sales-dispatch-v2.component";
import { CreditNoteComponent } from "./credit-note/credit-note.component";
import { GrossReturnMultipleComponent } from "./gross-return-multiple/gross-return-multiple.component";
import { MoneyReceiptNoteComponent } from "./money-receipt-note/money-receipt-note.component";
import { ProductVsVaccineSalesCompareReportComponent } from "./reports/product-vs-vaccine-sales-compare-report/product-vs-vaccine-sales-compare-report.component";
import { GrossReturnSummaryReportComponent } from "./reports/gross-return-summary-report/gross-return-summary-report.component";
import { PartyReportComponent } from "./reports/party-report/party-report.component";
import { CreditNoteReportComponent } from "./reports/credit-note-report/credit-note-report.component";
import { CreditNoteSummaryReportComponent } from "./reports/credit-note-summary-report/credit-note-summary-report.component";
import { MiscellaneousReportComponent } from "./reports/miscellaneous-report/miscellaneous-report.component";
import { ProductReturnSummaryReportComponent } from "./reports/product-return-summary-report/product-return-summary-report.component";
import { SalesProductReturnComponent } from "./reports/sales-product-return/sales-product-return.component";
import { DepotStockWithValueReportComponent } from "./reports/depot-stock-with-value-report/depot-stock-with-value-report.component";
import { InvoiceGDNConfirmationComponent } from "./invoice-gdnconfirmation/invoice-gdnconfirmation.component";
import { DamageExpireProductReturnComponent } from "./damage-expire-product-return/damage-expire-product-return.component";
import { PartyObservationComponent } from "./party-observation/party-observation.component";
import { CustomerObserbationEntryComponent } from "./customer-obserbation-entry/customer-obserbation-entry.component";
import { DestructionNoteReportComponent } from "./reports/destruction-note-report/destruction-note-report.component";
import { SalesCollectionForAdminComponent } from "./sales-collection-for-admin/sales-collection-for-admin.component";
import { DestructionNoteApprovalComponent } from "./destruction-note-approval/destruction-note-approval.component";
import { DestructionNoteReceiveComponent } from "./destruction-note-receive/destruction-note-receive.component";
import { DepotStockReportTransactionalComponent } from "./reports/depot-stock-report-transactional/depot-stock-report-transactional.component";
import { NationalStockReportWeightWiseComponent } from "./reports/national-stock-report-weight-wise/national-stock-report-weight-wise.component";
import { SalesReportNationallyComponent } from "./reports/sales-report-nationally/sales-report-nationally.component";
import { NationalPerformanceReportComponent } from "./reports/national-performance-report/national-performance-report.component";
import { DailyMonthlyYearlyCollectionAndDuesComponent } from "./reports/daily-monthly-yearly-collection-and-dues/daily-monthly-yearly-collection-and-dues.component";
import { CashInhandReportComponent } from "./reports/cash-inhand-report/cash-inhand-report.component";
import { NationalSalesClosingStatementComponent } from "./reports/national-sales-closing-statement/national-sales-closing-statement.component";
import { MoneyReceiptComponent } from "./money-receipt/money-receipt.component";
import { SalesCategoryWiseProductComponent } from "./sales-category-wise-product/sales-category-wise-product.component";
import { OutstandingMonitorReportComponent } from "./reports/outstanding-monitor-report/outstanding-monitor-report.component";
import { CustomerWiseProductDiscountComponent } from "./customer-wise-product-discount/customer-wise-product-discount.component";
import { PromoStockReportComponent } from "./reports/promo-stock-report/promo-stock-report.component";
import { DealProductEntryComponent } from "./deal-product-entry/deal-product-entry.component";
import { ApprovalTypeComponent } from "./settings/approvaltype/approvaltype.component";
import { ApproverTypeComponent } from "./settings/approvertype/approvertype.component";
import { FlatRateEntryComponent } from "./flat-rate-entry/flat-rate-entry.component";
import { NationalSalesReportComponent } from "./reports/national-sales-report/national-sales-report.component";
import { SalFfWiseReportComponent } from "./reports/sal-ff-wise-report/sal-ff-wise-report.component";
import { CustomerWiseSalesReportComponent } from "./reports/customer-wise-sales-report/customer-wise-sales-report.component";
import { UpdateFfsReportComponent } from "./reports/update-ffs-report/update-ffs-report.component";
import { PartyWiseDiscountPolicyViewComponent } from "./party-wise-discount-policy-view/party-wise-discount-policy-view.component";
import { GenerateSalesInvoiceBySalesOrderComponent } from "./generate-sales-invoice-by-sales-order/generate-sales-invoice-by-sales-order.component";
import { PmStockReportComponent } from "./reports/pm-stock-report/pm-stock-report.component";
import { RmStockReportComponent } from "./reports/rm-stock-report/rm-stock-report.component";
import { MiscellaneousStockDetailsComponent } from "./reports/miscellaneous-stock-details/miscellaneous-stock-details.component";
import { BrandWiseSalesVsTargetAchComponent } from "./reports/brand-wise-sales-vs-target-ach/brand-wise-sales-vs-target-ach.component";
import { MarketExpireProductReturnComponent } from "./market-expire-product-return/market-expire-product-return.component";
import { TerritorySalesTransferComponent } from "./territory-sales-transfer/territory-sales-transfer.component";
import { TerritoryOfficerWiseSalesColBalanceComponent } from "./reports/territory-officer-wise-sales-col-balance/territory-officer-wise-sales-col-balance.component";
import { SalesPmdReportComponent } from "./reports/sales-pmd-report/sales-pmd-report.component";
import { FrizzProductForTransactionComponent } from "./frizz-product-for-transaction/frizz-product-for-transaction.component";
import { DealnotapplicablecustomerandinstituteComponent } from "./dealnotapplicablecustomerandinstitute/dealnotapplicablecustomerandinstitute.component";
import { UpdateAppVersionComponent } from "./update-app-version/update-app-version.component";
import { SalesCollectionFromDispatchV2DeleteOnlyComponent } from "./sales-collection-from-dispatch-v2-delete-only/sales-collection-from-dispatch-v2-delete-only.component";
import { MoneyReceiptNoteDeleteComponent } from "./money-receipt-note-delete/money-receipt-note-delete.component";
import { RemittanceDeleteComponent } from "./remittance-delete/remittance-delete.component";
import { RepackProductIssueComponent } from "./repack-product-issue/repack-product-issue.component";
import { RepackProductReceiveComponent } from "./repack-product-receive/repack-product-receive.component";
import { SalesHoldForCustomerComponent } from "./sales-hold-for-customer/sales-hold-for-customer.component";
import { ExpenseDashboardComponent } from "./expense-dashboard/expense-dashboard.component";
import { RaStockReportComponent } from "./reports/ra-stock-report/ra-stock-report.component";
import { PartyWiseDiscountReportComponent } from "./reports/party-wise-discount-report/party-wise-discount-report.component";
import { DepotWiseDiscountSummeryComponent } from "./reports/depot-wise-discount-summery/depot-wise-discount-summery.component";
import { ProductWiseDiscountReportComponent } from "./reports/product-wise-discount-report/product-wise-discount-report.component";
import { NationalLmsalesCmclosingStatementComponent } from "./reports/national-lmsales-cmclosing-statement/national-lmsales-cmclosing-statement.component";
import { ExecutiveTeamComponent } from "./executive-team/executive-team.component";
import { ExecutiveWiseProductComponent } from "./executive-wise-product/executive-wise-product.component";
import { ProductWiseGrossReturnComponent } from "./reports/product-wise-gross-return/product-wise-gross-return.component";
import { DepotStationaryStockReportComponent } from "./reports/depot-stationary-stock-report/depot-stationary-stock-report.component";
import { NewCategoryWiseSalesVsTargetAchComponent } from './reports/new-category-wise-sales-vs-target-ach/new-category-wise-sales-vs-target-ach.component';
import { TerritoryWiseOfficerSalesCollectionBalanceComponent } from './reports/territory-wise-officer-sales-collection-balance/territory-wise-officer-sales-collection-balance.component';
import { QuotationComponent } from './quotation/quotation.component';
import { ChallanEntryComponent } from './challan-entry/challan-entry.component';
import { BillEntryComponent } from './bill-entry/bill-entry.component';
import { ChallanEntryWihoutQuotationComponent } from './challan-entry-wihout-quotation/challan-entry-wihout-quotation.component';
const routes: Routes = [
  {
    path: "",
    component: SalesComponent,
    children: [
      {
        path: "sales",
        component: SalesComponent,
      },
      {
        path: "pos",
        component: PosComponent,
      },
      {
        path: "salesinvoice",
        component: SalesinvoiceComponent,
      },
      {
        path: "salesoffer",
        component: SalesofferComponent,
      },
      {
        path: "billcollection",
        component: BillcollectionComponent,
      },
      {
        path: "salesinvoicereport",
        component: SalesinvoicereportComponent,
      },
      {
        path: "customerledger",
        component: CustomerledgerComponent,
      },
      {
        path: "billcollectionreport",
        component: BillcollectionreportComponent,
      },
      {
        path: "salesinvoiceserial",
        component: SalesinvoiceserialComponent,
      },
      {
        path: "salesreturn",
        component: SalesreturnComponent,
      },
      {
        path: "salesgrossreturn",
        component: SalesgrossreturnComponent,
      },
      {
        path: "gross-return-multiple",
        component: GrossReturnMultipleComponent,
      },
      {
        path: "sales-expired-product",
        component: SalesExpiredProductComponent,
      },
      {
        path: "sales-distribution",
        component: SalesDistributionComponent,
      },
      {
        path: "sales-distribution-approval",
        component: SalesDistributionApprovalComponent,
      },
      {
        path: "salesapprovalmatrix",
        component: SalesapprovalmatrixComponent,
      },
      {
        path: "sales-invoice-approval",
        component: SalesInvoiceApprovalComponent,
      },
      {
        path: "sales-picking",
        component: SalesPickingComponent,
      },
      {
        path: "sales-dispatch",
        component: SalesDispatchComponent,
      },
      {
        path: "sales-collectionfromdispatch",
        component: SalesCollectionFromDispatchComponent,
      },
      {
        path: "sales-invoice-search-report",
        component: SalesInvoiceSearchReportComponent,
      },
      {
        path: "general-customer-bonus-policy",
        component: GeneralCustomerBonusPolicyComponent,
      },
      {
        path: "mango-customer-bonus-policy",
        component: MangoCustomerBonusPolicyComponent,
      },
      {
        path: "product-wise-incentive-policy",
        component: ProductWiseIncentivePolicyComponent,
      },
      {
        path: "sales-Discount-Rate",
        component: SalesDiscountRateComponent,
      },
      {
        path: "sales-Discount-Item",
        component: SalesDiscountItemComponent,
      },
      {
        path: "customerentry",
        component: CustomerentryComponent,
      },
      {
        path: "party-observation",
        component: PartyObservationComponent,
      },

      {
        path: "depot-wise-officer-sales-collection-balance",
        component: DepotWiseOfficerSalesCollectionBalanceComponent,
      },
      {
        path: "territory-officer-wise-customer-sales-collection-balance",
        component: TerritoryOfficerWiseCustomerSalesCollectionBalanceComponent,
      },
      {
        path: "sales-register-report",
        component: SalesRegisterReportComponent,
      },
      {
        path: "product-wise-national-sales-report",
        component: ProductWiseNationalSalesReportComponent,
      },
      {
        path: "national-product-sales-report",
        component: NationalProductSalesReportComponent,
      },
      {
        path: "zone-region-wise-sales-collection-balance",
        component: ZoneRegionWiseSalesCollectionBalanceComponent,
      },
      {
        path: "depot-wise-sales-collection-balance",
        component: DepotWiseSalesCollectionBalanceComponent,
      },
      {
        path: "sales-collection-from-dispatch-v2",
        component: SalesCollectionFromDispatchV2Component,
      },
      {
        path: "Salesdashboard",
        component: SalesdashboardComponent,
      },
      {
        path: "CustomerWiseCollection",
        component: CustomerWiseCollectionComponent,
      },
      {
        path: "CustomerWiseSalesCollectionDues",
        component: CustomerWiseSalesCollectionDuesComponent,
      },
      {
        path: "CustomerWiseSalesCollectionDuesDays",
        component: CustomerWiseSalesCollectionDuesDaysComponent,
      },
      {
        path: "CustomerWiseSalesCollectionDuesSummary",
        component: CustomerWiseSalesCollectionDuesSummaryComponent,
      },
      {
        path: "CustomerWiseProductDiscount",
        component: CustomerWiseProductDiscountComponent,
      },
      {
        path: "DepotStockReport",
        component: DepotStockReportComponent,
      },
      {
        path: "ProductWiseSalesDues",
        component: ProductWiseSalesDuesComponent,
      },
      {
        path: "remittance",
        component: SalesRemittanceComponent,
      },
      {
        path: "remittance-summary",
        component: SalesRemittanceSummaryComponent,
      },
      {
        path: "cash-inhand-report",
        component: CashInhandReportComponent,
      },
      {
        path: "TerritoryOfficerWiseCollection",
        component: TerritoryOfficerWiseCollectionComponent,
      },
      {
        path: "mio-product-wise-sales-report",
        component: MioProductWiseSalesComponent,
      },
      {
        path: "sales-register-print-report",
        component: SalesRegisterPrintReportComponent,
      },
      {
        path: "customer-wise-collection-summary",
        component: CustomerWiseCollectionSummaryComponent,
      },
      {
        path: "mio-sales-target-upload",
        component: MiosalestargetuploadComponent,
      },
      {
        path: "product-wise-sales-budget-report",
        component: ProductWiseSalesBudgetReportComponent,
      },
      {
        path: "collection-bonus-report",
        component: CollectionBonusReportComponent,
      },
      {
        path: "territory-collection-target",
        component: TerritoryCollectionTargetComponent,
      },
      {
        path: "product-monitor",
        component: ProductMonitorComponent,
      },
      {
        path: "weekly-target-setup",
        component: WeeklyTargetComponent,
      },
      {
        path: "product-monitor-report",
        component: ProductMonitorReportComponent,
      },
      { path: "sales-dispatch-v2", component: SalesDispatchV2Component },
      { path: "credit-note", component: CreditNoteComponent },
      { path: "miscellaneous-item", component: MiscellaneousItemComponent },
      { path: "outstanding-monitor-report", component: OutstandingMonitorReportComponent },
      {
        path: "miscellaneous-item-for-depot",
        component: MiscellaneousItemForDepotComponent,
      },
      {
        path: "miscellaneous-item-approval-for-depot",
        component: MiscellaneousItemApprovalForDepotComponent,
      },
      {
        path: "quotation-approval",
        component: QuotationApprovalComponent,
      },
      {
        path: "target-vs-achievement",
        component: TargetVsAchievementReportComponent,
      },
      {
        path: "sales-target-vs-achievement",
        component: SalesTargetVsAchievementComponent,
      }, {
        path: "brand-wise-sales-vs-target-ach",
        component: BrandWiseSalesVsTargetAchComponent,
      },
      {
        path: "miowise-sales-budget-report",
        component: MIOWiseSalesBudgetReportComponent,
      },
      {
        path: "miowise-sales-budget-report-with-sort",
        component: MIOWiseSalesBudgetReportWithSortComponent,
      },
      {
        path: "mio-sales-budget-report-compare",
        component: MioSalesBudgetReportCompareComponent,
      },
      { path: "money-receipt-note", component: MoneyReceiptNoteComponent },
      {
        path: "product-vs-vaccine-sales-compare-report",
        component: ProductVsVaccineSalesCompareReportComponent,
      },
      {
        path: "gross-return-summary-report",
        component: GrossReturnSummaryReportComponent,
      },
      { path: "credit-note-report", component: CreditNoteReportComponent },
      {
        path: "credit-note-summary-report",
        component: CreditNoteSummaryReportComponent,
      },
      { path: "party-report", component: PartyReportComponent },
      { path: "miscellaneous-report", component: MiscellaneousReportComponent },
      {
        path: "destruction-note-report",
        component: DestructionNoteReportComponent,
      },
      {
        path: "sales-collection-from-dispatch-v2-admin",
        component: SalesCollectionForAdminComponent,
      },
      {
        path: "destruction-note-approval",
        component: DestructionNoteApprovalComponent,
      },
      {
        path: "destruction-note-receive",
        component: DestructionNoteReceiveComponent,
      },
      {
        path: "depot-stock-report-transactional",
        component: DepotStockReportTransactionalComponent,
      },
      {
        path: "national-stock-report-weight-wise",
        component: NationalStockReportWeightWiseComponent,
      },
      {
        path: "national-performance-report",
        component: NationalPerformanceReportComponent,
      },
      {
        path: "comparative-target-vs-achievement",
        component: ComparativeTargetVsAchievementComponent,
      },
      {
        path: "csd-audit-report",
        component: CsdAuditReportComponent,
      },
      {
        path: "sc-monthly-compare-report",
        component: SalesCollectionMonthlyCompareReportComponent,
      },
      {
        path: "finish-goods-audit-report",
        component: FinishGoodAuditReportComponent,
      },
      {
        path: "product-return-summary-report",
        component: ProductReturnSummaryReportComponent,
      },
      {
        path: "sales-product-return-report",
        component: SalesProductReturnComponent,
      },
      {
        path: "depot-stock-with-value-report",
        component: DepotStockWithValueReportComponent,
      },
      {
        path: "invoice-gdnconfirmation",
        component: InvoiceGDNConfirmationComponent,
      },
      {
        path: "damage-expire-return",
        component: DamageExpireProductReturnComponent,
      },
      {
        path: "sales-report-nationally",
        component: SalesReportNationallyComponent,
      },
      {
        path: "dic-customer-entry",
        component: CustomerObserbationEntryComponent,
      },
      {
        path: "daily-monthly-yearly-sales-collection-and-dues",
        component: DailyMonthlyYearlyCollectionAndDuesComponent,
      },
      {
        path: "national-sales-closing-statement",
        component: NationalSalesClosingStatementComponent,
      },
      {
        path: "national-lmsales-cmclosing-statement",
        component: NationalLmsalesCmclosingStatementComponent,
      },
      {
        path: "money-receipt",
        component: MoneyReceiptComponent,
      },
      {
        path: "sales-category-wise-product",
        component: SalesCategoryWiseProductComponent,
      },
      {
        path: "promo-stock-report",
        component: PromoStockReportComponent
      },
      {
        path: "deal-product-entry",
        component: DealProductEntryComponent
      },
      {
        path: "approvaltype",
        component: ApprovalTypeComponent,
      },
      {
        path: "approvertype",
        component: ApproverTypeComponent,
      },
      {
        path: "flat-rate-entry",
        component: FlatRateEntryComponent
      },
      {
        path: 'national-sales-report',
        component: NationalSalesReportComponent
      },
      {
        path: 'ff-wise-sales-report',
        component: SalFfWiseReportComponent
      },
      {
        path: 'customer-wise-sales-report',
        component: CustomerWiseSalesReportComponent
      },
      {
        path: 'update-ffs-report',
        component: UpdateFfsReportComponent
      },
      {
        path: 'party-wise-discount-policy-view',
        component: PartyWiseDiscountPolicyViewComponent
      },
      { path: 'generate-sales-invoice-by-sales-order', component: GenerateSalesInvoiceBySalesOrderComponent }
      ,
      {
        path: "pm-stock-report",
        component: PmStockReportComponent,
      },
      {
        path: "rm-stock-report",
        component: RmStockReportComponent,
      },
      {
        path: "ra-stock-report",
        component: RaStockReportComponent,
      },
      {
        path: 'miscellaneous-stock-details',
        component: MiscellaneousStockDetailsComponent
      },
      {
        path: 'market-expire-return',
        component: MarketExpireProductReturnComponent
      },
      {
        path: 'territory-sales-transfer',
        component: TerritorySalesTransferComponent
      },
      {
        path: 'territory-officer-wise-sales-col-balance',
        component: TerritoryOfficerWiseSalesColBalanceComponent
      },
      {
        path: 'Dealnotapplicablecustomerandinstitute',
        component: DealnotapplicablecustomerandinstituteComponent
      }, {
        path: 'sales-pmd-report', component: SalesPmdReportComponent
      }, { path: 'frizz-product-for-transaction', component: FrizzProductForTransactionComponent },
      { path: 'update-app-version', component: UpdateAppVersionComponent },
      { path: "sales-collection-from-dispatch-delete-only", component: SalesCollectionFromDispatchV2DeleteOnlyComponent },
      { path: 'money-receipt-note-delete', component: MoneyReceiptNoteDeleteComponent },
      { path: 'remittance-delete', component: RemittanceDeleteComponent },
      { path: 'expense-dashboard', component: ExpenseDashboardComponent },
      { path: 'sales-hold-for-customer', component: SalesHoldForCustomerComponent },
      { path: 'repack-product-issue', component: RepackProductIssueComponent },
      { path: 'repack-product-receive', component: RepackProductReceiveComponent },
      { path: 'party-wise-discount-report', component: PartyWiseDiscountReportComponent },
      { path: 'depot-wise-discount-summery', component: DepotWiseDiscountSummeryComponent },
      { path: 'product-wise-discount-report', component: ProductWiseDiscountReportComponent },
      { path: 'executive-team', component: ExecutiveTeamComponent },
      { path: 'executive-wise-product', component: ExecutiveWiseProductComponent },
      { path: 'product-wise-gross-return', component: ProductWiseGrossReturnComponent },
      { path: 'depot-stationary-stock-report', component: DepotStationaryStockReportComponent },
      { path: 'new-category-wise-sales-vs-target-ach', component: NewCategoryWiseSalesVsTargetAchComponent },
      { path: 'territory-wise-officer-sales-collection-balance', component: TerritoryWiseOfficerSalesCollectionBalanceComponent },
      { path: 'quotation', component: QuotationComponent },
      { path: 'challan-entry', component: ChallanEntryComponent },
      { path: 'challan-entry-without-quotation', component: ChallanEntryWihoutQuotationComponent },
      { path: 'bill-entry', component: BillEntryComponent }



    ],
  },
];

// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule { }
