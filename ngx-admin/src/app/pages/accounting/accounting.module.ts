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
import { AccountingRoutingModule } from "./accounting-routing.module";
import { AccountingComponent } from "./accounting.component";
import { ThemeModule } from "app/@theme/theme.module";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { FormsModule, FormControl } from '@angular/forms';
import { NgSelectModule } from "@ng-select/ng-select";
import { HttpClientModule } from "@angular/common/http";
import { AgGridModule } from "ag-grid-angular";

import { CreateVoucherComponent } from "./settings/create-voucher/create-voucher.component";
import { VouchertypeComponent } from "./settings/vouchertype/vouchertype.component";
import { AccountgroupComponent } from "./settings/accountgroup/accountgroup.component";
import { AccountnatureComponent } from "./settings/accountnature/accountnature.component";
import { CurrencyComponent } from "./settings/currency/currency.component";
import { FundsourceComponent } from "./settings/fundsource/fundsource.component";
import { LedgertypeComponent } from "./settings/ledgertype/ledgertype.component";
import { TransactionmodeComponent } from "./settings/transactionmode/transactionmode.component";
import { PartyComponent } from './settings/party/party.component';
import { CostcentreComponent } from './settings/costcentre/costcentre.component';
import { LedgerComponent } from './settings/ledger/ledger.component';
import { LedgeropeningbalanceComponent } from './settings/ledgeropeningbalance/ledgeropeningbalance.component';
import { CostcentremappingComponent } from './settings/costcentremapping/costcentremapping.component';
import { VoucherComponent } from './transaction/voucher/voucher.component';
import { RptCoaComponent } from './reports/rpt-coa/rpt-coa.component';


import { CommonActionComponent } from "./settings/common/common-action/common-action.component";
import { CommonButtonComponent } from "./settings/common/common-button/common-button.component";
import { GridButtonComponent } from "./settings/common/grid-button/grid-button.component";
import { RptHeaderComponent } from "../common/rpt-header/rpt-header.component";
import { RptFooterComponent } from "../common/rpt-footer/rpt-footer.component";
import { ReportButtonComponent } from '../common/report-button/report-button.component';
import { RptDaybookComponent } from './reports/rpt-daybook/rpt-daybook.component';
import { RptLegderbookComponent } from './reports/rpt-legderbook/rpt-legderbook.component';
import { RptTrialbalanceComponent } from './reports/rpt-trialbalance/rpt-trialbalance.component';
import { RptIncomestatementComponent } from './reports/rpt-incomestatement/rpt-incomestatement.component';
import { RptVoucherpreviewComponent } from './reports/rpt-voucherpreview/rpt-voucherpreview.component';
import { AuthRoutingModule } from "app/auth/auth-routing.module";
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
import { FiscalyearComponent } from "./budget/fiscalyear/fiscalyear.component";
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
import { RptHeaderLandscapeComponent } from "../common/rpt-header-landscape/rpt-header-landscape.component";
import { RptHeaderHalfpageComponent } from "../common/rpt-header-halfpage/rpt-header-halfpage.component";
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
import { SharedPipeModule } from "app/pipes/shared-pipe.module";
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
  AccountingRoutingModule,
  AuthRoutingModule,
  NbAlertModule,
  SharedPipeModule
];

const COMPONENTS = [
  AccountingComponent,
  CreateVoucherComponent,
  VouchertypeComponent,
  AccountnatureComponent,
  AccountgroupComponent,
  LedgertypeComponent,
  TransactionmodeComponent,
  CurrencyComponent,
  FundsourceComponent,
  LedgerComponent,
  LedgeropeningbalanceComponent,
  PartyComponent,
  CostcentreComponent,
  VoucherComponent,
  CostcentremappingComponent,
  ReportButtonComponent,
  PartyComponent,
  CostcentreComponent,
  CommonButtonComponent,
  CommonActionComponent,
  GridButtonComponent,
  RptCoaComponent,
  RptHeaderComponent,
  RptFooterComponent,
  RptDaybookComponent,
  RptLegderbookComponent,
  RptPartyledgerbookComponent,
  RptTrialbalanceComponent,
  RptIncomestatementComponent,
  RptVoucherpreviewComponent,
  NotemasterblsheetComponent,
  NotedetailsblsheetComponent,
  NotemastercashflowdirectComponent,
  NotedetailscashflowdirectComponent,
  NotemastercashflowindirectComponent,
  NotedetailscashflowindirectComponent,
  RptBalancesheetComponent,
  RptCashflowdirectComponent,
  RptCashflowindirectComponent,
  RptPaymentreceivedComponent,
  ChequebookComponent,
  RptCashbookComponent,
  RptBankbookComponent,
  BudgetmainheadComponent,
  FiscalyearComponent,
  BudgetsubheadComponent,
  BudgetheadComponent,
  BudgetcreateComponent,
  NotemasterincomestmentComponent,
  NotedetailsincomestmentComponent,
  RptIncomestmentgrossformatComponent,
  PaymentvoucherComponent,
  ReceivevoucherComponent,
  JournalvoucherComponent,
  ContravoucherComponent,
  VisaworkorderComponent,
  VisaworkorderpostingComponent,
  AutovouchersettingComponent,
  AccountdashboardComponent,
  VisasalesComponent,
  VisasalespostingComponent,
  RptVisastockComponent,
  RptVisapurchaseComponent,
  RptVisasalesComponent,
  RptPaymentreceivenewComponent,
  RptBalancesheetifrsComponent,
  LocalagentComponent,
  RptBalancesheettwoComponent,
  RptAccountgroupbookComponent,
  RptHeaderLandscapeComponent,
  RptHeaderHalfpageComponent,
  PartysyncComponent,
  RptTrialbalancebygroupComponent,
  RptIncomestmentifrsComponent,
  VisawolistComponent,
  RptOwnersequityComponent,
  CostsheetheadComponent,
  CostsheetbalanceComponent,
  RptCostsheetComponent,
  RptRatioanalysisComponent,
  RptCostcentrewisereportComponent,
  CostcentrecategoryComponent,
  CostcentreLocationComponent,
  RptCostcentrewisereportmonthwiseComponent,
  NotemastercostofgoodsoldComponent,
  NotedetailscostofgoodsoldComponent,
  RptCostofgoodssoldComponent,
  RptTrialbalancewithprecodeComponent,
  VoucherpostingComponent,
  VoucheruploadComponent,
  UserwiseledgerComponent,
  BalancesheetcoaComponent,
  PostedVoucherPostingComponent,
  RptScheduleReportComponent,
  FactoryVoucherPostingComponent, FactoryVoucherPostingComponent, RptScheduleReportV2Component,
];
const SERVICES = [];

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS, PaymentvoucherV2Component, MenuWiseTransactionDateUnlockComponent, ReceivevoucherV2Component, JournalvoucherV2Component, BenificiaryconverttoledgerComponent, BillPaymentComponent, BillPayablePostingComponent,],
  providers: [...SERVICES],
})

export class AccountingModule { }
