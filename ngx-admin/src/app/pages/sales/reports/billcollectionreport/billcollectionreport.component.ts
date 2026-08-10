// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'ngx-billcollectionreport',
//   templateUrl: './billcollectionreport.component.html',
//   styleUrls: ['./billcollectionreport.component.scss']
// })
// export class BillcollectionreportComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommonService } from "app/@core/mock/common.service";
import { CommoncomboService } from "app/services/commoncombo.service";
import { ProducttransferService } from "app/services/inventory/producttransfer.service";
import { StockinService } from "app/services/inventory/stockin.service";
import { MenuService } from "app/services/menu.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";

@Component({
  selector: 'ngx-billcollectionreport',
  templateUrl: './billcollectionreport.component.html',
  styleUrls: ['./billcollectionreport.component.scss']
})
export class BillcollectionreportComponent implements OnInit {
  public pageNavigation = "Bill Collection Report";
  public rReportHeader = "Bill Collection";
  public tableHeader = ["#", "Customer Name", "paymentMode", "Bank Name", "Cheque No", "TRX No.", "Collection Amount"];
  public apiUrl = "";
  public htmlBodyData: string = "";
  public bodyData: any = [];
  public bodyDatashow: any = [];
  public params = [];
  public companies = [];
  public sbuList = [];
  public storeList = [];
  public TRNList = [];
  public fromStoreId: number = 0;
  public showbody: boolean = false;

  master: {
    storeId: number;
    sbuId: number;
    stockReceiveId: number;
    fromDate: Date;
    toDate: Date;
    mobileNo: string;
    partyId: number;
    partySelected: {};
  };

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private menuService: MenuService,
    private stockinService: StockinService,
    private producttransferService: ProducttransferService,
    private salesinvoiceService: SalesinvoiceService,
  ) {
    this.GetAllPartysByTypeId(0);
    this.getMaster();
  }

  public getMaster() {
    this.master = {
      storeId: 0,
      sbuId: 0,
      stockReceiveId: 0,
      fromDate: new Date(),
      toDate: new Date(),
      mobileNo: '',
      partyId: 0,
      partySelected: null,
    };
  }


  ngOnInit(): void { }
  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      this.generateReport("pdf");
      this.getMaster();
    } else if (clicked == "print") {
      this.generateReport("print");
      this.getMaster();
    } else if (clicked == "csv") {
      this.onExportCSV();
    } else if (clicked == "refresh") {
      this.onRefresh();
      this.getMaster();
    } else if (clicked == "email") {
      this.onEmail();
    } else {
      this.toastrService.warning("Message", "please clicked any button");
    }
  }

  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Customer Name:",
      leftValue: this.master.partySelected == null ? 'All' : this.master.partySelected['name'],
      rightLabel: "Customer Contact:",
      rightValue: this.master.partySelected == null ? 'All' : this.master.partySelected['mobileNo'],
    });
  }

  public GetPartyDetails(partyId) {
    this.master.mobileNo = this.master.partySelected['mobileNo'];
  }
  public partyList = [];
  public GetAllPartysByTypeId(partyTypeId: any) {
    this.salesinvoiceService.GetAllPartysByTypeId(partyTypeId).subscribe((returns: any) => {
      this.partyList = returns.data.map((val: any) => ({
        id: val.partyId,
        name: val.partyName,
        address: val.address,
        mobileNo: val.mobileNo,
      }));
    });
  }


  public natureName = "";
  public groupCode = "";
  public groupName = "";
  public fromDate = new Date();
  public toDate = new Date();


  private getReportData() {
    this.apiUrl = `SalesCollection/getRptBillCollectionRpt?fromDate=${this.master.fromDate.toDateString().substring(4, 15)}&toDate=${this.master.toDate.toDateString().substring(4, 15)}&partyId=${this.master.partyId}`;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = [];
        this.bodyData = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  private onRefresh() {
    this.bodyData = [];
    this.htmlBodyData = '';
    this.showbody = false;
    this.getMaster();
  }

  private onPreview() {
    this.getReportData();
    this.showbody = true;
  }

  private onExportCSV() {
    this.getReportData();
    var fileName = this.pageNavigation + ".xlsx";
    this.commonService.generateExcel(this.bodyData, this.tableHeader, fileName);
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  public generateReport(buttonAction: any) {
    this.setParam();
    var fileName = this.pageNavigation + ".pdf";
    this.getReportData();
    const content = document.getElementById("reportHeader");
    this.commonService.generateSalesReport(buttonAction, fileName, content);
  }


}





