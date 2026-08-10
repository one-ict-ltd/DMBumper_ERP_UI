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
  NbTooltipModule,
  NbUserModule,
} from "@nebular/theme";

import { ThemeModule } from "../../@theme/theme.module";
import { Ng2SmartTableModule } from "ng2-smart-table";

import { FormsModule } from "@angular/forms";
import { ClientRoutingModule } from "./client-routing.module";
import { ClientComponent } from "./client.component";

import { CreateClientComponent } from "./create-client/create-client.component";
import { ClientTransectionComponent } from "./client-transection/client-transection.component";
import { CommonButtonComponent } from "../common/common-button/common-button.component";
import { GridButtonComponent } from "../common/grid-button/grid-button.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { DialogNamePromptComponent } from "./dialog-name-prompt/dialog-name-prompt.component";
import { AgGridModule } from 'ag-grid-angular';
import { CommonActionComponent } from '../common/common-action/common-action.component';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';


const MODULES = [
  ThemeModule,
  Ng2SmartTableModule,
  FormsModule,
  ThemeModule,
  NbInputModule,
  NbCardModule,
  NbButtonModule,
  NbActionsModule,
  NbUserModule,
  NbCheckboxModule,
  NbCardModule,
  NbDatepickerModule,
  NbSelectModule,
  NbOptionModule,
  NbIconModule,
  NbAutocompleteModule,
  NgSelectModule,
  NbRadioModule,
  NbTabsetModule,
  NbTooltipModule,
  AgGridModule,
  ClientRoutingModule
];

const COMPONENTS = [
  ClientComponent,
  CreateClientComponent,
  ClientTransectionComponent,
  CommonButtonComponent,
  CommonActionComponent,
  GridButtonComponent,
  DialogNamePromptComponent,
  DialogConfirmComponent
];

const SERVICES = [];

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  providers: [...SERVICES],
})
export class ClientModule {}
