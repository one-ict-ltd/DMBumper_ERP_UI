import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HrmRoutingModule } from "./hrm-routing.module";
import { HrmComponent } from "./hrm.component";
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
import { AuthRoutingModule } from "app/auth/auth-routing.module";
import { RptHeaderLandscapeComponent } from "./setting/common/rpt-header-landscape/rpt-header-landscape.component";
import { RptHeaderComponent } from "./setting/common/rpt-header/rpt-header.component";
import { RptFooterComponent } from "./setting/common/rpt-footer/rpt-footer.component";
import { ReportButtonComponent } from "./setting/common/report-button/report-button.component";
import { CommonButtonComponent } from "../reports/common/common-button/common-button.component";
import { CommonActionComponent } from "../reports/common/common-action/common-action.component";

import { ActivitytypeComponent } from "./setting/activitytype/activitytype.component";
import { DepartmentComponent } from "./setting/department/department.component";
import { DesignationComponent } from "./setting/designation/designation.component";
import { EmployeetypeComponent } from "./setting/employeetype/employeetype.component";
import { RelationComponent } from "./setting/relation/relation.component";
import { ReligionComponent } from "./setting/religion/religion.component";
import { EmployeeinformationComponent } from "./employeeinformation/employeeinformation.component";
import { GenderComponent } from "./setting/gender/gender.component";
import { BloodgroupComponent } from "./setting/bloodgroup/bloodgroup.component";
import { UniqueidentityComponent } from "./setting/uniqueidentity/uniqueidentity.component";
import { TrainingTypeComponent } from "./setting/training-type/training-type.component";
import { LevelOfEducationComponent } from "./setting/level-of-education/level-of-education.component";
import { DegreeComponent } from "./setting/degree/degree.component";
import { EducationalSubjectComponent } from "./setting/educational-subject/educational-subject.component";
import { DegreeSubjectComponent } from "./setting/degree-subject/degree-subject.component";
import { WallettypeComponent } from "./salarymaster/wallettype/wallettype.component";
import { SalaryheadComponent } from "./salarymaster/salaryhead/salaryhead.component";
import { SalarygradeComponent } from "./salarymaster/salarygrade/salarygrade.component";
import { SalaryslabComponent } from "./salarymaster/salaryslab/salaryslab.component";
import { SalarygradepercentComponent } from "./salarymaster/salarygradepercent/salarygradepercent.component";
import { SalaryperiodComponent } from "./salarymaster/salaryperiod/salaryperiod.component";
import { SalarystructureComponent } from "./salarymaster/salarystructure/salarystructure.component";
import { SalaryprocessComponent } from "./salaryprocess/salaryprocess/salaryprocess.component";
import { EmployeestatusComponent } from "./setting/employeestatus/employeestatus.component";
import { EmpeducationComponent } from "./pims/empeducation/empeducation.component";
import { EmpaddressComponent } from "./pims/empaddress/empaddress.component";
import { EmpallinfoComponent } from "./pims/empallinfo/empallinfo.component";
import { EmpbasicComponent } from "./pims/empbasic/empbasic.component";
import { ShiftgroupComponent } from "./attendance/shiftgroup/shiftgroup.component";
import { ShiftassignComponent } from "./attendance/shiftassign/shiftassign.component";
import { ProcessattendanceComponent } from "./attendance/processattendance/processattendance.component";
import { LeavetypeComponent } from "./Leave/leavetype/leavetype.component";
import { LeaveyearComponent } from "./Leave/leaveyear/leaveyear.component";
import { LeavepolicyComponent } from "./Leave/leavepolicy/leavepolicy.component";
import { LeaveopeningbalanceComponent } from "./Leave/leaveopeningbalance/leaveopeningbalance.component";
import { LeaveprocessComponent } from "./Leave/leaveprocess/leaveprocess.component";
import { DailyAttendanceComponent } from "./attendance/reports/daily-attendance/daily-attendance.component";
import { EmpWiseAttendanceReportComponent } from "./attendance/reports/emp-wise-attendance-report/emp-wise-attendance-report.component";
import { LeaveapprovalmatrixComponent } from "./Leave/leaveapprovalmatrix/leaveapprovalmatrix.component";
import { LeaveregisterComponent } from "./Leave/leaveregister/leaveregister.component";
import { LeaveapprovalComponent } from "./Leave/leaveapproval/leaveapproval.component";
import { LeavereportComponent } from "./Leave/leavereport/leavereport.component";
import { AttendanceSummaryReportComponent } from "./attendance/reports/attendance-summary-report/attendance-summary-report.component";
import { SalaryFixedHeadStructureComponent } from "./salarymaster/salary-fixed-head-structure/salary-fixed-head-structure.component";
import { SalaryFixedHeadStructureUploadComponent } from "./salarymaster/salary-fixed-head-structure-upload/salary-fixed-head-structure-upload.component";
import { TaskEntryComponent } from "./taskmanagement/task-entry/task-entry.component";
import { MyTaskComponent } from "./taskmanagement/my-task/my-task.component";
import { TaskReportComponent } from "./taskmanagement/task-report/task-report.component";
import { TeamComponent } from "./taskmanagement/team/team.component";
import { SalaryReportComponent } from "./payroll/reports/salary-report/salary-report.component";
import { SalarySummaryReportComponent } from "./payroll/reports/salary-summary-report/salary-summary-report.component";
import { SalaryHeldupReportComponent } from "./payroll/reports/salary-heldup-report/salary-heldup-report.component";
import { MobileBillUploadComponent } from "./salarymaster/mobile-bill-upload/mobile-bill-upload.component";
import { MobileBillReportComponent } from "./payroll/reports/mobile-bill-report/mobile-bill-report.component";
import { LoanInformationEntryComponent } from "./pims/loan-information-entry/loan-information-entry.component";
import { MobileBillSummaryComponent } from "./payroll/reports/mobile-bill-summary/mobile-bill-summary.component";
import { PFReportComponent } from "./payroll/reports/pfreport/pfreport.component";
import { OtherExpenseComponent } from "./salarymaster/other-expense/other-expense.component";
import { ManualLeaveEntryComponent } from "./Leave/manual-leave-entry/manual-leave-entry.component";
import { LeaveSummaryRepotComponent } from "./Leave/leave-summary-repot/leave-summary-repot.component";
import { EmployeeInfoUploadComponent } from "./employee-info-upload/employee-info-upload.component";
import { InactiveEmployeeInfoUploadComponent } from "./inactive-employee-info-upload/inactive-employee-info-upload.component";
import { EmployeeCashSalarySetupComponent } from "./salarymaster/employee-cash-salary-setup/employee-cash-salary-setup.component";
import { SharedPipeModule } from "app/pipes/shared-pipe.module";
import { BonusReportComponent } from "./payroll/reports/bonus-report/bonus-report.component";
import { UploadSalaryStructureComponent } from "./salarymaster/upload-salary-structure/upload-salary-structure.component";
import { EmployeeLeaveReportComponent } from "./Leave/employee-leave-report/employee-leave-report.component";
import { ManualAttendanceComponent } from "./attendance/manual-attendance/manual-attendance.component";
import { JoiningReportComponent } from "./payroll/reports/joining-report/joining-report.component";
import { EmployeePayslipComponent } from "./payroll/reports/employee-payslip/employee-payslip.component";
import { SalarySheetComponent } from './payroll/reports/salary-sheet/salary-sheet.component';
import { EssPortalComponent } from './pims/ess-portal/ess-portal.component';
import { CelebrationModalComponent } from './pims/celebration-modal/celebration-modal.component';
import { EmployeeConfirmationComponent } from "./pims/employee-confirmation/employee-confirmation.component";
import { EmpTransferComponent } from "./transfer/empTransfer/empTransfer.component";
import { EmpPromotionComponent } from "./Promotion/empPromotion/empPromotion.component";
import { TransferReportComponent } from "./payroll/reports/transfer-report/transfer-report.component";
import { ConfirmationReportComponent } from "./payroll/reports/confirmation-report/confirmation-report.component";
import { PromotionReportComponent } from "./payroll/reports/promotion-report/promotion-report.component";
import { EmployeePayslipBankComponent } from './payroll/reports/employee-payslip-bank/employee-payslip-bank.component';
import { EmpfamilyComponent } from "./pims/empfamily/empfamily.component";
import { EmpreferenceComponent } from "./pims/empreference/empreference.component";
import { EmpemergencycontactComponent } from "./pims/empemergencycontact/empemergencycontact.component";
import { EmployeeExperienceComponent } from "./pims/employee-experience/employee-experience.component";
import { FieldforceInformationComponent } from './fieldforce-information/fieldforce-information.component';
import { FieldforceBasicComponent } from './pims/fieldforce-basic/fieldforce-basic.component';
import { FieldforceTransferComponent } from './fieldforce-transfer/fieldforce-transfer.component';
import { UploadIncrementComponent } from './upload-increment/upload-increment.component';
import { SalaryComparisonComponent } from './payroll/reports/salary-comparison/salary-comparison.component';
import { SalaryLocationComponent } from './setting/salary-location/salary-location.component';
import { LoanCancelationComponent } from "./pims/loan-cancelation/loan-cancelation.component";
import { FinalSettlementComponent } from './final-settlement/final-settlement.component';
import { FinalSettlementApprovalComponent } from './final-settlement-approval/final-settlement-approval.component';
import { CashPaymentSalarySummaryReportComponent } from './payroll/reports/cash-payment-salary-summary-report/cash-payment-salary-summary-report.component';
import { EmployeeApprovalMatrixComponent } from './pims/employee-approval-matrix/employee-approval-matrix.component';
import { HrmemployeeclarificationComponent } from './attendance/hrmemployeeclarification/hrmemployeeclarification.component';
import { HrmemployeeclarificationapprovalComponent } from './attendance/hrmemployeeclarificationapproval/hrmemployeeclarificationapproval.component';
import { LeaveapplylistComponent } from './Leave/leaveapplylist/leaveapplylist.component';
import { AttandanceLateApprovalComponent } from './Leave/attandance-late-approval/attandance-late-approval.component';
import { LateAttandanceClarifyComponent } from './Leave/late-attandance-clarify/late-attandance-clarify.component';
import { SalarySlabDesignationComponent } from './setting/salary-slab-designation/salary-slab-designation.component';
import { EmployeeMobileBillLimitReportComponent } from './payroll/reports/employee-mobile-bill-limit-report/employee-mobile-bill-limit-report.component';
import { ImageCropperModule } from "ngx-image-cropper";
import { EmpjobdescriptionComponent } from './pims/empjobdescription/empjobdescription.component';
import { MonthlyTaskAssignComponent } from './taskmanagement/monthly-task-assign/monthly-task-assign.component';
import { WeeklyTaskAssignComponent } from './taskmanagement/weekly-task-assign/weekly-task-assign.component';
import { WeeklyMyTaskComponent } from './taskmanagement/weekly-my-task/weekly-my-task.component';

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
  FormsModule,
  HttpClientModule,
  AgGridModule.withComponents([]),
  NbToastrModule,
  AuthRoutingModule,
  NbAlertModule,
  NbCardModule,
  HrmRoutingModule,
  SharedPipeModule,
  // MatSnackBarModule,

  ImageCropperModule,
];

const COMPONENTS = [
  HrmComponent,
  CommonButtonComponent,
  CommonActionComponent,
  ReportButtonComponent,
  RptFooterComponent,
  RptHeaderComponent,
  RptHeaderLandscapeComponent,
  ActivitytypeComponent,
  DepartmentComponent,
  DesignationComponent,
  EmployeetypeComponent,
  RelationComponent,
  ReligionComponent,
  EmployeeinformationComponent,
  GenderComponent,
  BloodgroupComponent,
  UniqueidentityComponent,
  TrainingTypeComponent,
  LevelOfEducationComponent,
  DegreeComponent,
  EducationalSubjectComponent,
  DegreeSubjectComponent,
  WallettypeComponent,
  SalaryheadComponent,
  SalarygradeComponent,
  SalaryslabComponent,
  SalarygradepercentComponent,
  SalaryperiodComponent,
  SalarystructureComponent,
  SalaryprocessComponent,
  EmployeestatusComponent,
  EmpeducationComponent,
  EmpaddressComponent,
  EmpallinfoComponent,
  EmpbasicComponent,
  ShiftgroupComponent,
  ShiftassignComponent,
  ProcessattendanceComponent,
  DailyAttendanceComponent,
  LeavetypeComponent,
  LeaveyearComponent,
  LeavepolicyComponent,
  LeaveopeningbalanceComponent,
  LeaveprocessComponent,
  EmpWiseAttendanceReportComponent,
  LeaveapprovalmatrixComponent,
  LeaveregisterComponent,
  LeaveapprovalComponent,
  LeavereportComponent,
  AttendanceSummaryReportComponent,
  SalaryFixedHeadStructureComponent,
  SalaryFixedHeadStructureUploadComponent,
  TaskEntryComponent,
  MyTaskComponent,
  TaskReportComponent,
  TeamComponent,
  SalaryReportComponent,
  SalarySummaryReportComponent,
  SalaryHeldupReportComponent,
  MobileBillUploadComponent,
  MobileBillReportComponent,
  LoanInformationEntryComponent,
  MobileBillSummaryComponent,
  PFReportComponent,
  OtherExpenseComponent,
  ManualLeaveEntryComponent,
  LeaveSummaryRepotComponent,
  EmployeeInfoUploadComponent,
  InactiveEmployeeInfoUploadComponent,
  EmployeeCashSalarySetupComponent,
  BonusReportComponent,
  UploadSalaryStructureComponent,
  EmployeeLeaveReportComponent,
  ManualAttendanceComponent,
  JoiningReportComponent,
  EmployeePayslipComponent,
  SalarySheetComponent,
  EssPortalComponent,
  CelebrationModalComponent,
  EmployeeConfirmationComponent,
  EmpTransferComponent,
  EmpPromotionComponent,
  TransferReportComponent,
  ConfirmationReportComponent,
  PromotionReportComponent,
  EmployeePayslipBankComponent,
  EmpfamilyComponent,
  EmpreferenceComponent,
  EmpemergencycontactComponent,
  EmployeeExperienceComponent,
  FieldforceInformationComponent,
  FieldforceBasicComponent,
  FieldforceTransferComponent,
  UploadIncrementComponent,
  SalaryComparisonComponent,
  SalaryLocationComponent,
  LoanCancelationComponent,
  FinalSettlementComponent,
  FinalSettlementApprovalComponent,
  EmployeeApprovalMatrixComponent,
  CashPaymentSalarySummaryReportComponent,
  HrmemployeeclarificationComponent
];
const SERVICES = [];

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS, HrmemployeeclarificationapprovalComponent, LeaveapplylistComponent, AttandanceLateApprovalComponent, LateAttandanceClarifyComponent, SalarySlabDesignationComponent, EmployeeMobileBillLimitReportComponent, EmpjobdescriptionComponent, MonthlyTaskAssignComponent, WeeklyTaskAssignComponent, WeeklyMyTaskComponent],
  providers: [...SERVICES],
})
export class HrmModule { }
