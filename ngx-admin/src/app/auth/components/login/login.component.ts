import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { NavigationStart, Router } from "@angular/router";
import { NbToastrService } from "@nebular/theme";
import { CommonService } from "app/@core/mock/common.service";
import { AuthService } from "app/auth/auth.service";
import { filter } from "rxjs/operators";

@Component({
  selector: "ngx-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  protected options: {};
  protected cd: ChangeDetectorRef;
  redirectDelay: number;
  showMessages: any = {};
  strategy: string;
  errors: string[];
  messages: string[];
  user: any = {};
  submitted: boolean;
  rememberMe: boolean = true;
  socialLinks: any;
  btnRemove: any;

  isLogin = localStorage.getItem("isLogin");
  auth_token = localStorage.getItem("auth_token");

  constructor(
    private router: Router,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private loginService: AuthService
  ) {
    this.btnRemove = document.querySelector(".navigation");
    this.btnRemove.style.display = "none";
    this.user.Name = "";
    this.user.Password = "";
  }

  ngOnInit(): void { }
  login(): void {
    //debugger;
    this.user;
    this.loginService.login(this.user).subscribe((returns: any) => {
      if (returns.success) {
        //console.log(returns);
        this.commonService.setLocalStorage(returns);


        if (this.user.Name == '100000') {
          this.user.Name = "";
          this.user.Password = "";

          this.router.navigate([`pages/fieldforcetracking/dashboard`]);
          // this.router.navigate(['pages/fieldforcetracking/dashboard'])
          //   .then(() => {
          //     this.router.navigate([`pages/fieldforcetracking/dashboard`]);
          //   });

        }
        else {
          this.user.Name = "";
          this.user.Password = "";
          this.router.navigate([`pages/dashboard`]);
        }
      } else {
        if (returns.passwordExpired) {
          this.commonService.setTempToken(returns.token);
          this.router.navigate([`auth/reset-password`]);
        }
        this.toastrService.warning(returns.message, "Message");
      }
    });
  }

  showPassword = true;
  getInputType() {
    if (this.showPassword) {
      return "text";
    }
    return "password";
  }
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
