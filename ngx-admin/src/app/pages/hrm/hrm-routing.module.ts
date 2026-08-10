import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EmployeeinformationComponent } from "./employeeinformation/employeeinformation.component";
import { HrmComponent } from "./hrm.component";
import { ActivitytypeComponent } from "./setting/activitytype/activitytype.component";
import { BloodgroupComponent } from "./setting/bloodgroup/bloodgroup.component";
import { DegreeComponent } from "./setting/degree/degree.component";
import { DepartmentComponent } from "./setting/department/department.component";
import { DesignationComponent } from "./setting/designation/designation.component";
import { EmployeetypeComponent } from "./setting/employeetype/employeetype.component";
import { GenderComponent } from "./setting/gender/gender.component";
import { LevelOfEducationComponent } from "./setting/level-of-education/level-of-education.component";
import { RelationComponent } from "./setting/relation/relation.component";
import { ReligionComponent } from "./setting/religion/religion.component";
import { TrainingTypeComponent } from "./setting/training-type/training-type.component";
import { UniqueidentityComponent } from "./setting/uniqueidentity/uniqueidentity.component";
//import { EmployeeinformationComponent } from './employeeinformation/employeeinformation.component';
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
import { EmpallinfoComponent } from "./pims/empallinfo/empallinfo.component";
import { EmpeducationComponent } from "./pims/empeducation/empeducation.component";
import { EmpaddressComponent } from "./pims/empaddress/empaddress.component";
import { EmpbasicComponent } from "./pims/empbasic/empbasic.component";
import { ShiftgroupComponent } from "./attendance/shiftgroup/shiftgroup.component";
import { ShiftassignComponent } from "./attendance/shiftassign/shiftassign.component";
import { ProcessattendanceComponent } from "./attendance/processattendance/processattendance.component";
import { LeavetypeComponent } from "./Leave/leavetype/leavetype.component";
import { LeaveyearComponent } from "./Leave/leaveyear/leaveyear.component";
import { LeavepolicyComponent } from "./Leave/leavepolicy/leavepolicy.component";
import { LeaveopeningbalanceComponent } from "./Leave/leaveopeningbalance/leaveopeningbalance.component";
import { DailyAttendanceComponent } from "./attendance/reports/daily-attendance/daily-attendance.component";
import { LeaveprocessComponent } from "./Leave/leaveprocess/leaveprocess.component";
import { EmpWiseAttendanceReportComponent } from "./attendance/reports/emp-wise-attendance-report/emp-wise-attendance-report.component";
import { LeaveapprovalmatrixComponent } from "./Leave/leaveapprovalmatrix/leaveapprovalmatrix.component";
import { LeaveregisterComponent } from "./Leave/leaveregister/leaveregister.component";
import { LeaveapprovalComponent } from "./Leave/leaveapproval/leaveapproval.component";
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
import { BonusReportComponent } from "./payroll/reports/bonus-report/bonus-report.component";
import { UploadSalaryStructureComponent } from "./salarymaster/upload-salary-structure/upload-salary-structure.component";
import { EmployeeLeaveReportComponent } from "./Leave/employee-leave-report/employee-leave-report.component";
import { ManualAttendanceComponent } from "./attendance/manual-attendance/manual-attendance.component";
import { JoiningReportComponent } from "./payroll/reports/joining-report/joining-report.component";
import { EmployeePayslipComponent } from "./payroll/reports/employee-payslip/employee-payslip.component";
import { SalarySheetComponent } from "./payroll/reports/salary-sheet/salary-sheet.component";
import { EssPortalComponent } from "./pims/ess-portal/ess-portal.component";
import { CelebrationModalComponent } from "./pims/celebration-modal/celebration-modal.component";
import { EmpTransferComponent } from "./transfer/empTransfer/empTransfer.component";
import { EmpPromotionComponent } from "./Promotion/empPromotion/empPromotion.component";
import { EmployeeConfirmationComponent } from "./pims/employee-confirmation/employee-confirmation.component";
import { TransferReportComponent } from "./payroll/reports/transfer-report/transfer-report.component";
import { ConfirmationReportComponent } from "./payroll/reports/confirmation-report/confirmation-report.component";
import { PromotionReportComponent } from "./payroll/reports/promotion-report/promotion-report.component";
import { EmployeePayslipBankComponent } from "./payroll/reports/employee-payslip-bank/employee-payslip-bank.component";
import { EmpfamilyComponent } from "./pims/empfamily/empfamily.component";
import { EmpemergencycontactComponent } from "./pims/empemergencycontact/empemergencycontact.component";
import { EmpreferenceComponent } from "./pims/empreference/empreference.component";
import { EmployeeExperienceComponent } from "./pims/employee-experience/employee-experience.component";
import { FieldforceInformationComponent } from "./fieldforce-information/fieldforce-information.component";
import { FieldforceBasicComponent } from "./pims/fieldforce-basic/fieldforce-basic.component";
import { FieldforceTransferComponent } from "./fieldforce-transfer/fieldforce-transfer.component";
import { UploadIncrementComponent } from "./upload-increment/upload-increment.component";
import { SalaryComparisonComponent } from "./payroll/reports/salary-comparison/salary-comparison.component";
import { SalaryLocationComponent } from "./setting/salary-location/salary-location.component";
import { LoanCancelationComponent } from "./pims/loan-cancelation/loan-cancelation.component";
import { FinalSettlementComponent } from "./final-settlement/final-settlement.component";
import { FinalSettlementApprovalComponent } from "./final-settlement-approval/final-settlement-approval.component";
import { CashPaymentSalarySummaryReportComponent } from "./payroll/reports/cash-payment-salary-summary-report/cash-payment-salary-summary-report.component";
import { EmployeeApprovalMatrixComponent } from "./pims/employee-approval-matrix/employee-approval-matrix.component";
import { HrmemployeeclarificationComponent } from "./attendance/hrmemployeeclarification/hrmemployeeclarification.component";
import { LeaveapplylistComponent } from "./Leave/leaveapplylist/leaveapplylist.component";
import { AttandanceLateApprovalComponent } from "./Leave/attandance-late-approval/attandance-late-approval.component";
import { LateAttandanceClarifyComponent } from "./Leave/late-attandance-clarify/late-attandance-clarify.component";
import { SalarySlabDesignationComponent } from "./setting/salary-slab-designation/salary-slab-designation.component";
import { EmployeeMobileBillLimitReportComponent } from "./payroll/reports/employee-mobile-bill-limit-report/employee-mobile-bill-limit-report.component";
import { EmpjobdescriptionComponent } from './pims/empjobdescription/empjobdescription.component';
import { MonthlyTaskAssignComponent } from './taskmanagement/monthly-task-assign/monthly-task-assign.component';
import { WeeklyTaskAssignComponent } from './taskmanagement/weekly-task-assign/weekly-task-assign.component';
import { WeeklyMyTaskComponent } from './taskmanagement/weekly-my-task/weekly-my-task.component';

const routes: Routes = [
  {
    path: "",
    component: HrmComponent,
    children: [
      {
        path: "activitytype",
        component: ActivitytypeComponent,
      },
      {
        path: "department",
        component: DepartmentComponent,
      },
      {
        path: "designation",
        component: DesignationComponent,
      },
      {
        path: "employeetype",
        component: EmployeetypeComponent,
      },
      {
        path: "relation",
        component: RelationComponent,
      },
      {
        path: "religion",
        component: ReligionComponent,
      },
      {
        path: "gender",
        component: GenderComponent,
      },
      {
        path: "bloodgroup",
        component: BloodgroupComponent,
      },
      {
        path: "uniqueidentity",
        component: UniqueidentityComponent,
      },
      {
        path: "employeeinformation",
        component: EmployeeinformationComponent,
      },
      {
        path: "training-type",
        component: TrainingTypeComponent,
      },
      {
        path: "level-of-education",
        component: LevelOfEducationComponent,
      },
      {
        path: "degree",
        component: DegreeComponent,
      },
      {
        path: "educational-subject",
        component: EducationalSubjectComponent,
      },
      {
        path: "degree-subject",
        component: DegreeSubjectComponent,
      },

      //Salary Menu
      {
        path: "wallettype",
        component: WallettypeComponent,
      },
      {
        path: "salaryhead",
        component: SalaryheadComponent,
      },
      {
        path: "salarygrade",
        component: SalarygradeComponent,
      },
      {
        path: "salaryslab",
        component: SalaryslabComponent,
      },
      {
        path: "salarygradepercent",
        component: SalarygradepercentComponent,
      },
      {
        path: "salaryperiod",
        component: SalaryperiodComponent,
      },
      {
        path: "salarystructure",
        component: SalarystructureComponent,
      },
      {
        path: "salaryprocess",
        component: SalaryprocessComponent,
      },
      {
        path: "employeestatus",
        component: EmployeestatusComponent,
      },
      {
        path: "empallinfo",
        component: EmpallinfoComponent,
      },
      {
        path: "empbasic",
        component: EmpbasicComponent,
      },
      {
        path: "empaddress",
        component: EmpaddressComponent,
      },
      {
        path: "empeducation",
        component: EmpeducationComponent,
      },
      {
        path: "shiftgroup",
        component: ShiftgroupComponent,
      },
      {
        path: "shiftassign",
        component: ShiftassignComponent,
      },
      {
        path: "processattendance",
        component: ProcessattendanceComponent,
      },
      {
        path: "leavetype",
        component: LeavetypeComponent,
      },
      {
        path: "leaveyear",
        component: LeaveyearComponent,
      },
      {
        path: "leavepolicy",
        component: LeavepolicyComponent,
      },
      {
        path: "leaveopeningbalance",
        component: LeaveopeningbalanceComponent,
      },
      {
        path: "daily-attendance",
        component: DailyAttendanceComponent,
      },
      {
        path: "leaveprocess",
        component: LeaveprocessComponent,
      },
      {
        path: "leaveapprovalmatrix",
        component: LeaveapprovalmatrixComponent,
      },
      {
        path: "leaveregister",
        component: LeaveregisterComponent,
      },
      {
        path: "leaveApprove",
        component: LeaveapprovalComponent,
      },
      {
        path: "emp-wise-attendance-report",
        component: EmpWiseAttendanceReportComponent,
      },
      {
        path: "attendance-summary-report",
        component: AttendanceSummaryReportComponent,
      },
      {
        path: "salary-fixed-head-structure",
        component: SalaryFixedHeadStructureComponent,
      },
      {
        path: "salary-fixed-head-structure-upload",
        component: SalaryFixedHeadStructureUploadComponent,
      },
      {
        path: "team",
        component: TeamComponent,
      },
      {
        path: "task-entry",
        component: TaskEntryComponent,
      },
      {
        path: "my-task",
        component: MyTaskComponent,
      },
      {
        path: "monthly-task-assign",
        component: MonthlyTaskAssignComponent,
      },
      {
        path: "weekly-task-assign",
        component: WeeklyTaskAssignComponent,
      },
      {
        path: "weekly-my-task",
        component: WeeklyMyTaskComponent,
      },
      {
        path: "task-report",
        component: TaskReportComponent,
      },
      { path: "salary-heldup-report", component: SalaryHeldupReportComponent },
      {
        path: "salary-report",
        component: SalaryReportComponent,
      },
      {
        path: "employee-payslip",
        component: EmployeePayslipComponent,
      },
      {
        path: "employee-payslip-bank",
        component: EmployeePayslipBankComponent,
      },
      {
        path: "salary-summary-report",
        component: SalarySummaryReportComponent,
      },
      {
        path: "mobile-bill-upload",
        component: MobileBillUploadComponent,
      },
      {
        path: "mobile-bill-Report",
        component: MobileBillReportComponent,
      },
      {
        path: "loan-entry",
        component: LoanInformationEntryComponent,
      },
      {
        path: "mobile-bill-Summary",
        component: MobileBillSummaryComponent,
      },
      {
        path: "PF-report",
        component: PFReportComponent,
      },
      {
        path: "others-expense",
        component: OtherExpenseComponent,
      },
      {
        path: "manual-leave-entry",
        component: ManualLeaveEntryComponent,
      },
      {
        path: "leave-summary-report",
        component: LeaveSummaryRepotComponent,
      },
      {
        path: "employee-leave-report",
        component: EmployeeLeaveReportComponent,
      },
      {
        path: "employee-info-upload",
        component: EmployeeInfoUploadComponent,
      },
      {
        path: "Inactive-employee-info-upload",
        component: InactiveEmployeeInfoUploadComponent,
      },
      {
        path: "employee-cash-salary-setup",
        component: EmployeeCashSalarySetupComponent,
      },
      {
        path: "bonus-report",
        component: BonusReportComponent,
      },
      {
        path: "upload-salary-structure",
        component: UploadSalaryStructureComponent,
      },
      {
        path: "manual-attendance",
        component: ManualAttendanceComponent,
      },
      {
        path: "joining-report",
        component: JoiningReportComponent,
      },
      {
        path: "salary-sheet",
        component: SalarySheetComponent,
      },
      {
        path: "ess-portal",
        component: EssPortalComponent,
      },
      {
        path: "celebration-modal",
        component: CelebrationModalComponent,
      },
      {
        path: "emp-transfer",
        component: EmpTransferComponent,
      },
      {
        path: "emp-promotion",
        component: EmpPromotionComponent,
      },
      {
        path: "emp-Comfirmation",
        component: EmployeeConfirmationComponent,
      },
      {
        path: "transfer-report",
        component: TransferReportComponent,
      },
      {
        path: "confirmation-report",
        component: ConfirmationReportComponent,
      },
      {
        path: "promotion-report",
        component: PromotionReportComponent,
      },
      {
        path: "empfamily",
        component: EmpfamilyComponent
      },
      {
        path: 'empemergencycontact',
        component: EmpemergencycontactComponent
      },
      {
        path: 'empreference',
        component: EmpreferenceComponent
      },
      {
        path: 'empjobdescription',
        component: EmpjobdescriptionComponent
      },
      {
        path: 'empexperience',
        component: EmployeeExperienceComponent
      },
      {
        path: 'fieldforce-information',
        component: FieldforceInformationComponent
      },
      {
        path: 'fieldforce-basic',
        component: FieldforceBasicComponent
      },
      {
        path: 'fieldforce-transfer',
        component: FieldforceTransferComponent
      },
      {
        path: 'upload-increment',
        component: UploadIncrementComponent
      },
      {
        path: 'salary-comparison',
        component: SalaryComparisonComponent
      },
      {
        path: 'salary-location',
        component: SalaryLocationComponent
      },
      {
        path: 'loan-cancelation',
        component: LoanCancelationComponent
      },
      {
        path: 'final-settlement',
        component: FinalSettlementComponent
      },
      {
        path: 'final-settlement-approval',
        component: FinalSettlementApprovalComponent
      },
      {
        path: 'cash-payment-salary-summary-report',
        component: CashPaymentSalarySummaryReportComponent
      },
      {
        path: 'employee-approval-matrix',
        component: EmployeeApprovalMatrixComponent
      },
      {
        path: 'hrmemployeeclarification',
        component: HrmemployeeclarificationComponent
      },
      {
        path: "Leaveapplylist",
        component: LeaveapplylistComponent
      },
      {
        path: 'late-approval',
        component: AttandanceLateApprovalComponent
      }, { path: 'late-clarify', component: LateAttandanceClarifyComponent },
      { path: 'slab-designation', component: SalarySlabDesignationComponent },
      { path: 'mobile-bill-limit-report', component: EmployeeMobileBillLimitReportComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrmRoutingModule { }
