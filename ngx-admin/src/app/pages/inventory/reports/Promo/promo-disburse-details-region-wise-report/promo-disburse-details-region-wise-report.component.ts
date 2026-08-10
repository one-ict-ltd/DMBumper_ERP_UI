import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "app/@core/mock/common.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { SalesreturnService } from "app/services/sales/salesreturn.service";

@Component({
  selector: 'ngx-promo-disburse-details-region-wise-report',
  templateUrl: './promo-disburse-details-region-wise-report.component.html',
  styleUrls: ['./promo-disburse-details-region-wise-report.component.scss']
})
export class PromoDisburseDetailsRegionWiseReportComponent implements OnInit {

  fromdateSelected = new Date();
  todateSelected = new Date();
  territorySelected: any = {};
  territoryList: any[]
  territoryCode: any = "";
  depotCode: any = "";

  pageNavigation = "Promo Disburse Details Report Region Wise";
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

  TotalReceived = 0;
  TotalPayment = 0;
  fDate: Date;
  tDate: Date;
  monthList: any = [{ "id": "1", "name": "January" }, { "id": "2", "name": "February" }, { "id": "3", "name": "March" }, { "id": "4", "name": "April" }, { "id": "5", "name": "May" }, { "id": "6", "name": "June" },
  { "id": "7", "name": "July" }, { "id": "8", "name": "August" }, { "id": "9", "name": "September" }, { "id": "10", "name": "October" }, { "id": "11", "name": "November" }, { "id": "12", "name": "December" }
  ];
  monthSelected: any = {};
  monthOrder: number = 0;
  year: number = new Date().getFullYear();

  showDateRange: boolean = false;

  regionSelected: any = {};
  regionCode: string = '';

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private salesinvoiceService: SalesinvoiceService,
    private salesreturnService: SalesreturnService,
  ) {
    this.fDate = new Date();
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
      this.toastrService.info('Please click PDF/Print/Excel', 'Message');
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
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.year == 0 || this.year == null || this.year == undefined) {
      this.toastrService.danger("Please enter year.", "Message");
      return;
    }
    if (this.monthSelected == undefined || this.monthSelected == null || this.monthSelected["id"] == undefined || this.monthSelected["id"] == null) {
      this.toastrService.danger("Please select month.", "Message");
      return;
    }
    if (this.commonService.validateDates(fromDate, toDate)) {

      this.apiUrl = "";
      let userInfo = this.commonService.GetUserProfileJson();


      let regionCode = this.regionSelected == undefined || this.regionSelected == null ? 'NULL' : this.regionSelected["id"];
      let productId = this.brandSelected == undefined || this.brandSelected == null ? 0 : this.brandSelected["id"];
      if (regionCode == undefined) {
        regionCode = null;
      }
      if (productId == undefined) {
        productId = 0;
      }
      // let partyId = this.partySelected == (undefined || null) ? '0' : this.partySelected["id"];


      this.apiUrl = `PromoReport/PromoDisburseDetailsReportRegionWise?userId=${userInfo[0].employeeid}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&regionCode=${regionCode}&productId=${productId}&reportFormat=${reportFormat}`;

      this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
        let res = JSON.parse(returns);
        if (res.status) {
          this.commonService.GenerateBase64ToReport(res.data[0].data);
        } else {
          this.toastrService.warning("Message", this.commonService.nodatafound);
        }
      });
    }
    else {
      alert('To Date cannot be earlier than From Date.');
    }
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
    this.GetAllDepo();
    this.getAllRegion();
    this.getAllBrand();
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
        if (this.depotList.length == 1) {
          this.depotSelected = { id: this.depotList[0].id, name: this.depotList[0].name };
          this.depotCode = this.depotList[0].id;
          this.getAllTerritory(this.depotCode);
        }
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
  regionList: any = [];
  getAllRegion() {
    this.regionList = null;
    let apiUrl = "ERPCompany/getRegion?RegionID=0";
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.regionList = returns.data.map((r: any) => ({
          id: r.Code,
          name: r.Name
        }));
      }
    })
  }
  brandList: any = [];
  productId: number = 0;
  brandSelected: any = {};
  getAllBrand() {
    this.brandList = null;
    let apiUrl = "Product/getBrandByProductCategory?productCategoryId=17";
    this.commonService.getApiData(apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.brandList = returns.data.map((b: any) => ({
          id: b.productId,
          name: b.productName
        }));
      }
    })
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

  private getReportData() {
    debugger;
    this.bodyData = [];
    this.totalReturnAmt = 0.00;

    let depotCode = this.depotSelected == undefined || this.depotSelected == null ? '' : this.depotSelected["id"];
    let territoryCode = this.territorySelected == undefined || this.territorySelected == null ? '' : this.territorySelected["id"];
    let partyId = this.partySelected == undefined || this.partySelected == null ? '0' : this.partySelected["id"];

    this.apiUrl = "";
    this.apiUrl = `Promo/PromoDisburseDetailsReport?fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&depotCode=${depotCode}&territoryCode=${territoryCode}`;
    // this.apiUrl = `SalesReturn/GetSalesGrossReturnSummary?masterId=${0}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&depotCode=${depotCode}&territoryCode=${territoryCode}&partyId=${partyId}`;
    debugger;
    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {

        this.bodyData = returns.data;
        this.bodyData.forEach(a => {
          this.totalReturnAmt += parseFloat(a.totalAmount ?? 0);
        });
        this.totalReturnAmt = this.commonService.roundWithDecimalPoint(this.totalReturnAmt, 0);
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

  private getGrossReturnReportData(index: number, masterId: number) {
    debugger;

    this.ttlCollectionAmount = 0;
    this.NetTotalPrice = 0;

    this.master = {};
    this.lstInvoiceDetails = [];
    this.lstDetailsViewModel = [];

    this.master = this.bodyData[index];


    this.salesinvoiceService
      .GetSalesGrossReturnDetailsInvoiceByMasterId(masterId, this.bodyData[index].partyId)
      .subscribe((returns: any) => {
        if (returns.success) {
          this.lstInvoiceDetails = returns.data;

          this.lstInvoiceDetails.forEach(a => {
            this.ttlCollectionAmount += parseFloat(a.collectionAmount ?? 0);
          });

        }
      });


    this.salesreturnService
      .GetSalesGrossReturnDetailsProductByMasterId(masterId)
      .subscribe((data: any) => {
        if (data.success) {
          this.lstDetailsViewModel = data.data;

          this.lstDetailsViewModel.forEach(a => {
            this.NetTotalPrice += parseFloat(a.totalPrice ?? 0);
          });
        }
      });

    var fileName = this.pageNavigation + ".pdf";
    const content = document.getElementById("reportHeader");
    this.commonService.generateGrosReturnReportPdf("print", fileName, content, this.lstDetailsViewModel.length);
  }

  totalInvoice = 0;
  private onRefresh() {
    window.location.reload();
  }

  private onPreview() {
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.commonService.validateDates(fromDate, toDate)) {

      this.getReportData();
      this.showbody = true;
    }
    else {
      alert('To Date cannot be earlier than From Date.');
    }
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  currencyFormatter(currency) {
    return this.commonService.roundWithDecimalPoint(currency, 0);
  }
  getDateRange(monthOrder: number) {
    if (this.year == 0 || this.year == null || this.year == undefined) {
      this.toastrService.danger("Please enter a valid year!", "Message");
      return;
    }
    if (monthOrder < 1 || monthOrder > 12) {
      this.toastrService.danger("Invalid month order. It should be between 1 and 12.", "Message");
      return;
    }
    this.fDate = new Date(this.year, monthOrder - 1, 1);
    this.tDate = new Date(this.year, monthOrder, 0);

  }
}
