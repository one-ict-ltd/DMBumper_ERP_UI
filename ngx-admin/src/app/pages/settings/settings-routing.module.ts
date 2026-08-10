import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BranchComponent } from './branch/branch.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CompanyComponent } from './company/company.component';
import { DistrictComponent } from './district/district.component';
import { DivisionComponent } from './division/division.component';
import { MenuComponent } from './menu/menu.component';
import { MenupermissionComponent } from './menupermission/menupermission.component';
import { MenutypeComponent } from './menutype/menutype.component';
import { ModuleComponent } from './module/module.component';
import { ModulepermissionComponent } from './modulepermission/modulepermission.component';
import { MunicipilitylocationComponent } from './municipilitylocation/municipilitylocation.component';
import { ReportnameComponent } from './reportname/reportname.component';
import { ReportpermissionComponent } from './reportpermission/reportpermission.component';

import { SettingsComponent } from './settings.component';
import { ThanasComponent } from './thanas/thanas.component';
import { UsercreateComponent } from './usercreate/usercreate.component';
import { UsergroupComponent } from './usergroup/usergroup.component';
import { UserpermissionComponent } from './userpermission/userpermission.component';
import { UserregisterComponent } from './userregister/userregister.component';
import { UserwisecompanyComponent } from './userwisecompany/userwisecompany.component';
import { VouchertypeComponent } from './vouchertype/vouchertype.component';


const routes: Routes = [{
  path: '',
  component: SettingsComponent,
  children: [
    {
      path: 'vouchertype',
      component: VouchertypeComponent
    },
    {
      path: 'company',
      component: CompanyComponent
    },
    {
      path: 'branch',
      component: BranchComponent
    },
    {
      path: 'menutype',
      component: MenutypeComponent
    },
    {
      path: 'module',
      component: ModuleComponent
    },
    {
      path: 'menus',
      component: MenuComponent
    },
    {
      path: 'userregister',
      component: UserregisterComponent
    },
    {
      path: 'usercreate',
      component: UsercreateComponent
    },
    {
      path: 'usergroup',
      component: UsergroupComponent
    },
    {
      path: 'userwisecompany',
      component: UserwisecompanyComponent
    },
    {
      path: 'modulepermission',
      component: ModulepermissionComponent
    },
    {
      path: 'userpermission',
      component: UserpermissionComponent
    },
    {
      path: 'menupermission',
      component: MenupermissionComponent
    },
    {
      path: 'division',
      component: DivisionComponent
    },
    {
      path: 'district',
      component: DistrictComponent
    },
    {
      path: 'thanas',
      component: ThanasComponent
    },
    {
      path: 'municipilitylocation',
      component: MunicipilitylocationComponent
    },
    {
      path: 'division',
      component: DivisionComponent
    },
    {
      path: 'district',
      component: DistrictComponent
    },
    {
      path: 'thanas',
      component: ThanasComponent
    },
    {
      path: 'municipilitylocation',
      component: MunicipilitylocationComponent
    },
    {
      path: 'reportname',
      component: ReportnameComponent
    },
    {
      path: 'reportpermission',
      component: ReportpermissionComponent
    },
    {
      path: 'change-password',
      component: ChangePasswordComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
