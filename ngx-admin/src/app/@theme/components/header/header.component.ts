import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  NbComponentStatus,
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from "@nebular/theme";

import { UserData } from "../../../@core/data/users";
import { LayoutService } from "../../../@core/utils";
import { filter, map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { CommonService } from "app/@core/mock/common.service";
import { AuthService } from "../../../auth/auth.service";
import { NbToastrService } from "@nebular/theme";
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";

@Component({
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  com = this.commonService.getCurrentCompany();
  currentCompany = this.com == null ? "1" : this.com;
  currentTheme = "dark";

  destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  userPicture: string = '';

  themes = [
    {
      value: "default",
      name: "Light",
    },
    {
      value: "dark",
      name: "Dark",
    },
    {
      value: "cosmic",
      name: "Cosmic",
    },
    {
      value: "corporate",
      name: "Corporate",
    },
  ];

  currentModule = "setting";
  userMenu = [];
  tag: string = "my-context-menu";
  companies: any = [];
  modules = [
    {
      name: "Setting",
      value: "setting",
      class: "primary",
      link: "/pages/settings/vouchertype",
    },
    {
      name: "Sale",
      value: "sale",
      class: "primary",
      link: "/pages/client/create-client",
    },
    {
      name: "Inventory",
      value: "inventory",
      class: "primary",
      link: "/pages/client/create-client",
    },
    {
      name: "Reports",
      value: "reports",
      class: "primary",
      link: "/pages/reports/account-ledger",
    },
  ];
  companyData: any;
  currentCompanyId: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private commonService: CommonService,
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private toastrService: NbToastrService,
    private empInfoService: EmployeeinformationService
  ) {
    this.userMenu = this.commonService.userMenu;
    var auth_token = localStorage.getItem("auth_token");
    //console.log("auth_token: " + auth_token);

    if (auth_token != null) {
      this.menuService.onItemClick().subscribe((e) => {
        //console.log(e.item);
        //console.log("e.item.title: " + e.item.title);
        if (e.item.title == "Logout") {
          let data = { Name: localStorage.getItem('user_name') };
          localStorage.clear();
          this.authService.UserLogout(data).subscribe((returns: any) => {
            // if (returns.success) {
            //   console.log(returns.message + ' || ' + new Date());
            // }
            // else console.log(returns.message + ' || ' + new Date());
            console.log(returns.message + ' || ' + new Date());
          });

          // this.authService.logout().subscribe((returns: any) => {
          //   if (returns.success) {
          //     //var data = returns.data;
          //     //this.userMenu.slice[1]
          //   }
          //   else console.log("Failed");
          // });

          this.router.navigate([`auth/login`]);
        }
        else if (e.item.title == "Login") {
          this.router.navigate([`auth/login`]);
        }
        else if (e.item.title == "Profile") {
          this.router.navigate([`pages/dashboard`]);
        }
        else if (e.item.title == "Change Password") {
          this.router.navigate([`pages/settings/change-password`]);
          //this.toastrService.info("Comming soon...", "Features")
        } else if (e.item.title == "ESS Portal") {
          this.router.navigate([`pages/hrm/ess-portal`]);
          //this.toastrService.info("Comming soon...", "Features")
        }
        else {
          //this.router.navigate([`pages/dashboard`]);
        }
      });

      //debugger;

      this.companyData = JSON.parse(localStorage.getItem("company") || "null");
      if (this.companyData && this.companyData[0]) {
        this.companies = this.companyData[0].uc || [];
      }

      if (this.companyData && this.companyData[0] && this.companyData[0].uc && this.companyData[0].uc.length > 0) {
        this.companyData[0].uc.map((item) => {
          //debugger;
          if (item.isDefault) {
            this.commonService.setCurrentCompany(item.companyId.toString());
          }
          else {
            if (this.companyData[0].uc.length == 1)
              this.commonService.setCurrentCompany(item.companyId.toString());
          }
        });

        this.com = this.commonService.getCurrentCompany();
        this.currentCompany = this.com == null ? "1" : this.com;
      }
    } else {
      this.router.navigate([`auth/login`]);
    }
  }

  ngOnInit() {
    //this.currentTheme = this.themeService.currentTheme;
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => {
        this.user = users.nick;
        this.user.name = localStorage.getItem("userName");
        this.getUserPictureAsync();
      });

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
      );

    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$)
      )
      .subscribe((themeName) => {
        var theme = this.commonService.getCurrentTheme();
        if (theme != null) {
          this.changeTheme(theme);
        } else {
          this.currentTheme = themeName;
        }
      });
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public changeTheme(themeName: string) {
    this.commonService.setCurrentTheme(themeName);
    this.themeService.changeTheme(themeName);
  }
  public changeCompany(companyId: any) {
    this.commonService.setCurrentCompany(companyId);
    this.toastrService.info("Message", "Company Name changed");
  }
  public toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();
    return false;
  }

  public navigateHome() {
    // this.menuService.navigateHome();
    // return false;
    debugger
    this.router.navigate([`pages/dashboard`]);
  }

  public logout() {
    debugger;
    //var name: any = "admin@email.com";
    this.authService.logout().subscribe((returns: any) => {
      if (returns.success) {
        var data = returns.data;
        localStorage.clear();
        this.router.navigate([`auth/login`]);
      }
      //console.log("Failed");
    });
  }

  ////////////// Module Setting ////////////////

  public setModuleRouting(name: any) {
    this.router.navigate([`${name}`]);
  }

  public async getUserPictureAsync(): Promise<void> {
    try {
      const data = await this.empInfoService.GetEmployeeBasicInfoByIdForESS().toPromise();
      if (data.success) {
        const baseUrl = "http://103.106.236.93:9115/";
        this.userPicture = baseUrl + data.data[0].imageUrl;

        if (this.userPicture === baseUrl || !data.data[0].imageUrl) {
          this.userPicture = 'assets/images/user.png';
        }

        this.user.picture = this.userPicture;
      }
    } catch (error) {
      console.error("Failed to load user picture", error);
      this.user.picture = 'assets/images/user.png';
    }
  }

}
