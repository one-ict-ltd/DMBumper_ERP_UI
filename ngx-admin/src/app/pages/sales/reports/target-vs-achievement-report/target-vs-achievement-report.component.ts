import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { CommonService } from 'app/@core/mock/common.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ngx-target-vs-achievement-report',
  templateUrl: './target-vs-achievement-report.component.html',
  styleUrls: ['./target-vs-achievement-report.component.scss']
})
export class TargetVsAchievementReportComponent implements OnInit {


  formPeriod: FormGroup;
  pageNavigation = "Target Vs Sales & Collection Achievement";
  showbody = false;
  submitted = true;
  public rowData: [];
  lastYear = '';
  year = '';
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastrService: NbToastrService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.createPeriodForm();
  }


  RptButtonAction(): void {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      this.generateCrReport("pdf");
    } else if (clicked == "print") {
      this.generateCrReport("pdf");
    } else if (clicked == "csv") {
      this.generateCrReport("Excel");
    } else if (clicked == "refresh") {
      this.onRefresh();
    } else if (clicked == "email") {
      //this.onEmail();
    } else {
      this.toastrService.warning("Message", "please clicked any button");
    }
  }


  createPeriodForm(): void {
    this.formPeriod = this.formBuilder.group({
      depotCode: new FormControl(''),
      territoryCode: new FormControl(''),
      fromDate: new FormControl(new Date(), Validators.required),
      toDate: new FormControl(new Date(), Validators.required)
    });
    this.submitted = false;
  }

  private onPreview() {
    const params = this.formPeriod.getRawValue();
    const fromDate = params.fromDate;
    const toDate = params.toDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      if (this.formPeriod.valid) {
        this.getReportData();
        this.showbody = true;
      } else {
        this.toastrService.warning("Please Check Data", "Message");
      }
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }

  getReportData(): void {
    const params = this.formPeriod.getRawValue();
    const apiUrl = `SalesInvoice/GetTargetVsAchievementReport?depotCode=${params.depotCode}&territoryCode=${params.territoryCode}&fromDate=${this.commonService.DateFormat(params.fromDate)}&toDate=${this.commonService.DateFormat(params.toDate)}`;
    this.commonService.getReportData(apiUrl).pipe(take(1)).subscribe((returns: any) => {
      if (returns.success) {
        this.rowData = returns.data;
        this.year = this.datePipe.transform(params.toDate, 'yy');
        this.lastYear = (Number(this.datePipe.transform(params.toDate, 'yy')) - 1).toString();
      } else {
        this.toastrService.danger(this.commonService.nodatafound, "Message");
      }
    });
  }

  getPercentage(part: number, total: number): number {
    if (total === 0) {
      return 100;
    } else {
      return (part * 100) / total;
    }
  }

  getTotal(arr: any[], field: string): number {
    if (arr === undefined || arr === null || arr.length === 0) {
      return 0;
    } else {
      const ret = arr.reduce((p, c) => p += c[field], 0);
      return ret;
    }
  }

  onRefresh(): void {
    this.createPeriodForm();
    this.showbody = false;
  }

  generateCrReport(reportFormat: any) {
    const params = this.formPeriod.getRawValue();
    const fromDate = params.fromDate;
    const toDate = params.toDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      const userInfo = this.commonService.GetUserProfileJson();

      params.fromDate = this.commonService.DateFormat(params.fromDate);
      params.toDate = this.commonService.DateFormat(params.toDate);
      const apiUrl = `SalesInvoiceReport/GetTargetVsAchievementReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&fDate=${params.fromDate}&tDate=${params.toDate}`;

      this.commonService.GetCrystalReportData(apiUrl).pipe(take(1)).subscribe((returns: any) => {
        let res = JSON.parse(returns);
        if (res.status) {
          this.commonService.GenerateBase64ToReport(res.data[0].data);
        } else {
          this.toastrService.warning("Message", this.commonService.nodatafound);
        }
      });
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }


}
