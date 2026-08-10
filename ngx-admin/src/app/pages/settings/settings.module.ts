import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NbActionsModule,
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

import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingsComponent } from "./settings.component";
import { ThemeModule } from "app/@theme/theme.module";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { HttpClientModule } from "@angular/common/http";
import { AgGridModule } from "ag-grid-angular";

import { CommonActionComponent } from "../settings/common/common-action/common-action.component";
import { CommonButtonComponent } from "../settings/common/common-button/common-button.component";
import { GridButtonComponent } from "../settings/common/grid-button/grid-button.component";

import { VouchertypeComponent } from "./vouchertype/vouchertype.component";
import { CompanyComponent } from "./company/company.component";
import { BranchComponent } from './branch/branch.component';
import { MenutypeComponent } from './menutype/menutype.component';
import { MenuComponent } from './menu/menu.component';
import { ModuleComponent } from "./module/module.component";
import { UsergroupComponent } from './usergroup/usergroup.component';
import { UserwisecompanyComponent } from './userwisecompany/userwisecompany.component';
import { ModulepermissionComponent } from './modulepermission/modulepermission.component';
import { MenupermissionComponent } from './menupermission/menupermission.component';
import { UserpermissionComponent } from './userpermission/userpermission.component';
import { UserregisterComponent } from './userregister/userregister.component';
import { UsercreateComponent } from './usercreate/usercreate.component';
import { ReportnameComponent } from './reportname/reportname.component';
import { ReportpermissionComponent } from './reportpermission/reportpermission.component';
import { DivisionComponent } from './division/division.component';
import { DistrictComponent } from './district/district.component';
import { ThanasComponent } from './thanas/thanas.component';
import { MunicipilitylocationComponent } from './municipilitylocation/municipilitylocation.component';
import { ChangePasswordComponent } from "./change-password/change-password.component";

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
  SettingsRoutingModule,
  FormsModule,
  HttpClientModule,
  AgGridModule.withComponents([]),
  NbToastrModule,

];

const COMPONENTS = [
  SettingsComponent,
  VouchertypeComponent,
  CompanyComponent,
  BranchComponent,
  CommonButtonComponent,
  CommonActionComponent,
  GridButtonComponent,
  MenutypeComponent,
  MenuComponent,
  ModuleComponent,
  UsergroupComponent,
  UserwisecompanyComponent,
  ModulepermissionComponent,
  MenupermissionComponent,
  UserpermissionComponent,
  UserregisterComponent,
  UsercreateComponent,
  ReportnameComponent,
  ReportpermissionComponent,
  DivisionComponent,
  DistrictComponent,
  ThanasComponent,
  MunicipilitylocationComponent,
  ChangePasswordComponent
];
const SERVICES = [];

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  providers: [...SERVICES],
})
export class SettingsModule { }
