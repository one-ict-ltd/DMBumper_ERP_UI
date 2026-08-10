import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { CommonService } from 'app/@core/mock/common.service';
import { ProductrequisitionService } from 'app/pages/purchase/settings/productrequisition.service';
import { SalesinvoiceService } from 'app/services/sales/salesinvoice.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ngx-product-wise-sales-dues',
  templateUrl: './product-wise-sales-dues.component.html',
  styleUrls: ['./product-wise-sales-dues.component.scss']
})
export class ProductWiseSalesDuesComponent implements OnInit {

  fromdateSelected = new Date();
  todateSelected = new Date();
  territorySelected: any = {};
  territoryList: any[]
  territoryCode: any = "";
  depotCode: any = "";
  partyId: any = 0;
  productWiseSpecificationId: any = 0;


  pageNavigation = "Product Wise Sales & Dues Details";


  apiUrl = "";
  bodyData: any = [];
  bodyDataCollection: any = [];
  bodyDataPayment: any = [];
  params = [];

  parties = [];
  branchs = [];
  productSpecList = [];
  companyId: number = 0;

  showbody: boolean = false;
  partySelected: any;
  productSelected: any;
  branchSelected: any;

  TotalReceived = 0;
  TotalPayment = 0;
  fDate: Date;
  tDate: Date;
  cUpToDate: Date;
  isOverDues: boolean = false;
  showDateRange: boolean = false;


  totalInvoiceAmt = 0.00;
  totalReturnAmt = 0.00;
  totalNetSalesAmt = 0.00;

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

  totalInvoice = 0;

  depotList: any[];
  depotSelected = {};

  partyList = [];

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private salesinvoiceService: SalesinvoiceService,
    private productrequisitionService: ProductrequisitionService,
  ) { }

  ngOnInit(): void {
    this.fDate = new Date(); //(this.commonService.GetAnyMonthAndDateOfYear(12, 1));
    this.tDate = new Date();
    this.cUpToDate = new Date();
    this.getAllDropdown()
  }

  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview" && this.validation()) {
      this.onPreview();
    } else if (clicked == "pdf" && this.validation()) {
      //this.generateReport("pdf");
      this.generateCrReport("pdf");
    } else if (clicked == "print" && this.validation()) {
      this.generateCrReport("pdf");
    } else if (clicked == "csv" && this.validation()) {
      //this.onExportCSV();
      this.generateCrReport("Excel");
    } else if (clicked == "refresh") {
      this.onRefresh();
    } else if (clicked == "email") {
      this.onEmail();
    } else {
      //this.toastrService.warning("Message", "please clicked any button");
    }
  }


  generateCrReport(reportFormat: any) {
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.apiUrl = "";
      let userInfo = this.commonService.GetUserProfileJson();
      this.apiUrl = `SalesInvoiceReport/GetProductWiseSalesDues?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&depotCode=${this.depotCode}&territoryCode=${this.territoryCode}&partyId=${this.partyId}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&cUpToDate=${this.commonService.DateFormat(this.cUpToDate)}&isOverDues=${this.isOverDues}&productWiseSpecificationId=${this.productWiseSpecificationId}`;

      //this.commonService.ConsoleLog(this.apiUrl);

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
      // Handle invalid date scenario (e.g., show error message)
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


  private onPreview() {
    const fromDate = this.fDate;
    const toDate = this.tDate;
    if (this.commonService.validateDates(fromDate, toDate)) {
      this.getReportData();
      this.showbody = true;
    }
    else {
      // Handle invalid date scenario (e.g., show error message)
      alert('To Date cannot be earlier than From Date.');
    }
  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }

  private onRefresh() {
    this.partySelected = null;
    this.fDate = new Date();
    this.tDate = new Date();
    this.bodyData = [];
    this.showbody = false;


    this.territorySelected = {};
    this.territoryList = [];
    this.territoryCode = "";
    this.depotCode = "";

    this.partyId = 0;
    this.productWiseSpecificationId = 0;
  }


  validation(): boolean {
    debugger;
    if (Object.keys(this.depotSelected).length === 0) {
      this.toastrService.warning("Please select a Depot!", "Message");
      return false;
    }
    else if (Object.keys(this.territorySelected).length === 0) {
      this.toastrService.warning("Please select a Territory!", "Message");
      return false;
    }
    else if (Object.keys(this.productSelected).length === 0) {
      this.toastrService.warning("Please select a Product!", "Message");
      return false;
    }

    return true;
  }


  private getReportData() {
    this.apiUrl = "";
    this.apiUrl = `SalesCollection/GetProductWiseSalesDues?depotCode=${this.depotCode}&territoryCode=${this.territoryCode}&partyId=${this.partyId}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}&cUpToDate=${this.commonService.DateFormat(this.cUpToDate)}&isOverDues=${this.isOverDues}&productWiseSpecificationId=${this.productWiseSpecificationId}`;

    this.bodyData = [];
    this.bodyDataCollection = [];

    this.totalInvoiceAmt = 0.00;
    this.totalReturnAmt = 0.00;
    this.totalNetSalesAmt = 0.00;
    this.totalCollection = 0.00;
    this.totalDiscount = 0.00;
    this.totalOthers = 0.00;
    this.totalGrossRet = 0.00;
    this.totalNetCollectionAmt = 0.00;
    this.ttlIncentiveAmount = 0.00;
    this.totalDues = 0.00;
    this.openingBalance = 0.00;
    this.ttlOpeningBalance = 0.00;
    this.closingBalance = 0.00;
    this.totalclosingBalance = 0.00;

    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }

      // this.openingBalance = this.bodyData.length > 0 ? this.bodyData[0].obAmount : 0.00;

      // this.bodyData.forEach(a => {
      //   //this.ttlOpeningBalance += parseFloat(a.openingBalance);
      //   this.totalInvoiceAmt += parseFloat(a.invoiceAmount);
      //   this.totalReturnAmt += parseFloat(a.returnAmount);
      //   this.totalNetSalesAmt += parseFloat(a.netSalesAmount);

      //   this.totalCollection += parseFloat(a.collectionAmount);
      //   this.totalDiscount += parseFloat(a.discountAmount);
      //   this.ttlIncentiveAmount += parseFloat(a.incentiveAmount);
      //   this.totalGrossRet += parseFloat(a.grossRetAmount);
      //   this.totalOthers += parseFloat(a.othersAmount);
      //   this.totalNetCollectionAmt += parseFloat(a.totalCollection);

      //   this.totalclosingBalance += parseFloat(a.closingBalance);
      // });

      // this.totalDues = this.openingBalance + this.totalNetSalesAmt;
      // this.closingBalance = this.totalDues - this.totalNetCollectionAmt;
    });
  }


  getAllTerritory(depotCode: any = '') {
    this.territoryList = [];
    this.territoryCode = "";
    this.territorySelected = {};
    this.parties = [];
    this.partyId = "";
    this.partySelected = {};
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

        if (this.depotList.length == 1) {
          this.depotSelected = { id: this.depotList[0].id, name: this.depotList[0].name };
          this.depotCode = this.depotList[0].id;
          this.getAllTerritory(this.depotCode);
        }
      }
    })
  }

  public getAllDropdown() {
    this.GetAllDepo();
    this.getAllProduct();
  }

  public getAllProduct() {
    this.productrequisitionService
      .getAllProductForRequisition()
      .pipe(take(1))
      .subscribe((returns: any) => {
        this.productSpecList = returns.data.map((val: any) => ({
          id: val.productWiseSpecificationId,
          name: val.productName,
          uomId: val.uomId,
          uomName: val.uomName,
          productId: val.productId,
          price: val.price,
        }));
      });
  }
  currencyFormatter(currency) {
    return this.commonService.roundWithDecimalPoint(currency, 0);
  }

}
