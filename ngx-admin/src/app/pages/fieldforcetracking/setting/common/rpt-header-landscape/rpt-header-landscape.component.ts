import { Component, OnInit } from '@angular/core';
import { CommoncomboService } from 'app/services/commoncombo.service';

@Component({
  selector: 'ngx-rpt-header-landscape',
  templateUrl: './rpt-header-landscape.component.html',
  styleUrls: ['./rpt-header-landscape.component.scss']
})
export class RptHeaderLandscapeComponent implements OnInit {

  public bodyData: any = [];

  public companyName = '';
  public addressLine = '';
  public officeTelephone = '';
  public companyEmail = '';
  public website = '';
  public filePath = '';
  public imageHeight = '';
  public imageWidth = '';

  constructor(private comboService: CommoncomboService) {

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

  ngOnInit(): void {
  }

}
