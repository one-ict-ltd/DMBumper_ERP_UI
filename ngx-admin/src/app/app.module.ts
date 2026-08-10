/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { CoreModule } from "./@core/core.module";
import { ThemeModule } from "./@theme/theme.module";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import {
  NbAlertModule,
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbFormFieldModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from "@nebular/theme";

import { FormsModule } from "@angular/forms";
import { AuthModule } from "./auth/auth.module";
import { DashboardModule } from "./pages/dashboard/dashboard.module";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { ProductionModule } from "./pages/production/production.module";



// import { MapBoxModule } from "angular-mapbox/module";

@NgModule({
  declarations: [AppComponent,],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbFormFieldModule,
    NbAlertModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: "AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY",
    }),
    // MapBoxModule.forRoot(
    //   "pk.eyJ1IjoiYmFzaGFybmFpbSIsImEiOiJja2ZrbGlieDMwNHRqMnJwamxmZmVxeDFxIn0.oB7ArqzMqQEcPnD69k_wyQ"
    // ),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    AuthModule,
    DashboardModule,
    ProductionModule,

  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
