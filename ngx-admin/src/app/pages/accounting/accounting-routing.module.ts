import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountgroupComponent } from './settings/accountgroup/accountgroup.component';
import { AccountnatureComponent } from './settings/accountnature/accountnature.component';
import { CreateVoucherComponent } from './settings/create-voucher/create-voucher.component';
import { CurrencyComponent } from './settings/currency/currency.component';
import { FundsourceComponent } from './settings/fundsource/fundsource.component';
import { LedgertypeComponent } from './settings/ledgertype/ledgertype.component';
import { TransactionmodeComponent } from './settings/transactionmode/transactionmode.component';
import { VouchertypeComponent } from './settings/vouchertype/vouchertype.component';
import { AccountingComponent } from './accounting.component';

import { PartyComponent } from './settings/party/party.component';
import { CostcentreComponent } from './settings/costcentre/costcentre.component';

import { LedgerComponent } from './settings/ledger/ledger.component';
import { LedgeropeningbalanceComponent } from './settings/ledgeropeningbalance/ledgeropeningbalance.component';
import { RptCoaComponent } from './reports/rpt-coa/rpt-coa.component';
import { VoucherComponent } from './transaction/voucher/voucher.component';
import { CostcentremappingComponent } from './settings/costcentremapping/costcentremapping.component';
import { RptDaybookComponent } from './reports/rpt-daybook/rpt-daybook.component';
import { RptLegderbookComponent } from './reports/rpt-legderbook/rpt-legderbook.component';
import { RptTrialbalanceComponent } from './reports/rpt-trialbalance/rpt-trialbalance.component';
import { RptIncomestatementComponent } from './reports/rpt-incomestatement/rpt-incomestatement.component';
import { RptVoucherpreviewComponent } from './reports/rpt-voucherpreview/rpt-voucherpreview.component';
import { NotemasterblsheetComponent } from './settings/notemasterblsheet/notemasterblsheet.component';
import { NotedetailsblsheetComponent } from './settings/notedetailsblsheet/notedetailsblsheet.component';
import { NotemastercashflowdirectComponent } from './settings/notemastercashflowdirect/notemastercashflowdirect.component';
import { NotedetailscashflowdirectComponent } from './settings/notedetailscashflowdirect/notedetailscashflowdirect.component';
import { NotemastercashflowindirectComponent } from './settings/notemastercashflowindirect/notemastercashflowindirect.component';
import { NotedetailscashflowindirectComponent } from './settings/notedetailscashflowindirect/notedetailscashflowindirect.component';
import { RptBalancesheetComponent } from './reports/rpt-balancesheet/rpt-balancesheet.component';
import { RptCashflowdirectComponent } from './reports/rpt-cashflowdirect/rpt-cashflowdirect.component';
import { RptCashflowindirectComponent } from './reports/rpt-cashflowindirect/rpt-cashflowindirect.component';
import { RptPaymentreceivedComponent } from './reports/rpt-paymentreceived/rpt-paymentreceived.component';
import { ChequebookComponent } from './transaction/chequebook/chequebook.component';
import { RptCashbookComponent } from './reports/rpt-cashbook/rpt-cashbook.component';
import { RptBankbookComponent } from './reports/rpt-bankbook/rpt-bankbook.component';

import { BudgetmainheadComponent } from './budget/budgetmainhead/budgetmainhead.component';
import { FiscalyearComponent } from './budget/fiscalyear/fiscalyear.component';
import { BudgetsubheadComponent } from './budget/budgetsubhead/budgetsubhead.component';
import { BudgetheadComponent } from './budget/budgethead/budgethead.component';
import { BudgetcreateComponent } from './budget/budgetcreate/budgetcreate.component';
import { NotemasterincomestmentComponent } from './settings/notemasterincomestment/notemasterincomestment.component';
import { NotedetailsincomestmentComponent } from './settings/notedetailsincomestment/notedetailsincomestment.component';
import { RptIncomestmentgrossformatComponent } from './reports/rpt-incomestmentgrossformat/rpt-incomestmentgrossformat.component';
import { PaymentvoucherComponent } from './transaction/paymentvoucher/paymentvoucher.component';
import { ReceivevoucherComponent } from './transaction/receivevoucher/receivevoucher.component';
import { JournalvoucherComponent } from './transaction/journalvoucher/journalvoucher.component';
import { ContravoucherComponent } from './transaction/contravoucher/contravoucher.component';
import { VisaworkorderComponent } from './transaction/visaworkorder/visaworkorder.component';
import { VisaworkorderpostingComponent } from './transaction/visaworkorderposting/visaworkorderposting.component';
import { AutovouchersettingComponent } from './settings/autovouchersetting/autovouchersetting.component';
import { AccountdashboardComponent } from './transaction/accountdashboard/accountdashboard.component';
import { VisasalesComponent } from './transaction/visasales/visasales.component';
import { RptPartyledgerbookComponent } from './reports/rpt-partyledgerbook/rpt-partyledgerbook.component';
import { VisasalespostingComponent } from './transaction/visasalesposting/visasalesposting.component';
import { RptVisastockComponent } from './reports/rpt-visastock/rpt-visastock.component';
import { RptVisapurchaseComponent } from './reports/rpt-visapurchase/rpt-visapurchase.component';
import { RptVisasalesComponent } from './reports/rpt-visasales/rpt-visasales.component';
import { RptPaymentreceivenewComponent } from './reports/rpt-paymentreceivenew/rpt-paymentreceivenew.component';
import { RptBalancesheetifrsComponent } from './reports/rpt-balancesheetifrs/rpt-balancesheetifrs.component';
import { LocalagentComponent } from './settings/localagent/localagent.component';
import { RptBalancesheettwoComponent } from './reports/rpt-balancesheettwo/rpt-balancesheettwo.component';
import { RptAccountgroupbookComponent } from './reports/rpt-accountgroupbook/rpt-accountgroupbook.component';
import { PartysyncComponent } from './settings/partysync/partysync.component';
import { RptTrialbalancebygroupComponent } from './reports/rpt-trialbalancebygroup/rpt-trialbalancebygroup.component';
import { RptIncomestmentifrsComponent } from './reports/rpt-incomestmentifrs/rpt-incomestmentifrs.component';
import { VisawolistComponent } from './transaction/visawolist/visawolist.component';
import { RptOwnersequityComponent } from './reports/rpt-ownersequity/rpt-ownersequity.component';
import { CostsheetheadComponent } from './settings/costsheethead/costsheethead.component';
import { CostsheetbalanceComponent } from './settings/costsheetbalance/costsheetbalance.component';
import { RptCostsheetComponent } from './reports/rpt-costsheet/rpt-costsheet.component';
import { RptRatioanalysisComponent } from './reports/rpt-ratioanalysis/rpt-ratioanalysis.component';
import { RptCostcentrewisereportComponent } from './reports/rpt-costcentrewisereport/rpt-costcentrewisereport.component';
import { CostcentrecategoryComponent } from './settings/costcentrecategory/costcentrecategory.component';
import { CostcentreLocationComponent } from './settings/costcentre-location/costcentre-location.component';
import { RptCostcentrewisereportmonthwiseComponent } from './reports/rpt-costcentrewisereportmonthwise/rpt-costcentrewisereportmonthwise.component';
import { NotemastercostofgoodsoldComponent } from './settings/notemastercostofgoodsold/notemastercostofgoodsold.component';
import { NotedetailscostofgoodsoldComponent } from './settings/notedetailscostofgoodsold/notedetailscostofgoodsold.component';
import { RptCostofgoodssoldComponent } from './reports/rpt-costofgoodssold/rpt-costofgoodssold.component';
import { RptTrialbalancewithprecodeComponent } from './reports/rpt-trialbalancewithprecode/rpt-trialbalancewithprecode.component';
import { VoucherpostingComponent } from './transaction/voucherposting/voucherposting.component';
import { VoucheruploadComponent } from './transaction/voucherupload/voucherupload.component';
import { UserwiseledgerComponent } from './settings/userwiseledger/userwiseledger.component';
import { BalancesheetcoaComponent } from './reports/balancesheetcoa/balancesheetcoa.component';
import { PostedVoucherPostingComponent } from './transaction/posted-voucher-posting/posted-voucher-posting.component';
import { RptScheduleReportComponent } from './reports/rpt-schedule-report/rpt-schedule-report.component';
import { FactoryVoucherPostingComponent } from './transaction/factory-voucher-posting/factory-voucher-posting.component';
import { RptScheduleReportV2Component } from './reports/rpt-schedule-report-v2/rpt-schedule-report-v2.component';
import { PaymentvoucherV2Component } from './transaction/paymentvoucher-v2/paymentvoucher-v2.component';
import { MenuWiseTransactionDateUnlockComponent } from './settings/menu-wise-transaction-date-unlock/menu-wise-transaction-date-unlock.component';
import { ReceivevoucherV2Component } from './transaction/receivevoucher-v2/receivevoucher-v2.component';
import { JournalvoucherV2Component } from './transaction/journalvoucher-v2/journalvoucher-v2.component';
import { BenificiaryconverttoledgerComponent } from './settings/benificiaryconverttoledger/benificiaryconverttoledger.component';
import { BillPaymentComponent } from './transaction/bill-payment/bill-payment.component';
import { BillPayablePostingComponent } from './transaction/bill-payable-posting/bill-payable-posting.component';

const routes: Routes = [{
  path: '',
  component: AccountingComponent,
  children: [
    {
      path: 'create-voucher',
      component: CreateVoucherComponent,
    },
    {
      path: 'vouchertype',
      component: VouchertypeComponent
    },
    {
      path: 'transactionmode',
      component: TransactionmodeComponent
    },
    {
      path: 'currency',
      component: CurrencyComponent
    },
    {
      path: 'fundsource',
      component: FundsourceComponent
    },
    {
      path: 'party',
      component: PartyComponent
    },
    {
      path: 'localagent',
      component: LocalagentComponent
    },
    {
      path: 'costcentre',
      component: CostcentreComponent
    },
    {
      path: 'costcentremapping',
      component: CostcentremappingComponent
    },
    {
      path: 'accountnature',
      component: AccountnatureComponent
    },
    {
      path: 'accountgroup',
      component: AccountgroupComponent
    },
    {
      path: 'ledgertype',
      component: LedgertypeComponent
    },
    {
      path: 'ledger',
      component: LedgerComponent
    },
    {
      path: 'ledgeropeningbalance',
      component: LedgeropeningbalanceComponent
    },
    {
      path: 'benificiaryconverttoledger',
      component: BenificiaryconverttoledgerComponent
    },
    {
      path: 'autovouchersetting',
      component: AutovouchersettingComponent
    },
    {
      path: 'notemasterincomestment',
      component: NotemasterincomestmentComponent
    },
    {
      path: 'notedetailsincomestment',
      component: NotedetailsincomestmentComponent
    },
    {
      path: 'notemasterblsheet',
      component: NotemasterblsheetComponent
    },
    {
      path: 'notedetailsblsheet',
      component: NotedetailsblsheetComponent
    },
    {
      path: 'notemastercashflowdirect',
      component: NotemastercashflowdirectComponent
    },
    {
      path: 'notedetailscashflowdirect',
      component: NotedetailscashflowdirectComponent
    },
    {
      path: 'notemastercashflowindirect',
      component: NotemastercashflowindirectComponent
    },
    {
      path: 'notemastercostofgoodssold',
      component: NotemastercostofgoodsoldComponent
    },
    {
      path: 'notedetailscostofgoodssold',
      component: NotedetailscostofgoodsoldComponent
    },
    {
      path: 'notedetailscashflowindirect',
      component: NotedetailscashflowindirectComponent
    },
    ////// Transaction Section ///
    {
      path: 'voucher',
      component: VoucherComponent
    },
    {
      path: 'paymentvoucher',
      component: PaymentvoucherComponent
    },
    {
      path: 'paymentvoucherv2',
      component: PaymentvoucherV2Component
    },
    {
      path: 'receivevoucher',
      component: ReceivevoucherComponent
    },
    {
      path: 'journalvoucher',
      component: JournalvoucherComponent
    },
    {
      path: 'contravoucher',
      component: ContravoucherComponent
    },
    {
      path: 'chequebook',
      component: ChequebookComponent
    },
    {
      path: 'visaworkorder',
      component: VisaworkorderComponent
    },
    {
      path: 'voucherposting',
      component: VoucherpostingComponent
    },
    {
        path: "bill-payable-posting",
        component: BillPayablePostingComponent,
    },
    {
        path: "bill-payment",
        component: BillPaymentComponent,
    },
    {
      path: 'visaworkorderposting',
      component: VisaworkorderpostingComponent
    },
    {
      path: 'visasales',
      component: VisasalesComponent
    },
    {
      path: 'visasalesposting',
      component: VisasalespostingComponent
    },
    {
      path: 'accountdashboard',
      component: AccountdashboardComponent
    },
    ////// Budget Section ///
    {
      path: 'fiscalyear',
      component: FiscalyearComponent
    },
    {
      path: 'budgetmainhead',
      component: BudgetmainheadComponent
    },
    {
      path: 'budgetsubhead',
      component: BudgetsubheadComponent
    },
    {
      path: 'budgethead',
      component: BudgetheadComponent
    },
    {
      path: 'budgetcreate',
      component: BudgetcreateComponent
    },

    ////// Report Section ///
    {
      path: 'rpt-coa',
      component: RptCoaComponent
    },
    {
      path: 'rpt-daybook',
      component: RptDaybookComponent
    },
    {
      path: 'rpt-cashbook',
      component: RptCashbookComponent
    },
    {
      path: 'rpt-bankbook',
      component: RptBankbookComponent
    },
    {
      path: 'rpt-accountgroupbook',
      component: RptAccountgroupbookComponent
    },
    {
      path: 'rpt-schedulereport',
      component: RptScheduleReportComponent
    },
    {
      path: 'rpt-legderbook',
      component: RptLegderbookComponent
    },
    {
      path: 'rpt-partyledgerbook',
      component: RptPartyledgerbookComponent
    },
    {
      path: 'rpt-trialbalance',
      component: RptTrialbalanceComponent
    },
    {
      path: 'rpt-trialbalancewithpreviouscode',
      component: RptTrialbalancewithprecodeComponent
    },
    {
      path: 'rpt-incomestatement',
      component: RptIncomestatementComponent
    },
    {
      path: 'rpt-incomestmentgrossformat',
      component: RptIncomestmentgrossformatComponent
    },
    {
      path: 'rpt-voucherpreview',
      component: RptVoucherpreviewComponent
    },
    {
      path: 'rpt-balancesheet',
      component: RptBalancesheetComponent
    },
    {
      path: 'rpt-balancesheettwo',
      component: RptBalancesheettwoComponent
    },
    {
      path: 'rpt-balancesheetifrs',
      component: RptBalancesheetifrsComponent
    },
    {
      path: 'rpt-balancesheetcoa',
      component: BalancesheetcoaComponent
    },
    {
      path: 'rpt-costofgoodssold',
      component: RptCostofgoodssoldComponent
    },
    {
      path: 'rpt-cashflowdirect',
      component: RptCashflowdirectComponent
    },
    {
      path: 'rpt-cashflowindirect',
      component: RptCashflowindirectComponent
    },
    {
      path: 'rpt-paymentreceived',
      component: RptPaymentreceivedComponent
    },
    {
      path: 'rpt-visastock',
      component: RptVisastockComponent
    },
    {
      path: 'rpt-visapurchase',
      component: RptVisapurchaseComponent
    },
    {
      path: 'rpt-visasales',
      component: RptVisasalesComponent
    },
    {
      path: 'rpt-paymentreceivenew',
      component: RptPaymentreceivenewComponent
    },
    {
      path: 'partysync',
      component: PartysyncComponent
    },
    {
      path: 'rpt-trialbalancebygroup',
      component: RptTrialbalancebygroupComponent
    },
    {
      path: 'rpt-incomestmentifrs',
      component: RptIncomestmentifrsComponent
    },
    {
      path: 'visawolist',
      component: VisawolistComponent
    },
    {
      path: 'rpt-ownersequity',
      component: RptOwnersequityComponent
    },
    {
      path: 'costsheethead',
      component: CostsheetheadComponent
    },
    {
      path: 'costsheetbalance',
      component: CostsheetbalanceComponent
    },
    {
      path: 'rpt-costsheet',
      component: RptCostsheetComponent
    },
    {
      path: 'rpt-ratioanalysis',
      component: RptRatioanalysisComponent
    },
    {
      path: 'rpt-costcentrewisereport',
      component: RptCostcentrewisereportComponent
    },
    {
      path: 'rpt-costcentrewisemonthlyreport',
      component: RptCostcentrewisereportmonthwiseComponent
    },
    {
      path: 'costcentrecategory',
      component: CostcentrecategoryComponent
    },
    {
      path: 'costcentrelocation',
      component: CostcentreLocationComponent
    }
    ,
    {
      path: 'voucherupload',
      component: VoucheruploadComponent
    },
    {
      path: 'userwiseledger',
      component: UserwiseledgerComponent
    },
    {
      path: 'postedVoucherPosting',
      component: PostedVoucherPostingComponent
    },
    {
      path: 'factoryVoucherPosting',
      component: FactoryVoucherPostingComponent
    },
    {
      path: 'rpt-schedule-report-v2',
      component: RptScheduleReportV2Component
    }
    , { path: 'menuwisetransactiondateunlock', component: MenuWiseTransactionDateUnlockComponent }
    , { path: 'receivevoucherv2', component: ReceivevoucherV2Component }
    , { path: 'journalvoucherv2', component: JournalvoucherV2Component }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule { }
