import { Component, OnInit } from "@angular/core";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { SalesreturnService } from "app/services/sales/salesreturn.service";
import { ProductrequisitionService } from "app/pages/purchase/settings/productrequisition.service";
import { DomSanitizer } from "@angular/platform-browser";
import { MiscellaneousItemService } from "app/services/sales/miscellaneous-item.service";
import { first } from 'rxjs/operators';

@Component({
  selector: 'ngx-miscellaneous-stock-details',
  templateUrl: './miscellaneous-stock-details.component.html',
  styleUrls: ['./miscellaneous-stock-details.component.scss']
})
export class MiscellaneousStockDetailsComponent implements OnInit {

  //date = new Date().getFullYear();
  fromdateSelected = new Date();
  todateSelected = new Date();
  territorySelected: any = {};
  territoryList: any[]
  territoryCode: any = "";
  depotCode: any = "";

  // yearName = this.date;
  // prevYearName = this.date - 1;

  pageNavigation = "Miscellaneous Stock Details Report";

  // tableHeader = [
  //   "Date",
  //   this.yearName + " (Tk.)",
  //   "Previous Year (Tk.)",
  // ];

  apiUrl = "";
  bodyData: any = [];
  bodyDataCollection: any = [];
  bodyDataPayment: any = [];
  params = [];

  parties = [];
  branchs = [];
  companyId: number = 0;

  showbody: boolean = false;
  partySelected: any = {};
  branchSelected: any = {};
  productSpecSelected: any = {};

  TotalReceived = 0;
  TotalPayment = 0;
  fDate: Date;
  tDate: Date;

  showDateRange: boolean = false;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private miscellaneousItemService: MiscellaneousItemService,
    private salesinvoiceService: SalesinvoiceService,
    private salesreturnService: SalesreturnService,
    private productrequisitionService: ProductrequisitionService,
    private sanitizer: DomSanitizer,
  ) {
    this.fDate = this.commonService.GetFirstDateOfMonth(new Date()); //(this.commonService.GetAnyMonthAndDateOfYear(12, 1));
    this.tDate = new Date();
    this.depotSelected = null;
    this.territorySelected = null;
    this.partySelected = null;
    this.getAllDropdown();
  }

  ngOnInit(): void { }
  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.toastrService.info("Preview not available", "Message");
      return false;
      //this.onPreview();
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
    debugger;

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    if (this.miscTypeSelected == (undefined || null)) {
      this.toastrService.warning('Please select a Misc. Type', 'info');
      return;
    }

    let depotCode = (this.depotSelected == undefined || this.depotSelected == null) ? '' : this.depotSelected["id"];
    if (depotCode === '') {
      this.toastrService.warning("Please select a depot.", 'Msg');
      return;
    }

    let miscTypeId = (this.miscTypeSelected == undefined || this.miscTypeSelected == null) ? 0 : this.miscTypeSelected["id"];
    // let territoryCode = this.territorySelected == (undefined || null) ? '' : this.territorySelected["id"];
    // let partyId = this.partySelected == (undefined || null) ? '0' : this.partySelected["id"];
    let productId = (this.productSpecSelected == undefined || this.productSpecSelected == null) ? '0' : this.productSpecSelected["id"];


    this.apiUrl = `SalesInvoiceReport/GetMiscellaneousStockDetailsReportDepotByType?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&miscTypeId=${miscTypeId}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&depotCode=${depotCode}&productId=${productId}`;

    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }
  base64Pdf: any;
  private getReportData() {

    let userInfo = this.commonService.GetUserProfileJson();

    let depotCode = (this.depotSelected == undefined || this.depotSelected == null) ? '' : this.depotSelected["id"];
    if (depotCode == '') {
      this.toastrService.warning("Please select a depot.", 'Msg');
      return;
    }

    let miscTypeId = (this.miscTypeSelected == undefined || this.miscTypeSelected == null) ? 0 : this.miscTypeSelected["id"];
    // let territoryCode = this.territorySelected == (undefined || null) ? '' : this.territorySelected["id"];
    // let partyId = this.partySelected == (undefined || null) ? '0' : this.partySelected["id"];
    let productId = (this.productSpecSelected == undefined || this.productSpecSelected == null) ? '0' : this.productSpecSelected["id"];

    this.apiUrl = `SalesInvoiceReport/GetMiscellaneousReportDepotByType?reportFormat=Pdf&userId=${userInfo[0].employeeid}&miscTypeId=${miscTypeId}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&depotCode=${depotCode}&productId=${productId}`;

    debugger;
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

  public setParam() {
    this.params = [];
    this.params.push({
      leftLabel: "Customer Name",
      leftValue: this.partySelected.name,
    });
  }


  public onCheckboxChange(e) {
    if (e.target.checked) {
      this.showDateRange = true;
    } else {
      this.showDateRange = false;
    }
  }

  public getAllDropdown() {
    debugger;
    this.getAllProductForRequisition();
    this.GetAllDepo();
    //this.GetAllPartysByTypeId(0);
    this.getTypeList();
  }

  productWiseSpecificationId: number = 0;
  productSpecList = [];
  public getAllProductForRequisition() {
    this.productWiseSpecificationId = 0;
    this.productSpecSelected = null;
    this.productSpecList = [];
    this.productrequisitionService
      .getAllProductForRequisition()
      .subscribe((returns: any) => {
        this.productSpecList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uomId: val.uomId,
          uomName: val.uomName,
          productId: val.productId,
          price: val.price,
          tradePrice: val.tradePrice,
          unitVat: val.unitVat,
        }));
      });
  }


  miscTypeSelected: {}
  typeList: any[] = [];
  customizedTypeList: any[] = [];
  getTypeList() {
    this.typeList = [];
    this.miscTypeSelected = null;
    /*
        this.typeList = [
          { id: 1, name: 'Damage' },
          //{ id: 2, name: 'Demo' },
          { id: 3, name: 'Sample' },
          // { id: 4, name: 'TD' },
          // { id: 5, name: 'TR' },
          { id: 6, name: 'Depot Expired' },
          { id: 7, name: 'Quarantine In' },
          { id: 8, name: 'Quarantine Out' },
          { id: 9, name: 'Sample Return' },
          { id: 10, name: 'Write In' },
          { id: 11, name: 'Write Off' },
        ]
     */
    this.customizedTypeList = [];
    this.typeList.push({
      id: 12,
      name: 'Market Expired'
    });
    this.miscellaneousItemService
      .GetAllMiscellaneousType('').pipe(first())
      .subscribe((data: any) => {
        debugger
        if (data.success) {
          for (let i = 0; i < data.data.length; i++) {
            debugger
            if (data.data[i].name === 'Damage' || data.data[i].name === 'Depot Expired' || data.data[i].name === 'Re-Pack / Re-Work (Transfer)') {
              this.typeList.push(data.data[i]);
            }
          }
          this.typeList = this.typeList.map((val: any) => ({
            id: val.id,
            name: val.name
          }));
        }

      });

  }

  depotList: any[];
  depotSelected: any = {};
  public GetAllDepo() {
    this.depotSelected = null;

    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetAllDepot`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.depotList = returns.data.map((val: any) => ({
          id: val.depotCode,
          name: val.depotName,
        }));
        let obj = {
          id: 0,
          name: 'National'
        }
        this.depotList.unshift(obj);

        //if (this.depotList.length > 0) {
        if (this.depotList.length == 1) {
          this.depotSelected = { id: this.depotList[0].id, name: this.depotList[0].name };
          this.depotCode = this.depotList[0].id;
          this.getAllTerritory(this.depotCode);
        }
        //}
      }
    })
  }

  getAllTerritory(depotCode: any = '') {
    this.territoryList = [];
    this.territorySelected = null;
    this.salesinvoiceService.GetAllTerritoryForDepot(depotCode).subscribe((returns: any) => {
      if (returns.success) {
        this.territoryList = returns.data.map((val: any) => ({
          id: val.TerritoryCode,
          name: val.TerritoryName,
        }));
      }
    });
  }



  GetPartyByTerritoryCode(territoryCode: any) {
    this.partyId = 0;
    this.partyList = [];
    this.partySelected = null;

    this.salesinvoiceService
      .GetPartyByTerritoryCode(territoryCode, this.depotCode)
      .subscribe((returns: any) => {
        this.parties = returns.data.map((val: any) => ({
          id: val.partyId,
          name: val.partyName,
          address: val.address,
          mobileNo: val.mobileNo,
          territoryDetails: val.territoryDetails,
        }));
      });
  }

  public partyList = [];
  public GetAllPartysByTypeId(partyTypeId: any) {
    this.comboService
      .GetAllPartysByTypeId(partyTypeId)
      .subscribe((returns: any) => {
        this.parties = returns.data.map((val: any) => ({
          id: val.partyId,
          name: val.partyName,
          address: val.address,
          mobileNo: val.mobileNo,
          territoryDetails: val.territoryDetails,
        }));
      });
  }

  totalInvoiceAmt = 0.00;
  totalReturnAmt = 0.00;
  //totalReturnAmt = 0.00;

  totalCollection = 0.00;
  totalDiscount = 0.00;
  totalOthers = 0.00;
  totalGrossRet = 0.00;

  totalDues = 0.00;
  totalNetCollectionAmt = 0.00;
  ttlIncentiveAmount = 0.00;
  totalBalance = 0.00;

  openingBalance = 0.00;
  closingBalance = 0.00;
  ttlOpeningBalance = 0.00;
  totalclosingBalance = 0.00;
  partyId = 0;

  private getReportData_old() {
    debugger;
    this.bodyData = [];
    this.totalReturnAmt = 0.00;

    let depotCode = this.depotSelected == (undefined || null) ? '' : this.depotSelected["id"];
    let territoryCode = this.territorySelected == (undefined || null) ? '' : this.territorySelected["id"];
    let partyId = this.partySelected == (undefined || null) ? '0' : this.partySelected["id"];

    this.apiUrl = "";
    this.apiUrl = `SalesReturn/GetSalesGrossReturnSummary?masterId=${0}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&depotCode=${depotCode}&territoryCode=${territoryCode}&partyId=${partyId}`;
    debugger;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {

        this.bodyData = returns.data;
        this.bodyData.forEach(a => {
          this.totalReturnAmt += parseFloat(a.totalAmount ?? 0);
        });
        this.totalReturnAmt = this.commonService.roundWithDecimalPoint(this.totalReturnAmt, 0);
        // alert(this.totalReturnAmt);
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }
    });
  }

  master: {} = {};
  lstInvoiceDetails: any[] = [];
  lstDetailsViewModel: any[] = [];
  ttlCollectionAmount: number = 0;
  NetTotalPrice: number = 0;

  totalInvoice = 0;
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

  currencyFormatter(currency) {
    return this.commonService.roundWithDecimalPoint(currency, 0);
  }

  getReportById(masterId: number) {

    this.apiUrl = "";
    let userInfo = this.commonService.GetUserProfileJson();
    this.apiUrl = `SalesInvoiceReport/GetMiscellaneousReportDepotById?reportFormat=Pdf&userId=${userInfo[0].employeeid}&miscellaneousItemId=${masterId}`;
    console.log('apiUrl: ', this.apiUrl);
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }

}
