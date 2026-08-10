import { NgModule } from "@angular/core";
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
  NbSelectModule,
  NbUserModule,
} from "@nebular/theme";

import { ThemeModule } from "../@theme/theme.module";
import { PagesComponent } from "./pages.component";
import { PagesRoutingModule } from "./pages-routing.module";
import { ClientModule } from "./client/client.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { ECommerceModule } from "./e-commerce/e-commerce.module";
import { ModalButtonComponent } from './common/modal-button/modal-button.component';
//import { TaskEntryComponent } from './hrm/taskmanagement/task-entry/task-entry.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
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
    DashboardModule,
    ECommerceModule,
    ClientModule,
  ],
  declarations: [PagesComponent, ModalButtonComponent],
})
export class PagesModule { }

