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
  NbMenuModule,
  NbOptionModule,
  NbRadioModule,
  NbSelectModule,
  NbTabsetModule,
  NbToastrModule,
  NbTreeGridModule,
  NbUserModule,
  
} from "@nebular/theme";

import { ThemeModule } from "app/@theme/theme.module";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { ReportsRoutingModule } from "./reports-routing.module";
import {
  AccountledgerComponent,
  FsIconComponent,
} from "./accountledger/accountledger.component";
import { ReportsComponent } from "./reports.component";

const MODULES = [
  NbButtonModule,
  NbCardModule,
  NbTreeGridModule,
  NbIconModule,
  NbInputModule,
  ThemeModule,
  Ng2SmartTableModule,
  ReportsRoutingModule,
];

const COMPONENTS = [ReportsComponent, AccountledgerComponent, FsIconComponent];
const SERVICES = [];

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  providers: [...SERVICES],
})
export class ReportsModule {}
