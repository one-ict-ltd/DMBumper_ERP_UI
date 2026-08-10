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
import { AuthRoutingModule } from "app/auth/auth-routing.module";
import { FieldforcetrackingRoutingModule } from "./fieldforcetracking-routing.module";
import { ZoneComponent } from "./setting/zone/zone.component";
import { FieldforcetrackingComponent } from "./fieldforcetracking.component";
import { DepoComponent } from "./setting/depo/depo.component";
import { RegionComponent } from "./setting/region/region.component";
import { AreaComponent } from "./setting/area/area.component";
import { TerritoryComponent } from "./setting/territory/territory.component";
import { DoctorComponent } from "./setting/doctor/doctor.component";
import { MiovisitComponent } from "./report/miovisit/miovisit.component";
import { MarketComponent } from "./setting/market/market.component";
import { ChemistComponent } from "./setting/chemist/chemist.component";
import { ChemistwisevisitComponent } from "./report/chemistwisevisit/chemistwisevisit.component";
import { CommonButtonComponent } from "./setting/common/common-button/common-button.component";
import { ReportButtonComponent } from "./setting/common/report-button/report-button.component";
import { RptFooterComponent } from "./setting/common/rpt-footer/rpt-footer.component";
import { RptHeaderComponent } from "./setting/common/rpt-header/rpt-header.component";
import { RptHeaderLandscapeComponent } from "./setting/common/rpt-header-landscape/rpt-header-landscape.component";
import { DoctorwisevisitComponent } from "./report/doctorwisevisit/doctorwisevisit.component";
import { ChemistvisitComponent } from "./report/chemistvisit/chemistvisit.component";
import { FftdashboardComponent } from "./report/fftdashboard/fftdashboard.component";
import { FftDashboardComponent } from "./report/fft-dashboard/fft-dashboard.component";
import { PunchInOutReportComponent } from "./report/punch-in-out-report/punch-in-out-report.component";
import { SalesReportComponent } from "./report/sales-report/sales-report.component";
import { CurrentlocationtrackerComponent } from "./report/currentlocationtracker/currentlocationtracker.component";
import { EmployeeRoadMapComponent } from "./report/employee-road-map/employee-road-map.component";
import { RptMapButtonComponent } from "./setting/common/rpt-map-button/rpt-map-button.component";
import { CustomerWiseSalesReportComponent } from "./report/customer-wise-sales-report/customer-wise-sales-report.component";
import { EmployeeWisePromotionalItemComponent } from "./report/employee-wise-promotional-item/employee-wise-promotional-item.component";
import { DoctoreWisePromotionalItemComponent } from "./report/doctore-wise-promotional-item/doctore-wise-promotional-item.component";
import { CalendersetComponent } from "./setting/calenderset/calenderset.component";
import { PlanUploadComponent } from './setting/plan-upload/plan-upload.component';
import { DocplanUploadComponent } from './setting/docplan-upload/docplan-upload.component';
import { DailyAttendenceComponent } from './report/daily-attendence/daily-attendence.component';
import { FftDashboardForMdComponent } from './report/fft-dashboard-for-md/fft-dashboard-for-md.component';
import { SalestargetsetComponent } from './setting/salestargetset/salestargetset.component';
import { ExamcontentuploadComponent } from './setting/examcontentupload/examcontentupload.component';
import { ExamquestionsetComponent } from './setting/examquestionset/examquestionset.component';
import { RxreportComponent } from './report/rxreport/rxreport.component';
import { ExamresultComponent } from './report/examresult/examresult.component';
import { EmployeeAttendanceReportForFFMComponent } from './report/employee-attendance-report-for-ffm/employee-attendance-report-for-ffm.component';
import { TaDaExpenseReportComponent } from './report/ta-da-expense-report/ta-da-expense-report.component';
import { ImageModalComponent } from './report/image-modal/image-modal.component';
import { SharedPipeModule } from "app/pipes/shared-pipe.module";
import { DcrSummaryReportComponent } from './report/dcr-summary-report/dcr-summary-report.component';
import { DigitalGiftDisbursementReportComponent } from './report/digital-gift-disbursement-report/digital-gift-disbursement-report.component';
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
  FieldforcetrackingRoutingModule,
  SharedPipeModule
];

const COMPONENTS = [
  FieldforcetrackingComponent,
  ZoneComponent,
  CommonButtonComponent,
  ReportButtonComponent,
  RptFooterComponent,
  RptHeaderComponent,
  RptHeaderLandscapeComponent,
  DepoComponent,
  RegionComponent,
  AreaComponent,
  TerritoryComponent,
  DoctorComponent,
  MiovisitComponent,
  MarketComponent,
  ChemistComponent,
  ChemistwisevisitComponent,
  DoctorwisevisitComponent,
  ChemistvisitComponent,
  FftdashboardComponent,
  FftDashboardComponent,
  PunchInOutReportComponent,
  SalesReportComponent,
  CurrentlocationtrackerComponent,
  EmployeeRoadMapComponent,
  RptMapButtonComponent,
  CustomerWiseSalesReportComponent,
  EmployeeWisePromotionalItemComponent,
  DoctoreWisePromotionalItemComponent,
  CalendersetComponent,
  PlanUploadComponent,
  DocplanUploadComponent,
  DailyAttendenceComponent,
  FftDashboardForMdComponent,
  SalestargetsetComponent,
  ExamcontentuploadComponent,
  ExamquestionsetComponent,
  ExamresultComponent,
  RxreportComponent,
  EmployeeAttendanceReportForFFMComponent,
];
const SERVICES = [];
@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS, TaDaExpenseReportComponent, ImageModalComponent, DcrSummaryReportComponent, DigitalGiftDisbursementReportComponent,],
  providers: [...SERVICES],
})
export class FieldforcetrackingModule { }
