import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// import { DailyAttendanceComponent } from "../hrm/attendance/reports/daily-attendance/daily-attendance.component";
import { FieldforcetrackingComponent } from "./fieldforcetracking.component";
import { ChemistvisitComponent } from "./report/chemistvisit/chemistvisit.component";
import { ChemistwisevisitComponent } from "./report/chemistwisevisit/chemistwisevisit.component";
import { CurrentlocationtrackerComponent } from "./report/currentlocationtracker/currentlocationtracker.component";
import { CustomerWiseSalesReportComponent } from "./report/customer-wise-sales-report/customer-wise-sales-report.component";
import { DoctoreWisePromotionalItemComponent } from "./report/doctore-wise-promotional-item/doctore-wise-promotional-item.component";
import { DoctorwisevisitComponent } from "./report/doctorwisevisit/doctorwisevisit.component";
import { EmployeeRoadMapComponent } from "./report/employee-road-map/employee-road-map.component";
import { EmployeeWisePromotionalItemComponent } from "./report/employee-wise-promotional-item/employee-wise-promotional-item.component";
import { FftDashboardComponent } from "./report/fft-dashboard/fft-dashboard.component";
import { FftdashboardComponent } from "./report/fftdashboard/fftdashboard.component";
import { MiovisitComponent } from "./report/miovisit/miovisit.component";
import { PunchInOutReportComponent } from "./report/punch-in-out-report/punch-in-out-report.component";
import { SalesReportComponent } from "./report/sales-report/sales-report.component";
import { AreaComponent } from "./setting/area/area.component";
import { CalendersetComponent } from "./setting/calenderset/calenderset.component";
import { ChemistComponent } from "./setting/chemist/chemist.component";
import { DepoComponent } from "./setting/depo/depo.component";
import { DocplanUploadComponent } from "./setting/docplan-upload/docplan-upload.component";
import { DoctorComponent } from "./setting/doctor/doctor.component";
import { MarketComponent } from "./setting/market/market.component";
import { PlanUploadComponent } from "./setting/plan-upload/plan-upload.component";
import { RegionComponent } from "./setting/region/region.component";
import { TerritoryComponent } from "./setting/territory/territory.component";
import { ZoneComponent } from "./setting/zone/zone.component";
import { DailyAttendenceComponent } from './report/daily-attendence/daily-attendence.component';
import { FftDashboardForMdComponent } from "./report/fft-dashboard-for-md/fft-dashboard-for-md.component";
import { SalestargetsetComponent } from "./setting/salestargetset/salestargetset.component";
import { ExamcontentuploadComponent } from "./setting/examcontentupload/examcontentupload.component";
import { ExamquestionsetComponent } from "./setting/examquestionset/examquestionset.component";
import { RxreportComponent } from "./report/rxreport/rxreport.component";
import { ExamresultComponent } from "./report/examresult/examresult.component";
import { EmployeeAttendanceReportForFFMComponent } from "./report/employee-attendance-report-for-ffm/employee-attendance-report-for-ffm.component";
import { TaDaExpenseReportComponent } from "./report/ta-da-expense-report/ta-da-expense-report.component";
import { DcrSummaryReportComponent } from "./report/dcr-summary-report/dcr-summary-report.component";
import { DigitalGiftDisbursementReportComponent } from "./report/digital-gift-disbursement-report/digital-gift-disbursement-report.component";

const routes: Routes = [
  {
    path: "",
    component: FieldforcetrackingComponent,
    children: [
      {
        path: "zone",
        component: ZoneComponent,
      },
      {
        path: "depo",
        component: DepoComponent,
      },
      {
        path: "region",
        component: RegionComponent,
      },
      {
        path: "area",
        component: AreaComponent,
      },
      {
        path: "market",
        component: MarketComponent,
      },
      {
        path: "territory",
        component: TerritoryComponent,
      },
      {
        path: "chemist",
        component: ChemistComponent,
      },
      {
        path: "doctor",
        component: DoctorComponent,
      },
      {
        path: "miovisit",
        component: MiovisitComponent,
      },
      {
        path: "chemistvisit",
        component: ChemistvisitComponent,
      },
      {
        path: "chemistwisevisit",
        component: ChemistwisevisitComponent,
      },
      {
        path: "doctorwisevisit",
        component: DoctorwisevisitComponent,
      },
      {
        path: "examcontentupload",
        component: ExamcontentuploadComponent,
      },
      {
        path: "examquestionset",
        component: ExamquestionsetComponent,
      },
      // {// Old
      //   path: 'fftdashboard',
      //   component: FftdashboardComponent,
      // },
      {
        // New by MOSTAFA
        path: "fftdashboard",
        component: FftDashboardComponent,
      },
      {
        path: "punch-in-out-report",
        component: PunchInOutReportComponent,
      },
      {
        path: "daily-attendence",
        component: DailyAttendenceComponent,
      },
      {
        path: "current-location-tracker",
        component: CurrentlocationtrackerComponent,
      },
      {
        path: "employee-road-map",
        component: EmployeeRoadMapComponent,
      },
      {
        path: "setTarget",
        component: SalestargetsetComponent,
      },
      {
        path: "rxreport",
        component: RxreportComponent,
      },
      {
        //Emp Wise
        path: "sales-report",
        component: SalesReportComponent,
      },
      {
        path: "customer-wise-sales-report",
        component: CustomerWiseSalesReportComponent,
      },
      {
        path: "employee-wise-promotional-item",
        component: EmployeeWisePromotionalItemComponent,
      },
      {
        path: "doctore-wise-promotional-item",
        component: DoctoreWisePromotionalItemComponent,
      },
      { path: "ta-da-expense-report", component: TaDaExpenseReportComponent },
      { path: "employee-attendance-report-for-ffm", component: EmployeeAttendanceReportForFFMComponent },
      { path: "calenderset", component: CalendersetComponent },
      { path: "plan-upload", component: PlanUploadComponent },
      { path: "docplan-upload", component: DocplanUploadComponent },
      { path: "dashboard", component: FftDashboardForMdComponent },
      { path: "exam-result", component: ExamresultComponent },
      { path: "dcr-summary-report", component: DcrSummaryReportComponent },
      { path: "digital-gift-disbursement-report", component: DigitalGiftDisbursementReportComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FieldforcetrackingRoutingModule { }
