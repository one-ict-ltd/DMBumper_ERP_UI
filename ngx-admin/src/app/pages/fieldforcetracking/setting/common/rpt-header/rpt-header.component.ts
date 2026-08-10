import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/@core/mock/common.service';
import { CommoncomboService } from 'app/services/commoncombo.service';

@Component({
  selector: 'ngx-rpt-header',
  templateUrl: './rpt-header.component.html',
  styleUrls: ['./rpt-header.component.scss']
})
export class RptHeaderComponent implements OnInit {
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
