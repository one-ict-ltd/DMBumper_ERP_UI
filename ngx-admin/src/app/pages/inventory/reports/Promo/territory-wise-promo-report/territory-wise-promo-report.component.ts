import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommonService } from "app/@core/mock/common.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";

@Component({
  selector: 'ngx-territory-wise-promo-report',
  templateUrl: './territory-wise-promo-report.component.html',
  styleUrls: ['./territory-wise-promo-report.component.scss']
})
export class TerritoryWisePromoReportComponent implements OnInit {
  fromdateSelected = new Date();
  todateSelected = new Date();
  territorySelected: any = {};
  territoryList: any[]
  territoryCode: any = "";
  depotCode: any = "";
  pageNavigation = "Territory Wise Promo Report";
  apiUrl = "";
  bodyData: any = [];
  companyId: number = 0;
  showbody: boolean = false;
  fDate: Date;
  tDate: Date;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private salesinvoiceService: SalesinvoiceService,
  ) {
    this.fDate = new Date();
    this.tDate = new Date();
    this.getAllDropdown();
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
    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    if(this.depotCode == ""){
      this.toastrService.danger("Message", "Please Select Depot!");
      return;
    }
   
    this.apiUrl = `PromoReport/TerritoryWisePromo?userId=${userInfo[0].employeeid}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&territoryCode=${this.territoryCode}&reportFormat=${reportFormat}`;
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }

  public getAllDropdown() {
    this.GetAllDepo();
  }

  depotList: any[];
  depotSelected = {};
  public GetAllDepo() {
    this.depotSelected = {};

    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetAllDepot`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.depotList = returns.data.map((val: any) => ({
          id: val.depotCode,
          name: val.depotName,
        }));
        if (returns.data.length == 1) {
          this.depotSelected = { id: returns.data[0].depotCode, name: returns.data[0].depotName };
          this.depotCode = returns.data[0].depotCode;
          this.getAllTerritory(this.depotCode);
        }
      }
    })
  }

  getAllTerritory(depotCode: any = '') {
    this.territoryList = [];
    this.territorySelected = {};
    this.salesinvoiceService.GetAllTerritoryForDepot(depotCode).subscribe((returns: any) => {
      if (returns.success) {
        this.territoryList = returns.data.map((val: any) => ({
          id: val.TerritoryCode,
          name: val.TerritoryName,
        }));
      }
    });
  }

  private getReportData() {
    this.bodyData = [];
    this.apiUrl = "";
    if(this.depotCode == ""){
      this.toastrService.danger("Message", "Please Select Depot!");
      return;
    }
   
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `Promo/TerritoryWisePromo?userId=${userInfo[0].employeeid}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&territoryCode=${this.territoryCode}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  private onRefresh() {
    window.location.reload();
  }

  private onPreview() {
    this.getReportData();
    this.showbody = true;
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }
}