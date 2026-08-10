import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/@core/mock/common.service';

@Component({
  selector: 'ngx-rpt-header-landscape',
  templateUrl: './rpt-header-landscape.component.html',
  styleUrls: ['./rpt-header-landscape.component.scss']
})
export class RptHeaderLandscapeComponent implements OnInit {

  public company: { name: string; address: string; custom_footer: boolean; phone: string; fax: string; email: string; website: string; vat: string; tin: string; };

  constructor(private commonService: CommonService) {
    this.company = {
      name: "One Information And Communications Technology Ltd",
      address: "14/A, Center Point Concord Unit-10A & B Tejgaon, Dhaka - 1215",
      custom_footer: true,
      phone: "01704-055668",
      fax: "02-98765432",
      email: "info@one-ict.com",
      website: "www.one-ict.com",
      vat: "13145664564",
      tin: "00000000000",
    };
  }
  public pageNavigation = "Currency";
  public buttons = this.commonService.btnList;
  public show: boolean = true;

  ngOnInit(): void {
  }

  public ButtonAction() {
    if (this.commonService.buttonClicked == "create") {
      //this.getMaster();
      this.show = false;
    } else if (this.commonService.buttonClicked == "showlist") {
      this.show = true;
    } else if (this.commonService.buttonClicked == "save") {
      //this.openConfirmPopup("");
      //this.save();
      this.show = true;
    } else if (this.commonService.buttonClicked == "update") {
      //this.save();
      this.show = true;
    } else if (this.commonService.buttonClicked == "view") {
      this.show = false;
    } else if (this.commonService.buttonClicked == "reset") {
      //this.reset();
    } else if (this.commonService.buttonClicked == "edit") {
      //this.edit();
      this.show = false;
    }
  }

}
