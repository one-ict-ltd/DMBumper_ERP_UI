import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { CommonService } from 'app/@core/mock/common.service';
import { AuthService } from 'app/auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ngx-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {


  frmResetPassword: FormGroup;
  submitted: boolean;
  confirmPasscode: string = 'demo@123';


  constructor(
    private router: Router,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private loginService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createResetForm();
    console.log('got it');
  }
  ngOnDestroy(): void {
    this.commonService.clearTempToken();
  }

  createResetForm() {
    this.frmResetPassword = this.fb.group({
      Password: new FormControl('', [Validators.required, Validators.maxLength(12), Validators.minLength(6)]),
      ConfirmPassword: new FormControl('', [Validators.required, Validators.maxLength(12), Validators.minLength(6)]),
    });
  }

  get password() {
    return this.frmResetPassword.get('Password');
  }

  get confirmPassword() {
    return this.frmResetPassword.get('ConfirmPassword');
  }

  changePasswordSave() {
    console.log('clicked');
    this.submitted = true;
    if (this.frmResetPassword.valid) {
      this.loginService.updatePassword(this.frmResetPassword.getRawValue()).pipe(take(1)).subscribe(
        (returns: any) => {
          if (returns.success) {
            this.toastrService.success(returns.message, "Message");
            this.router.navigate([`auth/login`]);
          } else {
            this.toastrService.warning(returns.message, "Message");
          }
        },
        (err) => {
          this.submitted = false;
        },
        () => {
          this.submitted = false;
        }
      );
    }

  }
  IsDummayPassword(): boolean {
    debugger
    var password = this.frmResetPassword.get("Password").value;
    var confirmPassword = this.frmResetPassword.get("ConfirmPassword").value;
    if ((password === confirmPassword) && confirmPassword.toLowerCase().trim() === this.confirmPasscode) {
      return true;
    }
    else return false;
  }


}
