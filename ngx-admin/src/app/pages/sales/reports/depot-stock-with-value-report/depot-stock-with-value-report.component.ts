import { Component, OnInit } from "@angular/core";
// import { FormControl } from "@angular/forms";
import { NbToastrService, NbDatepickerModule } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";

// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import { SalesinvoiceService } from "app/services/sales/salesinvoice.service";
import { StockinwithoutpoService } from "app/services/inventory/Stockinwithoutpo.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'ngx-depot-stock-with-value-report',
  templateUrl: './depot-stock-with-value-report.component.html',
  styleUrls: ['./depot-stock-with-value-report.component.scss']
})
export class DepotStockWithValueReportComponent implements OnInit {

  //date = new Date().getFullYear();
  fromdateSelected = new Date();
  todateSelected = new Date();
  territorySelected: any = {};
  territoryList: any[]
  territoryCode: any = "";
  depotCode: any = "";
  partyId: any = 0;

  // yearName = this.date;
  // prevYearName = this.date - 1;

  pageNavigation = "Depot Wise Stock with Value Report";

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
  partySelected: any;
  branchSelected: any;

  TotalReceived = 0;
  TotalPayment = 0;
  fDate: Date;
  tDate: Date;
  cUpToDate: Date;
  isOverDues: boolean = false;
  showDateRange: boolean = false;

  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private salesinvoiceService: SalesinvoiceService,
    private StockinwithoutpoService: StockinwithoutpoService,
    private sanitizer: DomSanitizer,
  ) {
    this.fDate = new Date(); //(this.commonService.GetAnyMonthAndDateOfYear(12, 1));
    this.tDate = new Date();
    this.cUpToDate = new Date();
    this.isOverDues = false;
    //this.onRefresh();
    this.getAllDropdown();
  }

  ngOnInit(): void { }
  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      //this.generateReport("pdf");
      this.generateCrReport("pdf");
    } else if (clicked == "print") {
      this.generateCrReport("pdf");
    } else if (clicked == "csv") {
      //this.onExportCSV();
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
    //console.log("userInfo[0].employeeid", userInfo[0].employeeid);
    this.apiUrl = `SalesInvoiceReport/GetDepotStockWithValueReport?reportFormat=${reportFormat}&userId=${userInfo[0].employeeid}&depotCode=${this.depotCode}&productWiseSpecificationId=${this.productWiseSpecificationId}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}`;

    //console.log(this.apiUrl);
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      if (res.status) {
        this.commonService.GenerateBase64ToReport(res.data[0].data);
      } else {
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
    this.GetAllDepo();
    this.getAllProductSpecification(0);
    //this.GetAllPartysByTypeId(0);
  }
  productWiseSpecificationId = 0;
  productspecificationSelected = {};
  public ProductSpecificationList = [];
  public getAllProductSpecification(productId) {
    this.productspecificationSelected = {};
    this.StockinwithoutpoService.getAllProductSpecification(productId).subscribe((returns: any) => {
      this.ProductSpecificationList = returns.data.map((val) => ({
        id: val.productWiseSpecificationId,
        name: val.productName,
      }));
    });
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

        //if (this.depotList.length > 0) {
        if (this.depotList.length == 1) {
          this.depotSelected = { id: this.depotList[0].id, name: this.depotList[0].name };
          this.depotCode = this.depotList[0].id;

          //this.getAllTerritory(this.depotCode);
        }
        //}
      }
    })
  }

  getAllTerritory(depotCode: any = '') {
    this.territoryList = [];
    this.territoryCode = "";
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

  ttlObsAmonutSum = 0.00;
  rffPcsQtySum = 0.00;
  srPcsQtySum = 0.00;
  adgCtnQtySum = 0.00;
  adgPcsQtySum = 0.00;
  rfdPcsQtySum = 0.00;
  rtfPcsQtySum = 0.00;
  salesPcsQtySum = 0.00;
  bonusPcsQtySum = 0.00;
  sadlPcsQtySum = 0.00;
  ttdPcsQtySum = 0.00;
  ttlClosingAmonutSum = 0.00;

  private getReportData_bak() {
    debugger;
    this.apiUrl = "";
    this.apiUrl = `SalesCollection/GetDepotStockReportData?depotCode=${this.depotCode}&productWiseSpecificationId=${this.productWiseSpecificationId}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}`;

    this.bodyData = [];
    this.bodyDataCollection = [];

    this.ttlObsAmonutSum = 0.00;
    this.rffPcsQtySum = 0.00;
    this.srPcsQtySum = 0.00;
    this.adgCtnQtySum = 0.00;
    this.adgPcsQtySum = 0.00;
    this.rfdPcsQtySum = 0.00;
    this.rtfPcsQtySum = 0.00;
    this.salesPcsQtySum = 0.00;
    this.bonusPcsQtySum = 0.00;
    this.sadlPcsQtySum = 0.00;
    this.ttdPcsQtySum = 0.00;
    this.ttlClosingAmonutSum = 0.00;

    this.commonService.getReportData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.bodyData = returns.data;
      } else {
        this.toastrService.danger("Message", this.commonService.nodatafound);
      }

      //this.openingBalance = this.bodyData.length > 0 ? this.bodyData[0].obAmount : 0.00;

      this.bodyData.forEach(a => {
        //this.ttlOpeningBalance += parseFloat(a.openingBalance);
        this.ttlObsAmonutSum += parseFloat(a.ttlObsAmonut);
        this.rffPcsQtySum += parseFloat(a.rffPcsQty);
        this.srPcsQtySum += parseFloat(a.srPcsQty);
        this.adgCtnQtySum += parseFloat(a.adgCtnQty);
        this.adgPcsQtySum += parseFloat(a.adgPcsQty);
        this.rfdPcsQtySum += parseFloat(a.rfdPcsQty);
        this.rtfPcsQtySum += parseFloat(a.rtfPcsQty);
        this.salesPcsQtySum += parseFloat(a.salesPcsQty);
        this.bonusPcsQtySum += parseFloat(a.bonusPcsQty);
        this.sadlPcsQtySum += parseFloat(a.sadlPcsQty);
        this.ttdPcsQtySum += parseFloat(a.ttdPcsQty);
        this.ttlClosingAmonutSum += parseFloat(a.ttlClosingAmonut);
      });

      // this.totalDues = this.openingBalance + this.totalNetSalesAmt;
      // this.closingBalance = this.totalDues - this.totalNetCollectionAmt;
    });
  }


  base64Pdf: any;
  private getReportData() {

    let userInfo = this.commonService.GetUserProfileJson();
    //console.log("userInfo[0].employeeid", userInfo[0].employeeid);
    this.apiUrl = `SalesInvoiceReport/GetDepotStockWithValueReport?reportFormat=Pdf&userId=${userInfo[0].employeeid}&depotCode=${this.depotCode}&productWiseSpecificationId=${this.productWiseSpecificationId}&fDate=${this.commonService.DateFormat(this.fDate)}&tDate=${this.commonService.DateFormat(this.tDate)}`;

    debugger;
    this.commonService.GetCrystalReportData(this.apiUrl).subscribe((returns: any) => {
      let res = JSON.parse(returns);
      //console.log(res);
      if (res.status) {
        this.base64Pdf = this.sanitizer.bypassSecurityTrustResourceUrl(res.data[0].data);
        //this.commonService.GenerateBase64ToReport(returns);
      }
      else {
        console.log(res.message);
        this.toastrService.warning("Message", this.commonService.nodatafound);
      }
    });
  }


  totalInvoice = 0;

  private onRefresh() {
    this.partySelected = null;
    //this.branchSelected = null;
    this.fDate = new Date();
    this.tDate = new Date();
    //this.companyId = 0;
    this.bodyData = [];
    //this.bodyDataCollection = [];
    //this.bodyDataPayment = [];
    this.showbody = false;


    this.territorySelected = {};
    this.territoryList = [];
    this.territoryCode = "";
    this.depotCode = "";
    this.partyId = 0;
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
}