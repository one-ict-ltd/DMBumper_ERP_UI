import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/@core/mock/common.service';
import { CommoncomboService } from 'app/services/commoncombo.service';
import { Observable } from 'rxjs/internal/Observable';
//import { CommonService } from '../../../@core/mock/common.service';

@Component({
  selector: 'ngx-rpt-header',
  templateUrl: './rpt-header.component.html',
  styleUrls: ['./rpt-header.component.scss']
})
export class RptHeaderComponent implements OnInit {

  //   public company: { name: string; address: string; custom_footer: boolean; phone: string; fax: string; email: string; website: string; vat: string; tin: string; };
  //   apiUrl: string = this.commonService.baseUrl;
  //   httpOptions = this.commonService.getHttpOptions();

  //    constructor(private commonService: CommonService) {
  //   //    this.company = {
  //   //     name: "Dahmashi Group",
  //   //     address: "Block H, Plot 33/A Road-12, Dhaka 1213",
  //   //     custom_footer: true,
  //   //     phone: "02-55042777",
  //   //   fax: "02-55042777",
  //   //     email: "info@dahmashigroup.com",
  //   //     website: "https://www.dahmashigroup.com/",
  //   //    vat: "",
  //   //     tin: "",
  //   //  };
  //    this.company = {
  //     name: "ALL IT LIMITED",
  //     address: "B-3, THE EMPORIUM, 14/1, MIRPUR ROAD, SHAMOLI, DHAKA-1207",
  //     custom_footer: true,
  //     phone: "1782676369",
  //     fax: "1782676369",
  //     email: "mamunkhan.bd@gmail.com",
  //     website: "",
  //     vat: "",
  //     tin: "",
  //  };
  //      // public company = {
  //    //   name: "Dahmashi Group",
  //     //   address: "Block H, Plot 33/A Road-12, Dhaka 1213",
  //    //   custom_footer: true,
  //     //   phone: "02-55042777",
  //    //   fax: "02-55042777",
  //    //   email: "info@dahmashigroup.com",
  //    //   website: "https://www.dahmashigroup.com/",
  //    //   vat: "",
  //    //   tin: "",
  //    // };
  //    }
  //   // constructor(private http: HttpClient, private commonService: CommonService, private comboService: CommoncomboService,) {}

  //   // private getDropdownData() {
  //   //   this.comboService.getCompany().subscribe((returns: any) => {
  //   //     console.log(returns.data);
  //   //     this.company = returns.data.map((val) => ({
  //   //               name: val.companyName,
  //   //               address: val.addressLine,
  //   //               custom_footer: true,
  //   //               phone:val.officeTelephone,
  //   //               fax: val.officeTelephone,
  //   //               email:val.companyEmail,
  //   //               website:val.website,
  //   //               vat: val.vatNo,
  //   //               tin: val.tinNo,
  //   //     }));
  //   //   });
  //   // }
  //   public pageNavigation = "Currency";
  //   public buttons = this.commonService.btnList;
  //   public show: boolean = true;

  //   ngOnInit(): void {
  //   }

  //   public ButtonAction() {
  //     if (this.commonService.buttonClicked == "create") {
  //       //this.getMaster();
  //       this.show = false;
  //     } else if (this.commonService.buttonClicked == "showlist") {
  //       this.show = true;
  //     } else if (this.commonService.buttonClicked == "save") {
  //       //this.openConfirmPopup("");
  //       //this.save();
  //       this.show = true;
  //     } else if (this.commonService.buttonClicked == "update") {
  //       //this.save();
  //       this.show = true;
  //     } else if (this.commonService.buttonClicked == "view") {
  //       this.show = false;
  //     } else if (this.commonService.buttonClicked == "reset") {
  //       //this.reset();
  //     } else if (this.commonService.buttonClicked == "edit") {
  //       //this.edit();
  //       this.show = false;
  //     }
  //   }

  // }



  apiUrl: string = this.commonService.baseUrl;
  httpOptions = this.commonService.getHttpOptions();

  public bodyData: any = [];

  public companyName = "";
  public addressLine = "";
  public officeTelephone = "";
  public companyEmail = "";
  public website = "";
  public filePath = "";
  public imageHeight = "";
  public imageWidth = "";

  constructor(
    private commonService: CommonService,
    private comboService: CommoncomboService
  ) {
    this.comboService.getCompanybyId().subscribe((returns: any) => {
      this.bodyData = returns.data;

      this.companyName = this.bodyData[0].companyName;
      this.addressLine = this.bodyData[0].addressLine;
      this.officeTelephone = this.bodyData[0].officeTelephone;
      this.companyEmail = this.bodyData[0].companyEmail;
      this.website = this.bodyData[0].website;
      this.filePath = this.bodyData[0].filePath;
      this.imageHeight = this.bodyData[0].imageHeight;
      this.imageWidth = this.bodyData[0].imageWidth;
    });
  }
  ngOnInit(): void { }
}