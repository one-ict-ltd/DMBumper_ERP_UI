import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { DomSanitizer } from "@angular/platform-browser";
import { CommonService } from "app/@core/mock/common.service";
import { FiscalyearService } from "app/services/budget/fiscalyear.service";

@Component({
  selector: 'ngx-confirmation-report',
  templateUrl: './confirmation-report.component.html',
  styleUrls: ['./confirmation-report.component.scss']
})
export class ConfirmationReportComponent implements OnInit {

  pageNavigation = "Employee Confirmation Report";
  fiscalYearId: number;
  monthName: string;

  fiscalYearSelected: {};
  salaryTypeSelected: {};
  bonusTypeSelected: {};
  monthSelected: {};

  apiUrl = "";
  showbody: boolean = false;

  base64Pdf: any;
  showDateRange: boolean = false;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private fiscalyearService: FiscalyearService,
    private sanitizer: DomSanitizer
  ) {
    this.getAllDropdown();
  }

  fiscalYearItems: [];
  public LoadFiscalYear() {
    this.fiscalyearService.getFiscalYear().subscribe((returns: any) => {
      this.fiscalYearItems = returns.data.map((val) => ({
        id: val.fiscalYearId,
        name: val.yearName,
      }));
    });
  }

  monthItems: [];
  public LoadMonthName() {
    this.comboService.getCmnDropDown(0, "Month Name").subscribe((returns: any) => {
      this.monthItems = returns.data.map((val) => ({
        id: val.dropDownValue,
        name: val.dropDownText,
      }));
    });
  }

  ngOnInit(): void { }
  public RptButtonAction() {
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
      this.onEmail();
    } else {
      this.toastrService.warning("Message", "please clicked any button");
    }
  }

  generateCrReport(reportFormat: any) {
    //debugger;
    if (this.fiscalYearSelected == undefined || this.fiscalYearSelected == null) {
      this.toastrService.warning('please select a year', 'Warning');
      return;
    }
    if (this.monthSelected == undefined || this.monthSelected == null) {
      this.toastrService.warning('please select a month', 'Warning');
      return;
    }

    let heldupMonth = new Date(`${this.fiscalYearSelected['name']}-${this.monthSelected['id']}-01`);

    console.log('param :', `${this.fiscalYearSelected['name']}-${this.monthSelected['id']}-01`);
    console.log('heldupMonth : ', heldupMonth);


    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `SalaryReport/GetConfirmationReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&heldupMonth=${this.commonService.DateFormat(heldupMonth)}&salaryPeriodId=${null}`;

    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        console.log(res.message);
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }


  public getAllDropdown() {
    this.LoadFiscalYear();
    this.LoadMonthName();
  }


  private getReportData() {
    if (this.fiscalYearSelected == undefined || this.fiscalYearSelected == null) {
      this.toastrService.warning('please select a year', 'Warning');
      return;
    }
    if (this.monthSelected == undefined || this.monthSelected == null) {
      this.toastrService.warning('please select a month', 'Warning');
      return;
    }

    let heldupMonth = new Date(`${this.fiscalYearSelected['name']}-${this.monthSelected['id']}-01`);

    console.log('param :', `${this.fiscalYearSelected['name']}-${this.monthSelected['id']}-01`);
    console.log('heldupMonth : ', heldupMonth);

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `SalaryReport/GetConfirmationReport?reportFormat=Pdf&userId=${userInfo[0].employeeid}&heldupMonth=${this.commonService.DateFormat(heldupMonth)}&salaryPeriodId=${null}`;

    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.base64Pdf = this.sanitizer.bypassSecurityTrustResourceUrl(res.data[0].data);
      }
      else {
        console.log(res.message);
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }
  totalInvoice = 0;

  private onRefresh() {
    window.location.reload();
  }

  private onPreview() {
    this.getReportData();
    //this.showbody = true;
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  currencyFormatter(currency) {
    return this.commonService.roundWithDecimalPoint(currency, 0);
  }
}