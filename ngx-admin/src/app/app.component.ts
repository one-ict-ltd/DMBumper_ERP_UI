/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AnalyticsService } from "./@core/utils/analytics.service";
import { SeoService } from "./@core/utils/seo.service";

@Component({
  selector: "ngx-app",
  template: "<router-outlet></router-outlet>",
})
export class AppComponent implements OnInit {
  constructor(
    private analytics: AnalyticsService,
    private seoService: SeoService,
    private router: Router
  ) {
    this.checkLogin();
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
  }

  isLogin = localStorage.getItem("isLogin");
  auth_token = localStorage.getItem("auth_token");
  public checkLogin() {
    if (this.isLogin == "true" && this.auth_token !== undefined) {
      // this.router.navigate([`pages/dashboard`]);
      //window.location.replace(localStorage.LocalHost+'/#/pages');
    } else {
      this.router.navigate([`auth/login`]);
    }
  }
}
