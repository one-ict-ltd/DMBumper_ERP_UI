import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ECommerceComponent } from "./e-commerce/e-commerce.component";
//import { TaskEntryComponent } from "./taskmanagement/task-entry/task-entry.component";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        component: ECommerceComponent,
      },
      {
        path: "iot-dashboard",
        component: DashboardComponent,
      },
      // {
      //   path: "task-entry",
      //   component: TaskEntryComponent,
      // },
      {
        path: "layout",
        loadChildren: () =>
          import("./layout/layout.module").then((m) => m.LayoutModule),
      },
      {
        path: "accounting",
        loadChildren: "./accounting/accounting.module#AccountingModule",
      },
      {
        path: "settings",
        loadChildren: "./settings/settings.module#SettingsModule",
      },
      {
        path: "reports",
        loadChildren: "./reports/reports.module#ReportsModule",
      },
      {
        path: "client",
        loadChildren: "./client/client.module#ClientModule",
      },
      {
        path: "inventory",
        loadChildren: "./inventory/inventory.module#InventoryModule",
      },
      {
        path: "purchase",
        loadChildren: "./purchase/purchase.module#PurchaseModule",
      },
      {
        path: "sales",
        loadChildren: "./sales/sales.module#SalesModule",
      },
      {
        path: "hrm",
        loadChildren: "./hrm/hrm.module#HrmModule",
      },
      {
        path: "production",
        loadChildren: "./production/production.module#ProductionModule",
      },
      {
        path: "fieldforcetracking",
        loadChildren:
          "./fieldforcetracking/fieldforcetracking.module#FieldforcetrackingModule",
      },
      // {
      //   path: "taskmanagement",
      //   loadChildren:
      //     "./taskmanagement/taskmanagement.module#TaskManagementModule",
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
//console.log(routes);
